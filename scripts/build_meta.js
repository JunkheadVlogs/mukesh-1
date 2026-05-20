import fs from 'fs';
import path from 'path';
import { products } from '../src/mockData.js';

try {
  console.log(`[build_meta] Natively importing products... Loaded ${products?.length || 0} products.`);
  
  const preParsedProducts = (products || []).map(p => {
    let cleanDesc = p.description || "";
    // Strips markdown, HTML elements, and extra whitespace for social tags
    cleanDesc = cleanDesc
      .replace(/\*\*/g, "")
      .replace(/<[^>]*>?/gm, "")
      .replace(/•/g, "-")
      .substring(0, 150)
      .replace(/\s+/g, ' ')
      .trim();

    return {
      name: p.name,
      slug: p.slug,
      description: cleanDesc,
      image: p.image,
      price: String(p.price || "")
    };
  });

  const distPath = path.join(process.cwd(), "dist");
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const publicPath = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  // Write to both dist (production distribution) and public (fallback/dev server references)
  fs.writeFileSync(path.join(distPath, "products-meta.json"), JSON.stringify(preParsedProducts, null, 2));
  fs.writeFileSync(path.join(publicPath, "products-meta.json"), JSON.stringify(preParsedProducts, null, 2));

  console.log(`[build_meta] Successfully compiled and verified ${preParsedProducts.length} product metadata files.`);
} catch (e) {
  console.error("[build_meta] Error building product meta natively:", e);
  process.exit(1);
}
