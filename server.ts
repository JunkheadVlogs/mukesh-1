import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import crypto from "crypto";
import Razorpay from "razorpay";

async function startServer() {
  const app = express();
  const PORT = 3000;

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
  app.post("/api/razorpay/order", async (req, res) => {
    if (!razorpayInstance) return res.status(500).json({ error: "Razorpay is not configured on the server." });
    
    try {
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
  app.post("/api/razorpay/verify", (req, res) => {
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
