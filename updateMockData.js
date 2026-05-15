import fs from 'fs';

const mockDataPath = 'src/mockData.ts';
let content = fs.readFileSync(mockDataPath, 'utf8');

const products = content.split(/id:\s*"(p\d+)"/);
const newProducts = [products[0]];

const catMap = { 'Sarees': 'SAR', 'Co-Ord Sets': 'CRD' };
const fabMap = { 'Cotton': 'COT', 'Linen': 'LIN', 'Chiffon': 'CHI', 'Khadi': 'KHA', 'Georgette': 'GEO' };
const colMap = { 'White': 'WHT', 'Black': 'BLK', 'Yellow': 'YEL', 'Green': 'GRN', 'Red': 'RED', 'Pink': 'PNK', 'Blue': 'BLU', 'Grey': 'GRY', 'Beige': 'BGE', 'Lavender': 'LAV', 'Peach': 'PCH', 'Plum': 'PLM', 'Teal': 'TEL', 'Wine': 'WIN', 'Berry': 'BRY', 'Sky': 'SKY', 'Lime': 'LME', 'Rani': 'RNP', 'Cocoa': 'COA' };

function getCode(val, map) {
  if (!val) return 'OTH';
  for (const [key, code] of Object.entries(map)) {
    if (val.toLowerCase().includes(key.toLowerCase())) return code;
  }
  return val.substring(0, 3).toUpperCase();
}

let skuCounters = {};
let outputData = [];

for (let i = 1; i < products.length; i += 2) {
  const id = products[i];
  let body = products[i+1];

  const nameMatch = body.match(/name:\s*"(.*?)"/);
  const categoryMatch = body.match(/category:\s*"(.*?)"/);
  const fabricMatch = body.match(/fabric:\s*"(.*?)"/);
  const colorMatch = body.match(/color:\s*"(.*?)"/);

  const name = nameMatch ? nameMatch[1] : 'Unknown';
  const category = categoryMatch ? categoryMatch[1] : 'Sarees';
  const fabric = fabricMatch ? fabricMatch[1] : 'Linen';
  const color = colorMatch ? colorMatch[1] : 'Multi';

  const catC = getCode(category, catMap);
  const fabC = getCode(fabric, fabMap);
  const colC = getCode(color, colMap);

  const baseSku = `${catC}-${fabC}-${colC}`;
  skuCounters[baseSku] = (skuCounters[baseSku] || 0) + 1;
  const sku = `${baseSku}-${skuCounters[baseSku].toString().padStart(3, '0')}`;

  // Replace or add SKU
  if (body.includes('sku:')) {
    body = body.replace(/sku:\s*".*?"/, `sku: "${sku}"`);
  } else {
    // If no SKU, insert it after the ID comma
    body = `,\n    sku: "${sku}"${body}`;
  }

  // Update pricing for last 3 Linen listings (p31, p32, p33)
    if (id === 'p31' || id === 'p32' || id === 'p33') {
    body = body.replace(/price:\s*\d+/, 'price: 699');
    body = body.replace(/originalPrice:\s*\d+/, 'originalPrice: 1399');
    
    // Title optimization
    let newTitle = name;
    if (id === 'p31') newTitle = 'Premium White & Aqua Green Pure Linen Saree';
    if (id === 'p32') newTitle = 'Elegant White & Pink Floral Pure Linen Saree';
    if (id === 'p33') newTitle = 'Sophisticated Navy Blue Printed Pure Linen Saree';
    body = body.replace(/name:\s*"(.*?)"/, `name: "${newTitle}"`);
    
    if (body.includes('stock:')) {
      body = body.replace(/stock:\s*\d+/, 'stock: 12');
    } else {
      body = body.replace(/category:/, `stock: 12,\n    category:`);
    }

    outputData.push({ name: newTitle, sku, id });
  }

  newProducts.push(`id: "${id}"${body}`);
}

fs.writeFileSync(mockDataPath, newProducts.join(''));
console.log('--- OUTPUT FOR USER ---');
outputData.forEach(p => {
  console.log(`Product Name: ${p.name}`);
  console.log(`SKU: ${p.sku}`);
  console.log(`Selling Price: ₹699`);
  console.log(`MRP: ₹1399`);
  console.log(`Discount %: 50%`);
  console.log(`Viewing Count Range: 8-35`);
  console.log(`Urgency Text: Selling fast today`);
  console.log('');
});
