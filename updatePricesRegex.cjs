const fs = require('fs');

let content = fs.readFileSync('src/mockData.ts', 'utf-8');

// Replace price and originalPrice using a regex that matches the whole object
// A product object starts with { and has a category somewhere inside.
const p = content.split('  {');

for (let i = 1; i < p.length; i++) {
  if (p[i].includes('category: "Co-Ord Sets"') || p[i].includes('category: "Co-ord Sets"')) {
    p[i] = p[i].replace(/price:\s*\d+,/, 'price: 1999,');
    p[i] = p[i].replace(/originalPrice:\s*\d+,/, 'originalPrice: 3998,');
  } else if (p[i].includes('category: "Sarees"')) {
    p[i] = p[i].replace(/price:\s*\d+,/, 'price: 1499,');
    p[i] = p[i].replace(/originalPrice:\s*\d+,/, 'originalPrice: 2998,');
  }
}

fs.writeFileSync('src/mockData.ts', p.join('  {'));
console.log("Updated mockData.ts");
