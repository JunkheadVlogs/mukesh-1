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
      console.error(`Attempt ${attempt} failed for url ${url}:`, error.message || error);
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
    
    // Construct the single-wrapped centering-pad formula for 800x1200 portrait (2:3 aspect ratio):
    const finalUrl = `https://wsrv.nl/?url=${encodeURIComponent(cleanImgUrl)}&w=800&h=1200&fit=contain&cbg=ffffff&output=jpg&q=85`;

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

  // Generate Wholesale VIP Club dedicated 1200x630 OG image
  try {
    const wholesaleUrl = "https://wsrv.nl/?url=https%3A%2F%2Fik.imagekit.io%2Ftus1loev9%2Fhomepage%2Fheroimage.webp&w=1200&h=630&fit=cover&output=jpg&q=80";
    const destWholesalePublic = path.join(publicOgDir, 'wholesale-vip-club.jpg');
    const destWholesaleDist = path.join(distOgDir, 'wholesale-vip-club.jpg');
    const wholesaleSuccess = await downloadFile(wholesaleUrl, destWholesalePublic);
    if (wholesaleSuccess) {
      fs.copyFileSync(destWholesalePublic, destWholesaleDist);
      // Also copy to root public/og-wholesale.jpg for extra safety
      fs.copyFileSync(destWholesalePublic, path.join(rootDir, 'public', 'og-wholesale.jpg'));
      if (fs.existsSync(path.join(rootDir, 'dist'))) {
        fs.copyFileSync(destWholesalePublic, path.join(rootDir, 'dist', 'og-wholesale.jpg'));
      }
      console.log('✅ Generated wholesale-vip-club.jpg Open Graph Image');
    }
  } catch (err: any) {
    console.error('Warning: could not download wholesale-vip-club.jpg:', err?.message || err);
  }

  // Generate / Update Main Homepage Hero 1200x630 Open Graph Image (under 100KB for WhatsApp & Social bots)
  try {
    const heroOgUrl = "https://wsrv.nl/?url=https%3A%2F%2Fik.imagekit.io%2Ftus1loev9%2Fhomepage%2Fheroimage.webp&w=1200&h=630&fit=cover&output=jpg&q=82";
    const destHeroPublic = path.join(rootDir, 'public', 'og-image.jpg');
    const heroSuccess = await downloadFile(heroOgUrl, destHeroPublic);
    if (heroSuccess) {
      if (fs.existsSync(path.join(rootDir, 'public', 'images'))) {
        fs.copyFileSync(destHeroPublic, path.join(rootDir, 'public', 'images', 'og-home.jpg'));
      }
      if (fs.existsSync(path.join(rootDir, 'dist'))) {
        fs.copyFileSync(destHeroPublic, path.join(rootDir, 'dist', 'og-image.jpg'));
        if (fs.existsSync(path.join(rootDir, 'dist', 'images'))) {
          fs.copyFileSync(destHeroPublic, path.join(rootDir, 'dist', 'images', 'og-home.jpg'));
        }
      }
      console.log('✅ Generated og-image.jpg (Hero Open Graph Banner, ~91KB)');
    }
  } catch (err: any) {
    console.error('Warning: could not download og-image.jpg:', err?.message || err);
  }

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
