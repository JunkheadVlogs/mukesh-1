const fs = require('fs');
const path = './src/hooks/useExitIntent.ts';
let content = fs.readFileSync(path, 'utf8');

const missingLogic = `
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
      if (hasInteractedRef.current || window.scrollY > 40) {
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
    };`;

const targetReturn = `    return () => {
      clearTimeout(mouseMoveTimer);
      if (mouseMoveAttached) {
        document.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('touchstart', recordInteraction);
      window.removeEventListener('click', recordInteraction);
      window.removeEventListener('keydown', recordInteraction);
    };`;

if (content.includes(targetReturn)) {
  content = content.replace(targetReturn, missingLogic);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Restored missing exit intent triggers');
} else {
  console.log('Target return not found');
}
