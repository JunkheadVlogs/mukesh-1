import React from 'react';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, BookOpen } from 'lucide-react';
import { guidesMeta } from '../data/guidesMeta';

export default function GuideIndex() {
  return (
    <>
      <Helmet>
        <title>Saree Buying Guides & Knowledge Hub - Mukesh Saree Centre</title>
        <meta name="description" content="Explore our comprehensive collection of saree buying guides, fabric care tutorials, and draping instructions. Master the art of choosing the perfect saree." />
        <link rel="canonical" href="https://mukeshsarees.com/guides" />
      </Helmet>

      {/* Header */}
      <section className="bg-primary-50 py-12 md:py-16 border-b border-gold-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-light text-primary-950 mb-4">
            AI Knowledge Hub & Guides
          </h1>
          <p className="max-w-2xl mx-auto text-primary-800/80 text-sm md:text-base leading-relaxed">
            Everything you need to know about purchasing, maintaining, and styling premium Indian ethnic wear. Discover the heritage and craftsmanship behind every drape.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guidesMeta.map((guide) => (
              <Link 
                key={guide.id} 
                to={`/guides/${guide.slug}`}
                className="group flex flex-col h-full bg-white border border-[#2b2b2b]/5 rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-500"
              >
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center text-white/90 text-xs font-semibold uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 mr-1.5" />
                    Read Guide
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-serif text-primary-950 mb-3 group-hover:text-[var(--color-gold)] transition-colors duration-300">
                    {guide.title}
                  </h2>
                  <p className="text-sm text-primary-900/70 line-clamp-3 mb-6 flex-1">
                    {guide.description}
                  </p>
                  <div className="flex items-center text-[13px] font-medium text-[var(--color-gold)] mt-auto group-hover:translate-x-1 transition-transform duration-300">
                    Explore Guide <ArrowRight className="w-4 h-4 ml-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
