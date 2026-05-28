import { useEffect, useState } from 'react';
import { safeSessionStorage } from '../utils/safeStorage';

interface UseExitIntentOptions {
  delay?: number;
  sensitivity?: number;
}

export function useExitIntent({ delay = 3000, sensitivity = 20 }: UseExitIntentOptions = {}) {
  const [triggered, setTriggered] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const shown = safeSessionStorage.getItem('exit_intent_shown');
    if (shown) {
      setHasShown(true);
      return;
    }

    const readyTime = Date.now() + delay;

    // DESKTOP: mouse leaves viewport top
    const handleMouseMove = (e: MouseEvent) => {
      if (hasShown) return;
      if (Date.now() < readyTime) return;
      if (e.clientY < sensitivity) {
        setTriggered(true);
        setHasShown(true);
        safeSessionStorage.setItem('exit_intent_shown', '1');
      }
    };

    // MOBILE: user scrolls UP fast (intent to go back)
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (hasShown) return;
      const currentY = window.scrollY;
      const diff = lastScrollY - currentY;
      if (diff > 80 && currentY < 200) { // Fast scroll up near top
        setTriggered(true);
        setHasShown(true);
        safeSessionStorage.setItem('exit_intent_shown', '1');
      }
      lastScrollY = currentY;
    };

    // TIME-BASED: trigger after 45s of inactivity on page
    const inactivityTimer = setTimeout(() => {
      if (!hasShown) {
        setTriggered(true);
        setHasShown(true);
        safeSessionStorage.setItem('exit_intent_shown', '1');
      }
    }, 45000);

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(inactivityTimer);
    };
  }, [delay, sensitivity, hasShown]);

  const dismiss = () => {
    setTriggered(false);
    safeSessionStorage.setItem('exit_intent_shown', '1');
  };

  return { triggered, dismiss };
}
