import fs from 'fs';

const mockDataContent = fs.readFileSync('./src/mockData.ts', 'utf8');

const variantsStr = `    colorVariants: [
      { color: "Cocoa Brown", image: "https://drive.google.com/thumbnail?id=1Yy5HQ-XE4aulexv5D7WXiewiVYPHp52F&sz=w500", slug: "premium-pure-cotton-coord-set" },
      { color: "Forest Green", image: "https://drive.google.com/thumbnail?id=1r0D-1RA8fSbXkhKrhvkNz91Ny9yRE_DI&sz=w500", slug: "elegant-forest-green-cotton-coord-set" },
      { color: "Royal Plum", image: "https://drive.google.com/thumbnail?id=1T30aeMCN2CKJk7sOszn2zaap__mDXp9p&sz=w500", slug: "royal-plum-cotton-coord-set-embroidery" },
      { color: "Teal Green", image: "https://drive.google.com/thumbnail?id=1OklbiWw6fH97r8mCWsw3VxdkvwAqvxFe&sz=w500", slug: "elegant-teal-green-cotton-coord-set-floral-embroidery" },
      { color: "Wine Berry", image: "https://drive.google.com/thumbnail?id=1yqH8sha_dRXlYAOzvSP5Cu-ucdvMM-7x&sz=w500", slug: "wine-berry-cotton-coord-set-elegant-embroidery" },
      { color: "Blush Pink", image: "https://drive.google.com/thumbnail?id=1GQSTuioaQUwqW5dZ44_S5yLjk6ysO-IP&sz=w500", slug: "soft-blush-pink-cotton-coord-set-delicate-embroidery" },
      { color: "Blush Pink 2", image: "https://drive.google.com/thumbnail?id=1kd_DfaDfoE8QDUtgnwghy8P2yINg6JMm&sz=w500", slug: "soft-blush-pink-cotton-coord-set-multicolor-embroidery" },
      { color: "Blush Pink 3", image: "https://drive.google.com/thumbnail?id=1FBDhDE-bgCLEmRNLLijehssSMcJHxYGN&sz=w500", slug: "soft-blush-pink-cotton-coord-set-multicolor-embroidery-2" },
    ],`;

let updatedContent = mockDataContent;

const productsToUpdate = [
    { sku: "COORD-COCOA-001", id: "p4", slug: "premium-pure-cotton-coord-set" },
    { sku: "COORD-GRN-001", id: "p12", slug: "elegant-forest-green-cotton-coord-set" },
    { sku: "COORD-PLUM-001", id: "p13", slug: "royal-plum-cotton-coord-set-embroidery" },
    { sku: "COORD-TEAL-001", id: "p14", slug: "elegant-teal-green-cotton-coord-set-floral-embroidery" },
    { sku: "COORD-WINE-001", id: "p15", slug: "wine-berry-cotton-coord-set-elegant-embroidery" },
    { sku: "COORD-PINK-001", id: "p16", slug: "soft-blush-pink-cotton-coord-set-delicate-embroidery" },
    { sku: "COORD-PINK-002", id: "p17", slug: "soft-blush-pink-cotton-coord-set-multicolor-embroidery" },
    { sku: "COORD-PINK-003", id: "p18", slug: "soft-blush-pink-cotton-coord-set-multicolor-embroidery-2" },
];

productsToUpdate.forEach(prod => {
    // find the block
    const re = new RegExp(`(id: "${prod.id}"[\\s\\S]*?fabric: "100% Pure Cotton",[\\s\\S]*?color: "[^"]+",)`);
    updatedContent = updatedContent.replace(re, `$1\n${variantsStr}`);
});

fs.writeFileSync('./src/mockData.ts', updatedContent);
console.log("Updated mockData.ts with variants.");
