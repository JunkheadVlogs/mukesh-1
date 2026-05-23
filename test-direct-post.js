import fetch from 'node-fetch';

async function testDirectPost() {
  const url = 'https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec';
  const bodyData = {
    leadSource: "Exit Intent Popup",
    firstName: "Test User",
    mobileNumber: "9999999999",
    productViewed: "Test Saree",
    pageUrl: "https://mukeshsarees.com/",
    deviceType: "Desktop"
  };

  try {
    console.log('Posting directly to Google Apps Script...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData),
      redirect: 'follow'
    });

    console.log('Status Code:', response.status);
    console.log('Status Text:', response.statusText);
    const text = await response.text();
    console.log('Response body (truncated):', text.substring(0, 1000));
  } catch (err) {
    console.error('Error posting directly:', err);
  }
}

testDirectPost();
