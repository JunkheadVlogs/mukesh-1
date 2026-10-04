import fs from "fs";
import path from "path";
import { products } from "../src/mockData";

async function generateProductFeed() {
  const publicHtmlFeed = path.resolve(process.cwd(), "public_html", "product-feed.xml");
  const publicDir = path.resolve(process.cwd(), "public");
  const distDir = path.resolve(process.cwd(), "dist");
  const publicHtmlDir = path.resolve(process.cwd(), "public_html");

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  if (fs.existsSync(publicHtmlFeed)) {
    const feedContent = fs.readFileSync(publicHtmlFeed, "utf-8");
    fs.writeFileSync(path.join(publicDir, "product-feed.xml"), feedContent);
    fs.writeFileSync(path.join(distDir, "product-feed.xml"), feedContent);
    console.log("[FEED] Synced existing Google Merchant Center product-feed.xml to public and dist.");
    return;
  }

  // Fallback generator if feed does not exist
  const items = products
    .filter((p) => !p.isVariant && !p.isHidden)
    .map((p) => {
      const link = `https://mukeshsarees.com/product/${p.slug}/`;
      const img = p.images?.[0]?.url || "https://mukeshsarees.com/og-image.jpg";
      const price = `${(p.originalPrice || p.price).toFixed(2)} INR`;
      const salePrice = `${p.price.toFixed(2)} INR`;
      return `    <item>
      <g:id>${p.sku || p.id}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${p.description || p.shortDescription || p.name}]]></g:description>
      <g:link>${link}</g:link>
      <g:image_link>${img}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${p.inStock !== false ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${price}</g:price>
      <g:sale_price>${salePrice}</g:sale_price>
      <g:brand><![CDATA[Mukesh Saree Centre]]></g:brand>
      <g:google_product_category>5422</g:google_product_category>
    </item>`;
    })
    .join("\n");

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Mukesh Saree Centre Product Catalog</title>
    <link>https://mukeshsarees.com</link>
    <description>Authentic Indian Sarees, Bridal Wear, and Handloom Silks Direct from Nagpur Since 1978</description>
${items}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(publicDir, "product-feed.xml"), feedXml);
  fs.writeFileSync(path.join(distDir, "product-feed.xml"), feedXml);
  if (fs.existsSync(publicHtmlDir)) {
    fs.writeFileSync(path.join(publicHtmlDir, "product-feed.xml"), feedXml);
  }
  console.log("[FEED] Generated fresh Google Merchant Center product-feed.xml.");
}

generateProductFeed().catch((err) => {
  console.error("[FEED] Error generating product feed:", err);
});
