const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const {mkdirSync}=require('node:fs');
const assert=require('node:assert/strict');
mkdirSync('artifacts/immersive',{recursive:true});
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4321'],{stdio:'ignore'});
const base='http://127.0.0.1:4321';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){for(let i=0;i<50;i++){try{if((await fetch(base)).ok)return;}catch{}await wait(400);}throw Error('Preview server not ready');}
(async()=>{
try{
 await ready();const browser=await chromium.launch({headless:true});
 for(const spec of [{name:'desktop-1440',width:1440,height:900},{name:'desktop-1280',width:1280,height:800},{name:'tablet-768',width:768,height:1024},{name:'mobile-375',width:375,height:812}]){
   const page=await browser.newPage({viewport:{width:spec.width,height:spec.height},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   assert.ok(await page.getByRole('heading',{name:/Power when it matters/}).isVisible(),'New hero heading missing');
   assert.ok(await page.locator('.ue-immersive-frame').isVisible(),'Immersive hero missing');
   assert.equal(await page.locator('.ue-immersive-rail-link').count(),2,'Two destination rail links expected');
   assert.equal(await page.locator('.ue-immersive-sound-spotlight').count(),1,'Sound product feature missing');
   assert.ok(await page.locator('#interactive-solutions-title').isVisible(),'Existing solution accordion missing');
   assert.ok(await page.locator('#recognition-heading').isVisible(),'Recognition lost');
   assert.equal(await page.locator('.ue-immersive-poster').getAttribute('src'),'/assets/hero/universal-energy-poster.webp','Video poster missing');
   assert.equal(await page.locator('.ue-immersive-video').getAttribute('data-src'),'/assets/hero/universal-energy-loop.mp4','Video reference changed');
   const actual=await page.locator('.ue-immersive-video').evaluate(v=>({muted:v.muted,loop:v.loop,playsInline:v.playsInline}));
   assert.ok(actual.muted && actual.loop && actual.playsInline,'Muted looping inline video required');
   const vw=await page.evaluate(()=>document.documentElement.scrollWidth);
   assert.ok(vw<=spec.width+2,'Horizontal overflow '+spec.name+': '+vw);
   await page.locator('.ue-immersive-frame').scrollIntoViewIfNeeded();
   await page.waitForTimeout(1200);
   assert.equal(await page.locator('.ue-immersive-video').getAttribute('src'),'/assets/hero/universal-energy-loop.mp4','Video should load in viewport');
   const toggle=page.getByRole('button',{name:'Pause background video'});
   await toggle.click();
   assert.equal(await toggle.getAttribute('aria-pressed'),'true','Pause did not set aria-pressed');
   assert.ok(await page.getByRole('button',{name:'Play background video'}).isVisible(),'Play button did not appear');
   await page.getByRole('button',{name:'Play background video'}).click();
   await page.locator('.ue-immersive-frame').screenshot({path:'artifacts/immersive/hero-'+spec.name+'.png'});
   await page.screenshot({path:'artifacts/immersive/home-'+spec.name+'.png',fullPage:true});
   const broken=await page.locator('.ue-immersive-frame img').evaluateAll(imgs=>imgs.filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.src));
   assert.deepEqual(broken,[],'Hero assets failed on '+spec.name);
   if(errors.length)throw Error('Browser errors: '+errors.join('\n'));
   console.log('PASS '+spec.name+' video, product spotlight, rail, focus and motion toggle');
   await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto(base+'/',{waitUntil:'domcontentloaded'});
 assert.equal(await reduced.locator('.ue-immersive-video-toggle').isVisible(),false,'Motion toggle should not display with reduced motion');
 assert.equal(await reduced.locator('.ue-immersive-video').evaluate(v=>getComputedStyle(v).display),'none','Reduced motion must disable background video');
 await reduced.close();
 await browser.close();
}finally{server.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
