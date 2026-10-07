import { BUSINESS_INFO } from "../config/business";
import React, { useState } from "react";
import { Link } from "react-router";
import { Plus, Minus } from "lucide-react";
import { Product } from "../store";

export function ProductAccordion({ category, product }: { category?: string; product?: Product }) {
  const [openPanel, setOpenPanel] = useState<number | null>(null);

  const togglePanel = (index: number) => {
    setOpenPanel(openPanel === index ? null : index);
  };

  const isSaree = category?.toLowerCase().includes("saree") || product?.name?.toLowerCase().includes("saree") || true;

  const benefitsText = "Experience the perfect balance of heritage and comfort. Our meticulously crafted designs ensure you look effortlessly stylish while enjoying all-day breathability. This garment is an investment in timeless fashion that won't fade with changing seasons.";
  
  const whoShouldBuy = isSaree
    ? "Ideal for women who appreciate rich Indian textiles, brides-to-be building their trousseau, or anyone attending a festive or traditional gathering seeking a regal, put-together appearance."
    : "Perfect for the modern woman who values comfort without compromising on style. Great for office professionals, travelers, and women looking for chic, ready-to-wear everyday fashion.";

  const panels: { title: string; content: React.ReactNode }[] = [
    {
      title: "Why You'll Love It",
      content: (
        <div>
          <div className="whitespace-pre-wrap">{`${benefitsText}\n\nWho should buy: ${whoShouldBuy}`}</div>
          <div className="mt-2 pt-2 border-t border-black/5 flex flex-wrap items-center gap-3 text-[12px]">
            <Link to="/why-mukesh-saree-centre/" className="text-[#C8A96B] hover:text-[#9A7B3E] underline font-medium">
              Why Mukesh Saree Centre Since 1978 →
            </Link>
            <Link to="/reviews/" className="text-[#C8A96B] hover:text-[#9A7B3E] underline font-medium">
              Read Customer Reviews →
            </Link>
          </div>
        </div>
      )
    },
    {
      title: "Wash & Care Instructions",
      content: (
        <div>
          <p className="m-0">First wash strictly dry clean to lock in colors and preserve the fabric sheen. Subsequent washes can be gentle hand washes in cold water using a mild baby shampoo or specialized silk/cotton detergent. Do not wring or twist. Dry strictly in the shade to prevent sun bleaching.</p>
          <div className="mt-2 pt-2 border-t border-black/5 flex items-center gap-1.5 text-[12px]">
            <Link to="/guides/saree-care-guide/" className="text-[#C8A96B] hover:text-[#9A7B3E] underline font-medium">
              View Detailed Saree Care Guide →
            </Link>
          </div>
        </div>
      )
    },
  ];

  if (isSaree) {
    panels.push({
      title: "Draping & Styling Advice",
      content:
        "Universally flattering drape suitable for all traditional and contemporary styles — Nivi, Gujarati, Nauvari, Bengali, and Seedha Pallu. Pairs effortlessly with classic contrast blouses, designer cuts, or statement jewelry. Need personal styling guidance or draping tips? Reach out to our Nagpur boutique team on WhatsApp."
    });
  } else {
    panels.push({
      title: "Fit & Styling Advice",
      content:
        "Designed for all-day comfort with a contemporary tailored fit. Perfectly complemented by statement jewelry and festive footwear. Reach out to our team on WhatsApp if you need sizing or styling guidance."
    });
  }

  const productName = product?.name || "saree";

  const faqContent = product?.faqs && product.faqs.length > 0
    ? product.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
    : [
    `Q: Is the color of the ${productName} exactly as pictured?\nA: We ensure 95%+ color fidelity under balanced studio lighting. Very slight variations might occur across mobile screens, but the true elegance, weave, and depth remain true to the visuals.`,
    `Q: How fast will my order be dispatched?\nA: Orders are typically processed and dispatched within 24 to 48 hours from our Nagpur facility with real-time tracking updates sent via SMS and WhatsApp.`,
    `Q: Do you offer wholesale or bulk discounts for this product?\nA: Yes, we cater to boutique owners and bulk buyers. Please reach out to our wholesale department via our Contact Us page or WhatsApp for specialized pricing.`,
    `Q: What do I do if I need transit assistance or receive a damaged item?\nA: While rare, every parcel is sealed with a tamper-evident dispatch seal. If you notice any damage, share an unboxing video via WhatsApp within 24 hours of delivery, and we will promptly arrange a swift replacement or refund.`,
    `Q: How authentic is the fabric quality from ${BUSINESS_INFO.name}?\nA: Founded in 1978 in Gandhibagh, Nagpur, ${BUSINESS_INFO.name} upholds a 46-year heritage of weaver-direct trust. Every single garment undergoes individual hand inspection for weave density, finish, and durability before dispatch.`
  ].join("\n\n");

  panels.push(
    {
      title: "Shipping & Delivery",
      content: (
        <div>
          <p className="m-0">Dispatched within 24–48 hours from our Nagpur facility with real-time tracking. Standard delivery typically takes 3–7 business days across India. Express courier options available on request via WhatsApp.</p>
          <div className="mt-2 pt-2 border-t border-black/5 text-[12px]">
            <Link to="/shipping-policy/" className="text-[#C8A96B] hover:text-[#9A7B3E] underline font-medium">
              View Shipping Policy →
            </Link>
          </div>
        </div>
      )
    },
    {
      title: "Returns & Exchange",
      content: (
        <div>
          <p className="m-0">{`Eligible for return or exchange within 7 days of delivery, provided the item is unworn, unwashed, and in its original fold with tags intact. Stitched blouses or custom alterations are non-returnable. To begin a request, message our support team on WhatsApp at ${BUSINESS_INFO.phone}.`}</p>
          <div className="mt-2 pt-2 border-t border-black/5 text-[12px]">
            <Link to="/return-policy/" className="text-[#C8A96B] hover:text-[#9A7B3E] underline font-medium">
              View Complete Return & Refund Policy →
            </Link>
          </div>
        </div>
      )
    },
    {
      title: "Frequently Asked Questions (FAQs)",
      content: (
        <div className="whitespace-pre-wrap">{faqContent}</div>
      )
    }
  );

  return (
    <div className="flex flex-col gap-[4px] w-full px-0 mt-0 mb-0 font-sans text-sm">
      {panels.map((panel, index) => {
        const isOpen = openPanel === index;

        return (
          <div
            key={index}
            className="border border-[#2C241B]/15 rounded-[4px] overflow-hidden"
          >
            <button
              onClick={() => togglePanel(index)}
              className="w-full flex items-center justify-between py-[8px] px-[12px] bg-white hover:bg-black/[0.02] transition-colors focus:outline-none"
            >
              <span className="text-[#2C241B] font-medium text-[13px] tracking-wide leading-normal text-left">
                {panel.title}
              </span>
              <div className="flex items-center justify-center shrink-0 ml-4">
                {isOpen ? (
                  <Minus size={15} className="text-[#2C241B]/70" />
                ) : (
                  <Plus size={15} className="text-[#2C241B]/70" />
                )}
              </div>
            </button>
            {isOpen && (
              <div
                className="overflow-hidden transition-all duration-200"
              >
                <div className="px-[12px] pb-[8px] pt-[2px] text-[#2C241B]/70 leading-relaxed text-[13px]">
                  {panel.content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
