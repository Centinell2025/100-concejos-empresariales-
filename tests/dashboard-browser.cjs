const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const path = require('node:path');
const { chromium } = require('playwright');

async function run() {
  const server = spawn('python3', [
    '-u', '-m', 'http.server', '0', '--bind', '127.0.0.1',
    '--directory', path.resolve(__dirname, '../dist')
  ], {stdio: ['ignore', 'pipe', 'pipe']});
  let browser;
  try {
    const [line] = await once(server.stdout, 'data');
    const port = String(line).match(/port (\d+)/)[1];
    browser = await chromium.launch({executablePath: process.env.CHROMIUM_BIN});
    const page = await browser.newPage({viewport: {width: 375, height: 812}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:' + port);
    await page.locator('#enter-workspace').click();

    for (const [language, income, expense] of [
      ['en', 'Record income', 'Record expense'],
      ['es', 'Registrar ingreso', 'Registrar gasto'],
      ['it', 'Registra entrata', 'Registra spesa']
    ]) {
      await page.locator('#language').selectOption(language);
      assert.equal(await page.getByRole('button', {name: income, exact: true}).count(), 1);
      assert.equal(await page.getByRole('button', {name: expense, exact: true}).count(), 1);
    }
    await page.locator('#language').selectOption('es');
    const menu = page.locator('.workspace-tools');
    await menu.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert(await menu.locator('#restore-backup').isVisible());
    assert(await menu.locator('#export').isVisible());
    await page.keyboard.press('Escape');
    assert.equal(await menu.evaluate(element => element.open), false);
    await page.locator('#biz-month').fill('2022-03');
    const form = page.locator('#record-form');
    for (const [label, type, amount] of [
      ['Registrar gasto', 'entryExpense', '240'],
      ['Registrar ingreso', 'entryIncome', '600']
    ]) {
      await page.getByRole('button', {name: label, exact: true}).click();
      assert.equal(await form.locator('[name=type]').inputValue(), type);
      assert.equal(await form.locator('[name=date]').inputValue(), '2022-03-01');
      await form.locator('[name=description]').fill('Prueba de registro');
      await form.locator('[name=amount]').fill(amount);
      await form.locator('[type=submit]').click();
      await page.locator('#record-dialog').waitFor({state: 'hidden'});
    }

    assert.match(await page.locator('#cash-result-amount').innerText(), /360/);
    assert.equal(await page.locator('.cash-margin dd').innerText(), '60%');
    await page.locator('#biz-month').fill('2022-04');
    assert.equal(await page.locator('.cash-margin dd').innerText(), '—');
    assert.doesNotMatch(await page.locator('#cash-result-amount').innerText(), /360/);
    await page.locator('#biz-month').fill('2022-03');
    for (const width of [320, 375, 768, 1280]) {
      await page.setViewportSize({width, height: 850});
      assert(await page.locator('#edit-goals').isVisible());
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Page overflow at ' + width);
    }
    assert(await page.locator('.top-actions > #export').isVisible());
    await page.setViewportSize({width: 375, height: 850});
    await page.locator('.workspace-tools summary').click();
    assert(await page.locator('.workspace-tools #about-beacon').isVisible());
    assert.deepEqual(errors, []);
    console.log('PASS: translated quick entries, historical periods, cash result, margin and responsive overview.');
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

run().catch(error => { console.error(error); process.exitCode = 1; });
