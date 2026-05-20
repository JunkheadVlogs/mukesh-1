import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Section {
  title: string;
  content: string;
}

export function ProductDescription({
  description,
  className = "",
}: {
  description: string;
  className?: string;
}) {
  const cleanDescription = (desc: string) => {
    let clean = desc;
    clean = clean.replace(
      /\*\*\s*\d+\.\s*Product Title\s*\*\*\n[^\n]+\n+/gi,
      "",
    );
    clean = clean.replace(
      /\*\*\s*\d+\.\s*Short Description\s*\*\*/gi,
      "**DESCRIPTION**",
    );
    clean = clean.replace(
      /\*\*\s*\d+\.\s*Product Details\s*\*\*/gi,
      "**DETAILS**",
    );
    clean = clean.replace(
      /\*\*\s*\d+\.\s*Care Instructions\s*\*\*/gi,
      "**CARE**",
    );
    clean = clean.replace(
      /\*\*\s*\d+\.\s*([^*]+)\*\*/g,
      (match, p1) => `**${p1.trim().toUpperCase()}**`,
    );
    clean = clean.replace(/\*\*\s*Description\s*\*\*/gi, "**DESCRIPTION**");
    clean = clean.replace(/\*\*\s*Care Instructions\s*\*\*/gi, "**CARE**");
    clean = clean.replace(/\*\*\s*Product Details\s*\*\*/gi, "**DETAILS**");
    // Remove repetitive marketing blurbs like "✨ COD Available..."
    clean = clean.replace(/✨.*$/gm, "");
    return clean.trim();
  };

  const parseSections = (text: string): Section[] => {
    const sections: Section[] = [];
    const regex = /\*\*(.*?)\*\*(.*?)(?=\*\*|$)/gs;
    let match;
    let index = 0;

    // Check if there's text before the first header
    const firstMatch = /\*\*(.*?)\*\*/.exec(text);
    if (!firstMatch || firstMatch.index > 0) {
      const precedingText = firstMatch
        ? text.substring(0, firstMatch.index).trim()
        : text.trim();
      if (precedingText) {
        sections.push({ title: "DESCRIPTION", content: precedingText });
      }
    }

    while ((match = regex.exec(text)) !== null) {
      let title = match[1].trim().replace(/:$/, "");
      if (
        title.toUpperCase() === "WHY YOU’LL LOVE IT" ||
        title.toUpperCase() === "WHY YOU'LL LOVE IT"
      ) {
        title = "WHY YOU'LL LOVE IT";
      }

      let content = match[2].trim();
      // Remove trailing hyphens (often left over from bullet points that preceded the next bold header)
      content = content.replace(/(?:\n\s*-\s*)+$/, "").trim();
      content = content.replace(/^-\s*/, "").trim(); // Remove leading hyphen if any

      const upperTitle = title.toUpperCase();
      if (upperTitle === "BLOUSE PIECE DETAILS") {
        continue;
      }

      if (content) {
        sections.push({ title, content });
      }
    }

    if (sections.length === 0) {
      sections.push({ title: "DESCRIPTION", content: text });
    }

    return sections;
  };

  const sectionsList = parseSections(cleanDescription(description));

  let descContent = "";
  let detailsContent = "";
  let stylingContent = "";

  sectionsList.forEach((sec) => {
    const title = sec.title.toUpperCase();
    if (
      title.includes("DETAIL") ||
      title.includes("FABRIC") ||
      title.includes("DIMENSION") ||
      title.includes("BLOUSE") ||
      title.includes("COLOR") ||
      title.includes("CARE")
    ) {
      detailsContent += `\n\n**${sec.title}**\n${sec.content}`;
    } else if (title.includes("STYLING") || title.includes("HIGHLIGHT")) {
      stylingContent += `\n\n**${sec.title}**\n${sec.content}`;
    } else {
      if (title === "DESCRIPTION") {
        descContent += `\n\n${sec.content}`;
      } else {
        descContent += `\n\n**${sec.title}**\n${sec.content}`;
      }
    }
  });

  const finalSections = [];
  if (descContent.trim())
    finalSections.push({
      title: "DESCRIPTION",
      content: descContent.trim(),
      isOpenDefault: true,
    });
  if (detailsContent.trim())
    finalSections.push({
      title: "DETAILS",
      content: detailsContent.trim(),
      isOpenDefault: false,
    });
  if (stylingContent.trim())
    finalSections.push({
      title: "STYLING TIPS",
      content: stylingContent.trim(),
      isOpenDefault: false,
    });

  return (
    <div className={`space-y-0 ${className}`}>
      {finalSections.map((section, idx) => (
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

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`accordion-header ${isOpen ? "open" : ""}`}
      >
        <span>{title}</span>
        <ChevronDown className="chevron" />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden will-change-transform transform-gpu"
          >
            <div className="accordion-body prose-sm prose-p:mb-2 prose-li:mb-1 prose-ul:list-none prose-ul:pl-0 prose-strong:font-bold prose-strong:text-primary-950">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
