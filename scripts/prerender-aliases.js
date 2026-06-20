import fs from "fs";
import path from "path";

console.log("[PRERENDER ALIASES] Replicating prerendered base files for category aliases...");

const distDir = path.resolve(process.cwd(), "dist");

function copyIfExists(src, destPath) {
  if (fs.existsSync(src)) {
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    fs.copyFileSync(src, path.join(destPath, "index.html"));
    console.log(`[ALIAS OK] Created alias at /${path.basename(destPath)}`);
  }
}

// Ensure the aliases have the same index-clean shell fallback if we don't have unique SEO for them
const shellSrc = path.join(distDir, "shell.html");
const shopSrc = path.join(distDir, "shop", "index.html"); // If we want to use the rich shop render

// 1. Dynamic Search & Wishlist get the basic shell
const shellAliases = ["search", "wishlist", "cart", "checkout", "thank-you"];
for (const a of shellAliases) {
  copyIfExists(shellSrc, path.join(distDir, a));
}

// 2. Specialized SEO aliases
// Use the statically rendered shop page for these, since React will instantly hydrate them and load the right category filters
const shopAliases = ["sarees", "lehengas", "suits", "coord-sets"];
for (const a of shopAliases) {
    if (fs.existsSync(shopSrc)) {
         copyIfExists(shopSrc, path.join(distDir, a));
    } else {
         copyIfExists(shellSrc, path.join(distDir, a));
    }
}

console.log("[PRERENDER ALIASES] Finished creating route aliases.");
