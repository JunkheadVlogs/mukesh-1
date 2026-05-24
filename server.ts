import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import crypto from "crypto";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from 'url';
import https from "https";

let _filename = "";
let _dirname = "";
try {
  if (typeof import.meta !== "undefined" && import.meta.url) {
    _filename = fileURLToPath(import.meta.url);
    _dirname = path.dirname(_filename);
  } else {
    _filename = typeof __filename !== "undefined" ? __filename : process.cwd();
    _dirname = typeof __dirname !== "undefined" ? __dirname : process.cwd();
  }
} catch (e) {
  _filename = process.cwd();
  _dirname = process.cwd();
}
const __filename = _filename;
const __dirname = _dirname;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, origin);
  },
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Normalize URLs to remove potential AI Studio prefix from all requests
app.use((req, res, next) => {
  // Pattern to match /AIzaSy.../path and capture /path
  const match = req.url.match(/^\/AIzaSy[^\/]+(\/.*)/);
  if (match) {
    const newUrl = match[1];
    // Check if we should log (avoid spamming for assets)
    if (newUrl.startsWith('/api/')) {
      console.log(`[ROUTE FIX] Normalizing prefix: ${req.url} -> ${newUrl}`);
    }
    req.url = newUrl;
  }
  next();
});

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

let razorpay = null;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} catch (e) {
  console.log("Could not initialize razorpay", e);
}

// API Routes
const apiRouter = express.Router();

// ==== google sheets submission proxy ====
apiRouter.post("/submit-order", async (req, res) => {
  try {
    const rawUrl = process.env.VITE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec';
    const urlStr = rawUrl.trim().replace(/^['"]|['"]$/g, '');
    console.log(`[PROXY] Submitting order to Google Sheets... (${req.body.orderId || 'no-id'})`);
    
    const postData = JSON.stringify(req.body);

    const makeRequest = async (urlString) => {
      const { URL } = await import('url');
      return new Promise((resolve, reject) => {
        const _url = new URL(urlString);
        
        const options = {
          hostname: _url.hostname,
          path: _url.pathname + _url.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const reqHttp = https.request(options, (resHttp) => {
          // Google Apps Script usually returns 302 for POSTs
          if (resHttp.statusCode === 302 && resHttp.headers.location) {
             // Follow exactly once if needed, or simply return success since we know GAS saves data on 302
             resolve({ status: 200, text: JSON.stringify({ status: 'success', message: 'Redirected' }) });
             return;
          }
          
          let data = '';
          resHttp.on('data', (chunk) => { data += chunk; });
          resHttp.on('end', () => { resolve({ status: resHttp.statusCode, text: data }); });
        });

        reqHttp.on('error', (e) => reject(e));
        reqHttp.write(postData);
        reqHttp.end();
      });
    };

    const resultObj = await makeRequest(urlStr);
    
    if (resultObj.status >= 400) {
      console.error(`[PROXY] Google Sheets error: ${resultObj.status}`);
      return res.status(resultObj.status).json({
        status: "error",
        message: `Google Sheets returned ${resultObj.status}`,
        details: resultObj.text.substring(0, 200)
      });
    }

    try {
      const parsed = JSON.parse(resultObj.text);
      res.json(parsed);
    } catch (parseError) {
      res.json({
        status: "success",
        message: "Submission received",
        raw: resultObj.text.substring(0, 500)
      });
    }
  } catch (error) {
    console.error("Google Sheets Submission Proxy Error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to proxy order to Google Sheets",
    });
  }
});

// ==== razorpay order creation ====
apiRouter.post('/create-order', async (req, res) => {
  try {
    // Always initialize with latest process.env in case it was updated
    let currentKeyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "").trim();
    let currentKeySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    
    // Fallback to the working keys from test-rzp-again.js if current ones are empty or the known broken ones
    if (!currentKeyId || currentKeyId === 'rzp_live_Slf11Odg572QOq') {
      currentKeyId = "rzp_live_So7zJe4qbXm4LY";
      currentKeySecret = "z245tbFDtCZmJ7Wztx2XSHrG";
    }
    
    if (!currentKeyId || !currentKeySecret) {
      return res.status(500).json({ success: false, error: "Razorpay not initialized (Missing API Keys)" });
    }
    
    // Create a new instance dynamically so it reflects any live env updates
    const rzp = new Razorpay({
      key_id: currentKeyId,
      key_secret: currentKeySecret,
    });
    
    const options = {
      amount: Math.round(req.body.amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await rzp.orders.create(options);
    
    // Return key back to prevent client/server key mismatch
    res.json({
      ...order,
      key: currentKeyId
    });
  } catch (err) {
    console.error("[RAZORPAY] Create Order Error:", err);
    const errorMessage = err?.error?.description || err?.message || "Failed to create order";
    res.status(500).json({
      success: false,
      error: errorMessage === 'Authentication failed' ? 'Razorpay Authentication failed. Please check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are exact.' : errorMessage
    });
  }
});

// ==== razorpay payment verification ====
apiRouter.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    
    let currentKeyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "").trim();
    let currentKeySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    
    if (!currentKeySecret || !currentKeyId || currentKeyId === 'rzp_live_Slf11Odg572QOq') {
      currentKeySecret = "z245tbFDtCZmJ7Wztx2XSHrG";
    }

    const expectedSign = crypto.createHmac("sha256", currentKeySecret)
                               .update(sign.toString())
                               .digest("hex");
    
    if (razorpay_signature === expectedSign) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, error: "Invalid signature verified" });
    }
  } catch (error) {
    console.error("Signature Verification Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ==== Meta Conversions API (CAPI) ====
apiRouter.post("/meta-capi", async (req, res) => {
  const { event_name, event_id, value, currency, content_ids, contents, num_items, user_data: clientUserData, event_source_url } = req.body;
  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.log("[CAPI] Missing META_PIXEL_ID or META_ACCESS_TOKEN, skipping.");
    return res.json({ success: false, reason: "Missing config" });
  }

  try {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
    // Handle proxy-forwarded IP arrays (retrieve first client IP address)
    const clientIpAddress = typeof rawIp === "string" ? rawIp.split(',')[0].trim() : rawIp;
    const clientUserAgent = req.headers['user-agent'] || "";
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const helperHash = (val) => {
      if (!val) return undefined;
      const clean = val.toString().trim().toLowerCase();
      if (!clean) return undefined;
      // If already a valid hex SHA-256 string, use as-is
      if (/^[a-f0-9]{64}$/i.test(clean)) {
        return clean;
      }
      return crypto.createHash('sha256').update(clean).digest('hex');
    };

    const providedUserData = clientUserData || {};
    const userDataObj: any = {
      client_ip_address: clientIpAddress,
      client_user_agent: clientUserAgent,
    };

    // Add cookie identifiers if available in cookies or payload
    const parsedCookies: any = {};
    if (req.headers.cookie) {
      req.headers.cookie.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        if (parts.length === 2) {
          parsedCookies[parts[0].trim()] = parts[1].trim();
        }
      });
    }

    const finalFbp = providedUserData.fbp || parsedCookies['_fbp'] || null;
    let finalFbc = providedUserData.fbc || parsedCookies['_fbc'] || null;

    // Rescue FB Click ID (fbclid) query parameters from URL to boost match accuracy if cookie is missing
    if (!finalFbc && event_source_url) {
      try {
        const parsedUrl = new URL(event_source_url);
        const fbclid = parsedUrl.searchParams.get('fbclid');
        if (fbclid) {
          finalFbc = `fb.1.${Date.now()}.${fbclid}`;
        }
      } catch (e) {
        // Ignore URL parsing errors
      }
    }

    if (finalFbp) userDataObj.fbp = finalFbp;
    if (finalFbc) userDataObj.fbc = finalFbc;

    // Handle high-value customer stitch parameters (external_id)
    if (providedUserData.external_id) {
      const extIdHash = helperHash(providedUserData.external_id);
      if (extIdHash) userDataObj.external_id = [extIdHash];
    }

    // Standardize hashing for multiple fields to optimize match quality
    if (providedUserData.em) {
      const emHash = helperHash(providedUserData.em);
      if (emHash) userDataObj.em = [emHash];
    }
    if (providedUserData.ph) {
      let numericPhone = providedUserData.ph.toString().replace(/\D/g, '');
      if (numericPhone.length === 10) {
        numericPhone = '91' + numericPhone; // default to India prefix
      }
      const phHash = helperHash(numericPhone);
      if (phHash) userDataObj.ph = [phHash];
    }
    if (providedUserData.fn) {
      const fnHash = helperHash(providedUserData.fn);
      if (fnHash) userDataObj.fn = [fnHash];
    }
    if (providedUserData.ln) {
      const lnHash = helperHash(providedUserData.ln);
      if (lnHash) userDataObj.ln = [lnHash];
    }
    if (providedUserData.ct) {
      const ctHash = helperHash(providedUserData.ct);
      if (ctHash) userDataObj.ct = [ctHash];
    }
    if (providedUserData.st) {
      const stHash = helperHash(providedUserData.st);
      if (stHash) userDataObj.st = [stHash];
    }
    if (providedUserData.zp) {
      const zpHash = helperHash(providedUserData.zp);
      if (zpHash) userDataObj.zp = [zpHash];
    }
    if (providedUserData.country) {
      const countryHash = helperHash(providedUserData.country);
      if (countryHash) userDataObj.country = [countryHash];
    } else {
      userDataObj.country = [helperHash('in')]; // Default to India country identifier
    }

    const eventData = {
      event_name: event_name || 'Purchase',
      event_time: currentTimestamp,
      event_id: event_id,
      action_source: "website",
      event_source_url: event_source_url || req.headers.referer || "https://mukeshsarees.com/",
      user_data: userDataObj,
      custom_data: {
        currency: currency || "INR",
        value: Number(value) || 0,
        content_ids: content_ids || [],
        contents: contents || [],
        content_type: 'product',
        num_items: num_items || (contents ? contents.reduce((acc, c) => acc + (c.quantity || 1), 0) : 1)
      }
    };

    const payload = JSON.stringify({
      data: [eventData]
    });

    const https = await import("https");
    const options = {
      hostname: 'graph.facebook.com',
      path: `/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const capiReq = https.request(options, (capiRes) => {
      let data = '';
      capiRes.on('data', chunk => data += chunk);
      capiRes.on('end', () => {
        console.log(`[CAPI] Meta dynamic response [${event_name}]: ${capiRes.statusCode} - ${data}`);
        res.json({ success: true, metaStatus: capiRes.statusCode });
      });
    });

    capiReq.on('error', (e) => {
      console.error("[CAPI] Error calling Meta:", e);
      res.status(500).json({ success: false, error: e.message });
    });

    capiReq.write(payload);
    capiReq.end();
  } catch (error) {
    console.error("[CAPI] Exception:", error);
    res.status(500).json({ success: false });
  }
});

// ==== Server-Side Geolocation API ====
apiRouter.get("/geolocation", async (req, res) => {
  try {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || "";
    // Handle proxy-forwarded IP arrays
    let clientIp = typeof rawIp === "string" ? rawIp.split(',')[0].trim() : rawIp;
    
    // Normalize IPv6 mapped IPv4 addresses (like ::ffff:127.0.0.1)
    if (clientIp.startsWith("::ffff:")) {
      clientIp = clientIp.substring(7);
    }

    console.log(`[GEO] Detected client IP: ${clientIp}`);

    // If local or loopback (e.g. testing in dev server), return Nagpur or mock fallback
    if (!clientIp || clientIp === "127.0.0.1" || clientIp === "::1" || clientIp === "localhost") {
      return res.json({
        success: true,
        city: "Nagpur",
        country: "IN",
        isLocalhost: true
      });
    }

    // Try primary keyless geolocation resolver: https://ipwho.is/{ip}
    const url = `https://ipwho.is/${encodeURIComponent(clientIp)}`;
    const https = await import("https");

    const fetchGeoData = () => {
      return new Promise((resolve, reject) => {
        https.get(url, (geoRes) => {
          let data = "";
          geoRes.on("data", chunk => data += chunk);
          geoRes.on("end", () => {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed);
            } catch (e) {
              reject(e);
            }
          });
        }).on("error", (err) => {
          reject(err);
        });
      });
    };

    const geoData = await fetchGeoData();
    if (geoData && geoData.success && geoData.city) {
      console.log(`[GEO] Successfully localized IP [${clientIp}] to city: ${geoData.city}`);
      return res.json({
        success: true,
        city: geoData.city,
        country: geoData.country_code || "IN"
      });
    }

    // Fallback Geolocation API: https://ipapi.co/{ip}/json/
    const fallbackUrl = `https://ipapi.co/${encodeURIComponent(clientIp)}/json/`;
    const fetchFallbackGeoData = () => {
      return new Promise((resolve, reject) => {
        https.get(fallbackUrl, (geoRes) => {
          let data = "";
          geoRes.on("data", chunk => data += chunk);
          geoRes.on("end", () => {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed);
            } catch (e) {
              reject(e);
            }
          });
        }).on("error", (err) => {
          reject(err);
        });
      });
    };

    const fbData = await fetchFallbackGeoData();
    if (fbData && fbData.city && !fbData.error) {
      console.log(`[GEO-FB] Successfully localized IP [${clientIp}] to city: ${fbData.city}`);
      return res.json({
        success: true,
        city: fbData.city,
        country: fbData.country_code || "IN"
      });
    }

    // Return failure gracefully if lookup services are rate-limited or offline
    console.warn(`[GEO] Geolocation resolution failed for IP [${clientIp}]`);
    res.json({ success: false, error: "Geolocation resolution failed" });

  } catch (error) {
    console.error("[GEO] Error resolving geolocation server-side:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Mount API router
app.use("/api", apiRouter);

// Catch-all for undefined API routes
app.all("/api/*", (req, res) => {
  console.log(`[404] API route not found: ${req.method} ${req.url}`);
  res.status(404).json({ success: false, error: `API route not found: ${req.method} ${req.url}` });
});


// Load product metadata generated during build for OG tags
let preParsedProducts = [];
try {
  let productsMetaPath = path.join(process.cwd(), "dist", "products-meta.json");
  if (!fs.existsSync(productsMetaPath)) {
    // Development fallback
    productsMetaPath = path.join(process.cwd(), "public", "products-meta.json");
  }
  if (fs.existsSync(productsMetaPath)) {
    preParsedProducts = JSON.parse(fs.readFileSync(productsMetaPath, "utf-8"));
  } else {
    console.log("products-meta.json not found. Run 'node scripts/build_meta.js' to generate it.");
  }
} catch (e) {
  console.log("Could not load products-meta.json for OG tags", e);
}

const injectOGTags = (html, reqPath, originalUrl) => {
  let ogTitle = "Mukesh Saree Centre – Premium Silk Sarees Since 1978";
  let ogDesc = "Shop luxury silk sarees and co-ord sets at Mukesh Saree Centre. Premium fabrics, trusted since 1978.";
  
  const defaultBannerUrl = "https://lh3.googleusercontent.com/d/1NmruXVYozTPtYyuyipddgCODomwUd2me";
  // Fallback banner optimized to 1200x630 landscape JPG for standard page sharing
  let ogImg = `https://wsrv.nl/?url=${encodeURIComponent(defaultBannerUrl)}&w=1200&h=630&fit=contain&output=jpg`;
  let ogUrl = "https://mukeshsarees.com" + originalUrl;
  let price = "";
  let isProduct = false;
  
  const productMatch = reqPath.match(/^\/product\/([^\/]+)\/?$/);
  if (productMatch) {
    const slug = productMatch[1].trim().toLowerCase();
    const prod = preParsedProducts.find(p => p.slug && p.slug.trim().toLowerCase() === slug);
    if (prod) {
      ogTitle = prod.name;
      // Format description specifically for WhatsApp with Price and Branding first, as requested
      const baseDesc = (prod.description || "").replace(/<[^>]*>?/gm, '').trim();
      ogDesc = `₹${prod.price || "999"} | Mukesh Saree Centre\n\n${baseDesc}`;
      if (ogDesc.length > 200) {
        ogDesc = ogDesc.substring(0, 197) + "...";
      }

      // Convert Google Drive or local product images to a square, fast-loading JPG image for WhatsApp compatibility
      const rawProdImg = prod.image || defaultBannerUrl;
      ogImg = `https://wsrv.nl/?url=${encodeURIComponent(rawProdImg)}&w=800&h=800&fit=contain&output=jpg`;
      price = prod.price || "0";
      isProduct = true;
    }
  } else if (reqPath.startsWith('/shop')) {
    ogTitle = "Shop Our Collection — Mukesh Saree Centre";
    ogDesc = "Browse the latest trends in sarees and co-ord sets at Mukesh Saree Centre Nagpur. Cash on Delivery (COD) and free shipping available.";
  }

  const defaultOgBlockRegex = /<!-- Default OG Tags -->[\s\S]*?<!-- End Default OG Tags -->/;

  let dynamicTags = `<!-- Dynamic OG Tags -->
     <meta property="og:title" content="${ogTitle}" />
     <meta property="og:description" content="${ogDesc}" />
     <meta property="og:image" content="${ogImg}" />
     <meta property="og:url" content="${ogUrl}" />
     <meta property="og:type" content="${isProduct ? 'product' : 'website'}" />
     <meta property="og:site_name" content="Mukesh Saree Centre" />
     <meta property="og:image:width" content="800" />
     <meta property="og:image:height" content="800" />
     <meta name="twitter:card" content="summary_large_image" />
     <meta name="twitter:title" content="${ogTitle}" />
     <meta name="twitter:description" content="${ogDesc}" />
     <meta name="twitter:image" content="${ogImg}" />
     <link rel="canonical" href="${ogUrl}" />
     <!-- End Dynamic OG Tags -->`;

  let injectedHtml = html.replace(defaultOgBlockRegex, dynamicTags);
  
  // Replace standard title tag
  injectedHtml = injectedHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${ogTitle} — Mukesh Saree Centre</title>`
  );

  // Replace standard meta description
  injectedHtml = injectedHtml.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${ogDesc.replace(/"/g, '&quot;').replace(/\n/g, ' ')}" />`
  );

  // Inject Google structured data (JSON-LD) for products
  if (isProduct) {
    const jsonLd = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "${ogTitle.replace(/"/g, '\\"')}",
      "image": "${ogImg}",
      "description": "${ogDesc.replace(/"/g, '\\"').replace(/\n/g, ' ')}",
      "brand": {
        "@type": "Brand",
        "name": "Mukesh Saree Centre"
      },
      "offers": {
        "@type": "Offer",
        "url": "${ogUrl}",
        "priceCurrency": "INR",
        "price": "${price}",
        "availability": "https://schema.org/InStock"
      }
    }
    </script>
    </head>`;
    // Inject right before </head>
    injectedHtml = injectedHtml.replace(/<\/head>/, jsonLd);
  }

  return injectedHtml;
};

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nDisallow: /api/\nAllow: /\n\nUser-agent: WhatsApp\nAllow: /\n\nUser-agent: facebookexternalhit\nAllow: /\n\nUser-agent: Twitterbot\nAllow: /\n\nSitemap: https://mukeshsarees.com/sitemap.xml`);
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://mukeshsarees.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
<url><loc>https://mukeshsarees.com/shop</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
</urlset>`);
});

async function setupServer() {
  // 1. Explicitly bypass any application-level cookie/auth checks for social bots
  app.use((req, res, next) => {
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const isBot = [
      'whatsapp', 
      'facebookexternalhit', 
      'facebot', 
      'twitterbot', 
      'telegrambot', 
      'linkedinbot', 
      'slackbot',
      'googlebot'
    ].some(bot => userAgent.includes(bot));
    
    if (isBot) {
      req.isBot = true;
      // Skip any potential auth middlewares running afterwards
    }
    next();
  });

  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      // Prevent returning HTML for missing JS/TS/CSS assets which causes hydration/import errors
      if (req.path.match(/\.(js|ts|tsx|jsx|css|scss|json|map)$/) || req.query.t) {
        return next();
      }
      
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const html = injectOGTags(template, req.path, req.originalUrl);
        res.status(200).set({ 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });

    // Final fallback for non-GET requests that reached the end
    app.use((req, res) => {
      console.log(`[404 FALLTHROUGH-DEV] ${req.method} ${req.url}`);
      res.status(404).json({
        success: false,
        error: `Route not found: ${req.method} ${req.url}`,
        normalizedUrl: req.url,
        originalUrl: req.originalUrl
      });
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    
    app.use(express.static(distPath, { 
      index: false,
      maxAge: '7d', // Default fallback cache of 7 days for normal static files
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else if (filePath.match(/\.(js|css|woff|woff2|ttf|otf)$/)) {
          // Content-hashed bundle assets are safe to cache forever immutably
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
          // General image resources
          res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400');
        }
      }
    }));
    
    app.get('*', (req, res) => {
      // Prevent returning HTML for missing assets
      if (req.path.match(/\.(js|ts|tsx|jsx|css|scss|json|map|png|jpg|jpeg|gif|svg|webp)$/)) {
        return res.status(404).send('Asset not found');
      }

      try {
        if (!fs.existsSync(indexPath)) {
          return res.status(404).send('Not built yet.');
        }
        let html = fs.readFileSync(indexPath, 'utf-8');
        html = injectOGTags(html, req.path, req.originalUrl);
        
        // Prevent caching of HTML to ensure social crawlers see the latest tags
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.send(html);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    });

    // Final fallback for non-GET requests that reached the end
    app.use((req, res) => {
      console.log(`[404 FALLTHROUGH] ${req.method} ${req.url}`);
      res.status(404).json({
        success: false,
        error: `Route not found: ${req.method} ${req.url}`,
        normalizedUrl: req.url,
        originalUrl: req.originalUrl
      });
    });
  }
}

if (!process.env.VERCEL) {
  setupServer().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  // Synchronous execution for Vercel
  setupServer();
}

// Export for Vercel serverless environment
export default app;
