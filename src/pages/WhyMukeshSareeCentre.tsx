import React from "react";
import { Link } from "react-router";
import { SEO } from "../components/SEO";
import { BUSINESS_INFO } from "../config/business";
import { ShieldCheck, Award, Heart, Sparkles, MapPin, Phone, Mail, MessageCircle, Truck, RefreshCw, Layers } from "lucide-react";

export default function WhyMukeshSareeCentre() {
  const customSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Why Choose Mukesh Saree Centre | Trusted Saree Store in Nagpur Est. 1978`,
      "description": `Discover why thousands of retail buyers and 500+ wholesale partners trust Mukesh Saree Centre in Gandhibagh, Nagpur. Saree heritage since 1978.`,
      "url": `${BUSINESS_INFO.website}/why-mukesh-saree-centre`,
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
          "name": "Why Mukesh Saree Centre",
          "item": `${BUSINESS_INFO.website}/why-mukesh-saree-centre`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who owns and manages Mukesh Saree Centre in Nagpur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mukesh Saree Centre was established in 1978 in Gandhibagh, Nagpur by Shri Nanakram Khemchandani. Today, the store is managed and operated by the Khemchandani family, including Mohit Khemchandani."
          }
        },
        {
          "@type": "Question",
          "name": "Why are prices at Mukesh Saree Centre lower than standard retail boutiques?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Because we operate as both a major regional wholesaler and retail store. We source sarees directly from master weaver looms in Surat, Varanasi, Bengal, and Kanchipuram without middleman margins, passing wholesale savings directly to retail buyers."
          }
        },
        {
          "@type": "Question",
          "name": "What categories of sarees and ethnic wear are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer over 30 categories including Linen sarees, Cotton sarees, Pure Silk sarees, Paithani, Banarasi, Kanjivaram, Malvika tissue sarees, Georgette, Organza, Lehengas, Readymade Suits, Co-ord sets, and Uniform sarees."
          }
        }
      ]
    }
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("Hi Mukesh Saree Centre! I was reading your 'Why Choose Us' page and would like to know more about your sarees.");
    window.open(`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const pillars = [
    {
      icon: Award,
      title: "46+ Years Family Heritage (Est. 1978)",
      desc: "Founded in 1978 by Shri Nanakram Khemchandani in Gandhibagh, Nagpur, our business has built nearly half a century of trust across Vidarbha, Maharashtra, MP, and pan-India."
    },
    {
      icon: Sparkles,
      title: "Direct Weaver & Manufacturer Sourcing",
      desc: "We work directly with weaver collectives in Surat, Varanasi, Kolkata, Jaipur, and Kanchipuram—eliminating agent commission and passing true wholesale prices directly to you."
    },
    {
      icon: Layers,
      title: "30+ Curated Saree & Ethnic Collections",
      desc: "From breathable daily Linen and soft Cotton to royal Kanjivaram silk, Paithani, tissue Malvika, co-ord sets, and designer lehengas, our showroom houses over 30 versatile varieties."
    },
    {
      icon: ShieldCheck,
      title: "Strict Quality Control & Transparency",
      desc: "Every saree undergoes thorough visual and tactile inspection for thread count, dye fastness, zari softness, and border alignment before entering inventory."
    },
    {
      icon: Truck,
      title: "Pan-India Free Shipping & Safe COD",
      desc: "Order with total peace of mind. We provide Cash on Delivery across India with zero hidden fees and free shipping on orders over ₹499."
    },
    {
      icon: MessageCircle,
      title: "Personal 1-on-1 Shopping Assistance",
      desc: "Shop online with the personal care of a physical visit. Connect directly with Mohit Khemchandani via WhatsApp for real-time video previewing and fabric feel guidance."
    },
    {
      icon: Heart,
      title: "Trusted Partner for 500+ Wholesale Retailers",
      desc: "We supply uniform sarees to academic institutions, corporate offices, and hospitals, alongside bulk inventory for 500+ boutique owners across India."
    }
  ];

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO 
          title={`Why Choose Mukesh Saree Centre | Saree Store Nagpur Est. 1978`}
          description={`Learn why Mukesh Saree Centre in Gandhibagh, Nagpur is Vidarbha's most trusted saree destination for 46+ years. Pure fabrics, wholesale prices, pan-India COD.`}
          url="/why-mukesh-saree-centre"
          schema={customSchema}
        />

        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold-600">
            Uncompromising Excellence
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mt-2 mb-3 tracking-wide uppercase">
            Why Choose Mukesh Saree Centre?
          </h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-[14px] md:text-[15px] font-light max-w-xl mx-auto leading-relaxed">
            46 years of family heritage, direct weaver sourcing, uncompromised fabric quality, and wholesale pricing in the heart of Nagpur.
          </p>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-8 text-[14px] sm:text-[15px] leading-relaxed text-primary-950/80">
          
          {/* Who We Are Intro */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 border-b border-black/5 pb-2">
              Who is {BUSINESS_INFO.name}?
            </h2>
            <p className="text-justify font-light text-primary-950/90 leading-relaxed">
              <strong>{BUSINESS_INFO.name}</strong> was established in 1978 on Jagnath Road, Gandhibagh, Nagpur, Maharashtra by Shri Nanakram Khemchandani. What started as a dedicated local saree venture has grown over 46 years into one of Vidarbha's largest and most trusted saree distribution centers. Today, managed by the Khemchandani family, including Mohit Khemchandani, we remain committed to making authentic Indian handloom and textile heritage affordable and accessible to every family.
            </p>
          </div>

          {/* What We Sell */}
          <div className="p-5 bg-primary-50/50 rounded-sm border border-black/5 space-y-3">
            <h3 className="text-lg font-serif text-primary-950 font-semibold">
              What We Sell
            </h3>
            <p className="text-[13.5px] font-light text-primary-950/80 text-justify leading-relaxed">
              Our showroom and online store specialize in authentic <Link to="/sarees" className="text-gold-600 hover:underline">sarees</Link> across every major Indian weave: <Link to="/sarees/linen-sarees" className="text-gold-600 hover:underline">Linen Sarees</Link>, <Link to="/sarees/cotton-sarees" className="text-gold-600 hover:underline">Cotton Sarees</Link>, <Link to="/sarees/silk-sarees" className="text-gold-600 hover:underline">Pure Silk Sarees</Link>, <Link to="/malvika-saree-buying-guide" className="text-gold-600 hover:underline">Malvika Sarees</Link>, Paithani, Banarasi, Kanjivaram, Georgette, and Organza. In addition, we supply designer lehengas, suits, co-ord sets, <Link to="/uniform-saree-bulk-orders" className="text-gold-600 hover:underline">uniform sarees for institutions</Link>, and <Link to="/wholesalesarees" className="text-gold-600 hover:underline">wholesale saree bulk orders</Link>.
            </p>
          </div>

          {/* The 7 Pillars Grid */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xl font-serif text-primary-950 border-b border-black/5 pb-2">
              The 7 Pillars of Customer Trust
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillars.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="p-4 bg-primary-50/30 rounded-sm border border-black/5 space-y-2">
                    <div className="flex items-center gap-2.5 text-gold-600 font-serif font-semibold text-[15px]">
                      <IconComponent size={20} className="shrink-0" />
                      <h4>{item.title}</h4>
                    </div>
                    <p className="text-[12.5px] font-light text-primary-950/75 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Where Located Section */}
          <div className="pt-4 border-t border-black/5 space-y-3">
            <h3 className="text-lg font-serif text-primary-950">
              Where is Mukesh Saree Centre Located?
            </h3>
            <p className="font-light text-[13.5px] text-primary-950/80 leading-relaxed text-justify">
              Our flagship physical showroom is situated in Gandhibagh, the historic textile hub of Nagpur:
            </p>
            <div className="p-4 bg-primary-50/60 rounded-sm border border-black/5 font-light text-[13px] text-primary-950/90 space-y-1">
              <p className="font-semibold text-primary-950">{BUSINESS_INFO.name}</p>
              <p>{BUSINESS_INFO.address.street}, {BUSINESS_INFO.address.area}</p>
              <p>{BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.region} - {BUSINESS_INFO.address.postalCode}, India</p>
              <p className="text-[12px] text-primary-950/70 pt-1">Business Hours: Monday to Saturday, 10:00 AM – 8:00 PM IST (Closed Sunday)</p>
            </div>
          </div>

          {/* Internal Links Navigation */}
          <div className="pt-4 border-t border-black/5 space-y-3">
            <h3 className="text-base font-serif text-primary-950 font-semibold">
              Discover Our Range & Helpful Guides
            </h3>
            <div className="flex flex-wrap gap-2 text-[12px]">
              <Link to="/sarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Sarees Collection
              </Link>
              <Link to="/sarees/linen-sarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Linen Sarees
              </Link>
              <Link to="/sarees/cotton-sarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Cotton Sarees
              </Link>
              <Link to="/sarees/silk-sarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Silk Sarees
              </Link>
              <Link to="/malvika-saree-buying-guide" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Malvika Saree Guide
              </Link>
              <Link to="/uniform-saree-bulk-orders" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Uniform Sarees Bulk
              </Link>
              <Link to="/wholesalesarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Wholesale Saree Portal
              </Link>
              <Link to="/reviews" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Customer Reviews
              </Link>
              <Link to="/about" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Our About Us Story
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
                  How does Mukesh Saree Centre ensure fabric quality?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  We conduct strict multi-point physical inspections for every batch received from weaver looms in Surat, Varanasi, Kolkata, and Kanchipuram before listing.
                </p>
              </div>

              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  Can I purchase sarees in single pieces at wholesale rates?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Yes! Our retail pricing model is structured with low overheads so retail individual buyers enjoy near-wholesale direct pricing.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details & WhatsApp CTA */}
          <div className="pt-6 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-serif text-primary-950">Official Store Contact</h3>
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
                Connect on WhatsApp
              </h4>
              <p className="text-[12px] text-primary-950/65 font-light mb-3">
                Need live video assistance or product recommendations? Message Mohit Khemchandani today.
              </p>
              <button
                onClick={handleWhatsAppContact}
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2 text-[12px] uppercase tracking-wide font-medium rounded-sm transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <MessageCircle size={15} />
                Message Mohit Khemchandani
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
