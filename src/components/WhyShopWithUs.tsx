import React from "react";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

export function WhyShopWithUs() {
  const benefits = [
    {
      icon: <Truck className="w-4 h-4 text-[#c8a96b]" strokeWidth={1.5} />,
      title: "Free Shipping All India",
      description: "Delivered securely via BlueDart & Delhivery with real-time tracking.",
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-[#c8a96b]" strokeWidth={1.5} />,
      title: "COD Available",
      description: "Pay cash or scan-and-pay UPI only when your package is delivered.",
    },
    {
      icon: <RotateCcw className="w-4 h-4 text-[#c8a96b]" strokeWidth={1.5} />,
      title: "7-day Easy Returns",
      description: "Hassle-free doorstep reverse pickup and complete peace of mind.",
    },
  ];

  return (
    <div className="why-shop-container mt-2 mb-2 p-4 border border-[var(--color-border)] bg-[#faf8f4]/60 backdrop-blur-xs rounded-sm">
      <h3 className="font-serif text-[13px] md:text-[14px] font-medium tracking-[0.15em] text-[var(--color-dark)] uppercase mb-4 text-center">
        Why Shop With Us
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[var(--color-border)] bg-white flex items-center justify-center">
              {benefit.icon}
            </div>
            <div>
              <h4 className="font-sans text-[11px] md:text-[12px] font-semibold text-[var(--color-dark)] tracking-[0.05em] uppercase mb-1">
                {benefit.title}
              </h4>
              <p className="font-sans text-[11px] text-[#8e8279] leading-relaxed font-light">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
