import React from 'react';

interface LinenStylingGuideProps {
  className?: string;
  compact?: boolean;
}

export function LinenStylingGuide({ className = '', compact = false }: LinenStylingGuideProps) {
  return (
    <div className={`bg-[#FAF7F2] border border-[#EAE4DC] rounded-sm p-3.5 sm:p-4 my-3 font-sans text-[#2C241B] ${className}`}>
      <div className="flex items-center gap-2 mb-2.5 pb-1.5 border-b border-[#EAE4DC]/60">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" />
        <h4 className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2C241B]">
          Linen Saree Styling & Occasion Guide
        </h4>
      </div>

      <div className="text-[12px] sm:text-[13px] leading-relaxed">
        {/* BEST STYLED FOR */}
        <div className="space-y-1.5">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-[#8C733E]">
            BEST STYLED FOR
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#4A4238]">
            <li className="flex items-start gap-1.5">
              <span className="text-[#C8A96B] font-bold select-none">—</span>
              <span>Office wear & corporate work meetings</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#C8A96B] font-bold select-none">—</span>
              <span>Regular daily wear & everyday comfort</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#C8A96B] font-bold select-none">—</span>
              <span>Formal conferences & professional events</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#C8A96B] font-bold select-none">—</span>
              <span>Casual family gatherings & day outings</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#C8A96B] font-bold select-none">—</span>
              <span>Travel & breathable all-day elegance</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#C8A96B] font-bold select-none">—</span>
              <span>Light festive occasions & functions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
