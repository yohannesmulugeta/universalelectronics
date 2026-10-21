const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const { mkdirSync } = require('node:fs');
const assert = require('node:assert/strict');
const out = 'artifacts/redesign';
mkdirSync(out, { recursive: true });
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4321'], { stdio: 'ignore' });
const base = 'http://127.0.0.1:4321';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function ready() {
  for (let i = 0; i < 35; i++) {
    try { const response = await fetch(base); if (response.ok) return; } catch {}
    await sleep(400);
  }
  throw new Error('Astro preview did not start');
}
function expectNoOverflow(width, measured, page) {
  assert.ok(measured <= width + 2, page + ' has unintended horizontal overflow: ' + measured + 'px at viewport ' + width);
}
(async () => {
  try {
    await ready();
    const browser = await chromium.launch({ headless: true });
    for (const spec of [
      { name: 'desktop-1440', width: 1440, height: 900 },
      { name: 'desktop-1280', width: 1280, height: 800 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'mobile-375', width: 375, height: 812 },
    ]) {
      const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height }, deviceScaleFactor: 1 });
      const errors = [];
      page.on('pageerror', (error) => errors.push(String(error)));
      await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
      await page.locator('#home-heading').waitFor();
      assert.ok((await page.locator('#recognition-heading').count()) === 1, 'Recognition must appear on homepage');
      assert.ok((await page.locator('a[href="/services/"]').count()) >= 1, 'Services navigation missing');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expectNoOverflow(spec.width, scrollWidth, spec.name + ' homepage');
      await page.screenshot({ path: out + '/' + spec.name + '.png', fullPage: true });
      if (spec.width === 375) {
        await page.getByRole('button', { name: 'Open navigation menu' }).click();
        assert.ok(await page.getByRole('navigation', { name: 'Mobile navigation' }).getByText('Recognition').isVisible(), 'Mobile recognition nav missing');
      }
      await page.goto(base + '/services/', { waitUntil: 'domcontentloaded' });
      expectNoOverflow(spec.width, await page.evaluate(() => document.documentElement.scrollWidth), spec.name + ' services');
      if (spec.name === 'desktop-1440') await page.screenshot({ path: out + '/services-desktop.png', fullPage: true });
      await page.goto(base + '/recognition/', { waitUntil: 'domcontentloaded' });
      assert.equal(await page.locator('section[aria-label="Recognition documents"] a').count(), 5, 'Five recognition documents should be visible');
      if (spec.name === 'desktop-1440') await page.screenshot({ path: out + '/recognition-desktop.png', fullPage: true });
      await page.goto(base + '/shop/solar/', { waitUntil: 'domcontentloaded' });
      assert.ok(await page.locator('a.brand-marquee-link[href*="brand="]').count() > 0, 'Solar brand links missing');
      await page.goto(base + '/contact/?interest=Sound%20equipment&product=Sample%20Speaker', { waitUntil: 'domcontentloaded' });
      assert.equal(await page.locator('select[name="interest"]').inputValue(), 'Sound equipment', 'Enquiry category not prefilled');
      assert.ok((await page.locator('textarea[name="message"]').inputValue()).includes('Sample Speaker'), 'Product enquiry not prefilled');
      if (errors.length) throw new Error('Uncaught browser errors: ' + errors.join('\n'));
      console.log('PASS ' + spec.name + ' responsive pages, brand navigation, recognition and contact prefill');
      await page.close();
    }
    await browser.close();
  } finally {
    server.kill('SIGTERM');
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
