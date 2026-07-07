import React from "react";
import { Product } from "../store";

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

  // Safe variables fallback
  const fabricName = product?.fabric || "Premium Handcrafted Material";
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
  const isElephantPrint = 
    product?.sku === "SAR-LIN-NVY-033" || 
    product?.sku === "SAR-LIN-WHT-033" || 
    product?.sku === "SAR-LIN-RED-033" || 
    product?.id === "p33" || 
    product?.id === "p64" || 
    product?.id === "p65" ||
    productName.toUpperCase().includes("ELEPHANT");

  let occasionLabel = "Festive Occasions, Premium Weddings, Family Celebrations & Haldi-Mehndi";
  if (isElephantPrint) {
    occasionLabel = "Festive Occasions, Premium Weddings, Family Celebrations & Social Gatherings";
  } else if (!isSaree) {
    occasionLabel = "Casual Glamour, Holiday Travel, High Tea, and Luxurious Office Afternoons";
  }

  const finalCare = "Gentle hand wash with care to preserve the beauty of the fabric.";

  return (
    <div className={`pt-1.5 pb-0 font-sans text-[#2C241B] ${className}`}>
      <p className="text-[14px] leading-relaxed mb-3 font-medium">
        {sectionDesc}
      </p>

      <div className="flex flex-col">
        <div className="prod-detail-row">
          <div>Fabric</div>
          <div>{fabricName}</div>
        </div>

        <div className="prod-detail-row">
          <div>Length</div>
          <div>
            {isSaree
              ? "5.5 meter saree + 1 meter unstitched blouse"
              : "Standard sizes (S to XXL)"}
          </div>
        </div>

        <div className="prod-detail-row">
          <div>Best for</div>
          <div>{occasionLabel}</div>
        </div>

        <div className="prod-detail-row">
          <div>Care</div>
          <div>{finalCare}</div>
        </div>

        {isSaree && (
          <div className="prod-detail-row">
            <div>Blouse</div>
            <div>
              Unstitched blouse piece included. Stitching available on request — WhatsApp us.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
