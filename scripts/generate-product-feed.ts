import fs from "fs";
import path from "path";
import { products, Product } from "../src/mockData";

/**
 * Google Merchant Center Product Feed Generator
 * Generates both XML (RSS 2.0 with Google Base namespace) and CSV formats.
 * 
 * Strict Compliance:
 * - Uses real SKU for <g:id>
 * - Clean title and description
 * - Canonical product URL
 * - Absolute image links and additional image links
 * - Availability (in_stock)
 * - Real selling price in INR (<g:price>)
 * - Condition: new
 * - Brand: Mukesh Saree Centre
 * - Product type and Google product category (5422 - Sarees)
 * - Real material (fabric) and color from product data without inventing fields
 * - <g:identifier_exists>no</g:identifier_exists> (no invented GTIN/MPN)
 * - Factual shipping matching store policy (Free delivery across India for all items)
 * - Factual return policy label (7-day return matching return policy)
 */

const BASE_URL = "https://mukeshsarees.com";

function cleanDescription(desc: string | undefined, name: string): string {
  if (!desc) return name;
  let text = desc
    .replace(/^(\*\*)?DESCRIPTION\s*:\s*(\*\*)?\s*/i, "")
    .replace(/\bDESCRIPTION\s*:\s*/gi, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^[•\-\*]\s*/gm, " ")
    .replace(/[🎨🧵💫💖🌿✨]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // If text is excessively long, truncate at sentence boundary up to 4500 chars (Google allows 5000)
  if (text.length > 4500) {
    const cut = text.substring(0, 4500);
    const lastPeriod = cut.lastIndexOf(".");
    text = (lastPeriod > 0 ? cut.substring(0, lastPeriod + 1) : cut).trim();
  }

  return text || name;
}

function toAbsoluteUrl(url: string | undefined): string {
  if (!url) return `${BASE_URL}/og-image.jpg`;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${BASE_URL}${cleanPath}`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCsv(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n") || field.includes("\r")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function generateFeeds() {
  const publicDir = path.resolve(process.cwd(), "public");
  const distDir = path.resolve(process.cwd(), "dist");
  const publicHtmlDir = path.resolve(process.cwd(), "public_html");

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  // Filter valid in-stock products
  // Exclude hidden products and items explicitly out of stock
  const validProducts = products.filter((p: Product) => {
    if (p.isHidden) return false;
    if (p.stock !== undefined && p.stock <= 0) return false;
    if (!p.sku) return false;
    return true;
  });

  console.log(`[FEED] Processing ${validProducts.length} valid in-stock products...`);

  // 1. Build XML Feed
  const xmlItems = validProducts.map((p: Product) => {
    const link = `${BASE_URL}/product/${p.slug}/`;
    const primaryImg = toAbsoluteUrl(p.images?.[0] || p.image);
    const desc = cleanDescription(p.description, p.name);
    const formattedPrice = `${p.price.toFixed(2)} INR`;

    // Category mapping
    const category = p.category || "Sarees";
    const productType = `Apparel & Accessories > Clothing > Traditional & Ceremonial Clothing > ${category}`;
    // Google Product Category 5422 = Apparel & Accessories > Clothing > Traditional & Ceremonial Clothing > Sarees
    const googleCategory = category.toLowerCase().includes("lehenga") ? "5423" : "5422";

    // Additional images (up to 10)
    const extraImages: string[] = [];
    if (Array.isArray(p.images) && p.images.length > 1) {
      for (let i = 1; i < Math.min(p.images.length, 10); i++) {
        const extraUrl = toAbsoluteUrl(p.images[i]);
        if (extraUrl !== primaryImg && !extraImages.includes(extraUrl)) {
          extraImages.push(extraUrl);
        }
      }
    }

    const extraImageTags = extraImages
      .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
      .join("\n");

    const colorTag = p.color ? `\n      <g:color><![CDATA[${p.color}]]></g:color>` : "";
    const materialTag = p.fabric ? `\n      <g:material><![CDATA[${p.fabric}]]></g:material>` : "";
    const sizeTag = Array.isArray(p.availableSizes) && p.availableSizes.length > 0
      ? `\n      <g:size><![CDATA[${p.availableSizes.join(", ")}]]></g:size>`
      : "";

    return `    <item>
      <g:id>${escapeXml(p.sku)}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${desc}]]></g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(primaryImg)}</g:image_link>${extraImageTags ? "\n" + extraImageTags : ""}
      <g:availability>in_stock</g:availability>
      <g:price>${formattedPrice}</g:price>
      <g:condition>new</g:condition>
      <g:brand><![CDATA[Mukesh Saree Centre]]></g:brand>
      <g:product_type><![CDATA[${productType}]]></g:product_type>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:identifier_exists>no</g:identifier_exists>${colorTag}${materialTag}${sizeTag}
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard Insured Delivery</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
      <g:return_policy_label>7_day_return</g:return_policy_label>
    </item>`;
  });

  const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Mukesh Saree Centre Google Merchant Feed</title>
    <link>${BASE_URL}</link>
    <description>Authentic Indian Sarees, Bridal Lehengas, and Handloom Weaves from Gandhibagh, Nagpur Since 1978</description>
${xmlItems.join("\n")}
  </channel>
</rss>`;

  // 2. Build CSV Feed (Alternative Format for Google Merchant Center)
  const csvHeaders = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "additional_image_link",
    "availability",
    "price",
    "condition",
    "brand",
    "product_type",
    "google_product_category",
    "identifier_exists",
    "color",
    "material",
    "size",
    "shipping(country:service:price)",
    "return_policy_label"
  ];

  const csvRows = validProducts.map((p: Product) => {
    const link = `${BASE_URL}/product/${p.slug}/`;
    const primaryImg = toAbsoluteUrl(p.images?.[0] || p.image);
    const desc = cleanDescription(p.description, p.name);
    const formattedPrice = `${p.price.toFixed(2)} INR`;
    const category = p.category || "Sarees";
    const productType = `Apparel & Accessories > Clothing > Traditional & Ceremonial Clothing > ${category}`;
    const googleCategory = category.toLowerCase().includes("lehenga") ? "5423" : "5422";

    const extraImages: string[] = [];
    if (Array.isArray(p.images) && p.images.length > 1) {
      for (let i = 1; i < Math.min(p.images.length, 10); i++) {
        const extraUrl = toAbsoluteUrl(p.images[i]);
        if (extraUrl !== primaryImg && !extraImages.includes(extraUrl)) {
          extraImages.push(extraUrl);
        }
      }
    }
    const additionalImagesStr = extraImages.join(",");

    const sizeStr = Array.isArray(p.availableSizes) && p.availableSizes.length > 0
      ? p.availableSizes.join(", ")
      : "";

    return [
      escapeCsv(p.sku),
      escapeCsv(p.name),
      escapeCsv(desc),
      escapeCsv(link),
      escapeCsv(primaryImg),
      escapeCsv(additionalImagesStr),
      "in_stock",
      escapeCsv(formattedPrice),
      "new",
      "Mukesh Saree Centre",
      escapeCsv(productType),
      googleCategory,
      "no",
      escapeCsv(p.color || ""),
      escapeCsv(p.fabric || ""),
      escapeCsv(sizeStr),
      "IN:Standard Insured Delivery:0.00 INR",
      "7_day_return"
    ].join(",");
  });

  const csvFeed = [csvHeaders.join(","), ...csvRows].join("\n");

  // Write files
  const outputTargets = [
    { dir: publicDir, name: "public" },
    { dir: distDir, name: "dist" },
  ];
  if (fs.existsSync(publicHtmlDir)) {
    outputTargets.push({ dir: publicHtmlDir, name: "public_html" });
  }

  outputTargets.forEach(({ dir, name }) => {
    fs.writeFileSync(path.join(dir, "product-feed.xml"), xmlFeed, "utf-8");
    fs.writeFileSync(path.join(dir, "product-feed.csv"), csvFeed, "utf-8");
    console.log(`[FEED] Successfully wrote product-feed.xml and product-feed.csv to ${name}/`);
  });

  console.log(`[FEED] Generated ${validProducts.length} items in Google Merchant Center feeds.`);
  return { xmlFeed, csvFeed, count: validProducts.length };
}

// Execute when run as script
if (process.argv[1] && process.argv[1].includes("generate-product-feed")) {
  try {
    generateFeeds();
  } catch (err) {
    console.error("[FEED] Failed to generate product feeds:", err);
    process.exit(1);
  }
}
