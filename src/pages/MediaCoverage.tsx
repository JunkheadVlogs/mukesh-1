import React from "react";
import { Link } from "react-router";
import { SEO } from "../components/SEO";
import { BUSINESS_INFO } from "../config/business";
import { MapPin, Phone, Mail, Globe, Newspaper, ExternalLink, Info, MessageCircle, Share2 } from "lucide-react";

export default function MediaCoverage() {
  const customSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Media Coverage & Press Kit | ${BUSINESS_INFO.name}`,
      "description": `Official media, press info, and digital presence for ${BUSINESS_INFO.name}, Nagpur's premier saree store since 1978.`,
      "url": `${BUSINESS_INFO.website}/media`,
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
          "name": "Media Coverage",
          "item": `${BUSINESS_INFO.website}/media`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who handles media and press inquiries for Mukesh Saree Centre?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Media inquiries, interview requests, and press quotes regarding the Nagpur wholesale saree market and traditional textiles should be directed to Mohit Khemchandani via email at info@mukeshsarees.com or phone at +91 7020664641."
          }
        },
        {
          "@type": "Question",
          "name": "Where can journalists or creators access official brand information?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Official brand facts, high-resolution imagery, and background history since 1978 are available directly through our official website and verified social media channels."
          }
        }
      ]
    }
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("Hi Mukesh Saree Centre! I am reaching out regarding a media / press inquiry.");
    window.open(`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const socialLinks = [
    { name: "Facebook Official", url: BUSINESS_INFO.social[0], platform: "Facebook" },
    { name: "Instagram Official", url: BUSINESS_INFO.social[1], platform: "Instagram" },
    { name: "YouTube Channel", url: BUSINESS_INFO.social[2], platform: "YouTube" },
    { name: "Pinterest Collection", url: BUSINESS_INFO.social[3], platform: "Pinterest" }
  ];

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO 
          title={`Media & Press Coverage | ${BUSINESS_INFO.name} Nagpur`}
          description={`Official media info, press resources, and verified digital presence for ${BUSINESS_INFO.name}, Gandhibagh, Nagpur. Saree landmark since 1978.`}
          url="/media"
          schema={customSchema}
        />

        {/* Page Header */}
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold-600">
            Press & Brand Presence
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mt-2 mb-3 tracking-wide uppercase">
            Media Coverage & Proof
          </h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-[14px] md:text-[15px] font-light max-w-xl mx-auto leading-relaxed">
            Official press details, digital channels, and media resources for Mukesh Saree Centre, Nagpur's saree landmark since 1978.
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
              Established in 1978 in Gandhibagh, Nagpur, Maharashtra by Shri Nanakram Khemchandani, <strong>{BUSINESS_INFO.name}</strong> is an iconic 46-year-old retail and wholesale saree enterprise. Managed by the Khemchandani family, including Mohit Khemchandani, the firm supplies high-quality <Link to="/sarees" className="text-gold-600 hover:underline">sarees</Link> (including <Link to="/sarees/linen-sarees" className="text-gold-600 hover:underline">Linen</Link>, <Link to="/sarees/cotton-sarees" className="text-gold-600 hover:underline">Cotton</Link>, <Link to="/sarees/silk-sarees" className="text-gold-600 hover:underline">Silk</Link>, and <Link to="/malvika-saree-buying-guide" className="text-gold-600 hover:underline">Malvika</Link>), custom lehengas, suits, co-ord sets, and <Link to="/uniform-saree-bulk-orders" className="text-gold-600 hover:underline">uniform sarees</Link> to over 500+ business clients and tens of thousands of families across India.
            </p>
          </div>

          {/* Real Media Proof & Placeholder Statement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gold-600 font-serif text-lg font-semibold border-b border-black/5 pb-2">
              <Newspaper size={20} />
              <h3>Press & News Features Status</h3>
            </div>

            {/* STORE OWNER NOTE: No official press releases, TV clips, or newspaper articles submitted yet. Please provide newspaper clipping links, press releases, or TV interview features to display here. */}
            <div className="p-5 bg-amber-50/60 border border-amber-200/80 rounded-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-[13.5px]">
                <Info size={18} className="text-gold-600 shrink-0" />
                <span>Media Verification Notice</span>
              </div>
              <p className="text-[13px] font-light text-amber-950/80 leading-relaxed text-justify">
                At Mukesh Saree Centre, we adhere strictly to authentic representation and zero exaggerated claims. Currently, official media features and newspaper clippings are being compiled for digital archiving. If you are a media representative, fashion journalist, or news reporter seeking verified press releases, background statements, or high-res imagery, please contact our team directly.
              </p>
              <p className="text-[12px] italic text-amber-900/60 font-light pt-1">
                [Note for Store Owner: To feature newspaper features, regional magazine articles, or TV interviews here, please email press clipping links to info@mukeshsarees.com]
              </p>
            </div>
          </div>

          {/* Official Digital Channels & Social Media */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">
              Official Digital Channels & Verified Social Media
            </h3>
            <p className="font-light text-[13.5px] text-primary-950/80">
              You can verify our authentic collection releases, behind-the-scenes weaver videos, and live showroom updates across our verified public channels:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-primary-50/40 hover:bg-gold-500/10 border border-black/5 hover:border-gold-300 rounded-sm flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Share2 size={16} className="text-gold-600 shrink-0" />
                    <span className="font-medium text-[13px] text-primary-950">{s.name}</span>
                  </div>
                  <ExternalLink size={14} className="text-primary-950/40 group-hover:text-gold-600 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Internal Keyword Navigation */}
          <div className="pt-4 border-t border-black/5 space-y-3">
            <h3 className="text-base font-serif text-primary-950 font-semibold">
              Explore Main Keyword Collections
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
              <Link to="/wholesalesarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Wholesale Saree Portal
              </Link>
              <Link to="/uniform-saree-bulk-orders" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Uniform Sarees Bulk
              </Link>
              <Link to="/malvika-saree-buying-guide" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Malvika Saree Guide
              </Link>
              <Link to="/reviews" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Customer Reviews
              </Link>
              <Link to="/why-mukesh-saree-centre" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Why Choose Us
              </Link>
            </div>
          </div>

          {/* FAQs */}
          <div className="pt-4 border-t border-black/5 space-y-4">
            <h3 className="text-lg font-serif text-primary-950">
              Media & Press FAQs
            </h3>

            <div className="space-y-3">
              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  How can journalists request high-resolution product imagery?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Please send an email to info@mukeshsarees.com specifying your media house, publication date, and required saree fabric samples or imagery.
                </p>
              </div>

              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  Are spokesperson interviews available?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Yes. Mohit Khemchandani is available for quotes on textile manufacturing, Vidarbha retail trends, and saree wholesale distribution in Central India.
                </p>
              </div>
            </div>
          </div>

          {/* Official Contact Section */}
          <div className="pt-6 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-serif text-primary-950">Press Contact</h3>
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
                Direct WhatsApp Inquiries
              </h4>
              <p className="text-[12px] text-primary-950/65 font-light mb-3">
                Connect directly with Mohit Khemchandani for media or wholesale collaborations.
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
