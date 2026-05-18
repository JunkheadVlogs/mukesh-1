import fs from 'fs';
import path from 'path';

let preParsedProducts = [];
try {
  const mockDataPath = path.join(process.cwd(), "src", "mockData.ts");
  if (fs.existsSync(mockDataPath)) {
    const tsContent = fs.readFileSync(mockDataPath, "utf-8");
    const productBlocks = tsContent.split('id:');
    for (const block of productBlocks) {
      const nameMatch = block.match(/name:\s*["']([^"']+)["']/);
      const slugMatch = block.match(/slug:\s*["']([^"']+)["']/);
      const descMatch = block.match(/description:\s*`([^`]+)`/);
      const imgMatch = block.match(/image:\s*["']([^"']+)["']/);
      const priceMatch = block.match(/price:\s*(\d+)/);
      
      if (nameMatch && slugMatch && descMatch && imgMatch) {
         preParsedProducts.push({
           name: nameMatch[1],
           slug: slugMatch[1],
           description: descMatch[1].replace(/<[^>]*>?/gm, '').substring(0, 150).replace(/\n/g, " "),
           image: imgMatch[1],
           price: priceMatch ? priceMatch[1] : ""
         });
      } else {
         if (nameMatch) {
           console.log("Failed to parse something for", nameMatch[1], {
             hasSlug: !!slugMatch,
             hasDesc: !!descMatch,
             hasImg: !!imgMatch
           });
         }
      }
    }
  }
} catch (e) {
  console.log("Error:", e);
}
console.log(`Parsed ${preParsedProducts.length} products`);
console.log(preParsedProducts[0]);

