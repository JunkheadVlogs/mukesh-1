import fs from 'fs';
import path from 'path';
import https from 'https';

const FONTS_DIR = path.join(process.cwd(), 'public', 'fonts');

if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

// User-Agent that requests woff2 format from Google Fonts
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36';

const googleFontsUrls = [
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap',
  'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap'
];

async function fetchCss(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': USER_AGENT }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
}

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

function extractUrls(css) {
  const regex = /url\((https:\/\/fonts\.gstatic\.com\/s\/[^)]+)\)/g;
  const urls = [];
  let match;
  while ((match = regex.exec(css)) !== null) {
    urls.push(match[1]);
  }
  return [...new Set(urls)];
}

async function start() {
  console.log('Downloading fonts from Google CSS endpoints...');
  let combinedCss = '';

  for (const url of googleFontsUrls) {
    console.log(`Fetching CSS: ${url}`);
    const css = await fetchCss(url);
    combinedCss += css + '\n';
  }

  const urls = extractUrls(combinedCss);
  console.log(`Found ${urls.length} font files to download.`);

  const urlMap = {};

  for (const fontUrl of urls) {
    const filename = path.basename(fontUrl);
    const destPath = path.join(FONTS_DIR, filename);
    console.log(`Downloading ${filename}...`);
    await downloadFile(fontUrl, destPath);
    urlMap[fontUrl] = `/fonts/${filename}`;
  }

  // Replace remote URLs in Google CSS with local paths
  let localCss = combinedCss;
  for (const [remoteUrl, localPath] of Object.entries(urlMap)) {
    localCss = localCss.split(remoteUrl).join(localPath);
  }

  fs.writeFileSync(path.join(FONTS_DIR, 'fonts.css'), localCss, 'utf-8');
  console.log('Fonts self-hosting completed successfully! Saved in /public/fonts/');
}

start().catch(console.error);
