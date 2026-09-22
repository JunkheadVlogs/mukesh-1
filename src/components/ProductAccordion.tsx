import { BUSINESS_INFO } from "../config/business";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Product } from "../store";

export function ProductAccordion({ category, product }: { category?: string; product?: Product }) {
  const [openPanel, setOpenPanel] = useState<number | null>(null);

  const togglePanel = (index: number) => {
    setOpenPanel(openPanel === index ? null : index);
  };

  const isSaree = category?.toLowerCase().includes("saree") || product?.name?.toLowerCase().includes("saree") || true;
  
  const fabricRaw = product?.fabric || "Premium Blended Fabric";
  const cat = category || "Sarees";
  
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
      title: "Why You'll Love It",
      content: `${benefitsText}\n\nWho should buy: ${whoShouldBuy}`
    },
    {
      title: "Wash & Care Instructions",
      content: "First wash strictly dry clean to lock in colors and preserve the fabric sheen. Subsequent washes can be gentle hand washes in cold water using a mild baby shampoo or specialized silk/cotton detergent. Do not wring or twist. Dry strictly in the shade to prevent sun bleaching."
    },
  ];

  if (isSaree) {
    panels.push({
      title: "Size, Fit & Blouse Details",
      content:
        "All our sarees are standard 5.5 meters with an additional 1 meter unstitched blouse piece unless stated otherwise. Suitable for all draping styles — Nivi, Gujarati, Nauvari, Bengali. Need help draping or blouse stitching? WhatsApp us or visit our Nagpur store."
    });
  }

  const productName = product?.name || "saree";
  const productFabric = product?.fabric || "pure fabric";
  const isCod = product?.codAvailable !== false;

  const faqContent = product?.faqs && product.faqs.length > 0
    ? product.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
    : [
    `Q: Is the color of the ${productName} exactly as pictured?\nA: We ensure 95%+ color fidelity under balanced studio lighting. Very slight variations might occur across mobile screens, but the true elegance, weave, and depth of the ${productFabric} remain true to the visuals.`,
    `Q: Is Cash on Delivery (COD) available for this item?\nA: ${isCod ? "Yes, Cash on Delivery is supported across 25,000+ postal pincodes in India. You can inspect the parcel and pay upon doorstep arrival." : "This promotional direct-from-weaver piece is offered at a special discount for prepaid orders only."}`,
    `Q: Does this include a matching blouse piece?\nA: ${isSaree ? "Yes, each saree comes with a matching unstitched blouse piece (approx. 0.8 to 1.0 meter). It can be tailored in your preferred neck, sleeve, and back design." : "Please refer to the detailed size and fit specifications above."}`,
    `Q: What are the wash and care guidelines for this ${productFabric}?\nA: Professional dry cleaning is strongly recommended for the first wash to set the weave and color brilliance. Subsequent washes should be gentle cold hand washes with mild liquid detergent. Never bleach, wring, or dry in direct harsh sunlight.`,
    `Q: How authentic is the fabric quality from ${BUSINESS_INFO.name}?\nA: Founded in 1978 in Gandhibagh, Nagpur, ${BUSINESS_INFO.name} upholds a 46-year heritage of weaver-direct trust. Every single garment undergoes hand inspection for weave density, finish, and durability before dispatch.`
  ].join("\n\n");

  panels.push(
    {
      title: "Shipping & Delivery",
      content:
        "Free shipping on orders. Standard delivery in 3–7 business days across India. Cash on Delivery available pan-India. Express delivery available for select pincodes — contact us on WhatsApp.",
    },
    {
      title: "Returns & Exchange",
      content:
        `Easy 7-day returns on all unworn, unwashed items with original tags intact. Customised or stitched blouses are non-returnable. To initiate a return, WhatsApp us at ${BUSINESS_INFO.phone} with your order ID and photos. Refunds securely processed to the original payment method.`,
    },
    {
      title: "Frequently Asked Questions (FAQs)",
      content: faqContent
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
                <div className="px-[12px] pb-[8px] pt-[2px] text-[#2C241B]/70 leading-relaxed text-[13px] whitespace-pre-wrap">
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
