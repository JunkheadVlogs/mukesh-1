import React, { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, Check, Package, Sparkles, Truck, RotateCcw, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { Product } from "../store";
import { BUSINESS_INFO } from "../config/business";
import { getWhatsAppNumber } from "../config";
import { ProductDescription } from "./ProductDescription";

interface ProductAccordionProps {
  product: Product;
  category?: string;
}

export function ProductAccordion({ product, category }: ProductAccordionProps) {
  // First panel (Product Details) open by default on desktop for editorial experience
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true,
    fabric: false,
    delivery: false,
    contact: false,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const isSaree = 
    product.category?.toLowerCase().includes("saree") || 
    product.name?.toLowerCase().includes("saree") || 
    true;

  return (
    <div className="w-full font-sans divide-y divide-[#dfd9d5] border-t border-b border-[#dfd9d5]">
      {/* 1. Product Details */}
      <div className="py-0">
        <h3>
          <button
            type="button"
            aria-expanded={Boolean(openSections.details)}
            aria-controls="accordion-panel-details"
            id="accordion-header-details"
            onClick={() => toggleSection("details")}
            className="w-full min-h-[52px] px-4 flex items-center justify-between text-left font-sans text-[14px] font-medium text-[#1f1b1b] hover:text-[#8a2633] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2633] cursor-pointer"
          >
            <span>Product Details</span>
            <ChevronDown 
              size={18} 
              className={`text-[#6b6461] transition-transform duration-200 shrink-0 ${
                openSections.details ? "rotate-180" : ""
              }`} 
            />
          </button>
        </h3>
        {openSections.details && (
          <div
            id="accordion-panel-details"
            role="region"
            aria-labelledby="accordion-header-details"
            className="px-4 pb-4 pt-0 text-[14px] leading-[1.6] text-[#6b6461] space-y-4"
          >
            {/* Authentic description without repeating specs */}
            <ProductDescription description={product.description} product={product} />

            {/* What You Receive - Compact Package Checklist */}
            <div className="pt-3 border-t border-[#dfd9d5]/60">
              <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#6b6461] mb-2 flex items-center gap-1.5">
                <Package size={14} className="text-[#8a2633]" />
                <span>Package Inclusions</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 m-0 list-none text-[13px] text-[#1f1b1b]">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-700 stroke-[2.5] shrink-0 mt-0.5" />
                  <span>1x Saree drape piece ({isSaree ? "5.50 Meters" : "Standard"})</span>
                </li>
                {isSaree && (
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-700 stroke-[2.5] shrink-0 mt-0.5" />
                    <span>1x Matching unstitched blouse piece (1.00 Meter)</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-700 stroke-[2.5] shrink-0 mt-0.5" />
                  <span>Quality inspection verified by Nagpur boutique</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-700 stroke-[2.5] shrink-0 mt-0.5" />
                  <span>Tamper-evident waterproof protective packaging</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 2. Fabric and Care */}
      <div className="py-0">
        <h3>
          <button
            type="button"
            aria-expanded={Boolean(openSections.fabric)}
            aria-controls="accordion-panel-fabric"
            id="accordion-header-fabric"
            onClick={() => toggleSection("fabric")}
            className="w-full min-h-[52px] px-4 flex items-center justify-between text-left font-sans text-[14px] font-medium text-[#1f1b1b] hover:text-[#8a2633] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2633] cursor-pointer"
          >
            <span>Fabric and Care</span>
            <ChevronDown 
              size={18} 
              className={`text-[#6b6461] transition-transform duration-200 shrink-0 ${
                openSections.fabric ? "rotate-180" : ""
              }`} 
            />
          </button>
        </h3>
        {openSections.fabric && (
          <div
            id="accordion-panel-fabric"
            role="region"
            aria-labelledby="accordion-header-fabric"
            className="px-4 pb-4 pt-0 text-[14px] leading-[1.6] text-[#6b6461] space-y-3"
          >
            <div className="space-y-1.5 text-[#1f1b1b]">
              <div className="flex items-baseline text-[13px]">
                <span className="text-[#6b6461] w-28 shrink-0">Fabric:</span>
                <span className="font-medium">{product.fabric || "Pure Handloom"}</span>
              </div>
              {(product as any).craft && (
                <div className="flex items-baseline text-[13px]">
                  <span className="text-[#6b6461] w-28 shrink-0">Craft / Weave:</span>
                  <span className="font-medium">{(product as any).craft}</span>
                </div>
              )}
              {product.color && (
                <div className="flex items-baseline text-[13px]">
                  <span className="text-[#6b6461] w-28 shrink-0">Base Colour:</span>
                  <span className="font-medium">{product.color}</span>
                </div>
              )}
              {product.blouseDetails && (
                <div className="flex items-baseline text-[13px]">
                  <span className="text-[#6b6461] w-28 shrink-0">Blouse:</span>
                  <span className="font-medium">{product.blouseDetails}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#dfd9d5]/60 text-[13px] text-[#1f1b1b]/90 space-y-2">
              <p className="m-0">
                <strong>Wash & Care:</strong> First wash strictly dry clean to preserve fabric lustre and zari brilliance. Subsequent gentle hand washes in cold water with mild baby shampoo or specialized silk detergent. Never wring or machine spin. Always dry in indirect shade.
              </p>
              <div className="pt-1">
                <Link
                  to="/guides/saree-care-guide/"
                  className="text-[12px] font-medium text-[#8a2633] hover:underline underline-offset-2"
                >
                  Read Detailed Saree Care Guide →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Delivery and Returns */}
      <div className="py-0">
        <h3>
          <button
            type="button"
            aria-expanded={Boolean(openSections.delivery)}
            aria-controls="accordion-panel-delivery"
            id="accordion-header-delivery"
            onClick={() => toggleSection("delivery")}
            className="w-full min-h-[52px] px-4 flex items-center justify-between text-left font-sans text-[14px] font-medium text-[#1f1b1b] hover:text-[#8a2633] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2633] cursor-pointer"
          >
            <span>Delivery and Returns</span>
            <ChevronDown 
              size={18} 
              className={`text-[#6b6461] transition-transform duration-200 shrink-0 ${
                openSections.delivery ? "rotate-180" : ""
              }`} 
            />
          </button>
        </h3>
        {openSections.delivery && (
          <div
            id="accordion-panel-delivery"
            role="region"
            aria-labelledby="accordion-header-delivery"
            className="px-4 pb-4 pt-0 text-[14px] leading-[1.6] text-[#6b6461] space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Truck size={16} className="text-[#8a2633] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[13px] text-[#1f1b1b]">Dispatch & Shipping Timeline</strong>
                  <p className="text-[13px] text-[#6b6461] m-0">
                    Dispatched within 24 to 48 hours from our Nagpur facility. 100% Free Shipping on all orders across India. Typical delivery time is 3 to 7 business days (2 to 4 days for metro cities) via Delhivery, BlueDart, or DTDC.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-[#dfd9d5]/60">
                <RotateCcw size={16} className="text-[#8a2633] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[13px] text-[#1f1b1b]">7-Day Return & Exchange Policy</strong>
                  <p className="text-[13px] text-[#6b6461] m-0">
                    Eligible for return or exchange within 7 days of delivery, provided the item is in unworn, unwashed condition with original fold and tags intact. Custom-stitched blouses or altered items are non-returnable.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-[12px]">
              <Link to="/shipping-policy/" className="text-[#8a2633] hover:underline underline-offset-2 font-medium">
                View Shipping Policy →
              </Link>
              <Link to="/return-policy/" className="text-[#8a2633] hover:underline underline-offset-2 font-medium">
                View Return & Refund Policy →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 4. Contact and Help */}
      <div className="py-0">
        <h3>
          <button
            type="button"
            aria-expanded={Boolean(openSections.contact)}
            aria-controls="accordion-panel-contact"
            id="accordion-header-contact"
            onClick={() => toggleSection("contact")}
            className="w-full min-h-[52px] px-4 flex items-center justify-between text-left font-sans text-[14px] font-medium text-[#1f1b1b] hover:text-[#8a2633] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a2633] cursor-pointer"
          >
            <span>Contact and Help</span>
            <ChevronDown 
              size={18} 
              className={`text-[#6b6461] transition-transform duration-200 shrink-0 ${
                openSections.contact ? "rotate-180" : ""
              }`} 
            />
          </button>
        </h3>
        {openSections.contact && (
          <div
            id="accordion-panel-contact"
            role="region"
            aria-labelledby="accordion-header-contact"
            className="px-4 pb-4 pt-0 text-[14px] leading-[1.6] text-[#6b6461] space-y-3"
          >
            <p className="text-[13px] text-[#6b6461] m-0">
              Need assistance with saree draping tips, fabric authentication, blouse customization, or order queries? Our Nagpur boutique team is available to help.
            </p>

            <div className="space-y-1.5 text-[13px] text-[#1f1b1b]">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[#8a2633] shrink-0" />
                <span>Call: <strong>{BUSINESS_INFO.phone}</strong> (Mon–Sat, 10:30 AM – 8:30 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#8a2633] shrink-0" />
                <span>Email: <strong>{BUSINESS_INFO.email}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-[#8a2633] shrink-0 mt-0.5" />
                <span>Boutique: {BUSINESS_INFO.address.fullAddress}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(
                  `Hi Mukesh Saree Centre, I need assistance regarding: ${product.name} (SKU: ${product.sku || 'N/A'})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-emerald-50 text-emerald-800 border border-emerald-300 text-[12px] font-medium hover:bg-emerald-100 transition-colors no-underline"
              >
                <MessageCircle size={14} />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                to="/why-mukesh-saree-centre/"
                className="inline-flex items-center gap-1 text-[12px] text-[#8a2633] hover:underline underline-offset-2 font-medium self-center"
              >
                About Our 1978 Heritage →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
