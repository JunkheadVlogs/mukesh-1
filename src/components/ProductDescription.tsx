import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../store";

interface Section {
  title: string;
  content: string;
  isOpenDefault: boolean;
}

export function ProductDescription({
  description,
  product,
  className = "",
}: {
  description: string;
  product?: Product;
  className?: string;
}) {
  // Parsing the raw description using a robust block-splitter
  const parseRawSections = (desc: string) => {
    let text = desc || "";
    // Clean up empty lines and common unwanted formatting
    text = text.replace(/\*\*\s*\d+\.\s*Product Title\s*\*\*\n[^\n]+\n+/gi, "");
    text = text.replace(/✨.*$/gm, ""); // Remove emoji highlight rows

    const parsed: { [key: string]: string } = {};
    let fallbackText = "";

    // Regex to split by **[HEADER]**
    const regex = /\*\*(.*?)\*\*(.*?)(?=\*\*(?:.*?)\*\*|$)/gs;
    let match;

    // Capturing any text before first header as fallback/description
    const firstMatch = /\*\*(.*?)\*\*/.exec(text);
    if (!firstMatch || firstMatch.index > 0) {
      const preceding = firstMatch ? text.substring(0, firstMatch.index).trim() : text.trim();
      if (preceding) {
        fallbackText = preceding;
      }
    }

    while ((match = regex.exec(text)) !== null) {
      const title = match[1].trim().replace(/:$/, "").toUpperCase();
      const content = match[2].trim();
      if (content) {
        parsed[title] = content;
      }
    }

    return { parsed, fallbackText };
  };

  const { parsed: parsedRaw, fallbackText } = parseRawSections(description);

  // Exclude helper keys
  const getProductDescriptionRaw = () => {
    let raw = parsedRaw["DESCRIPTION"] || parsedRaw["SHORT DESCRIPTION"] || fallbackText || "";
    if (!raw) {
      for (const k of Object.keys(parsedRaw)) {
        if (!["HIGHLIGHTS", "PRODUCT HIGHLIGHTS", "FABRIC", "FABRIC DETAILS", "SIZE & FIT", "SIZE", "STYLING", "STYLING TIPS", "CARE", "CARE INSTRUCTIONS"].includes(k)) {
          raw = parsedRaw[k];
          break;
        }
      }
    }
    return raw.replace(/^[•\s\-\*]+/gm, "").trim();
  };

  const getHighlightsRaw = () => {
    return parsedRaw["HIGHLIGHTS"] || parsedRaw["PRODUCT HIGHLIGHTS"] || "";
  };

  const getStylingRaw = () => {
    return parsedRaw["STYLING"] || parsedRaw["STYLING TIPS"] || parsedRaw["IDEAL OCCASIONS"] || "";
  };

  const getFabricRaw = () => {
    return parsedRaw["FABRIC"] || parsedRaw["FABRIC DETAILS"] || "";
  };

  const getSizeFitRaw = () => {
    return parsedRaw["SIZE & FIT"] || parsedRaw["DIMENSIONS"] || parsedRaw["SIZE"] || parsedRaw["SIZING"] || parsedRaw["SAREE LENGTH / BLOUSE INFO"] || "";
  };

  const getCareRaw = () => {
    return parsedRaw["CARE"] || parsedRaw["CARE INSTRUCTIONS"] || "";
  };

  // Safe variables fallback
  const fabricName = product?.fabric || "Premium Handcrafted Material";
  const colorName = product?.color || "Exclusive Shade";
  const categoryName = product?.category || "Sarees";
  const productName = product?.name || "Boutique Collection";

  const isSaree = categoryName.toUpperCase().includes("SAREE") || productName.toUpperCase().includes("SAREE");

  // 1. DESCRIPTION SECTION
  let sectionDesc = getProductDescriptionRaw();
  if (!sectionDesc || sectionDesc.length < 20) {
    if (isSaree) {
      sectionDesc = `Embrace elegant Indian heritage with this magnificent ${productName}. Carefully curated by Mukesh Saree Centre, Nagpur, it features custom floral weaves and a lightweight design that delivers a perfect blend of high-end styling and timeless class. An ideal selection for festivals and premium celebrations.`;
    } else {
      sectionDesc = `Elevate your resort-chic or festive lifestyle with the ${productName}. Combining the breathability of natural fabrics with precise boutique tailoring, this set provides an exquisite form-accentuating silhouette and standard comfortable movement for any occasion.`;
    }
  } else {
    // Strip bold text and clean spacing
    sectionDesc = sectionDesc
      .replace(/\*\*.*?\*\*/g, "")
      .replace(/^[•\s\-\*]+/gm, "")
      .trim();
  }

  // 2. PRODUCT HIGHLIGHTS SECTION
  const isP60 = product?.sku === "SAR-TIS-COT-060" || product?.id === "p60";
  const isElephantPrint = 
    product?.sku === "SAR-LIN-NVY-033" || 
    product?.sku === "SAR-LIN-WHT-033" || 
    product?.sku === "SAR-LIN-RED-033" || 
    product?.id === "p33" || 
    product?.id === "p64" || 
    product?.id === "p65" ||
    productName.toUpperCase().includes("ELEPHANT");

  const printType = isP60
    ? "Digital Floral Print / Modern Motif"
    : isElephantPrint
    ? "Digital Elephant Print / Modern Motif"
    : productName.toUpperCase().includes("FLORAL") 
    ? "Floral Print / Handcrafted Botanical Motif" 
    : productName.toUpperCase().includes("BLOCK") || productName.toUpperCase().includes("AJRAKH")
    ? "Traditional Handcrafted Block Print"
    : productName.toUpperCase().includes("ZEBRA")
    ? "Stripe / Modern Abstract Weave"
    : productName.toUpperCase().includes("BANDHANI")
    ? "Traditional Bandhani Tie-Dye Motif"
    : "Boutique Handcraft / Solid Weave";

  const comfortLabel = isP60
    ? "Featherlight feel with a smooth tactile finish and exquisite drape"
    : isSaree
    ? "Featherlight, exceptionally breathable, and skin-friendly luxury drapes"
    : "Luxuriously soft touch, gentle against the skin, and effortless fluid movement";

  const lengthLabel = isSaree ? "5.5 Meters of continuous premium drape" : "Standard Co-Ord Trouser & Long Sleek Top";
  const blouseLabel = isSaree ? "1 Meter matching unstitched blouse piece" : "Not Applicable";

  let occasionLabel = "Festive Occasions, Premium Weddings, Family Celebrations & Haldi-Mehndi";
  if (isElephantPrint) {
    occasionLabel = "Festive Occasions, Premium Weddings, Family Celebrations & Social Gatherings";
  } else if (!isSaree) {
    occasionLabel = "Casual Glamour, Holiday Travel, High Tea, and Luxurious Office Afternoons";
  }

  const finalHighlights = [
    `- **Fabric**: ${fabricName}`,
    `- **Print**: ${printType}`,
    `- **Color**: ${colorName}`,
    `- **Length**: ${lengthLabel}`,
    `- **Blouse Piece**: ${blouseLabel}`,
    `- **Comfort**: ${comfortLabel}`,
    `- **Occasion**: ${occasionLabel}`
  ].join("\n");

  // 3. STYLING TIPS SECTION
  let stylingBullets: string[] = [];
  const rawStyling = getStylingRaw();
  if (rawStyling) {
    stylingBullets = rawStyling
      .split(/\n+/)
      .map(line => line.replace(/^[•\s\-\*\/]+/g, "").trim())
      .filter(line => {
        const u = line.toUpperCase();
        return (
          line.length > 4 &&
          !u.includes("SIZE") &&
          !u.includes("FABRIC") &&
          !u.includes("METERS") &&
          !u.includes("MEASURE") &&
          !u.includes("PRINT") &&
          !u.includes("COLOR") &&
          !u.includes("IDEAL OCCASIONS:")
        );
      });
  }

  if (stylingBullets.length < 3) {
    if (isSaree) {
      stylingBullets = [
        "Pair with classic oxidized silver jhumkas or a minimal pearl choker to highlight the neckline.",
        "Style with sleek high-heeled sandals or embellished metallic mojris for a graceful look.",
        "Drape with clean pleats on the shoulder for formal events, or leave open-pallu for a relaxed, festive vibe."
      ];
    } else {
      stylingBullets = [
        "Style with contemporary gold hoops, an active dainty watch, and a micro-structured top handles bag.",
        "Pair with leather mules, cork-soled blocks, or minimalist slides for a sleek lunchtime silhouette.",
        "Roll up the sleeves slightly and wear with understated flat slip-ons for direct on-the-go sophistication."
      ];
    }
  }

  const finalStyling = stylingBullets.map(bullet => `- ${bullet}`).join("\n");

  // 4. FABRIC DETAILS SECTION
  let fabricVal = getFabricRaw();
  if (!fabricVal || fabricVal.length < 25) {
    if (isP60) {
      fabricVal = `Woven diligently using premium quality ${fabricName}. Known for its stunning metallic lustre, lightweight form, and gorgeous crease-recovery, this luxury fabric guarantees a fresh, pristine look. It feels incredibly cozy to touch and maintains its beautiful textile profile perfectly for all your special occasions.`;
    } else {
      fabricVal = `Woven diligently using premium quality ${fabricName}. Known for its organic breathability, outstanding crease-recovery, and deep color-absorption capability, this luxury fabric guarantees a fresh, pristine look. It feels incredibly cozy to touch and maintains its lush textile profile beautifully even with frequent wears.`;
    }
  } else {
    fabricVal = fabricVal.replace(/\*\*.*?\*\*/g, "").replace(/^[•\s\-\*]+/gm, "").trim();
  }

  // 5. SAREE LENGTH / BLOUSE INFO SECTION
  let finalSizeFit = "";
  if (isSaree) {
    finalSizeFit = [
      `- **Saree length**: 5.5 Meters of continuous, gracefully flowing premium drape.`,
      `- **Blouse details**: 1 Meter matching unstitched blouse piece is included in the package. Feel free to design customize necklines or designer sleeve lengths of choice.`
    ].join("\n");
  } else {
    finalSizeFit = [
      `- **Size Selection**: Standard relaxed regular fit, tailoring to comfortable elegant Indian sizing.`,
      `- **Available Options**: Proudly offered from sizes S to XXL to flatter all modern body structures.`,
      `- **Set coordinates**: Complete dynamic length trousers paired with high-end tailored tunic shirt fabric.`
    ].join("\n");
  }

  // 6. CARE INSTRUCTIONS SECTION
  const finalCare = "Gentle hand wash with care to preserve the beauty of the fabric.";

  // Final structured list of sections, omitting length and blouse info for Co-Ord sets
  const isCoOrdSet = categoryName.toUpperCase().includes("CO-ORD") || productName.toUpperCase().includes("CO-ORD");

  const sectionsList: Section[] = [
    {
      title: "PRODUCT DESCRIPTION",
      content: sectionDesc,
      isOpenDefault: true,
    },
    {
      title: "PRODUCT HIGHLIGHTS",
      content: finalHighlights,
      isOpenDefault: false,
    },
    {
      title: "STYLING TIPS",
      content: finalStyling,
      isOpenDefault: false,
    },
    {
      title: "FABRIC DETAILS",
      content: fabricVal,
      isOpenDefault: false,
    },
    ...(!isCoOrdSet
      ? [
          {
            title: "SAREE LENGTH / BLOUSE INFO",
            content: finalSizeFit,
            isOpenDefault: false,
          },
        ]
      : []),
    {
      title: "CARE INSTRUCTIONS",
      content: finalCare,
      isOpenDefault: false,
    },
  ];

  return (
    <div className={`space-y-0.5 border-t border-[#C8A96B]/10 pt-1 ${className}`}>
      {sectionsList.map((section, idx) => (
        <AccordionItem
          key={idx}
          title={section.title}
          content={section.content}
          isOpenDefault={section.isOpenDefault}
        />
      ))}
    </div>
  );
}

function AccordionItem({
  title,
  content,
  isOpenDefault,
}: {
  title: string;
  content: string;
  isOpenDefault: boolean;
}) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const isCareSection = title === "CARE INSTRUCTIONS";

  return (
    <div className="border-b border-[#1A0A00]/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center py-5 md:py-6 w-full text-left transition-colors duration-200 group focus:outline-none"
      >
        <span className="text-[10px] sm:text-[11px] font-sans font-light uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#1A0A00]/70 group-hover:text-[#C8A96B] transition-colors">
          {title}
        </span>
        <ChevronDown
          size={12}
          strokeWidth={1.0}
          className={`text-[#1A0A00]/25 group-hover:text-[#C8A96B] transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#C8A96B]/80" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 pt-1 font-sans text-xs sm:text-[13px] tracking-wide">
              {isCareSection ? (
                <div className="leading-relaxed text-[#5f5a54] font-light font-sans tracking-wide md:max-w-xl pb-3 pr-2 select-none">
                  {content}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-[#1A0A00]/70 leading-relaxed prose-p:my-1.5 prose-li:my-1 prose-strong:text-[#1A0A00] prose-strong:font-medium prose-ul:list-disc prose-ul:pl-4">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
