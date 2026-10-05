const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUwbAq8VYnjkTPgIZFdCGIlaD8BvSy2ND1wURPdcoXwjQ8Id_fzvlkUB4eyhes2sM/exec";

export async function submitGoogleSheet({
  name,
  phone,
  request,
  requestId,
  source
}: {
  name: string;
  phone: string;
  request?: string;
  requestId?: string;
  source?: string;
}) {
  const device = typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
  const page = typeof window !== "undefined" ? window.location.pathname : "";
  const normalizedPhone = phone.startsWith("+91") ? phone : "+91" + phone;

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "exit_lead",
        name,
        firstName: name,
        fullName: name,
        customerName: name,
        phone: normalizedPhone,
        mobileNumber: normalizedPhone,
        contact: normalizedPhone,
        couponCode: source === "Contact Page" ? "N/A (Contact Form)" : "VIPCLUB60",
        page,
        device,
        request: request || "Exit Intent Discount Coupon VIPCLUB60",
        requestId: requestId || "REQ-" + Math.floor(1e5 + 9e5 * Math.random()),
        source: source || "Exit Intent Popup"
      })
    });
  } catch (err) {
    // Silent non-blocking fallback
  }
}

export async function submitOrderToGoogleSheet(orderData: any) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "order",
        ...orderData
      })
    });
  } catch (err) {
    // Silent non-blocking fallback
  }
}

export const sendOrderToSheets = submitOrderToGoogleSheet;
