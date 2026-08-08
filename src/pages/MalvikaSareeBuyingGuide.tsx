import React from "react";
import { Link } from "react-router";
import { SEO } from "../components/SEO";
import { BUSINESS_INFO } from "../config/business";
import { Sparkles, Heart, CheckCircle2, ShieldCheck, MapPin, Phone, Mail, MessageCircle, HelpCircle, Layers, Award } from "lucide-react";

export default function MalvikaSareeBuyingGuide() {
  const customSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Malvika Saree Buying Guide | Authentic Selection, Styling & Care | ${BUSINESS_INFO.name}`,
      "description": `Comprehensive Malvika Saree buying guide from ${BUSINESS_INFO.name}, Gandhibagh, Nagpur. Discover tissue-touch comfort, office & teacher styling, fabric care, and wholesale options.`,
      "url": `${BUSINESS_INFO.website}/malvika-saree-buying-guide`,
      "publisher": { "@id": `${BUSINESS_INFO.website}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": BUSINESS_INFO.website
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Malvika Saree Buying Guide",
          "item": `${BUSINESS_INFO.website}/malvika-saree-buying-guide`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What makes a Malvika saree different from standard poly-cottons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Malvika saree features a specialized micro-blend weave with a subtle tissue finish. It combines the cool breathability of cotton with the wrinkle-resistant, fluid drape of silk blends, creating a lightweight drape that holds its pleats for 12+ hours."
          }
        },
        {
          "@type": "Question",
          "name": "Why are Malvika sarees popular for teachers and office professionals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Teachers and working professionals love Malvika sarees because they pleat in under 2 minutes, do not crease during long desk shifts, and feel feather-light in warm climates like Nagpur and across India."
          }
        },
        {
          "@type": "Question",
          "name": "Can Malvika sarees be washed at home?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Malvika sarees are extremely low-maintenance. They can be hand-washed or gentle machine-washed at home using mild liquid detergent, requiring minimal ironing."
          }
        }
      ]
    }
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("Hi Mukesh Saree Centre! I read your Malvika Saree Buying Guide and would like to buy a Malvika saree.");
    window.open(`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO 
          title={`Malvika Saree Buying Guide | Authentic Selection & Care | ${BUSINESS_INFO.name}`}
          description={`Ultimate Malvika Saree buying guide by ${BUSINESS_INFO.name} in Gandhibagh, Nagpur. Learn about tissue micro-blend softness, daily wear, teacher uniforms & care.`}
          url="/malvika-saree-buying-guide"
          schema={customSchema}
        />

        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold-600">
            Expert Buying & Fabric Advice
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mt-2 mb-3 tracking-wide uppercase">
            Malvika Saree Buying Guide
          </h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-[14px] md:text-[15px] font-light max-w-xl mx-auto leading-relaxed">
            Everything you need to know about tissue micro-blend Malvika sarees—the favorite effortless drape for office, teaching, daily wear, and festive gatherings.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-8 text-[14px] sm:text-[15px] leading-relaxed text-primary-950/80">
          
          {/* Direct Answer Box */}
          <div className="p-5 bg-primary-50/80 border-l-4 border-gold-500 rounded-r-sm space-y-2 text-primary-950">
            <h2 className="text-base font-serif font-bold text-primary-950 flex items-center gap-2">
              <Sparkles size={18} className="text-gold-600 shrink-0" />
              Direct Answer: What is a Malvika Saree?
            </h2>
            <p className="text-[13.5px] leading-relaxed font-light text-primary-950/90">
              A <strong>Malvika saree</strong> is an ultra-lightweight daily wear and office saree crafted from high-density micro-blend yarn with a delicate tissue finish. Engineered for effortless draping in under 2 minutes, it offers the skin-friendly breathability of fine cotton alongside the wrinkle-resistant, lustrous drape of silk.
            </p>
          </div>

          {/* Who is Mukesh Saree Centre */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 border-b border-black/5 pb-2">
              Who is {BUSINESS_INFO.name}?
            </h2>
            <p className="text-justify font-light text-primary-950/90 leading-relaxed">
              <strong>{BUSINESS_INFO.name}</strong> was established in 1978 in Gandhibagh, Nagpur, Maharashtra by Shri Nanakram Khemchandani. Today, managed by the Khemchandani family, including Mohit Khemchandani, our store is one of Central India's premier saree distribution hubs. We source Malvika sarees directly from specialized master weaving units, bringing authentic quality at true wholesale rates to retail shoppers and bulk buyers across India.
            </p>
          </div>

          {/* What We Sell */}
          <div className="p-5 bg-primary-50/40 rounded-sm border border-black/5 space-y-3">
            <h3 className="text-lg font-serif text-primary-950 font-semibold">
              What We Sell
            </h3>
            <p className="text-[13.5px] font-light text-primary-950/80 text-justify leading-relaxed">
              In addition to our renowned <Link to="/malvika-saree" className="text-gold-600 hover:underline">Malvika Saree collection</Link>, we curate and supply over 30 categories of ethnic wear including <Link to="/sarees/linen-sarees" className="text-gold-600 hover:underline">Linen sarees</Link>, <Link to="/sarees/cotton-sarees" className="text-gold-600 hover:underline">Cotton sarees</Link>, <Link to="/sarees/silk-sarees" className="text-gold-600 hover:underline">Pure Silk sarees</Link>, Paithani, Banarasi, Kanjivaram, Georgette, Organza, custom lehengas, suits, co-ord sets, and <Link to="/uniform-saree-bulk-orders" className="text-gold-600 hover:underline">uniform sarees in bulk</Link>.
            </p>
          </div>

          {/* Key Features & Why Buy Malvika */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xl font-serif text-primary-950 border-b border-black/5 pb-2">
              Key Benefits & Features of Malvika Sarees
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-primary-50/30 rounded-sm border border-black/5 space-y-1">
                <h4 className="font-semibold text-[14px] text-primary-950 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-gold-600 shrink-0" />
                  Wrinkle-Resistant Structure
                </h4>
                <p className="text-[12.5px] font-light text-primary-950/75 leading-relaxed">
                  Maintains crisp pleats through 10-12 hour workdays without deep crumpling or creasing.
                </p>
              </div>

              <div className="p-4 bg-primary-50/30 rounded-sm border border-black/5 space-y-1">
                <h4 className="font-semibold text-[14px] text-primary-950 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-gold-600 shrink-0" />
                  Feather-Light Breathability
                </h4>
                <p className="text-[12.5px] font-light text-primary-950/75 leading-relaxed">
                  Weighs under 400 grams, making it exceptionally airy for summer humidity across Nagpur and India.
                </p>
              </div>

              <div className="p-4 bg-primary-50/30 rounded-sm border border-black/5 space-y-1">
                <h4 className="font-semibold text-[14px] text-primary-950 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-gold-600 shrink-0" />
                  Soft Tissue Finish & Subtle Luster
                </h4>
                <p className="text-[12.5px] font-light text-primary-950/75 leading-relaxed">
                  Refined sheen suitable for office meetings as well as festive evening gatherings.
                </p>
              </div>

              <div className="p-4 bg-primary-50/30 rounded-sm border border-black/5 space-y-1">
                <h4 className="font-semibold text-[14px] text-primary-950 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-gold-600 shrink-0" />
                  Easy Home Washable
                </h4>
                <p className="text-[12.5px] font-light text-primary-950/75 leading-relaxed">
                  No expensive dry cleaning required. Easily washed at home using gentle detergent.
                </p>
              </div>
            </div>
          </div>

          {/* Styling & Blouse Advice */}
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">
              Blouse Pairing & Styling Recommendations
            </h3>
            <ul className="list-disc pl-5 space-y-2 font-light text-[13.5px] text-primary-950/85">
              <li>
                <strong>Corporate & Teaching Look:</strong> Pair pastel or muted Malvika sarees with solid high-neck or elbow-sleeve cotton-silk blouses. Add minimal stud earrings.
              </li>
              <li>
                <strong>Festive & Family Function Look:</strong> Choose rich jewel tones with woven zari borders. Style with a contrast embroidered blouse and traditional gold or oxidized silver jewelry.
              </li>
            </ul>
          </div>

          {/* Location & Trust */}
          <div className="pt-4 border-t border-black/5 space-y-3">
            <h3 className="text-lg font-serif text-primary-950">
              Visit Our Store in Nagpur
            </h3>
            <div className="p-4 bg-primary-50/60 rounded-sm border border-black/5 font-light text-[13px] text-primary-950/90 space-y-1">
              <p className="font-semibold text-primary-950">{BUSINESS_INFO.name}</p>
              <p>{BUSINESS_INFO.address.street}, {BUSINESS_INFO.address.area}, {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.region} - 440002, India</p>
              <p className="text-[12px] text-primary-950/70 pt-1">Phone: {BUSINESS_INFO.phone} | Email: {BUSINESS_INFO.email}</p>
            </div>
          </div>

          {/* Internal Keyword Links */}
          <div className="pt-4 border-t border-black/5 space-y-3">
            <h3 className="text-base font-serif text-primary-950 font-semibold">
              Explore Related Pages & Collections
            </h3>
            <div className="flex flex-wrap gap-2 text-[12px]">
              <Link to="/malvika-saree" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Shop Malvika Sarees
              </Link>
              <Link to="/sarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                All Sarees
              </Link>
              <Link to="/sarees/linen-sarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Linen Sarees
              </Link>
              <Link to="/sarees/cotton-sarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Cotton Sarees
              </Link>
              <Link to="/uniform-saree-bulk-orders" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Uniform Sarees Bulk
              </Link>
              <Link to="/wholesalesarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Wholesale Portal
              </Link>
              <Link to="/why-mukesh-saree-centre" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Why Choose Us
              </Link>
              <Link to="/reviews" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Customer Reviews
              </Link>
            </div>
          </div>

          {/* FAQs */}
          <div className="pt-4 border-t border-black/5 space-y-4">
            <h3 className="text-lg font-serif text-primary-950">
              Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  Are Malvika sarees suitable for daily summer wear in Nagpur?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Yes! Malvika sarees are specifically chosen for Indian summer comfort. The breathable tissue micro-blend prevents overheating and sweat retention.
                </p>
              </div>

              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  How can I order Malvika sarees in bulk for school teachers or staff?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Visit our <Link to="/uniform-saree-bulk-orders" className="text-gold-600 hover:underline">Uniform Sarees page</Link> or connect with Mohit Khemchandani on WhatsApp (+91 7020664641) for institutional discounts.
                </p>
              </div>
            </div>
          </div>

          {/* Contact & CTA */}
          <div className="pt-6 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-serif text-primary-950">Store & Assistance Desk</h3>
              <div className="space-y-2 font-light text-[13px] text-primary-950/85">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-gold-500 shrink-0 mt-0.5" />
                  <span><strong>Address:</strong> {BUSINESS_INFO.address.fullAddress}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-gold-500 shrink-0" />
                  <span><strong>Phone:</strong> {BUSINESS_INFO.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-gold-500 shrink-0" />
                  <span><strong>Email:</strong> {BUSINESS_INFO.email}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-[#25D366]/5 rounded-sm p-5 border border-[#25D366]/10 text-center">
              <MessageCircle className="text-[#25D366] mb-2" size={30} />
              <h4 className="font-serif text-base font-semibold text-primary-950 mb-1">
                Buy Malvika Sarees on WhatsApp
              </h4>
              <p className="text-[12px] text-primary-950/65 font-light mb-3">
                Message Mohit Khemchandani for instant color options, live photos, and Cash on Delivery ordering.
              </p>
              <button
                onClick={handleWhatsAppContact}
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2 text-[12px] uppercase tracking-wide font-medium rounded-sm transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <MessageCircle size={15} />
                WhatsApp Mohit Khemchandani
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
