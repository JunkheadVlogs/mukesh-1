var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_razorpay = __toESM(require("razorpay"), 1);
import_dotenv.default.config();
var isProduction = true;
var app = (0, import_express.default)();
var PORT = parseInt(process.env.PORT || "3000", 10);
app.use((0, import_cors.default)());
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
var RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_live_Sw0OjZoidQe04p";
var RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "gswtW1QzFFe7fxP1YJ0EhqRG";
var GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || process.env.VITE_GOOGLE_SHEETS_URL || process.env.VITE_SHEETS_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec";
var razorpayClient = null;
try {
  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    razorpayClient = new import_razorpay.default({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });
  }
} catch (err) {
  console.warn("[SERVER] Razorpay initialization warning:", err);
}
var handleCreateOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body;
    const amountVal = parseFloat(amount);
    if (isNaN(amountVal) || amountVal <= 0) {
      res.status(400).json({ success: false, error: "Invalid or missing amount" });
      return;
    }
    const amountInPaise = Math.round(amountVal * 100);
    if (!razorpayClient) {
      res.status(500).json({ success: false, error: "Payment gateway configuration missing" });
      return;
    }
    const orderOptions = {
      amount: amountInPaise,
      currency: currency || "INR",
      receipt: receipt || `RCP_${Date.now()}`,
      notes: notes || {}
    };
    const order = await razorpayClient.orders.create(orderOptions);
    res.json({
      success: true,
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error("[API] Create Order Error:", err);
    res.status(500).json({
      success: false,
      error: err?.message || "Failed to create order with payment gateway"
    });
  }
};
app.post("/api/create-order", handleCreateOrder);
app.post("/api/create-order.php", handleCreateOrder);
var handleVerifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        error: "Missing order_id, payment_id, or signature in verification payload"
      });
      return;
    }
    const generatedSignature = import_crypto.default.createHmac("sha256", RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (generatedSignature === razorpay_signature) {
      res.json({
        success: true,
        verified: true,
        message: "Payment verified successfully"
      });
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        error: "Invalid signature. Payment verification failed"
      });
    }
  } catch (err) {
    console.error("[API] Verify Payment Error:", err);
    res.status(500).json({
      success: false,
      error: err?.message || "Failed to verify payment"
    });
  }
};
app.post("/api/verify-payment", handleVerifyPayment);
app.post("/api/verify-payment.php", handleVerifyPayment);
app.post("/api/submit-order", async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData) {
      res.status(400).json({ success: false, error: "Empty payload" });
      return;
    }
    if (GOOGLE_SHEETS_URL) {
      try {
        const sheetsResponse = await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });
        const result = await sheetsResponse.text();
        res.json({ success: true, result });
        return;
      } catch (sheetsErr) {
        console.warn("[API] Google Sheets forward failed:", sheetsErr);
      }
    }
    res.json({ success: true, status: "received" });
  } catch (err) {
    console.error("[API] Submit Order Error:", err);
    res.status(500).json({ success: false, error: err?.message || "Failed to submit order" });
  }
});
app.post("/api/capture-lead", async (req, res) => {
  try {
    const leadData = req.body;
    console.log("[API] Captured Lead:", leadData);
    if (GOOGLE_SHEETS_URL && leadData) {
      fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lead",
          ...leadData,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      }).catch((e) => console.warn("[API] Lead forward to Google Sheets failed:", e));
    }
    res.json({ success: true, message: "Lead captured" });
  } catch (err) {
    res.status(500).json({ success: false, error: err?.message || "Failed to capture lead" });
  }
});
app.post("/api/return-request", async (req, res) => {
  try {
    const returnData = req.body;
    console.log("[API] Return Request:", returnData);
    if (GOOGLE_SHEETS_URL && returnData) {
      fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "return_request",
          ...returnData,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      }).catch((e) => console.warn("[API] Return request forward failed:", e));
    }
    res.json({ success: true, message: "Return request submitted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err?.message || "Failed to process return request" });
  }
});
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/sys-metric.php", (_req, res) => {
  res.json({ status: "healthy", uptime: process.uptime() });
});
var serveProductFeedXml = (_req, res) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("X-Robots-Tag", "noindex");
  const feedFile = import_path.default.resolve(process.cwd(), "public", "product-feed.xml");
  const distFeedFile = import_path.default.resolve(process.cwd(), "dist", "product-feed.xml");
  if (import_fs.default.existsSync(feedFile)) {
    res.sendFile(feedFile);
  } else if (import_fs.default.existsSync(distFeedFile)) {
    res.sendFile(distFeedFile);
  } else {
    res.status(404).send("<!-- product-feed.xml not found -->");
  }
};
var serveProductFeedCsv = (_req, res) => {
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("X-Robots-Tag", "noindex");
  const csvFile = import_path.default.resolve(process.cwd(), "public", "product-feed.csv");
  const distCsvFile = import_path.default.resolve(process.cwd(), "dist", "product-feed.csv");
  if (import_fs.default.existsSync(csvFile)) {
    res.sendFile(csvFile);
  } else if (import_fs.default.existsSync(distCsvFile)) {
    res.sendFile(distCsvFile);
  } else {
    res.status(404).send("product-feed.csv not found");
  }
};
app.get(["/product-feed.xml", "/api/product-feed.xml"], serveProductFeedXml);
app.get(["/product-feed.csv", "/api/product-feed.csv"], serveProductFeedCsv);
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.resolve(process.cwd(), "dist");
    if (import_fs.default.existsSync(distPath)) {
      app.use(import_express.default.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(import_path.default.join(distPath, "index.html"));
      });
    } else {
      const { createServer } = await import("vite");
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
    }
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Mukesh Saree Centre server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("[SERVER] Fatal startup error:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
