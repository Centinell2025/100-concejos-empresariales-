const {test} = require('node:test');
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const path = require('node:path');
const fs = require('node:fs/promises');
const {chromium} = require('playwright');

const businessKey = 'beacon-management-v1';
const learningKey = 'beacon-business-v1';
const previousKey = 'beacon-before-restore';
const journalKey = 'beacon-restore-journal-v1';

function backup(name) {
  return {
    app: 'Beacon Business', version: 2,
    business: {
      transactions: [], projects: [], tasks: [],
      clients: [{id:'c1', name, company:'', email:'', phone:'', status:'active', opportunity:0, notes:''}],
      goals: {'2026-11': {income:42000, expenses:15000}}
    },
    learning: {favorites:[1], completed:[1], notes:{'1':name}}
  };
}

test('restore, historical undo, changed data, and interrupted storage writes', async t => {
  const server = spawn('python3', [
    '-u','-m','http.server','0','--bind','127.0.0.1','--directory',path.resolve(__dirname,'../dist')
  ], {stdio:['ignore','pipe','ignore']});
  t.after(() => server.kill());
  const [line] = await once(server.stdout,'data');
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_BIN,args:['--no-sandbox']});
  t.after(() => browser.close());
  const page = await browser.newPage({acceptDownloads:true,viewport:{width:1100,height:800}});
  page.setDefaultTimeout(6000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:'+String(line).match(/port (\d+)/)[1]);
  await page.locator('#cover-language').selectOption('es');
  await page.locator('#enter-workspace').click();
  const modal = page.locator('#enhancement-dialog');
  async function choose(data) {
    await page.locator('#backup-file').setInputFiles({
      name:'test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))
    });
    await page.locator('#confirm-restore').waitFor();
  }
  async function confirm() {
    await page.locator('#confirm-restore').click();
    await modal.waitFor({state:'hidden'});
  }
  async function current() {
    return page.evaluate(keys => keys.map(k => localStorage.getItem(k)),[businessKey,learningKey,previousKey]);
  }
  async function waitForClient(name) {
    await page.waitForFunction(name=>window.BeaconBusiness?.getSnapshot().clients[0]?.name===name,name);
  }

  const first = backup('Original'), second = backup('Importado');
  await choose(first); await confirm(); await waitForClient('Original');
  const before = await current();
  await choose(second);
  assert.equal(await modal.locator('tbody tr').count(),8);
  for (const label of ['Meses con metas','Mis favoritos','Consejos completados','Mis notas']) {
    assert.deepEqual(await modal.getByRole('row',{name:new RegExp(label)}).locator('td').allTextContents(),['1','1']);
  }
  await modal.getByRole('button',{name:'Cancelar'}).click();
  assert.deepEqual(await current(),before);

  await choose(second); await confirm(); await page.reload();
  await page.locator('#undo-restore').click();
  await waitForClient('Original');
  assert.equal(await modal.isVisible(),false);

  await choose(second); await confirm();
  await page.locator('[data-business-page="clients"]').click();
  await page.locator('[data-edit="c1"]').click();
  await page.locator('#record-form [name=name]').fill('Guardado después');
  await page.locator('#record-form [type=submit]').click();
  await waitForClient('Guardado después');
  await page.reload();
  const edited = await current();
  await page.locator('#undo-restore').click();
  await page.locator('#confirm-undo-restore').waitFor();
  await modal.getByRole('button',{name:'Cancelar'}).click();
  assert.deepEqual(await current(),edited);

  await page.locator('#undo-restore').click();
  const download = page.waitForEvent('download');
  await page.locator('#export-before-undo').click();
  const exported = JSON.parse(await fs.readFile(await (await download).path(),'utf8'));
  assert.equal(exported.business.clients[0].name,'Guardado después');
  assert.deepEqual(await current(),edited);

  // Native export completes asynchronously; cancellation cannot trigger an Undo.
  await page.evaluate(()=>window.BeaconAndroid={exportBackup(text){window.exportPending=text;}});
  await page.locator('#undo-restore').click();
  await page.locator('#export-before-undo').click();
  await page.waitForFunction(()=>!!window.exportPending);
  assert.equal(await page.evaluate(()=>JSON.parse(window.exportPending).business.clients[0].name),'Guardado después');
  await page.evaluate(()=>{
    document.dispatchEvent(new CustomEvent('beacon-export-result',{detail:'cancelled'}));
    delete window.BeaconAndroid;
  });
  assert.deepEqual(await current(),edited);
  await page.locator('#undo-restore').click();
  await page.locator('#confirm-undo-restore').click();
  await waitForClient('Original');

  // Older snapshots do not have a reference digest. The previous target remains recoverable.
  await choose(second); await confirm();
  await page.evaluate(key=>{
    const old=JSON.parse(localStorage.getItem(key));
    delete old.restoredHash;
    localStorage.setItem(key,JSON.stringify(old));
  },previousKey);
  await page.reload();await page.locator('#undo-restore').click();
  await page.locator('#confirm-undo-restore').click();
  await waitForClient('Original');

  // A failed write after the business ledger has been written must restore the original bytes.
  const original = await current();
  await choose(second);
  await page.evaluate(key=>{
    const native=Storage.prototype.setItem;
    let reject=true;
    Storage.prototype.setItem=function(k,v){
      if(k===key&&reject){reject=false;throw new DOMException('Full','QuotaExceededError');}
      return native.call(this,k,v);
    };
  },learningKey);
  await page.locator('#confirm-restore').click();
  await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('No se pudo'));
  assert.deepEqual(await current(),original);
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),journalKey),null);
  await modal.getByRole('button',{name:'Cancelar'}).click();

  // Simulate an interrupted transaction immediately before its commit point.
  await page.evaluate(({keys,original,journalKey})=>{
    localStorage.setItem(journalKey,JSON.stringify(original));
    localStorage.setItem(keys[0],JSON.stringify({transactions:[],clients:[],projects:[],tasks:[],goals:{}}));
    localStorage.removeItem(keys[1]); localStorage.removeItem(keys[2]);
  },{keys:[businessKey,learningKey,previousKey],original,journalKey});
  await page.reload();
  await page.waitForFunction(key=>localStorage.getItem(key)===null,journalKey);
  await waitForClient('Original');
  assert.deepEqual(await current(),original);
  assert.deepEqual(errors,[]);
});

test('historical Undo can recover a collection larger than the external import limit', async () => {
  const vm = require('node:vm');
  const source = await fs.readFile(path.resolve(__dirname,'../dist/backup.js'),'utf8');
  const context = vm.createContext({});
  vm.runInContext(source,context);
  const sourceData = backup('client');
  sourceData.business.clients = Array.from({length:10001},(_,i)=>({id:String(i),name:'Client',status:'active'}));
  const text = JSON.stringify(sourceData);
  assert.throws(()=>context.validateBeaconBackup(text),/records/);
  assert.equal(context.validateBeaconBackup(text,{localUndo:true}).business.clients.length,10001);
});
