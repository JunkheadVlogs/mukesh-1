import Razorpay from "razorpay";
const razorpay = new Razorpay({ key_id: "rzp_live_So7zJe4qbXm4LY", key_secret: "z245tbFDtCZmJ7Wztx2XSHrG" });
razorpay.orders.create({ amount: 100, currency: "INR" }).then(console.log).catch(err => console.error("TEST ERROR:", JSON.stringify(err)));
