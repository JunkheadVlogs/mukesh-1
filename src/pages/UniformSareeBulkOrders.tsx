import React from "react";
import { Link } from "react-router";
import { SEO } from "../components/SEO";
import { BUSINESS_INFO } from "../config/business";
import { Building2, GraduationCap, Stethoscope, Briefcase, CheckCircle2, ShieldCheck, MapPin, Phone, Mail, MessageCircle, Truck, Layers, HelpCircle } from "lucide-react";

export default function UniformSareeBulkOrders() {
  const customSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Uniform Sarees & Bulk Orders Wholesaler | ${BUSINESS_INFO.name}`,
      "description": `Bulk uniform sarees for schools, teachers, corporate offices, and hospitals from ${BUSINESS_INFO.name}, Nagpur. Wrinkle-free fabrics, direct weaver prices since 1978.`,
      "url": `${BUSINESS_INFO.website}/uniform-saree-bulk-orders`,
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
          "name": "Uniform Saree Bulk Orders",
          "item": `${BUSINESS_INFO.website}/uniform-saree-bulk-orders`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the Minimum Order Quantity (MOQ) for uniform saree bulk orders?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our standard minimum order quantity (MOQ) for custom uniform saree batches is 10 to 15 pieces per shade/design. For ready stock uniform sarees, orders can be dispatched starting from 5 pieces."
          }
        },
        {
          "@type": "Question",
          "name": "Can you provide identical shade and pattern matching for institutional staff?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. We guarantee 100% dye-lot consistency across all sarees in your order batch, ensuring staff look completely unified."
          }
        },
        {
          "@type": "Question",
          "name": "Do you provide GST tax invoices for institutional & corporate purchases?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we provide official GST invoices for all institutional, corporate, and educational bulk orders."
          }
        }
      ]
    }
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("Hi Mukesh Saree Centre! I would like to inquire about a uniform saree bulk order for my institution/office.");
    window.open(`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const useCases = [
    {
      icon: GraduationCap,
      title: "School & Academic Teacher Uniforms",
      desc: "Breathable, lightweight, and dignified sarees engineered for long teaching shifts. Non-creasing Malvika tissue blends and soft cottons keep educators feeling confident and comfortable."
    },
    {
      icon: Building2,
      title: "Corporate & Front-Office Professionals",
      desc: "Polished, crisp, modern uniform sarees for corporate staff, front-desk receptionists, executive assistants, and sales representatives. Stain-resistant and easy to drape."
    },
    {
      icon: Stethoscope,
      title: "Hospital & Healthcare Staff",
      desc: "Hygienic, easy-wash, soft-finish sarees ideal for medical administrative personnel, clinic coordinators, and healthcare front-office staff."
    },
    {
      icon: Briefcase,
      title: "Hotel, Restaurant & Hospitality Teams",
      desc: "Luxurious appearance with durable, low-maintenance fabric weaves designed to withstand frequent wear and daily movement."
    }
  ];

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO 
          title={`Uniform Sarees & Wholesale Bulk Orders | ${BUSINESS_INFO.name} Nagpur`}
          description={`Buy corporate, school, teacher, and hospital uniform sarees in bulk from ${BUSINESS_INFO.name}, Gandhibagh, Nagpur. Direct weaver prices, GST invoices, pan-India delivery.`}
          url="/uniform-saree-bulk-orders"
          schema={customSchema}
        />

        {/* Page Header */}
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold-600">
            Institutional & Corporate Solutions
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mt-2 mb-3 tracking-wide uppercase">
            Uniform Sarees & Bulk Orders
          </h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-[14px] md:text-[15px] font-light max-w-xl mx-auto leading-relaxed">
            Supplying durable, elegant, and unified sarees directly from master weavers to schools, corporate offices, hospitals, and institutions across India since 1978.
          </p>
        </div>

        {/* Main Content Box */}
        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-8 text-[14px] sm:text-[15px] leading-relaxed text-primary-950/80">
          
          {/* Who is Mukesh Saree Centre */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 border-b border-black/5 pb-2">
              Who is {BUSINESS_INFO.name}?
            </h2>
            <p className="text-justify font-light text-primary-950/90 leading-relaxed">
              Established in 1978 in Gandhibagh, Nagpur, Maharashtra by Shri Nanakram Khemchandani, <strong>{BUSINESS_INFO.name}</strong> is a legendary 46-year-old saree distribution landmark. Managed today by the Khemchandani family, including Mohit Khemchandani, we operate as both a major regional wholesale distributor and an online store. We specialize in supplying uniform sarees in bulk to educational institutions, corporate offices, medical facilities, and government bodies across Maharashtra, MP, Chhattisgarh, and all of India.
            </p>
          </div>

          {/* What We Offer for Bulk Buyers */}
          <div className="p-5 bg-primary-50/50 rounded-sm border border-black/5 space-y-3">
            <h3 className="text-lg font-serif text-primary-950 font-semibold">
              What We Sell for Bulk & Uniform Orders
            </h3>
            <p className="text-[13.5px] font-light text-primary-950/80 text-justify leading-relaxed">
              Our specialized uniform saree division offers custom-dyed <Link to="/malvika-saree-buying-guide" className="text-gold-600 hover:underline">Malvika tissue sarees</Link>, <Link to="/sarees/linen-sarees" className="text-gold-600 hover:underline">Linen sarees</Link>, <Link to="/sarees/cotton-sarees" className="text-gold-600 hover:underline">Cotton sarees</Link>, crepe blends, and <Link to="/sarees/silk-sarees" className="text-gold-600 hover:underline">silk blends</Link>. Beyond uniform sarees, our inventory includes custom lehengas, readymade suits, and co-ord sets for institutional events and celebrations.
            </p>
          </div>

          {/* Key Industry Sectors */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xl font-serif text-primary-950 border-b border-black/5 pb-2">
              Tailored Uniform Solutions by Industry
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {useCases.map((uc, i) => {
                const IconComponent = uc.icon;
                return (
                  <div key={i} className="p-4 bg-primary-50/30 rounded-sm border border-black/5 space-y-2">
                    <div className="flex items-center gap-2.5 text-gold-600 font-serif font-semibold text-[15px]">
                      <IconComponent size={20} className="shrink-0" />
                      <h4>{uc.title}</h4>
                    </div>
                    <p className="text-[12.5px] font-light text-primary-950/75 leading-relaxed">
                      {uc.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why Institutions Trust Us */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">
              Why Institutional Buyers Choose {BUSINESS_INFO.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] font-light text-primary-950/85">
              <div className="flex items-start gap-2 bg-primary-50/40 p-3 rounded-sm border border-black/5">
                <CheckCircle2 size={16} className="text-gold-600 shrink-0 mt-0.5" />
                <span><strong>100% Color & Shade Consistency:</strong> Identical dye lots across your entire staff order.</span>
              </div>
              <div className="flex items-start gap-2 bg-primary-50/40 p-3 rounded-sm border border-black/5">
                <CheckCircle2 size={16} className="text-gold-600 shrink-0 mt-0.5" />
                <span><strong>Direct-from-Weaver Wholesale Pricing:</strong> Save up to 35-40% compared to middleman distributors.</span>
              </div>
              <div className="flex items-start gap-2 bg-primary-50/40 p-3 rounded-sm border border-black/5">
                <CheckCircle2 size={16} className="text-gold-600 shrink-0 mt-0.5" />
                <span><strong>Physical Sample Approval:</strong> We ship physical sample swatches before bulk weaving.</span>
              </div>
              <div className="flex items-start gap-2 bg-primary-50/40 p-3 rounded-sm border border-black/5">
                <CheckCircle2 size={16} className="text-gold-600 shrink-0 mt-0.5" />
                <span><strong>GST Invoicing & Fast Transport:</strong> Seamless institutional accounting and door delivery.</span>
              </div>
            </div>
          </div>

          {/* Where We Are Located */}
          <div className="pt-4 border-t border-black/5 space-y-3">
            <h3 className="text-lg font-serif text-primary-950">
              Where is Mukesh Saree Centre Located?
            </h3>
            <div className="p-4 bg-primary-50/60 rounded-sm border border-black/5 font-light text-[13px] text-primary-950/90 space-y-1">
              <p className="font-semibold text-primary-950">{BUSINESS_INFO.name}</p>
              <p>{BUSINESS_INFO.address.street}, {BUSINESS_INFO.address.area}</p>
              <p>{BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.region} - {BUSINESS_INFO.address.postalCode}, India</p>
              <p className="text-[12px] text-primary-950/70 pt-1">Phone: {BUSINESS_INFO.phone} | Email: {BUSINESS_INFO.email}</p>
            </div>
          </div>

          {/* Related Guides & Keyword Links */}
          <div className="pt-4 border-t border-black/5 space-y-3">
            <h3 className="text-base font-serif text-primary-950 font-semibold">
              Explore Related Saree Guides & Bulk Portals
            </h3>
            <div className="flex flex-wrap gap-2 text-[12px]">
              <Link to="/guides/corporate-uniform-saree-guide" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Corporate Uniform Guide
              </Link>
              <Link to="/guides/uniform-saree-wholesaler-nagpur" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Nagpur Uniform Wholesaler
              </Link>
              <Link to="/wholesalesarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Wholesale Saree Portal
              </Link>
              <Link to="/malvika-saree-buying-guide" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Malvika Saree Guide
              </Link>
              <Link to="/sarees/linen-sarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Linen Sarees
              </Link>
              <Link to="/sarees/cotton-sarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Cotton Sarees
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
              Frequently Asked Questions for Bulk Buyers
            </h3>

            <div className="space-y-3">
              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  How do I request a sample saree before placing a large institutional order?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Message Mohit Khemchandani on WhatsApp (+91 7020664641) or email info@mukeshsarees.com with your institutional details. We will dispatch sample swatches or a full sample piece immediately.
                </p>
              </div>

              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  What is the turnaround time for a 50 to 100 piece uniform saree order?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Ready stock uniform designs are dispatched within 24-48 hours. Custom woven or dyed batches take approximately 7 to 12 working days.
                </p>
              </div>
            </div>
          </div>

          {/* Official Contact & WhatsApp Button */}
          <div className="pt-6 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-serif text-primary-950">Bulk Order Desk</h3>
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
                Request a Uniform Quote
              </h4>
              <p className="text-[12px] text-primary-950/65 font-light mb-3">
                Send us your required quantity, color theme, and budget for instant wholesale pricing.
              </p>
              <button
                onClick={handleWhatsAppContact}
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2 text-[12px] uppercase tracking-wide font-medium rounded-sm transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <MessageCircle size={15} />
                WhatsApp Bulk Order Desk
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
