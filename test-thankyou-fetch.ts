import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/src/ThankYou.tsx');
    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));
    const text = await res.text();
    console.log('Body length:', text.length);
    console.log('Body start:', text.substring(0, 200));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
