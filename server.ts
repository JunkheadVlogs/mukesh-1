import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

declare const IS_COMPILED_BUNDLE: boolean | undefined;
const isProduction = typeof IS_COMPILED_BUNDLE !== 'undefined' || process.env.NODE_ENV === 'production';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Sw0OjZoidQe04p';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'gswtW1QzFFe7fxP1YJ0EhqRG';
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || process.env.VITE_GOOGLE_SHEETS_URL || process.env.VITE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec';

let razorpayClient: Razorpay | null = null;
try {
  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    razorpayClient = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
} catch (err) {
  console.warn('[SERVER] Razorpay initialization warning:', err);
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Create Razorpay Order
const handleCreateOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    const amountVal = parseFloat(amount);

    if (isNaN(amountVal) || amountVal <= 0) {
      res.status(400).json({ success: false, error: 'Invalid or missing amount' });
      return;
    }

    // Convert amount to paise (if already > 100000 and suspected paise vs rupees, normal flow is rupees)
    const amountInPaise = Math.round(amountVal * 100);

    if (!razorpayClient) {
      res.status(500).json({ success: false, error: 'Payment gateway configuration missing' });
      return;
    }

    const orderOptions = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `RCP_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpayClient.orders.create(orderOptions);

    res.json({
      success: true,
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error('[API] Create Order Error:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to create order with payment gateway',
    });
  }
};

app.post('/api/create-order', handleCreateOrder);
app.post('/api/create-order.php', handleCreateOrder);

// 2. Verify Razorpay Payment Signature
const handleVerifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        error: 'Missing order_id, payment_id, or signature in verification payload',
      });
      return;
    }

    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      res.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        error: 'Invalid signature. Payment verification failed',
      });
    }
  } catch (err: any) {
    console.error('[API] Verify Payment Error:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to verify payment',
    });
  }
};

app.post('/api/verify-payment', handleVerifyPayment);
app.post('/api/verify-payment.php', handleVerifyPayment);

// 3. Submit Order to Google Sheets
app.post('/api/submit-order', async (req: Request, res: Response) => {
  try {
    const orderData = req.body;

    if (!orderData) {
      res.status(400).json({ success: false, error: 'Empty payload' });
      return;
    }

    if (GOOGLE_SHEETS_URL) {
      try {
        const sheetsResponse = await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
        const result = await sheetsResponse.text();
        res.json({ success: true, result });
        return;
      } catch (sheetsErr) {
        console.warn('[API] Google Sheets forward failed:', sheetsErr);
      }
    }

    res.json({ success: true, status: 'received' });
  } catch (err: any) {
    console.error('[API] Submit Order Error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to submit order' });
  }
});

// 4. Capture Lead
app.post('/api/capture-lead', async (req: Request, res: Response) => {
  try {
    const leadData = req.body;
    console.log('[API] Captured Lead:', leadData);

    if (GOOGLE_SHEETS_URL && leadData) {
      fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead',
          ...leadData,
          timestamp: new Date().toISOString(),
        }),
      }).catch((e) => console.warn('[API] Lead forward to Google Sheets failed:', e));
    }

    res.json({ success: true, message: 'Lead captured' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to capture lead' });
  }
});

// 5. Return Request
app.post('/api/return-request', async (req: Request, res: Response) => {
  try {
    const returnData = req.body;
    console.log('[API] Return Request:', returnData);

    if (GOOGLE_SHEETS_URL && returnData) {
      fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'return_request',
          ...returnData,
          timestamp: new Date().toISOString(),
        }),
      }).catch((e) => console.warn('[API] Return request forward failed:', e));
    }

    res.json({ success: true, message: 'Return request submitted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to process return request' });
  }
});

// 6. Health & Metrics Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/sys-metric.php', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// 7. Google Merchant Center Product Feed Endpoints
const serveProductFeedXml = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex');
  const feedFile = path.resolve(process.cwd(), 'public', 'product-feed.xml');
  const distFeedFile = path.resolve(process.cwd(), 'dist', 'product-feed.xml');
  if (fs.existsSync(feedFile)) {
    res.sendFile(feedFile);
  } else if (fs.existsSync(distFeedFile)) {
    res.sendFile(distFeedFile);
  } else {
    res.status(404).send('<!-- product-feed.xml not found -->');
  }
};

const serveProductFeedCsv = (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex');
  const csvFile = path.resolve(process.cwd(), 'public', 'product-feed.csv');
  const distCsvFile = path.resolve(process.cwd(), 'dist', 'product-feed.csv');
  if (fs.existsSync(csvFile)) {
    res.sendFile(csvFile);
  } else if (fs.existsSync(distCsvFile)) {
    res.sendFile(distCsvFile);
  } else {
    res.status(404).send('product-feed.csv not found');
  }
};

app.get(['/product-feed.xml', '/api/product-feed.xml'], serveProductFeedXml);
app.get(['/product-feed.csv', '/api/product-feed.csv'], serveProductFeedCsv);

// ----------------------------------------------------
// FRONTEND SERVING (DEV & PROD)
// ----------------------------------------------------
async function startServer() {
  if (!isProduction) {
    // In development mode, mount Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built dist files
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      // Fallback if dist is missing
      const { createServer } = await import('vite');
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Mukesh Saree Centre server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SERVER] Fatal startup error:', err);
  process.exit(1);
});
