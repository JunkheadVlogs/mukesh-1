
const BASE_URL = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');

export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || BASE_URL,
  STORE_NAME: 'Mukesh Saree Centre',
  STORE_EMAIL: 'info.mukeshsareecentre@gmail.com',
  STORE_PHONE: '+91 7020664641',
  STORE_ADDRESS: 'Jaganth Road, Gandibagh, Nagpur 440002',
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID, // STRICTLY KEY_ID NO SECRET
};

export async function submitToGoogleSheets(data: any) {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/submit-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Submission failed details:", errorText);
      throw new Error(`Failed to submit order to backend proxy: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Order Submission Proxy Error:", error);
    throw error;
  }
}



