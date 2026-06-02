# Deployment on Vercel or Render

## Vercel Deployment (Recommended)

This project is configured out-of-the-box for Vercel. 
The backend Express app will be treated securely as Serverless Functions, and the React frontend will act as a static site.

### Steps:
1. Ensure your `vercel.json` and `server.js` are pushed to your Git repository holding the code.
2. In Vercel, import your Github repository.
3. Add the following **Environment Variables** in the Vercel dashboard:
   - `RAZORPAY_KEY_ID`: Your live Razorpay Key
   - `RAZORPAY_KEY_SECRET`: Your live Razorpay Secret
   - `VITE_RAZORPAY_KEY`: (same as RAZORPAY_KEY_ID above)
   *Note: Never prefix sensitive secret keys with `VITE_`*
4. Click **Deploy**. Vercel will process the `/api/` endpoints completely independently, eliminating CORS and Vite SPA conflict issues.

## Render Deployment

This project gracefully falls back to a long-running Node HTTP Server on Render without requiring custom configurations.

### Steps:
1. Make sure your "Build Command" is set exactly to: `npm install && npm run build`
2. Setting "Start Command" should be explicitly `npm start`
3. Enter environment variables as provided above.
4. Your endpoints will become active on `https://your-domain.render.com` 

## Explanation of Fixes applied:
- The backend API receives JSON POSTs and answers securely.
- Exported the Express object at root level to map elegantly into `@vercel/node` handler architecture.
- Added client-side catch guards against mismatched Vercel fallback router `<!doctype html>` injections with proper JSON parsing and exception raising.
