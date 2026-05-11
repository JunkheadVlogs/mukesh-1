
export const CONFIG = {
  STORE_NAME: 'Mukesh Saree Centre',
  STORE_EMAIL: 'info.mukeshsareecentre@gmail.com',
  STORE_PHONE: '+91 7020664641',
  STORE_ADDRESS: 'Jaganth Road, Gandibagh, Nagpur 440002',
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_SjKF47ziF70i7R',
};

export async function submitToGoogleSheets(data: any) {
  try {
    const response = await fetch('/api/submit-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return result.status === "success";
  } catch (error) {
    console.error('Submission Error:', error);
    return false;
  }
}

