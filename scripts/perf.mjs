#!/usr/bin/env node
/**
 * `pnpm perf` — run Lighthouse on the same slow-4G + 4× CPU profile with BOTH
 * throttling methods and print a side-by-side comparison.
 *
 * The DevTools number is the gate (real Chrome on real throttle).
 * The Lantern number is the early-warning signal: if it climbs sharply between
 * phases while DevTools holds, the bundle is bloating and INP/TBT will hurt
 * next. Catch it early, fix it cheap. Run at every phase checkpoint.
 */

import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const outDir = resolve(root, ".perf");
mkdirSync(outDir, { recursive: true });

const URL = process.env.PERF_URL ?? "http://localhost:3000/";

const COMMON = [
  "lighthouse",
  URL,
  "--quiet",
  "--output=json",
  "--chrome-flags=--headless=new --use-angle=metal",
];

const runs = [
  {
    label: "DevTools (real throttle — GATE)",
    out: `${outDir}/lh-devtools.json`,
    extra: ["--throttling-method=devtools"],
  },
  {
    label: "Lantern (simulated — early-warning signal)",
    out: `${outDir}/lh-lantern.json`,
    extra: ["--throttling-method=simulate"],
  },
];

function run(cmd) {
  return new Promise((res, rej) => {
    const p = spawn("pnpm", ["dlx", ...cmd], { stdio: ["ignore", "pipe", "inherit"] });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.on("close", (code) => (code === 0 ? res(out) : rej(new Error("LH exited " + code))));
  });
}

function fmt(r) {
  const a = r.audits;
  return {
    perf: r.categories.performance.score * 100,
    lcp: a["largest-contentful-paint"].displayValue,
    fcp: a["first-contentful-paint"].displayValue,
    cls: a["cumulative-layout-shift"].displayValue,
    tbt: a["total-blocking-time"].displayValue,
    si: a["speed-index"].displayValue,
    scriptKB: Math.round(
      (a["resource-summary"]?.details?.items?.find((i) => i.resourceType === "script")
        ?.transferSize ?? 0) / 1024,
    ),
    totalKB: Math.round(
      (a["resource-summary"]?.details?.items?.find((i) => i.resourceType === "total")
        ?.transferSize ?? 0) / 1024,
    ),
    lcpElement:
      a["lcp-breakdown-insight"]?.details?.items?.find((i) => i.type === "node")?.selector ??
      "n/a",
  };
}

console.log(`\n→ perf ${URL}\n`);

for (const r of runs) {
  console.log(`  running ${r.label}…`);
  await run([...COMMON, `--output-path=${r.out}`, ...r.extra]);
}

const rows = runs.map((r) => ({ label: r.label, ...fmt(JSON.parse(readFileSync(r.out, "utf8"))) }));

console.log("\n┌─ Phase perf snapshot ────────────────────────────────────");
for (const r of rows) {
  console.log(`│ ${r.label}`);
  console.log(`│   Perf ${r.perf}   LCP ${r.lcp}   FCP ${r.fcp}   CLS ${r.cls}   TBT ${r.tbt}   SI ${r.si}`);
  console.log(`│   script ${r.scriptKB} KB   total ${r.totalKB} KB   LCP elem ${r.lcpElement}`);
  console.log("│");
}
console.log("└──────────────────────────────────────────────────────────\n");

// Snapshot a tiny summary into .perf/snapshot.json so we can diff between phases
writeFileSync(
  `${outDir}/snapshot.json`,
  JSON.stringify({ at: new Date().toISOString(), runs: rows }, null, 2),
);
console.log(`  snapshot written → .perf/snapshot.json\n`);
