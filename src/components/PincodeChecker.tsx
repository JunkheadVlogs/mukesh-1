import React, { useState, useEffect } from "react";
import { MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { safeLocalStorage } from "../utils/safeStorage";

interface PincodeCheckerProps {
  isCodAvailable?: boolean;
  className?: string;
}

export function PincodeChecker({ isCodAvailable = true, className = "" }: PincodeCheckerProps) {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "valid" | "invalid" | "unavailable">("idle");
  const [checkedPincode, setCheckedPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  // Initialize with stored user pincode if available
  useEffect(() => {
    try {
      const saved = safeLocalStorage.getItem("ms_user_pincode");
      if (saved && /^[1-9][0-9]{5}$/.test(saved)) {
        setPincode(saved);
        setCheckedPincode(saved);
        calculateDeliveryDate();
        setStatus("valid");
      }
    } catch {
      // ignore
    }
  }, []);

  const calculateDeliveryDate = () => {
    // Standard delivery is 3 to 7 business days; estimated delivery date is 4 days out
    const date = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    const formatted = date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    setDeliveryDate(formatted);
  };

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = pincode.trim();

    // Check 6-digit Indian postal code format
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      setStatus("invalid");
      return;
    }

    // Example unserviceable pattern (e.g. testing with 000000 or specific invalid ranges)
    if (clean === "000000" || clean.startsWith("0")) {
      setStatus("unavailable");
      return;
    }

    setStatus("loading");

    // Fast simulated serviceability verification
    setTimeout(() => {
      calculateDeliveryDate();
      setCheckedPincode(clean);
      setStatus("valid");
      safeLocalStorage.setItem("ms_user_pincode", clean);
    }, 350);
  };

  const handleReset = () => {
    setStatus("idle");
  };

  return (
    <div className={`mt-5 pt-4 border-t border-[#dfd9d5] ${className}`}>
      <div className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#1f1b1b] mb-2.5 select-none">
        <MapPin size={14} className="text-[#8a2633]" />
        <span>Check Delivery & Cash on Delivery Availability</span>
      </div>

      {status === "valid" ? (
        <div className="bg-[#faf8f6] border border-[#dfd9d5] rounded-[2px] p-3 text-[13px] space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <CheckCircle2 size={16} className="text-emerald-700" />
              <span>Delivering to <strong>{checkedPincode}</strong></span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-medium text-[#8a2633] underline underline-offset-2 hover:text-[#6f1d29] cursor-pointer"
            >
              Change
            </button>
          </div>
          
          <div className="text-[#1f1b1b] text-[12px] pl-5 space-y-0.5">
            <p className="m-0">
              Estimated Delivery: <strong className="text-[#1f1b1b]">{deliveryDate}</strong> (Free Shipping)
            </p>
            <p className="m-0 text-[#6b6461]">
              {isCodAvailable ? "✓ Cash on Delivery (COD) is available" : "⚡ Special promotional item: Prepaid orders only"}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCheck} className="space-y-2">
          <div className="flex items-stretch gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setPincode(val);
                  if (status !== "idle" && status !== "loading") setStatus("idle");
                }}
                placeholder="Enter 6-digit Pincode"
                className={`w-full h-[46px] px-3 bg-white border rounded-[2px] text-[14px] text-[#1f1b1b] placeholder:text-[#6b6461]/60 focus:outline-none focus:ring-1 transition-colors ${
                  status === "invalid" || status === "unavailable"
                    ? "border-[#8a2633] focus:ring-[#8a2633]"
                    : "border-[#dfd9d5] focus:border-[#8a2633] focus:ring-[#8a2633]"
                }`}
                aria-label="Enter Indian Postal Pincode"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading" || !pincode}
              className="h-[46px] px-5 bg-white hover:bg-[#faf8f6] disabled:bg-[#faf8f6] disabled:text-[#6b6461]/50 text-[#1f1b1b] hover:text-[#8a2633] border border-[#dfd9d5] hover:border-[#8a2633] font-medium text-[13px] uppercase tracking-[0.08em] rounded-[2px] transition-colors flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <Loader2 size={16} className="animate-spin text-[#8a2633]" />
              ) : (
                "Check"
              )}
            </button>
          </div>

          {status === "invalid" && (
            <div className="flex items-center gap-1.5 text-[12px] text-[#8a2633] pt-0.5">
              <AlertCircle size={14} className="shrink-0" />
              <span>Please enter a valid 6-digit Indian postal pincode (e.g. 440002).</span>
            </div>
          )}

          {status === "unavailable" && (
            <div className="flex items-center gap-1.5 text-[12px] text-[#8a2633] pt-0.5">
              <AlertCircle size={14} className="shrink-0" />
              <span>Standard delivery is currently unavailable to this postal code. Please contact us on WhatsApp for specialized courier dispatch.</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
