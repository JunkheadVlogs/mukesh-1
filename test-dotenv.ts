import dotenv from "dotenv";
import Razorpay from "razorpay";
dotenv.config();

console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

razorpay.orders.create({ amount: 100, currency: "INR" })
  .then(console.log)
  .catch(err => console.error("ERR:", err.error || err));
