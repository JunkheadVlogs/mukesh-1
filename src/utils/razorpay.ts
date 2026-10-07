/**
 * Reusable on-demand loader utility for Razorpay Checkout SDK.
 *
 * Ensures:
 * - Script is loaded strictly on-demand (when Buy Now or payment step is triggered).
 * - Never injected on global visits, product page browsing, or Add to Cart actions.
 * - Single script tag in the document (never duplicates).
 * - Concurrent calls reuse the same in-flight Promise.
 * - Graceful error handling (offline, network failure, adblockers) with retry capability.
 * - No credentials or secrets in frontend code.
 */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise: Promise<boolean> | null = null;

/**
 * Loads the Razorpay Checkout SDK script once only.
 * Returns true if successfully loaded and available, false otherwise.
 */
export async function loadRazorpay(): Promise<boolean> {
  // 1. Guard against non-browser environments
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  // 2. Return immediately if Razorpay is already available globally on window
  if (window.Razorpay) {
    return true;
  }

  // 3. Return cached in-flight promise if currently loading
  if (loadPromise) {
    return loadPromise;
  }

  // 4. Check if a script tag already exists in DOM
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${RAZORPAY_SCRIPT_SRC}"]`
  );

  if (existingScript) {
    if (window.Razorpay) {
      return true;
    }

    loadPromise = new Promise<boolean>((resolve) => {
      const handleLoad = () => {
        loadPromise = null;
        resolve(Boolean(window.Razorpay));
      };
      const handleError = () => {
        loadPromise = null;
        resolve(false);
      };

      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
    });

    return loadPromise;
  }

  // 5. Create and append script on demand
  loadPromise = new Promise<boolean>((resolve) => {
    try {
      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_SRC;
      script.async = true;
      script.setAttribute("data-payment-sdk", "razorpay");

      script.onload = () => {
        loadPromise = null;
        resolve(Boolean(window.Razorpay));
      };

      script.onerror = () => {
        // Clean up failed script tag so subsequent user attempts can retry cleanly
        try {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        } catch {
          // ignore safe removal error
        }
        loadPromise = null;
        resolve(false);
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error("[Razorpay Loader] Failed to append script:", err);
      loadPromise = null;
      resolve(false);
    }
  });

  return loadPromise;
}

/**
 * Synchronously checks if the Razorpay SDK is currently loaded and available.
 */
export function isRazorpayLoaded(): boolean {
  return typeof window !== "undefined" && Boolean(window.Razorpay);
}
