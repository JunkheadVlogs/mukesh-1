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
      }
    }
  }
  
  // ensure dist directory exists
  const distPath = path.join(process.cwd(), "dist");
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  
  fs.writeFileSync(path.join(distPath, "products-meta.json"), JSON.stringify(preParsedProducts, null, 2));
  console.log(`[build_meta] Successfully saved ${preParsedProducts.length} products to dist/products-meta.json`);
} catch (e) {
  console.error("[build_meta] Error building product meta:", e);
}
