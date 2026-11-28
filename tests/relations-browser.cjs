const assert = require('node:assert/strict');
const {once} = require('node:events');
const {spawn} = require('node:child_process');
const path = require('node:path');
const {test} = require('node:test');
const {chromium} = require('playwright');

test('linked records, period feedback, tip notes and privacy navigation', async t => {
  const server = spawn('python3', ['-u', '-m', 'http.server', '0', '--bind', '127.0.0.1',
    '--directory', path.resolve(__dirname, '../dist')], {stdio: ['ignore', 'pipe', 'pipe']});
  t.after(() => server.kill());
  const [line] = await once(server.stdout, 'data');
  const port = String(line).match(/port (\d+)/)[1];
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_BIN});
  t.after(() => browser.close());
  const page = await browser.newPage({viewport: {width: 1280, height: 850}});
  page.setDefaultTimeout(9000);
  await page.goto('http://127.0.0.1:' + port);
  await page.locator('#cover-language').selectOption('es');
  await page.locator('#enter-workspace').click();
  const snapshot = {
    app: 'Beacon Business', version: 2,
    business: {
      transactions: [],
      clients: [
        {id: 'one', name: 'Rosa Ruiz', company: 'Delta', status: 'active'},
        {id: 'two', name: 'Rosa Ruiz', company: 'Norte', status: 'active'}
      ],
      projects: [{id: 'p', name: 'Proyecto Coral', client: 'two', status: 'inProgress'}],
      tasks: [{id: 't', name: 'Revisión de entrega', project: 'p', priority: 'high', status: 'pending'}],
      goals: {}
    },
    learning: {notes: {'5': 'almacén especial'}, completed: [], favorites: []}
  };
  await page.locator('#backup-file').setInputFiles({
    name: 'workspace.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(snapshot))
  });
  await page.locator('#confirm-restore').click();
  const nav = id => page.locator('[data-business-page="' + id + '"]').click();
  await nav('projects');
  await page.locator('#record-search').fill('norte');
  assert(await page.getByText('Proyecto Coral', {exact: true}).isVisible());
  await page.locator('[data-edit="p"]').click();
  const options = await page.locator('#record-form [name=client] option').allTextContents();
  assert(options.includes('Rosa Ruiz · Delta') && options.includes('Rosa Ruiz · Norte'));
  await page.locator('#record-cancel').click();
  await nav('tasks');
  await page.locator('#record-search').fill('coral');
  assert(await page.getByText('Revisión de entrega', {exact: true}).isVisible());
  await nav('clients');
  await page.locator('[data-delete="two"]').click();
  assert.match(await page.locator('#unlink-dialog').innerText(), /Proyectos afectados: 1/);
  await page.locator('#unlink-dialog').getByRole('button', {name:'Cancelar'}).click();
  assert(await page.locator('[data-edit="two"]').isVisible());
  await page.locator('[data-delete="two"]').click();
  await page.locator('#unlink-dialog').getByRole('button', {name:'Eliminar'}).click();
  await page.locator('#toast .undo-button').click();
  await nav('projects');
  assert(await page.getByText('Rosa Ruiz', {exact:true}).isVisible());
  await nav('dashboard');
  await page.locator('#biz-month').fill('2026-10');
  await page.getByRole('button', {name:'Registrar ingreso', exact:true}).click();
  const f = page.locator('#record-form');
  await f.locator('[name=description]').fill('Pago de noviembre');
  await f.locator('[name=date]').fill('2026-11-04');
  await f.locator('[name=amount]').fill('3,70');
  await f.locator('[type=submit]').click();
  await page.getByRole('button', {name:'Ver ese mes'}).click();
  assert.equal(await page.locator('#biz-month').inputValue(), '2026-11');
  assert(await page.getByText('Pago de noviembre', {exact:true}).isVisible());
  await page.locator('[data-view=plan]').click();
  await page.locator('#search').fill('almacen');
  assert.equal(await page.locator('#cards .card').count(), 1);
  await page.locator('.privacy-link').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'es');
  assert(await page.locator('#es').isVisible());
  await page.locator('.langs a[href="#it"]').click();
  await page.locator('#it').waitFor({state:'visible'});
  assert(!await page.locator('#es').isVisible());
});
