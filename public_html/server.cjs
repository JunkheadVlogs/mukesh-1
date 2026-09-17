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
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_razorpay = __toESM(require("razorpay"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_url = require("url");
var import_https = __toESM(require("https"), 1);
var import_meta = {};
delete process.env.GITHUB_TOKEN;
delete process.env.GH_TOKEN;
var _filename = "";
var _dirname = "";
try {
  if (typeof import_meta !== "undefined" && import_meta.url) {
    _filename = (0, import_url.fileURLToPath)(import_meta.url);
    _dirname = import_path.default.dirname(_filename);
  } else if (typeof __filename !== "undefined" && typeof __dirname !== "undefined") {
    _filename = __filename;
    _dirname = __dirname;
  } else {
    _filename = process.cwd();
    _dirname = process.cwd();
  }
} catch (e) {
  _filename = process.cwd();
  _dirname = process.cwd();
}
var currentFilePath = _filename;
var currentDirPath = _dirname;
process.on("unhandledRejection", (reason, promise) => {
  console.error("[SERVER] Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (error) => {
  console.error("[SERVER] Uncaught Exception thrown:", error);
});
var isCompiledBundle = true;
var isCompiledCjs = isCompiledBundle || typeof currentFilePath === "string" && (currentFilePath.endsWith(".cjs") || currentFilePath.includes("dist")) || typeof process.argv[1] === "string" && (process.argv[1].endsWith(".cjs") || process.argv[1].includes("dist"));
var distHtmlPath = import_path.default.join(process.cwd(), "dist", "index.html");
var isDistReady = import_fs.default.existsSync(distHtmlPath);
var isRunningWithTsx = process.argv.some((arg) => arg.includes("tsx")) || process.env.npm_lifecycle_event === "dev";
var isDev = isRunningWithTsx && !isCompiledCjs;
var isProduction = !isDev && (isCompiledCjs || process.env.NODE_ENV === "production" || !!process.env.K_SERVICE && !process.env.K_SERVICE.startsWith("ais-dev-") && !process.env.K_SERVICE.startsWith("ais-pre-"));
if (!isProduction) {
  process.env.NODE_ENV = "development";
} else {
  process.env.NODE_ENV = "production";
}
import_dotenv.default.config();
process.env.VITE_FB_DOMAIN_VERIFY = "kjvbvikfmctlsdfygll3tadkpzty8a";
var app = (0, import_express.default)();
function startListening() {
  const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : NaN;
  const portsToListen = [];
  if (!isNaN(envPort) && envPort > 0) {
    portsToListen.push(envPort);
  }
  if (!portsToListen.includes(3e3)) {
    portsToListen.push(3e3);
  }
  if (!portsToListen.includes(8080)) {
    portsToListen.push(8080);
  }
  const servers = [];
  for (const port of portsToListen) {
    try {
      const server = app.listen(port, "0.0.0.0", () => {
        console.log(`[SERVER] Active and listening on http://0.0.0.0:${port} (${isProduction ? "production" : "development"})`);
      });
      server.keepAliveTimeout = 65e3;
      server.headersTimeout = 66e3;
      server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.log(`[SERVER] Port ${port} is occupied (expected if reverse proxy is running on this port).`);
        } else {
          console.error(`[SERVER] Error on port ${port}:`, err);
        }
      });
      servers.push(server);
    } catch (e) {
      console.warn(`[SERVER] Could not bind to port ${port}:`, e.message);
    }
  }
  return servers;
}
process.on("uncaughtException", (err) => {
  console.error("[SERVER] Uncaught exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("[SERVER] Unhandled rejection at:", promise, "reason:", reason);
});
process.on("SIGTERM", () => {
  console.log("[SERVER] SIGTERM received, exiting cleanly...");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("[SERVER] SIGINT received, exiting cleanly...");
  process.exit(0);
});
app.get(["/api/health", "/health", "/_ah/health", "/healthz"], (req, res) => {
  res.status(200).json({ status: "ok", mode: isProduction ? "production" : "development", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.use((req, res, next) => {
  const logStr = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${req.method} ${req.url} (User-Agent: ${req.headers["user-agent"]})
`;
  try {
    import_fs.default.appendFileSync(import_path.default.join(process.cwd(), "requests.log"), logStr, "utf-8");
  } catch (err) {
  }
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
var KNOWN_LIVE_KEY_ID = "rzp_live_Sw0OjZoidQe04p";
var KNOWN_LIVE_KEY_SECRET = "gswtW1QzFFe7fxP1YJ0EhqRG";
function getActiveRazorpayCredentials() {
  let keyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "").trim();
  let keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
  if (!keyId || !keySecret || keyId === "rzp_live_Slf11Odg572QOq" || keyId === "your_razorpay_key_id") {
    keyId = KNOWN_LIVE_KEY_ID;
    keySecret = KNOWN_LIVE_KEY_SECRET;
  }
  return { keyId, keySecret };
}
var { keyId: RAZORPAY_KEY_ID, keySecret: RAZORPAY_KEY_SECRET } = getActiveRazorpayCredentials();
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
apiRouter.post("/browser-log", (req, res) => {
  try {
    const { type, messages, timestamp } = req.body;
    const msgStr = Array.isArray(messages) ? messages.join(" ") : String(messages);
    console.log(`[CLIENT-SIDE ${String(type).toUpperCase()}] [${timestamp}]`, msgStr);
    const logLine = `[${timestamp}] [${String(type).toUpperCase()}] ${msgStr}
`;
    import_fs.default.appendFileSync(import_path.default.join(process.cwd(), "browser.log"), logLine, "utf-8");
  } catch (err) {
  }
  res.sendStatus(200);
});
apiRouter.post("/capture-lead", async (req, res) => {
  try {
    const { name, phone, source, page } = req.body;
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
          name: name || "",
          phone: `+91${finalPhone}`,
          source: source || "Exit Intent Popup",
          page: page || "N/A",
          capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
          discountCode: "VIPCLUB60",
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
    const isExitLead = req.body.type === "exit_lead" || req.body.leadSource === "Exit Intent Popup" || req.body.source === "Exit Intent Popup" || req.body.source === "Popup";
    if (isExitLead) {
      req.body.type = "exit_lead";
      const leadName = req.body.name || req.body.firstName || req.body.fullName || req.body.customerName || "";
      const leadPhone = req.body.phone || req.body.mobileNumber || req.body.contact || "";
      req.body.name = leadName;
      req.body.firstName = leadName;
      req.body.fullName = leadName;
      req.body.phone = leadPhone;
      req.body.mobileNumber = leadPhone;
      req.body.couponCode = req.body.couponCode || req.body.couponUsed || "VIPCLUB60";
      req.body.couponUsed = req.body.couponCode;
    }
    console.log(`[PAYMENT ACTION LOG] [SERVER] Order Submission update. Order ID: ${req.body.orderId || "no-id"}, Status: ${req.body.status || "N/A"}, Payment Status: ${req.body.paymentStatus || "N/A"}`);
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
apiRouter.post("/return-request", async (req, res) => {
  try {
    const { orderId, fullName, phone, reason, comments } = req.body;
    if (!orderId || !fullName || !phone || !reason) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
    const cleanPhone = phone.toString().replace(/\D/g, "");
    const finalPhone = cleanPhone.length === 12 && cleanPhone.startsWith("91") ? cleanPhone.substring(2) : cleanPhone;
    const phoneWithPrefix = `+91${finalPhone}`;
    console.log(`[ROUTE-RETURN-REQUEST] Processing return request for order: ${orderId}`);
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
        await admin.default.firestore().collection("return_requests").add({
          orderId,
          fullName,
          phone: phoneWithPrefix,
          reason,
          comments: comments || "",
          submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
          status: "Pending"
        });
        firestoreSaved = true;
        console.log("[ROUTE-RETURN-REQUEST] Save to Firestore successful.");
      } catch (dbErr) {
        console.error("[ROUTE-RETURN-REQUEST] Error saving to Firestore:", dbErr);
      }
    } else {
      console.warn("[ROUTE-RETURN-REQUEST] FIREBASE_SERVICE_ACCOUNT not configured, skipping Firestore.");
    }
    let sheetsSaved = false;
    const rawUrl = process.env.VITE_GOOGLE_SHEETS_URL || process.env.VITE_SHEETS_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec";
    const urlStr = rawUrl.trim().replace(/^['"]|['"]$/g, "");
    if (urlStr) {
      try {
        const postData = JSON.stringify({
          type: "return_request",
          orderId,
          fullName,
          phone: phoneWithPrefix,
          reason,
          comments: comments || "",
          submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
          device: /Mobi|Android/i.test(String(req.headers["user-agent"] || "")) ? "Mobile" : "Desktop"
        });
        const { URL: URL2 } = await import("url");
        const makeSheetsRequest = async (urlString) => {
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
        await makeSheetsRequest(urlStr);
        sheetsSaved = true;
        console.log("[ROUTE-RETURN-REQUEST] Forwarded to Google Sheets successfully.");
      } catch (sheetsErr) {
        console.error("[ROUTE-RETURN-REQUEST] Error sending to Google Sheets:", sheetsErr);
      }
    }
    res.json({
      success: true,
      firestoreSaved,
      sheetsSaved,
      message: "Return request submitted successfully"
    });
  } catch (err) {
    console.error("[ROUTE-RETURN-REQUEST] Error processing return request:", err);
    res.status(500).json({ success: false, error: err?.message || "Internal server error" });
  }
});
apiRouter.post(["/create-razorpay-order", "/create-order"], async (req, res) => {
  try {
    let { keyId: currentKeyId, keySecret: currentKeySecret } = getActiveRazorpayCredentials();
    const keyMode = currentKeyId.startsWith("rzp_test_") ? "TEST MODE" : "LIVE MODE";
    const clientOrderId = req.body.notes?.order_id || "N/A";
    const clientAmount = req.body.amount || "N/A";
    console.log(`[PAYMENT ACTION LOG] [SERVER] Starting Razorpay order creation. Client Order ID: ${clientOrderId}, Amount: INR ${clientAmount}, Mode: ${keyMode}`);
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
    let rzp = new import_razorpay.default({
      key_id: currentKeyId,
      key_secret: currentKeySecret
    });
    let order;
    let actualKeyId = currentKeyId;
    try {
      console.log(`[PAYMENT ACTION LOG] [SERVER] Creating order with parameters:`, JSON.stringify(options));
      order = await rzp.orders.create(options);
    } catch (createErr) {
      const isAuthError = createErr?.statusCode === 401 || createErr?.error?.description === "Authentication failed";
      if (isAuthError && currentKeyId !== KNOWN_LIVE_KEY_ID) {
        console.warn(`[PAYMENT ACTION LOG] [SERVER] Primary Razorpay credentials failed (401). Retrying with active live credentials...`);
        rzp = new import_razorpay.default({
          key_id: KNOWN_LIVE_KEY_ID,
          key_secret: KNOWN_LIVE_KEY_SECRET
        });
        order = await rzp.orders.create(options);
        actualKeyId = KNOWN_LIVE_KEY_ID;
      } else {
        throw createErr;
      }
    }
    console.log(`[PAYMENT ACTION LOG] [SERVER] Razorpay order created successfully on gateway. Server Order ID: ${order.id}`);
    res.json({
      ...order,
      orderId: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: actualKeyId
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
      error: errorMessage === "Authentication failed" ? "Razorpay Authentication failed. Please check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." : errorMessage
    });
  }
});
apiRouter.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log(`[PAYMENT ACTION LOG] [SERVER] Payment verification request received. Razorpay Order ID: ${razorpay_order_id}, Payment ID: ${razorpay_payment_id}`);
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const { keySecret: currentKeySecret } = getActiveRazorpayCredentials();
    const expectedSign = import_crypto.default.createHmac("sha256", currentKeySecret).update(sign.toString()).digest("hex");
    let isMatch = razorpay_signature === expectedSign;
    if (!isMatch && currentKeySecret !== KNOWN_LIVE_KEY_SECRET) {
      const fallbackSign = import_crypto.default.createHmac("sha256", KNOWN_LIVE_KEY_SECRET).update(sign.toString()).digest("hex");
      if (razorpay_signature === fallbackSign) {
        isMatch = true;
      }
    }
    if (isMatch) {
      console.log(`[PAYMENT ACTION LOG] [SERVER] Signature matched! Payment ${razorpay_payment_id} successfully verified.`);
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      console.error("[PAYMENT ACTION LOG] [SERVER] [RAZORPAY ERROR] Signature verification failed. Expected vs Received signature hash mismatch.");
      res.status(400).json({ success: false, error: "Invalid signature verified" });
    }
  } catch (error) {
    console.error("[PAYMENT ACTION LOG] [SERVER] Signature verification exception:", error);
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
    const cleanEmail = (em) => {
      if (!em) return void 0;
      const val = em.toString().trim().toLowerCase();
      if (val === "info.mukeshsareecentre@gmail.com" || val === "info@mukeshsarees.com" || val === "test@gmail.com" || val === "test@example.com" || val === "example@example.com" || val.includes("mukeshsaree")) {
        return void 0;
      }
      return val;
    };
    const cleanPhone = (ph) => {
      if (!ph) return void 0;
      let digits = ph.toString().replace(/\D/g, "");
      if (digits === "9170206646" || digits === "917020664641" || digits === "7020664641" || digits === "1234567890" || digits === "9999999999" || digits === "0000000000" || digits.length < 10) {
        return void 0;
      }
      if (digits.length === 10) {
        digits = "91" + digits;
      }
      return digits;
    };
    let finalSourceUrl = event_source_url || "";
    if (finalSourceUrl) {
      try {
        const parsedUrl = new URL(finalSourceUrl);
        if (parsedUrl.hostname.includes("run.app") || parsedUrl.hostname.includes("localhost") || parsedUrl.hostname.includes("127.0.0.1")) {
          parsedUrl.hostname = "mukeshsarees.com";
          parsedUrl.protocol = "https:";
          parsedUrl.port = "";
        }
        finalSourceUrl = parsedUrl.toString();
      } catch (e) {
        if (finalSourceUrl.startsWith("/")) {
          finalSourceUrl = `https://mukeshsarees.com${finalSourceUrl}`;
        }
      }
    }
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
    if (!finalFbc && finalSourceUrl) {
      try {
        const parsedUrl = new URL(finalSourceUrl);
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
      userDataObj.external_id = providedUserData.external_id.toString().trim();
    }
    const validatedEmail = cleanEmail(providedUserData.em);
    if (validatedEmail) {
      const emHash = helperHash(validatedEmail);
      if (emHash) userDataObj.em = [emHash];
    }
    const validatedPhone = cleanPhone(providedUserData.ph);
    if (validatedPhone) {
      const phHash = helperHash(validatedPhone);
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
      event_source_url: finalSourceUrl || req.headers.referer || "https://mukeshsarees.com/",
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
app.all("/api/*", (req, res) => {
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
var injectOGTags = (html, reqPath, originalUrl) => {
  let ogTitle = "Mukesh Saree Centre | Wholesale & Retail Sarees Since 1978";
  let ogDesc = "\u{1F3EC} Wholesale & Retail Sarees Since 1978 | \u{1F4E6} Bulk Orders & Single Pieces | \u{1F4B5} COD Available | \u{1F69A} Free Shipping | Nagpur";
  const defaultBannerUrl = "https://mukeshsarees.com/og-image.jpg";
  let ogImg = defaultBannerUrl;
  let ogUrl = "https://mukeshsarees.com" + originalUrl;
  if (!ogUrl.endsWith("/")) {
    ogUrl += "/";
  }
  let price = "";
  let isProduct = false;
  let ogWidth = "1200";
  let ogHeight = "630";
  const productMatch = reqPath.match(/^\/product\/([^\/]+)\/?$/);
  if (productMatch) {
    const slug = productMatch[1].trim().toLowerCase();
    const prod = preParsedProducts.find((p) => p.slug && p.slug.trim().toLowerCase() === slug);
    if (prod) {
      ogTitle = `${prod.name} | Mukesh Saree Centre`;
      const fabricItem = prod.fabric ? `\u2728 ${prod.fabric}` : "\u2728 Premium Fabric";
      const discountPercent = prod.originalPrice && prod.price && prod.originalPrice > prod.price ? Math.round((prod.originalPrice - prod.price) / prod.originalPrice * 100) : null;
      const priceText = discountPercent ? `\u{1F4B0} \u20B9${prod.price} (${discountPercent}% OFF)` : `\u{1F4B0} \u20B9${prod.price}`;
      ogDesc = `${fabricItem} | \u{1F69A} Free Shipping | \u{1F4B5} COD Available | ${priceText} | \u{1F3EC} Trusted Since 1978`;
      ogImg = `https://mukeshsarees.com/og-images/${prod.slug}.jpg`;
      ogWidth = "800";
      ogHeight = "1200";
      price = prod.price || "0";
      isProduct = true;
    }
  } else if (reqPath.startsWith("/shop")) {
    ogTitle = "Shop Sarees, Co-Ord Sets & Ethnic Wear \u2014 Mukesh Saree Centre";
    ogDesc = "Browse 50+ premium sarees, linen sarees, co-ord sets and lehengas. Cash on Delivery available. Free shipping above \u20B9499. Trusted since 1978.";
    ogImg = defaultBannerUrl;
  } else if (reqPath.startsWith("/wholesalesarees") || reqPath.startsWith("/wholesale-sarees") || reqPath.startsWith("/wholesale")) {
    ogTitle = "Wholesale Sarees VIP Club \u2014 Mukesh Saree Centre Nagpur";
    ogDesc = "\u{1F3EC} Exclusive Saree Wholesaler in Nagpur Since 1978 | \u{1F4E6} Daily Catalog & Bulk Dealer Rates | \u{1F4F2} Join WhatsApp VIP Club | \u{1F69A} Pan-India Delivery";
    ogImg = "https://mukeshsarees.com/og-images/wholesale-vip-club.jpg";
    ogUrl = "https://mukeshsarees.com/wholesalesarees/";
    ogWidth = "1200";
    ogHeight = "630";
  } else if (reqPath.startsWith("/uniform-saree-bulk-orders")) {
    ogTitle = "Uniform Sarees & Bulk Orders \u2014 Mukesh Saree Centre Nagpur";
    ogDesc = "Wholesale uniform sarees for schools, colleges, institutions & events. Direct weaver pricing, custom design & pan-India delivery.";
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
     <meta property="og:image:secure_url" content="${ogImg}" />
     <meta property="og:url" content="${ogUrl}" />
     <meta property="og:type" content="${isProduct ? "product" : "website"}" />
     <meta property="og:site_name" content="Mukesh Saree Centre" />
     <meta property="og:image:width" content="${ogWidth}" />
     <meta property="og:image:height" content="${ogHeight}" />
     <meta property="og:image:type" content="image/jpeg" />
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
    /<meta (?:data-rh="[^"]*"\s+)?name="description" content="[^"]*"\s*\/?>/,
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
app.get("/og-images/:slug.jpg", (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    return res.redirect(302, "https://mukeshsarees.com/og-image.jpg");
  }
  const cleanSlug = slug.replace(/\.jpg$/, "").trim().toLowerCase();
  const publicOgDir = import_path.default.join(process.cwd(), "public", "og-images");
  const distOgDir = import_path.default.join(process.cwd(), "dist", "og-images");
  const destPublicFile = import_path.default.join(publicOgDir, `${cleanSlug}.jpg`);
  const destDistFile = import_path.default.join(distOgDir, `${cleanSlug}.jpg`);
  if (import_fs.default.existsSync(destDistFile)) {
    return res.sendFile(destDistFile);
  } else if (import_fs.default.existsSync(destPublicFile)) {
    return res.sendFile(destPublicFile);
  }
  const prod = preParsedProducts.find((p) => p.slug && p.slug.trim().toLowerCase() === cleanSlug);
  if (prod) {
    let targetUrl = prod.image || "https://mukeshsarees.com/og-image.jpg";
    if (targetUrl.includes("wsrv.nl")) {
      const match = targetUrl.match(/[?&]url=([^&]+)/);
      if (match) {
        targetUrl = decodeURIComponent(match[1]);
      }
    }
    if (!targetUrl.startsWith("http")) {
      targetUrl = `https://mukeshsarees.com/${targetUrl.replace(/^\/+/, "")}`;
    }
    const finalUrl = `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=800&h=1200&fit=contain&cbg=ffffff&output=jpg&q=85`;
    try {
      if (!import_fs.default.existsSync(publicOgDir)) {
        import_fs.default.mkdirSync(publicOgDir, { recursive: true });
      }
      if (!import_fs.default.existsSync(distOgDir)) {
        import_fs.default.mkdirSync(distOgDir, { recursive: true });
      }
      fetch(finalUrl).then(async (response) => {
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          import_fs.default.writeFileSync(destPublicFile, buffer);
          import_fs.default.writeFileSync(destDistFile, buffer);
          console.log(`[LAZY-OG] Cached image for product slug: ${cleanSlug}`);
        }
      }).catch((err) => {
        console.warn(`[LAZY-OG] Failed to cache image background: ${cleanSlug}`, err);
      });
    } catch (fsError) {
      console.warn(`[LAZY-OG] Error setting up local directories`, fsError);
    }
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.redirect(302, finalUrl);
  }
  res.redirect(302, "https://mukeshsarees.com/og-image.jpg");
});
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  const distRobotsPath = import_path.default.join(process.cwd(), "dist", "robots.txt");
  const publicRobotsPath = import_path.default.join(process.cwd(), "public", "robots.txt");
  if (import_fs.default.existsSync(distRobotsPath)) {
    return res.sendFile(distRobotsPath);
  } else if (import_fs.default.existsSync(publicRobotsPath)) {
    return res.sendFile(publicRobotsPath);
  }
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /cart
Disallow: /checkout
Disallow: /wishlist

User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Bingbot
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
      "googlebot",
      "oai-searchbot",
      "gptbot",
      "chatgpt",
      "chatgpt-user",
      "perplexity",
      "perplexitybot",
      "claude",
      "claudebot",
      "anthropic",
      "bingbot",
      "msnbot",
      "google-extended",
      "googleother",
      "bytespider",
      "cohere",
      "diffbot",
      "applebot",
      "meta-externalagent",
      "amazonbot",
      "bot",
      "crawler",
      "spider",
      "slurp",
      "duckduckbot",
      "baiduspider",
      "yandexbot"
    ].some((bot) => userAgent.includes(bot));
    if (isBot) {
      req.isBot = true;
    }
    next();
  });
  if (!isProduction && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      if (req.path.match(/\.(js|ts|tsx|jsx|css|scss|json|map|png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|eot)$/) || req.query.t) {
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
    let distPath = import_path.default.join(process.cwd(), "dist");
    if (!import_fs.default.existsSync(distPath) && typeof currentDirPath !== "undefined") {
      if (import_fs.default.existsSync(import_path.default.join(currentDirPath, "dist"))) {
        distPath = import_path.default.join(currentDirPath, "dist");
      } else if (currentDirPath.endsWith("dist") && import_fs.default.existsSync(import_path.default.join(currentDirPath, "index.html"))) {
        distPath = currentDirPath;
      }
    }
    const indexPath = import_path.default.join(distPath, "index.html");
    app.use(import_express.default.static(distPath, {
      index: false,
      maxAge: "1y",
      // Default fallback cache of 1 year for static assets
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else if (filePath.match(/\.(js|css|woff|woff2|ttf|otf|eot|png|jpg|jpeg|gif|svg|webp|avif|ico|json)$/)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));
    app.get("*", (req, res) => {
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
          return res.status(200).set({ "Content-Type": "text/html" }).send('<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Mukesh Saree Centre</title></head><body><div id="root"></div></body></html>');
        }
        let html = import_fs.default.readFileSync(selectedIndexPath, "utf-8");
        const fallbacks = {
          VITE_META_PIXEL_ID: "1458541922085984",
          VITE_FB_DOMAIN_VERIFY: "kjvbvikfmctlsdfygll3tadkpzty8a",
          VITE_GTM_ID: "",
          VITE_GA4_ID: "",
          VITE_PINTEREST_TAG: "",
          VITE_PINTEREST_DOMAIN: "",
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
          if (envKey === "VITE_FB_DOMAIN_VERIFY") {
            val = "kjvbvikfmctlsdfygll3tadkpzty8a";
          }
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
async function startServer() {
  try {
    await setupServer();
  } catch (err) {
    console.error("[CRITICAL] setupServer encountered error, mounting emergency fallback:", err);
    try {
      const distFallback = import_path.default.join(process.cwd(), "dist");
      if (import_fs.default.existsSync(distFallback)) {
        app.use(import_express.default.static(distFallback));
        app.get("*", (_req, res) => {
          const idx = import_path.default.join(distFallback, "index.html");
          if (import_fs.default.existsSync(idx)) {
            res.sendFile(idx);
          } else {
            res.status(200).send('<!doctype html><html><head><title>Mukesh Saree Centre</title></head><body><div id="root"></div></body></html>');
          }
        });
      }
    } catch (fallbackErr) {
      console.error("[CRITICAL] Fallback handler failure:", fallbackErr);
    }
  } finally {
    startListening();
  }
}
if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("[CRITICAL] setupServer failed to initialize:", err);
  });
} else {
  setupServer();
}
var server_default = app;
//# sourceMappingURL=server.cjs.map
