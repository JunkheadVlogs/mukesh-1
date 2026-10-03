import fs from "fs";
import path from "path";

console.log("[PRERENDER ALIASES] Replicating prerendered base files for category aliases...");

const distDir = path.resolve(process.cwd(), "dist");
const publicHtmlDir = path.resolve(process.cwd(), "public_html");

// Ensure the aliases have the same index-clean shell fallback if we don't have unique SEO for them
const shellSrc = path.join(distDir, "shell.html");

// 1. Dynamic Search, Wishlist & Thank You get the basic shell with semantic H1 injected
const shellAliases = [
  { name: "search", h1: "Search Collection", title: "Search Ethnic Wear & Sarees" },
  { name: "wishlist", h1: "Your Wishlist", title: "Your Curated Wishlist" },
  { name: "thank-you", h1: "Order Confirmation", title: "Thank You For Your Order" }
];

for (const a of shellAliases) {
  if (fs.existsSync(shellSrc)) {
    const destPath = path.join(distDir, a.name);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    let content = fs.readFileSync(shellSrc, 'utf8');
    content = content.replace(/<title>.*?<\/title>/is, `<title>${a.title} | Mukesh Saree Centre</title>`);
    content = content.replace(/<link\s+[^>]*rel=['"]canonical['"][^>]*>\s*/gi, '');
    content = content.replace('</head>', `    <link data-rh="true" rel="canonical" href="https://mukeshsarees.com/${a.name}/" />\n</head>`);
    // Inject H1 into root so crawlers find it immediately before JS hydration
    const h1Injection = `<div style="text-align:center;padding:40px 20px;"><h1 style="font-family:'Playfair Display',serif;font-size:32px;color:#1a0a00;">${a.h1}</h1></div>`;
    content = content.replace(/<div id="root">.*?<\/div>/is, `<div id="root">${h1Injection}</div>`);

    fs.writeFileSync(path.join(destPath, "index.html"), content);

    if (fs.existsSync(publicHtmlDir)) {
      const pubDest = path.join(publicHtmlDir, a.name);
      if (!fs.existsSync(pubDest)) {
        fs.mkdirSync(pubDest, { recursive: true });
      }
      fs.writeFileSync(path.join(pubDest, "index.html"), content);
    }
    console.log(`[ALIAS OK] Created shell alias at /${a.name} with H1`);
  }
}

// 2. Note: 'sarees', 'lehengas', and 'suits' are generated natively with unique content, titles, H1s, and filters in prerender.ts — do NOT overwrite them!

// 3. Wholesale route aliases — 301 redirect to primary /wholesale-sarees-nagpur/
const primaryWholesaleUrl = "https://mukeshsarees.com/wholesale-sarees-nagpur/";
const wholesaleRedirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${primaryWholesaleUrl}">
  <link rel="canonical" href="${primaryWholesaleUrl}">
  <title>Redirecting to Wholesale Sarees Nagpur | Mukesh Saree Centre</title>
  <script>window.location.replace("${primaryWholesaleUrl}");</script>
</head>
<body>
  <p>Redirecting to <a href="${primaryWholesaleUrl}">Wholesale Sarees Nagpur</a>...</p>
</body>
</html>`;

for (const alias of ["wholesale-sarees", "wholesale", "wholesalesarees"]) {
  const destPath = path.join(distDir, alias);
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }
  fs.writeFileSync(path.join(destPath, "index.html"), wholesaleRedirectHtml);

  if (fs.existsSync(publicHtmlDir)) {
    const pubDest = path.join(publicHtmlDir, alias);
    if (!fs.existsSync(pubDest)) {
      fs.mkdirSync(pubDest, { recursive: true });
    }
    fs.writeFileSync(path.join(pubDest, "index.html"), wholesaleRedirectHtml);
  }
  console.log(`[ALIAS REDIRECT OK] Created 301 redirect alias at /${alias} -> ${primaryWholesaleUrl}`);
}

console.log("[PRERENDER ALIASES] Finished creating route aliases.");
