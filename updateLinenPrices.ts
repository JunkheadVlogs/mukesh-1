import * as fs from 'fs';

let content = fs.readFileSync('src/mockData.ts', 'utf8');

const regex = /(slug:\s*"pure-linen-[^"]+",\s*price:\s*)599(,\s*originalPrice:\s*)1199/g;
content = content.replace(regex, '$1699$21399');

fs.writeFileSync('src/mockData.ts', content);
