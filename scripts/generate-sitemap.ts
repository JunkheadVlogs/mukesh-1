import fs from "fs";
import path from "path";
import { products } from "../src/mockData";
import { guidesMeta } from "../src/data/guidesMeta";

async function generateSitemap() {
  const publicDir = path.resolve(process.cwd(), "public");
  const distDir = path.resolve(process.cwd(), "dist");

  console.log("[SITEMAP] Starting generation...");

  // Base domain
  const DOMAIN = "https://mukeshsarees.com";

  const routes: { path: string; changefreq: string; priority: string }[] = [];
  const addedPaths = new Set<string>();

  function addRoute(routePath: string, changefreq: string, priority: string) {
    // Ensure routePath starts with / and has no trailing slash (except root /)
    let cleanPath = routePath.trim();
    if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
      cleanPath = cleanPath.slice(0, -1);
    }
    if (!addedPaths.has(cleanPath)) {
      addedPaths.add(cleanPath);
      routes.push({ path: cleanPath, changefreq, priority });
    }
  }

  // 1. Primary Static Public Pages
  addRoute("/", "daily", "1.0");
  addRoute("/shop", "weekly", "0.9");
  addRoute("/sarees", "weekly", "0.9");
  addRoute("/sarees/banarasi-sarees", "weekly", "0.8");
  addRoute("/sarees/linen-sarees", "weekly", "0.8");
  addRoute("/sarees/cotton-sarees", "weekly", "0.8");
  addRoute("/sarees/paithani-sarees", "weekly", "0.8");
  addRoute("/sarees/silk-sarees", "weekly", "0.8");
  addRoute("/lehengas", "weekly", "0.8");
  addRoute("/suits", "weekly", "0.8");
  addRoute("/coord-sets", "weekly", "0.8");
  addRoute("/wholesalesarees", "monthly", "0.9");
  addRoute("/categories", "weekly", "0.8");
  addRoute("/about", "yearly", "0.7");
  addRoute("/contact", "monthly", "0.7");
  addRoute("/faqs", "monthly", "0.7");
  addRoute("/shipping-policy", "yearly", "0.4");
  addRoute("/return-policy", "yearly", "0.4");
  addRoute("/terms", "yearly", "0.3");

  // 2. Specific AI SEO Landing Pages
  const aiPages = [
    "malvika-saree",
    "mukesh-saree",
    "uniform-saree",
    "saree-shop-in-nagpur",
    "bridal-sarees-nagpur",
    "wedding-sarees",
    "paithani-sarees",
    "ethnic-wear-nagpur",
    "saree-buying-guide",
    "saree-care-guide",
    "corporate-uniform-sarees",
    "school-uniform-sarees",
    "teacher-uniform-sarees",
    "hospital-uniform-sarees",
    "pure-linen-sarees",
    "soft-cotton-sarees",
    "banarasi-silk-sarees",
    "designer-party-wear-sarees"
  ];

  for (const page of aiPages) {
    addRoute(`/${page}`, "monthly", "0.9");
  }

  // 3. Knowledge Base Guides
  addRoute("/guides", "weekly", "0.8");
  for (const guide of guidesMeta) {
    if (guide && guide.slug) {
      addRoute(`/guides/${guide.slug}`, "monthly", "0.8");
    }
  }

  // 4. Dynamic Product URLs from mockData
  for (const product of products) {
    if (product && product.slug && !product.isHidden) {
      addRoute(`/product/${product.slug}`, "weekly", "0.8");
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

  // 5. Compile XML content
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

  console.log(`[SITEMAP] XML Generation Completed successfully. Total URLs: ${routes.length}`);
}

generateSitemap().catch((err) => {
  console.error("[SITEMAP] Failed to generate sitemap:", err);
  process.exit(1);
});
