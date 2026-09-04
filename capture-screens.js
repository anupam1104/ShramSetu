import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'screenshots');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const PORT = 5174;
const BASE = `http://localhost:${PORT}`;

// Screens to capture, with a function name describing how to reach each screen
const screens = [
  { name: '01-landing-page', goto: 'landing' },
  { name: '02-login-page', goto: 'login' },
  { name: '03-customer-search', goto: 'search' },
  { name: '04-worker-profile', goto: 'profile' },
  { name: '05-slot-selection', goto: 'slot' },
  { name: '06-booking-confirmation', goto: 'booking_confirm' },
  { name: '07-track-booking', goto: 'track_booking' },
  { name: '08-payment-page', goto: 'payment' },
  { name: '09-shramik-signup', goto: 'shramik_signup' },
  { name: '10-shramik-pending', goto: 'shramik_pending' },
  { name: '11-shramik-dashboard', goto: 'shramik_dashboard' },
  { name: '12-shramik-job-screen', goto: 'shramik_job' },
  { name: '13-admin-dashboard', goto: 'admin_dashboard' },
  { name: '14-admin-pending-approvals', goto: 'admin_approvals' },
];

function startServer() {
  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'npm.cmd' : 'npm';
  const child = spawn(cmd, ['run', 'dev', '--', '--port', String(PORT), '--strictPort'], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });
  child.stdout?.on('data', d => process.stdout.write(`[vite] ${d}`));
  child.stderr?.on('data', d => process.stdout.write(`[vite-err] ${d}`));
  return child;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) { /* not ready */ }
    await sleep(500);
  }
  throw new Error('Vite server did not start in time');
}

// Click a button whose visible text matches (case-insensitive, trimmed)
async function clickButton(page, text) {
  const clicked = await page.evaluate((t) => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => (b.textContent || '').trim().includes(t));
    if (btn) { btn.click(); return true; }
    return false;
  }, text);
  if (!clicked) throw new Error(`Button not found: "${text}"`);
  await sleep(900);
}

// Click the DemoToolbar step button labelled "1".."9" (the number badge)
async function clickDemoStep(page, num) {
  const clicked = await page.evaluate((n) => {
    const btns = Array.from(document.querySelectorAll('button'));
    // DemoToolbar step buttons have a number badge as first child
    const btn = btns.find(b => {
      const firstSpan = b.querySelector('span');
      return firstSpan && firstSpan.textContent.trim() === String(n) && b.textContent.includes(n);
    });
    if (btn) { btn.click(); return true; }
    return false;
  }, num);
  if (!clicked) throw new Error(`Demo step ${num} not found`);
  await sleep(900);
}

async function goto(page, target) {
  switch (target) {
    case 'landing':
      // brand logo div (onClick -> switchRole('landing'))
      await page.evaluate(() => {
        const el = document.querySelector('.group') || document.querySelector('[class*="cursor-pointer"]');
        if (el) { el.click(); return true; }
        return false;
      });
      await sleep(900);
      return;
    case 'login':
      // open login from navbar "Login" button (customer tab pre-selected)
      await clickButton(page, 'Login');
      return;
    case 'search':
      await clickButton(page, 'Book a Service');
      return;
    case 'profile':
      await clickDemoStep(page, 4);
      return;
    case 'slot':
      await clickDemoStep(page, 5);
      return;
    case 'booking_confirm':
      await clickDemoStep(page, 5);
      await clickButton(page, 'Proceed to Summary');
      return;
    case 'track_booking':
      await clickDemoStep(page, 6);
      return;
    case 'payment':
      await clickDemoStep(page, 9);
      return;
    case 'shramik_signup':
      await clickDemoStep(page, 1);
      return;
    case 'shramik_pending':
      await clickDemoStep(page, 2);
      return;
    case 'shramik_dashboard':
      // switch to shramik role via navbar -> default active is verified -> dashboard
      await clickButton(page, 'Shramik');
      await sleep(300);
      return;
    case 'shramik_job':
      await clickDemoStep(page, 7);
      return;
    case 'admin_dashboard':
      await clickButton(page, 'Admin');
      await sleep(300);
      return;
    case 'admin_approvals':
      await clickDemoStep(page, 3);
      return;
    default:
      throw new Error(`Unknown target: ${target}`);
  }
}

async function main() {
  const server = startServer();
  let browser;
  try {
    await waitForServer(BASE);
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1440, height: 900 },
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });

    for (const s of screens) {
      await goto(page, s.goto);

      // Give React time to re-render + images to load
      await sleep(1500);
      await page.evaluate(() => document.fonts?.ready?.catch?.(() => {}));

      const filePath = join(outDir, `${s.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`Captured: ${s.name}.png`);
    }

    console.log('All screenshots captured successfully.');
  } catch (err) {
    console.error('Error during capture:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    console.log('Killing dev server...');
    server.kill();
  }
}

main();
