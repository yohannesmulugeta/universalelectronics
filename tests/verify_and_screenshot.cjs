const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.SITE_BASE_URL || 'http://localhost:4321';
const ROOT_DIR = path.resolve(__dirname, '../../');
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'output/playwright');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Read products list to verify all 59 routes
const rawProducts = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, 'rebuild-ready/content/products.json'), 'utf8')
);

(async () => {
  console.log('🚀 Starting browser verification on ' + BASE_URL);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.method()} ${req.url()} (${req.failure()?.errorText})`);
  });

  try {
    // 1. Home Desktop
    console.log('--- Testing Home Page (Desktop) ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    const homeTitle = await page.title();
    console.log('Home title:', homeTitle);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_home.png'), fullPage: true });

    // 2. Home Mobile & Menu Toggle
    console.log('--- Testing Home Page (Mobile) ---');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_mobile_home.png'), fullPage: false });

    // Test mobile menu click
    const toggleBtn = page.locator('#mobile-menu-toggle');
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_mobile_menu_open.png'), fullPage: false });
    }

    // Reset viewport to desktop
    await page.setViewportSize({ width: 1280, height: 800 });

    // 3. Shop Catalog & Filter Island
    console.log('--- Testing Shop Catalog & React Filter Island ---');
    await page.goto(`${BASE_URL}/shop/`, { waitUntil: 'networkidle' });
    const basePath = new URL(BASE_URL).pathname.replace(/\/$/, '');
    if (basePath) {
      const wrongLinks = await page.locator('a[href^="/"], img[src^="/"]').evaluateAll(
        (elements, prefix) => elements
          .map((element) => element.getAttribute('href') || element.getAttribute('src'))
          .filter((url) => url && !url.startsWith(`${prefix}/`)),
        basePath
      );
      if (wrongLinks.length) throw new Error(`Unprefixed Pages links/assets: ${wrongLinks.slice(0, 5).join(', ')}`);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_desktop_shop_initial.png') });

    // Test Search input
    const searchInput = page.locator('#catalog-search');
    await searchInput.fill('MUST');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_desktop_shop_search_must.png') });

    // Test Reset
    const resetBtn = page.getByText('Reset All Filters');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await page.waitForTimeout(300);
    }

    // Test Category filter
    const catSelect = page.locator('#catalog-category');
    await catSelect.selectOption('solar-batteries');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_desktop_shop_batteries_filter.png') });

    // 4. Shop Solar Overview
    console.log('--- Testing Shop Solar Overview ---');
    await page.goto(`${BASE_URL}/shop/solar/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_desktop_shop_solar.png'), fullPage: true });

    // 5. Shop Sound Overview
    console.log('--- Testing Shop Sound Overview ---');
    await page.goto(`${BASE_URL}/shop/sound/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_desktop_shop_sound.png'), fullPage: true });

    // 6. Category Page: Inverters
    console.log('--- Testing Category Page: Inverters ---');
    await page.goto(`${BASE_URL}/category/inverters/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_desktop_category_inverters.png') });

    // 7. Category Page: Speakers
    console.log('--- Testing Category Page: Speakers ---');
    await page.goto(`${BASE_URL}/category/speakers/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_desktop_category_speakers.png') });

    // 8. Product with Image
    console.log('--- Testing Product with Image ---');
    const pWithImg = 'must-pv2900-hp-solar-inverter-1-6kw-off-grid-pure-sine-wave-inverter';
    await page.goto(`${BASE_URL}/product/${pWithImg}/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_desktop_product_with_image.png'), fullPage: true });

    // 9. Product WITHOUT Image (one of the 3 items)
    console.log('--- Testing Product without Image ---');
    const pWithoutImg = 'grundfos-sp7-31-submersible-borehole-pump-high-head-stainless-steel';
    await page.goto(`${BASE_URL}/product/${pWithoutImg}/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_desktop_product_no_image.png'), fullPage: true });

    // 10. Projects Page
    console.log('--- Testing Projects Page ---');
    await page.goto(`${BASE_URL}/projects/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_desktop_projects.png'), fullPage: true });

    // 11. Recognition archive links to original document scans
    console.log('--- Testing Recognition Archive ---');
    await page.goto(`${BASE_URL}/recognition/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_desktop_recognition.png') });
    if (await page.locator('main a[href*="/assets/"]').count() < 5) {
      throw new Error('Recognition document links are missing');
    }

    // 12. About Page
    console.log('--- Testing About Page ---');
    await page.goto(`${BASE_URL}/about/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_desktop_about.png'), fullPage: true });

    // 13. Contact Page
    console.log('--- Testing Contact Page ---');
    await page.goto(`${BASE_URL}/contact/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17_desktop_contact.png'), fullPage: true });

    // 14. 404 Page
    console.log('--- Testing 404 Page ---');
    await page.goto(`${BASE_URL}/404/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '18_desktop_404.png') });

    // 15. Verify all 59 product routes return HTTP 200
    console.log('--- Verifying all 59 Product Routes Return HTTP 200 ---');
    let routeFailures = 0;
    for (const prod of rawProducts) {
      const slug = decodeURIComponent(prod.slug);
      const url = `${BASE_URL}/product/${slug}/`;
      const res = await page.goto(url, { waitUntil: 'domcontentloaded' });
      if (!res || res.status() !== 200) {
        console.error(`❌ Failed route: ${url} (status: ${res ? res.status() : 'null'})`);
        routeFailures++;
      }
    }

    console.log(`✅ Product route check complete: ${rawProducts.length - routeFailures} of ${rawProducts.length} returned HTTP 200.`);
    if (routeFailures > 0) throw new Error(`${routeFailures} product routes failed`);

    // Summary of logs
    console.log('--- Browser Console & Request Report ---');
    console.log('Console errors count:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((e) => console.log('  [Console Error]:', e));
    }
    console.log('Failed network requests:', failedRequests.length);
    if (failedRequests.length > 0) {
      failedRequests.forEach((r) => console.log('  [Failed Request]:', r));
    }
    if (consoleErrors.length || failedRequests.length) {
      throw new Error('Browser console or network errors were detected');
    }

    console.log('🎉 Verification completed successfully!');
  } catch (err) {
    console.error('Test error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
