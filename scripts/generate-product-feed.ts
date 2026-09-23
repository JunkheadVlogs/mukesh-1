import fs from "fs";
import path from "path";
import { products } from "../src/mockData";

const BASE_URL = "https://mukeshsarees.com";
const BRAND_NAME = "Mukesh Saree Centre";
// Official Google Product Taxonomy ID for Sarees: 5422
// Path: Apparel & Accessories > Clothing > Traditional & Ceremonial Clothing > Sarees
const GOOGLE_PRODUCT_CATEGORY_ID = "5422";
const GOOGLE_PRODUCT_CATEGORY_PATH = "Apparel & Accessories > Clothing > Traditional & Ceremonial Clothing > Sarees";

/**
 * Strips raw markdown and formats description for clean plain text.
 */
function cleanDescription(desc: string): string {
  if (!desc) return "Authentic handcrafted Indian saree from Mukesh Saree Centre.";
  return desc
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/[^\x20-\x7E\t\r\n\u0900-\u097F]/g, "") // remove non-standard emoji/symbols while preserving ASCII and Devanagari
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

/**
 * Converts a relative or absolute image path to a full public URL.
 */
function resolveImageUrl(imgUrl: string): string {
  if (!imgUrl) return "";
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
    return imgUrl;
  }
  const cleanPath = imgUrl.startsWith("/") ? imgUrl : `/${imgUrl}`;
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Builds the complete RSS 2.0 XML string conforming to Google Merchant Center specifications.
 */
export function generateProductFeedXml(): string {
  const activeProducts = products.filter(
    (p) => !p.isHidden && !p.id.toLowerCase().includes("test")
  );

  const itemsXml = activeProducts
    .map((product) => {
      const id = product.sku || product.id;
      const title = product.name;
      const description = cleanDescription(product.description || product.metaDescription || product.name);
      const link = `${BASE_URL}/product/${product.slug}/`;
      const mainImage = resolveImageUrl(product.image);

      // Additional images (excluding the main image to avoid duplicates)
      const additionalImages = (product.images || [])
        .map(resolveImageUrl)
        .filter((img) => img && img !== mainImage)
        .slice(0, 10);

      // Determine stock status based on actual inventory
      const isOutOfStock = product.stock !== undefined && product.stock <= 0;
      const availability = isOutOfStock ? "out_of_stock" : "in_stock";

      // Pricing logic: regular price vs sale price
      const hasDiscount = product.originalPrice && product.originalPrice > product.price;
      const regularPrice = hasDiscount
        ? `${product.originalPrice!.toFixed(2)} INR`
        : `${product.price.toFixed(2)} INR`;
      const salePrice = hasDiscount ? `${product.price.toFixed(2)} INR` : null;

      const color = product.color || "";
      const material = product.fabric || "Silk Blend";

      let item = `    <item>
      <g:id>${id}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${link}</g:link>
      <g:image_link>${mainImage}</g:image_link>`;

      additionalImages.forEach((img) => {
        item += `\n      <g:additional_image_link>${img}</g:additional_image_link>`;
      });

      item += `
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${regularPrice}</g:price>`;

      if (salePrice) {
        item += `\n      <g:sale_price>${salePrice}</g:sale_price>`;
      }

      item += `
      <g:brand><![CDATA[${BRAND_NAME}]]></g:brand>
      <g:google_product_category>${GOOGLE_PRODUCT_CATEGORY_ID}</g:google_product_category>
      <g:product_type><![CDATA[Apparel & Accessories > Clothing > Traditional & Ceremonial Clothing > Sarees]]></g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
      <g:gender>female</g:gender>
      <g:age_group>adult</g:age_group>`;

      if (color) {
        item += `\n      <g:color><![CDATA[${color}]]></g:color>`;
      }
      if (material) {
        item += `\n      <g:material><![CDATA[${material}]]></g:material>`;
      }

      // Standard free shipping across India
      item += `
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard Shipping</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
    </item>`;

      return item;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Mukesh Saree Centre Product Catalog</title>
    <link>${BASE_URL}</link>
    <description>Authentic Indian Sarees, Bridal Wear, and Handloom Silks Direct from Nagpur Since 1978</description>
${itemsXml}
  </channel>
</rss>`;
}

export function writeProductFeed(): void {
  console.log("[FEED] Generating Google Merchant Center product feed...");
  const xml = generateProductFeedXml();

  const publicDir = path.resolve(process.cwd(), "public");
  const distDir = path.resolve(process.cwd(), "dist");
  const publicHtmlDir = path.resolve(process.cwd(), "public_html");

  const writeTarget = (dir: string) => {
    if (fs.existsSync(dir)) {
      const filePath = path.join(dir, "product-feed.xml");
      fs.writeFileSync(filePath, xml, "utf-8");
      console.log(`[FEED] Successfully written to: ${filePath}`);
    }
  };

  writeTarget(publicDir);
  writeTarget(distDir);
  writeTarget(publicHtmlDir);

  console.log("[FEED] Google Merchant Center feed generated successfully!");
}

// Auto-run if invoked directly via CLI (tsx scripts/generate-product-feed.ts)
if (process.argv[1] && process.argv[1].includes("generate-product-feed")) {
  writeProductFeed();
}
