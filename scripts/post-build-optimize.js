import fs from "fs";
import path from "path";

console.log("\n--- [BUILD] Running Post-Build HTML Performance Optimizations & Validation ---");

const distDir = path.resolve(process.cwd(), "dist");

let hasValidationErrors = false;

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

if (fs.existsSync(distDir)) {
  let count = 0;
  walkDir(distDir, (filePath) => {
    if (filePath.endsWith(".html")) {
      const content = fs.readFileSync(filePath, "utf-8");
      
// BUILD VALIDATION
      let validationStatus = "UNKNOWN";

      // Check if root is effectively empty or contains only loading skeletons
      const rootRegex = /<div id="root">\s*(?:<div class="loading-wrapper">[\s\S]*?<\/div>\s*|(?:Loading\.\.\.)?\s*)<\/div>/i;
      const isEmpty = rootRegex.test(content) || content.includes('<div id="root"></div>') || content.includes('<div id="root">\n</div>') || content.includes('Loading...');
      
      const isShopOrCollection = filePath.includes('/shop/index.html') || filePath.includes('/sarees/') || filePath.includes('/lehengas/index.html') || filePath.includes('/suits/index.html') || filePath.includes('/coord-sets/index.html');

      let missingShopContent = false;
      if (isShopOrCollection) {
        const hasContainer = content.includes('grid-template-columns');
        const hasHeading = content.includes('<h1');
        if (!hasContainer || !hasHeading) {
          missingShopContent = true;
        }
      }

      if (isEmpty && !filePath.endsWith('index-clean.html')) {
        console.error(`[VALIDATION FAILED] The HTML file at ${filePath} contains an empty or unrendered React root. Prerender failed for this page.`);
        hasValidationErrors = true;
        validationStatus = "EMPTY ROOT";
      } else if (isShopOrCollection && missingShopContent) {
        console.error(`[VALIDATION FAILED] The HTML file at ${filePath} is missing required collection content (grid/heading).`);
        hasValidationErrors = true;
        validationStatus = "MISSING CONTENT";
      } else {
        validationStatus = "PASSED";
      }

      console.log(`[VALIDATION REPORT] ${filePath} -> ${validationStatus}`);

      let hasChange = false;
      // Convert render-blocking stylesheets to high performance async loading preloads
      const optimized = content.replace(/<link rel="stylesheet"([^>]*)href="([^"]+)"([^>]*)>/gi, (match, p1, href, p2) => {
        // Skip tags already optimized to prevent double transformation
        if (match.includes('rel="preload"') || match.includes('as="style"')) {
          return match;
        }
        
        hasChange = true;
        const isCrossOn = match.includes('crossorigin');
        const crossAttr = isCrossOn ? ' crossorigin' : '';
        
        return `<link rel="preload" href="${href}" as="style"${crossAttr} onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"${crossAttr}></noscript>`;
      });
      
      if (hasChange) {
        fs.writeFileSync(filePath, optimized, "utf-8");
        count++;
      }
    }
  });
  console.log(`[PERFORMANCE] Successfully made all CSS assets non-render-blocking in ${count} built and pre-rendered HTML file(s).`);

  if (hasValidationErrors) {
      console.error("\n[CRITICAL FAILURE] Automated Build Validation Failed. One or more pages have an empty HTML root.");
      process.exit(1);
  } else {
      console.log("[VALIDATION OK] All generated HTML files contain statically rendered content inside the root container.");
  }
  
  // HOSTINGER PREPARATION: Create fallback shell
  const indexCleanPath = path.join(distDir, 'index-clean.html');
  const shellPath = path.join(distDir, 'shell.html');
  if (fs.existsSync(indexCleanPath)) {
      fs.copyFileSync(indexCleanPath, shellPath);
      console.log("[HOSTINGER OK] Created shell.html fallback logic for Hostinger Single Page Routing.");
  }
} else {
  console.error("[PERFORMANCE] Error: dist/ directory does not exist.");
  process.exit(1);
}

