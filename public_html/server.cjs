var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_vite = require("vite");
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_razorpay = __toESM(require("razorpay"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_url = require("url");
var import_https = __toESM(require("https"), 1);
var import_meta = {};
var _filename = "";
var _dirname = "";
try {
  if (typeof import_meta !== "undefined" && import_meta.url) {
    _filename = (0, import_url.fileURLToPath)(import_meta.url);
    _dirname = import_path.default.dirname(_filename);
  } else {
    _filename = typeof __filename !== "undefined" ? __filename : process.cwd();
    _dirname = typeof __dirname !== "undefined" ? __dirname : process.cwd();
  }
} catch (e) {
  _filename = process.cwd();
  _dirname = process.cwd();
}
var __filename = _filename;
var __dirname = _dirname;
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});
app.use((0, import_cors.default)({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, origin);
  },
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  credentials: true
}));
app.use((req, res, next) => {
  const origin = req.headers.origin || "https://mukeshsarees.com";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(import_express.default.json());
app.use((req, res, next) => {
  const match = req.url.match(/^\/AIzaSy[^\/]+(\/.*)/);
  if (match) {
    const newUrl = match[1];
    if (newUrl.startsWith("/api/")) {
      console.log(`[ROUTE FIX] Normalizing prefix: ${req.url} -> ${newUrl}`);
    }
    req.url = newUrl;
  }
  next();
});
var RAZORPAY_KEY_ID = (process.env.RAZORPAY_KEY_ID || "rzp_live_Sw0OjZoidQe04p").trim();
var RAZORPAY_KEY_SECRET = (process.env.RAZORPAY_KEY_SECRET || "Xl5dAr611y4jLqhVfUQ6xa7k").trim();
var razorpay = null;
try {
  razorpay = new import_razorpay.default({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
} catch (e) {
  console.log("Could not initialize razorpay", e);
}
var apiRouter = import_express.default.Router();
apiRouter.get("/drive-proxy", async (req, res) => {
  try {
    const { id, w } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).send("Parameter id is required");
    }
    const fileId = id.trim();
    const width = w && typeof w === "string" ? parseInt(w, 10) : 1e3;
    const driveUrl = `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
    console.log(`[DRIVE-PROXY] Proxying Google Drive ID: ${fileId} (width: ${width})`);
    const response = await fetch(driveUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!response.ok) {
      console.warn(`[DRIVE-PROXY] Direct Google CDN fetch failed with status: ${response.status}. Fetching fallback thumbnail...`);
      const fallbackUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
      const fallbackResponse = await fetch(fallbackUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!fallbackResponse.ok) {
        console.error(`[DRIVE-PROXY] All fallbacks failed for file ID: ${fileId}. Status: ${fallbackResponse.status}`);
        return res.status(fallbackResponse.status).send(`Failed to fetch from Google Drive: ${fallbackResponse.statusText}`);
      }
      const buffer2 = await fallbackResponse.arrayBuffer();
      res.setHeader("Content-Type", fallbackResponse.headers.get("content-type") || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.send(Buffer.from(buffer2));
    }
    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error(`[DRIVE-PROXY] Error occurred:`, error);
    res.status(500).send(`Server error: ${error.message}`);
  }
});
apiRouter.post("/capture-lead", async (req, res) => {
  try {
    const { phone, source, page } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: "Missing required WhatsApp phone number" });
    }
    const cleanPhone = phone.toString().replace(/\D/g, "");
    const finalPhone = cleanPhone.length === 12 && cleanPhone.startsWith("91") ? cleanPhone.substring(2) : cleanPhone;
    console.log(`[ROUTE-CAPTURE-LEAD] Processing lead: +91${finalPhone}`);
    let firestoreSaved = false;
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountStr) {
      try {
        const admin = await import("firebase-admin");
        if (!admin.default.apps.length) {
          const serviceAccount = JSON.parse(serviceAccountStr);
          admin.default.initializeApp({
            credential: admin.default.credential.cert(serviceAccount)
          });
        }
        await admin.default.firestore().collection("exit_intent_leads").add({
          phone: `+91${finalPhone}`,
          source: source || "Exit Intent Popup",
          page: page || "N/A",
          capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
          discountCode: "MUKESH150",
          converted: false
        });
        firestoreSaved = true;
        console.log("[ROUTE-CAPTURE-LEAD] Save to Firestore successful.");
      } catch (dbErr) {
        console.error("[ROUTE-CAPTURE-LEAD] Error saving to Firestore:", dbErr);
      }
    } else {
      console.warn("[ROUTE-CAPTURE-LEAD] FIREBASE_SERVICE_ACCOUNT not configured, skipping Firestore.");
    }
    let whatsappSent = false;
    const interaktKey = process.env.INTERAKT_API_KEY;
    if (interaktKey) {
      try {
        const response = await fetch("https://api.interakt.ai/v1/public/message/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${interaktKey}`
          },
          body: JSON.stringify({
            countryCode: "+91",
            phoneNumber: finalPhone,
            callbackData: "exit_intent",
            type: "Template",
            template: {
              name: "exit_intent_discount",
              languageCode: "en",
              bodyValues: ["MUKESH150", "\u20B9150", "24 hours"]
            }
          })
        });
        console.log(`[ROUTE-CAPTURE-LEAD] Interakt response status: ${response.status}`);
        whatsappSent = response.ok;
      } catch (waErr) {
        console.error("[ROUTE-CAPTURE-LEAD] Error triggering Interakt:", waErr);
      }
    } else {
      console.warn("[ROUTE-CAPTURE-LEAD] INTERAKT_API_KEY not configured, skipping WhatsApp sending.");
    }
    res.json({
      success: true,
      firestoreSaved,
      whatsappSent,
      message: "Lead captured successfully"
    });
  } catch (err) {
    console.error("[ROUTE-CAPTURE-LEAD] Error processing capture lead:", err);
    res.status(500).json({ success: false, error: err?.message || "Internal server error" });
  }
});
apiRouter.post("/submit-order", async (req, res) => {
  try {
    const rawUrl = process.env.VITE_GOOGLE_SHEETS_URL || process.env.VITE_SHEETS_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec";
    const urlStr = rawUrl.trim().replace(/^['"]|['"]$/g, "");
    console.log(`[PROXY] Submitting order to Google Sheets... (${req.body.orderId || "no-id"})`);
    const postData = JSON.stringify(req.body);
    const makeRequest = async (urlString) => {
      const { URL: URL2 } = await import("url");
      return new Promise((resolve, reject) => {
        const _url = new URL2(urlString);
        const options = {
          hostname: _url.hostname,
          path: _url.pathname + _url.search,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
          }
        };
        const reqHttp = import_https.default.request(options, (resHttp) => {
          if (resHttp.statusCode === 302 && resHttp.headers.location) {
            resolve({ status: 200, text: JSON.stringify({ status: "success", message: "Redirected" }) });
            return;
          }
          let data = "";
          resHttp.on("data", (chunk) => {
            data += chunk;
          });
          resHttp.on("end", () => {
            resolve({ status: resHttp.statusCode, text: data });
          });
        });
        reqHttp.on("error", (e) => reject(e));
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
      message: error.message || "Failed to proxy order to Google Sheets"
    });
  }
});
apiRouter.post("/create-razorpay-order", async (req, res) => {
  try {
    const currentKeyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_live_Sw0OjZoidQe04p").trim();
    const currentKeySecret = (process.env.RAZORPAY_KEY_SECRET || "Xl5dAr611y4jLqhVfUQ6xa7k").trim();
    const keyMode = currentKeyId.startsWith("rzp_test_") ? "TEST MODE" : "LIVE MODE";
    console.log(`[RAZORPAY DEBUG] Mode: ${keyMode} | Key ID: ${currentKeyId ? `${currentKeyId.substring(0, 8)}...` : "UNDEFINED"} | Secret: ${currentKeySecret ? "DEFINED" : "UNDEFINED"}`);
    if (!currentKeyId || !currentKeySecret) {
      console.error("[RAZORPAY ERROR] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment variables.");
      return res.status(500).json({ success: false, error: "Razorpay not initialized (Missing API Keys in Hostinger / Environment Configuration)" });
    }
    const rzp = new import_razorpay.default({
      key_id: currentKeyId,
      key_secret: currentKeySecret
    });
    const rawAmount = req.body.amount;
    if (rawAmount === void 0 || rawAmount === null || isNaN(Number(rawAmount))) {
      return res.status(400).json({ success: false, error: "Invalid amount specified. Amount must be a valid number." });
    }
    const isAlreadyPaise = req.body.isPaise || Number(rawAmount) > 5e4;
    let finalAmount = isAlreadyPaise ? Math.round(Number(rawAmount)) : Math.round(Number(rawAmount) * 100);
    if (finalAmount < 100) {
      finalAmount = 100;
    }
    const options = {
      amount: finalAmount,
      currency: req.body.currency || "INR",
      receipt: req.body.receipt || `receipt_${Date.now()}`,
      notes: req.body.notes || {}
    };
    console.log(`[RAZORPAY DEBUG] Creating order with options:`, JSON.stringify(options));
    const order = await rzp.orders.create(options);
    console.log(`[RAZORPAY DEBUG] Order created successfully:`, order.id);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: currentKeyId
    });
  } catch (err) {
    console.error("Razorpay error:", err?.message, err?.statusCode, err?.error);
    console.error("[RAZORPAY ERROR] Detailed Razorpay Error (create-razorpay-order):", {
      message: err?.message,
      statusCode: err?.statusCode,
      errorDetails: err?.error,
      fullError: err
    });
    res.status(500).json({
      success: false,
      error: err?.error?.description || err?.message || "Failed to create order"
    });
  }
});
apiRouter.post("/create-order", async (req, res) => {
  try {
    const currentKeyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_live_Sw0OjZoidQe04p").trim();
    const currentKeySecret = (process.env.RAZORPAY_KEY_SECRET || "Xl5dAr611y4jLqhVfUQ6xa7k").trim();
    const keyMode = currentKeyId.startsWith("rzp_test_") ? "TEST MODE" : "LIVE MODE";
    console.log(`[RAZORPAY DEBUG] Mode: ${keyMode} | Key ID: ${currentKeyId ? `${currentKeyId.substring(0, 8)}...` : "UNDEFINED"} | Secret: ${currentKeySecret ? "DEFINED" : "UNDEFINED"}`);
    if (!currentKeyId || !currentKeySecret) {
      console.error("[RAZORPAY ERROR] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment variables.");
      return res.status(500).json({ success: false, error: "Razorpay not initialized (Missing API Keys in Hostinger / Environment Configuration)" });
    }
    const rzp = new import_razorpay.default({
      key_id: currentKeyId,
      key_secret: currentKeySecret
    });
    const rawAmount = req.body.amount;
    if (rawAmount === void 0 || rawAmount === null || isNaN(Number(rawAmount))) {
      return res.status(400).json({ success: false, error: "Invalid amount specified. Amount must be a valid number." });
    }
    const isAlreadyPaise = req.body.isPaise || Number(rawAmount) > 5e4;
    let finalAmount = isAlreadyPaise ? Math.round(Number(rawAmount)) : Math.round(Number(rawAmount) * 100);
    if (finalAmount < 100) {
      finalAmount = 100;
    }
    const options = {
      amount: finalAmount,
      currency: req.body.currency || "INR",
      receipt: req.body.receipt || `receipt_${Date.now()}`,
      notes: req.body.notes || {}
    };
    console.log(`[RAZORPAY DEBUG] Creating order with options:`, JSON.stringify(options));
    const order = await rzp.orders.create(options);
    console.log(`[RAZORPAY DEBUG] Order created successfully:`, order.id);
    res.json({
      ...order,
      orderId: order.id,
      key: currentKeyId
    });
  } catch (err) {
    console.error("Razorpay error:", err?.message, err?.statusCode, err?.error);
    console.error("[RAZORPAY ERROR] Detailed Razorpay Error (create-order):", {
      message: err?.message,
      statusCode: err?.statusCode,
      errorDetails: err?.error,
      fullError: err
    });
    const errorMessage = err?.error?.description || err?.message || "Failed to create order";
    res.status(500).json({
      success: false,
      error: errorMessage === "Authentication failed" ? "Razorpay Authentication failed. Please check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are exact." : errorMessage
    });
  }
});
apiRouter.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const currentKeyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_live_Sw0OjZoidQe04p").trim();
    const currentKeySecret = (process.env.RAZORPAY_KEY_SECRET || "Xl5dAr611y4jLqhVfUQ6xa7k").trim();
    if (!currentKeySecret) {
      console.error("[RAZORPAY ERROR] Missing RAZORPAY_KEY_SECRET for payment verification");
      return res.status(500).json({ success: false, error: "Razorpay Key Secret not configured" });
    }
    const expectedSign = import_crypto.default.createHmac("sha256", currentKeySecret).update(sign.toString()).digest("hex");
    if (razorpay_signature === expectedSign) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      console.error("[RAZORPAY ERROR] Signature verification failed. Expected vs Received mismatch.");
      res.status(400).json({ success: false, error: "Invalid signature verified" });
    }
  } catch (error) {
    console.error("Signature Verification Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
apiRouter.post(["/meta-capi", "/sys-metric"], async (req, res) => {
  const { event_name, event_id, value, currency, content_ids, contents, num_items, user_data: clientUserData, event_source_url } = req.body;
  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.log("[CAPI] Missing META_PIXEL_ID or META_ACCESS_TOKEN, skipping.");
    return res.json({ success: false, reason: "Missing config" });
  }
  try {
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const clientIpAddress = typeof rawIp === "string" ? rawIp.split(",")[0].trim() : rawIp;
    const clientUserAgent = req.headers["user-agent"] || "";
    const currentTimestamp = Math.floor(Date.now() / 1e3);
    const helperHash = (val) => {
      if (!val) return void 0;
      const clean = val.toString().trim().toLowerCase();
      if (!clean) return void 0;
      if (/^[a-f0-9]{64}$/i.test(clean)) {
        return clean;
      }
      return import_crypto.default.createHash("sha256").update(clean).digest("hex");
    };
    const providedUserData = clientUserData || {};
    const userDataObj = {
      client_ip_address: clientIpAddress,
      client_user_agent: clientUserAgent
    };
    const parsedCookies = {};
    if (req.headers.cookie) {
      req.headers.cookie.split(";").forEach((cookie) => {
        const parts = cookie.split("=");
        if (parts.length === 2) {
          parsedCookies[parts[0].trim()] = parts[1].trim();
        }
      });
    }
    const finalFbp = providedUserData.fbp || parsedCookies["_fbp"] || null;
    let finalFbc = providedUserData.fbc || parsedCookies["_fbc"] || null;
    if (!finalFbc && event_source_url) {
      try {
        const parsedUrl = new URL(event_source_url);
        const fbclid = parsedUrl.searchParams.get("fbclid");
        if (fbclid) {
          finalFbc = `fb.1.${Date.now()}.${fbclid}`;
        }
      } catch (e) {
      }
    }
    if (finalFbp) userDataObj.fbp = finalFbp;
    if (finalFbc) userDataObj.fbc = finalFbc;
    if (providedUserData.external_id) {
      const extIdHash = helperHash(providedUserData.external_id);
      if (extIdHash) userDataObj.external_id = [extIdHash];
    }
    if (providedUserData.em) {
      const emHash = helperHash(providedUserData.em);
      if (emHash) userDataObj.em = [emHash];
    }
    if (providedUserData.ph) {
      let numericPhone = providedUserData.ph.toString().replace(/\D/g, "");
      if (numericPhone.length === 10) {
        numericPhone = "91" + numericPhone;
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
      userDataObj.country = [helperHash("in")];
    }
    const eventData = {
      event_name: event_name || "Purchase",
      event_time: currentTimestamp,
      event_id,
      action_source: "website",
      event_source_url: event_source_url || req.headers.referer || "https://mukeshsarees.com/",
      user_data: userDataObj,
      custom_data: {
        currency: currency || "INR",
        value: Number(value) || 0,
        content_ids: content_ids || [],
        contents: contents || [],
        content_type: "product",
        num_items: num_items || (contents ? contents.reduce((acc, c) => acc + (c.quantity || 1), 0) : 1)
      }
    };
    const payload = JSON.stringify({
      data: [eventData]
    });
    const https2 = await import("https");
    const options = {
      hostname: "graph.facebook.com",
      path: `/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    };
    const capiReq = https2.request(options, (capiRes) => {
      let data = "";
      capiRes.on("data", (chunk) => data += chunk);
      capiRes.on("end", () => {
        console.log(`[CAPI] Meta dynamic response [${event_name}]: ${capiRes.statusCode} - ${data}`);
        res.json({ success: true, metaStatus: capiRes.statusCode });
      });
    });
    capiReq.on("error", (e) => {
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
apiRouter.get("/geolocation", async (req, res) => {
  try {
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip || "";
    let clientIp = typeof rawIp === "string" ? rawIp.split(",")[0].trim() : rawIp;
    if (clientIp.startsWith("::ffff:")) {
      clientIp = clientIp.substring(7);
    }
    console.log(`[GEO] Detected client IP: ${clientIp}`);
    if (!clientIp || clientIp === "127.0.0.1" || clientIp === "::1" || clientIp === "localhost") {
      return res.json({
        success: true,
        city: "Nagpur",
        country: "IN",
        isLocalhost: true
      });
    }
    const url = `https://ipwho.is/${encodeURIComponent(clientIp)}`;
    const https2 = await import("https");
    const fetchGeoData = () => {
      return new Promise((resolve, reject) => {
        https2.get(url, (geoRes) => {
          let data = "";
          geoRes.on("data", (chunk) => data += chunk);
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
    const fallbackUrl = `https://ipapi.co/${encodeURIComponent(clientIp)}/json/`;
    const fetchFallbackGeoData = () => {
      return new Promise((resolve, reject) => {
        https2.get(fallbackUrl, (geoRes) => {
          let data = "";
          geoRes.on("data", (chunk) => data += chunk);
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
    console.warn(`[GEO] Geolocation resolution failed for IP [${clientIp}]`);
    res.json({ success: false, error: "Geolocation resolution failed" });
  } catch (error) {
    console.error("[GEO] Error resolving geolocation server-side:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
app.use("/api", apiRouter);
app.all("/api/*splat", (req, res) => {
  console.log(`[404] API route not found: ${req.method} ${req.url}`);
  res.status(404).json({ success: false, error: `API route not found: ${req.method} ${req.url}` });
});
var preParsedProducts = [];
try {
  let productsMetaPath = import_path.default.join(process.cwd(), "dist", "products-meta.json");
  if (!import_fs.default.existsSync(productsMetaPath)) {
    productsMetaPath = import_path.default.join(process.cwd(), "public", "products-meta.json");
  }
  if (import_fs.default.existsSync(productsMetaPath)) {
    preParsedProducts = JSON.parse(import_fs.default.readFileSync(productsMetaPath, "utf-8"));
  } else {
    console.log("products-meta.json not found. Run 'node scripts/build_meta.js' to generate it.");
  }
} catch (e) {
  console.log("Could not load products-meta.json for OG tags", e);
}
var getSquareServerImageUrl = (imageUrl) => {
  if (!imageUrl) return "https://mukeshsarees.com/images/og-home.jpg";
  let targetUrl = imageUrl;
  if (imageUrl.includes("wsrv.nl")) {
    const match = imageUrl.match(/[?&]url=([^&]+)/);
    if (match) {
      targetUrl = decodeURIComponent(match[1]);
    }
  }
  if (targetUrl.includes("drive.google.com")) {
    const driveIdMatch = targetUrl.match(/[?&]id=([^&]+)/);
    if (driveIdMatch) {
      const fileId = driveIdMatch[1];
      targetUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  } else if (targetUrl.includes("lh3.googleusercontent.com")) {
    targetUrl = targetUrl.split("=")[0];
  }
  return `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=1200&h=1200&fit=contain&cbg=ffffff&output=jpg&q=90`;
};
var getWhatsAppSafeServerDescription = (text, productContext) => {
  if (!text) return "Shop premium Indian ethnic wear, sarees, and co-ord sets at Mukesh Saree Centre.";
  let clean = text.replace(/<[^>]*>?/gm, " ").replace(/\*\*(DESCRIPTION|HIGHLIGHTS|FABRIC DETAILS|SIZE & FIT|STYLING|CARE INSTRUCTIONS|WASH CARE|FABRIC):\*\*/gi, "").replace(/\*\*[A-Z\s&_:\-]+\:\*\*/gi, " ").replace(/\*\*[A-Z\s&_:\-]+\*\*/gi, " ").replace(/^[•\-\*\s]+/gm, " ").replace(/\*/g, "").replace(/\s+/g, " ").trim();
  const sentenceEndRegex = /[.!?](?=\s|$)/;
  const match = clean.match(sentenceEndRegex);
  let sentence = "";
  if (match && match.index !== void 0) {
    sentence = clean.slice(0, match.index + 1).trim();
  } else {
    sentence = clean;
  }
  if (sentence.length < 20 && productContext) {
    const color = productContext.color || "";
    const fabric = productContext.fabric || "";
    const category = productContext.category || "ensemble";
    sentence = `This elegant ${color} ${fabric} ${category} is beautifully crafted to elevate your ethnic style.`;
  } else if (sentence.length < 20) {
    sentence = "Experience premium comfort and elegance with our handpicked Indian ethnic wear collection.";
  }
  const words = sentence.split(/\s+/);
  if (words.length > 60) {
    sentence = words.slice(0, 60).join(" ");
  }
  if (!/[.!?]$/.test(sentence)) {
    sentence += ".";
  }
  return sentence;
};
var injectOGTags = (html, reqPath, originalUrl) => {
  let ogTitle = "Mukesh Saree Centre \u2013 Premium Silk Sarees Since 1978";
  let ogDesc = "Mukesh Saree Centre, Nagpur \u2014 Premium sarees, linen sarees & co-ord sets since 1978. Cash on Delivery. Free shipping on orders \u20B9999+. Shop 100+ authentic ethnic wear styles.";
  const defaultBannerUrl = "https://mukeshsarees.com/images/og-home.jpg";
  let ogImg = defaultBannerUrl;
  let ogUrl = "https://mukeshsarees.com" + originalUrl;
  let price = "";
  let isProduct = false;
  const productMatch = reqPath.match(/^\/product\/([^\/]+)\/?$/);
  if (productMatch) {
    const slug = productMatch[1].trim().toLowerCase();
    const prod = preParsedProducts.find((p) => p.slug && p.slug.trim().toLowerCase() === slug);
    if (prod) {
      ogTitle = `${prod.name} \u2013 \u20B9${prod.price || "0"} | Mukesh Saree Centre`;
      const rawShortDesc = getWhatsAppSafeServerDescription(prod.description, prod);
      const cleanShortDesc = rawShortDesc.replace(/\|/g, "").trim();
      const mrpValue = prod.originalPrice || "";
      const mrpPart = mrpValue ? ` (MRP \u20B9${mrpValue})` : "";
      ogDesc = `\u2728 ${cleanShortDesc} | \u{1F4B0} \u20B9${prod.price || "0"}${mrpPart} | \u{1F69A} Free Shipping | Cash on Delivery Available`;
      ogImg = getSquareServerImageUrl(prod.image || defaultBannerUrl);
      price = prod.price || "0";
      isProduct = true;
    }
  } else if (reqPath.startsWith("/shop")) {
    ogTitle = "Shop Sarees, Co-Ord Sets & Ethnic Wear \u2014 Mukesh Saree Centre";
    ogDesc = "Browse 50+ premium sarees, linen sarees, co-ord sets and lehengas. Cash on Delivery available. Free shipping above \u20B9999. Trusted since 1978.";
    ogImg = defaultBannerUrl;
  } else if (reqPath.startsWith("/contact")) {
    ogTitle = "Contact Us";
    ogDesc = "Contact Mukesh Saree Centre, Gandhibagh Nagpur. Call +91 7020664641. Open 11:30AM\u20139:30PM (closed Mondays). Bridal saree bookings, custom orders welcome.";
  } else if (reqPath.startsWith("/return-policy")) {
    ogTitle = "Returns & Exchanges";
    ogDesc = "Mukesh Saree Centre return policy \u2014 7-day returns on all products. Refund via UPI/Bank Transfer within 3-5 business days. Easy hassle-free process.";
  }
  const defaultOgBlockRegex = /<!-- Default OG Tags -->[\s\S]*?<!-- End Default OG Tags -->/;
  let dynamicTags = `<!-- Dynamic OG Tags -->
     <meta property="og:title" content="${ogTitle}" />
     <meta property="og:description" content="${ogDesc}" />
     <meta property="og:image" content="${ogImg}" />
     <meta property="og:url" content="${ogUrl}" />
     <meta property="og:type" content="${isProduct ? "product" : "website"}" />
     <meta property="og:site_name" content="Mukesh Saree Centre" />
     <meta property="og:image:width" content="${isProduct ? "1200" : "1200"}" />
     <meta property="og:image:height" content="${isProduct ? "1200" : "630"}" />
     <meta property="og:image:type" content="${isProduct ? "image/jpeg" : "image/jpeg"}" />
     <meta name="twitter:card" content="summary_large_image" />
     <meta name="twitter:title" content="${ogTitle}" />
     <meta name="twitter:description" content="${ogDesc}" />
     <meta name="twitter:image" content="${ogImg}" />
     <link rel="canonical" href="${ogUrl}" />
     <!-- End Dynamic OG Tags -->`;
  let injectedHtml = html.replace(defaultOgBlockRegex, dynamicTags);
  injectedHtml = injectedHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${ogTitle}</title>`
  );
  injectedHtml = injectedHtml.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${ogDesc.replace(/"/g, "&quot;").replace(/\n/g, " ")}" />`
  );
  if (isProduct) {
    const jsonLd = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "${ogTitle.replace(/"/g, '\\"')}",
      "image": "${ogImg}",
      "description": "${ogDesc.replace(/"/g, '\\"').replace(/\n/g, " ")}",
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
    injectedHtml = injectedHtml.replace(/<\/head>/, jsonLd);
  }
  return injectedHtml;
};
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: https://mukeshsarees.com/sitemap.xml`);
});
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  const sitemapPath = import_path.default.join(process.cwd(), "dist", "sitemap.xml");
  const publicSitemapPath = import_path.default.join(process.cwd(), "public", "sitemap.xml");
  if (import_fs.default.existsSync(sitemapPath)) {
    return res.sendFile(sitemapPath);
  } else if (import_fs.default.existsSync(publicSitemapPath)) {
    return res.sendFile(publicSitemapPath);
  }
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mukeshsarees.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mukeshsarees.com/shop</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`);
});
async function setupServer() {
  app.use((req, res, next) => {
    const userAgent = (req.headers["user-agent"] || "").toLowerCase();
    const isBot = [
      "whatsapp",
      "facebookexternalhit",
      "facebot",
      "twitterbot",
      "telegrambot",
      "linkedinbot",
      "slackbot",
      "googlebot"
    ].some((bot) => userAgent.includes(bot));
    if (isBot) {
      req.isBot = true;
    }
    next();
  });
  if (false && process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);
    app.get("/{*splat}", async (req, res, next) => {
      if (req.path.match(/\.(js|ts|tsx|jsx|css|scss|json|map)$/) || req.query.t) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = import_fs.default.readFileSync(import_path.default.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const html = injectOGTags(template, req.path, req.originalUrl);
        res.status(200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
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
    const distPath = import_path.default.join(process.cwd(), "public_html");
    const indexPath = import_path.default.join(distPath, "index.html");
    app.use(import_express.default.static(distPath, {
      index: false,
      maxAge: "7d",
      // Default fallback cache of 7 days for normal static files
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        } else if (filePath.match(/\.(js|css|woff|woff2|ttf|otf)$/)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (filePath.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
          res.setHeader("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400");
        }
      }
    }));
    app.get("/{*splat}", (req, res) => {
      if (req.path.match(/\.(js|ts|tsx|jsx|css|scss|json|map|png|jpg|jpeg|gif|svg|webp)$/)) {
        return res.status(404).send("Asset not found");
      }
      try {
        const isBot = req.isBot;
        let selectedIndexPath = indexPath;
        if (!isBot) {
          const cleanPath = import_path.default.join(distPath, "index-clean.html");
          if (import_fs.default.existsSync(cleanPath)) {
            selectedIndexPath = cleanPath;
          }
        } else {
          const cleanReqPath = req.path.replace(/^\/+|\/+$/g, "");
          if (cleanReqPath) {
            const specificPrerenderedPath = import_path.default.join(distPath, cleanReqPath, "index.html");
            if (import_fs.default.existsSync(specificPrerenderedPath)) {
              selectedIndexPath = specificPrerenderedPath;
            }
          }
        }
        if (!import_fs.default.existsSync(selectedIndexPath)) {
          selectedIndexPath = indexPath;
        }
        if (!import_fs.default.existsSync(selectedIndexPath)) {
          return res.status(404).send("Not built yet.");
        }
        let html = import_fs.default.readFileSync(selectedIndexPath, "utf-8");
        const fallbacks = {
          VITE_META_PIXEL_ID: "3834311026859384",
          VITE_FB_DOMAIN_VERIFY: "",
          VITE_GTM_ID: "GTM-WMG3G6SM",
          VITE_GA4_ID: "G_GA4_MEASUREMENT_ID",
          VITE_PINTEREST_TAG: "",
          VITE_PINTEREST_DOMAIN: "5099ed06768c1b801e53b45489b5bf2d",
          VITE_RAZORPAY_KEY_ID: "rzp_live_Sw0OjZoidQe04p",
          VITE_WHATSAPP_NUMBER: "917020664641",
          VITE_SHEETS_WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec",
          VITE_GOOGLE_SHEETS_URL: "https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec",
          VITE_SITE_URL: "https://mukeshsarees.com",
          VITE_SITE_NAME: "Mukesh Saree Centre",
          VITE_STORE_PHONE: "+91 7020664641"
        };
        html = html.replace(/%VITE_([A-Z0-9_]+)%/g, (match, key) => {
          const envKey = `VITE_${key}`;
          let val = process.env[envKey];
          if (key === "GA4_ID" && !val) {
            val = process.env.VITE_GA_MEASUREMENT_ID || process.env.VITE_GA4_ID;
          }
          if (val === void 0) {
            val = fallbacks[envKey];
          }
          if (val !== void 0 && val !== null) {
            const strVal = String(val).trim();
            if (strVal.startsWith("your_") || strVal.includes("YOUR_SCRIPT_ID") || strVal === "your_fb_domain_verify_token" || strVal === "your_pinterest_domain_verify" || strVal === "your_gtm_id" || strVal === "your_pinterest_tag_id" || strVal === "your_ga4_measurement_id" || strVal === "G_GA4_MEASUREMENT_ID") {
              return "";
            }
            return strVal;
          }
          return "";
        });
        html = injectOGTags(html, req.path, req.originalUrl);
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.send(html);
      } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
      }
    });
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
  setupServer();
}
var server_default = app;
//# sourceMappingURL=server.cjs.map
