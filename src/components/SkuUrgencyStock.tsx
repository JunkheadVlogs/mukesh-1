import React from "react";

interface SkuUrgencyStockProps {
  stockCount?: number;
}

export const SkuUrgencyStock: React.FC<SkuUrgencyStockProps> = ({ stockCount = 9 }) => {
  return (
    <div
      id="sku-urgency-stock-box"
      className="w-full bg-[#FFF8F5] border border-[#F5D0C0] rounded-md px-3 py-1.5 sm:px-3.5 sm:py-2 mb-1.5 sm:mb-2 flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <span className="text-[14px] sm:text-[15px] leading-none shrink-0 select-none">⚠️</span>
      <span className="text-[12px] sm:text-[12.5px] font-semibold text-[#8A2B12] tracking-wide leading-snug">
        Hurry! Only <span className="font-extrabold text-[#75210B]">{stockCount} sets</span> left at this offer price
      </span>
    </div>
  );
};
