import fs from "fs";
import path from "path";

console.log("\n--- [BUILD] Running Post-Build HTML Performance Optimizations ---");

const distDir = path.resolve(process.cwd(), "dist");

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
} else {
  console.error("[PERFORMANCE] Error: dist/ directory does not exist.");
  process.exit(1);
}
