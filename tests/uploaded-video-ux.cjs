const { chromium }=require('playwright');
const { spawn }=require('node:child_process');
const { mkdirSync }=require('node:fs');
const assert=require('node:assert/strict');
mkdirSync('artifacts/video-upload',{recursive:true});
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4321'],{stdio:'ignore'});
const base='http://127.0.0.1:4321';
const pause=(ms)=>new Promise(r=>setTimeout(r,ms));
async function waitForServer(){for(let i=0;i<55;i++){try{if((await fetch(base)).ok)return;}catch{}await pause(300);}throw Error('Preview server not reachable');}
(async()=>{
 try {
  await waitForServer();
  const browser=await chromium.launch({headless:true});
  for(const spec of [{name:'desktop',width:1440,height:900},{name:'mobile',width:375,height:812}]){
   const page=await browser.newPage({viewport:{width:spec.width,height:spec.height}});
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   const vid=page.locator('video.ue-cinema-video');
   assert.equal(await vid.count(),1,'Expected one background hero video');
   assert.ok(await vid.evaluate(v=>v.autoplay&&v.muted&&v.loop&&v.playsInline),'Video must be autoplay, muted, looping and playsinline');
   const src=await page.locator('video.ue-cinema-video source').getAttribute('src');
   assert.equal(src,'/assets/hero/universal-energy-loop.mp4','Incorrect video src');
   const resp=await page.request.get(base+src);
   assert.equal(resp.status(),200,'Video file must be served');
   assert.ok((await resp.body()).length>=26000,'Incomplete MP4 asset');
   assert.ok(await page.locator('.ue-cinema-home-image').count()===1,'Fallback poster must stay available');
   const width=await page.evaluate(()=>document.documentElement.scrollWidth);
   assert.ok(width<=spec.width+2,'Unexpected horizontal overflow at '+spec.name+': '+width);
   await page.locator('.ue-cinema-stage').screenshot({path:'artifacts/video-upload/'+spec.name+'.png'});
   if(errors.length)throw Error('Browser errors '+errors.join('\n'));
   const reduced=await browser.newPage({viewport:{width:spec.width,height:spec.height},reducedMotion:'reduce'});
   await reduced.goto(base+'/',{waitUntil:'domcontentloaded'});
   assert.ok(await reduced.locator('.ue-cinema-home-image').count()===1,'Reduced-motion fallback required');
   await reduced.close();await page.close();
   console.log('PASS',spec.name,'muted video, fallback, reduced motion and layout');
  }
  await browser.close();
 }finally {server.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
