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
  // Layer 3: In-Memory check (guaranteed to work across SPA page transitions)
  if (globalSessionExitPopupShown) return true;

  try {
    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

    // 1. Converted Visitor Suppression (Form Submitted or Purchased -> permanent / min 90 days)
    const submittedTime = safeLocalStorage.getItem('exitIntentSubmittedTime');
    const isSubmitted = safeLocalStorage.getItem('exitIntentSubmitted');
    if (isSubmitted === 'true' || (submittedTime && (now - parseInt(submittedTime, 10)) < NINETY_DAYS_MS)) {
      return true;
    }

    const hasPurchased = safeLocalStorage.getItem('hasPurchased');
    if (hasPurchased === 'true') return true;

    // 2. Session Check (Once per active browser session)
    const sessionShown = safeSessionStorage.getItem('exit_intent_shown') || safeSessionStorage.getItem('exitPopupShown');
    if (sessionShown === '1' || sessionShown === 'true') return true;

    // 3. 3-Dismissal 30-Day Suppression Check
    const dismissCountStr = safeLocalStorage.getItem('exit_intent_dismiss_count');
    const dismissCount = dismissCountStr ? parseInt(dismissCountStr, 10) : 0;
    const last3rdDismissTimeStr = safeLocalStorage.getItem('exit_intent_3rd_dismiss_time');

    if (dismissCount >= 3) {
      if (last3rdDismissTimeStr) {
        const last3rdDismissTime = parseInt(last3rdDismissTimeStr, 10);
        if (now - last3rdDismissTime < THIRTY_DAYS_MS) {
          return true; // Suppressed for 30 days after 3rd dismissal
        } else {
          // 30 days elapsed since 3rd dismissal: reset counter for a fresh cycle
          safeLocalStorage.removeItem('exit_intent_dismiss_count');
          safeLocalStorage.removeItem('exit_intent_3rd_dismiss_time');
        }
      } else {
        return true; // Dismissed 3+ times, suppress
      }
    }

    // 4. 24-Hour Cooldown Check (Enforce 24h gap between impressions across sessions)
    const lastShownTimeStr = safeLocalStorage.getItem('exit_intent_last_shown_time');
    if (lastShownTimeStr) {
      const lastShownTime = parseInt(lastShownTimeStr, 10);
      if (now - lastShownTime < ONE_DAY_MS) {
        return true; // 24-hour cooldown active
      }
    }
  } catch {
    // Fail gracefully if storage access throws errors or is blocked
    return true;
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
    // 1. Check layered storage before attaching any event triggers
    if (isExitPopupAlreadyShown()) {
      return;
    }

    const trigger = () => {
      if (hasTriggeredRef.current || isExitPopupAlreadyShown()) return;
      hasTriggeredRef.current = true;
      markExitPopupAsShown();
      setTriggered(true);
    };

    // PINTEREST IN-APP BROWSER DIRECT GUARANTEED TRIGGER:
    // Bypasses complex event listeners (scroll velocity, mousemove, popstate, interaction guards)
    let pinterestTimer: ReturnType<typeof setTimeout> | null = null;
    if (isPinterestBrowser()) {
      // Eagerly prefetch popup code chunk
      import('../components/ExitIntentPopup').catch(() => {});

      pinterestTimer = setTimeout(() => {
        trigger();
      }, 15000);
    }

    // Track user engagement/interaction (touch, click, scroll, keydown)
    const recordInteraction = () => {
      hasInteractedRef.current = true;
    };

    window.addEventListener('touchstart', recordInteraction, { passive: true });
    window.addEventListener('click', recordInteraction, { passive: true });
    window.addEventListener('keydown', recordInteraction, { passive: true });

    // 1. DESKTOP TRIGGER: Mouse leaves top of viewport
    let mouseMoveAttached = false;
    const handleMouseMove = (e: MouseEvent) => {
      // Only trigger if mouse moves above the viewport (Y <= 5)
      if (e.clientY <= 5) {
        trigger();
      }
    };
    
    const mouseMoveTimer = setTimeout(() => {
      document.addEventListener('mousemove', handleMouseMove);
      mouseMoveAttached = true;
    }, delay);


    // 2. MOBILE TRIGGER: Fast upward scroll velocity after scrolling down
    let lastScrollY = window.scrollY;
    let maxScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    
    const handleScroll = () => {
      const currentY = window.scrollY;
      const now = Date.now();
      const timeDiff = now - lastScrollTime;
      
      if (currentY > 40) {
        hasInteractedRef.current = true;
      }
      
      if (currentY > maxScrollY) {
        maxScrollY = currentY;
      }
      
      // If user has scrolled down past 100px and rapidly scrolls up (> 45px in < 300ms)
      if (maxScrollY > 100 && timeDiff > 0 && timeDiff < 300) {
        const scrollDiff = lastScrollY - currentY;
        if (scrollDiff > 45) {
          trigger();
        }
      }
      
      lastScrollY = currentY;
      lastScrollTime = now;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 3. BACK-BUTTON (POPSTATE) TRIGGER for Mobile & In-App WebViews
    try {
      if (!window.history.state?.exitGuarded) {
        window.history.pushState({ exitGuarded: true }, '', window.location.href);
      }
    } catch {
      // Ignore history pushState errors in sandboxed frames
    }

    const handlePopState = () => {
      if (!hasTriggeredRef.current && hasInteractedRef.current) {
        trigger();
      }
    };
    window.addEventListener('popstate', handlePopState);

    // 4. TIME-DELAY FALLBACK TRIGGER: 22s safety net
    // Only fires after visitor has interacted or scrolled
    const timeDelayTimer = setTimeout(() => {
      if (hasInteractedRef.current || window.scrollY > 40 || isPinterestBrowser()) {
        trigger();
      } else {
        // Wait for first interaction if visitor was completely idle
        const onFirstInteraction = () => {
          trigger();
          window.removeEventListener('scroll', onFirstInteraction);
          window.removeEventListener('touchstart', onFirstInteraction);
          window.removeEventListener('click', onFirstInteraction);
        };
        
        window.addEventListener('scroll', onFirstInteraction, { passive: true });
        window.addEventListener('touchstart', onFirstInteraction, { passive: true });
        window.addEventListener('click', onFirstInteraction, { passive: true });
      }
    }, 22000);

    return () => {
      if (pinterestTimer) clearTimeout(pinterestTimer);
      clearTimeout(mouseMoveTimer);
      clearTimeout(timeDelayTimer);
      if (mouseMoveAttached) {
        document.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
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

