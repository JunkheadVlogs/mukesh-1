import React from "react";
import ReactMarkdown from "react-markdown";
import { parseMarkdownDescription } from "../utils";

export function ProductDescription({
  description,
  className = "",
}: {
  description: string;
  className?: string;
}) {
  const sections = parseMarkdownDescription(description);

  if (sections.length === 1) {
    return (
      <div
        className={`markdown-content text-primary-950/80 leading-relaxed font-light ${className}`}
      >
        <ReactMarkdown>{sections[0].content}</ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {sections.map((section) => {
        const titleLower = section.title.toLowerCase();
        // Skip Product Title as it's already shown in the UI header
        if (titleLower.includes("product title")) return null;

        const isList =
          titleLower.includes("bullet") || section.content.includes("•");

        return (
          <div key={section.title} className="mb-4">
            {titleLower !== "short description" && (
              <h3 className="text-[11px] tracking-[2px] text-primary-950/50 mb-3 uppercase font-semibold">
                {section.title.replace(/^\d+\.\s*/, "")}
              </h3>
            )}
            <div className="text-[13px] text-primary-950/80 leading-relaxed font-light whitespace-pre-wrap">
              {section.content
                .split("\n")
                .filter((l) => l.trim().length > 0)
                .map((line, i) => {
                  if (
                    line.trim().startsWith("•") ||
                    line.trim().startsWith("-")
                  ) {
                    return (
                      <div key={i} className="flex pl-1 mb-1.5">
                        <span className="mr-2 text-primary-950/40">•</span>
                        <span>{line.replace(/^[•-]\s*/, "").trim()}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
