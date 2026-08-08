import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, User, ArrowLeft, Tag, Share2, Link2 } from 'lucide-react';
import { guidesMeta } from '../data/guidesMeta';
import { products } from '../mockData';
import Breadcrumb from '../components/Breadcrumb';

// Dynamically import all markdown files from the content directory
const markdownModules = import.meta.glob('../content/guides/*.md', { query: '?raw', import: 'default' });

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

// Accessible FAQ Accordion Item Component
const FaqAccordionItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#FAF8F5] py-5 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-content-${index}`}
        id={`faq-btn-${index}`}
        className="w-full flex justify-between items-center text-left py-2 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96B] focus-visible:ring-offset-2"
      >
        <span className="font-serif text-[#1A1513] text-base sm:text-lg group-hover:text-[#C8A96B] transition-colors duration-300 pr-4">
          {question}
        </span>
        <span className="ml-4 flex-shrink-0 text-[#8C827A] group-hover:text-[#C8A96B] transition-all duration-300">
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C8A96B]' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        id={`faq-content-${index}`}
        aria-labelledby={`faq-btn-${index}`}
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm sm:text-[15px] text-[#5F5A54] leading-relaxed font-sans pr-6">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const guide = guidesMeta.find((g) => g.slug === slug);

  // Set current URL client-side to prevent SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [slug]);

  // Handle Scroll Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function loadContent() {
      if (!guide) return;
      setIsLoading(true);
      try {
        const path = `../content/guides/${guide.slug}.md`;
        const moduleLoader = markdownModules[path];
        
        if (moduleLoader) {
          const rawMarkdown = await moduleLoader() as string;
          setContent(rawMarkdown);
        } else {
          setContent('Content coming soon.');
        }
      } catch (error) {
        console.error('Error loading markdown:', error);
        setContent('Error loading content.');
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
    window.scrollTo(0, 0);
  }, [guide]);

  // Parse Headings dynamically for TOC
  const headings = useMemo(() => {
    if (!content) return [];
    const lines = content.split('\n');
    const list: HeadingItem[] = [];
    lines.forEach(line => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);
      if (h2Match) {
        const text = h2Match[1].replace(/\*+/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        list.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].replace(/\*+/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        list.push({ id, text, level: 3 });
      }
    });
    return list;
  }, [content]);

  // Set up dynamic active heading detection on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings, content]);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  // Next & Previous articles navigation
  const currentIndex = guidesMeta.findIndex(g => g.slug === slug);
  const prevGuide = currentIndex > 0 ? guidesMeta[currentIndex - 1] : null;
  const nextGuide = currentIndex < guidesMeta.length - 1 ? guidesMeta[currentIndex + 1] : null;

  const relatedGuides = guidesMeta.filter(g => guide.relatedSlugs.includes(g.slug));

  // Shop the Story dynamic curation based on guide categories
  const relatedProducts = useMemo(() => {
    if (!guide.productCategories || guide.productCategories.length === 0) {
      return products.slice(0, 3);
    }
    const matched = products.filter(p => 
      guide.productCategories.some(cat => 
        p.category.toLowerCase().includes(cat.toLowerCase()) || 
        cat.toLowerCase().includes(p.category.toLowerCase())
      )
    );
    return matched.length > 0 ? matched.slice(0, 3) : products.slice(0, 3);
  }, [guide.productCategories]);

  // Generate Schema.org JSON-LD
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.description,
    "image": guide.image,
    "author": {
      "@type": "Organization",
      "name": "Mukesh Saree Centre",
      "url": "https://mukeshsarees.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mukesh Saree Centre",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mukeshsarees.com/logo.png"
      }
    },
    "datePublished": guide.date,
    "dateModified": guide.lastUpdated,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://mukeshsarees.com/guides/${guide.slug}`
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": guide.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mukeshsarees.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Knowledge Hub",
        "item": "https://mukeshsarees.com/guides"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": guide.title,
        "item": `https://mukeshsarees.com/guides/${guide.slug}`
      }
    ]
  };

  const getCleanMarkdown = (raw: string) => {
    let cleaned = raw.trim();
    if (cleaned.startsWith('#')) {
      const firstNewlineIndex = cleaned.indexOf('\n');
      if (firstNewlineIndex !== -1) {
        cleaned = cleaned.substring(firstNewlineIndex).trim();
      } else {
        cleaned = '';
      }
    }
    return cleaned;
  };

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!content) return null;
    const wordsPerMinute = 225;
    const noOfWords = content.split(/\s+/).length;
    const minutes = Math.ceil(noOfWords / wordsPerMinute);
    return `${minutes} min read`;
  }, [content]);

  // Social Sharing Logic
  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Breadcrumbs element
  const memoizedBreadcrumbs = useMemo(() => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Knowledge Hub', path: '/guides' },
      { label: guide.title }
    ];
    return <Breadcrumb items={items} />;
  }, [guide.title]);

  return (
    <>
      <Helmet>
        <title>{guide.title} - Mukesh Saree Centre</title>
        <meta name="description" content={guide.description} />
        <link rel="canonical" href={`https://mukeshsarees.com/guides/${guide.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {guide.faqs.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-[#C8A96B] z-[100] transition-all duration-100" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Breadcrumbs (Header -> Breadcrumb: 12px / pt-3) */}
      {memoizedBreadcrumbs}

      <article className="pb-12 md:pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb -> Category: 8px (mt-2) */}
          <div className="text-center mt-2">
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.25em] text-[#C8A96B] uppercase">
              {guide.productCategories?.[0] || "AI Knowledge Hub"}
            </span>
          </div>

          {/* Category -> H1: 8px (mt-2) */}
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-serif text-[#1A1513] font-light tracking-tight leading-tight mt-2 mb-0">
            {guide.title}
          </h1>

          {/* H1 -> Summary: 16px (mt-4) */}
          <p className="text-center text-base sm:text-lg text-[#5F5A54]/90 italic max-w-2xl mx-auto leading-relaxed font-serif mt-4 mb-0">
            {guide.description}
          </p>

          {/* Summary -> Author: 16px (mt-4) */}
          <div className="flex flex-col items-center mt-4">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.15em] font-sans font-semibold text-[#1A1513]">
              Mukesh Saree Centre
            </span>
            {/* Author -> Reading Time: 8px (mt-2) */}
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-sans text-[#8C827A] mt-2">
              {readingTime}
            </span>
          </div>

          {/* Reading Time -> Featured Image: 24px (mt-6) */}
          <div className="guide-featured-image-wrapper mt-6 mb-0 rounded-lg overflow-hidden border border-[#FAF8F5]">
            <img 
              src={guide.image} 
              alt={guide.title} width="800" height="500"
              className="w-full h-auto max-h-[520px] object-cover hover:scale-[1.01] transition-transform duration-1000 ease-out"
              loading="eager"
            />
          </div>

          {/* Featured Image -> TOC/Content: 32px (mt-8) */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mt-8">
            
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              
              {/* Collapsible Table of Contents for Mobile & Tablet */}
              {headings.length > 0 && (
                <div className="lg:hidden mb-8 border border-[#EAE6E1] bg-[#FCFAF8] p-5 rounded-none">
                  <button 
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                    aria-expanded={isTocOpen}
                    aria-controls="mobile-toc-container"
                  >
                    <span className="text-xs font-sans tracking-widest uppercase font-semibold text-[#1A1513] flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#C8A96B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      Table of Contents
                    </span>
                    <svg 
                      className={`w-4 h-4 text-[#8C827A] transition-transform duration-300 ${isTocOpen ? 'rotate-180 text-[#C8A96B]' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    id="mobile-toc-container"
                    className={`transition-all duration-300 overflow-hidden ${isTocOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                  >
                    <ul className="space-y-3 font-sans text-xs sm:text-sm pl-2">
                      {headings.map(heading => (
                        <li 
                          key={heading.id}
                          style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
                        >
                          <a 
                            href={`#${heading.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const el = document.getElementById(heading.id);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth' });
                                setIsTocOpen(false);
                              }
                            }}
                            className={`block hover:text-[#C8A96B] transition-colors ${
                              activeId === heading.id ? 'text-[#C8A96B] font-semibold' : 'text-[#5F5A54]'
                            }`}
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="animate-pulse space-y-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-40 bg-gray-200 rounded w-full mt-8"></div>
                </div>
              ) : (
                <div className="prose prose-neutral max-w-none 
                  prose-headings:font-serif prose-headings:text-[#1A1513] prose-headings:font-normal prose-headings:tracking-tight
                  prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:border-b prose-h2:border-[#FAF8F5] prose-h2:pb-3 prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-[#3A322C] prose-p:leading-loose prose-p:text-base md:prose-p:text-[17px] prose-p:mb-6 prose-p:font-sans
                  prose-strong:text-[#1A1513] prose-strong:font-semibold
                  prose-a:text-[#C8A96B] prose-a:no-underline hover:prose-a:underline hover:text-[#B29054] transition-colors"
                >
                  <ReactMarkdown
                    components={{
                      h2: ({ children, ...props }) => {
                        const text = React.Children.toArray(children).join('');
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        return <h2 id={id} className="text-2xl md:text-3xl font-serif text-[#1A1513] border-b border-[#FAF8F5] pb-3 mt-12 mb-6 font-light" {...props}>{children}</h2>;
                      },
                      h3: ({ children, ...props }) => {
                        const text = React.Children.toArray(children).join('');
                        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        return <h3 id={id} className="text-xl md:text-2xl text-[#1A1513] mt-8 mb-4 font-serif font-light" {...props}>{children}</h3>;
                      },
                      blockquote: ({ children, ...props }) => (
                        <blockquote className="border-l-4 border-[#C8A96B] pl-6 py-2 my-8 italic font-serif text-lg text-[#5F5A54] bg-[#FCFAF8] pr-4 rounded-r-sm" {...props}>
                          {children}
                        </blockquote>
                      ),
                      table: ({ children, ...props }) => (
                        <div className="overflow-x-auto my-8 border border-[#EAE6E1] rounded-sm shadow-sm">
                          <table className="min-w-full divide-y divide-[#EAE6E1] text-sm font-sans" {...props}>
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children, ...props }) => (
                        <thead className="bg-[#FCFAF8]" {...props}>
                          {children}
                        </thead>
                      ),
                      th: ({ children, ...props }) => (
                        <th className="px-6 py-4 text-left text-xs font-sans font-semibold uppercase tracking-wider text-[#1A1513] border-b border-[#EAE6E1]" {...props}>
                          {children}
                        </th>
                      ),
                      td: ({ children, ...props }) => (
                        <td className="px-6 py-4 text-sm text-[#3A322C] border-b border-[#FAF8F5] whitespace-nowrap" {...props}>
                          {children}
                        </td>
                      ),
                      ul: ({ children, ...props }) => (
                        <ul className="list-none pl-0 my-6 space-y-3" {...props}>
                          {React.Children.map(children, (child) => {
                            if (React.isValidElement(child)) {
                              const childElement = child as React.ReactElement<{ children?: React.ReactNode }>;
                              return (
                                <li className="flex items-start text-sm sm:text-base md:text-[17px] text-[#3A322C] leading-relaxed font-sans">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C8A96B] mt-2.5 mr-3 flex-shrink-0" />
                                  <span className="flex-1">{childElement.props.children}</span>
                                </li>
                              );
                            }
                            return child;
                          })}
                        </ul>
                      ),
                      ol: ({ children, ...props }) => (
                        <ol className="list-decimal pl-6 my-6 space-y-3 text-[#3A322C] font-sans text-sm sm:text-base md:text-[17px] leading-relaxed" {...props}>
                          {children}
                        </ol>
                      ),
                      p: ({ children, ...props }) => {
                        const textContent = React.Children.toArray(children).join('');
                        
                        // Expert / Pro / Buying Tip Highlight Box
                        if (textContent.startsWith('Pro Tip:') || textContent.startsWith('Expert Tip:') || textContent.startsWith('Buying Tip:')) {
                          const title = textContent.split(':')[0] + ':';
                          const body = textContent.substring(title.length).trim();
                          return (
                            <div className="my-8 p-6 bg-[#FCFAF8] border-l-2 border-[#C8A96B] rounded-none shadow-[0_2px_12px_rgba(200,169,107,0.03)] font-sans">
                              <span className="block text-[10px] sm:text-xs uppercase tracking-widest text-[#C8A96B] font-bold mb-2">{title}</span>
                              <p className="text-sm sm:text-[15px] text-[#3A322C] leading-relaxed m-0 font-sans">{body}</p>
                            </div>
                          );
                        }

                        // Key Takeaways or Did You Know Highlight Box
                        if (textContent.startsWith('Key Takeaways:') || textContent.startsWith('Did You Know:')) {
                          const title = textContent.split(':')[0] + ':';
                          const body = textContent.substring(title.length).trim();
                          return (
                            <div className="my-8 p-6 bg-[#FCFAF8] border-l-2 border-[#1A1513] rounded-none font-sans">
                              <span className="block text-[10px] sm:text-xs uppercase tracking-widest text-[#1A1513] font-bold mb-2">{title}</span>
                              <p className="text-sm sm:text-[15px] text-[#3A322C] leading-relaxed m-0 font-sans">{body}</p>
                            </div>
                          );
                        }

                        // Common Mistakes Highlight Box
                        if (textContent.startsWith('Common Mistakes:')) {
                          const title = "Common Mistakes";
                          const body = textContent.substring("Common Mistakes:".length).trim();
                          return (
                            <div className="my-8 p-6 bg-[#FFF9F9] border-l-2 border-[#D97706] rounded-none font-sans">
                              <span className="block text-[10px] sm:text-xs uppercase tracking-widest text-[#D97706] font-bold mb-2">{title}</span>
                              <p className="text-sm sm:text-[15px] text-[#3A322C] leading-relaxed m-0 font-sans">{body}</p>
                            </div>
                          );
                        }

                        return <p className="text-[#3A322C] leading-relaxed text-sm sm:text-base md:text-[17px] mb-6 font-sans" {...props}>{children}</p>;
                      }
                    }}
                  >
                    {getCleanMarkdown(content)}
                  </ReactMarkdown>
                </div>
              )}

              {/* Premium Social Sharing Section */}
              <div className="mt-12 pt-8 border-t border-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-6">
                <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#1A1513] flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-[#C8A96B]" />
                  Share This Story
                </span>
                <div className="flex items-center gap-3">
                  {/* WhatsApp */}
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(guide.title + " - " + currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-[#EAE6E1] hover:border-[#C8A96B] hover:text-[#C8A96B] flex items-center justify-center text-[#5F5A54] transition-all duration-300"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.019-5.101-2.875-6.958C16.604 1.927 14.133.91 11.503.91c-5.44 0-9.866 4.418-9.87 9.864 0 1.745.486 3.447 1.408 4.93L2.01 21.97l6.31-1.654-.273-.162z" />
                    </svg>
                  </a>
                  {/* Pinterest */}
                  <a 
                    href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(guide.image)}&description=${encodeURIComponent(guide.description)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-[#EAE6E1] hover:border-[#C8A96B] hover:text-[#C8A96B] flex items-center justify-center text-[#5F5A54] transition-all duration-300"
                    title="Pin on Pinterest"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.12-.1-.95-.2-2.4.04-3.44.22-.94 1.4-5.95 1.4-5.95s-.36-.72-.36-1.77c0-1.66.96-2.9 2.11-2.9 1 0 1.48.75 1.48 1.65 0 1-.64 2.5-.97 3.89-.28 1.17.58 2.12 1.73 2.12 2.08 0 3.68-2.2 3.68-5.37 0-2.8-2.02-4.77-4.9-4.77-3.34 0-5.3 2.5-5.3 5.1 0 1 .4 2.1.88 2.7.1.12.1.22.07.33l-.33 1.34c-.05.2-.18.27-.4.17-1.5-.7-2.45-2.88-2.45-4.63 0-3.77 2.74-7.23 7.9-7.23 4.14 0 7.37 2.95 7.37 6.9 0 4.12-2.6 7.43-6.2 7.43-1.2 0-2.35-.63-2.73-1.37l-.75 2.85c-.27 1.04-1 2.35-1.5 3.16C9.82 23.75 10.9 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-[#EAE6E1] hover:border-[#C8A96B] hover:text-[#C8A96B] flex items-center justify-center text-[#5F5A54] transition-all duration-300"
                    title="Share on Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                    </svg>
                  </a>
                  {/* Copy Link */}
                  <button 
                    onClick={handleCopyLink}
                    className="w-10 h-10 rounded-full border border-[#EAE6E1] hover:border-[#C8A96B] hover:text-[#C8A96B] flex items-center justify-center text-[#5F5A54] transition-all duration-300 relative"
                    title="Copy Link"
                  >
                    <Link2 className="w-4 h-4" />
                    {copied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1513] text-white text-[10px] tracking-wider uppercase py-1 px-2 whitespace-nowrap rounded-sm shadow-md animate-fade-in">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Accordion FAQs */}
              {guide.faqs && guide.faqs.length > 0 && (
                <div className="mt-16 pt-12 border-t border-[#FAF8F5]">
                  <h2 className="text-2xl md:text-3xl font-serif text-[#1A1513] mb-6 font-light">Frequently Asked Questions</h2>
                  <div className="border-t border-[#FAF8F5] divide-y divide-[#FAF8F5]">
                    {guide.faqs.map((faq, index) => (
                      <FaqAccordionItem 
                        key={index} 
                        question={faq.question} 
                        answer={faq.answer} 
                        index={index} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Related Products/Sarees Grid */}
              {relatedProducts.length > 0 && (
                <div className="mt-16 pt-12 border-t border-[#FAF8F5]">
                  <h3 className="text-sm font-sans tracking-[0.25em] text-[#1A1513] mb-8 text-center uppercase font-semibold">
                    Shop the Story
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {relatedProducts.map(product => (
                      <Link 
                        key={product.id}
                        to={`/product/${product.slug}`}
                        className="group flex flex-col"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-[#FAF8F5] mb-4 relative border border-[#EAE6E1]">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            width={400}
                            height={533}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                            decoding="async"
                            style={{ backgroundColor: '#FAF6F0' }}
                          />
                          {product.isNew && (
                            <span className="absolute top-3 left-3 bg-[#C8A96B] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-semibold">
                              New
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-sm text-[#1A1513] group-hover:text-[#C8A96B] transition-colors duration-300 line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-[#8C827A] mt-1 tracking-widest uppercase font-sans">
                          {product.category}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm font-semibold text-[#1A1513]">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-[#8C827A] line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous & Next Article Navigation */}
              <div className="mt-16 pt-8 border-t border-[#FAF8F5] grid grid-cols-1 sm:grid-cols-2 gap-8">
                {prevGuide ? (
                  <Link 
                    to={`/guides/${prevGuide.slug}`}
                    className="group p-5 border border-[#EAE6E1] hover:border-[#C8A96B] transition-all duration-300 text-left flex flex-col justify-between"
                  >
                    <span className="text-[9px] uppercase tracking-widest font-sans text-[#8C827A] font-medium block mb-2">Previous Article</span>
                    <span className="font-serif text-[#1A1513] group-hover:text-[#C8A96B] transition-colors duration-300 text-sm sm:text-base leading-snug line-clamp-2">{prevGuide.title}</span>
                  </Link>
                ) : <div />}

                {nextGuide ? (
                  <Link 
                    to={`/guides/${nextGuide.slug}`}
                    className="group p-5 border border-[#EAE6E1] hover:border-[#C8A96B] transition-all duration-300 text-right flex flex-col justify-between"
                  >
                    <span className="text-[9px] uppercase tracking-widest font-sans text-[#8C827A] font-medium block mb-2">Next Article</span>
                    <span className="font-serif text-[#1A1513] group-hover:text-[#C8A96B] transition-colors duration-300 text-sm sm:text-base leading-snug line-clamp-2">{nextGuide.title}</span>
                  </Link>
                ) : <div />}
              </div>

            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0 space-y-10">
              
              {/* Desktop Sticky Table of Contents */}
              {headings.length > 0 && (
                <div className="hidden lg:block bg-white p-6 border border-[#FAF8F5] shadow-[0_2px_10px_rgba(0,0,0,0.01)] lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto">
                  <h3 className="text-xs font-sans tracking-widest uppercase text-[#1A1513] mb-6 font-semibold flex items-center">
                    <svg className="w-4 h-4 mr-2 text-[#C8A96B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Table of Contents
                  </h3>
                  <ul className="space-y-4 text-xs font-sans border-l border-[#FAF8F5] relative">
                    {headings.map(heading => (
                      <li 
                        key={heading.id}
                        className="relative"
                        style={{ paddingLeft: `${(heading.level - 2) * 12 + 16}px` }}
                      >
                        {activeId === heading.id && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#C8A96B]" />
                        )}
                        <a 
                          href={`#${heading.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(heading.id);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className={`block hover:text-[#C8A96B] transition-colors duration-200 ${
                            activeId === heading.id ? 'text-[#C8A96B] font-semibold' : 'text-[#8C827A]'
                          }`}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Categories */}
              <div className="bg-[#FCFAF8] p-6 rounded-none border border-[#FAF8F5]">
                <h3 className="text-xs font-sans tracking-widest uppercase text-[#1A1513] mb-4 font-semibold">
                  Related Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {guide.productCategories.map((cat, i) => (
                    <Link 
                      key={i} 
                      to={`/shop?category=${cat.replace(/\s+/g, '-')}`}
                      className="px-3 py-2 bg-white border border-[#EAE6E1] rounded-none text-[10px] uppercase tracking-wider text-[#5F5A54] hover:text-[#C8A96B] hover:border-[#C8A96B] transition-colors duration-300"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Articles */}
              {relatedGuides.length > 0 && (
                <div className="bg-white p-6 rounded-none border border-[#FAF8F5] shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                  <h3 className="text-xs font-sans tracking-widest uppercase text-[#1A1513] mb-6 font-semibold">
                    Related Guides
                  </h3>
                  <div className="space-y-6">
                    {relatedGuides.map(related => (
                      <Link 
                        key={related.id} 
                        to={`/guides/${related.slug}`}
                        className="group flex gap-4 items-start"
                      >
                        <div className="w-16 h-16 flex-shrink-0 rounded-none overflow-hidden border border-[#EAE6E1]">
                          <img 
                            src={related.image} 
                            alt={related.title} width="64" height="64"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs md:text-sm font-serif text-[#1A1513] group-hover:text-[#C8A96B] transition-colors line-clamp-2 mb-1 font-light leading-snug">
                            {related.title}
                          </h4>
                          <span className="text-[9px] text-[#8C827A] uppercase tracking-widest font-sans font-medium">
                            Read Article
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-[#1A1513] p-8 rounded-none text-center relative overflow-hidden border border-[#C8A96B]/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96B]/5 rounded-full blur-3xl" />
                <h3 className="text-lg font-serif text-white mb-3 relative z-10 font-light">Ready to Shop?</h3>
                <p className="text-xs text-white/70 mb-6 relative z-10 font-sans tracking-wide leading-relaxed">
                  Explore our curated collection of premium sarees based on this guide.
                </p>
                <Link to="/shop" className="btn-primary w-full relative z-10 bg-[#C8A96B] text-white hover:bg-[#B29054] border-transparent uppercase tracking-widest text-[11px] py-3 rounded-none transition-colors duration-300">
                  View Collections
                </Link>
              </div>

            </aside>

          </div>
          
          {/* Footer Nav */}
          <div className="mt-16 pt-8 border-t border-[#FAF8F5]">
            <Link to="/guides" className="inline-flex items-center text-xs uppercase tracking-widest font-sans text-[#8C827A] hover:text-[#C8A96B] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Knowledge Hub
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}
