import fs from 'fs';
import path from 'path';

function findFiles(dir: string, extension: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extension));
    } else if (file.endsWith(extension)) {
      results.push(filePath);
    }
  }
  return results;
}

const files = findFiles('src', '.tsx').concat(findFiles('src', '.ts'));

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  let originalCode = code;

  code = code.replace(/>info@mukeshsarees\.com<\/a>/g, '>{BUSINESS_INFO.email}</a>');
  
  if (code !== originalCode) {
    fs.writeFileSync(file, code);
  }
}
