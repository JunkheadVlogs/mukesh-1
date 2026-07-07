import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Helper to clean and format image URLs for Google Drive or ImageKit direct high-res retrieval
function getCleanDirectImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return 'https://mukeshsarees.com/images/og-home.jpg';
  
  let targetUrl = imageUrl;
  
  if (imageUrl.includes('wsrv.nl')) {
    const match = imageUrl.match(/[?&]url=([^&]+)/);
    if (match) {
      targetUrl = decodeURIComponent(match[1]);
    }
  }

  if (targetUrl.includes('drive.google.com')) {
    let fileId = '';
    const idMatch = targetUrl.match(/[?&]id=([^&]+)/);
    if (idMatch) {
      fileId = idMatch[1];
    } else {
      const dMatch = targetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (dMatch) {
        fileId = dMatch[1];
      }
    }
    if (fileId) {
      targetUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  } else if (targetUrl.includes('lh3.googleusercontent.com')) {
    targetUrl = targetUrl.split('=')[0]; // strip existing params
  }

  if (!targetUrl.startsWith('http')) {
    targetUrl = `https://mukeshsarees.com/${targetUrl.replace(/^\/+/, '')}`;
  }

  return targetUrl;
}

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      return true;
    } catch (error: any) {
      if (attempt === maxRetries) {
        return false;
      }
    }
  }
  return false;
}

async function main() {
  console.log('==================================================================');
  console.log('🖼️  [GEN-OG-IMAGES] Starting high-performance Open Graph Image Generator...');
  console.log('==================================================================\n');

  const metaPath = path.join(rootDir, 'public', 'products-meta.json');
  if (!fs.existsSync(metaPath)) {
    console.error('❌ Could not locate products-meta.json. Please run build_meta.js first.');
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  console.log(`✅ Loaded ${products.length} products to generate OG images.`);

  // Create and clear destination directories
  const publicOgDir = path.join(rootDir, 'public', 'og-images');
  const distOgDir = path.join(rootDir, 'dist', 'og-images');

  if (fs.existsSync(publicOgDir)) {
    fs.rmSync(publicOgDir, { recursive: true, force: true });
  }
  if (fs.existsSync(distOgDir)) {
    fs.rmSync(distOgDir, { recursive: true, force: true });
  }

  fs.mkdirSync(publicOgDir, { recursive: true });
  fs.mkdirSync(distOgDir, { recursive: true });

  let successCount = 0;
  let failCount = 0;

  // Run downloads concurrently in batches of 15 to stay within limits and complete in <5 seconds
  const concurrency = 15;
  const tasks = products.map((p: any) => async () => {
    const slug = p.slug;
    if (!slug) return;

    const cleanImgUrl = getCleanDirectImageUrl(p.image);
    
    // Construct the double-wrapped centering-pad formula for 800x1200 portrait (2:3 aspect ratio):
    const innerUrl = `https://wsrv.nl/?url=${encodeURIComponent(cleanImgUrl)}&w=760&h=1160&fit=contain&cbg=ffffff`;
    const finalUrl = `https://wsrv.nl/?url=${encodeURIComponent(innerUrl)}&w=800&h=1200&fit=contain&cbg=ffffff&output=jpg&q=95`;

    const destPublicFile = path.join(publicOgDir, `${slug}.jpg`);
    const destDistFile = path.join(distOgDir, `${slug}.jpg`);

    const success = await downloadFile(finalUrl, destPublicFile);
    if (success) {
      fs.copyFileSync(destPublicFile, destDistFile);
      successCount++;
    } else {
      failCount++;
    }
  });

  // Execute concurrently with a pool
  const pool: Promise<void>[] = [];
  const activeTasks = [...tasks];
  
  async function worker() {
    while (activeTasks.length > 0) {
      const task = activeTasks.shift();
      if (task) {
        await task();
      }
    }
  }

  for (let i = 0; i < concurrency; i++) {
    pool.push(worker());
  }

  await Promise.all(pool);

  console.log('\n======================================================');
  console.log('🎉 [GEN-OG-IMAGES] POOL PROCESS COMPLETE!');
  console.log('======================================================');
  console.log(`- Successfully processed: ${successCount}`);
  console.log(`- Failed/Skipped: ${failCount}`);
  console.log('======================================================\n');
}

main().catch(err => {
  console.error("Fatal generating OG images:", err);
  process.exit(1);
});
