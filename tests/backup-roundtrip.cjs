const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const path = require('node:path');
const {test} = require('node:test');
const {chromium} = require('playwright');

test('exports and restores a complete workspace with a long Unicode note', async t => {
  const server = spawn('python3', [
    '-u', '-m', 'http.server', '0', '--bind', '127.0.0.1',
    '--directory', path.resolve(__dirname, '../dist')
  ], {stdio: ['ignore', 'pipe', 'inherit']});
  t.after(() => server.kill());
  const [line] = await once(server.stdout, 'data');
  const port = String(line).match(/port (\d+)/)[1];
  const url = 'http://127.0.0.1:' + port;
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_BIN, args: ['--no-sandbox']
  });
  t.after(() => browser.close());

  const source = await browser.newPage();
  await source.goto(url);
  await source.locator('#enter-workspace').click();
  await source.locator('[data-business-page="transactions"]').click();
  await source.locator('[data-add="transactions"]').first().click();
  await source.locator('#record-form [name="description"]').fill('Website deposit');
  await source.locator('#record-form [name="amount"]').fill('450.75');
  await source.locator('#record-form [type="submit"]').click();
  await source.locator('[data-view="all"]').click();
  await source.locator('#cards .read-button').first().click();
  const note = '  Revisión 🗓️\n' + 'Seguimiento de la campaña.\n'.repeat(500) + '  ';
  await source.locator('#note').fill(note);
  await source.locator('#detail-fav').click();
  await source.locator('#detail-done').click();
  await source.locator('#close').click();
  const downloaded = source.waitForEvent('download');
  await source.locator('#export').click();
  const backup = await (await downloaded).path();

  // Import the actual downloaded file on a fresh device profile.
  const target = await browser.newPage();
  await target.goto(url);
  await target.locator('#enter-workspace').click();
  await target.locator('#backup-file').setInputFiles(backup);
  await target.locator('#confirm-restore').click();
  await target.reload();
  assert.equal(await target.locator('#beacon-cover').evaluate(cover => cover.open), false);
  const restored = await target.evaluate(() => ({
    transactions: window.BeaconBusiness.getSnapshot().transactions,
    learning: JSON.parse(localStorage.getItem('beacon-business-v1'))
  }));
  assert.equal(restored.transactions.length, 1);
  assert.equal(restored.transactions[0].description, 'Website deposit');
  assert.equal(restored.transactions[0].amount, 45075);
  assert.deepEqual(restored.learning.favorites, [1]);
  assert.deepEqual(restored.learning.done, [1]);
  assert.equal(restored.learning.notes['1'], note);
  await target.locator('#undo-restore').click();
  assert.equal(await target.evaluate(() => window.BeaconBusiness.getSnapshot().transactions.length), 0);

  // A UTF-8 file can exceed the Android limit even when its JS string is shorter.
  await source.evaluate(() => {
    state.notes[1] = '界'.repeat(3_333_334);
    window.BeaconAndroid = {exportBackup() { throw Error('Oversized export reached Android'); }};
  });
  await source.locator('#export').click();
  assert.match(await source.locator('#toast').textContent(), /10 MB/);
});
