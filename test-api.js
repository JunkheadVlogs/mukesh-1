import fetch from 'node-fetch';

async function test() {
  console.log("Fetching /api/create-order...");
  const res = await fetch('http://localhost:3000/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 100 })
  });
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text.substring(0, 200));
}

test();
