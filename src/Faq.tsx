import { BUSINESS_INFO } from "./config/business";
import { useState, useMemo } from 'react';
import { SEO } from './components/SEO';
import { faqs, FAQ } from './data/faqsData';
import { 
  Search, 
  ChevronDown, 
  HelpCircle, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Sparkles, 
  Scissors, 
  Award,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router';

const categoryLabels = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "orders", label: "Ordering", icon: ShoppingBag },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "returns", label: "Returns", icon: RotateCcw },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "fabrics", label: "Fabrics & Care", icon: Sparkles },
  { id: "wholesale", label: "Wholesale", icon: Award },
  { id: "guides", label: "Buying Guides", icon: BookOpen },
  { id: "support", label: "Support", icon: Scissors }
];

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Initialize with all questions set to collapsed (false) by default
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    faqs.forEach((faq) => {
      initial[faq.q] = false;
    });
    return initial;
  });

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch = 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const jsonLdSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };
  }, []);

  const handleToggle = (questionText: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionText]: !prev[questionText]
    }));
  };

  const isAllExpanded = useMemo(() => {
    if (filteredFaqs.length === 0) return false;
    return filteredFaqs.every((faq) => !!expandedQuestions[faq.q]);
  }, [filteredFaqs, expandedQuestions]);

  const toggleAll = () => {
    const nextState: Record<string, boolean> = {};
    if (!isAllExpanded) {
      filteredFaqs.forEach((faq) => {
        nextState[faq.q] = true;
      });
    }
    setExpandedQuestions(nextState);
  };

  return (
    <div className="bg-primary-50">
      <SEO 
        title="Frequently Asked Questions (FAQ) | Mukesh Saree Centre" 
        description="Browse frequently asked questions regarding shopping, delivery, payments, pure silks, linen fabrics, customized blouses, wholesale rates, and returns at Mukesh Saree Centre, Nagpur." 
        url="/faqs"
        schema={jsonLdSchema}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 md:pt-8 md:pb-16">
        
        {/* Header Section / Compact and elegant footprint */}
        <header className="faq-header text-center mb-3 md:mb-5">
          <h1 className="text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] font-serif tracking-[0.05em] text-[var(--color-dark)] mb-1 md:mb-1.5 leading-[1.3] font-normal mx-auto max-w-full px-2 text-center break-words">
            Frequently Asked Questions
          </h1>
          <div className="w-8 md:w-12 h-[1px] bg-[#C8A96B] mx-auto mb-0"></div>
        </header>

        {/* Intelligent Search Input - Compact Height 40px/44px */}
        <div className="faq-search-wrapper max-w-xl mx-auto mb-2 md:mb-3.5 relative px-1 sm:px-0">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-3.5 flex items-center pointer-events-none text-primary-950/40">
            <Search size={15} className="md:w-[16px] md:h-[16px]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Search questions (e.g. shipping, Paithani, wholesale)..."
            className="w-full h-[38px] md:h-[42px] bg-white pl-9 pr-14 border border-[var(--color-border)] rounded-[4px] focus:outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B]/25 text-[11.5px] md:text-[12.5px] tracking-wide transition-all placeholder:text-neutral-400 font-sans shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[9px] sm:text-[10px] tracking-widest text-[#C8A96B] hover:text-[#a6864b] uppercase font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Tab Layout - Highly Compact, responsive and uniform */}
        <div className="faq-categories-wrapper flex flex-wrap justify-center gap-1 md:gap-1.5 mb-2.5 md:mb-4 overflow-x-auto pb-1 px-1 sm:px-0 no-scrollbar scrollbar-hide">
          {categoryLabels.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                }}
                className={`flex items-center justify-center gap-1 px-2.5 py-1.5 md:gap-1.5 md:px-3 md:py-2 text-[9.5px] xs:text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.1em] font-sans transition-all duration-300 rounded-[4px] border select-none shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-dark)] border-[var(--color-dark)] text-white shadow-sm"
                    : "bg-white border-[var(--color-border)] text-[#2C241B]/80 hover:border-[#C8A96B] hover:text-[#C8A96B]"
                }`}
              >
                <Icon className={`${isActive ? "text-gold-200" : "text-[#2C241B]/40"} w-3 h-3 md:w-3.5 md:h-3.5`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Expand/Collapse Controls - Compact Margins */}
        <div className="faq-controls-wrapper max-w-4xl mx-auto flex justify-between items-center mb-1.5 md:mb-2 px-1.5">
          <span className="text-[11px] sm:text-[12px] text-[#2C241B]/60 uppercase tracking-[0.08em] font-sans font-medium">
            {filteredFaqs.length} {filteredFaqs.length === 1 ? "Question" : "Questions"} found
          </span>
          {filteredFaqs.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="text-[11px] sm:text-[11.5px] text-[#C8A96B] hover:text-[#a6864b] uppercase tracking-[0.05em] font-sans font-semibold cursor-pointer transition-colors focus:outline-none"
            >
              {isAllExpanded ? "Collapse All" : "Expand All"}
            </button>
          )}
        </div>

        {/* FAQs Accordion Container */}
        <div className="faq-accordion-container bg-white rounded-[4px] border border-[var(--color-border)] shadow-sm max-w-4xl mx-auto overflow-hidden">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-0 text-left">
              {filteredFaqs.map((faq, idx) => {
                const isExpanded = !!expandedQuestions[faq.q];
                return (
                  <div 
                    key={idx} 
                    className={`faq-accordion-item border-b border-[var(--color-border)]/40 last:border-b-0 transition-colors duration-300 ${
                      isExpanded ? "bg-[#FAF8F4]/30" : "hover:bg-neutral-50/20"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggle(faq.q)}
                      aria-expanded={isExpanded}
                      className="faq-accordion-button w-full text-left py-[6px] px-[12px] md:py-[8px] md:px-[18px] flex justify-between items-center gap-2.5 md:gap-4 focus:outline-none cursor-pointer group transition-colors duration-300"
                    >
                      <span className="text-[12.5px] xs:text-[13px] sm:text-[13.5px] md:text-[14.5px] font-medium text-[#2C241B]/95 tracking-wide leading-[1.35] group-hover:text-[#C8A96B] transition-colors duration-300 m-0">
                        {faq.q}
                      </span>
                      <span className="text-[#C8A96B] shrink-0 transition-transform duration-300 ease-in-out flex items-center" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                        <ChevronDown size={14} strokeWidth={2} className="xs:w-[15px] xs:h-[15px] md:w-[17px] md:h-[17px]" />
                      </span>
                    </button>
                    
                    {isExpanded && (
                      <div
                        className="overflow-hidden transition-all duration-200"
                      >
                        <div className="px-[14px] pb-[12px] pt-[3px] md:px-[20px] md:pb-[15px] md:pt-[5px] border-t border-[var(--color-border)]/20">
                          <p className="text-[12px] xs:text-[12.5px] sm:text-[13px] md:text-[13.5px] text-[#2C241B]/75 leading-relaxed font-normal m-0 whitespace-pre-wrap">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <HelpCircle className="mx-auto text-primary-950/20 mb-3" size={38} />
              <h4 className="text-sm font-serif text-primary-950/60 uppercase tracking-[0.1em] font-bold">No questions found</h4>
              <p className="text-xs text-primary-950/50 mt-1">Try broadening your search query or choosing another category above.</p>
            </div>
          )}
        </div>

        {/* Still Need Help CTA Block */}
        <div className="mt-6 md:mt-8 text-center bg-[var(--color-dark)] rounded-[4px] py-6 px-4 md:py-8 md:px-6 max-w-4xl mx-auto text-white shadow-md border border-[var(--color-border)]/20">
          <h2 className="text-base sm:text-lg md:text-xl font-serif text-[#E7D3A8] mb-1.5 md:mb-2 tracking-wide font-normal">Still have questions?</h2>
          <p className="text-white/70 mb-4 md:mb-5 text-[11px] sm:text-[12px] md:text-[12.5px] max-w-md mx-auto leading-relaxed font-sans">
            Our boutique specialists are here to guide you with fabric weights, customized measurements, tailored readymade blouses, or bulk shipping.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 max-w-xs sm:max-w-md mx-auto">
            <Link 
              to="/contact" 
              className="w-full sm:w-auto inline-block bg-white text-[var(--color-dark)] px-6 py-2.5 text-[10.5px] font-bold uppercase tracking-widest hover:bg-[#FAF8F4]/90 transition-all duration-300 shadow-sm rounded-[2px] cursor-pointer"
            >
              Get in Touch
            </Link>
            <a 
              href={`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/25 text-white px-6 py-2.5 text-[10.5px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300 rounded-[2px] cursor-pointer"
            >
              WhatsApp Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
