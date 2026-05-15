import fs from 'fs';
const path = 'src/mockData.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/id:\s*"(p\d+),/g, 'id: "$1",');
fs.writeFileSync(path, content);
console.log('Fixed quotes.');
