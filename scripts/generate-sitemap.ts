import fs from "fs";
import path from "path";
import { products } from "../src/mockData";

async function generateSitemap() {
  const publicDir = path.resolve(process.cwd(), "public");
  const distDir = path.resolve(process.cwd(), "dist");

  console.log("[SITEMAP] Starting generation...");

  // Base domain
  const DOMAIN = "https://mukeshsarees.com";

  // Static and dynamic routes as requested by the user
  const routes = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/shop", changefreq: "weekly", priority: "0.9" },
    { path: "/shop?category=Sarees", changefreq: "weekly", priority: "0.8" },
    { path: "/shop?category=Co-Ord-Sets", changefreq: "weekly", priority: "0.8" },
    { path: "/shop?category=Lehengas", changefreq: "weekly", priority: "0.8" },
    { path: "/shop?category=Kurtas", changefreq: "weekly", priority: "0.8" },
    { path: "/product/premium-pure-cotton-coord-set", changefreq: "monthly", priority: "0.7" },
    { path: "/product/elegant-white-pink-embroidered-pure-cotton-kurta-pant-set", changefreq: "monthly", priority: "0.7" },
    { path: "/product/pure-beige-cotton-floral-coord-set", changefreq: "monthly", priority: "0.7" },
    { path: "/product/pure-cotton-floral-coord-set-white", changefreq: "monthly", priority: "0.7" },
    { path: "/product/premium-pure-cotton-coord-set-grey", changefreq: "monthly", priority: "0.7" },
    { path: "/product/sunshine-yellow-chiffon-saree-hand-brush-floral", changefreq: "monthly", priority: "0.7" },
    { path: "/product/black-khadi-cotton-saree-multicolor-striped-pallu", changefreq: "monthly", priority: "0.7" },
    { path: "/product/elegant-forest-green-cotton-coord-set", changefreq: "monthly", priority: "0.7" },
    { path: "/contact", changefreq: "monthly", priority: "0.5" },
    { path: "/shipping-policy", changefreq: "yearly", priority: "0.4" },
    { path: "/return-policy", changefreq: "yearly", priority: "0.4" },
    { path: "/terms", changefreq: "yearly", priority: "0.3" }
  ];

  const sitemapLines: string[] = [];

  // Add all pages to sitemap
  for (const route of routes) {
    sitemapLines.push(`  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`);
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
