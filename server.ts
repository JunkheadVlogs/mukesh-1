import express from "express";
import path from "path";
import crypto from "crypto";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from 'url';
import https from "https";

// Purge any GitHub tokens from website server runtime environment
delete process.env.GITHUB_TOKEN;
delete process.env.GH_TOKEN;

// Injected by esbuild in scripts/build.js for compiled production bundle
declare const IS_COMPILED_BUNDLE: boolean | undefined;

let _filename = "";
let _dirname = "";
try {
  if (typeof import.meta !== "undefined" && import.meta.url) {
    _filename = fileURLToPath(import.meta.url);
    _dirname = path.dirname(_filename);
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
const currentFilePath = _filename;
const currentDirPath = _dirname;

// Global process error handlers to prevent unhandled errors from crashing Cloud Run
process.on('unhandledRejection', (reason, promise) => {
  console.error('[SERVER] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[SERVER] Uncaught Exception thrown:', error);
});

// Detect compiled production server vs dev server
const isCompiledBundle = typeof IS_COMPILED_BUNDLE !== "undefined" && IS_COMPILED_BUNDLE === true;
const isCompiledCjs = isCompiledBundle ||
  (typeof currentFilePath === "string" && (currentFilePath.endsWith(".cjs") || currentFilePath.includes("dist"))) ||
  (typeof process.argv[1] === "string" && (process.argv[1].endsWith(".cjs") || process.argv[1].includes("dist")));

const distHtmlPath = path.join(process.cwd(), "dist", "index.html");
const isDistReady = fs.existsSync(distHtmlPath);

// Explicit dev command indicator: ONLY when explicitly running with tsx in dev mode and not compiled bundle
const isRunningWithTsx = process.argv.some(arg => arg.includes("tsx")) || process.env.npm_lifecycle_event === "dev";
const isDev = isRunningWithTsx && !isCompiledCjs;

// Production is active ONLY when compiled into dist or in explicit production environment without tsx
const isProduction = !isDev && (isCompiledCjs || process.env.NODE_ENV === "production" || (!!process.env.K_SERVICE && !process.env.K_SERVICE.startsWith("ais-dev-") && !process.env.K_SERVICE.startsWith("ais-pre-")));

if (!isProduction) {
  process.env.NODE_ENV = "development";
} else {
  process.env.NODE_ENV = "production";
}

dotenv.config();

process.env.VITE_FB_DOMAIN_VERIFY = 'kjvbvikfmctlsdfygll3tadkpzty8a';

const app = express();

// Cloud Run injects process.env.PORT (typically 8080) and expects containers to listen on 0.0.0.0:$PORT.
// AI Studio dev container uses port 3000 behind an Nginx reverse proxy listening on 8080.
// To ensure 100% compatibility in both AI Studio dev environment and live Cloud Run production deployments,
// we bind to envPort (if specified) and port 3000, then 8080.
function startListening() {
  const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : NaN;
  const portsToListen: number[] = [];

  if (!isNaN(envPort) && envPort > 0) {
    portsToListen.push(envPort);
  }
  if (!portsToListen.includes(3000)) {
    portsToListen.push(3000);
  }
  if (!portsToListen.includes(8080)) {
    portsToListen.push(8080);
  }

  const servers: any[] = [];

  for (const port of portsToListen) {
    try {
      const server = app.listen(port, "0.0.0.0", () => {
        console.log(`[SERVER] Active and listening on http://0.0.0.0:${port} (${isProduction ? "production" : "development"})`);
      });

      // Keep connection timeouts slightly above Google Cloud Run load balancer's 60-second idle timeout
      server.keepAliveTimeout = 65000;
      server.headersTimeout = 66000;

      server.on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          // Expected when another process/proxy is already bound to this port.
          console.log(`[SERVER] Port ${port} is occupied (expected if reverse proxy is running on this port).`);
        } else {
          console.error(`[SERVER] Error on port ${port}:`, err);
        }
      });

      servers.push(server);
    } catch (e: any) {
      console.warn(`[SERVER] Could not bind to port ${port}:`, e.message);
    }
  }

  return servers;
}

// Global exception safety to prevent container crashes on transient errors
process.on('uncaughtException', (err) => {
  console.error('[SERVER] Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[SERVER] Unhandled rejection at:', promise, 'reason:', reason);
});

// Graceful container shutdown handlers for Cloud Run
process.on('SIGTERM', () => {
  console.log('[SERVER] SIGTERM received, exiting cleanly...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[SERVER] SIGINT received, exiting cleanly...');
  process.exit(0);
});

// Immediate health check endpoints for Cloud Run container probes
app.get(["/api/health", "/health", "/_ah/health", "/healthz"], (req, res) => {
  res.status(200).json({ status: "ok", mode: isProduction ? "production" : "development", timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
  const logStr = `[${new Date().toISOString()}] ${req.method} ${req.url} (User-Agent: ${req.headers['user-agent']})\n`;
  try {
    fs.appendFileSync(path.join(process.cwd(), "requests.log"), logStr, "utf-8");
  } catch (err) {}
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

// Additional explicit CORS header fallback to prevent any CORS issues across domains
app.use((req, res, next) => {
  const origin = req.headers.origin || "https://mukeshsarees.com";
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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

const KNOWN_LIVE_KEY_ID = "rzp_live_Sw0OjZoidQe04p";
const KNOWN_LIVE_KEY_SECRET = "gswtW1QzFFe7fxP1YJ0EhqRG";

function getActiveRazorpayCredentials() {
  let keyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "").trim();
  let keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

  // If environment has the revoked key or placeholder or is empty, use verified live credentials
  if (!keyId || !keySecret || keyId === "rzp_live_Slf11Odg572QOq" || keyId === "your_razorpay_key_id") {
    keyId = KNOWN_LIVE_KEY_ID;
    keySecret = KNOWN_LIVE_KEY_SECRET;
  }
  return { keyId, keySecret };
}

const { keyId: RAZORPAY_KEY_ID, keySecret: RAZORPAY_KEY_SECRET } = getActiveRazorpayCredentials();

let razorpay = null;
try {
  razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
} catch (e) {
  console.log("Could not initialize razorpay", e);
}

// API Routes
const apiRouter = express.Router();

// Simple endpoint to catch client-side browser logs and console errors
apiRouter.post("/browser-log", (req, res) => {
  try {
    const { type, messages, timestamp } = req.body;
    const msgStr = Array.isArray(messages) ? messages.join(" ") : String(messages);
    console.log(`[CLIENT-SIDE ${String(type).toUpperCase()}] [${timestamp}]`, msgStr);
    
    // Append to file for easy deep dive reading
    const logLine = `[${timestamp}] [${String(type).toUpperCase()}] ${msgStr}\n`;
    fs.appendFileSync(path.join(process.cwd(), "browser.log"), logLine, "utf-8");
  } catch (err) {
    // Ignore logging errors to prevent loops
  }
  res.sendStatus(200);
});

// ==== capture lead to firestore and trigger whatsapp via interakt ====
apiRouter.post("/capture-lead", async (req, res) => {
  try {
    const { name, phone, source, page } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, error: "Missing required WhatsApp phone number" });
    }

    const cleanPhone = phone.toString().replace(/\D/g, '');
    const finalPhone = cleanPhone.length === 12 && cleanPhone.startsWith('91') ? cleanPhone.substring(2) : cleanPhone;

    console.log(`[ROUTE-CAPTURE-LEAD] Processing lead: +91${finalPhone}`);

    // Lazy load firebase-admin to prevent startup crashes if key is empty/absent
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
        await admin.default.firestore().collection('exit_intent_leads').add({
          name: name || '',
          phone: `+91${finalPhone}`,
          source: source || 'Exit Intent Popup',
          page: page || 'N/A',
          capturedAt: new Date().toISOString(),
          discountCode: 'VIPCLUB60',
          converted: false
        });
        firestoreSaved = true;
        console.log('[ROUTE-CAPTURE-LEAD] Save to Firestore successful.');
      } catch (dbErr) {
        console.error('[ROUTE-CAPTURE-LEAD] Error saving to Firestore:', dbErr);
      }
    } else {
      console.warn('[ROUTE-CAPTURE-LEAD] FIREBASE_SERVICE_ACCOUNT not configured, skipping Firestore.');
    }

    // Trigger Interakt WA Template
    let whatsappSent = false;
    const interaktKey = process.env.INTERAKT_API_KEY;
    if (interaktKey) {
      try {
        const response = await fetch('https://api.interakt.ai/v1/public/message/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${interaktKey}`
          },
          body: JSON.stringify({
            countryCode: '+91',
            phoneNumber: finalPhone,
            callbackData: 'exit_intent',
            type: 'Template',
            template: {
              name: 'exit_intent_discount',
              languageCode: 'en',
              bodyValues: ['MUKESH150', '₹150', '24 hours']
            }
          })
        });
        console.log(`[ROUTE-CAPTURE-LEAD] Interakt response status: ${response.status}`);
        whatsappSent = response.ok;
      } catch (waErr) {
        console.error('[ROUTE-CAPTURE-LEAD] Error triggering Interakt:', waErr);
      }
    } else {
      console.warn('[ROUTE-CAPTURE-LEAD] INTERAKT_API_KEY not configured, skipping WhatsApp sending.');
    }

    res.json({
      success: true,
      firestoreSaved,
      whatsappSent,
      message: 'Lead captured successfully'
    });

  } catch (err: any) {
    console.error("[ROUTE-CAPTURE-LEAD] Error processing capture lead:", err);
    res.status(500).json({ success: false, error: err?.message || 'Internal server error' });
  }
});

// ==== google sheets submission proxy ====
apiRouter.post("/submit-order", async (req, res) => {
  try {
    const rawUrl = process.env.VITE_GOOGLE_SHEETS_URL || process.env.VITE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec';
    const urlStr = rawUrl.trim().replace(/^['"]|['"]$/g, '');

    // Normalize exit lead payload aliases
    const isExitLead = req.body.type === 'exit_lead' ||
                       req.body.leadSource === 'Exit Intent Popup' ||
                       req.body.source === 'Exit Intent Popup' ||
                       req.body.source === 'Popup';
    if (isExitLead) {
      req.body.type = 'exit_lead';
      const leadName = req.body.name || req.body.firstName || req.body.fullName || req.body.customerName || '';
      const leadPhone = req.body.phone || req.body.mobileNumber || req.body.contact || '';
      req.body.name = leadName;
      req.body.firstName = leadName;
      req.body.fullName = leadName;
      req.body.phone = leadPhone;
      req.body.mobileNumber = leadPhone;
      req.body.couponCode = req.body.couponCode || req.body.couponUsed || 'VIPCLUB60';
      req.body.couponUsed = req.body.couponCode;
    }

    console.log(`[PAYMENT ACTION LOG] [SERVER] Order Submission update. Order ID: ${req.body.orderId || 'no-id'}, Status: ${req.body.status || 'N/A'}, Payment Status: ${req.body.paymentStatus || 'N/A'}`);
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

// ==== return request handler ====
apiRouter.post("/return-request", async (req, res) => {
  try {
    const { orderId, fullName, phone, reason, comments } = req.body;

    if (!orderId || !fullName || !phone || !reason) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const cleanPhone = phone.toString().replace(/\D/g, '');
    const finalPhone = cleanPhone.length === 12 && cleanPhone.startsWith('91') ? cleanPhone.substring(2) : cleanPhone;
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
        await admin.default.firestore().collection('return_requests').add({
          orderId,
          fullName,
          phone: phoneWithPrefix,
          reason,
          comments: comments || "",
          submittedAt: new Date().toISOString(),
          status: "Pending"
        });
        firestoreSaved = true;
        console.log('[ROUTE-RETURN-REQUEST] Save to Firestore successful.');
      } catch (dbErr) {
        console.error('[ROUTE-RETURN-REQUEST] Error saving to Firestore:', dbErr);
      }
    } else {
      console.warn('[ROUTE-RETURN-REQUEST] FIREBASE_SERVICE_ACCOUNT not configured, skipping Firestore.');
    }

    // Proxy/Forward to Google Sheets
    let sheetsSaved = false;
    const rawUrl = process.env.VITE_GOOGLE_SHEETS_URL || process.env.VITE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec';
    const urlStr = rawUrl.trim().replace(/^['"]|['"]$/g, '');
    
    if (urlStr) {
      try {
        const postData = JSON.stringify({
          type: 'return_request',
          orderId,
          fullName,
          phone: phoneWithPrefix,
          reason,
          comments: comments || "",
          submittedAt: new Date().toISOString(),
          device: /Mobi|Android/i.test(String(req.headers['user-agent'] || "")) ? 'Mobile' : 'Desktop'
        });

        const { URL } = await import('url');
        const makeSheetsRequest = async (urlString: string) => {
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
              if (resHttp.statusCode === 302 && resHttp.headers.location) {
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

        await makeSheetsRequest(urlStr);
        sheetsSaved = true;
        console.log('[ROUTE-RETURN-REQUEST] Forwarded to Google Sheets successfully.');
      } catch (sheetsErr) {
        console.error('[ROUTE-RETURN-REQUEST] Error sending to Google Sheets:', sheetsErr);
      }
    }

    res.json({
      success: true,
      firestoreSaved,
      sheetsSaved,
      message: 'Return request submitted successfully'
    });

  } catch (err: any) {
    console.error("[ROUTE-RETURN-REQUEST] Error processing return request:", err);
    res.status(500).json({ success: false, error: err?.message || 'Internal server error' });
  }
});

// ==== razorpay order creation ====
apiRouter.post(['/create-razorpay-order', '/create-order'], async (req, res) => {
  try {
    let { keyId: currentKeyId, keySecret: currentKeySecret } = getActiveRazorpayCredentials();
    
    const keyMode = currentKeyId.startsWith("rzp_test_") ? "TEST MODE" : "LIVE MODE";
    const clientOrderId = req.body.notes?.order_id || "N/A";
    const clientAmount = req.body.amount || "N/A";
    console.log(`[PAYMENT ACTION LOG] [SERVER] Starting Razorpay order creation. Client Order ID: ${clientOrderId}, Amount: INR ${clientAmount}, Mode: ${keyMode}`);

    const rawAmount = req.body.amount;
    if (rawAmount === undefined || rawAmount === null || isNaN(Number(rawAmount))) {
      return res.status(400).json({ success: false, error: "Invalid amount specified. Amount must be a valid number." });
    }

    const isAlreadyPaise = req.body.isPaise || (Number(rawAmount) > 50000);
    let finalAmount = isAlreadyPaise ? Math.round(Number(rawAmount)) : Math.round(Number(rawAmount) * 100);

    // Guarantee amount is positive integer and minimum is 100 paise (= ₹1)
    if (finalAmount < 100) {
      finalAmount = 100;
    }

    const options = {
      amount: finalAmount,
      currency: req.body.currency || 'INR',
      receipt: req.body.receipt || `receipt_${Date.now()}`,
      notes: req.body.notes || {}
    };

    let rzp = new Razorpay({
      key_id: currentKeyId,
      key_secret: currentKeySecret,
    });

    let order;
    let actualKeyId = currentKeyId;

    try {
      console.log(`[PAYMENT ACTION LOG] [SERVER] Creating order with parameters:`, JSON.stringify(options));
      order = await rzp.orders.create(options);
    } catch (createErr: any) {
      // If primary credentials fail authentication, retry seamlessly with verified live credentials
      const isAuthError = createErr?.statusCode === 401 || createErr?.error?.description === 'Authentication failed';
      if (isAuthError && currentKeyId !== KNOWN_LIVE_KEY_ID) {
        console.warn(`[PAYMENT ACTION LOG] [SERVER] Primary Razorpay credentials failed (401). Retrying with active live credentials...`);
        rzp = new Razorpay({
          key_id: KNOWN_LIVE_KEY_ID,
          key_secret: KNOWN_LIVE_KEY_SECRET,
        });
        order = await rzp.orders.create(options);
        actualKeyId = KNOWN_LIVE_KEY_ID;
      } else {
        throw createErr;
      }
    }

    console.log(`[PAYMENT ACTION LOG] [SERVER] Razorpay order created successfully on gateway. Server Order ID: ${order.id}`);
    
    // Return key back to prevent client/server key mismatch
    res.json({
      ...order,
      orderId: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: actualKeyId
    });
  } catch (err: any) {
    console.error('Razorpay error:', err?.message, err?.statusCode, err?.error);
    console.error("[RAZORPAY ERROR] Detailed Razorpay Error (create-order):", {
      message: err?.message,
      statusCode: err?.statusCode,
      errorDetails: err?.error,
      fullError: err
    });
    const errorMessage = err?.error?.description || err?.message || "Failed to create order";
    res.status(500).json({
      success: false,
      error: errorMessage === 'Authentication failed' ? 'Razorpay Authentication failed. Please check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' : errorMessage
    });
  }
});

// ==== razorpay payment verification ====
apiRouter.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log(`[PAYMENT ACTION LOG] [SERVER] Payment verification request received. Razorpay Order ID: ${razorpay_order_id}, Payment ID: ${razorpay_payment_id}`);
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const { keySecret: currentKeySecret } = getActiveRazorpayCredentials();

    const expectedSign = crypto.createHmac("sha256", currentKeySecret)
                               .update(sign.toString())
                               .digest("hex");
    
    let isMatch = (razorpay_signature === expectedSign);
    if (!isMatch && currentKeySecret !== KNOWN_LIVE_KEY_SECRET) {
      const fallbackSign = crypto.createHmac("sha256", KNOWN_LIVE_KEY_SECRET)
                                 .update(sign.toString())
                                 .digest("hex");
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

// ==== Meta Conversions API (CAPI) ====
apiRouter.post(["/meta-capi", "/sys-metric"], async (req, res) => {
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

    const cleanEmail = (em) => {
      if (!em) return undefined;
      const val = em.toString().trim().toLowerCase();
      if (
        val === 'info.mukeshsareecentre@gmail.com' ||
        val === 'info@mukeshsarees.com' ||
        val === 'test@gmail.com' ||
        val === 'test@example.com' ||
        val === 'example@example.com' ||
        val.includes('mukeshsaree')
      ) {
        return undefined;
      }
      return val;
    };

    const cleanPhone = (ph) => {
      if (!ph) return undefined;
      let digits = ph.toString().replace(/\D/g, '');
      if (
        digits === '9170206646' ||
        digits === '917020664641' ||
        digits === '7020664641' ||
        digits === '1234567890' ||
        digits === '9999999999' ||
        digits === '0000000000' ||
        digits.length < 10
      ) {
        return undefined;
      }
      if (digits.length === 10) {
        digits = '91' + digits; // default to India prefix
      }
      return digits;
    };

    let finalSourceUrl = event_source_url || "";
    if (finalSourceUrl) {
      try {
        const parsedUrl = new URL(finalSourceUrl);
        if (parsedUrl.hostname.includes('run.app') || parsedUrl.hostname.includes('localhost') || parsedUrl.hostname.includes('127.0.0.1')) {
          parsedUrl.hostname = 'mukeshsarees.com';
          parsedUrl.protocol = 'https:';
          parsedUrl.port = '';
        }
        finalSourceUrl = parsedUrl.toString();
      } catch (e) {
        if (finalSourceUrl.startsWith('/')) {
          finalSourceUrl = `https://mukeshsarees.com${finalSourceUrl}`;
        }
      }
    }

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
    if (!finalFbc && finalSourceUrl) {
      try {
        const parsedUrl = new URL(finalSourceUrl);
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
      userDataObj.external_id = providedUserData.external_id.toString().trim();
    }

    // Standardize hashing for multiple fields to optimize match quality
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
      userDataObj.country = [helperHash('in')]; // Default to India country identifier
    }

    const eventData = {
      event_name: event_name || 'Purchase',
      event_time: currentTimestamp,
      event_id: event_id,
      action_source: "website",
      event_source_url: finalSourceUrl || req.headers.referer || "https://mukeshsarees.com/",
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

const getWhatsAppSafeServerImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://mukeshsarees.com/og-image.jpg';
  
  let targetUrl = imageUrl;
  
  if (imageUrl.includes('wsrv.nl')) {
    const match = imageUrl.match(/[?&]url=([^&]+)/);
    if (match) {
      targetUrl = decodeURIComponent(match[1]);
    }
  }

  return `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=1200&h=630&fit=cover&a=center&output=jpg&q=90`;
};

const getSquareServerImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://mukeshsarees.com/og-image.jpg';
  
  let targetUrl = imageUrl;
  
  if (imageUrl.includes('wsrv.nl')) {
    const match = imageUrl.match(/[?&]url=([^&]+)/);
    if (match) {
      targetUrl = decodeURIComponent(match[1]);
    }
  }

  return `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=1200&h=1200&fit=contain&cbg=ffffff&output=jpg&q=90`;
};

const getWhatsAppSafeServerDescription = (text, productContext) => {
  if (!text) return "Shop premium Indian ethnic wear, sarees, and linen collections at Mukesh Saree Centre.";
  
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
};

const injectOGTags = (html, reqPath, originalUrl) => {
  let ogTitle = "Mukesh Saree Centre | Wholesale & Retail Sarees Since 1978";
  let ogDesc = "🏬 Wholesale & Retail Sarees Since 1978 | 📦 Bulk Orders & Single Pieces | 💵 COD Available | 🚚 Free Shipping | Nagpur";
  
  const defaultBannerUrl = "https://mukeshsarees.com/og-image.jpg";
  // Fallback banner optimized to 1200x630 landscape JPG for standard page sharing
  let ogImg = defaultBannerUrl;
  let ogUrl = "https://mukeshsarees.com" + originalUrl;
  if (!ogUrl.endsWith('/')) {
    ogUrl += '/';
  }
  let price = "";
  let isProduct = false;
  let ogWidth = "1200";
  let ogHeight = "630";
  
  const productMatch = reqPath.match(/^\/product\/([^\/]+)\/?$/);
  if (productMatch) {
    const slug = productMatch[1].trim().toLowerCase();
    const prod = preParsedProducts.find(p => p.slug && p.slug.trim().toLowerCase() === slug);
    if (prod) {
      ogTitle = `${prod.name} | Mukesh Saree Centre`;
      
      const fabricItem = prod.fabric ? `✨ ${prod.fabric}` : "✨ Premium Fabric";
      const discountPercent = (prod.originalPrice && prod.price && prod.originalPrice > prod.price)
        ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
        : null;
      const priceText = discountPercent 
        ? `💰 ₹${prod.price} (${discountPercent}% OFF)` 
        : `💰 ₹${prod.price}`;
        
      ogDesc = `${fabricItem} | 🚚 Free Shipping | 💵 COD Available | ${priceText} | 🏬 Trusted Since 1978`;
 
      // Serve dedicated social sharing portrait image
      ogImg = `https://mukeshsarees.com/og-images/${prod.slug}.jpg`;
      ogWidth = "800";
      ogHeight = "1200";
      price = prod.price || "0";
      isProduct = true;
    }
  } else if (reqPath.startsWith('/shop')) {
    ogTitle = "Shop Sarees, Linen Sarees & Ethnic Wear — Mukesh Saree Centre";
    ogDesc = "Browse 50+ premium sarees, linen sarees, silks and lehengas. Cash on Delivery available. Free shipping above ₹499. Trusted since 1978.";
    ogImg = defaultBannerUrl;
  } else if (
    reqPath.startsWith('/wholesalesarees') ||
    reqPath.startsWith('/wholesale-sarees') ||
    reqPath.startsWith('/wholesale')
  ) {
    ogTitle = "Wholesale Sarees VIP Club — Mukesh Saree Centre Nagpur";
    ogDesc = "🏬 Exclusive Saree Wholesaler in Nagpur Since 1978 | 📦 Daily Catalog & Bulk Dealer Rates | 📲 Join WhatsApp VIP Club | 🚚 Pan-India Delivery";
    ogImg = "https://mukeshsarees.com/og-images/wholesale-vip-club.jpg";
    ogUrl = "https://mukeshsarees.com/wholesalesarees/";
    ogWidth = "1200";
    ogHeight = "630";
  } else if (reqPath.startsWith('/uniform-saree-bulk-orders')) {
    ogTitle = "Uniform Sarees & Bulk Orders — Mukesh Saree Centre Nagpur";
    ogDesc = "Wholesale uniform sarees for schools, colleges, institutions & events. Direct weaver pricing, custom design & pan-India delivery.";
    ogImg = defaultBannerUrl;
  } else if (reqPath.startsWith('/contact')) {
    ogTitle = "Contact Us";
    ogDesc = "Contact Mukesh Saree Centre, Gandhibagh Nagpur. Call +91 7020664641. Open 11:30AM–9:30PM (closed Mondays). Bridal saree bookings, custom orders welcome.";
  } else if (reqPath.startsWith('/return-policy')) {
    ogTitle = "Returns & Exchanges";
    ogDesc = "Mukesh Saree Centre return policy — 7-day returns on all products. Refund via UPI/Bank Transfer within 3-5 business days. Easy hassle-free process.";
  }

  const defaultOgBlockRegex = /<!-- Default OG Tags -->[\s\S]*?<!-- End Default OG Tags -->/;

  let dynamicTags = `<!-- Dynamic OG Tags -->
     <meta property="og:title" content="${ogTitle}" />
     <meta property="og:description" content="${ogDesc}" />
     <meta property="og:image" content="${ogImg}" />
     <meta property="og:image:secure_url" content="${ogImg}" />
     <meta property="og:url" content="${ogUrl}" />
     <meta property="og:type" content="${isProduct ? 'product' : 'website'}" />
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
  
  // Replace standard title tag
  injectedHtml = injectedHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${ogTitle}</title>`
  );

  // Replace standard meta description
  injectedHtml = injectedHtml.replace(
    /<meta (?:data-rh="[^"]*"\s+)?name="description" content="[^"]*"\s*\/?>/,
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

app.get('/og-images/:slug.jpg', (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    return res.redirect(302, 'https://mukeshsarees.com/og-image.jpg');
  }
  const cleanSlug = slug.replace(/\.jpg$/, '').trim().toLowerCase();
  
  // Define storage paths
  const publicOgDir = path.join(process.cwd(), 'public', 'og-images');
  const distOgDir = path.join(process.cwd(), 'dist', 'og-images');
  const destPublicFile = path.join(publicOgDir, `${cleanSlug}.jpg`);
  const destDistFile = path.join(distOgDir, `${cleanSlug}.jpg`);
  
  // 1. If file already exists in cache, serve it directly and immediately
  if (fs.existsSync(destDistFile)) {
    return res.sendFile(destDistFile);
  } else if (fs.existsSync(destPublicFile)) {
    return res.sendFile(destPublicFile);
  }
  
  const prod = preParsedProducts.find(p => p.slug && p.slug.trim().toLowerCase() === cleanSlug);
  if (prod) {
    let targetUrl = prod.image || 'https://mukeshsarees.com/og-image.jpg';
    if (targetUrl.includes('wsrv.nl')) {
      const match = targetUrl.match(/[?&]url=([^&]+)/);
      if (match) {
        targetUrl = decodeURIComponent(match[1]);
      }
    }
    
    if (!targetUrl.startsWith('http')) {
      targetUrl = `https://mukeshsarees.com/${targetUrl.replace(/^\/+/, '')}`;
    }
    
    const finalUrl = `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=800&h=1200&fit=contain&cbg=ffffff&output=jpg&q=85`;
    
    // 2. Perform non-blocking background fetch & cache to avoid delaying the response
    try {
      if (!fs.existsSync(publicOgDir)) {
        fs.mkdirSync(publicOgDir, { recursive: true });
      }
      if (!fs.existsSync(distOgDir)) {
        fs.mkdirSync(distOgDir, { recursive: true });
      }
      
      fetch(finalUrl)
        .then(async (response) => {
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            fs.writeFileSync(destPublicFile, buffer);
            fs.writeFileSync(destDistFile, buffer);
            console.log(`[LAZY-OG] Cached image for product slug: ${cleanSlug}`);
          }
        })
        .catch(err => {
          console.warn(`[LAZY-OG] Failed to cache image background: ${cleanSlug}`, err);
        });
    } catch (fsError) {
      console.warn(`[LAZY-OG] Error setting up local directories`, fsError);
    }
    
    // 3. Immediately redirect the caller for instantaneous response
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.redirect(302, finalUrl);
  }
  
  res.redirect(302, 'https://mukeshsarees.com/og-image.jpg');
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  const distRobotsPath = path.join(process.cwd(), 'dist', 'robots.txt');
  const publicRobotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(distRobotsPath)) {
    return res.sendFile(distRobotsPath);
  } else if (fs.existsSync(publicRobotsPath)) {
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

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  const sitemapPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
  const publicSitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    return res.sendFile(sitemapPath);
  } else if (fs.existsSync(publicSitemapPath)) {
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
  // 1. Explicitly bypass any application-level cookie/auth checks for social bots and AI search crawlers
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
      'googlebot',
      'oai-searchbot',
      'gptbot',
      'chatgpt',
      'chatgpt-user',
      'perplexity',
      'perplexitybot',
      'claude',
      'claudebot',
      'anthropic',
      'bingbot',
      'msnbot',
      'google-extended',
      'googleother',
      'bytespider',
      'cohere',
      'diffbot',
      'applebot',
      'meta-externalagent',
      'amazonbot',
      'bot',
      'crawler',
      'spider',
      'slurp',
      'duckduckbot',
      'baiduspider',
      'yandexbot'
    ].some(bot => userAgent.includes(bot));
    
    if (isBot) {
      req.isBot = true;
      // Skip any potential auth middlewares running afterwards
    }
    next();
  });

  if (!isProduction && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      // Prevent returning HTML for missing JS/TS/CSS/image/font assets which causes hydration/import errors
      if (req.path.match(/\.(js|ts|tsx|jsx|css|scss|json|map|png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|eot)$/) || req.query.t) {
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
    let distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath) && typeof currentDirPath !== 'undefined') {
      if (fs.existsSync(path.join(currentDirPath, 'dist'))) {
        distPath = path.join(currentDirPath, 'dist');
      } else if (currentDirPath.endsWith('dist') && fs.existsSync(path.join(currentDirPath, 'index.html'))) {
        distPath = currentDirPath;
      }
    }
    const indexPath = path.join(distPath, 'index.html');
    
    app.use(express.static(distPath, { 
      index: false,
      maxAge: '1y', // Default fallback cache of 1 year for static assets
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else if (filePath.match(/\.(js|css|woff|woff2|ttf|otf|eot|png|jpg|jpeg|gif|svg|webp|avif|ico|json)$/)) {
          // Both content-hashed bundles and other static assets are safe to cache forever immutably
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    
    app.get('*', (req, res) => {
      // Prevent returning HTML for missing assets
      if (req.path.match(/\.(js|ts|tsx|jsx|css|scss|json|map|png|jpg|jpeg|gif|svg|webp)$/)) {
        return res.status(404).send('Asset not found');
      }

      try {
        const isBot = (req as any).isBot;
        let selectedIndexPath = indexPath;

        if (!isBot) {
          // For human users, use the clean React shell index-clean.html to ensure zero flickers or layout/hydration mismatches
          const cleanPath = path.join(distPath, 'index-clean.html');
          if (fs.existsSync(cleanPath)) {
            selectedIndexPath = cleanPath;
          }
        } else {
          // For SEO crawler bots, serve the correct pre-rendered page if exists
          const cleanReqPath = req.path.replace(/^\/+|\/+$/g, '');
          if (cleanReqPath) {
            const specificPrerenderedPath = path.join(distPath, cleanReqPath, 'index.html');
            if (fs.existsSync(specificPrerenderedPath)) {
              selectedIndexPath = specificPrerenderedPath;
            }
          }
        }

        if (!fs.existsSync(selectedIndexPath)) {
          selectedIndexPath = indexPath;
        }

        if (!fs.existsSync(selectedIndexPath)) {
          return res.status(200).set({ 'Content-Type': 'text/html' }).send('<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Mukesh Saree Centre</title></head><body><div id="root"></div></body></html>');
        }
        let html = fs.readFileSync(selectedIndexPath, 'utf-8');
        // Substitute %VITE_...% style placeholders with process.env properties for runtime environment injection
        const fallbacks = {
          VITE_META_PIXEL_ID: '1458541922085984',
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

        html = html.replace(/%VITE_([A-Z0-9_]+)%/g, (match, key) => {
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

async function startServer() {
  try {
    await setupServer();
  } catch (err) {
    console.error("[CRITICAL] setupServer encountered error, mounting emergency fallback:", err);
    try {
      const distFallback = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distFallback)) {
        app.use(express.static(distFallback));
        app.get('*', (_req, res) => {
          const idx = path.join(distFallback, 'index.html');
          if (fs.existsSync(idx)) {
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
  // Synchronous execution for Vercel
  setupServer();
}

// Export for Vercel serverless environment
export default app;
