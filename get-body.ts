import fetch from 'node-fetch';
import https from 'https';
import fs from 'fs';

async function getBody() {
  const hostingerIp = '145.223.17.203';
  const url = `https://${hostingerIp}/wp-content/uploads/2024/05/fendy-chiffon-saree.webp`;
  
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  try {
    const res = await fetch(url, {
      headers: {
        'Host': 'mukeshsarees.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      agent
    });

    console.log('Status:', res.status);
    console.log('Headers:', JSON.stringify(res.headers.raw(), null, 2));
    const text = await res.text();
    fs.writeFileSync('hostinger-response.html', text);
    console.log('Saved response to hostinger-response.html. First 500 chars:', text.substring(0, 500));
  } catch (e: any) {
    console.error('Fetch failed:', e.message);
  }
}

getBody();
