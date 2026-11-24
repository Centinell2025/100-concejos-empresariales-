const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const path=require('node:path');
(async()=>{
 const server=spawn('python3',['-u','-m','http.server','0','--bind','127.0.0.1','--directory',path.resolve(__dirname,'../dist')],{stdio:['ignore','pipe','pipe']});
 let browser;
 try{
  const [line]=await once(server.stdout,'data');const port=String(line).match(/port (\d+)/)[1],url='http://127.0.0.1:'+port;
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_BIN,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:375,height:812}}),page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'networkidle'});await page.locator('#enter-workspace').click();
  assert.match(await page.locator('#beacon-priorities').textContent(),/Record income received/);
  const fixture=await page.evaluate(()=>{
   const month=window.BeaconBusiness.getMonth();
   return {transactions:[{id:'income',date:month+'-01',type:'entryIncome',description:'Sample sale',category:'sales',amount:80000,notes:''},{id:'expense',date:month+'-02',type:'entryExpense',description:'Sample cost',category:'software',amount:30000,notes:''}],clients:[],projects:[{id:'p1',name:'Sample project',client:'',status:'inProgress',budget:900000,dueDate:'',notes:''}],tasks:[{id:'t1',name:'Sample task',project:'p1',dueDate:'2020-01-01',status:'pending',priority:'high',notes:''}],goals:{[month]:{income:100000,expenses:20000}}};
  });
  await page.evaluate(db=>{localStorage.setItem('beacon-management-v1',JSON.stringify(db));window.BeaconBusiness.replaceData(db)},fixture);
  assert.match(await page.locator('#beacon-priorities').textContent(),/\$200\.00 remaining/);
  assert.match(await page.locator('#beacon-priorities').textContent(),/\$100\.00 above/);
  assert.match(await page.locator('#beacon-priorities').textContent(),/1 overdue/);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  for(const [lang,title] of [['es','Tus próximas prioridades'],['it','Le tue prossime priorità'],['en','Your next priorities']]) {
   await page.locator('#language').selectOption(lang);assert.equal(await page.locator('#priorities-title').textContent(),title);
  }
  // A denied write must preserve both the in-memory ledger and the saved copy.
  await page.evaluate(()=>{window.originalStorageWrite=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='beacon-management-v1')throw new DOMException('Quota','QuotaExceededError');return window.originalStorageWrite.call(this,key,value)}});
  await page.locator('[data-business-page="tasks"]').click();
  await page.locator('[data-toggle-task="t1"]').click();
  assert.equal(await page.evaluate(()=>window.BeaconBusiness.getSnapshot().tasks[0].status),'pending');
  await page.locator('[data-delete="t1"]').click();
  assert.equal(await page.evaluate(()=>window.BeaconBusiness.getSnapshot().tasks.length),1);
  await page.locator('[data-business-page="transactions"]').click();
  await page.locator('[data-add="transactions"]').first().click();
  await page.locator('#record-form [name="description"]').fill('Unsaved sample');
  await page.locator('#record-form [name="amount"]').fill('50.00');
  await page.locator('#record-form [type="submit"]').click();
  assert(await page.locator('#record-dialog').evaluate(x=>x.open));
  assert.equal(await page.evaluate(()=>window.BeaconBusiness.getSnapshot().transactions.length),2);
  await page.locator('#record-cancel').click();
  await page.evaluate(()=>window.BeaconBusiness.go('reports'));
  await page.locator('#edit-goals').click();
  await page.locator('#goals-form [name="income"]').fill('1200.00');
  await page.locator('#goals-form [type="submit"]').click();
  assert(await page.locator('#enhancement-dialog').evaluate(x=>x.open));
  assert.deepEqual(await page.evaluate(()=>window.BeaconBusiness.getSnapshot()),fixture);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('beacon-management-v1'))),fixture);
  await page.evaluate(()=>Storage.prototype.setItem=window.originalStorageWrite);
  await page.locator('#goals-form [type="submit"]').click();
  assert.equal(await page.evaluate(()=>window.BeaconBusiness.getSnapshot().goals[window.BeaconBusiness.getMonth()].income),120000);
  await page.locator('[data-business-page="tasks"]').click();await page.locator('[data-toggle-task="t1"]').click();
  assert.equal(await page.evaluate(()=>window.BeaconBusiness.getSnapshot().tasks[0].status),'done');
  await page.reload({waitUntil:'networkidle'});await page.locator('#enter-workspace').click();
  assert.equal(await page.evaluate(()=>window.BeaconBusiness.getSnapshot().tasks[0].status),'done');
  // Compatible backups restore through the same web event used by Android.
  await page.evaluate(db=>document.dispatchEvent(new CustomEvent('beacon-import-file',{detail:'\uFEFF'+JSON.stringify({app:'Beacon Business',version:2,business:db,learning:{favorites:[],completed:[],notes:{}}})})),fixture);
  await page.locator('#confirm-restore').click();
  assert.deepEqual(await page.evaluate(()=>window.BeaconBusiness.getSnapshot()),fixture);
  await page.locator('#undo-restore').click();
  assert.equal(await page.evaluate(()=>window.BeaconBusiness.getSnapshot().tasks[0].status),'done');
  await page.setViewportSize({width:1280,height:900});await page.evaluate(()=>window.BeaconBusiness.go('dashboard'));
  assert(await page.locator('#beacon-priorities').isVisible());
  await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);
  await page.reload({waitUntil:'load'});await page.locator('#enter-workspace').click();
  assert(await page.locator('#beacon-priorities').isVisible());assert.deepEqual(errors,[]);
  console.log('PASS: mobile/desktop, three languages, monthly priorities, denied-write rollback for form/task/delete/goals, successful writes, reload persistence, BOM restore + Undo, offline reload; no JavaScript errors.');
 }finally{if(browser)await browser.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
