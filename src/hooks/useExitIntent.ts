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
  const isUtmPinterest = /[?&]utm_source=pinterest/i.test(search) || /[?&]utm_medium=pinterest/i.test(search) || search.toLowerCase().includes('pinterest');

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
    // 1. Converted Visitor Suppression (Form Submitted -> do not show again)
    const isSubmitted = safeLocalStorage.getItem('exitIntentSubmitted');
    if (isSubmitted === 'true') {
      return true;
    }

    // 2. Prevent repeat popups within the same active session once shown
    if (globalSessionExitPopupShown) {
      return true;
    }

    const sessionShown = safeSessionStorage.getItem('exit_intent_shown') || safeSessionStorage.getItem('exitPopupShown');
    if (sessionShown === '1' || sessionShown === 'true') {
      return true;
    }

    // 3. Do not show on conversion/order success pages
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname || '';
      if (pathname.includes('/thank-you') || pathname.includes('/success')) {
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

export function useExitIntent({ delay = 0, sensitivity = 20 }: UseExitIntentOptions = {}) {
  const [triggered, setTriggered] = useState(false);
  const hasTriggeredRef = useRef(false);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    // 1. Check if already submitted or already displayed in current session
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

    // 1. DESKTOP TRIGGER: Mouse moves to top or leaves window
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 15) {
        trigger();
      }
    };
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 || e.clientX <= 0 || e.clientX >= window.innerWidth) {
        trigger();
      }
    };
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // 2. MOBILE SCROLL TRIGGER
    let lastScrollY = window.scrollY;
    let maxScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentY = window.scrollY;
      
      if (currentY > 20) {
        hasInteractedRef.current = true;
      }
      
      if (currentY > maxScrollY) {
        maxScrollY = currentY;
      }
      
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (currentY / docHeight) * 100 : 0;

      // Trigger if visitor has scrolled 15%+ of the page or scrolls up by 20px after scrolling down
      if (scrollPercent >= 15 || (maxScrollY > 60 && lastScrollY - currentY > 20)) {
        trigger();
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
      if (document.visibilityState === 'hidden') {
        trigger();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 5. GUARANTEE FALLBACK TIMER (6.5s)
    // Ensures EVERY visitor gets the exit intent offer at least once even if no exit gesture occurred yet
    const timeDelayTimer = setTimeout(() => {
      trigger();
    }, 6500);

    return () => {
      clearTimeout(timeDelayTimer);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
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

