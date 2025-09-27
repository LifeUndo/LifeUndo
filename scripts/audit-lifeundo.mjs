import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const BASE = "https://lifeundo.ru";
const MUST_200 = [
  "/", "/fund", "/ok", "/buy"
];
const SHOULD_EXIST = [
  // Добавляй сюда новые страницы по мере появления
];

const EXT_LINKS_TARGET_BLANK_NEEDS_NOOPENER = true;

function abs(u){ return u.startsWith("http") ? u : `${BASE}${u.startsWith("/")? "": "/"}${u}`; }

async function head(url){
  const r = await fetch(url, { method: "GET", redirect: "follow" });
  return { url, status: r.status, finalUrl: r.url, html: await r.text() };
}

function checkSocials(document){
  const socials = [
    { name: "Telegram", ariaLabel: "Telegram" },
    { name: "X", ariaLabel: "X (Twitter)" },
    { name: "Reddit", ariaLabel: "Reddit" },
    { name: "YouTube", ariaLabel: "YouTube" },
    { name: "VK", ariaLabel: "VK" },
    { name: "Dzen", ariaLabel: "Dzen" },
    { name: "Habr", ariaLabel: "Habr" },
    { name: "vc.ru", ariaLabel: "vc.ru" },
    { name: "TenChat", ariaLabel: "TenChat" },
  ];
  const problems = [];
  for (const {name, ariaLabel} of socials){
    const a = document.querySelector(`a[aria-label="${ariaLabel}"]`);
    if(!a) problems.push(`social icon missing: ${name}`);
    else {
      if (a.getAttribute("target") === "_blank" && EXT_LINKS_TARGET_BLANK_NEEDS_NOOPENER) {
        const rel = (a.getAttribute("rel")||"").toLowerCase();
        if (!rel.includes("noopener")) problems.push(`noopener missing: ${name}`);
      }
      // Check if it's an SVG icon
      const svg = a.querySelector("svg");
      if (!svg) problems.push(`social icon not SVG: ${name}`);
    }
  }
  return problems;
}

function checkFKBadge(document){
  const imgs = [...document.querySelectorAll("img")];
  const has = imgs.some(img => {
    const src = (img.getAttribute("src")||"").toLowerCase();
    return src.includes("free-kassa") || src.includes("freekassa") || src.includes("fk_btn");
  });
  return has ? [] : ["FreeKassa badge missing in footer"];
}

function checkFundBadge(document){
  const text = document.body.textContent || "";
  return /10%\s*(net|чистой|отдаём|give)/i.test(text) ? [] : ["10% Fund text missing"];
}

function checkMeta(document){
  const problems = [];
  
  // Check canonical link
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) problems.push("canonical link missing");
  else if (!canonical.href.startsWith(BASE)) problems.push("canonical link incorrect");
  
  // Check og:title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) problems.push("og:title missing");
  
  // Check og:description
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) problems.push("og:description missing");
  
  // Check meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) problems.push("meta description missing");
  
  return problems;
}

function listLinks(document){
  const as = [...document.querySelectorAll("a[href]")];
  const internal = [], external = [];
  for (const a of as) {
    const href = a.getAttribute("href");
    if (!href) continue;
    if (href.startsWith("http")) {
      if (href.startsWith(BASE)) internal.push(href);
      else external.push(href);
    } else {
      internal.push(abs(href));
    }
  }
  return { internal: [...new Set(internal)], external: [...new Set(external)] };
}

(async () => {
  const report = [];
  for (const path of MUST_200) {
    const r = await head(abs(path));
    report.push({ path, status: r.status, finalUrl: r.finalUrl });
    if (r.status !== 200) console.log(`[FAIL] ${path} -> ${r.status} (${r.finalUrl})`);
    // HTML checks
    const dom = new JSDOM(r.html);
    const doc = dom.window.document;
    const problems = [
      ...checkSocials(doc),
      ...checkFKBadge(doc),
      ...checkFundBadge(doc),
      ...checkMeta(doc),
    ];
    if (problems.length) console.log(`[WARN] ${path}: ${problems.join(" | ")}`);
    const { internal, external } = listLinks(doc);
    // Ping internal links (depth 1)
    for (const u of internal) {
      const ri = await head(u);
      if (ri.status >= 400) console.log(`[BROKEN] ${path} -> ${u} (${ri.status})`);
    }
  }
  console.log("DONE");
  process.exit(0);
})();
