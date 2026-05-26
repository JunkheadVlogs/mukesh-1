import fetch from 'node-fetch';
import https from 'https';

async function checkFendyImagePaths() {
  const hostingerIp = '145.223.17.203';
  const hostHeader = 'mukeshsarees.com';
  
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  const testPaths = [
    '/product/fendy-chiffon-white/fendy-chiffon-saree.webp',
    '/product/fendy-chiffon-white/Back-pose.webp',
    '/product/fendy-chiffon-white/Half-front.webp',
    '/product/fendy-chiffon-white/Navy-blue.webp',
    '/product/fendy-chiffon-white/Pink.webp',
    '/product/fendy-chiffon-white/Royal-blue.webp',
    '/product/fendy-chiffon-white/rust-brown.webp',
    '/product/fendy-chiffon-white/Wine_red.webp',
    // Let's also try standard uploads directory
    '/wp-content/uploads/fendy-chiffon-saree.webp',
    '/wp-content/uploads/2024/05/fendy-chiffon-saree.webp',
  ];

  console.log(`--- Checking Fendy webp images on Hostinger IP direct ---`);

  for (const path of testPaths) {
    const url = `https://${hostingerIp}${path}`;
    try {
      const res = await fetch(url, {
        headers: {
          'Host': hostHeader,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        agent,
        redirect: 'manual'
      });
      
      console.log(`Path: ${path} => Status: ${res.status}, Type: ${res.headers.get('content-type')}, Size: ${res.headers.get('content-length')}`);
    } catch (e: any) {
      console.error(`Path: ${path} failed with:`, e.message);
    }
  }
}

checkFendyImagePaths();
