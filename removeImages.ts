import fs from 'fs';

let content = fs.readFileSync('src/mockData.ts', 'utf8');

// The images array looks like:
//     images: [
//       "url1",
//       "url2",
//       "url3",
//       "url4",
//       "url5",
//     ],
// We want to remove the last 3 urls from every images array.

content = content.replace(/images:\s*\[([\s\S]*?)\]/g, (match, p1) => {
  const urls = p1.split(',').filter((line: string) => line.trim() !== '');
  if (urls.length >= 3) {
    urls.splice(-3);
  } else {
    // If less than 3, maybe just keep 1? Or remove all?
    // Let's assume we remove the last 3, so if there's 4, 1 is left. If 3, 0 left. 
    urls.splice(-3); // This would remove them all if lengths are 1, 2, 3
  }
  const joined = urls.map((u: string) => u.trim() ? u + ',' : '').join('');
  // Actually let's do it precisely string manipulation so we don't ruin whitespaces.
  return match;
});

// Since the spacing is well-formatted, maybe we can just do line by line.
let lines = fs.readFileSync('src/mockData.ts', 'utf8').split('\n');
let insideImages = false;
let currentImagesGroup = [];
let newLines = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('images: [')) {
    insideImages = true;
    currentImagesGroup = [];
    newLines.push(lines[i]);
  } else if (insideImages) {
    if (lines[i].includes('],')) {
      insideImages = false;
      // remove last 3 images if we have at least 3
      if (currentImagesGroup.length >= 3) {
        currentImagesGroup.splice(-3);
      }
      newLines.push(...currentImagesGroup);
      newLines.push(lines[i]);
    } else {
      currentImagesGroup.push(lines[i]);
    }
  } else {
    newLines.push(lines[i]);
  }
}

fs.writeFileSync('src/mockData.ts', newLines.join('\n'));
console.log('Done!');
