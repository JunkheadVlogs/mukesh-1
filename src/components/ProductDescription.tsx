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
    clean = clean.replace(/\*\*\s*\d+\.\s*Product Title\s*\*\*\n[^\n]+\n+/gi, '');
    clean = clean.replace(/\*\*\s*\d+\.\s*Short Description\s*\*\*/gi, '**DESCRIPTION**');
    clean = clean.replace(/\*\*\s*\d+\.\s*Product Details\s*\*\*/gi, '**DETAILS**');
    clean = clean.replace(/\*\*\s*\d+\.\s*Care Instructions\s*\*\*/gi, '**CARE**');
    clean = clean.replace(/\*\*\s*\d+\.\s*([^*]+)\*\*/g, (match, p1) => `**${p1.trim().toUpperCase()}**`);
    clean = clean.replace(/\*\*\s*Description\s*\*\*/gi, '**DESCRIPTION**');
    clean = clean.replace(/\*\*\s*Care Instructions\s*\*\*/gi, '**CARE**');
    clean = clean.replace(/\*\*\s*Product Details\s*\*\*/gi, '**DETAILS**');
    // Remove repetitive marketing blurbs like "✨ COD Available..."
    clean = clean.replace(/✨.*$/gm, '');
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
      const precedingText = firstMatch ? text.substring(0, firstMatch.index).trim() : text.trim();
      if (precedingText) {
        sections.push({ title: "DESCRIPTION", content: precedingText });
      }
    }

    while ((match = regex.exec(text)) !== null) {
      let title = match[1].trim().replace(/:$/, "");
      if (title.toUpperCase() === "WHY YOU’LL LOVE IT" || title.toUpperCase() === "WHY YOU'LL LOVE IT") {
          title = "WHY YOU'LL LOVE IT";
      }
      
      let content = match[2].trim();
      // Remove trailing hyphens (often left over from bullet points that preceded the next bold header)
      content = content.replace(/(?:\n\s*-\s*)+$/, '').trim();
      content = content.replace(/^-\s*/, '').trim(); // Remove leading hyphen if any

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

  const sections = parseSections(cleanDescription(description));

  return (
    <div className={`space-y-0 border-b border-black/5 ${className}`}>
      {sections.map((section, idx) => (
        <AccordionItem key={idx} title={section.title} content={section.content} isOpenDefault={idx === 0} />
      ))}
      <AccordionItem 
        title="DELIVERY & RETURNS" 
        content="Free shipping on all orders. Delivery takes 3-5 working days. We offer a hassle-free 7-day return policy for unused products with original tags." 
        isOpenDefault={false} 
      />
    </div>
  );
}

function AccordionItem({ title, content, isOpenDefault }: { title: string, content: string, isOpenDefault: boolean }) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="border-t border-black/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 lg:py-5 flex justify-between items-center bg-transparent focus:outline-none group text-left"
      >
        <span className="text-[12px] tracking-[2px] font-bold text-primary-950 uppercase pr-4">{title}</span>
        <span className={`text-[#8A6A4A] transition-transform duration-300 transform-gpu will-change-transform ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={14} strokeWidth={2.5} />
        </span>
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
            <div className="pb-5 text-[14px] leading-relaxed text-primary-950/70 font-sans font-medium max-w-[95%] prose prose-sm prose-p:mb-3 prose-li:mb-2 prose-ul:list-none prose-ul:pl-0 prose-li:border-b prose-li:border-black/5 prose-li:pb-2 last:prose-li:border-0 prose-strong:font-bold prose-strong:text-primary-950">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
