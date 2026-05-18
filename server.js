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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const urlStr = 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec';
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
    let currentKeyId = (process.env.RAZORPAY_KEY_ID || "").trim();
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
    res.json(order);
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
    
    let currentKeySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    if (!currentKeySecret || currentKeySecret === 'DA0NuRhgI39Ng8GNtc0X97h0') {
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
  const { event_name, event_id, value, currency, content_ids, contents, num_items } = req.body;
  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.log("[CAPI] Missing META_PIXEL_ID or META_ACCESS_TOKEN, skipping.");
    return res.json({ success: false, reason: "Missing config" });
  }

  try {
    const clientIpAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const clientUserAgent = req.headers['user-agent'];
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const eventData = {
      event_name: event_name || 'Purchase',
      event_time: currentTimestamp,
      event_id: event_id,
      action_source: "website",
      user_data: {
        client_ip_address: clientIpAddress,
        client_user_agent: clientUserAgent
      },
      custom_data: {
        currency: currency || "INR",
        value: Number(value),
        content_ids: content_ids || [],
        contents: contents || [],
        content_type: 'product',
        num_items: num_items
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
        console.log(`[CAPI] Meta response: ${capiRes.statusCode} - ${data}`);
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
  let ogTitle = "Mukesh Saree Centre – Premium Silk Sarees Since 1976";
  let ogDesc = "Shop luxury silk sarees and co-ord sets at Mukesh Saree Centre. Premium fabrics, trusted since 1976.";
  let ogImg = "https://lh3.googleusercontent.com/d/1NmruXVYozTPtYyuyipddgCODomwUd2me";
  let ogUrl = "https://mukeshsarees.com" + originalUrl;
  let price = "";
  let isProduct = false;
  
  const productMatch = reqPath.match(/^\/product\/([^\/]+)\/?$/);
  if (productMatch) {
    const slug = productMatch[1];
    const prod = preParsedProducts.find(p => p.slug === slug);
    if (prod) {
      ogTitle = `${prod.name} | Mukesh Saree Centre`;
      // Ensure description is plain text and trim
      ogDesc = (prod.description || "").replace(/<[^>]*>?/gm, '').substring(0, 150) + "...";
      ogImg = prod.image;
      price = prod.price || "0";
      isProduct = true;
    }
  } else if (reqPath.startsWith('/shop')) {
    ogTitle = "Shop Our Collection | Mukesh Saree Centre";
    ogDesc = "Browse the latest trends in sarees and co-ord sets at Mukesh Saree Centre. From traditional silk to modern cotton co-ords, find your perfect outfit today.";
  }

  const defaultOgBlockRegex = /<!-- Default OG Tags -->[\s\S]*?<!-- End Default OG Tags -->/;

  let dynamicTags = `<!-- Dynamic OG Tags -->
     <meta property="og:title" content="${ogTitle}" />
     <meta property="og:description" content="${ogDesc}" />
     <meta property="og:image" content="${ogImg}" />
     <meta property="og:url" content="${ogUrl}" />
     <meta property="og:type" content="${isProduct ? 'product' : 'website'}" />
     <meta property="og:site_name" content="Mukesh Saree Centre" />
     <meta property="og:image:width" content="1200" />
     <meta property="og:image:height" content="630" />
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
    `<title>${ogTitle}</title>`
  );

  // Replace standard meta description
  injectedHtml = injectedHtml.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${ogDesc.replace(/"/g, '&quot;')}" />`
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
      "description": "${ogDesc.replace(/"/g, '\\"')}",
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
    
    app.use(express.static(distPath, { index: false }));
    
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
