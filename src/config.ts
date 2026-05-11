
export const CONFIG = {
  STORE_NAME: 'Mukesh Saree Centre',
  STORE_EMAIL: 'info.mukeshsareecentre@gmail.com',
  STORE_PHONE: '+91 7020664641',
  STORE_ADDRESS: 'Jaganth Road, Gandibagh, Nagpur 440002',
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_SjKF47ziF70i7R',
};

export async function submitToGoogleSheets(data: any) {
  try {
    const response = await fetch(`/api/submit-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse response as JSON. Original response:", text.substring(0, 300));
      throw new Error(`Invalid response format from /api/submit-order: ${text.substring(0, 100)}`);
    }

    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    alert("Submission Failed");
    return null;
  }
}



