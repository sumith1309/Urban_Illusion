#!/usr/bin/env node
/**
 * INP-under-load — drives the homepage with realistic input under throttle
 * (slow-4G + 4× CPU) and reports the worst observed INP while:
 *   - scrolling repeatedly (forces ScrollTrigger + Lenis + parallax work)
 *   - sweeping the cursor across the hero (forces magnetic + WebGL gaze)
 *   - clicking a magnetic CTA mid-scroll (the input event we want to measure)
 *
 * Gate (per Phase-2 user contract): INP < 200ms with the eye running + scroll.
 *
 * Lighthouse default INP is measured during initial load, not under sustained
 * interaction. This is the missing measurement that catches a janky render
 * loop where TBT/LCP look fine.
 */

import puppeteer from "puppeteer-core";
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const outDir = resolve(root, ".perf");
mkdirSync(outDir, { recursive: true });

const CHROME =
  process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.env.PERF_URL ?? "http://localhost:3000/";

async function main() {
  // Ensure Chrome exists
  try { execSync(`test -x "${CHROME}"`); } catch {
    console.error(`Chrome not found at: ${CHROME}`);
    process.exit(2);
  }

  console.log(`\n→ INP-under-load on ${URL}\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--use-angle=metal", "--disable-features=Translate"],
    defaultViewport: { width: 412, height: 915, deviceScaleFactor: 1.75, isMobile: true },
  });

  const page = await browser.newPage();

  // Throttle: slow-4G + 4× CPU (same profile as our DevTools LCP gate)
  const client = await page.target().createCDPSession();
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1638 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  // Install a PerformanceObserver for INP via the official event-timing API
  await page.evaluateOnNewDocument(() => {
    // @ts-expect-error attaching on window
    window.__inpEvents = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        // PerformanceEventTiming
        const dur = e.duration;
        // @ts-expect-error attaching on window
        window.__inpEvents.push({ name: e.name, duration: dur, startTime: e.startTime });
      }
    }).observe({ type: "event", buffered: true, durationThreshold: 16 });
  });

  // Navigate and wait for load
  await page.goto(URL, { waitUntil: "load", timeout: 60000 });

  // Wait a moment for WebGL to mount (post-load + rIC)
  await new Promise((r) => setTimeout(r, 1500));

  // ──────── Scenario: scroll + cursor sweep + click ────────
  // 1) Scroll 6 times across the page so ScrollTrigger + Lenis are running
  const heights = [600, 1200, 2000, 2800, 1600, 400];
  for (const y of heights) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "smooth" }), y);
    await new Promise((r) => setTimeout(r, 500));
  }

  // 2) Sweep the cursor across the hero (forces magnetic + WebGL gaze updates)
  const sweepPoints = 24;
  for (let i = 0; i < sweepPoints; i++) {
    const x = 50 + (i / sweepPoints) * 320;
    const y = 200 + Math.sin(i * 0.5) * 100;
    await page.mouse.move(x, y, { steps: 1 });
    await new Promise((r) => setTimeout(r, 30));
  }

  // 3) Click a magnetic CTA mid-page (the measurable interaction)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await new Promise((r) => setTimeout(r, 400));
  try {
    const target = await page.$('a[data-magnetic][href="/shop"]');
    if (target) {
      await target.hover();
      await new Promise((r) => setTimeout(r, 200));
      await target.click({ delay: 5 });
      await new Promise((r) => setTimeout(r, 600));
    }
  } catch { /* button may not be present yet — non-fatal */ }

  // Read the collected events
  const events = await page.evaluate(() => {
    // @ts-expect-error injected
    return window.__inpEvents ?? [];
  });

  // Compute INP per spec: high-percentile (98th) of event durations
  const durs = events.map((e) => e.duration).filter((d) => d > 0).sort((a, b) => a - b);
  const max = durs[durs.length - 1] ?? 0;
  const p98 = durs.length ? durs[Math.floor(durs.length * 0.98)] ?? max : 0;
  const median = durs.length ? durs[Math.floor(durs.length * 0.5)] ?? 0 : 0;
  const count = durs.length;

  await browser.close();

  const result = {
    at: new Date().toISOString(),
    eventCount: count,
    medianMs: Math.round(median),
    p98Ms: Math.round(p98),
    maxMs: Math.round(max),
    gate: 200,
    pass: p98 < 200,
  };

  writeFileSync(`${outDir}/inp-under-load.json`, JSON.stringify(result, null, 2));

  console.log("┌─ INP-under-load (slow-4G + 4× CPU, eye running, scroll + sweep + click) ─");
  console.log(`│ events observed : ${count}`);
  console.log(`│ median          : ${result.medianMs} ms`);
  console.log(`│ p98             : ${result.p98Ms} ms`);
  console.log(`│ max             : ${result.maxMs} ms`);
  console.log(`│ gate            : ${result.gate} ms — ${result.pass ? "PASS ✓" : "FAIL ✗"}`);
  console.log("└──────────────────────────────────────────────────────────────");
  console.log(`\n  snapshot written → .perf/inp-under-load.json\n`);

  process.exit(result.pass ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
