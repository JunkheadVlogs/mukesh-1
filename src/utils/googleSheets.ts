const GOOGLE_SHEETS_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_URL ||
  import.meta.env.VITE_SHEETS_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbxUwbAq8VYnjkTPgIZFdCGIlaD8BvSy2ND1wURPdcoXwjQ8Id_fzvlkUB4eyhes2sM/exec";

export async function sendLeadToSheets({
  name,
  phone,
  request,
  requestId,
  source,
}: {
  name: string;
  phone: string;
  request?: string;
  requestId?: string;
  source?: string;
}) {
  const isMobile =
    typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);
  const device = isMobile ? "Mobile" : "Desktop";
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "exit_lead",
        name,
        firstName: name,
        fullName: name,
        customerName: name,
        phone: phone.startsWith("+91") ? phone : "+91" + phone,
        mobileNumber: phone.startsWith("+91") ? phone : "+91" + phone,
        contact: phone.startsWith("+91") ? phone : "+91" + phone,
        couponCode: source === "Contact Page" ? "N/A (Contact Form)" : "VIPCLUB60",
        page: path,
        device,
        request: request || "Exit Intent Discount Coupon VIPCLUB60",
        requestId: requestId || "REQ-" + Math.floor(100000 + Math.random() * 900000),
        source: source || "Exit Intent Popup",
      }),
    });
  } catch (err) {
    console.warn("sendLeadToSheets error:", err);
  }
}

export async function sendOrderToSheets(data: any) {
  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "order",
        ...data,
      }),
    });
  } catch (err) {
    console.warn("sendOrderToSheets error:", err);
  }
}
