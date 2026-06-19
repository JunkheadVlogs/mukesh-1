import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { guidesMeta } from '../data/guidesMeta';

// Dynamically import all markdown files from the content directory
const markdownModules = import.meta.glob('../content/guides/*.md', { query: '?raw', import: 'default' });

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const guide = guidesMeta.find((g) => g.slug === slug);

  useEffect(() => {
    async function loadContent() {
      if (!guide) return;
      setIsLoading(true);
      try {
        // Try to load the matching markdown file
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

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  const relatedGuides = guidesMeta.filter(g => guide.relatedSlugs.includes(g.slug));

  // Generate Schema.org JSON-LD
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.description,
    "image": guide.image,
    "author": {
      "@type": "Organization",
      "name": guide.author,
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

      {/* Breadcrumbs */}
      <div className="bg-[#FAF8F5] border-b border-gold-200/30 pt-28 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center text-[11px] md:text-xs font-medium tracking-wide uppercase text-primary-900/60 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Link to="/" className="hover:text-[var(--color-gold)] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-1.5 flex-shrink-0" />
          <Link to="/guides" className="hover:text-[var(--color-gold)] transition-colors">Knowledge Hub</Link>
          <ChevronRight className="w-3 h-3 mx-1.5 flex-shrink-0" />
          <span className="text-[var(--color-gold)]">{guide.title}</span>
        </div>
      </div>

      <article className="py-10 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <header className="mb-10 md:mb-14 text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-primary-950 mb-6 leading-tight">
              {guide.title}
            </h1>
            <p className="text-base md:text-lg text-primary-800/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              {guide.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-primary-900/60 border-t border-b border-primary-100 py-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1.5" />
                <span>{guide.author}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-primary-300" />
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Updated: {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(guide.lastUpdated))}</span>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="mb-12 md:mb-16 rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={guide.image} 
              alt={guide.title}
              className="w-full h-auto max-h-[500px] object-cover"
              loading="eager"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="animate-pulse space-y-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-40 bg-gray-200 rounded w-full mt-8"></div>
                </div>
              ) : (
                <div className="prose prose-lg prose-primary max-w-none text-[#2b2b2b]/90
                  prose-headings:font-serif prose-headings:font-light prose-headings:text-primary-950
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gold-200/30
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:leading-loose prose-p:mb-6
                  prose-a:text-[var(--color-gold)] prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:shadow-sm"
                >
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              )}

              {/* FAQs */}
              {guide.faqs && guide.faqs.length > 0 && (
                <div className="mt-16 pt-12 border-t border-primary-200">
                  <h2 className="text-3xl font-serif text-primary-950 mb-8">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                    {guide.faqs.map((faq, index) => (
                      <div key={index} className="bg-[#FAF8F5] rounded-xl p-6 border border-primary-100">
                        <h3 className="text-lg font-serif font-medium text-primary-950 mb-3">{faq.question}</h3>
                        <p className="text-sm text-primary-800/80 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0 space-y-10">
              
              {/* Categories */}
              <div className="bg-[#FAF8F5] p-6 rounded-xl border border-primary-100">
                <h3 className="text-lg font-serif text-primary-950 mb-4 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-[var(--color-gold)]" />
                  Related Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {guide.productCategories.map((cat, i) => (
                    <Link 
                      key={i} 
                      to={`/shop?category=${cat.replace(/\s+/g, '-')}`}
                      className="px-3 py-1.5 bg-white border border-primary-200 rounded-full text-xs text-primary-800 hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Articles */}
              {relatedGuides.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-primary-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-serif text-primary-950 mb-6">Related Guides</h3>
                  <div className="space-y-6">
                    {relatedGuides.map(related => (
                      <Link 
                        key={related.id} 
                        to={`/guides/${related.slug}`}
                        className="group flex gap-4 items-start"
                      >
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-primary-100">
                          <img 
                            src={related.image} 
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-primary-950 group-hover:text-[var(--color-gold)] transition-colors line-clamp-2 mb-1">
                            {related.title}
                          </h4>
                          <span className="text-[10px] text-primary-900/50 uppercase tracking-wider">
                            Read Guide
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-primary-950 p-8 rounded-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
                <h3 className="text-xl font-serif text-white mb-3 relative z-10">Ready to Shop?</h3>
                <p className="text-sm text-white/70 mb-6 relative z-10">
                  Explore our curated collection of premium sarees based on this guide.
                </p>
                <Link to="/shop" className="btn-primary w-full relative z-10 bg-[var(--color-gold)] text-white hover:bg-[var(--color-gold)]/90 border-transparent">
                  View Collections
                </Link>
              </div>

            </aside>

          </div>
          
          {/* Footer Nav */}
          <div className="mt-16 pt-8 border-t border-primary-200">
            <Link to="/guides" className="inline-flex items-center text-sm font-medium text-primary-800 hover:text-[var(--color-gold)] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Knowledge Hub
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}
