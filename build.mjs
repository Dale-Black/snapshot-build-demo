// A tiny, dependency-free static-site generator — reads content.json and writes
// styled HTML into dist/. Stands in for "your build, your toolchain": replace it
// with Hugo, Astro, a Makefile, whatever — Snapshot just publishes dist/.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("./content.json", import.meta.url)));
mkdirSync("dist", { recursive: true });

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const nav = (cur) =>
  data.pages
    .map((p) => {
      const href = p.slug === "index" ? "./" : `${p.slug}.html`;
      const on = p.slug === cur ? ' class="font-semibold text-primary"' : ' class="link link-hover"';
      return `<a href="${href}"${on}>${esc(p.title)}</a>`;
    })
    .join('<span class="opacity-30">·</span>');

const card = (c) =>
  `<div class="card bg-base-100 shadow-sm border border-base-300"><div class="card-body gap-1">
     <h3 class="card-title text-base">${esc(c.h)}</h3><p class="text-sm text-base-content/70">${esc(c.p)}</p></div></div>`;

const page = (p) => `<!doctype html>
<html lang="en" data-theme="emerald"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)} · ${esc(data.site)}</title>
<link href="https://cdn.jsdelivr.net/npm/daisyui@5/themes.css" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
</head><body class="bg-base-200 min-h-screen">
<div class="max-w-3xl mx-auto px-5 py-10">
  <header class="flex flex-wrap items-center justify-between gap-3 mb-10">
    <a href="./" class="text-xl font-bold">${esc(data.site)}</a>
    <nav class="flex items-center gap-3 text-sm">${nav(p.slug)}</nav>
  </header>
  <main class="space-y-8">
    <section class="space-y-3">
      <h1 class="text-4xl font-bold tracking-tight">${esc(p.title)}</h1>
      <p class="text-lg text-base-content/70">${esc(p.lede)}</p>
    </section>
    <section class="grid gap-4 sm:grid-cols-3">${p.cards.map(card).join("")}</section>
  </main>
  <footer class="mt-14 pt-6 border-t border-base-300 text-sm text-base-content/60">
    ${esc(data.tagline)} — <a class="link" href="https://snapshot.show" target="_blank">snapshot.show</a>
  </footer>
</div></body></html>`;

for (const p of data.pages) {
  const file = p.slug === "index" ? "dist/index.html" : `dist/${p.slug}.html`;
  writeFileSync(file, page(p));
  console.log("  wrote", file);
}
