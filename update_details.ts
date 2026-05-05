import fs from 'fs';

let content = fs.readFileSync('src/mockData.ts', 'utf8');
content = content.replace(/\*\*3\. Bullet Points\*\*/g, '**3. Details**');
fs.writeFileSync('src/mockData.ts', content);
