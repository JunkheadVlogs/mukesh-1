fetch("http://localhost:3000/api/submit-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ orderId: "ORD-TEST-HTTPS", firstName: "Test", paymentMethod: "cod", paymentStatus: "Cash on Delivery" })
}).then(r => r.json()).then(console.log).catch(console.error);
