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
      .replace(/^(\*\*)?DESCRIPTION\s*:\s*(\*\*)?\s*/i, '')
      .replace(/\bDESCRIPTION\s*:\s*/gi, '')
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/\s+/g, ' ')
      .replace(/"/g, '&quot;')
      .trim();
    const shortDesc = sanitizedDesc.substring(0, 155).trim() + (sanitizedDesc.length > 155 ? '...' : '');

    const imageInput = product.image || '';
    const absoluteProductImage = imageInput
      ? (imageInput.startsWith('http') ? imageInput : `https://mukeshsarees.com/${imageInput.replace(/^\/+/, '')}`)
      : 'https://mukeshsarees.com/og-image.jpg';

    const docTitle = `${product.name} ${product.price ? `– ₹${product.price}` : ''} | Mukesh Saree Centre`;
    const docCanonicalUrl = `https://mukeshsarees.com/product/${slug}`;

    let customOgTags = `<!-- Dynamic OG Tags -->
  <meta property="og:title" content="${product.name}" />
  <meta property="og:description" content="${shortDesc}" />
  <meta property="og:image" content="${absoluteProductImage}" />
  <meta property="og:image:secure_url" content="${absoluteProductImage}" />
  <meta property="og:url" content="${docCanonicalUrl}/" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Mukesh Saree Centre" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${product.name}" />
  <meta name="twitter:description" content="${shortDesc}" />
  <meta name="twitter:image" content="${absoluteProductImage}" />
  <link rel="canonical" href="${docCanonicalUrl}/" />`;

    if (slug === 'payment-test-product') {
      customOgTags += `\n  <meta name="robots" content="noindex, nofollow" />`;
    }

    customOgTags += `\n  <!-- End Dynamic OG Tags -->`;

    // Google Product SEO JSON-LD schema
    const prodSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": absoluteProductImage,
      "description": shortDesc,
      "sku": product.sku || `MSC-${product.id}`,
      "mpn": product.sku || `MSC-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "Mukesh Saree Centre"
      },
      "offers": {
        "@type": "Offer",
        "url": docCanonicalUrl,
        "priceCurrency": "INR",
        "price": String(product.price),
        "priceValidUntil": "2030-01-01",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Mukesh Saree Centre"
        }
      }
    };

    if (product.reviews && product.reviews.length > 0) {
      const totalReviews = product.reviews.length;
      const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
      prodSchema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": avgRating.toFixed(1),
        "reviewCount": totalReviews.toString()
      };
    }

    const prodBreadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mukeshsarees.com/" },
        { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://mukeshsarees.com/shop" },
        { "@type": "ListItem", "position": 3, "name": product.category, "item": `https://mukeshsarees.com/shop?category=${encodeURIComponent(product.category)}` },
        { "@type": "ListItem", "position": 4, "name": product.name, "item": docCanonicalUrl }
      ]
    };

    const schemaTags = `\n<script type="application/ld+json">${JSON.stringify(prodBreadcrumb)}</script>\n<script type="application/ld+json">${JSON.stringify(prodSchema)}</script>\n`;

    let outHtml = baseTemplateHtml;

    outHtml = outHtml.replace(/<link\s+[^>]*rel=['"]canonical['"][^>]*>\s*/gi, '');
    outHtml = outHtml.replace(/<title(.*?)>.*?<\/title>/is, `<title>${docTitle}</title>`);
    outHtml = outHtml.replace(/<meta[^>]*name=["']description["'][^>]*>/is, `<meta name="description" content="${shortDesc}" />`);

    if (outHtml.includes('<!-- Default OG Tags -->') && outHtml.includes('<!-- End Default OG Tags -->')) {
      outHtml = outHtml.replace(/<!-- Default OG Tags -->[\s\S]*?<!-- End Default OG Tags -->/is, customOgTags);
    } else if (outHtml.includes('<!-- Dynamic OG Tags -->') && outHtml.includes('<!-- End Dynamic OG Tags -->')) {
      outHtml = outHtml.replace(/<!-- Dynamic OG Tags -->[\s\S]*?<!-- End Dynamic OG Tags -->/is, customOgTags);
    } else {
      outHtml = outHtml.replace('</head>', `${customOgTags}\n</head>`);
    }

    outHtml = outHtml.replace('</head>', `${schemaTags}</head>`);

    // Inject H1 into the root for crawlers
    const h1Injection = `<div style="display:none;"><h1>${product.name}</h1></div>`;
    outHtml = outHtml.replace(/<div id="root">.*?<\/div>/is, `<div id="root">${h1Injection}</div>`);

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
