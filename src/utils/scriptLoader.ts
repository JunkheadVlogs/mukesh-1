/**
 * Safe, singleton script loader utility for third-party scripts.
 *
 * Guarantees:
 * 1. Each vendor script loads at most once (no duplicate script tags).
 * 2. Nonessential marketing scripts (Meta Pixel, Pinterest, Clarity) are deferred
 *    until user interaction or browser idle time, keeping storefront initial load ultra-fast.
 * 3. Essential measurement (GTM) is loaded via non-blocking defer after initial paint.
 * 4. Razorpay is loaded strictly on-demand (payment actions only).
 * 5. Conversion events (purchase, checkout) immediately ensure required conversion scripts are active.
 * 6. Respects user consent (if opt-out is recorded).
 */

interface ScriptLoadOptions {
  id: string;
  src: string;
  async?: boolean;
  defer?: boolean;
  attributes?: Record<string, string>;
}

// In-flight promises to deduplicate concurrent requests for the same script
const loadingPromises = new Map<string, Promise<boolean>>();

/**
 * Loads an external script safely as a singleton in the DOM.
 */
export function loadExternalScript(options: ScriptLoadOptions): Promise<boolean> {
  const { id, src, async = true, defer = true, attributes = {} } = options;

  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve(false);
  }

  // 1. Check if script tag already exists in DOM by ID or SRC
  const existingById = document.getElementById(id);
  const existingBySrc = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  const existing = existingById || existingBySrc;

  if (existing) {
    if (existing.getAttribute("data-loaded") === "true") {
      return Promise.resolve(true);
    }
    // Return existing loading promise if one is active
    if (loadingPromises.has(id)) {
      return loadingPromises.get(id)!;
    }
    // Wait for the existing script tag to complete
    const promise = new Promise<boolean>((resolve) => {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
    });
    loadingPromises.set(id, promise);
    return promise;
  }

  // 2. Reuse in-flight promise if currently loading
  if (loadingPromises.has(id)) {
    return loadingPromises.get(id)!;
  }

  // 3. Inject script tag cleanly
  const promise = new Promise<boolean>((resolve) => {
    try {
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = async;
      script.defer = defer;

      Object.entries(attributes).forEach(([k, v]) => {
        script.setAttribute(k, v);
      });

      script.onload = () => {
        script.setAttribute("data-loaded", "true");
        loadingPromises.delete(id);
        resolve(true);
      };

      script.onerror = () => {
        console.warn(`[ScriptLoader] Failed to load third-party script: ${id}`);
        // Clean up failed tag so retries can work
        try {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        } catch {
          // ignore safe removal error
        }
        loadingPromises.delete(id);
        resolve(false);
      };

      document.head.appendChild(script);
    } catch (err) {
      console.warn(`[ScriptLoader] Error injecting script ${id}:`, err);
      loadingPromises.delete(id);
      resolve(false);
    }
  });

  loadingPromises.set(id, promise);
  return promise;
}

/**
 * Check if marketing consent is granted.
 * Respects any explicit opt-out stored in local storage.
 */
export function hasMarketingConsent(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return true;
    const consent = window.localStorage.getItem("msc_cookie_consent");
    if (consent === "rejected" || consent === "denied" || consent === "false") {
      return false;
    }
    return true;
  } catch {
    return true;
  }
}

/**
 * Loads Google Tag Manager (GTM) container.
 * Essential for GA4 ecommerce tracking and core measurements.
 */
export async function loadGTM(): Promise<boolean> {
  const gtmId = import.meta.env.VITE_GTM_ID;
  const isCustomGTM = Boolean(
    gtmId &&
    !gtmId.startsWith("%VITE_") &&
    !gtmId.includes("your_gtm_id") &&
    gtmId !== "GTM-WMG3G6SM"
  );

  (window as any).dataLayer = (window as any).dataLayer || [];
  if (!(window as any)._gtm_loaded) {
    (window as any)._gtm_loaded = true;
    (window as any).dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  }

  // If a valid custom GTM container ID is configured, load GTM
  if (isCustomGTM && gtmId) {
    return loadExternalScript({
      id: "gtm-script",
      src: `https://www.googletagmanager.com/gtm.js?id=${gtmId}`,
      defer: true,
    });
  }

  // When GTM container is unconfigured or placeholder (e.g. GTM-WMG3G6SM returning 404 HTML),
  // deploy GA4 measurement directly via official gtag.js to prevent 404 HTML syntax/script errors
  const ga4Id = import.meta.env.VITE_GA4_ID || "G-1LMBHFFF1F";
  if (ga4Id && !ga4Id.startsWith("%VITE_") && !ga4Id.includes("your_ga4_id")) {
    return loadExternalScript({
      id: "gtag-ga4-script",
      src: `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`,
      defer: true,
    });
  }

  return false;
}

/**
 * Loads Meta Pixel (Facebook / Instagram).
 * Nonessential marketing script.
 */
export async function loadMetaPixel(): Promise<boolean> {
  if (!hasMarketingConsent()) return false;

  const pixelId = import.meta.env.VITE_META_PIXEL_ID || "1458541922085984";
  if (!pixelId || pixelId.startsWith("%VITE_") || pixelId.includes("your_meta_pixel")) {
    return false;
  }

  const loaded = await loadExternalScript({
    id: "meta-pixel-script",
    src: "https://connect.facebook.net/en_US/fbevents.js",
    async: true,
  });

  if (loaded && (window as any).fbq && !(window as any)._fbq_initialized) {
    (window as any)._fbq_initialized = true;
    (window as any).fbq("init", pixelId);
  }

  return loaded;
}

/**
 * Loads Pinterest Tag.
 * Nonessential marketing script.
 */
export async function loadPinterestTag(): Promise<boolean> {
  if (!hasMarketingConsent()) return false;

  const pinTag = import.meta.env.VITE_PINTEREST_TAG || "";
  const validTag = pinTag && !pinTag.startsWith("%VITE_") && !pinTag.includes("your_pinterest_tag") ? pinTag : null;
  if (!validTag) {
    return false; // Skip loading if no valid Pinterest Tag ID is configured
  }

  const loaded = await loadExternalScript({
    id: "pinterest-tag-script",
    src: "https://s.pinimg.com/ct/core.js",
    async: true,
  });

  if (loaded && (window as any).pintrk && !(window as any)._pintrk_initialized) {
    (window as any)._pintrk_initialized = true;
    (window as any).pintrk("load", validTag);
  }

  return loaded;
}

/**
 * Loads Microsoft Clarity.
 * Nonessential behavioral tracking (heatmaps & session replay).
 */
export async function loadClarity(): Promise<boolean> {
  if (!hasMarketingConsent()) return false;

  const clarityId = "x1spvs9vsv";
  return loadExternalScript({
    id: "clarity-script",
    src: `https://www.clarity.ms/tag/${clarityId}`,
    defer: true,
  });
}

let isMarketingLoaded = false;

/**
 * Loads all nonessential marketing scripts once consent and interaction/idle conditions are met.
 */
export async function loadMarketingScripts(): Promise<void> {
  if (isMarketingLoaded) return;
  isMarketingLoaded = true;

  // Load in parallel without blocking main thread
  await Promise.allSettled([
    loadMetaPixel(),
    loadPinterestTag(),
    loadClarity(),
  ]);
}

/**
 * Critical conversion guarantee:
 * Immediately loads GTM, Meta Pixel, and Pinterest so that purchase/checkout conversion
 * events are never dropped if a customer completes an order before idle timers fire.
 */
export async function ensureConversionScriptsLoaded(): Promise<void> {
  await Promise.allSettled([
    loadGTM(),
    loadMetaPixel(),
    loadPinterestTag(),
  ]);
}

let schedulerInitialized = false;

/**
 * Schedules nonessential marketing scripts to load only AFTER user interaction or browser idle time.
 * Essential GTM measurement is loaded non-blocking after window load.
 */
export function scheduleScriptLoading(): void {
  if (typeof window === "undefined" || schedulerInitialized) return;
  schedulerInitialized = true;

  // 1. Essential GTM: Load on window load or idle so it never blocks FCP/LCP
  const initGTM = () => {
    loadGTM().catch(() => {});
  };

  if (document.readyState === "complete") {
    initGTM();
  } else {
    window.addEventListener("load", initGTM, { once: true });
  }

  // 2. Nonessential Marketing Scripts: Defer until user interaction or idle
  const interactionEvents = ["mousedown", "pointerdown", "touchstart", "scroll", "keydown"];

  const handleInteraction = () => {
    interactionEvents.forEach((evt) => {
      window.removeEventListener(evt, handleInteraction);
    });
    loadMarketingScripts().catch(() => {});
  };

  interactionEvents.forEach((evt) => {
    window.addEventListener(evt, handleInteraction, { passive: true, once: true });
  });

  // Fallback idle timer: trigger marketing scripts after idle time so background sessions still report
  const scheduleIdle = () => {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => {
        setTimeout(handleInteraction, 3500);
      }, { timeout: 6000 });
    } else {
      setTimeout(handleInteraction, 4000);
    }
  };

  if (document.readyState === "complete") {
    scheduleIdle();
  } else {
    window.addEventListener("load", scheduleIdle, { once: true });
  }
}
