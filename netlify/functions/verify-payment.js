const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        statusCode: 400,
        body: 'Missing parameters'
      };
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    let secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    
    // Consistent fallback if secret isn't provided or is empty
    if (!secret) {
      secret = "Xl5dAr611y4jLqhVfUQ6xa7k";
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return {
        statusCode: 400,
        body: 'Payment verification failed'
      };
    }

    // Only here, after verified signature, orders can be marked/confirmed
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Payment verified successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
