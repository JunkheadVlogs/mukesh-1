import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const traverse = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath);
    } else if (stat.isFile() && /\.html$/.test(file) && file !== 'index-clean.html') {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for Unicode Replacement Character, Windows-1252 anomalies, and UTF-8 BOM
      const artifacts = [/â€/g, /Ã/g, /ï»¿/g, /\uFFFD/g];
      let hasError = false;
      
      for (const artifact of artifacts) {
          if (artifact.test(content)) {
              console.error(`Encoding artifact found in ${fullPath}: ${artifact}`);
              hasError = true;
          }
      }

      // Check root container content
      if (content.match(/<div id="root">\s*<\/div>/)) {
          console.error(`Validation Error: Empty root container found in ${fullPath}`);
          hasError = true;
      }
      const pureClientRoutes = ['/cart/', '/wishlist/', '/checkout/', '/thank-you/', '/search/', 'shell.html'];
      const isPureClientRoute = pureClientRoutes.some(route => fullPath.replace(/\\/g, '/').includes(route));
      
      if (!isPureClientRoute && content.match(/<div class="loading-spinner">/)) {
          console.error(`Validation Error: Loading placeholder still present in root container of ${fullPath}`);
          hasError = true;
      }
      
      // Additional checks for specific pages
      if (fullPath.includes('/shop/') || fullPath.includes('/sarees/') || fullPath.includes('/coord-sets/')) {
        if (!content.includes('style="background-color: #faf6f0')) {
             console.error(`Validation Error: Missing content in shop/collection page: ${fullPath}`);
             hasError = true;
        }
      }
      
      if (hasError) {
          process.exit(1);
      }
    }
  }
};

console.log("Validating generated HTML pages for encoding artifacts and empty root containers...");
traverse(path.join(__dirname, '..', 'dist'));
console.log("Validation passed! Built HTML verified successfully.");
