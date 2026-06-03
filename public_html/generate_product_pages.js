/**
 * Mukesh Saree Centre - Static Product HTML Generator
 * File: public_html/generate_product_pages.js
 * 
 * This script reads products catalog data and builds pre-rendered index.html
 * pages for each item under 'product/[slug]/index.html' with perfect Open Graph 
 * meta tags to guarantee gorgeous link previews in WhatsApp and social platforms.
 * 
 * Usage:
 *   node generate_product_pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define directories relative to this file
const publicHtmlDir = __dirname;
const templatePath = path.join(publicHtmlDir, 'index.html');

// Ordered preference for product catalogs
const catalogSources = [
  path.join(publicHtmlDir, 'products.json'),
  path.join(publicHtmlDir, 'products-meta.json'),
  path.join(publicHtmlDir, '..', 'products.json'),
  path.join(publicHtmlDir, '..', 'public', 'products-meta.json')
];

function runGenerator() {
  console.log('==================================================================');
  console.log('📦 [GEN-PAGES] Initiating Static Product Pre-rendering Process...');
  console.log('==================================================================\n');

  // 1. Find and load products database JSON
  let catalogPath = null;
  let products = null;

  for (const src of catalogSources) {
    if (fs.existsSync(src)) {
      try {
        products = JSON.parse(fs.readFileSync(src, 'utf8'));
        catalogPath = src;
        console.log(`✅ [CATALOG FOUND] Loaded products database from: ${path.basename(src)}`);
        break;
      } catch (e) {
        console.warn(`⚠️ [WARNING] Failed to parse JSON database at "${src}": ${e.message}`);
      }
    }
  }

  if (!products || !Array.isArray(products)) {
    console.error('\n❌ [ERROR] Could not load products database catalog.');
    console.log('Please place either a "products.json" or "products-meta.json" inside the public_html directory.');
    process.exit(1);
  }

  console.log(`ℹ️ [DB STATS] loaded ${products.length} product entries for static rendering.`);

  // 2. Load index.html base template
  if (!fs.existsSync(templatePath)) {
    console.error(`\n❌ [ERROR] Base single-page application template index.html not found: ${templatePath}`);
    process.exit(1);
  }

  const baseTemplateHtml = fs.readFileSync(templatePath, 'utf8');
  console.log(`✅ [TEMPLATE LOADED] Found base index.html. Size: ${(baseTemplateHtml.length / 1024).toFixed(2)} KB.`);

  let createdCount = 0;
  let invalidCount = 0;
  const driveWarnings = [];

  // 3. Process each product node
  products.forEach((product, index) => {
    const slug = product.slug;
    const name = product.name;
    const price = product.price;
    const description = product.description || '';

    if (!slug) {
      console.warn(`⚠️ [SKIP RECORD #${index + 1}] Unable to generate: target has no slug value.`);
      invalidCount++;
      return;
    }

    const targetFolder = path.join(publicHtmlDir, 'product', slug);
    const targetFile = path.join(targetFolder, 'index.html');

    // Remove any html/markdown formatting from the description string
    const sanitizedDesc = description
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/\s+/g, ' ')
      .replace(/"/g, '&quot;')
      .trim();
    const shortDesc = sanitizedDesc.substring(0, 155).trim() + (sanitizedDesc.length > 155 ? '...' : '');

    // 4. Advanced ImageKit & Google Drive link formatting logic
    const imageInput = product.image || '';
    let ogImageUrl = '';

    if (imageInput) {
      if (imageInput.includes('ik.imagekit.io')) {
        // IMAGEKIT DIRECT CONVERSION & TRANSFORM
        // Remove existing query string/transformations if any
        const baseImgUrl = imageInput.split('?')[0];
        // Apply optimal aspect ratio fit at 1200x630px over custom card aspect (at least 300x300 for WhatsApp)
        ogImageUrl = `${baseImgUrl}?tr=w-1200,h-630,c-maintain_ratio,bg-F0F0F0`;
      } else if (imageInput.includes('drive.google.com')) {
        // GOOGLE DRIVE DETECTED: Drive URLs are not hot-linkable static image assets
        // We parse drive document ID and generate a reliable cross-network proxy
        let docId = '';
        const rawIdMatch = imageInput.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        const slashIdMatch = imageInput.match(/\/d\/([a-zA-Z0-9_-]+)/);

        if (rawIdMatch) docId = rawIdMatch[1];
        else if (slashIdMatch) docId = slashIdMatch[1];

        if (docId) {
          driveWarnings.push({ id: docId, name, slug, imageInput });
          // Route through wsrv.nl proxy to render thumbnail at ideal 1200x630 aspect ratio safely
          const driveSrc = `https://drive.google.com/uc?export=download&id=${docId}`;
          ogImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(driveSrc)}&w=1200&h=630&fit=contain&cbg=ffffff&output=jpg&q=90`;
        } else {
          ogImageUrl = imageInput; // Absolute raw fallback
        }
      } else {
        // Standard relative or external URLs
        if (imageInput.startsWith('http')) {
          ogImageUrl = imageInput;
        } else {
          ogImageUrl = `https://mukeshsarees.com/${imageInput.replace(/^\/+/, '')}`;
        }
      }
    } else {
      // General fallbacks if no image is present
      ogImageUrl = 'https://mukeshsarees.com/images/og-home.jpg';
    }

    const docTitle = `${name} ${price ? `– ₹${price}` : ''} | Mukesh Saree Centre`;
    const docCanonicalUrl = `https://mukeshsarees.com/product/${slug}`;

    // Open Graph template tag blocks
    const customOgTags = `<!-- Dynamic OG Tags -->
  <meta property="og:title" content="${docTitle}" />
  <meta property="og:description" content="${shortDesc}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:secure_url" content="${ogImageUrl}" />
  <meta property="og:url" content="${docCanonicalUrl}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Mukesh Saree Centre" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${docTitle}" />
  <meta name="twitter:description" content="${shortDesc}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
  <link rel="canonical" href="${docCanonicalUrl}" />
  <!-- End Dynamic OG Tags -->`;

    // 5. Replace inside HTML templates safely
    let outHtml = baseTemplateHtml;

    outHtml = outHtml.replace(/<title>.*?<\/title>/is, `<title>${docTitle}</title>`);
    outHtml = outHtml.replace(/<link rel="canonical" href="[^"]*".*?>/is, `<link rel="canonical" href="${docCanonicalUrl}" />`);
    outHtml = outHtml.replace(/<meta name="description" content=".*?".*?>/is, `<meta name="description" content="${shortDesc}" />`);

    if (outHtml.includes('<!-- Dynamic OG Tags -->') && outHtml.includes('<!-- End Dynamic OG Tags -->')) {
      outHtml = outHtml.replace(/<!-- Dynamic OG Tags -->[\s\S]*?<!-- End Dynamic OG Tags -->/is, customOgTags);
    } else {
      outHtml = outHtml.replace('<head>', `<head>\n  ${customOgTags}`);
    }

    // 6. Output to the filesystem
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    fs.writeFileSync(targetFile, outHtml, 'utf8');
    createdCount++;
    console.log(`   [GEN-PAGE #${createdCount}] Generated: product/${slug}/index.html`);
  });

  console.log('\n======================================================');
  console.log('🎉 [GENERATION OVERVIEW] SUCCESS');
  console.log('======================================================');
  console.log(`- Total product pages output: ${createdCount}`);
  console.log(`- Total records skipped:      ${invalidCount}`);
  console.log('======================================================\n');

  if (driveWarnings.length > 0) {
    console.log('⚠️ [GOOGLE DRIVE CRITICAL RECOMMENDATIONS]');
    console.log('The following products use standard Google Drive share links instead of ImageKit CDN links.');
    console.log('Google Drive direct links do not work natively as og:image nodes in WhatsApp scraping crawls.');
    console.log('Although the script implements an advanced high-performance proxy layer (wsrv.nl), we highly');
    console.log('recommend uploading these images directly to ImageKit CDN to guarantee blazing fast loads.');
    console.log('------------------------------------------------------');
    driveWarnings.forEach((warn, pos) => {
      console.log(` ${pos + 1}. Item: ${warn.name}`);
      console.log(`    Slug: /product/${warn.slug}`);
      console.log(`    Path: ${warn.imageInput}`);
    });
    console.log('------------------------------------------------------\n');
  }
}

runGenerator();
