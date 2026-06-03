import fs from "fs";
import path from "path";
import { products } from "../src/mockData.js";
import dotenv from "dotenv";

dotenv.config();

process.env.VITE_FB_DOMAIN_VERIFY = 'kjvbvikfmctlsdfygll3tadkpzty8a';

function replaceEnvPlaceholders(html: string): string {
  const fallbacks: Record<string, string> = {
    VITE_META_PIXEL_ID: '3834311026859384',
    VITE_FB_DOMAIN_VERIFY: 'kjvbvikfmctlsdfygll3tadkpzty8a',
    VITE_GTM_ID: '',
    VITE_GA4_ID: '',
    VITE_PINTEREST_TAG: '',
    VITE_PINTEREST_DOMAIN: '',
    VITE_RAZORPAY_KEY_ID: 'rzp_live_Sw0OjZoidQe04p',
    VITE_WHATSAPP_NUMBER: '917020664641',
    VITE_SHEETS_WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec',
    VITE_GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec',
    VITE_SITE_URL: 'https://mukeshsarees.com',
    VITE_SITE_NAME: 'Mukesh Saree Centre',
    VITE_STORE_PHONE: '+91 7020664641',
  };

  return html.replace(/%VITE_([A-Z0-9_]+)%/g, (match, key) => {
    const envKey = `VITE_${key}`;
    let val = process.env[envKey];
    if (envKey === 'VITE_FB_DOMAIN_VERIFY') {
      val = 'kjvbvikfmctlsdfygll3tadkpzty8a';
    }
    if (key === 'GA4_ID' && !val) {
      val = process.env.VITE_GA_MEASUREMENT_ID || process.env.VITE_GA4_ID;
    }
    if (val === undefined) {
      val = fallbacks[envKey];
    }
    if (val !== undefined && val !== null) {
      const strVal = String(val).trim();
      if (
        strVal.startsWith('your_') ||
        strVal.includes('YOUR_SCRIPT_ID') ||
        strVal === 'your_fb_domain_verify_token' ||
        strVal === 'your_pinterest_domain_verify' ||
        strVal === 'your_gtm_id' ||
        strVal === 'your_pinterest_tag_id' ||
        strVal === 'your_ga4_measurement_id' ||
        strVal === 'G_GA4_MEASUREMENT_ID'
      ) {
        return '';
      }
      return strVal;
    }
    return '';
  });
}

// Helper to sanitize text for meta/JSON attributes
function cleanDescriptionForPrerender(rawDesc: string): string {
  if (!rawDesc) return "";
  let text = rawDesc;
  // Remove markdown headers/labels
  text = text.replace(/\*\*(DESCRIPTION|HIGHLIGHTS|FABRIC DETAILS|SIZE & FIT|STYLING|CARE INSTRUCTIONS|WASH CARE|FABRIC):\*\*/gi, "");
  text = text.replace(/\*\*[A-Z\s&_:\-]+\:\*\*/gi, "");
  text = text.replace(/\*\*[A-Z\s&_:\-]+\*\*/gi, "");
  // Remove bold/italic markup markers
  text = text.replace(/\*\*/g, "");
  text = text.replace(/\*/g, "");
  // Remove bullet points
  text = text.replace(/^[•\-\*\s]+/gm, "");
  // Replace multiple spaces and newlines
  text = text.replace(/\s+/g, " ");
  return text.trim();
}

function getWhatsAppSafePrerenderDescription(text: string, productContext?: any): string {
  if (!text) return "Shop premium Indian ethnic wear, sarees, and co-ord sets at Mukesh Saree Centre.";
  
  // Clean HTML, Markdown, and other clutter
  let clean = text
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\*\*(DESCRIPTION|HIGHLIGHTS|FABRIC DETAILS|SIZE & FIT|STYLING|CARE INSTRUCTIONS|WASH CARE|FABRIC):\*\*/gi, "")
    .replace(/\*\*[A-Z\s&_:\-]+\:\*\*/gi, " ")
    .replace(/\*\*[A-Z\s&_:\-]+\*\*/gi, " ")
    .replace(/^[•\-\*\s]+/gm, " ")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Extract first complete sentence (must end with . or ! or ?)
  const sentenceEndRegex = /[.!?](?=\s|$)/;
  const match = clean.match(sentenceEndRegex);
  
  let sentence = "";
  if (match && match.index !== undefined) {
    sentence = clean.slice(0, match.index + 1).trim();
  } else {
    sentence = clean;
  }

  // If sentence is empty or too short (less than 20 chars), design an elegant fallback based on product context
  if (sentence.length < 20 && productContext) {
    const color = productContext.color || "";
    const fabric = productContext.fabric || "";
    const category = productContext.category || "ensemble";
    sentence = `This elegant ${color} ${fabric} ${category} is beautifully crafted to elevate your ethnic style.`;
  } else if (sentence.length < 20) {
    sentence = "Experience premium comfort and elegance with our handpicked Indian ethnic wear collection.";
  }

  // Ensure it doesn't exceed 60 words and has no truncation mid-sentence
  const words = sentence.split(/\s+/);
  if (words.length > 60) {
    sentence = words.slice(0, 60).join(" ");
  }

  // Ensure proper sentence termination
  if (!/[.!?]$/.test(sentence)) {
    sentence += ".";
  }

  return sentence;
}

function getWhatsAppSafePrerenderImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return 'https://mukeshsarees.com/images/og-home.jpg';
  
  let targetUrl = imageUrl;
  if (imageUrl.includes('drive.google.com')) {
    let fileId = '';
    const idMatch = imageUrl.match(/[?&]id=([^&]+)/);
    if (idMatch) {
      fileId = idMatch[1];
    } else {
      const dMatch = imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (dMatch) {
        fileId = dMatch[1];
      }
    }
    if (fileId) {
      targetUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  } else if (imageUrl.includes('lh3.googleusercontent.com')) {
    targetUrl = imageUrl.split('=')[0]; // strip existing params
  }
  
  if (targetUrl.includes('wsrv.nl')) {
    return targetUrl
      .replace(/w=\d+/, 'w=1200')
      .replace(/h=\d+/, 'h=630')
      .replace(/fit=[a-z]+/, 'fit=cover')
      .replace('output=webp', 'output=jpg');
  } else {
    return `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=1200&h=630&fit=cover&a=attention&output=jpg&q=85`;
  }
}

function getSquarePrerenderImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return 'https://mukeshsarees.com/images/og-home.jpg';
  
  let targetUrl = imageUrl;
  
  if (imageUrl.includes('wsrv.nl')) {
    const match = imageUrl.match(/[?&]url=([^&]+)/);
    if (match) {
      targetUrl = decodeURIComponent(match[1]);
    }
  }

  if (targetUrl.includes('drive.google.com')) {
    let fileId = '';
    const idMatch = targetUrl.match(/[?&]id=([^&]+)/);
    if (idMatch) {
      fileId = idMatch[1];
    } else {
      const dMatch = targetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (dMatch) {
        fileId = dMatch[1];
      }
    }
    if (fileId) {
      targetUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  } else if (targetUrl.includes('lh3.googleusercontent.com')) {
    targetUrl = targetUrl.split('=')[0]; // strip existing params
  }
  
  return `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=1200&h=1200&fit=contain&cbg=ffffff&output=jpg&q=90`;
}

function sanitize(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mdToHtml(markdown: string): string {
  if (!markdown) return "";
  // Simple markdown bullet points and headings
  let html = markdown;
  // Convert bullet points
  html = html.replace(/^[•\-]\s*(.*)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Wrap sections in paragraphs
  const paragraphs = html.split("\n\n").map(p => {
    if (p.trim().startsWith("<li") || p.trim().startsWith("<ul")) return p;
    return `<p style="margin-bottom: 12px; line-height: 1.6; font-size: 14px; color: #4a4a4a;">${p.replace(/\n/g, "<br>")}</p>`;
  });
  return paragraphs.join("");
}

// Generate Header and Footer skeleton
function getHeaderHtml(): string {
  return `
    <header style="background: rgba(250, 246, 240, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.04); font-family: 'Playfair Display', serif; position: sticky; top: 0; z-index: 100;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <a href="/" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
          <img src="/images/logo.webp" alt="Mukesh Saree Centre Logo" style="width: auto; height: auto; min-width: 160px; max-width: 180px; object-fit: contain;" />
        </a>
      </div>
      <nav style="display: flex; gap: 24px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px;">
        <a href="/shop" style="text-decoration: none; color: #1a0a00; padding: 4px 0;">Shop</a>
        <a href="/shop?category=Sarees" style="text-decoration: none; color: #1a0a00; padding: 4px 0;">Sarees</a>
        <a href="/shop?category=Co-Ord-Sets" style="text-decoration: none; color: #1a0a00; padding: 4px 0;">Co-Ord Sets</a>
        <a href="/contact" style="text-decoration: none; color: #1a0a00; padding: 4px 0;">Contact</a>
      </nav>
    </header>
  `;
}

function getFooterHtml(): string {
  return `
    <footer style="background-color: #1A0A00; color: #faf6f0; padding: 80px 32px; font-family: 'Inter', sans-serif; border-top: 1px solid rgba(255,255,255,0.05);">
      <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 48px; text-align: left;">
        <div>
          <h3 style="font-family: 'Playfair Display', serif; color: #d4af37; font-size: 20px; font-weight: 500; margin: 0 0 24px 0; letter-spacing: 2px;">MUKESH SAREE CENTRE</h3>
          <p style="opacity: 0.7; font-size: 13px; line-height: 1.8; color: #e5dfd5;">Premium luxury Indian ethnic wear, specializing in pure silk sarees, designer Banarasi, and high-quality contemporary co-ord sets. Nagpur's trusted fashion boutique since 1978.</p>
          <p style="margin-top: 24px; font-size: 13px; color: #d4af37;">📍 Gandhibagh, Nagpur, Maharashtra</p>
        </div>
        <div>
          <h4 style="font-family: 'Playfair Display', serif; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #faf6f0; margin: 0 0 20px 0;">Shop Categories</h4>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; line-height: 2.2;">
            <li><a href="/shop?category=Sarees" style="color: #e5dfd5; text-decoration: none; opacity: 0.82;">Classic Silk Sarees</a></li>
            <li><a href="/shop?category=Linen Sarees" style="color: #e5dfd5; text-decoration: none; opacity: 0.82;">Premium Linen Sarees</a></li>
            <li><a href="/shop?category=Co-Ord-Sets" style="color: #e5dfd5; text-decoration: none; opacity: 0.82;">Cotton Co-Ord Sets</a></li>
            <li><a href="/shop?category=Lehengas" style="color: #e5dfd5; text-decoration: none; opacity: 0.82;">Bridal & Designer Lehengas</a></li>
          </ul>
        </div>
        <div>
          <h4 style="font-family: 'Playfair Display', serif; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #faf6f0; margin: 0 0 20px 0;">Policies</h4>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px; line-height: 2.2;">
            <li><a href="/shipping-policy" style="color: #e5dfd5; text-decoration: none; opacity: 0.82;">Shipping & Cash on Delivery Policy</a></li>
            <li><a href="/return-policy" style="color: #e5dfd5; text-decoration: none; opacity: 0.82;">Returns & Refund Guidelines</a></li>
            <li><a href="/terms" style="color: #e5dfd5; text-decoration: none; opacity: 0.82;">Terms of Service</a></li>
            <li><a href="/contact" style="color: #e5dfd5; text-decoration: none; opacity: 0.82;">Support & Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 style="font-family: 'Playfair Display', serif; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #faf6f0; margin: 0 0 20px 0;">Contact Details</h4>
          <p style="opacity: 0.82; font-size: 13px; line-height: 1.8; color: #e5dfd5; margin: 0 0 12px 0;">📍 Mukesh Saree Centre, Jagnath Road, Gandhibagh, Nagpur, MH, 440002</p>
          <p style="opacity: 0.82; font-size: 13px; color: #e5dfd5; margin: 0 0 8px 0;">📞 Phone: +91 7020664641</p>
          <p style="opacity: 0.82; font-size: 13px; color: #e5dfd5; margin: 0;">✉ Email: info@mukeshsarees.com</p>
        </div>
      </div>
      <div style="text-align: center; border-top: 1px solid rgba(250,246,240,0.08); padding-top: 24px; margin-top: 64px; font-size: 12px; opacity: 0.55; color: #faf6f0; font-family: 'Inter', sans-serif;">
        &copy; 1978 - 2026 Mukesh Saree Centre Nagpur. All Rights Reserved. Specializing in luxury silk drapes and designer ethnic ensembles.
      </div>
    </footer>
  `;
}

// Format product card for general grid view
function getProductCardHtml(p: any): string {
  const wsrvImg = `https://wsrv.nl/?url=${encodeURIComponent(p.image)}&w=500&fit=contain&output=webp`;
  return `
    <div class="product-card" style="background: white; border-radius: 4px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05); transition: transform 0.3s; padding-bottom: 16px; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; justify-content: space-between;">
      <a href="/product/${p.slug}" style="text-decoration: none; color: inherit; display: block;">
         <div style="position: relative; overflow: hidden; aspect-ratio: 3/4; background: #faf6f0; display: flex; align-items: center; justify-content: center;">
          <img src="${wsrvImg}" alt="${sanitize(p.name)}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
        </div>
        <div style="padding: 16px; text-align: left;">
          <h3 style="font-family: 'Playfair Display', serif; font-size: 15px; margin: 0 0 10px 0; color: #1a0a00; line-height: 1.4; font-weight: 500;">${sanitize(p.name)}</h3>
          <div style="display: flex; align-items: baseline; gap: 8px;">
            <span style="font-size: 16px; font-weight: 600; color: #8c7355;">₹${p.price}</span>
            ${p.originalPrice ? `<span style="font-size: 12px; text-decoration: line-through; color: #999;">₹${p.originalPrice}</span>` : ""}
          </div>
        </div>
      </a>
      <div style="padding: 0 16px;">
        <a href="/product/${p.slug}" style="display: block; width: 100%; text-align: center; background: #1a0a00; color: white; padding: 10px 0; text-decoration: none; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; border-radius: 2px;">View Details</a>
      </div>
    </div>
  `;
}

// Generate pages
async function runPrerender() {
  const distPath = path.resolve(process.cwd(), "dist");
  const baseHtmlPath = path.join(distPath, "index.html");

  if (!fs.existsSync(baseHtmlPath)) {
    console.error(`[PRERENDER] File index.html was not found in static build folder: ${baseHtmlPath}. Build frontend first!`);
    process.exit(1);
  }

  const rawBaseHtml = fs.readFileSync(baseHtmlPath, "utf-8");
  const cleanHtmlPath = path.join(distPath, "index-clean.html");
  fs.writeFileSync(cleanHtmlPath, rawBaseHtml);
  console.log(`[PRERENDER] Saved original clean index.html to ${cleanHtmlPath}`);
  
  const baseHtml = replaceEnvPlaceholders(rawBaseHtml);
  console.log(`[PRERENDER] Loaded raw base HTML and replaced placeholders.`);

  // Setup dynamic routing directory write-helper
  const writePage = (dirName: string, htmlContent: string) => {
    const fullDir = path.join(distPath, dirName);
    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }
    const processedHtml = replaceEnvPlaceholders(htmlContent);
    fs.writeFileSync(path.join(fullDir, "index.html"), processedHtml);
  };

  // 1. GENERATE HOMEPAGE (dist/index.html Overwrite)
  console.log("[PRERENDER] Engineering SEO index.html for Homepage...");
  const mainProducts = products.filter((p: any) => !p.isVariant && !p.isHidden);
  const featuredProducts = mainProducts.slice(0, 8);

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "Mukesh Saree Centre",
    "url": "https://mukeshsarees.com",
    "logo": "https://mukeshsarees.com/images/logo.webp",
    "description": "Mukesh Saree Centre, Nagpur — Premium sarees, linen sarees & co-ord sets since 1978. Cash on Delivery. Free shipping on orders ₹999+. Shop 100+ authentic ethnic wear styles.",
    "foundingDate": "1978",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jagnath Road, Gandhibagh",
      "addressLocality": "Nagpur",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN",
      "postalCode": "440002"
    },
    "telephone": "+917020664641",
    "priceRange": "$$",
    "sameAs": [
      "https://www.facebook.com/Mukeshsareesindia/",
      "https://www.instagram.com/mukeshsarees_nagpur",
      "https://www.pinterest.com/MukeshSareesdotcom/",
      "https://youtube.com/@mukeshsarees?si=aMljrBMnIJYQDGDI"
    ]
  };

  const homepageBody = `
    <div style="background-color: #faf6f0; min-height: 100vh;">
      ${getHeaderHtml()}

      <!-- Hero Section -->
      <section style="background-color: #1A0A00; color: #faf6f0; padding: 100px 24px; text-align: center; position: relative;">
        <div style="max-width: 800px; margin: 0 auto; z-index: 10; position: relative;">
          <span style="font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 4px; color: #d4af37; font-weight: 600;">ESTABLISHED 1978</span>
          <h1 style="font-family: 'Playfair Display', serif; font-size: 42px; margin: 16px 0 24px 0; font-weight: 500; line-height: 1.25;">Mukesh Saree Centre</h1>
          <p style="font-family: 'Inter', sans-serif; font-size: 15px; opacity: 0.85; line-height: 1.8; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; color: #f5f0e6;">Shop Nagpur's premium ethnic fashion. Explore pure mulberry silks, authentic linens, designer banarasis, bridal lehengas, and stylish breathable co-ord sets. Delivered to your doorstep with Cash on Delivery and free nationwide shipping above ₹999.</p>
          <div style="display: flex; gap: 16px; justify-content: center;">
            <a href="/shop" style="background: #faf6f0; color: #1a0a00; padding: 14px 28px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-radius: 2px;">Explore Collection</a>
            <a href="/contact" style="border: 1px solid rgba(250, 246, 240, 0.4); color: #faf6f0; padding: 14px 28px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-radius: 2px;">Contact Boutique</a>
          </div>
        </div>
      </section>

      <!-- Category Links -->
      <section style="max-width: 1200px; margin: 60px auto; padding: 0 24px;">
        <h2 style="font-family: 'Playfair Display', serif; text-align: center; font-size: 28px; margin-bottom: 40px; color: #1a0a00;">Browse By Collection</h2>
        <div class="collection-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px;">
          <a class="collection-card" href="/shop?category=Sarees" style="text-decoration: none; color: inherit; display: block; background: white; border: 1px solid rgba(0,0,0,0.04); padding: 32px; text-align: center; border-radius: 4px;">
            <h3 class="collection-card-title" style="font-family: 'Playfair Display', serif; margin: 0 0 8px 0; font-size: 18px;">Designer Sarees</h3>
            <span style="font-size: 12px; font-family: 'Inter', sans-serif; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px;">Pure Silks & Linens</span>
          </a>
          <a class="collection-card" href="/shop?category=Co-Ord-Sets" style="text-decoration: none; color: inherit; display: block; background: white; border: 1px solid rgba(0,0,0,0.04); padding: 32px; text-align: center; border-radius: 4px;">
            <h3 class="collection-card-title" style="font-family: 'Playfair Display', serif; margin: 0 0 8px 0; font-size: 18px;">Co-Ord Sets</h3>
            <span style="font-size: 12px; font-family: 'Inter', sans-serif; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px;">Luxe Cotton & Linen Pairs</span>
          </a>
          <a class="collection-card" href="/shop?category=Lehengas" style="text-decoration: none; color: inherit; display: block; background: white; border: 1px solid rgba(0,0,0,0.04); padding: 32px; text-align: center; border-radius: 4px;">
            <h3 class="collection-card-title" style="font-family: 'Playfair Display', serif; margin: 0 0 8px 0; font-size: 18px;">Lehengas</h3>
            <span style="font-size: 12px; font-family: 'Inter', sans-serif; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px;">Grand Wedding Attire</span>
          </a>
          <a class="collection-card" href="/shop?category=Kurtas" style="text-decoration: none; color: inherit; display: block; background: white; border: 1px solid rgba(0,0,0,0.04); padding: 32px; text-align: center; border-radius: 4px;">
            <h3 class="collection-card-title" style="font-family: 'Playfair Display', serif; margin: 0 0 8px 0; font-size: 18px;">Kurtas & Suits</h3>
            <span style="font-size: 12px; font-family: 'Inter', sans-serif; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px;">Comfortable Everyday Elegance</span>
          </a>
        </div>
      </section>

      <!-- Featured Grid -->
      <section style="max-width: 1200px; margin: 80px auto; padding: 0 24px; text-align: center;">
        <h2 style="font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 12px; color: #1a0a00;">Featured Arrivals</h2>
        <p style="font-family: 'Inter', sans-serif; font-size: 14px; opacity: 0.6; margin-bottom: 48px;">Handselected masterpieces crafted with unparalleled diligence.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 32px;">
          ${featuredProducts.map(getProductCardHtml).join("")}
        </div>
      </section>

      <!-- Editorial Legacy section -->
      <section style="background-color: white; border-top: 1px solid rgba(0,0,0,0.04); border-bottom: 1px solid rgba(0,0,0,0.04); padding: 80px 24px;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center; font-family: 'Playfair Display', serif;">
          <h2 style="font-size: 30px; margin-bottom: 24px; color: #1a0a00;">Our Legacy Since 1978</h2>
          <p style="font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.8; color: #4a4a4a; margin-bottom: 24px;">Founded in the heart of Nagpur's historic textile market, Mukesh Saree Centre has been the premier destination for premium silk sarees, bridal trousseaus, and custom handloom drapes for over four decades. We bring together time-tested weaver traditions with premium fabrics like Banarasi Georgette, pure Organza silks, high-density Linens, and premium co-ord sets.</p>
          <p style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: bold; color: #8c7355; letter-spacing: 1.5px; text-transform: uppercase;">A Heritage of Trust, Originality, and Royal Appeal.</p>
        </div>
      </section>

      ${getFooterHtml()}
    </div>
  `;

  // Inject into index.html for Root and Schema
  let updatedHomeHtml = baseHtml;

  const defaultOgBlockRegex = /<!-- Default OG Tags -->[\s\S]*?<!-- End Default OG Tags -->/;
  const homeOgTags = `<!-- Dynamic OG Tags -->
  <meta property="og:title" content="Mukesh Saree Centre — Premium Indian Ethnic Wear Since 1978" />
  <meta property="og:description" content="Mukesh Saree Centre, Nagpur — Premium sarees, linen sarees & co-ord sets since 1978. Cash on Delivery. Free shipping on orders ₹999+. Shop 100+ authentic ethnic wear styles." />
  <meta property="og:image" content="https://mukeshsarees.com/images/og-home.jpg" />
  <meta property="og:url" content="https://mukeshsarees.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Mukesh Saree Centre" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Mukesh Saree Centre — Premium Indian Ethnic Wear Since 1978" />
  <meta name="twitter:description" content="Mukesh Saree Centre, Nagpur — Premium sarees, linen sarees & co-ord sets since 1978. Cash on Delivery. Free shipping on orders ₹999+. Shop 100+ authentic ethnic wear styles." />
  <meta name="twitter:image" content="https://mukeshsarees.com/images/og-home.jpg" />
  <link rel="canonical" href="https://mukeshsarees.com/" />
  <!-- End Dynamic OG Tags -->`;

  updatedHomeHtml = updatedHomeHtml.replace(defaultOgBlockRegex, homeOgTags);
  updatedHomeHtml = updatedHomeHtml.replace("</head>", `<script type="application/ld+json">${JSON.stringify(homeSchema)}</script></head>`);

  fs.writeFileSync(baseHtmlPath, replaceEnvPlaceholders(updatedHomeHtml));
  console.log("[PRERENDER] Index.html updated successfully with homepage static HTML.");


  // 2. GENERATE SHOP PAGE (dist/shop/index.html)
  console.log("[PRERENDER] Engineering static file for Shop page...");
  const shopSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shop Premium Indian Ethnic Wear — Mukesh Saree Centre",
    "url": "https://mukeshsarees.com/shop",
    "description": "Browse 100+ premium sarees, linen sarees and cotton co-ord sets at Mukesh Saree Centre. All at 50% OFF. Cash on Delivery available across India.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mukeshsarees.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Shop",
          "item": "https://mukeshsarees.com/shop"
        }
      ]
    }
  };

  const shopBody = `
    <div style="background-color: #faf6f0; min-height: 100vh;">
      ${getHeaderHtml()}
      
      <main style="max-width: 1200px; margin: 40px auto; padding: 0 24px;">
        <div style="text-align: center; margin-bottom: 48px; font-family: 'Playfair Display', serif;">
          <h1 style="font-size: 36px; margin-bottom: 12px; color: #1a0a00; font-weight: 500;">Complete Collection</h1>
          <p style="font-family: 'Inter', sans-serif; font-size: 14px; opacity: 0.6;">All products under one premium luxury catalogue with instant COD checkout.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 32px;">
          ${mainProducts.map(getProductCardHtml).join("")}
        </div>
      </main>

      ${getFooterHtml()}
    </div>
  `;

  let shopHtml = baseHtml
    .replace(/<title>.*?<\/title>/, "<title>Shop Premium Indian Ethnic Ensembles | Mukesh Saree Centre</title>")
    .replace(
      /<meta name="description" content=".*?"\s*\/>/,
      `<meta name="description" content="Browse 50+ premium sarees, linen sarees, co-ord sets and lehengas. Cash on Delivery available. Free shipping above ₹999. Trusted since 1978." />`
    );

  const shopOgTags = `<!-- Dynamic OG Tags -->
    <meta property="og:title" content="Shop Sarees, Co-Ord Sets & Ethnic Wear — Mukesh Saree Centre" />
    <meta property="og:description" content="Browse 50+ premium sarees, linen sarees, co-ord sets and lehengas. Cash on Delivery available. Free shipping above ₹999. Trusted since 1978." />
    <meta property="og:image" content="https://mukeshsarees.com/images/og-home.jpg" />
    <meta property="og:url" content="https://mukeshsarees.com/shop" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Mukesh Saree Centre" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Shop Sarees, Co-Ord Sets & Ethnic Wear — Mukesh Saree Centre" />
    <meta name="twitter:description" content="Browse 50+ premium sarees, linen sarees, co-ord sets and lehengas. Cash on Delivery available. Free shipping above ₹999. Trusted since 1978." />
    <meta name="twitter:image" content="https://mukeshsarees.com/images/og-home.jpg" />
    <link rel="canonical" href="https://mukeshsarees.com/shop" />
    <!-- End Dynamic OG Tags -->`;

  shopHtml = shopHtml.replace(defaultOgBlockRegex, shopOgTags);
  shopHtml = shopHtml.replace("</head>", `<script type="application/ld+json">${JSON.stringify(shopSchema)}</script></head>`);

  writePage("shop", shopHtml);
  console.log("[PRERENDER] Shop static route compiled.");


  // 3. GENERATE PRODUCT PAGES (dist/product/[slug]/index.html)
  console.log("[PRERENDER] Processing product pages...");
  for (const p of products) {
    if (p.isHidden) continue;
    if (!p.slug) continue;

    console.log(`[PRERENDER] Generating product: ${p.name} (/product/${p.slug})`);
    
    // Breadcrumb schema
    const prodBreadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mukeshsarees.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Shop",
          "item": "https://mukeshsarees.com/shop"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": p.category,
          "item": `https://mukeshsarees.com/shop?category=${encodeURIComponent(p.category === "Co-Ord Sets" ? "Co-Ord-Sets" : p.category)}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": p.name,
          "item": `https://mukeshsarees.com/product/${p.slug}`
        }
      ]
    };

    // Google Product SEO JSON-LD schema
    const prodSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": p.name,
      "image": p.image,
      "description": p.description ? p.description.replace(/\*\*/g, "").replace(/<[^>]*>?/gm, "").substring(0, 300) : p.name,
      "sku": p.sku || `MSC-${p.id}`,
      "mpn": p.sku || `MSC-${p.id}`,
      "brand": {
        "@type": "Brand",
        "name": "Mukesh Saree Centre"
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Arpita Shinde"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": String(p.rating || 4.8),
        "reviewCount": "18"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://mukeshsarees.com/product/${p.slug}`,
        "priceCurrency": "INR",
        "price": String(p.price),
        "priceValidUntil": "2030-01-01",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": p.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Mukesh Saree Centre"
        }
      }
    };

    const wsrvImgMain = `https://wsrv.nl/?url=${encodeURIComponent(p.image)}&w=800&output=webp&q=85`;

    // Dynamic clean structured product layout
    const productBody = `
      <div style="background-color: #faf6f0; min-height: 100vh;">
        ${getHeaderHtml()}

        <main style="max-width: 1200px; margin: 32px auto; padding: 0 24px; font-family: 'Inter', sans-serif;">
          <!-- Breadcrumb visual -->
          <nav style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.6; margin-bottom: 24px;">
            <a href="/" style="color: inherit; text-decoration: none;">Home</a> / 
            <a href="/shop" style="color: inherit; text-decoration: none;">Shop</a> / 
            <a href="/shop?category=${encodeURIComponent(p.category === "Co-Ord Sets" ? "Co-Ord-Sets" : p.category)}" style="color: inherit; text-decoration: none;">${sanitize(p.category)}</a> / 
            <span style="color: #1a0a00; font-weight: bold;">${sanitize(p.name)}</span>
          </nav>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 48px; text-align: left;">
            <!-- Gallery placeholder -->
            <div>
              <div style="aspect-ratio: 3/4; border-radius: 4px; overflow: hidden; background: white; border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center;">
                <img src="${wsrvImgMain}" alt="${sanitize(p.name)}" style="width: 100%; height: 100%; object-fit: contain; object-position: center;" />
              </div>
            </div>

            <!-- Product details -->
            <div style="display: flex; flex-direction: column; justify-content: flex-start;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8c7355; font-weight: 600; margin-bottom: 8px;">${sanitize(p.category)}</span>
              <h1 style="font-family: 'Playfair Display', serif; font-size: 32px; color: #1a0a00; font-weight: 500; margin: 0 0 16px 0; line-height: 1.3;">${sanitize(p.name)}</h1>
              
              <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 20px;">
                <span style="font-size: 24px; font-weight: bold; color: #8c7355;">₹${p.price}</span>
                ${p.originalPrice ? `<span style="font-size: 16px; text-decoration: line-through; color: #999;">₹${p.originalPrice}</span>` : ""}
                <span style="background: rgba(140, 115, 85, 0.1); color: #8c7355; font-size: 10px; text-transform: uppercase; font-weight: bold; padding: 4px 8px; border-radius: 2px; margin-left: 8px;">FREE SHIPPING</span>
              </div>

              <!-- Key specs -->
              <table style="width: 100%; font-size: 13px; margin-bottom: 32px; border-collapse: collapse;">
                ${p.fabric ? `<tr style="border-bottom: 1px solid rgba(0,0,0,0.04);"><td style="padding: 10px 0; font-weight: bold; color: #1a0a00; width: 30%;">Fabric</td><td style="padding: 10px 0; color: #4a4a4a;">${sanitize(p.fabric)}</td></tr>` : ""}
                ${p.color ? `<tr style="border-bottom: 1px solid rgba(0,0,0,0.04);"><td style="padding: 10px 0; font-weight: bold; color: #1a0a00;">Color</td><td style="padding: 10px 0; color: #4a4a4a;">${sanitize(p.color)}</td></tr>` : ""}
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);"><td style="padding: 10px 0; font-weight: bold; color: #1a0a00;">Availability</td><td style="padding: 10px 0; color: #2e7d32; font-weight: 500;">In Stock (Ready to Dispatch)</td></tr>
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);"><td style="padding: 10px 0; font-weight: bold; color: #1a0a00;">Payment</td><td style="padding: 10px 0; color: #4a4a4a;">Cash on Delivery (COD) & Online Payments supported</td></tr>
              </table>

              <!-- Description -->
              <div style="margin-bottom: 32px;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 18px; color: #1a0a00; margin-bottom: 12px; font-weight: 500;">Product Description</h3>
                <div style="font-size: 14px; line-height: 1.6; color: #4a4a4a;">
                  ${mdToHtml(p.description || "")}
                </div>
              </div>

              <!-- Quick Action -->
              <div style="margin-top: auto;">
                <a href="/product/${p.slug}" style="display: block; width: 100%; text-align: center; background: #1a0a00; color: white; padding: 16px 0; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; border-radius: 4px;">Buy Now Online / COD</a>
              </div>
            </div>
          </div>
        </main>

        ${getFooterHtml()}
      </div>
    `;

    const originalUrl = `https://mukeshsarees.com/product/${p.slug}`;
    const wsrvImgLandscape = getWhatsAppSafePrerenderImageUrl(p.image);
    const shortDesc = getWhatsAppSafePrerenderDescription(p.description || "", p).replace(/\|/g, "").trim();
    const mrpPart = p.originalPrice ? ` (MRP ₹${p.originalPrice})` : "";
    const prodDesc = `✨ ${shortDesc} | 💰 ₹${p.price}${mrpPart} | 🚚 Free Shipping | Cash on Delivery Available`;
    const pageTitle = `${p.name} – ₹${p.price} | Mukesh Saree Centre`;
    
    let prodHtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${sanitize(pageTitle)}</title>`)
      .replace(
        /<meta name="description" content=".*?"\s*\/>/,
        `<meta name="description" content="${sanitize(prodDesc)}" />`
      );
 
    const dynamicTags = `<!-- Dynamic OG Tags -->
    <meta property="og:title" content="${sanitize(pageTitle)}" />
    <meta property="og:description" content="${sanitize(prodDesc)}" />
    <meta property="og:image" content="${wsrvImgLandscape}" />
    <meta property="og:image:secure_url" content="${wsrvImgLandscape}" />
    <meta property="og:url" content="${originalUrl}" />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="Mukesh Saree Centre" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${sanitize(pageTitle)}" />
    <meta name="twitter:description" content="${sanitize(prodDesc)}" />
    <meta name="twitter:image" content="${wsrvImgLandscape}" />
    <link rel="canonical" href="${originalUrl}" />
    <!-- End Dynamic OG Tags -->`;

    prodHtml = prodHtml.replace(defaultOgBlockRegex, dynamicTags);

    // Inject Schemas
    prodHtml = prodHtml.replace(
      "</head>",
      `<script type="application/ld+json">${JSON.stringify(prodBreadcrumb)}</script>
       <script type="application/ld+json">${JSON.stringify(prodSchema)}</script></head>`
    );

    // Save
    writePage(`product/${p.slug}`, prodHtml);
  }


  // 4. GENERATE POLICIES AND STATIC PAGES (terms, contact, shipping-policy, return-policy)
  const staticPages = [
    {
      dir: "contact",
      title: "Contact Boutique — Mukesh Saree Centre, Gandhibagh, Nagpur",
      desc: "Contact Mukesh Saree Centre, Gandhibagh Nagpur. Call +91 7020664641. Open 11:30AM–9:30PM (closed Mondays). Bridal saree bookings, custom orders welcome.",
      body: `
        <div style="background-color: #faf6f0; min-height: 100vh;">
          ${getHeaderHtml()}
          <main style="max-width: 800px; margin: 60px auto; padding: 0 24px; font-family: 'Inter', sans-serif; text-align: left;">
            <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #1a0a00; margin-bottom: 24px; font-weight: 500;">Contact Us</h1>
            <p style="font-size: 15px; line-height: 1.8; color: #4a4a4a; margin-bottom: 40px;">For any inquiries, sizing requests, bridal booking, or support with your cash-on-delivery or online payments, please contact our Nagpur showroom or write to us through our direct email.</p>
            
            <div style="background: white; border-radius: 4px; border: 1px solid rgba(0,0,0,0.05); padding: 32px; margin-bottom: 48px;">
              <h2 style="font-family: 'Playfair Display', serif; font-size: 22px; margin-top: 0; margin-bottom: 24px; color: #1a0a00;">Store Showroom</h2>
              <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">📍 <strong>Address:</strong> Jagnath Road, Gandhibagh, Nagpur, Maharashtra, 440002, India</p>
              <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">📞 <strong>Phone:</strong> +91 7020664641</p>
              <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">✉ <strong>Email:</strong> info@mukeshsarees.com</p>
              <p style="font-size: 14px; line-height: 1.6; margin-bottom: 0;">⏰ <strong>Hours:</strong> 11:30 AM to 9:30 PM (All days except Mon)</p>
            </div>
          </main>
          ${getFooterHtml()}
        </div>
      `
    },
    {
      dir: "shipping-policy",
      title: "Shipping & Delivery Policy | Mukesh Saree Centre",
      desc: "Learn about our free shipping across India, delivery timelines, trusted courier partners, COD availability, and order tracking.",
      body: `
        <div style="background-color: #faf6f0; min-height: 100vh;">
          ${getHeaderHtml()}
          <main style="max-width: 800px; margin: 60px auto; padding: 0 24px; font-family: 'Inter', sans-serif; text-align: left;">
            <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #1a0a00; margin-bottom: 24px; font-weight: 500;">Shipping & Delivery Policy</h1>
            <div style="background: white; border-radius: 4px; border: 1px solid rgba(0,0,0,0.05); padding: 32px; line-height: 1.8; font-size: 14px; color: #4a4a4a;">
              <p style="margin-top: 0;">Experience premium delivery services across India. We ensure your ethnic wear reaches you safely, promptly, and in pristine condition.</p>
              
              <h3 style="margin-top: 24px;">1. Dispatch & Delivery Timelines</h3>
              <ul>
                <li><strong>Dispatch Time:</strong> Orders are carefully packed and dispatched within 24 to 48 hours.</li>
                <li><strong>Delivery Time:</strong> Standard deliveries generally take 3 to 7 business days post-dispatch.</li>
                <li><strong>Metro Regions:</strong> Deliveries to Tier 1 cities experience expedited delivery times (2-4 Days).</li>
              </ul>

              <h3 style="margin-top: 24px;">2. Trusted Courier Partners</h3>
              <p>We work with India's premier logistics providers: Delhivery, BlueDart, Amazon Shipping, Xpressbees, and DTDC.</p>

              <h3 style="margin-top: 24px;">3. Shipping Costs & Cash on Delivery (COD)</h3>
              <ul>
                <li><strong>Free Shipping:</strong> 100% Free Shipping on all orders across India.</li>
                <li><strong>COD Availability:</strong> Supported across 25,000+ pincodes in India. Serviceability is verified at checkout.</li>
              </ul>

              <h3 style="margin-top: 24px;">4. Order Tracking Information</h3>
              <p>Immediately upon dispatch, a unique airway bill (AWB) number and live tracking link will be shared via Email and WhatsApp.</p>
            </div>
          </main>
          ${getFooterHtml()}
        </div>
      `
    },
    {
      dir: "return-policy",
      title: "Returns & Refund Policy — Mukesh Saree Centre",
      desc: "Mukesh Saree Centre return policy — 7-day returns on all products. Refund via UPI/Bank Transfer within 3-5 business days. Easy hassle-free process.",
      body: `
        <div style="background-color: #faf6f0; min-height: 100vh;">
          ${getHeaderHtml()}
          <main style="max-width: 800px; margin: 60px auto; padding: 0 24px; font-family: 'Inter', sans-serif; text-align: left;">
            <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #1a0a00; margin-bottom: 24px; font-weight: 500;">Returns & Refund Policy</h1>
            <div style="background: white; border-radius: 4px; border: 1px solid rgba(0,0,0,0.05); padding: 32px; line-height: 1.8; font-size: 14px; color: #4a4a4a;">
              <p style="margin-top: 0;">We hold our boutique collections to strict quality criteria. In the rare event you need a return, please review our process below:</p>

              <h3>1. Return Eligibility</h3>
              <p>Returns are accepted within 7 days of package delivery. The items must be unused, unwashed, unaltered, and retain all native tags and designer cardboards.</p>

              <h3>2. How to Initiate a Return</h3>
              <p>Email us at info@mukeshsarees.com or WhatsApp us at +91 7020664641 with your Order ID and photo of the item. Our team will verify eligibility.</p>

              <h3>3. Refunds</h3>
              <p>Once verified, refunds are processed via Bank Transfer or GPay within 3-5 business days. For COD orders, refund options include store credit or UPI/Bank transfers securely.</p>
            </div>
          </main>
          ${getFooterHtml()}
        </div>
      `
    },
    {
      dir: "terms",
      title: "Terms & Conditions | Mukesh Saree Centre",
      desc: "Review the terms and conditions for Mukesh Saree Centre. Understanding our guidelines, policies, and terms ensures a transparent and smooth shopping experience.",
      body: `
        <div style="background-color: #faf6f0; min-height: 100vh;">
          ${getHeaderHtml()}
          <main style="max-width: 800px; margin: 60px auto; padding: 0 24px; font-family: 'Inter', sans-serif; text-align: left;">
            <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #1a0a00; margin-bottom: 24px; font-weight: 500;">Terms & Conditions</h1>
            <div style="background: white; border-radius: 4px; border: 1px solid rgba(0,0,0,0.05); padding: 32px; line-height: 1.8; font-size: 14px; color: #4a4a4a;">
              <p style="margin-top: 0; font-style: italic; border-left: 4px solid #F1E5C1; padding-left: 12px;">"Welcome to Mukesh Saree Centre. By accessing our website, placing an order, or using our services, you agree to comply with and be bound by the following legally protected terms and conditions."</p>
              
              <h3 style="margin-top: 24px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px;">1. Acceptance of Terms & Eligibility</h3>
              <p>By using mukeshsarees.com, you confirm that you have read, understood, and agreed to these Terms & Conditions. You must be at least 18 years of age (or shopping under parental supervision) to make purchases. We reserve the right to refuse service to anyone at our sole discretion.</p>

              <h3 style="margin-top: 24px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px;">2. Privacy, Product Disclaimers, and Order Policies</h3>
              <p>We strive to accurately represent product color and detail; however, variations may exist based on device displays. Once dispatched, orders cannot be cancelled. We utilize Razorpay for safe, secure online billing. For our detailed logistics outlines, refer to our Shipping Policy and Refund Rules.</p>

              <h3 style="margin-top: 24px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px;">3. Intellectual Property Rights</h3>
              <p>Content including images, text, user interfaces, branding, and graphics remain the exclusive, licensed property of Mukesh Saree Centre under Indian copyright laws. Unlawful extraction or usage of this material without written consent is strictly prohibited.</p>
            </div>
          </main>
          ${getFooterHtml()}
        </div>
      `
    }
  ];

  console.log("[PRERENDER] Compiling static policies...");
  for (const page of staticPages) {
    let phtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
      .replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${page.desc}" />`);

    const pageOgTags = `<!-- Dynamic OG Tags -->
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.desc}" />
    <meta property="og:image" content="https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1NmruXVYozTPtYyuyipddgCODomwUd2me&w=1200&h=630&fit=cover&a=attention&output=jpg&q=85" />
    <meta property="og:url" content="https://mukeshsarees.com/${page.dir}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Mukesh Saree Centre" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.desc}" />
    <meta name="twitter:image" content="https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1NmruXVYozTPtYyuyipddgCODomwUd2me&w=1200&h=630&fit=cover&a=attention&output=jpg&q=85" />
    <link rel="canonical" href="https://mukeshsarees.com/${page.dir}" />
    <!-- End Dynamic OG Tags -->`;

    phtml = phtml.replace(defaultOgBlockRegex, pageOgTags);

    writePage(page.dir, phtml);
  }


  // 5. GENERATE STATIC ROBOTS AND SITEMAP FILE
  console.log("[PRERENDER] Compiling sitemap.xml and robots.txt into output folder...");
  
  const robotsCompiled = `User-agent: *
Allow: /

Sitemap: https://mukeshsarees.com/sitemap.xml`;

  // Dynamic Sitemap links builder with the exact requested URLs and configurations
  const sitemapRoutes = [
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

  let sitemapLines = sitemapRoutes.map(route => 
    `  <url>
    <loc>https://mukeshsarees.com${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  );

  const sitemapCompiled = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapLines.join("\n")}
</urlset>`;

  fs.writeFileSync(path.join(distPath, "robots.txt"), robotsCompiled);
  fs.writeFileSync(path.join(distPath, "sitemap.xml"), sitemapCompiled);

  // Write sitemap and robots additionally to /public for dev visibility/backup fallback as well
  const publicPath = path.resolve(process.cwd(), "public");
  if (fs.existsSync(publicPath)) {
    fs.writeFileSync(path.join(publicPath, "robots.txt"), robotsCompiled);
    fs.writeFileSync(path.join(publicPath, "sitemap.xml"), sitemapCompiled);
  }

  console.log("[PRERENDER] Static pre-rendering finished completely!");
}

runPrerender().catch(err => {
  console.error("[PRERENDER] Error compiling static pages:", err);
  process.exit(1);
});
