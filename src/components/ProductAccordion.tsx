import { BUSINESS_INFO } from "../config/business";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../store";

export function ProductAccordion({ category, product }: { category?: string; product?: Product }) {
  const [openPanel, setOpenPanel] = useState<number | null>(null);

  const togglePanel = (index: number) => {
    setOpenPanel(openPanel === index ? null : index);
  };

  const isCoOrdSet = category?.toLowerCase().includes("co-ord");
  const isSaree = !isCoOrdSet && (category?.toLowerCase().includes("saree") || product?.name?.toLowerCase().includes("saree"));
  
  const fabricRaw = product?.fabric || "Premium Blended Fabric";
  const cat = category || "Sarees";
  
  const stylingTips = isSaree 
    ? "Pair with statement gold or oxidized silver jewelry depending on the occasion. A contrasting or matching designer blouse will complete the traditional yet modern look. Use block heels or wedges for an elegant posture."
    : "Style with minimal accessories, an elegant sling bag, and comfortable flats or block heels for an effortlessly chic look.";
    
  const featuresList = isSaree
    ? "• 5.5 Meter premium unstitched drape\n• 1 Meter matching unstitched blouse piece\n• Authentic weaving and rich border design\n• Lightweight and breathable for all-day comfort"
    : "• Highly breathable and skin-friendly natural fabrics\n• Flattering contemporary cuts and fits\n• Durable stitching for everyday elegance\n• Easy to maintain and wrinkle-resistant blends";
    
  const benefitsText = "Experience the perfect balance of heritage and comfort. Our meticulously crafted designs ensure you look effortlessly stylish while enjoying all-day breathability. This garment is an investment in timeless fashion that won't fade with changing seasons.";
  
  const whoShouldBuy = isSaree
    ? "Ideal for women who appreciate rich Indian textiles, brides-to-be building their trousseau, or anyone attending a festive or traditional gathering seeking a regal, put-together appearance."
    : "Perfect for the modern woman who values comfort without compromising on style. Great for office professionals, travelers, and women looking for chic, ready-to-wear everyday fashion.";

  const panels = [
    {
      title: "Fabric Overview & Features",
      content: `Fabric: ${fabricRaw}\n\nFeatures:\n${featuresList}`
    },
    {
      title: "Benefits & Who Should Buy",
      content: `${benefitsText}\n\nWho should buy: ${whoShouldBuy}\n\nBest occasions: Premium weddings, festive celebrations, cultural events, and high tea gatherings.`
    },
    {
      title: "Styling Tips & Occasions",
      content: stylingTips
    },
    {
      title: "Washing & Care Instructions",
      content: "First wash strictly dry clean to lock in colors and preserve the fabric sheen. Subsequent washes can be gentle hand washes in cold water using a mild baby shampoo or specialized silk/cotton detergent. Do not wring or twist. Dry strictly in the shade to prevent sun bleaching."
    },
  ];

  if (isSaree) {
    panels.push({
      title: "Saree Size, Drape & Blouse Guide",
      content:
        "All our sarees are standard 5.5 meters with an additional 1 meter unstitched blouse piece unless stated otherwise. Suitable for all draping styles — Nivi, Gujarati, Nauvari, Bengali. Need help draping or blouse stitching? WhatsApp us or visit our Nagpur store."
    });
  }

  panels.push(
    {
      title: "Shipping & Delivery",
      content:
        "Free shipping on orders. Standard delivery in 3–7 business days across India. Cash on Delivery available pan-India. Express delivery available for select pincodes — contact us on WhatsApp.",
    },
    {
      title: "Returns & Exchange Policy",
      content:
        "Easy 7-day returns on all unworn, unwashed items with original tags intact. Customised or stitched blouses are non-returnable. To initiate a return, WhatsApp us at 7020664641 with your order ID and photos. Refunds securely processed to the original payment method.",
    },
    {
      title: "Frequently Asked Questions",
      content: "Q: Can I wash this at home?\nA: We recommend dry cleaning for the first wash. Subsequent washes can be gentle cold hand washes.\n\nQ: Is Cash on Delivery available?\nA: Yes, COD is available pan-India.\n\nQ: Does the product look exactly like the picture?\nA: We ensure 95% color accuracy. Due to studio lighting, slight variations might occur but the overall beauty and quality remain exactly as promised."
    }
  );

  return (
    <div className="flex flex-col gap-3 w-full mt-2 mb-2 font-sans text-sm">
      {panels.map((panel, index) => {
        const isOpen = openPanel === index;

        return (
          <div
            key={index}
            className="border border-[#2C241B]/15 rounded-[4px] overflow-hidden"
          >
            <button
              onClick={() => togglePanel(index)}
              className="w-full flex items-center justify-between px-3 h-[44px] bg-white hover:bg-black/[0.02] transition-colors focus:outline-none"
            >
              <span className="text-[#2C241B] font-medium text-[13px] tracking-wide">
                {panel.title}
              </span>
              {isOpen ? (
                <Minus size={16} className="text-[#2C241B]/70" />
              ) : (
                <Plus size={16} className="text-[#2C241B]/70" />
              )}
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-[12px] pt-0 text-[#2C241B]/70 leading-relaxed text-[13.5px] whitespace-pre-wrap">
                    {panel.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
