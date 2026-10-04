import React from "react";
import { Link } from "react-router";
import { Product } from "../store";
import { Check, ShieldCheck, Truck, RefreshCw, Scissors, Sparkles, AlertCircle, HelpCircle } from "lucide-react";
import { BUSINESS_INFO } from "../config/business";

interface ProductDetailsSectionProps {
  product: Product;
  className?: string;
}

export function ProductDetailsSection({ product, className = "" }: ProductDetailsSectionProps) {
  const isSaree = 
    product.category?.toLowerCase().includes("saree") || 
    product.name?.toLowerCase().includes("saree") || 
    true;

  const fabricName = product.fabric || "Premium Hand-Selected Fabric";
  const colorName = product.color || "As Displayed";
  const isCodAvailable = product.codAvailable !== false;

  // Fabric care advice tailored strictly to the factual fabric name
  const getFactualCareAdvice = (fabric: string) => {
    const f = fabric.toLowerCase();
    if (f.includes("silk") || f.includes("banarasi") || f.includes("paithani") || f.includes("tissue") || f.includes("organza")) {
      return "Dry clean strictly recommended to preserve natural sheen, delicate zari, and fabric life.";
    }
    if (f.includes("chiffon") || f.includes("georgette")) {
      return "First wash dry clean recommended. Subsequent washes: gentle cold hand wash; do not wring or dry in direct sun.";
    }
    if (f.includes("linen")) {
      return "First wash dry clean. Subsequent gentle hand wash in cold water with mild detergent; iron while slightly damp.";
    }
    if (f.includes("cotton")) {
      return "Gentle cold water hand wash or mild cycle; wash dark colors separately; shade dry.";
    }
    return "Gentle cold water hand wash or dry clean recommended; avoid bleach and harsh sunlight.";
  };

  const careText = getFactualCareAdvice(fabricName);

  return (
    <div className={`border border-[var(--color-border)] rounded-sm bg-white p-3.5 sm:p-4 my-2 text-[var(--color-dark)] font-sans ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--color-border)] mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#C8A96B]" />
          <h3 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--color-dark)] m-0">
            Factual Product Details & What You Receive
          </h3>
        </div>
        <Link 
          to="/fabric-authenticity-and-care/" 
          className="text-[11px] text-[#C8A96B] hover:text-[#9A7B3E] underline font-medium tracking-wide flex items-center gap-1"
        >
          Fabric Guide
        </Link>
      </div>

      {/* Grid of Key Factual Specifications */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[12px] sm:text-[13px] pb-3 border-b border-black/5">
        <div>
          <span className="text-black/60 text-[11px] block uppercase tracking-wider font-medium">Fabric Type</span>
          <span className="font-medium text-[var(--color-dark)]">{fabricName}</span>
        </div>

        <div>
          <span className="text-black/60 text-[11px] block uppercase tracking-wider font-medium">Primary Colour</span>
          <span className="font-medium text-[var(--color-dark)]">{colorName}</span>
        </div>

        {isSaree && (
          <>
            <div>
              <span className="text-black/60 text-[11px] block uppercase tracking-wider font-medium">Saree Length</span>
              <span className="font-medium text-[var(--color-dark)]">5.50 Metres (Standard Drape)</span>
            </div>

            <div>
              <span className="text-black/60 text-[11px] block uppercase tracking-wider font-medium">Blouse Piece</span>
              <span className="font-medium text-[var(--color-dark)]">0.80 – 1.00 Metre (Unstitched)</span>
            </div>
          </>
        )}

        <div>
          <span className="text-black/60 text-[11px] block uppercase tracking-wider font-medium">Wash & Care</span>
          <span className="font-normal text-[var(--color-dark)]/90 leading-tight block text-[11.5px] sm:text-[12px]">
            {careText}
          </span>
        </div>

        <div>
          <span className="text-black/60 text-[11px] block uppercase tracking-wider font-medium">Payment & COD</span>
          <span className={`font-medium ${isCodAvailable ? "text-emerald-700" : "text-amber-800"}`}>
            {isCodAvailable ? "✓ Cash on Delivery (COD) Available" : "Prepaid Online Order Only"}
          </span>
        </div>
      </div>

      {/* "What You Receive" Package Checklist */}
      <div className="pt-3 pb-2.5 border-b border-black/5">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C8A96B] mb-2 flex items-center gap-1.5">
          <Check size={14} className="text-emerald-600 stroke-[2.5]" />
          Package Contents (What You Receive):
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-0 m-0 list-none text-[12px] text-[var(--color-dark)]/85">
          <li className="flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold shrink-0">✓</span>
            <span>1x Authentic {fabricName} unstitched drape</span>
          </li>
          {isSaree && (
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>1x Matching unstitched blouse fabric piece</span>
            </li>
          )}
          <li className="flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold shrink-0">✓</span>
            <span>Manual inspection seal by Nagpur dispatch team</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-emerald-600 font-bold shrink-0">✓</span>
            <span>Protective waterproof shipping parcel</span>
          </li>
        </ul>
      </div>

      {/* Trust & Policy Assurance */}
      <div className="pt-2.5 flex flex-wrap items-center justify-between gap-y-1 text-[11.5px] text-[var(--color-dark)]/80">
        <div className="flex items-center gap-1.5">
          <Truck size={14} className="text-[#C8A96B] shrink-0" />
          <span><strong>Delivery:</strong> 3–7 business days pan-India</span>
        </div>

        <div className="flex items-center gap-1.5">
          <RefreshCw size={14} className="text-[#C8A96B] shrink-0" />
          <span><strong>Returns:</strong> 7-day return policy for unworn items</span>
        </div>

        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#C8A96B] shrink-0" />
          <span><strong>Heritage:</strong> Nagpur store since 1978</span>
        </div>
      </div>

      {/* Contextual Trust Links */}
      <div className="mt-3 pt-2.5 border-t border-black/5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-[var(--color-dark)]/70">
        <span className="font-semibold text-[var(--color-dark)] text-[10.5px] uppercase tracking-wider">Helpful Links:</span>
        <Link to="/fabric-authenticity-and-care/" className="hover:text-[#C8A96B] underline underline-offset-2">Fabric Guide</Link>
        <span className="text-black/30">•</span>
        <Link to="/guides/saree-care-guide/" className="hover:text-[#C8A96B] underline underline-offset-2">Care Guide</Link>
        <span className="text-black/30">•</span>
        <Link to="/return-policy/" className="hover:text-[#C8A96B] underline underline-offset-2">Return Policy</Link>
        <span className="text-black/30">•</span>
        <Link to="/reviews/" className="hover:text-[#C8A96B] underline underline-offset-2">Customer Reviews</Link>
        <span className="text-black/30">•</span>
        <Link to="/media/" className="hover:text-[#C8A96B] underline underline-offset-2">Media & Press</Link>
        <span className="text-black/30">•</span>
        <Link to="/why-mukesh-saree-centre/" className="hover:text-[#C8A96B] underline underline-offset-2">Why Choose Us</Link>
        <span className="text-black/30">•</span>
        <Link to="/about/" className="hover:text-[#C8A96B] underline underline-offset-2">About Us</Link>
      </div>
    </div>
  );
}
