import * as fs from 'fs';

const content = fs.readFileSync('src/mockData.ts', 'utf-8');
const imagesRegex = /images: \[\s*([\s\S]*?)\s*\]/g;
let match;
const imageOccurrences: Record<string, number[]> = {};

while ((match = imagesRegex.exec(content)) !== null) {
  const images = match[1].split(',').map(s => s.trim().replace(/"/g, '')).filter(s => s.length > 0);
  images.forEach((img, index) => {
    if (!imageOccurrences[img]) imageOccurrences[img] = [];
    imageOccurrences[img].push(index);
  });
}

console.log('Image occurrences:');
for (const [img, indices] of Object.entries(imageOccurrences)) {
  if ((indices as number[]).length > 1) {
    console.log(`${img}: ${(indices as number[]).length} times at indices ${(indices as number[]).join(', ')}`);
  }
}
