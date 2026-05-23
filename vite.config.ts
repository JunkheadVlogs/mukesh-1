import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    root: '.',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      __META_PIXEL_ID__: JSON.stringify(env.VITE_META_PIXEL_ID),
      __GTM_ID__: JSON.stringify(env.VITE_GTM_ID),
      __RAZORPAY_KEY__: JSON.stringify(env.VITE_RAZORPAY_KEY_ID),
      __WHATSAPP_NUMBER__: JSON.stringify(env.VITE_WHATSAPP_NUMBER),
      __SHEETS_URL__: JSON.stringify(env.VITE_SHEETS_WEBHOOK_URL),
      __SITE_URL__: JSON.stringify(env.VITE_SITE_URL),
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
