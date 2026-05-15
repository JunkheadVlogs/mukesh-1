import fs from 'fs';
let content = fs.readFileSync('src/mockData.ts', 'utf8');
content = content.replace(/- \*\*(.*?)\*\*/g, '- $1');
fs.writeFileSync('src/mockData.ts', content);
