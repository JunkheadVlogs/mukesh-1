import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Robust default fallbacks for analytics, tracking, domain verification and site routing.
  // This satisfies Cause B by hardcoding fallbacks in vite.config.ts define block 
  // while keeping them fully overridable when .env or environment variables are supplied.
  const fallbacks: Record<string, string> = {
    VITE_META_PIXEL_ID: '3834311026859384',
    VITE_FB_DOMAIN_VERIFY: 'your_fb_domain_verify_token',
    VITE_GTM_ID: 'GTM-WMG3G6SM',
    VITE_GA4_ID: 'G_GA4_MEASUREMENT_ID',
    VITE_PINTEREST_TAG: 'your_pinterest_tag_id',
    VITE_PINTEREST_DOMAIN: '5099ed06768c1b801e53b45489b5bf2d',
    VITE_RAZORPAY_KEY_ID: 'rzp_live_Sw0OjZoidQe04p',
    VITE_WHATSAPP_NUMBER: '917020664641',
    VITE_SHEETS_WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec',
    VITE_GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec',
    VITE_SITE_URL: 'https://mukeshsarees.com',
    VITE_SITE_NAME: 'Mukesh Saree Centre',
    VITE_STORE_PHONE: '+91 7020664641',
  };

  return {
    root: '.',
    base: '/',
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(/%VITE_([A-Z0-9_]+)%/g, (match, key) => {
            const envKey = `VITE_${key}`;
            let val = env[envKey] || process.env[envKey];
            if (key === 'GA4_ID' && !val) {
              val = env.VITE_GA_MEASUREMENT_ID || process.env.VITE_GA_MEASUREMENT_ID || env.VITE_GA4_ID || process.env.VITE_GA4_ID;
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
                strVal === 'G_GA4_MEASUREMENT_ID'
              ) {
                return '';
              }
              return strVal;
            }
            return '';
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      __META_PIXEL_ID__: JSON.stringify(env.VITE_META_PIXEL_ID || fallbacks.VITE_META_PIXEL_ID),
      __GTM_ID__: JSON.stringify(env.VITE_GTM_ID || fallbacks.VITE_GTM_ID),
      __RAZORPAY_KEY__: JSON.stringify(env.VITE_RAZORPAY_KEY_ID || fallbacks.VITE_RAZORPAY_KEY_ID),
      __WHATSAPP_NUMBER__: JSON.stringify(env.VITE_WHATSAPP_NUMBER || fallbacks.VITE_WHATSAPP_NUMBER),
      __SHEETS_URL__: JSON.stringify(env.VITE_SHEETS_WEBHOOK_URL || fallbacks.VITE_SHEETS_WEBHOOK_URL),
      __SITE_URL__: JSON.stringify(env.VITE_SITE_URL || fallbacks.VITE_SITE_URL),
      
      // Explicitly define client-side import.meta.env variables so they compile statically of fallback defaults
      'import.meta.env.VITE_META_PIXEL_ID': JSON.stringify(env.VITE_META_PIXEL_ID || fallbacks.VITE_META_PIXEL_ID),
      'import.meta.env.VITE_FB_DOMAIN_VERIFY': JSON.stringify(env.VITE_FB_DOMAIN_VERIFY || fallbacks.VITE_FB_DOMAIN_VERIFY),
      'import.meta.env.VITE_GTM_ID': JSON.stringify(env.VITE_GTM_ID || fallbacks.VITE_GTM_ID),
      'import.meta.env.VITE_GA4_ID': JSON.stringify(env.VITE_GA_MEASUREMENT_ID || env.VITE_GA4_ID || fallbacks.VITE_GA4_ID),
      'import.meta.env.VITE_PINTEREST_TAG': JSON.stringify(env.VITE_PINTEREST_TAG || fallbacks.VITE_PINTEREST_TAG),
      'import.meta.env.VITE_PINTEREST_DOMAIN': JSON.stringify(env.VITE_PINTEREST_DOMAIN || fallbacks.VITE_PINTEREST_DOMAIN),
      'import.meta.env.VITE_RAZORPAY_KEY_ID': JSON.stringify(env.VITE_RAZORPAY_KEY_ID || fallbacks.VITE_RAZORPAY_KEY_ID),
      'import.meta.env.VITE_WHATSAPP_NUMBER': JSON.stringify(env.VITE_WHATSAPP_NUMBER || fallbacks.VITE_WHATSAPP_NUMBER),
      'import.meta.env.VITE_SHEETS_WEBHOOK_URL': JSON.stringify(env.VITE_SHEETS_WEBHOOK_URL || fallbacks.VITE_SHEETS_WEBHOOK_URL),
      'import.meta.env.VITE_GOOGLE_SHEETS_URL': JSON.stringify(env.VITE_GOOGLE_SHEETS_URL || fallbacks.VITE_GOOGLE_SHEETS_URL),
      'import.meta.env.VITE_SITE_URL': JSON.stringify(env.VITE_SITE_URL || fallbacks.VITE_SITE_URL),
      'import.meta.env.VITE_SITE_NAME': JSON.stringify(env.VITE_SITE_NAME || fallbacks.VITE_SITE_NAME),
      'import.meta.env.VITE_STORE_PHONE': JSON.stringify(env.VITE_STORE_PHONE || fallbacks.VITE_STORE_PHONE),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor';
            }
          },
          entryFileNames: 'assets/[name].[hash].min.js',
          chunkFileNames: 'assets/[name].[hash].min.js',
          assetFileNames: 'assets/[name].[hash].min.[ext]',
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      open: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    preview: {
      port: 4000
    }
  };
});
