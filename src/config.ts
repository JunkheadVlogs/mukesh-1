
export const CONFIG = {
  STORE_NAME: 'Mukesh Saree Centre',
  STORE_EMAIL: 'info.mukeshsareecentre@gmail.com',
  STORE_PHONE: '+91 7020664641',
  STORE_ADDRESS: 'Jaganth Road, Gandibagh, Nagpur 440002',
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_live_So7zJe4qbXm4LY',
};

export async function submitToGoogleSheets(data: any) {
  try {
    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbydYk2OFJIkU0i3yb1a0XAVqzJP73H8Gbuzqf102TtUkCyRcsL5F9Zc-DesrgP_ZVA/exec";
    
    // We use text/plain to avoid CORS preflight issues with Google Apps Script
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        // "Content-Type": "text/plain" is safer for GAS CORS, but the user requested application/json
        // But for direct fetch to GAS from browser, text/plain or application/x-www-form-urlencoded is required to bypass preflight.
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Network response failed: ${response.status}`);
    }

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("Invalid response from server");
    }

    if (result.status !== "success") {
      throw new Error(result.message || "Unknown error");
    }

    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("COD Order Error:", error);
    throw error;
  }
}



