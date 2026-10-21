const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const {mkdirSync}=require('node:fs');
const assert=require('node:assert/strict');
mkdirSync('artifacts/interactive',{recursive:true});
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4321'],{stdio:'ignore'});
const base='http://127.0.0.1:4321';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function ready(){
 for(let i=0;i<60;i++){try{const r=await fetch(base);if(r.ok)return;}catch{} await sleep(350);}
 throw Error('Preview server not ready');
}
async function overflow(page,width,label){
 const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
 assert.ok(scrollWidth<=width+2,label+': unexpected overflow '+scrollWidth+'px, viewport '+width);
}
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
   await page.locator('#home-heading').waitFor();
   assert.equal(await page.locator('.ue-solution-panel').count(),4,'Four solution panels missing');
   assert.equal(await page.locator('.ue-category-quick').count(),8,'Category quick links missing');
   assert.ok(await page.locator('#recognition-heading').isVisible(),'Recognition removed');
   await overflow(page,spec.width,spec.name+' homepage');
   if(spec.width>=1024){
     const panels=page.locator('.ue-solution-panel');
     await panels.nth(3).hover();
     await page.waitForTimeout(850);
     assert.equal(await page.locator('[data-ue-accordion]').getAttribute('data-active'),'3','Hover did not activate sound panel');
     const wide=await panels.nth(3).boundingBox(),narrow=await panels.nth(0).boundingBox();
     assert.ok(wide.width>narrow.width*1.6,'Hovered panel must expand compared with inactive panel');
   }else{
     const clip=page.locator('.ue-solution-accordion');
     const canScroll=await clip.evaluate(el=>el.scrollWidth>el.clientWidth);
     assert.ok(canScroll,'Mobile/tablet solution carousel must scroll horizontally');
   }
   await page.screenshot({path:'artifacts/interactive/'+spec.name+'.png',fullPage:true});
   await page.goto(base+'/services/',{waitUntil:'domcontentloaded'});
   await overflow(page,spec.width,spec.name+' services');
   if(spec.name==='desktop-1440')await page.screenshot({path:'artifacts/interactive/services.png',fullPage:true});
   await page.goto(base+'/guides/',{waitUntil:'domcontentloaded'});
   assert.ok(await page.getByText('Plan before you choose.').isVisible(),'Guides absent');
   await page.goto(base+'/solutions/backup-power/',{waitUntil:'domcontentloaded'});
   assert.ok(await page.getByRole('heading',{name:'Backup Power',exact:true}).isVisible(),'Solution detail missing');
   await overflow(page,spec.width,spec.name+' solution detail');
   await page.goto(base+'/contact/?solution=Backup%20Power&interest=Solar%20equipment',{waitUntil:'domcontentloaded'});
   assert.ok((await page.locator('textarea[name="message"]').inputValue()).includes('Backup Power'),'Contextual enquiry not prefilled');
   const hint=page.locator('#contact-interest-hint');
   assert.ok((await hint.textContent()).includes('solar products'),'Enquiry hint not initialized');
   await page.locator('select[name="interest"]').selectOption('Sound equipment');
   assert.ok((await hint.textContent()).includes('venue'),'Relevant enquiry hint did not change');
   await overflow(page,spec.width,spec.name+' contact');
   if(spec.name==='desktop-1440')await page.screenshot({path:'artifacts/interactive/contact.png',fullPage:true});
   assert.ok(await page.locator('footer a[href="/guides/"]').isVisible(),'Footer guide link missing');
   if(errors.length)throw Error('Browser errors: '+errors.join('\n'));
   console.log('PASS '+spec.name+' layouts, hover, guides, detail pages, contact and footer');
   await page.close();
  }
  await browser.close();
 }finally{server.kill('SIGTERM');}
})().catch(e=>{console.error(e);process.exitCode=1;});
