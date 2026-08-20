import fs from "fs";
import path from "path";

console.log("[PRERENDER ALIASES] Replicating prerendered base files for category aliases...");

const distDir = path.resolve(process.cwd(), "dist");

function copyIfExists(src, destPath, aliasName) {
  if (fs.existsSync(src)) {
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    let content = fs.readFileSync(src, 'utf8');
    if (aliasName) {
      // Create a titlecased version for the title
      const titleName = aliasName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      // Replace canonical link
      content = content.replace(/<link[^>]*rel="canonical"[^>]*>/i, `<link data-rh="true" rel="canonical" href="https://mukeshsarees.com/${aliasName}" />`);
      // Update og:url
      content = content.replace(/<meta[^>]*property="og:url"[^>]*>/i, `<meta data-rh="true" property="og:url" content="https://mukeshsarees.com/${aliasName}" />`);
      // Update titles for category aliases to be more relevant
      if (['sarees', 'lehengas', 'suits', 'coord-sets'].includes(aliasName)) {
        content = content.replace(/<title>.*?<\/title>/is, `<title>${titleName} | Mukesh Saree Centre</title>`);
        content = content.replace(/<meta[^>]*property="og:title"[^>]*>/i, `<meta data-rh="true" property="og:title" content="${titleName} | Mukesh Saree Centre" />`);
        content = content.replace(/<meta[^>]*name="twitter:title"[^>]*>/i, `<meta data-rh="true" name="twitter:title" content="${titleName} | Mukesh Saree Centre" />`);
      }
    }
    fs.writeFileSync(path.join(destPath, "index.html"), content);
    console.log(`[ALIAS OK] Created alias at /${path.basename(destPath)}`);
  }
}

// Ensure the aliases have the same index-clean shell fallback if we don't have unique SEO for them
const shellSrc = path.join(distDir, "shell.html");
const shopSrc = path.join(distDir, "shop", "index.html"); // If we want to use the rich shop render

// 1. Dynamic Search & Wishlist get the basic shell
const shellAliases = ["search", "wishlist", "cart", "checkout", "thank-you"];
for (const a of shellAliases) {
  copyIfExists(shellSrc, path.join(distDir, a), a);
}

// 2. Specialized SEO aliases
// Use the statically rendered shop page for these, since React will instantly hydrate them and load the right category filters
const shopAliases = ["sarees", "lehengas", "suits", "coord-sets"];
for (const a of shopAliases) {
    if (fs.existsSync(shopSrc)) {
         copyIfExists(shopSrc, path.join(distDir, a), a);
    } else {
         copyIfExists(shellSrc, path.join(distDir, a), a);
    }
}

// 3. Wholesale route aliases
const wholesaleSrc = path.join(distDir, "wholesalesarees", "index.html");
if (fs.existsSync(wholesaleSrc)) {
  copyIfExists(wholesaleSrc, path.join(distDir, "wholesale-sarees"), "wholesale-sarees");
  copyIfExists(wholesaleSrc, path.join(distDir, "wholesale"), "wholesale");
}

console.log("[PRERENDER ALIASES] Finished creating route aliases.");
