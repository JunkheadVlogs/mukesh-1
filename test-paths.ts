import fetch from 'node-fetch';
import https from 'https';

async function probeWp() {
  const hostingerIp = '145.223.17.203';
  const hostHeader = 'mukeshsarees.com';
  
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  const testPaths = [
    '/index.php',
    '/xmlrpc.php',
    '/wp-login.php',
    '/wp-content/uploads/',
    '/wp-content/uploads/woocommerce-placeholder.png',
  ];

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
      const text = await res.text();
      console.log(`Path: ${path} => Status: ${res.status}, Type: ${res.headers.get('content-type')}, Length: ${text.length}`);
    } catch (e: any) {
      console.error(`Path: ${path} failed:`, e.message);
    }
  }
}

probeWp();
