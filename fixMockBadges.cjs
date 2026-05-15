const fs = require('fs');
let content = fs.readFileSync('src/mockData.ts', 'utf8');

// We want to distribute the flags.
// Right now, almost all products have:
//     isNew: true,
//     isTrending: true,

// Let's replace those two lines with a placeholder, then replace placeholders one by one using a round-robin rotation.

content = content.replace(/isNew:\s*true,[\s\n]*isTrending:\s*true,?\n[\s]*/g, '___FLAG_PLACEHOLDER___\n    ');

let count = 0;
content = content.replace(/___FLAG_PLACEHOLDER___/g, () => {
    count++;
    if (count % 4 === 0) {
        return 'isBestSelling: true,\n';
    } else if (count % 4 === 1) {
        return 'isNew: true,\n';
    } else if (count % 4 === 2) {
        return 'isTrending: true,\n';
    } else {
        return ''; // no badge
    }
});

fs.writeFileSync('src/mockData.ts', content);
console.log(`Replaced flags for ${count} products.`);
