const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const { mkdirSync } = require('node:fs');
const assert = require('node:assert/strict');
mkdirSync('artifacts/social-links',{recursive:true});
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4321'],{stdio:'ignore'});
const base='http://127.0.0.1:4321';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){for(let i=0;i<50;i++){try{if((await fetch(base)).ok)return;}catch{}await sleep(360);}throw Error('Preview server did not respond');}
const profiles=[
 ['Instagram','https://www.instagram.com/universal_electronics_et/'],
 ['Facebook','https://web.facebook.com/profile.php?id=61577887168378'],
 ['TikTok','https://www.tiktok.com/@universal_electronics'],
 ['LinkedIn','https://www.linkedin.com/company/universal-electronics-et'],
];
(async()=>{
 try{
  await ready();const browser=await chromium.launch({headless:true});
  for (const spec of [{name:'desktop-1440',width:1440,height:900},{name:'tablet-768',width:768,height:1024},{name:'mobile-375',width:375,height:812}]) {
   const page=await browser.newPage({viewport:{width:spec.width,height:spec.height},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   for(const urlPath of ['/', '/contact/']){
     await page.goto(base+urlPath,{waitUntil:'domcontentloaded'});
     const socialRegion=page.locator(urlPath==='/'?'.ue-social-footer-list':'.ue-social-contact-grid');
     assert.ok(await socialRegion.isVisible(),'Social links are not visible at '+urlPath);
     assert.equal(await socialRegion.locator('a').count(),4,'Expected exactly four official social links');
     for(const [name,url] of profiles){
       const link=socialRegion.getByRole('link',{name:new RegExp(name,'i')});
       assert.equal(await link.getAttribute('href'),url,name+' destination mismatch');
       assert.equal(await link.getAttribute('target'),'_blank',name+' should open new tab');
       assert.ok((await link.getAttribute('rel')).includes('noopener'),name+' should have noopener');
       assert.equal(await link.locator('svg').count(),1,'Brand icon missing for '+name);
     }
     const vw=await page.evaluate(()=>document.documentElement.scrollWidth);
     assert.ok(vw<=spec.width+2,'Unexpected horizontal overflow '+spec.name+' '+urlPath+': '+vw);
     if(urlPath==='/contact/'){
       assert.ok(await page.locator('iframe[title*="Tefera Business Center"]').count()===1,'Original location map removed');
       await socialRegion.scrollIntoViewIfNeeded();
       await socialRegion.screenshot({path:'artifacts/social-links/social-'+spec.name+'.png'});
     }else {
       await page.locator('.ue-social-footer-list').scrollIntoViewIfNeeded();
       await page.locator('footer').screenshot({path:'artifacts/social-links/footer-'+spec.name+'.png'});
     }
   }
   if(errors.length)throw Error('Client errors: '+errors.join('\n'));
   console.log('PASS '+spec.name+' social links, brand icons, map, accessible names, no overflow');
   await page.close();
  }
  await browser.close();
 }finally{server.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
