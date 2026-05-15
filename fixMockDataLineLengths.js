import fs from 'fs';
let content = fs.readFileSync('src/mockData.ts', 'utf8');

// remove lines like:
// - Saree Length: 5.50 meters
// - Blouse Piece Length: 1.00 meter (Unstitched)
// - Saree Width: 1.06 meters (approx. 42-44 inches)
content = content.replace(/- Saree Length:[^\n]+\n/ig, '');
content = content.replace(/- Blouse [^\n]+\n/ig, '');
content = content.replace(/- Saree Width:[^\n]+\n/ig, '');

fs.writeFileSync('src/mockData.ts', content);
