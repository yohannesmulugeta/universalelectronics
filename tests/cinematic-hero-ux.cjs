const { chromium }=require('playwright');
const { spawn }=require('node:child_process');
const { mkdirSync }=require('node:fs');
const assert=require('node:assert/strict');
mkdirSync('artifacts/cinematic',{recursive:true});
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4321'],{stdio:'ignore'});
const base='http://127.0.0.1:4321';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){for(let i=0;i<50;i++){try{if((await fetch(base)).ok)return;}catch{}await wait(400);}throw Error('Preview server not ready');}
(async()=>{
 try{
  await ready();
  const browser=await chromium.launch({headless:true});
  for(const spec of [{name:'desktop-1440',width:1440,height:900},{name:'desktop-1280',width:1280,height:800},{name:'tablet-768',width:768,height:1024},{name:'mobile-375',width:375,height:812}]){
   const page=await browser.newPage({viewport:{width:spec.width,height:spec.height},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   assert.ok(await page.getByRole('heading',{name:/Power your world/}).isVisible(),'New hero heading missing');
   assert.ok(await page.locator('.ue-cinema-stage').isVisible(),'Cinematic hero stage missing');
   assert.equal(await page.locator('.ue-cinema-stage .ue-cinema-link').count(),2,'Solar and sound hero destinations needed');
   assert.ok(await page.locator('.ue-cinema-home-image').isVisible(),'House energy visual missing');
   assert.equal(await page.locator('.ue-cinema-video').count(),0,'No unlicensed video should load');
   assert.ok(await page.locator('#interactive-solutions-title').isVisible(),'Solutions section missing');
   assert.ok(await page.locator('#recognition-heading').isVisible(),'Recognition section missing');
   assert.ok(await page.locator('a[href="/shop/solar/"]').count()>0,'Solar CTA missing');
   assert.ok(await page.locator('a[href="/shop/sound/"]').count()>0,'Sound CTA missing');
   const width=await page.evaluate(()=>document.documentElement.scrollWidth);
   assert.ok(width<=spec.width+2,'Horizontal overflow on '+spec.name+': '+width+' > '+spec.width);
   await page.locator('.ue-cinema-stage').screenshot({path:'artifacts/cinematic/hero-'+spec.name+'.png'});
   await page.screenshot({path:'artifacts/cinematic/full-'+spec.name+'.png',fullPage:true});
   const broken=await page.locator('.ue-cinema-stage img').evaluateAll(imgs=>imgs.filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.getAttribute('src')));
   assert.deepEqual(broken,[],'Missing hero assets on '+spec.name);
   if(errors.length)throw Error('Browser errors '+errors.join('\n'));
   console.log('PASS '+spec.name+' hero and legacy sections');
   await page.close();
  }
  await browser.close();
 }finally{server.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
