#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const token = process.argv[2] ? process.argv[2].trim() : '';

if (!token) {
  console.error('\n❌ Error: No token provided.');
  console.log('Usage: npm run set:token <YOUR_GITHUB_TOKEN>');
  console.log('   or: node scripts/set-token.js <YOUR_GITHUB_TOKEN>\n');
  process.exit(1);
}

const tokenPath = path.join(process.cwd(), '.github-token');
fs.writeFileSync(tokenPath, token + '\n', 'utf8');

console.log('\n✔ Successfully saved GitHub token to .github-token (file is gitignored).');
console.log('You can now run:');
console.log('   npm run diagnose:github');
console.log('   npm run push:github\n');
