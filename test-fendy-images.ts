import fetch from 'node-fetch';

async function test() {
  const urls = [
    "https://mukeshsarees.com/product/fendy-chiffon-white/fendy-chiffon-saree.webp",
    "https://mukeshsarees.com/product/fendy-chiffon-white/Back-pose.webp",
    "https://mukeshsarees.com/product/fendy-chiffon-white/Half-front.webp",
    "https://mukeshsarees.com/product/fendy-chiffon-white/Navy-blue.webp",
    "https://mukeshsarees.com/product/fendy-chiffon-white/Pink.webp",
    "https://mukeshsarees.com/product/fendy-chiffon-white/Royal-blue.webp",
    "https://mukeshsarees.com/product/fendy-chiffon-white/rust-brown.webp",
    "https://mukeshsarees.com/product/fendy-chiffon-white/Wine_red.webp"
  ];
  
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(url, '=> Status:', res.status, 'Type:', res.headers.get('content-type'));
    } catch (e) {
      console.log(url, '=> Error:', e.message);
    }
  }
}

test();
