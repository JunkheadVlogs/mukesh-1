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

const filesToPatch = [
  ...findFiles('src', '.tsx'),
  ...findFiles('src', '.ts')
];

for (const file of filesToPatch) {
  let code = fs.readFileSync(file, 'utf-8');
  let originalCode = code;
  code = code.replace(/\+91\s*7020664641/g, '${BUSINESS_INFO.phone}');
  code = code.replace(/7020664641/g, '${BUSINESS_INFO.phone.replace(/[^0-9]/g, \'\')}');
  code = code.replace(/info@mukeshsarees\.com/g, '${BUSINESS_INFO.email}');
  code = code.replace(/Jagnath Road, Gandhibagh, \$\{BUSINESS_INFO\.address\.city\}, MH, 440002/g, '${BUSINESS_INFO.address.fullAddress}');
  code = code.replace(/Jagnath Road, Gandhibagh.*440002/g, '${BUSINESS_INFO.address.fullAddress}');
  code = code.replace(/Jagnath Road/g, '${BUSINESS_INFO.address.street}');
  code = code.replace(/Gandhibagh/g, '${BUSINESS_INFO.address.area}');
  code = code.replace(/440002/g, '${BUSINESS_INFO.address.postalCode}');
  if (code !== originalCode) {
    fs.writeFileSync(file, code);
  }
}
