import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicHtmlDir = path.join(__dirname, '..', 'public_html');

const OLD_TOKEN = 'your_fb_domain_verify_token';
const NEW_TOKEN = 'kjvbvikfmctlsdfygll3tadkpzty8a';

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walkDir(filepath, callback);
    } else {
      callback(filepath);
    }
  }
}

console.log('Starting global Facebook Verification token replacement in public_html...');

let count = 0;
walkDir(publicHtmlDir, (filePath) => {
  if (filePath.endsWith('.html') || filePath.endsWith('.php')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(OLD_TOKEN)) {
      content = content.replace(new RegExp(OLD_TOKEN, 'g'), NEW_TOKEN);
      fs.writeFileSync(filePath, content, 'utf8');
      count++;
      console.log(`Updated: ${path.relative(publicHtmlDir, filePath)}`);
    }
  }
});

console.log(`Successfully updated ${count} file(s) in public_html!`);
