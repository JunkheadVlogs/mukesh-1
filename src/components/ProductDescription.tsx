import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown } from "lucide-react";

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
    return clean;
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
      const content = match[2].trim();
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
        <span className={`text-primary-950/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={16} />
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100 pb-5" : "max-h-0 opacity-0"}`}
      >
        <div className="text-[14px] md:text-[15px] leading-[1.6] text-primary-950/70 font-sans font-normal max-w-[95%] prose prose-sm prose-p:mb-3 prose-li:mb-1.5 prose-ul:list-disc prose-ul:pl-5 prose-strong:font-bold prose-strong:text-primary-950">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
