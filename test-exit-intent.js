fetch("http://localhost:3000/api/submit-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ firstName: "Test Lead", mobileNumber: "9999999999", leadSource: "Exit Intent Popup" })
}).then(r => r.json()).then(console.log).catch(console.error);
