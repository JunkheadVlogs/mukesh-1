import Razorpay from "razorpay";

const RAZORPAY_KEY_ID = "rzp_live_Slf11Odg572QOq";
const RAZORPAY_KEY_SECRET = "DA0NuRhgI39Ng8GNtc0X97h0";

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

async function test() {
  try {
    const order = await razorpayInstance.orders.create({
      amount: 100,
      currency: "INR",
      receipt: "receipt_test"
    });
    console.log("Success:", order);
  } catch (error) {
    console.error("Error:", JSON.stringify(error, null, 2));
  }
}

test();
