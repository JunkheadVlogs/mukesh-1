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
  const routes = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/shop", changefreq: "weekly", priority: "0.9" },
    { path: "/shop?category=Sarees", changefreq: "weekly", priority: "0.8" },
    { path: "/shop?category=Co-Ord-Sets", changefreq: "weekly", priority: "0.8" },
    { path: "/shop?category=Lehengas", changefreq: "weekly", priority: "0.8" },
    { path: "/shop?category=Kurtas", changefreq: "weekly", priority: "0.8" },
    { path: "/contact", changefreq: "monthly", priority: "0.5" },
    { path: "/shipping-policy", changefreq: "yearly", priority: "0.4" },
    { path: "/return-policy", changefreq: "yearly", priority: "0.4" },
    { path: "/terms", changefreq: "yearly", priority: "0.3" },
    { path: "/wishlist", changefreq: "monthly", priority: "0.5" }
  ];

  // Dynamic product URLs from mockData
  const seenSlugs = new Set<string>();
  for (const product of products) {
    if (product && product.slug && !product.isHidden && !seenSlugs.has(product.slug)) {
      seenSlugs.add(product.slug);
      routes.push({
        path: `/product/${product.slug}`,
        changefreq: "weekly",
        priority: "0.8"
      });
    }
  }

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
