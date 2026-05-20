import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  productId?: string;
}

// A pool of realistic luxury fashion hub cities in India
const INDIAN_CITIES = ["Nagpur", "Pune", "Hyderabad", "Bangalore", "Mumbai", "Delhi"];

export const LiveViewerCounter: React.FC<Props> = ({ productId }) => {
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(7);
  
  // Track previous numbers to fluctuate organically
  const numRef = useRef(7);

  // Fetch approximate visitor location via IP-based geolocation
  useEffect(() => {
    let active = true;

    const fetchGeoIP = async () => {
      // Try ipapi.co (supports SSL/HTTPS securely)
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          if (active && data && data.city && typeof data.city === "string") {
            setDetectedCity(data.city);
            return;
          }
        }
      } catch (err) {
        // Silent catch for ad-blockers or connection issues
      }

      // Try fallback IP geo-db
      try {
        const res = await fetch("https://geolocation-db.com/json/");
        if (res.ok) {
          const data = await res.json();
          if (active && data && data.city && data.city !== "Not found" && data.city !== "null") {
            setDetectedCity(data.city);
            return;
          }
        }
      } catch (err) {
        // Silent catch
      }

      // Elegant browser geolocation query as passive fallback if permitted before
      if (navigator.geolocation && navigator.permissions) {
        try {
          const status = await navigator.permissions.query({ name: "geolocation" });
          if (status.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                // Since browser coords don't give city names instantly without reverse-geocoding,
                // we keep Nagpur/user's area as the closest fallback
                if (active) setDetectedCity("your area");
              },
              () => {},
              { timeout: 3000 }
            );
          }
        } catch (e) {
          // Silent catch
        }
      }
    };

    fetchGeoIP();

    return () => {
      active = false;
    };
  }, []);

  // Generate a random, ultra-realistic number between 5 and 28 with natural fluctuations
  const getNextRealisticNumber = (prev: number) => {
    const change = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
    let next = prev + change;
    if (next < 5) next = 5 + Math.floor(Math.random() * 3);
    if (next > 28) next = 28 - Math.floor(Math.random() * 3);
    return next;
  };

  // Setup loop to rotate messages smoothly every 2.5 to 3.5 seconds
  useEffect(() => {
    // Set initial realistic number
    const initialNum = Math.floor(Math.random() * 12) + 6; // 6 to 17
    setCurrentNumber(initialNum);
    numRef.current = initialNum;

    const rotateMessage = () => {
      // Rotate index gracefully
      setCurrentMessageIndex((prev) => (prev + 1) % 9);
      
      // Fluctuate the visual numbers organically
      const nextNum = getNextRealisticNumber(numRef.current);
      setCurrentNumber(nextNum);
      numRef.current = nextNum;
    };

    // Use a slight randomized duration interval (between 2500ms and 3500ms) to feel fully natural
    const intervalTime = 2800 + Math.floor(Math.random() * 800);
    const timer = setInterval(rotateMessage, intervalTime);

    return () => clearInterval(timer);
  }, [productId]);

  // Evaluates the current text message dynamically 
  const getMessageContent = () => {
    switch (currentMessageIndex) {
      case 0:
        return {
          icon: "👀",
          text: `${currentNumber} people in your area are checking this right now`
        };
      case 1:
        return {
          icon: "👀",
          text: `${currentNumber} shoppers near Nagpur are checking this product`
        };
      case 2:
        return {
          icon: "🔥",
          text: `Trending in Nagpur today`
        };
      case 3:
        return {
          icon: "💫",
          text: `Popular among shoppers in your area`
        };
      case 4:
        return {
          icon: "⚡",
          text: `High demand product in your area right now`
        };
      case 5:
        return {
          icon: "🛍️",
          text: `Recently viewed in your area`
        };
      case 6:
        return {
          icon: "⏳",
          text: `Only few pieces left in stock`
        };
      case 7:
        return {
          icon: "✨",
          text: `Bestseller this week`
        };
      case 8:
        return {
          icon: "🔥",
          text: `This product is getting attention near Nagpur`
        };
      default:
        return {
          icon: "👀",
          text: `Highly viewed item in your area`
        };
    }
  };

  const currentItem = getMessageContent();

  return (
    <div className="inline-flex items-center min-h-[20px] mt-1 mb-0.5">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-flex items-center gap-1.5 bg-[#FAF6F0] border border-[#C8A96B]/35 rounded-full px-2.5 py-0.5 text-[10.5px] font-medium tracking-wide text-primary-950 shadow-[0_1px_4px_rgba(200,169,107,0.12)]"
        >
          <span className="text-[12px] leading-none select-none filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">{currentItem.icon}</span>
          <span className="font-sans leading-none mt-[0.5px] whitespace-nowrap">
            {currentItem.text}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Return null to completely remove older, static or hyper-inflated widgets
export const LowStockMessage: React.FC<Props> = () => {
  return null;
};

export const CartActivityMessage: React.FC<Props> = () => {
  return null;
};
