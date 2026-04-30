
export const CONFIG = {
  STORE_NAME: 'Mukesh Saree Centre',
  STORE_EMAIL: 'info.mukeshsareecentre@gmail.com',
  STORE_PHONE: '+91 7020664641',
  STORE_ADDRESS: 'Jaganth Road, Gandibagh, Nagpur 440002',
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_SjKF47ziF70i7R',
};

export async function submitToGoogleSheets(data: any) {
  try {
    const url = 'https://script.google.com/macros/s/AKfycbx_H3qlGRcB4rgWoCTiCwdqVAduaeVW0U0n-DsSdHkK9eQ-41TO-81g_FDHadb-8wU/exec';
    
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
    });
    
    return true;
  } catch (error) {
    console.error('Submission Error:', error);
    return false;
  }
}

