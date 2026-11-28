const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const path = require('node:path');
const {test} = require('node:test');
const {chromium} = require('playwright');

test('typed and pasted money persists as exact cents in all financial forms', async t => {
  const server = spawn('python3', [
    '-u', '-m', 'http.server', '0', '--bind', '127.0.0.1', '--directory', path.resolve(__dirname, '../dist')
  ], {stdio: ['ignore', 'pipe', 'pipe']});
  t.after(() => server.kill());
  const [line] = await once(server.stdout, 'data');
  const url = 'http://127.0.0.1:' + String(line).match(/port (\d+)/)[1];
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_BIN});
  t.after(() => browser.close());
  const context = await browser.newContext({locale: 'es-ES', viewport: {width: 375, height: 812}});
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], {origin: url});
  const page = await context.newPage();
  await page.goto(url);
  await page.locator('#cover-language').selectOption('es');
  await page.locator('#enter-workspace').click();

  async function enterMoney(input, text, paste = false) {
    await input.focus();
    await input.press('ControlOrMeta+a');
    if (paste) {
      await page.evaluate(value => navigator.clipboard.writeText(value), text);
      await input.press('ControlOrMeta+v');
    } else {
      await input.pressSequentially(text);
    }
    assert.equal(await input.inputValue(), text);
  }
  const form = page.locator('#record-form');
  for (const [label, description, text, cents, paste] of [
    ['Registrar ingreso', 'Venta A', '7,05', 705, false],
    ['Registrar ingreso', 'Venta B', '7.05', 705, true],
    ['Registrar gasto', 'Material A', '0,05', 5, true],
    ['Registrar gasto', 'Material B', '.05', 5, false]
  ]) {
    await page.getByRole('button', {name: label, exact: true}).click();
    await form.locator('[name=description]').fill(description);
    await enterMoney(form.locator('[name=amount]'), text, paste);
    assert.match(await form.locator('#money-amount-hint').innerText(), /USD/);
    await form.locator('[type=submit]').click();
    await form.waitFor({state: 'hidden'});
    const record = await page.evaluate(name =>
      BeaconBusiness.getSnapshot().transactions.find(row => row.description === name), description);
    assert.equal(record.amount, cents);
  }

  await page.locator('[data-business-page=transactions]').click();
  await page.locator('[data-edit]').first().click();
  const id = await page.locator('[data-edit]').first().getAttribute('data-edit');
  const input = form.locator('[name=amount]');
  for (const invalid of ['1,234', '1.234,56', '1,234.56', '1e3', '-2', '0', '10000000000']) {
    await enterMoney(input, invalid, true);
    await form.locator('[type=submit]').click();
    assert.equal(await input.getAttribute('aria-invalid'), 'true');
    assert(await form.isVisible());
  }
  await enterMoney(input, '12,50');
  await form.locator('[type=submit]').click();
  await form.waitFor({state: 'hidden'});
  const edited = await page.evaluate(id => BeaconBusiness.getSnapshot().transactions.find(r => r.id === id), id);
  assert.equal(edited.amount, 1250);

  for (const [section, key, text, paste] of [
    ['clients', 'opportunity', '48,65', false], ['projects', 'budget', '92,30', true]
  ]) {
    await page.locator(`[data-business-page="${section}"]`).click();
    await page.locator(`[data-add="${section}"]`).first().click();
    await form.locator('[name=name]').fill('Registro de prueba');
    await enterMoney(form.locator(`[name="${key}"]`), text, paste);
    await form.locator('[type=submit]').click();
    await form.waitFor({state: 'hidden'});
  }
  await page.locator('[data-business-page=dashboard]').click();
  await page.locator('#edit-goals').click();
  const goals = page.locator('#goals-form');
  await enterMoney(goals.locator('[name=income]'), '65,25', true);
  await enterMoney(goals.locator('[name=expenses]'), '12.50');
  await goals.locator('[type=submit]').click();
  await goals.waitFor({state: 'hidden'});

  await page.reload();
  const {db, month} = await page.evaluate(() => ({db: BeaconBusiness.getSnapshot(), month: BeaconBusiness.getMonth()}));
  assert.equal(db.transactions.length, 4);
  assert.equal(db.transactions.find(row => row.id === id).amount, 1250);
  assert.equal(db.clients[0].opportunity, 4865);
  assert.equal(db.projects[0].budget, 9230);
  assert.deepEqual(db.goals[month], {income: 6525, expenses: 1250});
});
