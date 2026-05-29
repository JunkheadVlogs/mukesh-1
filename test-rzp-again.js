import Razorpay from "razorpay";
const razorpay = new Razorpay({ key_id: "rzp_live_SvAvyQnxCNWCIP", key_secret: "Xl5dAr611y4jLqhVfUQ6xa7k" });
razorpay.orders.create({ amount: 100, currency: "INR" }).then(console.log).catch(err => console.error("TEST ERROR:", JSON.stringify(err)));
