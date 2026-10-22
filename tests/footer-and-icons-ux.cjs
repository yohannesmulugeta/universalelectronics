const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const {mkdirSync}=require('node:fs');
const assert=require('node:assert/strict');
mkdirSync('artifacts/white-logo-icons',{recursive:true});
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4321'],{stdio:'ignore'});
const base='http://127.0.0.1:4321';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){for(let i=0;i<50;i++){try{if((await fetch(base)).ok)return;}catch{}await sleep(360);}throw Error('Preview server did not respond');}
(async()=>{
 try{
  await ready();
  const browser=await chromium.launch({headless:true});
  for(const spec of [
   {name:'desktop-1440',width:1440,height:900},
   {name:'desktop-1280',width:1280,height:800},
   {name:'tablet-768',width:768,height:1024},
   {name:'mobile-375',width:375,height:812}
  ]){
   const page=await browser.newPage({viewport:{width:spec.width,height:spec.height},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   await page.locator('.ue-category-quick-grid').scrollIntoViewIfNeeded();
   const items=page.locator('.ue-category-quick-grid .ue-category-quick');
   assert.equal(await items.count(),8,'Must have eight shortcut links');
   const types=['solar-panel','inverter','battery','water-pump','speaker','amplifier','microphone','mixer'];
   for(let i=0;i<8;i++){
     assert.equal(await items.nth(i).locator('svg').count(),1,'Shortcut '+types[i]+' lacks an icon');
     assert.equal(await items.nth(i).locator('[data-category-icon]').getAttribute('data-category-icon'),types[i],'Category icon mismatch');
     assert.equal(await items.nth(i).locator('svg path,svg rect,svg circle').count()>0,true,'Category icon shapes missing');
   }
   await page.locator('.ue-category-quick-grid').screenshot({path:'artifacts/white-logo-icons/categories-'+spec.name+'.png'});
   const footer=page.locator('footer');
   await footer.scrollIntoViewIfNeeded();
   const wordmark=footer.locator('.ue-footer-white-wordmark');
   assert.equal(await wordmark.count(),1,'White footer logo not rendered');
   assert.equal(await wordmark.locator('feColorMatrix').count(),1,'White ink transparency filter missing');
   const image=wordmark.locator('image');
   assert.equal(await image.count(),1,'Source logo silhouette image missing');
   assert.ok((await image.getAttribute('href')).includes('cropped-logo-uni'),'Original logo should be preserved');
   assert.equal(await footer.locator('a[aria-label="Universal Electronics home"] .bg-white').count(),0,'Footer logo still has white background');
   await footer.screenshot({path:'artifacts/white-logo-icons/footer-'+spec.name+'.png'});
   const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
   assert.ok(scrollWidth<=spec.width+2,'Unexpected horizontal overflow at '+spec.width+'px: '+scrollWidth);
   if(errors.length)throw Error('Browser errors: '+errors.join('\n'));
   console.log('PASS '+spec.name+': transparent white footer wordmark; eight product-specific icons; no overflow');
   await page.close();
  }
  await browser.close();
 }finally{server.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
