import fs from 'fs';

let content = fs.readFileSync('src/mockData.ts', 'utf8');

const regex = /\*\*Care Instructions\*\*\nMachine wash or gentle hand wash in cold water\. Dry in shade to protect the colors\./g;

content = content.replace(regex, '**Care Instructions**\nWashable and durable. Hand wash recommended.');

fs.writeFileSync('src/mockData.ts', content);
