const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const {readFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium} = require('playwright');

async function openLedger(context, url) {
  const page = await context.newPage();
  await page.goto(url);
  if (await page.locator('#beacon-cover').isVisible()) await page.locator('#enter-workspace').click();
  return page;
}

async function prepareEntry(page, description, amount) {
  await page.locator('[data-entry-type="entryIncome"]').click();
  await page.locator('#record-form [name=description]').fill(description);
  await page.locator('#record-form [name=amount]').fill(amount);
}

const submit = page => page.locator('#record-form [type=submit]').click();
const closed = page => page.locator('#record-dialog').waitFor({state:'hidden'});
const records = page => page.evaluate(() => JSON.parse(localStorage.getItem('beacon-management-v1')).transactions);

async function concurrentEdits(browser, url, disableWebLocks) {
  const context = await browser.newContext();
  if (disableWebLocks) {
    await context.addInitScript(() => Object.defineProperty(navigator,'locks',{value:undefined}));
  }
  try {
    const a = await openLedger(context,url);
    const b = await openLedger(context,url);
    await Promise.all([prepareEntry(a,'Window A','14.25'), prepareEntry(b,'Window B','17.50')]);
    await Promise.all([submit(a),submit(b)]);
    await Promise.all([closed(a),closed(b)]);
    assert.deepEqual((await records(a)).map(x=>x.amount).sort((x,y)=>x-y),[1425,1750]);

    // Two editors opened the original record. The later writer must keep their draft visible.
    for (const page of [a,b]) {
      await page.locator('[data-business-page="transactions"]').click();
      await page.locator('tr').filter({hasText:'Window A'}).locator('[data-edit]').click();
    }
    await a.locator('#record-form [name=description]').fill('Edited by A');
    await b.locator('#record-form [name=description]').fill('Draft from B');
    await submit(a);await closed(a);await submit(b);
    await b.locator('.form-error').filter({hasText:'changed in another window'}).waitFor();
    assert.equal(await b.locator('#record-form [name=description]').inputValue(),'Draft from B');
    assert((await records(b)).some(x=>x.description==='Edited by A'));
    await b.locator('#record-cancel').click();
    await b.reload();
    assert.equal((await records(b)).length,2);
    if(disableWebLocks)return;

    for(const page of [a,b])await page.locator('[data-view=all]').click();
    await Promise.all([a.locator('[data-tip-id="1"] .icon-button').click(),b.locator('[data-tip-id="2"] .icon-button').click()]);
    await b.waitForFunction(()=>JSON.parse(localStorage.getItem('beacon-business-v1')).favorites.length===2);
    await b.locator('[data-tip-id="2"] .read-button').click();
    await b.locator('#note').pressSequentially('Two tabs and rapid typing.',{delay:1});
    await b.locator('#close').click();
    const download=b.waitForEvent('download');
    await b.locator('#export').click();
    const backup=JSON.parse(await readFile(await (await download).path(),'utf8'));
    assert.deepEqual(backup.learning.favorites.sort((x,y)=>x-y),[1,2]);
    assert.equal(backup.learning.notes['2'],'Two tabs and rapid typing.');
    await b.reload();
    assert.equal(await b.evaluate(()=>JSON.parse(localStorage.getItem('beacon-business-v1')).notes[2]),'Two tabs and rapid typing.');
  } finally { await context.close(); }
}

async function validation(browser,url) {
  const context=await browser.newContext();
  try {
    const page=await openLedger(context,url);
    await prepareEntry(page,'  ','9.95');
    const form=page.locator('#record-form');
    await submit(page);
    await form.locator('.form-error').filter({hasText:'containing text'}).waitFor();
    assert.equal(await form.locator('[name=description]').evaluate(e=>e===document.activeElement),true);
    await form.locator('[name=description]').fill('Date validation');
    await form.locator('[name=date]').fill('1899-12-31');
    assert.equal(await form.locator('[name=date]').evaluate(e=>e.validity.rangeUnderflow),true);
    await submit(page);
    assert(await page.locator('#record-dialog').isVisible());
    await form.locator('[name=date]').fill('1900-01-01');
    await submit(page);await closed(page);
    assert.equal((await records(page))[0].date,'1900-01-01');
    // Version 1.0.2 accepted historical dates. A previously saved record must remain portable.
    await page.evaluate(()=>{
      const db=BeaconBusiness.getSnapshot();db.transactions[0].date='1899-12-31';
      localStorage.setItem('beacon-management-v1',JSON.stringify(db));BeaconBusiness.replaceData(db);
    });
    const exportDone=page.waitForEvent('download');await page.locator('#export').click();
    const backup=await readFile(await (await exportDone).path(),'utf8');
    assert.equal(JSON.parse(backup).business.transactions[0].date,'1899-12-31');
    assert.equal(await page.evaluate(text=>validateBeaconBackup(text).business.transactions[0].date,backup),'1899-12-31');
    await page.evaluate(()=>{
      const db=BeaconBusiness.getSnapshot();
      db.transactions=Array.from({length:10000},(_,n)=>({...db.transactions[0],id:String(n)}));
      localStorage.setItem('beacon-management-v1',JSON.stringify(db));BeaconBusiness.replaceData(db);
    });
    await prepareEntry(page,'Over cap','11');
    await submit(page);
    await form.locator('.form-error').filter({hasText:'10,000'}).waitFor();
    assert.equal(await form.locator('[name=description]').inputValue(),'Over cap');
    assert.equal((await records(page)).length,10000);
  } finally { await context.close(); }
}

async function main() {
  const server=spawn('python3',['-u','-m','http.server','0','--bind','127.0.0.1','--directory',path.resolve(__dirname,'../dist')],{stdio:['ignore','pipe','ignore']});
  let browser;
  try {
    const [line]=await once(server.stdout,'data');
    const url='http://127.0.0.1:'+String(line).match(/port (\d+)/)[1];
    browser=await chromium.launch({executablePath:process.env.CHROMIUM_BIN});
    await concurrentEdits(browser,url,false);
    await concurrentEdits(browser,url,true);
    await validation(browser,url);
    console.log('PASS: concurrent inserts in two tabs, stale editor draft, Web Locks and IndexedDB fallback, learning cross-tab updates, export after typing, date bounds, blank text and row limit.');
  } finally { if(browser)await browser.close();server.kill(); }
}
main().catch(e=>{console.error(e);process.exitCode=1});
