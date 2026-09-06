import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const PORT = 5180;
const BASE = `http://localhost:${PORT}`;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function startServer() {
  const child = spawn('npm.cmd', ['run', 'dev', '--', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });
  child.stdout?.on('data', d => console.log(`[vite] ${d}`.trim()));
  child.stderr?.on('data', d => console.log(`[vite-err] ${d}`.trim()));
  return child;
}

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try { const res = await fetch(url); if (res.ok) return true; } catch (e) {}
    await sleep(500);
  }
  throw new Error('Vite server did not start in time');
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
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`[console.${msg.type()}] ${msg.text()}`);
      }
    });
    page.on('pageerror', (err) => console.log('[pageerror]', err.message));
    page.on('requestfailed', (req) => console.log('[requestfailed]', req.url(), req.failure()?.errorText));

    await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });
    await sleep(2000);

    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 400));
    const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML.length);
    console.log('[root innerHTML length]', rootHtml);
    console.log('[body text]', JSON.stringify(bodyText));
  } catch (err) {
    console.error('Error during capture:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

main();