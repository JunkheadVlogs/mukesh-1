import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import public_html dynamically
const publicHtmlDir = path.join(__dirname, 'public_html');
const templatePath = path.join(publicHtmlDir, 'index.html');

// Catalog choices
const catalogSources = [
  path.join(publicHtmlDir, 'products.json'),
  path.join(publicHtmlDir, 'products-meta.json'),
  path.join(__dirname, 'products.json'),
  path.join(__dirname, 'public_html', 'products-meta.json')
];

function runGenerator() {
  console.log('==================================================================');
  console.log('🚀 [GEN-PAGES] Starting Root Product Static Pre-render Sync...');
  console.log('==================================================================\n');

  let catalogPath = null;
  let products = null;

  for (const src of catalogSources) {
    if (fs.existsSync(src)) {
      try {
        products = JSON.parse(fs.readFileSync(src, 'utf8'));
        catalogPath = src;
        console.log(`✅ [CATALOG FOUND] Loaded products from: ${path.relative(__dirname, src)}`);
        break;
      } catch (e) {
        console.warn(`⚠️ Failed to parse: ${e.message}`);
      }
    }
  }

  if (!products || !Array.isArray(products)) {
    console.error('\n❌ [ERROR] Could not find products JSON catalogs.');
    process.exit(1);
  }

  if (!fs.existsSync(templatePath)) {
    console.error(`\n❌ [ERROR] Template index.html not found: ${templatePath}`);
    process.exit(1);
  }

  const baseTemplateHtml = fs.readFileSync(templatePath, 'utf8');
  let createdCount = 0;
  const driveWarnings = [];

  products.forEach((product, index) => {
    const slug = product.slug;
    if (!slug) return;

    const targetFolder = path.join(publicHtmlDir, 'product', slug);
    const targetFile = path.join(targetFolder, 'index.html');

    const sanitizedDesc = (product.description || '')
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/\s+/g, ' ')
      .replace(/"/g, '&quot;')
      .trim();
    const shortDesc = sanitizedDesc.substring(0, 155).trim() + (sanitizedDesc.length > 155 ? '...' : '');

    const imageInput = product.image || '';
    let ogImageUrl = '';

    if (imageInput) {
      if (imageInput.includes('ik.imagekit.io')) {
        const baseImgUrl = imageInput.split('?')[0];
        ogImageUrl = `${baseImgUrl}?tr=w-1200,h-630,c-maintain_ratio,bg-F0F0F0`;
      } else if (imageInput.includes('drive.google.com')) {
        let docId = '';
        const rawIdMatch = imageInput.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        const slashIdMatch = imageInput.match(/\/d\/([a-zA-Z0-9_-]+)/);

        if (rawIdMatch) docId = rawIdMatch[1];
        else if (slashIdMatch) docId = slashIdMatch[1];

        if (docId) {
          driveWarnings.push({ name: product.name, slug, imageInput });
          const driveSrc = `https://lh3.googleusercontent.com/d/${docId}`;
          ogImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(driveSrc)}&w=1200&h=630&fit=contain&cbg=ffffff&output=jpg&q=90`;
        } else {
          ogImageUrl = imageInput;
        }
      } else {
        if (imageInput.startsWith('http')) {
          ogImageUrl = imageInput;
        } else {
          ogImageUrl = `https://mukeshsarees.com/${imageInput.replace(/^\/+/, '')}`;
        }
      }
    } else {
      ogImageUrl = 'https://mukeshsarees.com/images/og-home.jpg';
    }

    const docTitle = `${product.name} ${product.price ? `– ₹${product.price}` : ''} | Mukesh Saree Centre`;
    const docCanonicalUrl = `https://mukeshsarees.com/product/${slug}`;

    const productOgImage = `https://mukeshsarees.com/og-images/${slug}.jpg`;

    const customOgTags = `<!-- Dynamic OG Tags -->
  <meta property="og:title" content="${docTitle}" />
  <meta property="og:description" content="${shortDesc}" />
  <meta property="og:image" content="${productOgImage}" />
  <meta property="og:image:secure_url" content="${productOgImage}" />
  <meta property="og:url" content="${docCanonicalUrl}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Mukesh Saree Centre" />
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="1200" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${docTitle}" />
  <meta name="twitter:description" content="${shortDesc}" />
  <meta name="twitter:image" content="${productOgImage}" />
  <link rel="canonical" href="${docCanonicalUrl}" />
  <!-- End Dynamic OG Tags -->`;

    let outHtml = baseTemplateHtml;

    outHtml = outHtml.replace(/<title>.*?<\/title>/is, `<title>${docTitle}</title>`);
    outHtml = outHtml.replace(/<link rel="canonical" href="[^"]*".*?>/is, `<link rel="canonical" href="${docCanonicalUrl}" />`);
    outHtml = outHtml.replace(/<meta name="description" content=".*?".*?>/is, `<meta name="description" content="${shortDesc}" />`);

    if (outHtml.includes('<!-- Dynamic OG Tags -->') && outHtml.includes('<!-- End Dynamic OG Tags -->')) {
      outHtml = outHtml.replace(/<!-- Dynamic OG Tags -->[\s\S]*?<!-- End Dynamic OG Tags -->/is, customOgTags);
    } else {
      outHtml = outHtml.replace('<head>', `<head>\n  ${customOgTags}`);
    }

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
  console.log('======================================================\n');
}

runGenerator();
