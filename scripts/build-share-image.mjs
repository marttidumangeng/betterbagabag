/**
 * Builds the link-preview picture (1200x630) at public/share/betterbagabag.png,
 * the image Facebook and other sites show when someone shares betterbagabag.org.
 * Text is typeset here, never drawn by an image model.
 *
 *   node scripts/build-share-image.mjs
 *
 * Uses an installed Microsoft Edge or Chrome through playwright-core.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';

const config = JSON.parse(readFileSync('config/lgu.config.json', 'utf8'));
const seal = readFileSync('public/logos/bagabag-seal.jpg').toString('base64');
const green = config.portal.brandColor; // #15803d
const deep = '#116432';

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; font-family: Figtree, sans-serif; color: #fff;
         background: linear-gradient(120deg, ${green}, ${deep}); display: flex; flex-direction: column; }
  .main { flex: 1; display: flex; align-items: center; gap: 56px; padding: 0 80px; }
  .seal { width: 320px; height: 320px; border-radius: 50%; background: #fff; overflow: hidden; flex: none; box-shadow: 0 0 0 8px rgba(255,255,255,.25); }
  .seal img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .kicker { font-size: 26px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; opacity: .85; }
  h1 { font-size: 92px; font-weight: 800; letter-spacing: -.03em; line-height: 1; margin: 14px 0 22px; }
  p { font-size: 32px; font-weight: 500; line-height: 1.3; max-width: 640px; opacity: .95; }
  .foot { background: rgba(0,0,0,.22); padding: 18px 80px; display: flex; justify-content: space-between;
          font-size: 22px; font-weight: 600; }
</style></head><body>
  <div class="main">
    <div class="seal"><img src="data:image/jpeg;base64,${seal}" alt=""></div>
    <div>
      <div class="kicker">${config.lgu.name}, ${config.lgu.province}</div>
      <h1>${config.portal.name}</h1>
      <p>Officials, barangays, services and the national budget for ${config.lgu.name}, in one place.</p>
    </div>
  </div>
  <div class="foot">
    <span>${config.portal.domain}</span>
    <span>Independent and unofficial · Not a website of the Municipal Government</span>
  </div>
</body></html>`;

async function launch() {
  for (const channel of ['msedge', 'chrome']) {
    try {
      return await chromium.launch({ channel });
    } catch {
      // Try the next installed browser.
    }
  }
  return chromium.launch();
}

mkdirSync('public/share', { recursive: true });
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.screenshot({ path: resolve('public/share/betterbagabag.png') });
  console.log('wrote public/share/betterbagabag.png');
} finally {
  await browser.close();
}
