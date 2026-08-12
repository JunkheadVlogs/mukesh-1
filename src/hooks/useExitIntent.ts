import { useEffect, useState, useRef } from 'react';
import { safeSessionStorage, safeLocalStorage } from '../utils/safeStorage';

interface UseExitIntentOptions {
  delay?: number;
  sensitivity?: number;
}

// Tier 3 Storage: Global in-memory JS state that survives SPA route changes & component remounts
let globalSessionExitPopupShown = false;

export function isPinterestBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator?.userAgent || '';
  const ref = document?.referrer || '';
  const search = window?.location?.search || '';

  const isUaPinterest = /Pinterest/i.test(ua);
  const isRefPinterest = /pinterest\.com|pin\.it/i.test(ref);
  const isUtmPinterest = /[?&]utm_source=pinterest/i.test(search);

  return isUaPinterest || isRefPinterest || isUtmPinterest;
}

/**
 * Detects if the current visitor arrived from Meta Ads (Facebook/Instagram/Messenger)
 */
export function isMetaAdsVisitor(): boolean {
  if (typeof window === 'undefined') return false;
  const search = window.location.search || '';
  const ref = document.referrer || '';
  const ua = navigator?.userAgent || '';

  const hasMetaParam = /[?&](fbclid|utm_source=(meta|facebook|fb|instagram|ig)|utm_medium=(cpc|paid|meta|paidads))/i.test(search);
  const isMetaRef = /facebook\.com|instagram\.com|l\.instagram\.com|l\.facebook\.com|lm\.facebook\.com|m\.facebook\.com/i.test(ref);
  const isMetaUa = /FBAN|FBAV|FB_IAB|FB4A|Instagram/i.test(ua);

  return hasMetaParam || isMetaRef || isMetaUa;
}

/**
 * Detects if the current page is a product detail page (e.g. /product/pure-linen-saree-natural-bird-print-woven-design)
 */
export function isProductPage(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.includes('/product/');
}

/**
 * Detects if the current user agent belongs to a known in-app browser WebView
 * (Pinterest, Instagram, Facebook, WhatsApp, TikTok, LinkedIn, Twitter/X, Snapchat, etc.)
 */
export function detectInAppBrowser(): { isInApp: boolean; name: string | null } {
  if (typeof window === 'undefined' || !navigator?.userAgent) {
    return { isInApp: false, name: null };
  }
  if (isPinterestBrowser()) return { isInApp: true, name: 'Pinterest' };
  const ua = navigator.userAgent;
  if (/Instagram/i.test(ua)) return { isInApp: true, name: 'Instagram' };
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return { isInApp: true, name: 'Facebook' };
  if (/WhatsApp/i.test(ua)) return { isInApp: true, name: 'WhatsApp' };
  if (/LinkedIn/i.test(ua)) return { isInApp: true, name: 'LinkedIn' };
  if (/TikTok|musical_ly/i.test(ua)) return { isInApp: true, name: 'TikTok' };
  if (/Twitter|TwitterAndroid/i.test(ua)) return { isInApp: true, name: 'Twitter' };
  if (/Snapchat/i.test(ua)) return { isInApp: true, name: 'Snapchat' };
  if (/Telegram/i.test(ua)) return { isInApp: true, name: 'Telegram' };
  if (/Line/i.test(ua)) return { isInApp: true, name: 'Line' };
  
  if (/WebView|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua)) {
    return { isInApp: true, name: 'GenericInAppWebView' };
  }
  return { isInApp: false, name: null };
}

export function isExitPopupAlreadyShown(): boolean {
  try {
    const now = Date.now();
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

    // 1. Converted Visitor Suppression (Form Submitted or Purchased -> permanent / min 90 days)
    const submittedTime = safeLocalStorage.getItem('exitIntentSubmittedTime');
    const isSubmitted = safeLocalStorage.getItem('exitIntentSubmitted');
    if (isSubmitted === 'true' || (submittedTime && (now - parseInt(submittedTime, 10)) < NINETY_DAYS_MS)) {
      return true;
    }

    const hasPurchased = safeLocalStorage.getItem('hasPurchased');
    if (hasPurchased === 'true') return true;

    // 2. FOR PRODUCT PAGES & META ADS TRAFFIC: ALWAYS ALLOW EXIT INTENT FORM COMPULSORY
    // Override 24h cooldowns and previous store session suppressions if they haven't submitted lead yet!
    if (isProductPage() || isMetaAdsVisitor()) {
      if (globalSessionExitPopupShown) return true; // Only prevent repeat popups on the exact same active page view
      return false; // Force compulsory display
    }

    // 3. In-Memory check for standard browsing
    if (globalSessionExitPopupShown) return true;

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    // 4. Session Check
    const sessionShown = safeSessionStorage.getItem('exit_intent_shown') || safeSessionStorage.getItem('exitPopupShown');
    if (sessionShown === '1' || sessionShown === 'true') return true;

    // 5. 3-Dismissal 30-Day Suppression Check
    const dismissCountStr = safeLocalStorage.getItem('exit_intent_dismiss_count');
    const dismissCount = dismissCountStr ? parseInt(dismissCountStr, 10) : 0;
    const last3rdDismissTimeStr = safeLocalStorage.getItem('exit_intent_3rd_dismiss_time');

    if (dismissCount >= 3) {
      if (last3rdDismissTimeStr) {
        const last3rdDismissTime = parseInt(last3rdDismissTimeStr, 10);
        if (now - last3rdDismissTime < THIRTY_DAYS_MS) {
          return true;
        } else {
          safeLocalStorage.removeItem('exit_intent_dismiss_count');
          safeLocalStorage.removeItem('exit_intent_3rd_dismiss_time');
        }
      } else {
        return true;
      }
    }

    // 6. 24-Hour Cooldown Check
    const lastShownTimeStr = safeLocalStorage.getItem('exit_intent_last_shown_time');
    if (lastShownTimeStr) {
      const lastShownTime = parseInt(lastShownTimeStr, 10);
      if (now - lastShownTime < ONE_DAY_MS) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

export function markExitPopupAsShown(): void {
  globalSessionExitPopupShown = true;
  try {
    const now = Date.now().toString();
    safeSessionStorage.setItem('exit_intent_shown', '1');
    safeSessionStorage.setItem('exitPopupShown', 'true');
    safeLocalStorage.setItem('exit_intent_shown', '1');
    safeLocalStorage.setItem('exitPopupShown', 'true');
    safeLocalStorage.setItem('exit_intent_last_shown_time', now);
  } catch {
    // Fail gracefully
  }
}

export function recordExitPopupDismissal(): void {
  try {
    const now = Date.now();
    const currentCountStr = safeLocalStorage.getItem('exit_intent_dismiss_count');
    const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;
    const newCount = currentCount + 1;

    safeLocalStorage.setItem('exit_intent_dismiss_count', newCount.toString());

    if (newCount >= 3) {
      safeLocalStorage.setItem('exit_intent_3rd_dismiss_time', now.toString());
    }
  } catch {
    // Fail gracefully
  }
}

export function useExitIntent({ delay = 3000, sensitivity = 20 }: UseExitIntentOptions = {}) {
  const [triggered, setTriggered] = useState(false);
  const hasTriggeredRef = useRef(false);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    const isPriorityTarget = isProductPage() || isMetaAdsVisitor();

    // 1. Check layered storage before attaching any event triggers
    if (isExitPopupAlreadyShown()) {
      return;
    }

    // Eagerly prefetch popup component
    import('../components/ExitIntentPopup').catch(() => {});

    const trigger = () => {
      if (hasTriggeredRef.current || isExitPopupAlreadyShown()) return;
      hasTriggeredRef.current = true;
      markExitPopupAsShown();
      setTriggered(true);
    };

    // Track user engagement/interaction
    const recordInteraction = () => {
      hasInteractedRef.current = true;
    };

    window.addEventListener('touchstart', recordInteraction, { passive: true });
    window.addEventListener('click', recordInteraction, { passive: true });
    window.addEventListener('keydown', recordInteraction, { passive: true });

    // 1. DESKTOP TRIGGER: Mouse leaves top of viewport
    let mouseMoveAttached = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        trigger();
      }
    };

    const effectiveDelay = isPriorityTarget ? 0 : delay;
    const mouseMoveTimer = setTimeout(() => {
      document.addEventListener('mousemove', handleMouseMove);
      mouseMoveAttached = true;
    }, effectiveDelay);

    // 2. MOBILE SCROLL TRIGGER
    let lastScrollY = window.scrollY;
    let maxScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentY = window.scrollY;
      
      if (currentY > 30) {
        hasInteractedRef.current = true;
      }
      
      if (currentY > maxScrollY) {
        maxScrollY = currentY;
      }
      
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (currentY / docHeight) * 100 : 0;

      if (isPriorityTarget) {
        // For product/meta ad visitors: trigger on 20% scroll or gentle upward scroll
        if (scrollPercent >= 20 || (maxScrollY > 80 && lastScrollY - currentY > 15)) {
          trigger();
        }
      } else {
        // Standard trigger: rapid scroll up after scrolling down past 100px
        if (maxScrollY > 100) {
          const scrollDiff = lastScrollY - currentY;
          if (scrollDiff > 35) {
            trigger();
          }
        }
      }
      
      lastScrollY = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 3. BACK-BUTTON (POPSTATE) TRIGGER for Mobile & WebViews
    try {
      if (!window.history.state?.exitGuarded) {
        window.history.pushState({ exitGuarded: true }, '', window.location.href);
      }
    } catch {
      // Ignore pushState errors in sandboxed frames
    }

    const handlePopState = () => {
      if (!hasTriggeredRef.current) {
        trigger();
      }
    };
    window.addEventListener('popstate', handlePopState);

    // 4. TAB VISIBILITY CHANGE TRIGGER (e.g. user switching tabs or opening another app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && (isPriorityTarget || hasInteractedRef.current)) {
        trigger();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 5. COMPULSORY TIME-DELAY FALLBACK TRIGGER
    // Product Page & Meta Ads visitors: 5 seconds compulsory fallback
    // General visitors: 18 seconds fallback
    const fallbackDelayMs = isPriorityTarget ? 5000 : 18000;
    const timeDelayTimer = setTimeout(() => {
      trigger();
    }, fallbackDelayMs);

    return () => {
      clearTimeout(mouseMoveTimer);
      clearTimeout(timeDelayTimer);
      if (mouseMoveAttached) {
        document.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('touchstart', recordInteraction);
      window.removeEventListener('click', recordInteraction);
      window.removeEventListener('keydown', recordInteraction);
    };
  }, [delay, sensitivity]);

  const dismiss = () => {
    setTriggered(false);
    recordExitPopupDismissal();
    markExitPopupAsShown();
  };

  return { triggered, dismiss };
}

