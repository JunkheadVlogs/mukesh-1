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

  // 1. DESCRIPTION SECTION (Trimmed paragraph)
  const getProductDescriptionRaw = () => {
    let raw = parsedRaw["DESCRIPTION"] || parsedRaw["SHORT DESCRIPTION"] || fallbackText || "";
    if (!raw) {
      for (const k of Object.keys(parsedRaw)) {
        if (!["HIGHLIGHTS", "PRODUCT HIGHLIGHTS", "FABRIC", "FABRIC DETAILS", "FABRIC FEATURES", "FABRIC & CRAFT FEATURES", "SIZE & FIT", "SIZE", "STYLING", "STYLING TIP", "STYLING TIPS", "CARE", "CARE INSTRUCTIONS"].includes(k)) {
          raw = parsedRaw[k];
          break;
        }
      }
    }
    return raw.replace(/^[•\s\-\*]+/gm, "").trim();
  };

  const sectionDesc = getProductDescriptionRaw()
    .replace(/\*\*.*?\*\*/g, "")
    .replace(/^[•\s\-\*]+/gm, "")
    .trim();

  // 2. HIGHLIGHTS SECTION (Merge HIGHLIGHTS & FABRIC FEATURES, deduplicate, drop FABRIC FEATURES header)
  const highlightsRaw = parsedRaw["HIGHLIGHTS"] || parsedRaw["PRODUCT HIGHLIGHTS"] || "";
  const fabricFeaturesRaw = parsedRaw["FABRIC FEATURES"] || parsedRaw["FABRIC & CRAFT FEATURES"] || parsedRaw["FABRIC DETAILS"] || "";

  const extractBullets = (text: string) => {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && (line.startsWith("•") || line.startsWith("-") || line.startsWith("*") || line.startsWith("🎨") || line.startsWith("🧵") || line.startsWith("💫") || line.startsWith("💖") || line.startsWith("🌿")))
      .map((line) => line.replace(/^[•\-\*]\s*/, "• "));
  };

  const highlightBullets = extractBullets(highlightsRaw);
  const fabricBullets = extractBullets(fabricFeaturesRaw);

  // Combine and deduplicate
  const combinedBullets: string[] = [];
  const seenKeys = new Set<string>();

  [...highlightBullets, ...fabricBullets].forEach((bullet) => {
    // Normalize string to detect duplicate concepts
    const normalized = bullet.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!seenKeys.has(normalized)) {
      seenKeys.add(normalized);
      combinedBullets.push(bullet);
    }
  });

  // 3. STYLING TIP SECTION
  const stylingTipRaw = parsedRaw["STYLING TIP"] || parsedRaw["STYLING TIPS"] || parsedRaw["STYLING"] || "";
  const cleanStylingTip = stylingTipRaw.replace(/^[•\s\-\*]+/gm, "").trim();

  return (
    <div className={`pt-2 pb-1 font-sans text-[#2C241B] flex flex-col gap-3 ${className}`}>
      {/* 1. Description Paragraph */}
      {sectionDesc && (
        <p className="text-[13.5px] sm:text-[14px] leading-relaxed font-normal text-[#2C241B]/90 m-0">
          {sectionDesc}
        </p>
      )}

      {/* 2. Consolidated Highlights Section (No Fabric Features header) */}
      {combinedBullets.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#C8A96B] m-0">
            HIGHLIGHTS
          </h3>
          <ul className="flex flex-col gap-1.5 m-0 pl-0 list-none text-[13px] sm:text-[13.5px] leading-snug text-[#2C241B]">
            {combinedBullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="shrink-0 leading-normal">{bullet.startsWith("•") ? "•" : bullet.substring(0, 2)}</span>
                <span className="leading-relaxed">
                  {bullet.replace(/^[•\s\-\*]+/, "").replace(/^[🎨🧵💫💖🌿]\s*/, "")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Styling Tip Section */}
      {cleanStylingTip && (
        <div className="flex flex-col gap-1 pt-1">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#C8A96B] m-0">
            STYLING TIP
          </h3>
          <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-[#2C241B]/85 italic m-0 bg-[#FBF9F5] p-2.5 rounded border-l-2 border-[#C8A96B]">
            {cleanStylingTip}
          </p>
        </div>
      )}
    </div>
  );
}

