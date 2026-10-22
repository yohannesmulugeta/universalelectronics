const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const {mkdirSync}=require('node:fs');
const assert=require('node:assert/strict');
mkdirSync('artifacts/immersive',{recursive:true});
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4321'],{stdio:'ignore'});
const base='http://127.0.0.1:4321';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){for(let i=0;i<35;i++){try{if((await fetch(base)).ok)return;}catch{}await sleep(400);}throw Error('Preview server not ready');}
let browser;
(async()=>{
try{
  await ready();
  browser=await chromium.launch({headless:true});
  for(const spec of [
    {name:'desktop-1440',width:1440,height:900},
    {name:'tablet-768',width:768,height:1024},
    {name:'mobile-375',width:375,height:812}
  ]){
    const page=await browser.newPage({viewport:{width:spec.width,height:spec.height},deviceScaleFactor:1});
    page.setDefaultTimeout(9000);
    await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:16000});
    console.log('Opened homepage '+spec.name);
    assert.ok(await page.locator('#home-heading').isVisible(),'Missing main headline');
    assert.ok((await page.locator('#home-heading').innerText()).includes('Power when'),'Incorrect hero copy');
    assert.equal(await page.locator('.ue-immersive-rail-link').count(),2,'Two category navigation links expected');
    assert.equal(await page.locator('.ue-immersive-sound-spotlight').count(),1,'Professional sound card missing');
    assert.equal(await page.locator('.ue-immersive-video').getAttribute('data-src'),'/assets/hero/universal-energy-loop.mp4','Video source changed');
    assert.equal(await page.locator('.ue-immersive-poster').getAttribute('src'),'/assets/hero/universal-energy-poster.webp','Video poster changed');
    assert.equal(await page.locator('a[href="/shop/solar/"]').count()>0,true,'Solar catalog CTA missing');
    assert.equal(await page.locator('a[href="/shop/sound/"]').count()>0,true,'Sound catalog CTA missing');
    assert.equal(await page.locator('#interactive-solutions-title').count(),1,'Existing solution section removed');
    const w=await page.evaluate(()=>document.documentElement.scrollWidth);
    assert.ok(w<=spec.width+2,'Horizontal overflow: '+w+' vs '+spec.width);
    const video=page.locator('.ue-immersive-video');
    const media=await video.evaluate(v=>({muted:v.muted,loop:v.loop,playsInline:v.playsInline}));
    assert.ok(media.muted&&media.loop&&media.playsInline,'Silent looping video behavior lost');
    const toggle=page.locator('[data-video-toggle]');
    assert.equal(await toggle.count(),1,'Pause control missing');
    await page.locator('.ue-immersive-frame').screenshot({path:'artifacts/immersive/hero-'+spec.name+'.png',animations:'disabled',timeout:14000});
    await page.close();
    console.log('PASS '+spec.name);
  }
  const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  reduced.setDefaultTimeout(9000);
  await reduced.goto(base+'/',{waitUntil:'domcontentloaded',timeout:16000});
  assert.equal(await reduced.locator('.ue-immersive-video').evaluate(v=>getComputedStyle(v).display),'none','Reduced-motion video must be hidden');
  console.log('PASS reduced motion');
  await reduced.close();
}finally {
  if(browser)await browser.close();
  server.kill('SIGTERM');
}
})().then(()=>process.exit(0)).catch(e=>{console.error(e);server.kill('SIGTERM');process.exit(1)});
