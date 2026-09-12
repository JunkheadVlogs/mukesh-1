import { BUSINESS_INFO } from "./config/business";
import { Link } from "react-router";
import { SEO } from './components/SEO';
import { MapPin, Phone, Clock, MessageCircle, Heart, ShieldCheck, Award, Sparkles, Mail, CheckCircle2 } from 'lucide-react';
import { CONFIG } from './config';

export default function About() {
  const customSchema = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "mainEntity": {
        "@id": `${BUSINESS_INFO.website}/#organization`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Shri Nanakram Khemchandani",
      "jobTitle": "Founder",
      "worksFor": {
        "@id": `${BUSINESS_INFO.website}/#organization`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Mohit Khemchandani",
      "jobTitle": "Managing Partner",
      "worksFor": {
        "@id": `${BUSINESS_INFO.website}/#organization`
      }
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
          "name": "About Us",
          "item": `${BUSINESS_INFO.website}/about`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "When was Mukesh Saree Centre established in Nagpur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mukesh Saree Centre was established in 1978 in Gandhibagh, Nagpur, Maharashtra by Shri Nanakram Khemchandani. It has served retail and wholesale saree customers for over 46 years."
          }
        },
        {
          "@type": "Question",
          "name": "What products does Mukesh Saree Centre sell?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We sell over 30 varieties of sarees including Linen, Cotton, Pure Silk, Paithani, Banarasi, Kanjivaram, Malvika tissue sarees, Georgette, Organza, custom lehengas, suits, co-ord sets, and uniform sarees."
          }
        },
        {
          "@type": "Question",
          "name": "Where is the physical store located?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our store is located on Jagnath Road, Gandhibagh, Nagpur, Maharashtra, 440002, India."
          }
        }
      ]
    }
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("Hi Mukesh Saree Centre! I was reading your About Us page and would love to connect.");
    window.open(`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO 
          title={`About Our Saree Shop in Nagpur | ${BUSINESS_INFO.name} Est. 1978`} 
          description={`Discover the 46-year legacy of ${BUSINESS_INFO.name} in Gandhibagh, Nagpur. Founded in 1978 by Shri Nanakram Khemchandani, offering sarees, lehengas, & wholesale bulk orders.`} 
          url="/about"
          schema={customSchema}
        />

        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold-600">Our 46-Year Legacy</span>
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mt-2 mb-3 tracking-wide uppercase">Our Story</h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-[14px] md:text-[15px] font-light max-w-xl mx-auto leading-relaxed">
            Serving Nagpur, Vidarbha, and Pan-India with timeless ethnic elegance since 1978.
          </p>
        </div>

        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-8 text-[14px] sm:text-[15px] leading-relaxed text-primary-950/80">
          
          {/* Main Heritage Section */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 border-b border-black/5 pb-2">
              Who is {BUSINESS_INFO.name}?
            </h2>
            <p className="text-justify font-light text-primary-950/90 leading-relaxed">
              <strong>Mukesh Saree Centre</strong> was established in 1978 on Jagnath Road, Gandhibagh, Nagpur, Maharashtra by Shri Nanakram Khemchandani. What began as a humble local endeavor has blossomed over the years into one of Vidarbha's largest and most trusted saree distribution landmarks. Currently managed and nurtured with dedication by the Khemchandani family, including Mohit Khemchandani, the store upholds a 46-year-old legacy of top-tier customer trust, exceptional fabric quality, and unbeatable wholesale pricing.
            </p>
          </div>

          {/* What We Sell & Who We Serve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-black/5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold-600 font-serif text-lg font-medium">
                <Sparkles size={18} />
                <h3>What We Sell</h3>
              </div>
              <p className="font-light text-[13.5px] sm:text-[14px] text-primary-950/75 text-justify">
                We design and distribute an exquisite collection of <Link to="/sarees" className="text-gold-600 hover:underline font-medium">sarees</Link> (including <Link to="/sarees/linen-sarees" className="text-gold-600 hover:underline">Linen</Link>, <Link to="/sarees/cotton-sarees" className="text-gold-600 hover:underline">Cotton</Link>, <Link to="/sarees/silk-sarees" className="text-gold-600 hover:underline">Pure Silk</Link>, <Link to="/malvika-saree-buying-guide" className="text-gold-600 hover:underline">Malvika Tissue</Link>, Paithani, Banarasi, Kanjivaram, Organza, and Georgette), custom-designed lehengas, co-ord sets, readymade suits, and <Link to="/uniform-saree-bulk-orders" className="text-gold-600 hover:underline font-medium">uniform sarees for institutions</Link>.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold-600 font-serif text-lg font-medium">
                <Heart size={18} />
                <h3>Who We Serve</h3>
              </div>
              <p className="font-light text-[13.5px] sm:text-[14px] text-primary-950/75 text-justify">
                With over 500+ highly satisfied business retail clients and tens of thousands of individual families across India, we are honored to be a leading ethnic wear authority. We supply retail buyers across the nation through our seamless online store and bulk sarees directly to boutique owners via our <Link to="/wholesalesarees" className="text-gold-600 hover:underline font-medium">wholesale portal</Link>.
              </p>
            </div>
          </div>

          {/* Why Customers Trust Us */}
          <div className="pt-6 border-t border-black/5 space-y-4">
            <h3 className="text-lg font-serif text-primary-950 mb-3 text-center md:text-left">Why Customers Trust Us</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-primary-50/40 p-3 sm:p-4 rounded-sm border border-black/5">
                <Award className="text-gold-500 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-[13.5px] text-primary-950">46 Years of Heritage</h4>
                  <p className="text-[12.5px] text-primary-950/70 font-light mt-0.5">Established in 1978 in Gandhibagh, Nagpur by Shri Nanakram Khemchandani.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-primary-50/40 p-3 sm:p-4 rounded-sm border border-black/5">
                <ShieldCheck className="text-gold-500 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-[13.5px] text-primary-950">Cash On Delivery (COD)</h4>
                  <p className="text-[12.5px] text-primary-950/70 font-light mt-0.5">Shop with ultimate peace of mind and pay only when your order arrives.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-primary-50/40 p-3 sm:p-4 rounded-sm border border-black/5">
                <Sparkles className="text-gold-500 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-[13.5px] text-primary-950">30+ Exquisite Varieties</h4>
                  <p className="text-[12.5px] text-primary-950/70 font-light mt-0.5">Direct weaver sourcing from Surat, Varanasi, Kolkata, and Kanchipuram.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-primary-50/40 p-3 sm:p-4 rounded-sm border border-black/5">
                <ShieldCheck className="text-gold-500 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-[13.5px] text-primary-950">Free Pan-India Delivery</h4>
                  <p className="text-[12.5px] text-primary-950/70 font-light mt-0.5">Free doorstep delivery across all postal pin codes on orders above ₹499.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Keyword Navigation */}
          <div className="pt-6 border-t border-black/5 space-y-3">
            <h3 className="text-base font-serif text-primary-950 font-semibold">
              Explore Our Collections & Trust Pages
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
              <Link to="/why-mukesh-saree-centre" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Why Choose Us
              </Link>
              <Link to="/reviews" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Customer Reviews
              </Link>
              <Link to="/media" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Media & Proof
              </Link>
            </div>
          </div>

          {/* FAQs */}
          <div className="pt-6 border-t border-black/5 space-y-4">
            <h3 className="text-lg font-serif text-primary-950">
              Frequently Asked Questions About Us
            </h3>

            <div className="space-y-3">
              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  Where is Mukesh Saree Centre located in Nagpur?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Our flagship store is located at Jagnath Road, Gandhibagh, Nagpur, Maharashtra, 440002, India.
                </p>
              </div>

              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  Do you offer wholesale purchasing for saree boutiques?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Yes, we supply bulk sarees to over 500+ boutique owners and retail shops across Maharashtra, MP, Chhattisgarh, and all of India at direct weaver rates.
                </p>
              </div>
            </div>
          </div>

          {/* Visit Our Store */}
          <div className="pt-6 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-serif text-primary-950">Visit Our Store</h3>
              <div className="space-y-2.5 font-light text-[13.5px] text-primary-950/85">
                <div className="flex items-start gap-2.5">
                  <MapPin className="text-gold-500 shrink-0 mt-1" size={16} />
                  <span>
                    <strong>Address:</strong> {BUSINESS_INFO.address.fullAddress}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="text-gold-500 shrink-0" size={16} />
                  <span>
                    <strong>Phone:</strong> {BUSINESS_INFO.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="text-gold-500 shrink-0" size={16} />
                  <span>
                    <strong>Email:</strong> {BUSINESS_INFO.email}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="text-gold-500 shrink-0" size={16} />
                  <span>
                    <strong>Business Hours:</strong> Monday to Saturday, 10:00 AM – 8:00 PM IST
                  </span>
                </div>
              </div>
            </div>

            {/* CTA action to WhatsApp */}
            <div className="flex flex-col justify-center items-center bg-[#25D366]/5 rounded-sm p-5 border border-[#25D366]/10 text-center">
              <MessageCircle className="text-[#25D366] mb-2" size={32} />
              <h4 className="font-serif text-base font-semibold text-primary-950/90 mb-1">Connect with Mohit Khemchandani</h4>
              <p className="text-[12px] text-primary-950/65 font-light mb-4 max-w-xs">
                Have questions regarding orders, customization, or wholesale inquiries? Message us instantly.
              </p>
              <button
                onClick={handleWhatsAppContact}
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2.5 text-[12.5px] tracking-wide uppercase font-medium rounded-sm transition-transform hover:scale-[1.02] shadow-sm select-none cursor-pointer"
              >
                <MessageCircle size={16} />
                Message on WhatsApp
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
