/**
 * Mukesh Saree Centre - Static Product HTML Page Generator
 * File: scripts/generate-product-pages.js
 * 
 * This Node.js script reads 'products.json' (or fallback 'products-meta.json') 
 * and automatically generates directory structures and static index.html files 
 * for each product inside 'public_html/product/[slug]/index.html'.
 * It pre-injects perfectly optimized, WhatsApp-compliant OG tags into the <head> of each pages.
 * 
 * Run using: node scripts/generate-product-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const publicHtmlDir = path.join(rootDir, 'public_html');
const templateFile = path.join(publicHtmlDir, 'index.html');

// Supported products data source paths (Order of preference)
const datasetPaths = [
  path.join(publicHtmlDir, 'products.json'),
  path.join(publicHtmlDir, 'products-meta.json'),
  path.join(rootDir, 'products.json'),
  path.join(rootDir, 'public', 'products-meta.json')
];

function main() {
  console.log('==================================================================');
  console.log('🚀 [GEN-PRODUCTS] Beginning Static HTML Pre-Render Generation...');
  console.log('==================================================================\n');

  // 1. Locate and load products database file
  let productsFile = null;
  let productsData = null;

  for (const docPath of datasetPaths) {
    if (fs.existsSync(docPath)) {
      productsFile = docPath;
      try {
        productsData = JSON.parse(fs.readFileSync(docPath, 'utf8'));
        console.log(`✅ [FOUND DATASET] Loaded products from: ${path.relative(rootDir, docPath)}`);
        break;
      } catch (err) {
        console.error(`⚠️ [PARSE ERROR] Failed to parse JSON at "${docPath}": ${err.message}`);
      }
    }
  }

  if (!productsData || !Array.isArray(productsData)) {
    console.error('\n❌ [CRITICAL ERROR] Could not locate or parse a valid products JSON catalog.');
    console.log('Please place either a "products.json" or "products-meta.json" inside your "public_html" directory.');
    process.exit(1);
  }

  console.log(`ℹ️ [DB STATS] Successfully loaded ${productsData.length} products to generate.`);

  // 2. Load the base HTML template
  if (!fs.existsSync(templateFile)) {
    console.error(`\n❌ [CRITICAL ERROR] Base template index.html not found at: ${templateFile}`);
    process.exit(1);
  }

  const baseHtmlTemplate = fs.readFileSync(templateFile, 'utf8');
  console.log(`✅ [FOUND TEMPLATE] Read template file successfully. Size: ${(baseHtmlTemplate.length / 1024).toFixed(2)} KB.`);

  let successCount = 0;
  let skippedCount = 0;
  let googleDriveWarnings = [];

  // 3. Process each product node
  productsData.forEach((product, idx) => {
    const slug = product.slug;
    const name = product.name;
    const price = product.price;
    const rawDisc = product.description || '';

    if (!slug) {
      console.warn(`⚠️ [SKIP RECORD #${idx + 1}] Product is missing a valid 'slug' field.`);
      skippedCount++;
      return;
    }

    // A. Formulate the destination directory
    const productDir = path.join(publicHtmlDir, 'product', slug);
    const outputFile = path.join(productDir, 'index.html');

    // B. Clean description text for head tags to avoid syntax issues
    const cleanDesc = rawDisc
      .replace(/<[^>]*>?/gm, ' ') // Strip HTML tags
      .replace(/\*\*/g, '')      // Strip markdown bold characters
      .replace(/"/g, '&quot;')   // Prevent broken attribute quotes
      .replace(/\n\r/g, ' ')
      .replace(/\s+/g, ' ')      // Clean consecutive spacing
      .substring(0, 155)          // Cut at perfect length
      .trim() + '...';

    // C. Process image formats and enforce ImageKit resizing transforms
    const imageField = product.image || '';
    let ogImageUrl = '';
    let isGoogleDriveLink = false;

    if (imageField) {
      if (imageField.includes('ik.imagekit.io')) {
        // IMAGEKIT DIRECT CDN URL: Extract base and enforce high-res 1200x630 sizing parameter
        const baseUrl = imageField.split('?')[0];
        ogImageUrl = `${baseUrl}?tr=w-1200,h-630,c-maintain_ratio,bg-F0F0F0`;
      } else if (imageField.includes('drive.google.com')) {
        isGoogleDriveLink = true;
        // GOOGLE DRIVE URL: Flag it and use a high-performance proxy overlay natively
        let docId = '';
        const idMatch = imageField.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        const urlMatch = imageField.match(/\/d\/([a-zA-Z0-9_-]+)/);

        if (idMatch) docId = idMatch[1];
        else if (urlMatch) docId = urlMatch[1];

        if (docId) {
          googleDriveWarnings.push({ name, slug, imageField, docId });
          // Fallback proxy (wsrv.nl) that fetches the public drive thumbnail and sizes it perfectly
          const directDriveLink = `https://lh3.googleusercontent.com/d/${docId}`;
          ogImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(directDriveLink)}&w=1200&h=630&fit=contain&cbg=ffffff&output=jpg&q=90`;
        } else {
          ogImageUrl = imageField; // Absolute raw fallback
        }
      } else {
        // Normal absolute or relative link
        if (imageField.startsWith('http')) {
          ogImageUrl = imageField;
        } else {
          ogImageUrl = `https://mukeshsarees.com/${imageField.replace(/^\/+/, '')}`;
        }
      }
    } else {
      // General fallbacks
      ogImageUrl = 'https://mukeshsarees.com/images/og-home.jpg';
    }

    // D. Build corresponding dynamic head parameters
    const titleText = `${name} ${price ? `– ₹${price}` : ''} | Mukesh Saree Centre`;
    const canonicalUrl = `https://mukeshsarees.com/product/${slug}`;

    const productOgImage = `https://mukeshsarees.com/og-images/${slug}.jpg`;

    const ogTagsBlock = `<!-- Dynamic OG Tags -->
  <meta data-rh="true" property="og:title" content="${titleText}" />
  <meta data-rh="true" property="og:description" content="${cleanDesc}" />
  <meta data-rh="true" property="og:image" content="${productOgImage}" />
  <meta data-rh="true" property="og:image:secure_url" content="${productOgImage}" />
  <meta data-rh="true" property="og:url" content="${canonicalUrl}" />
  <meta data-rh="true" property="og:type" content="product" />
  <meta data-rh="true" property="og:site_name" content="Mukesh Saree Centre" />
  <meta data-rh="true" property="og:image:width" content="1200" />
  <meta data-rh="true" property="og:image:height" content="1200" />
  <meta data-rh="true" property="og:image:type" content="image/jpeg" />
  <meta data-rh="true" name="twitter:card" content="summary_large_image" />
  <meta data-rh="true" name="twitter:title" content="${titleText}" />
  <meta data-rh="true" name="twitter:description" content="${cleanDesc}" />
  <meta data-rh="true" name="twitter:image" content="${productOgImage}" />
  <link data-rh="true" rel="canonical" href="${canonicalUrl}" />
  <!-- End Dynamic OG Tags -->`;

    // E. Perform replacement inside HTML template values safely
    let targetHtml = baseHtmlTemplate;
    
    // Replace primary titles and canonical lines
    targetHtml = targetHtml.replace(/<title>.*?<\/title>/is, `<title>${titleText}</title>`);
    targetHtml = targetHtml.replace(/<link rel="canonical" href="[^"]*".*?>/is, `<link rel="canonical" href="${canonicalUrl}" />`);
    targetHtml = targetHtml.replace(/<meta name="description" content=".*?".*?>/is, `<meta name="description" content="${cleanDesc}" />`);

    // Inject OG block surgically, replacing standard home tag definitions
    if (targetHtml.includes('<!-- Dynamic OG Tags -->') && targetHtml.includes('<!-- End Dynamic OG Tags -->')) {
      targetHtml = targetHtml.replace(/<!-- Dynamic OG Tags -->[\s\S]*?<!-- End Dynamic OG Tags -->/is, ogTagsBlock);
    } else {
      // Fallback: prepend inside <head> tag
      targetHtml = targetHtml.replace('<head>', `<head>\n  ${ogTagsBlock}`);
    }

    // F. Create nested files structure
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, targetHtml, 'utf8');
    successCount++;
    console.log(`   [GEN-PAGE #${successCount}] Created index file: /product/${slug}/index.html`);
  });

  // 4. Summarize and issue Google Drive Warnings if applicable
  console.log('\n======================================================');
  console.log('🎉 [GEN-PRODUCTS] PROCESS COMPLETE!');
  console.log('======================================================');
  console.log(`- Successfully created/rendered product pages: ${successCount}`);
  console.log(`- Skipped records: ${skippedCount}`);
  console.log('======================================================\n');

  if (googleDriveWarnings.length > 0) {
    console.log('⚠️ [GOOGLE DRIVE WARNINGS]');
    console.log('The following products are using Google Drive links instead of ImageKit direct URLs.');
    console.log('While this script implements a high-performance proxy image overlay (wsrv.nl) for them,');
    console.log('it is STRONGLY recommended to host these images on ImageKit for optimal, instant loading.');
    console.log('------------------------------------------------------');
    googleDriveWarnings.forEach((warn, idx) => {
      console.log(`${idx + 1}. Product: ${warn.name}`);
      console.log(`   Slug: ${warn.slug}`);
      console.log(`   Current Link: ${warn.imageField}`);
      console.log(`   👉 Fix by uploading direct to ImageKit CDN`);
      console.log('------------------------------------------------------');
    });
    console.log('');
  }
}

main();
