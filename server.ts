import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import crypto from "crypto";
import Razorpay from "razorpay";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure CORS to allow requests from the frontend domain
  app.use(cors({
    origin: process.env.FRONTEND_URL || "*", // Ideally specify your frontend URL here, e.g., 'https://mukeshsarees.com'
    methods: ["GET", "POST"],
    credentials: true
  }));

  app.use(express.json());

  let envKeyId = process.env.RAZORPAY_KEY_ID?.trim() || "";
  let envSecret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";
  
  const RAZORPAY_KEY_ID = envKeyId ? envKeyId : "rzp_live_Slf11Odg572QOq";
  const RAZORPAY_KEY_SECRET = envSecret ? envSecret : "DA0NuRhgI39Ng8GNtc0X97h0";

  let razorpayInstance: Razorpay | null = null;
  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
  }

  // Create Razorpay Order
  app.post("/api/create-order", async (req, res) => {
    try {
      if (!razorpayInstance) {
        return res.status(500).json({ success: false, error: "Razorpay is not configured on the server." });
      }
      const { amount, receipt } = req.body;
      console.log("Creating Razorpay order:", { amount, receipt });
      
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ success: false, error: "Invalid amount provided." });
      }

      const order = await razorpayInstance.orders.create({
        amount: Math.round(parsedAmount * 100), // amount in paise
        currency: "INR",
        receipt: (receipt || `receipt_${Date.now()}`).substring(0, 40)
      });
      res.json({ success: true, order, keyId: RAZORPAY_KEY_ID });
    } catch (error: any) {
      console.error("Razorpay Order Error:", error);
      res.status(400).json({ success: false, error: error.error?.description || error.message || "Failed to create order", details: error });
    }
  });

  // Verify Razorpay Payment Signature
  app.post("/api/verify-payment", (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)
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

  // robots.txt
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Disallow: /api/
Allow: /

Sitemap: https://mukeshsareecentre.com/sitemap.xml`);
  });

  // sitemap.xml (static base, could be made dynamic if you want to import mockData)
  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mukeshsareecentre.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mukeshsareecentre.com/shop</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mukeshsareecentre.com/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
    res.send(xml);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
