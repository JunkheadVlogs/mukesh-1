import { mockProducts } from './src/mockData';
const fs = require('fs');

const updated = mockProducts.map(p => {
  if (p.category === 'Co-Ord Sets' || p.category === 'Co-ord Sets') {
    p.price = 1999;
    p.originalPrice = 3998;
  } else if (p.category === 'Sarees') {
    p.price = 1499;
    p.originalPrice = 2998;
  }
  return p;
});

// Since mockData.ts exports a const array, we need to rewrite the file carefully.
console.log(updated.map(p => p.price));
