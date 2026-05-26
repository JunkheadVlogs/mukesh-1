import fetch from 'node-fetch';

async function testIp() {
  try {
    const res = await fetch('https://1.1.1.1/');
    console.log('1.1.1.1 Status:', res.status, 'Content-Type:', res.headers.get('content-type'));
    const text = await res.text();
    console.log('Length:', text.length, 'Sample:', text.substring(0, 100));
  } catch (e: any) {
    console.error('1.1.1.1 error:', e.message);
  }
}

testIp();
