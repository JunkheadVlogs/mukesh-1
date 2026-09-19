import React, { useState, useEffect } from "react";

interface FestiveOfferCountdownProps {
  initialMinutes?: number;
  storageKey?: string;
}

export const FestiveOfferCountdown: React.FC<FestiveOfferCountdownProps> = ({
  initialMinutes = 120, // 2-hour default offer period (configurable)
  storageKey = "festive_countdown_end_sar_lin_brd_062",
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isOfferExtended, setIsOfferExtended] = useState(false);

  useEffect(() => {
    const periodMs = initialMinutes * 60 * 1000;
    const extendedKey = `${storageKey}_extended`;

    // 1. Retrieve or initialize the target end timestamp
    let endTimestamp: number;
    try {
      const stored = localStorage.getItem(storageKey);
      const parsed = stored ? parseInt(stored, 10) : null;
      const now = Date.now();
      if (parsed && !isNaN(parsed) && parsed > now) {
        endTimestamp = parsed;
      } else {
        // If expired or not set, calculate new cycle
        endTimestamp = now + periodMs;
        localStorage.setItem(storageKey, endTimestamp.toString());
        if (parsed && parsed <= now) {
          localStorage.setItem(extendedKey, "true");
        }
      }
      setIsOfferExtended(localStorage.getItem(extendedKey) === "true");
    } catch {
      endTimestamp = Date.now() + periodMs;
    }

    const calculateTime = () => {
      const now = Date.now();
      let diff = endTimestamp - now;

      // When countdown reaches zero, automatically start a new period cycle
      if (diff <= 0) {
        // Calculate new end timestamp (multiples of periodMs from past endTimestamp to prevent drift)
        const cyclesPassed = Math.floor(Math.abs(diff) / periodMs) + 1;
        endTimestamp = endTimestamp + cyclesPassed * periodMs;
        try {
          localStorage.setItem(storageKey, endTimestamp.toString());
          localStorage.setItem(extendedKey, "true");
        } catch {
          // ignore localStorage failure
        }
        setIsOfferExtended(true);
        diff = endTimestamp - now;
      }

      const totalSec = Math.max(0, Math.floor(diff / 1000));
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      setTimeLeft({ hours, minutes, seconds });
    };

    // Immediate calculation
    calculateTime();

    // Run every second
    const interval = setInterval(() => {
      calculateTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [initialMinutes, storageKey]);

  const formatDigits = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div
      id="festive-offer-countdown-box"
      className="w-full bg-[#FAF5EE] border border-[#E4D1B9] rounded-md px-3 py-1.5 sm:px-3.5 sm:py-2 my-0 flex items-center justify-between gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-[14px] sm:text-[15px] leading-none shrink-0 select-none">
          {isOfferExtended ? "✨" : "⏱"}
        </span>
        <span className="text-[11.5px] sm:text-[12.5px] font-semibold tracking-wide text-[#3C2A1E] truncate">
          {isOfferExtended ? "Offer Extended — Ends In:" : "Festive Special Price Ends In:"}
        </span>
      </div>

      <div className="shrink-0 flex items-center">
        {timeLeft ? (
          <span className="font-mono text-[12px] sm:text-[13px] font-extrabold text-[#9A2A2A] bg-[#FFF8F8] border border-[#F5C2C2] px-2 py-0.5 rounded shadow-2xs whitespace-nowrap">
            {timeLeft.hours > 0 ? `${timeLeft.hours}h ` : ""}
            {formatDigits(timeLeft.minutes)}m {formatDigits(timeLeft.seconds)}s
          </span>
        ) : (
          <span className="font-mono text-[12px] sm:text-[13px] font-extrabold text-[#9A2A2A] bg-[#FFF8F8] border border-[#F5C2C2] px-2 py-0.5 rounded shadow-2xs whitespace-nowrap">
            1h 59m 59s
          </span>
        )}
      </div>
    </div>
  );
};
