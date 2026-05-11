import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import crypto from "crypto";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from 'url';

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
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY || "rzp_live_So7zJe4qbXm4LY";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "z245tbFDtCZmJ7Wztx2XSHrG";

let razorpay = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
}

// ==== razorpay payment api ====
app.post("/api/submit-order", async (req, res) => {
  try {
    const url = 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec';
    
    console.log("[PROXY] Submitting order to Google Sheets...");
    
    const response = await fetch(url, {
      method: 'POST',
      redirect: 'follow', // Explicitly follow redirects
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const contentType = response.headers.get("content-type");
    const text = await response.text();

    if (!response.ok) {
      console.error(`[PROXY] Google Sheets error: ${response.status} ${response.statusText}`);
      console.error(`[PROXY] Response body: ${text.substring(0, 500)}`);
      return res.status(response.status).json({
        status: "error",
        message: `Google Sheets returned ${response.status}: ${response.statusText}`,
        details: text.substring(0, 200)
      });
    }

    // Try to parse as JSON, if it fails, return the text
    try {
      if (text.startsWith("<!DOCTYPE") || text.includes("<html")) {
        throw new Error("Received HTML instead of JSON from Google Sheets");
      }
      const result = JSON.parse(text);
      res.json(result);
    } catch (parseError) {
      console.warn("[PROXY] Response was not valid JSON, returning as text/plain");
      res.json({
        status: "success", // Assume success if code is 200 but response is text (GAS quirk)
        message: "Submission received (raw response)",
        raw: text.substring(0, 1000)
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

app.post("/api/create-order", async (req, res) => {
  try {
    if (!razorpay) {
      throw new Error("Razorpay keys are missing in backend environment variables.");
    }

    const options = {
      amount: Math.round(req.body.amount * 100),
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);

    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create order",
    });
  }
});

app.post("/api/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
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

// JSON error for unhandled API routes, to avoid returning HTML
app.all("/api/*", (req, res) => {
  res.status(404).json({ success: false, error: `API route not found: ${req.method} ${req.url}` });
});


// Simple parser to extract product slugs and data for OG tags server-side
let preParsedProducts = [];
try {
  const mockDataPath = path.join(process.cwd(), "src", "mockData.ts");
  if (fs.existsSync(mockDataPath)) {
    const tsContent = fs.readFileSync(mockDataPath, "utf-8");
    const productBlocks = tsContent.split('id:');
    for (const block of productBlocks) {
      const nameMatch = block.match(/name:\s*["']([^"']+)["']/);
      const slugMatch = block.match(/slug:\s*["']([^"']+)["']/);
      const descMatch = block.match(/description:\s*`([^`]+)`/);
      const imgMatch = block.match(/image:\s*["']([^"']+)["']/);
      const priceMatch = block.match(/price:\s*(\d+)/);
      
      if (nameMatch && slugMatch && descMatch && imgMatch) {
         preParsedProducts.push({
           name: nameMatch[1],
           slug: slugMatch[1],
           description: descMatch[1].replace(/<[^>]*>?/gm, '').substring(0, 150),
           image: imgMatch[1],
           price: priceMatch ? priceMatch[1] : ""
         });
      }
    }
  }
} catch (e) {
  console.log("Could not pre-parse mockData for OG tags", e);
}

const injectOGTags = (html, reqPath, originalUrl) => {
  let ogTitle = "Mukesh Saree Centre – Premium Silk Sarees Since 1976";
  let ogDesc = "Shop luxury silk sarees and co-ord sets at Mukesh Saree Centre. Premium fabrics, trusted since 1976.";
  let ogImg = "https://lh3.googleusercontent.com/d/1NmruXVYozTPtYyuyipddgCODomwUd2me";
  let ogUrl = "https://mukeshsarees.com" + originalUrl;
  
  const productMatch = reqPath.match(/^\/product\/([^\/]+)\/?$/);
  if (productMatch) {
    const slug = productMatch[1];
    const prod = preParsedProducts.find(p => p.slug === slug);
    if (prod) {
      ogTitle = `${prod.name} | Mukesh Saree Centre`;
      ogDesc = prod.description + "...";
      ogImg = prod.image;
    }
  } else if (reqPath.startsWith('/shop')) {
    ogTitle = "Shop Our Collection | Mukesh Saree Centre";
    ogDesc = "Browse the latest trends in sarees and co-ord sets at Mukesh Saree Centre. From traditional silk to modern cotton co-ords, find your perfect outfit today.";
  }

  const defaultOgBlockRegex = /<!-- Default OG Tags -->[\s\S]*?<!-- End Default OG Tags -->/;

  let injectedHtml = html.replace(
    defaultOgBlockRegex,
    `<!-- Dynamic OG Tags -->
     <meta property="og:title" content="${ogTitle}" />
     <meta property="og:description" content="${ogDesc}" />
     <meta property="og:image" content="${ogImg}" />
     <meta property="og:url" content="${ogUrl}" />
     <meta property="og:type" content="${productMatch ? 'product' : 'website'}" />
     <meta property="og:site_name" content="Mukesh Saree Centre" />
     <meta property="og:image:width" content="1200" />
     <meta property="og:image:height" content="630" />
     <meta name="twitter:card" content="summary_large_image" />
     <meta name="twitter:title" content="${ogTitle}" />
     <meta name="twitter:description" content="${ogDesc}" />
     <meta name="twitter:image" content="${ogImg}" />
     <!-- End Dynamic OG Tags -->`
  );
  
  // Update the title tag exclusively since we handled OGs above
  injectedHtml = injectedHtml.replace(
    '<title>Mukesh Saree Centre</title>',
    `<title>${ogTitle}</title>`
  );

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
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
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
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, 'index.html');
    
    app.use(express.static(distPath, { index: false }));
    
    app.all('/api/*', (req, res) => { res.status(404).json({ success: false, error: 'API route not found' }); });
    app.get('*', (req, res) => {
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
