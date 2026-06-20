import fs from "fs";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createStaticPage } from "./prerenderHelper.js";
import { BUSINESS_INFO } from "../src/config/business.js";
import { guidesMeta } from "../src/data/guidesMeta.js";

const distPath = path.resolve(process.cwd(), "dist");
const cleanHtmlPath = path.join(distPath, "index-clean.html");

if (!fs.existsSync(cleanHtmlPath)) {
  console.error("clean HTML not found");
  process.exit(1);
}
let baseHtml = fs.readFileSync(cleanHtmlPath, "utf-8");

function getHeaderHtml(): string {
  return `
    <header style="background: rgba(250, 246, 240, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(0,0,0,0.04); position: sticky; top: 0; z-index: 100;">
      <!-- Minimal pre-load Header for Guides -->
    </header>
  `;
}

console.log("[PRERENDER] Generating Guide Pages...");

// Generate Guide Index
const guideIndexDir = path.join(distPath, "guides");
if (!fs.existsSync(guideIndexDir)) fs.mkdirSync(guideIndexDir, { recursive: true });

const indexBody = `
  <div style="background-color: #faf6f0; min-height: 100vh; padding: 60px 24px;">
    <main style="max-width: 1200px; margin: 0 auto;">
      <h1 style="font-family: 'Playfair Display', serif; text-align: center; font-size: 36px; color: #1a0a00;">Saree & Ethnic Wear Guides</h1>
    </main>
  </div>
`;

const indexHtml = createStaticPage({
  htmlTemplate: baseHtml,
  bodyHtml: indexBody,
  title: `Saree Buying Guides & Styling Tips — ${BUSINESS_INFO.name}`,
  description: `Read expert guides on buying sarees, Lehengas, and Indian ethnic wear. Fabric care, styling, and much more from ${BUSINESS_INFO.name}.`
});

fs.writeFileSync(path.join(guideIndexDir, "index.html"), indexHtml);

for (const guide of guidesMeta) {
  const guideDir = path.join(distPath, "guides", guide.slug);
  if (!fs.existsSync(guideDir)) fs.mkdirSync(guideDir, { recursive: true });

  const guideOgTags = `<!-- Dynamic OG Tags -->
    <meta data-rh="true" property="og:title" content="${guide.title} — ${BUSINESS_INFO.name}" />
    <meta data-rh="true" property="og:description" content="${guide.description.replace(/"/g, '&quot;')}" />
    <meta data-rh="true" property="og:image" content="${guide.image}" />
    <meta data-rh="true" property="og:url" content="https://mukeshsarees.com/guides/${guide.slug}" />
    <meta data-rh="true" property="og:type" content="article" />
    <meta data-rh="true" property="article:published_time" content="${guide.date}" />
    <link data-rh="true" rel="canonical" href="https://mukeshsarees.com/guides/${guide.slug}" />
  <!-- End Dynamic OG Tags -->`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.description,
    "image": guide.image,
    "author": { "@type": "Organization", "name": BUSINESS_INFO.name },
    "publisher": { "@type": "Organization", "name": BUSINESS_INFO.name, "logo": { "@type": "ImageObject", "url": "https://mukeshsarees.com/images/logo.webp" } },
    "datePublished": guide.date,
    "dateModified": guide.lastUpdated
  };

  const fullBody = `
    <div style="background-color: #faf6f0; min-height: 100vh;">
      <main style="max-width: 800px; margin: 60px auto; padding: 0 24px;">
        <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; margin-bottom: 24px;">${guide.title}</h1>
        <p style="font-size: 16px; color: #4a4a4a; line-height: 1.8;">${guide.description}</p>
      </main>
    </div>
  `;

  const phtml = createStaticPage({
    htmlTemplate: baseHtml,
    bodyHtml: fullBody,
    title: `${guide.title} — ${BUSINESS_INFO.name}`,
    description: guide.description.replace(/"/g, '&quot;'),
    customOgTags: guideOgTags,
    schemaJson: schemaJson
  });

  fs.writeFileSync(path.join(guideDir, "index.html"), phtml);
  console.log(`[PRERENDER] Guide generated: /guides/${guide.slug}`);
}

console.log("[PRERENDER] Guide pre-rendering finished!");
