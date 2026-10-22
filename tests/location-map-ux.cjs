const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
mkdirSync('artifacts/location-map',{recursive:true});
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4321'],{stdio:'ignore'});
const base='http://127.0.0.1:4321';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){for(let i=0;i<50;i++){try{if((await fetch(base)).ok)return;}catch{} await sleep(350);}throw Error('Preview not ready');}
(async()=>{
 try{
  await ready();
  const browser=await chromium.launch({headless:true});
  for(const spec of [{name:'desktop-1440',width:1440,height:900},{name:'tablet-768',width:768,height:1024},{name:'mobile-375',width:375,height:812}]){
   const page=await browser.newPage({viewport:{width:spec.width,height:spec.height},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   await page.goto(base+'/contact/',{waitUntil:'domcontentloaded'});
   const map=page.locator('iframe[title*="Tefera Building"]');
   assert.equal(await map.count(),1,'One map iframe expected');
   assert.ok((await map.getAttribute('src')).includes('2913981607394043387'),'Verified coordinates missing');
   assert.equal(await map.getAttribute('loading'),'lazy','Map must load lazily');
   const visit=page.locator('#visit-location-heading');
   await visit.scrollIntoViewIfNeeded();
   assert.ok(await visit.isVisible(),'Visit us heading missing');
   assert.ok(await page.getByText('ተፈራ ህንጻ', {exact:false}).count()>0,'Amharic address missing');
   assert.ok(await page.getByText('2PMV+VPP',{exact:false}).count()>0,'Correct building Plus Code missing');
   const directions=page.getByRole('link',{name:/Get directions to Tefera Building/});
   assert.ok((await directions.getAttribute('href')).includes('Tefera%20Business%20Center'),'Directions must target the exact building name');
   const exactLink=page.getByRole('link',{name:/Open the exact Tefera Business Center place/});
   assert.equal(await exactLink.getAttribute('href'),'https://maps.app.goo.gl/xUmBZS7HQ9JwpVcL9','Exact owner-supplied Google Maps share link missing');
   const footerLink=page.getByRole('link',{name:/View Tefera Building on Google Maps/});
   assert.equal(await footerLink.getAttribute('href'),'https://maps.app.goo.gl/xUmBZS7HQ9JwpVcL9','Footer must open the exact owner-provided map link');
   const width=await page.evaluate(()=>document.documentElement.scrollWidth);
   assert.ok(width<=spec.width+2, 'Horizontal overflow '+spec.name+' ('+width+' > '+spec.width+')');
   await page.locator('.ue-location-map-frame').screenshot({path:'artifacts/location-map/map-'+spec.name+'.png'});
   await page.screenshot({path:'artifacts/location-map/contact-'+spec.name+'.png',fullPage:true});
   if(errors.length)throw Error('Uncaught browser errors: '+errors.join('\n'));
   console.log('PASS '+spec.name+' bilingual map, directions, footer, and no overflow');
   await page.close();
  }
  await browser.close();
 }finally{server.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
