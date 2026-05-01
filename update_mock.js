const fs = require('fs');
let content = fs.readFileSync('src/mockData.ts', 'utf-8');

content = content.replace(
  'name: "Cocoa Brown Cotton Co-Ord Set 🤎 | Soft & Elegant | ₹995 | COD Available",',
  'name: "Cocoa Brown Cotton Co-Ord Set 🤎",\n    tagline: "Soft & Elegant",'
);
content = content.replace(
  'name: "White & Pink Cotton Floral Co-Ord Set 🌸 | Lightweight & Elegant | ₹995 | COD Available",',
  'name: "White & Pink Cotton Floral Co-Ord Set 🌸",\n    tagline: "Lightweight & Elegant",'
);
content = content.replace(
  'name: "Beige Cotton Floral Co-Ord Set 🌸 | Soft & Breathable | ₹995 | COD Available",',
  'name: "Beige Cotton Floral Co-Ord Set 🌸",\n    tagline: "Soft & Breathable",'
);
content = content.replace(
  'name: "White Cotton Floral Co-Ord Set 🌼 | Airy & Gentle | ₹995 | COD Available",',
  'name: "White Cotton Floral Co-Ord Set 🌼",\n    tagline: "Airy & Gentle",'
);
content = content.replace(
  'name: "Grey Cotton Embroidered Co-Ord Set 🩶 | Comfortable & Minimal | ₹995 | COD Available",',
  'name: "Grey Cotton Embroidered Co-Ord Set 🩶",\n    tagline: "Comfortable & Minimal",'
);

fs.writeFileSync('src/mockData.ts', content, 'utf-8');
