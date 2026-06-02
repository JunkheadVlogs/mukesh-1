const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace simple white backgrounds with transparent or primary-50 for a flatter look where appropriate, 
  // but let's safely only target specific classes to avoid breaking `bg-white/90` or `bg-white/50`.
  // The user said: "Use off-white / beige background instead of plain white".
  // Let's replace exactly `bg-white ` or `bg-white"` with `bg-primary-50 ` or `bg-primary-50"` where it makes sense, or just rely on body bg.
  // We'll replace all explicit bg-white with bg-primary-50 to make everything blend in or use beige cards.
  content = content.replace(/bg-white([^a-zA-Z0-9\/-])/g, 'bg-primary-50$1');

  // We should also replace bg-[#FAF9F6] which was used previously
  content = content.replace(/bg-\[\#FAF9F6\]/g, 'bg-primary-50');

  // Replace greens
  content = content.replace(/text-green-600/g, 'text-gold-600');
  content = content.replace(/text-green-700/g, 'text-gold-600');
  content = content.replace(/border-green-200\/50/g, 'border-gold-200/50');
  content = content.replace(/bg-green-50\/50/g, 'bg-primary-100/50');
  
  // Replace reds
  content = content.replace(/text-red-500/g, 'text-primary-600');
  content = content.replace(/bg-red-50\/50/g, 'bg-primary-100/50');
  content = content.replace(/border-red-100/g, 'border-primary-200');
  content = content.replace(/text-\[\#E53935\]/g, 'text-primary-700');
  
  fs.writeFileSync(filePath, content);
}

const dir = 'src';
const files = fs.readdirSync(dir);
files.forEach(file => {
  if (file.endsWith('.tsx')) {
    replaceInFile(path.join(dir, file));
  }
});
