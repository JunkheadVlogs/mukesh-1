import express from "express";
import path from "path";
import crypto from "crypto";

const app = express();
const PORT = process.env.NODE_ENV === "production" ? (process.env.PORT ? parseInt(process.env.PORT) : 3000) : 3000;

app.use(express.json());

// Helper to hash user data as required by Meta Conversions API (SHA-256)
function hashUserData(value: string | undefined): string | null {
  if (!value) return null;
  const cleanVal = value.trim().toLowerCase();
  if (!cleanVal) return null;
  return crypto.createHash("sha256").update(cleanVal).digest("hex");
}

// Route to trigger Meta Conversions API (CAPI) events securely from server-side
app.post("/api/track-event", async (req, res) => {
  try {
    const { eventName, eventId, eventSourceUrl, userData, customData } = req.body;

    const pixelId = process.env.META_PIXEL_ID || "1458541922085984";
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!accessToken) {
      console.warn("[Meta CAPI] Skipping tracking: META_ACCESS_TOKEN is missing in environment variables.");
      return res.json({ status: "success", info: "CAPI disabled: token missing" });
    }

    const hashedEmail = hashUserData(userData?.email);
    const hashedPhone = hashUserData(userData?.phone);
    // Hash first name or full name
    const hashedName = hashUserData(userData?.name);

    // Meta CAPI request body
    const eventData = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId || `ev_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      action_source: "website",
      event_source_url: eventSourceUrl || "https://mukeshsarees.com/",
      user_data: {
        fn: hashedName ? [hashedName] : [],
        ph: hashedPhone ? [hashedPhone] : [],
        em: hashedEmail ? [hashedEmail] : [],
        client_ip_address: req.ip || undefined,
        client_user_agent: req.headers["user-agent"] || undefined,
      },
      custom_data: customData || undefined,
    };

    const capiUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

    const response = await fetch(capiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [eventData] }),
    });

    const body = await response.json() as { error?: { message: string } };

    if (!response.ok) {
      console.error("[Meta CAPI Error]", body.error || body);
      return res.status(500).json({ status: "error", message: body.error?.message || "CAPI request failed" });
    }

    console.log(`[Meta CAPI Success] Tracked event: ${eventName}, ID: ${eventId}`);
    return res.json({ status: "success", eventId: eventData.event_id });
  } catch (error: Error | unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Meta CAPI Fallback Catch]", errorMsg);
    // Graceful fallback so it never crashes client flows
    return res.json({ status: "success", info: "Gracefully bypassed", error: errorMsg });
  }
});

// Submit Order proxy route that forwards orders to Google Sheets and registers purchase tracking
app.post("/api/submit-order", async (req, res) => {
  try {
    const orderData = req.body;
    const sheetsUrl = process.env.VITE_SHEETS_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec";

    console.log("[Server Order Submit] Forwarding to Google sheets script...");
    
    // Send to Google Sheets Webhook
    const sheetsResponse = await fetch(sheetsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    const text = await sheetsResponse.text();
    console.log("[Server Order Submit] Sheets Response:", text);

    return res.json({ status: "success", response: text });
  } catch (error: Error | unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Server Order Submit Error]", errorMsg);
    // Fallback indicator so front-end does direct client-side script push if proxy crashes
    return res.status(502).json({ status: "fallback", message: errorMsg });
  }
});

// Setup Vite development middleware or static production serve
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR proxy middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving compiled production assets from dist/ folder...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Dev Server beautifully running at http://localhost:${PORT}`);
  });
}

startServer();
