import React from "react";
import { Product } from "../store";
import { Check, Package } from "lucide-react";

interface ProductDetailsSectionProps {
  product: Product;
  className?: string;
}

export function ProductDetailsSection({ product, className = "" }: ProductDetailsSectionProps) {
  const isSaree = 
    product.category?.toLowerCase().includes("saree") || 
    product.name?.toLowerCase().includes("saree") || 
    true;

  return (
    <div className={`border border-[var(--color-border)] rounded-sm bg-white p-3.5 sm:p-4 my-2 text-[var(--color-dark)] font-sans ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)] mb-2.5">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-[#C8A96B]" />
          <h3 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--color-dark)] m-0">
            What You Receive
          </h3>
        </div>
      </div>

      {/* Package Contents Checklist */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 m-0 list-none text-[12px] sm:text-[12.5px] text-[var(--color-dark)]/90">
        <li className="flex items-start gap-2">
          <Check size={14} className="text-emerald-600 stroke-[2.5] shrink-0 mt-0.5" />
          <span>1x Saree drape piece (unstitched)</span>
        </li>
        {isSaree && (
          <li className="flex items-start gap-2">
            <Check size={14} className="text-emerald-600 stroke-[2.5] shrink-0 mt-0.5" />
            <span>1x Matching unstitched blouse piece</span>
          </li>
        )}
        <li className="flex items-start gap-2">
          <Check size={14} className="text-emerald-600 stroke-[2.5] shrink-0 mt-0.5" />
          <span>Quality inspection seal by Nagpur dispatch team</span>
        </li>
        <li className="flex items-start gap-2">
          <Check size={14} className="text-emerald-600 stroke-[2.5] shrink-0 mt-0.5" />
          <span>Protective waterproof shipping parcel</span>
        </li>
      </ul>
    </div>
  );
}

