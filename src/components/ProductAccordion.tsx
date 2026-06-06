import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ProductAccordion() {
  const [openPanel, setOpenPanel] = useState<number | null>(null);

  const togglePanel = (index: number) => {
    setOpenPanel(openPanel === index ? null : index);
  };

  const panels = [
    {
      title: "Shipping & Delivery",
      content:
        "Free shipping. Standard delivery in 3–7 business days across India. Cash on Delivery available pan-India. Express delivery available for select pincodes — contact us on WhatsApp.",
    },
    {
      title: "Returns & Exchange",
      content:
        "Easy 7-day returns on all unworn, unwashed items with original tags. Customised or stitched blouses are non-returnable. To initiate a return, WhatsApp us at 7020664641 with your order ID and photos.",
    },
    {
      title: "Saree Size & Drape Guide",
      content:
        "All our sarees are standard 5.5 meters + 1 meter blouse piece unless stated otherwise. Suitable for all draping styles — Nivi, Gujarati, Nauvari, Bengali. Need help draping? WhatsApp us or visit our Nagpur store.",
    },
  ];

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
                  <div className="p-[12px] pt-0 text-[#2C241B]/70 leading-relaxed text-[13.5px]">
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
