import fs from "fs";
import path from "path";
import { products } from "../src/mockData";

async function generateSitemap() {
  const publicDir = path.resolve(process.cwd(), "public");
  const distDir = path.resolve(process.cwd(), "dist");

  console.log("[SITEMAP] Starting generation...");

  // Base domain
  const DOMAIN = "https://mukeshsarees.com";

  // Static routes
  const staticRoutes = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/shop", changefreq: "daily", priority: "0.82" },
    { path: "/contact", changefreq: "monthly", priority: "0.50" },
    { path: "/shipping-policy", changefreq: "monthly", priority: "0.40" },
    { path: "/return-policy", changefreq: "monthly", priority: "0.40" },
    { path: "/terms", changefreq: "monthly", priority: "0.30" }
  ];

  const sitemapLines: string[] = [];

  // 1. Add static pages
  for (const route of staticRoutes) {
    sitemapLines.push(`  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`);
  }

  // 2. Add dynamic products with slugs
  for (const product of products) {
    if (product.slug) {
      // Escape any dynamic XML special characters safely
      const escapedSlug = encodeURIComponent(product.slug);
      sitemapLines.push(`  <url>
    <loc>${DOMAIN}/product/${escapedSlug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`);
    }
  }

  // 3. Compile everything together
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapLines.join("\n")}
</urlset>`;

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write to public/sitemap.xml
  const publicSitemapPath = path.join(publicDir, "sitemap.xml");
  fs.writeFileSync(publicSitemapPath, sitemapContent);
  console.log(`[SITEMAP] Saved successfully to: ${publicSitemapPath}`);

  // Write to dist/sitemap.xml if the dist folder already exists
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.join(distDir, "sitemap.xml");
    fs.writeFileSync(distSitemapPath, sitemapContent);
    console.log(`[SITEMAP] Synced copy saved to: ${distSitemapPath}`);
  }

  console.log("[SITEMAP] XML Generation Completed successfully.");
}

generateSitemap().catch((err) => {
  console.error("[SITEMAP] Failed to generate sitemap:", err);
  process.exit(1);
});
