import fetch from 'node-fetch'; // assuming node-fetch or global fetch
async function test() {
  try {
    const url = 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec';
    console.log('Testing URL:', url);
    const res = await fetch(url, { method: 'GET', redirect: 'follow' });
    console.log('Status:', res.status);
    console.log('Status Text:', res.statusText);
    const text = await res.text();
    console.log('Body length:', text.length);
    console.log('Full response body:');
    console.log(text);
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
