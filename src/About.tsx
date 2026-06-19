import { useEffect } from 'react';
import { SEO } from './components/SEO';
import { MapPin, Phone, Clock, MessageCircle, Heart, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { CONFIG } from './config';

export default function About() {
  const customSchema = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "mainEntity": {
        "@id": "https://mukeshsarees.com/#organization"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Nanakram Khemchandani",
      "jobTitle": "Founder",
      "worksFor": {
        "@id": "https://mukeshsarees.com/#organization"
      },
      "nationality": {
        "@type": "Country",
        "name": "India"
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
          "item": "https://mukeshsarees.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About Us",
          "item": "https://mukeshsarees.com/about"
        }
      ]
    }
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("Hi Mukesh Saree Centre! I was reading your About Us page and would love to connect.");
    window.open(`https://wa.me/917020664641?text=${text}`, '_blank');
  };

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO 
          title="About Us | Mukesh Saree Centre — Nagpur's Trusted Saree Store Since 1978" 
          description="Learn about Mukesh Saree Centre, established in 1978 by the Nanakram Khemchandani family in Nagpur. We offer 30+ saree varieties with Cash on Delivery and free shipping." 
          url="/about"
          schema={customSchema}
        />

        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold-600">Our Legacy</span>
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mt-2 mb-3 tracking-wide uppercase">Our Story</h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-[14px] md:text-[15px] font-light max-w-xl mx-auto leading-relaxed">
            Serving Nagpur and Pan-India with timeless ethnic elegance since 1978.
          </p>
        </div>

        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-8 text-[14px] sm:text-[15px] leading-relaxed text-primary-950/80">
          
          {/* Main Heritage Section */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 border-b border-black/5 pb-2">
              Serving Nagpur Since 1978
            </h2>
            <p className="text-justify font-light text-primary-950/90 leading-relaxed">
              Mukesh Saree Centre was established in 1978 in Nagpur, Maharashtra by Shri Nanakram Khemchandani. What began as a humble local endeavor has blossomed over the years into one of Vidarbha's largest and most trusted saree distribution landmarks. Currently managed and nurtured with dedication by the Khemchandani family, including Mohit Khemchandani, the store upholds a 46-year-old legacy of top-tier customer trust, exceptional quality, and unbeatable prices. We operate with a core vision: making traditional Indian elegance widely accessible, keeping craftsmanship alive, and treating every patron as a beloved extension of our family.
            </p>
          </div>

          {/* What We Sell & Who We Serve Side-by-side / sequential */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-black/5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold-600 font-serif text-lg font-medium">
                <Sparkles size={18} />
                <h3>What We Sell</h3>
              </div>
              <p className="font-light text-[13.5px] sm:text-[14px] text-primary-950/75 text-justify">
                We design and distribute an exquisite collection of sarees (including Linen, Paithani, Banarasi, Kanjivaram, Cotton, Silk, Organza, and Georgette), custom-designed lehengas, contemporary co-ord sets, and readymade suits. Sourced directly from weavers in premium manufacturing hubs like Surat, Mumbai, Varanasi, Jaipur, Bangalore, Kolkata, and Madurai, our catalog boasts over 30 beautiful collections.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gold-600 font-serif text-lg font-medium">
                <Heart size={18} />
                <h3>Who We Serve</h3>
              </div>
              <p className="font-light text-[13.5px] sm:text-[14px] text-primary-950/75 text-justify">
                With over 500+ highly satisfied business clients and thousands of retail customers, we are honored to be a leading brand in Vidarbha, Maharashtra, and Madhya Pradesh. We supply retail buyers across the nation through our seamless e-commerce platform and bulk sarees directly to local saree retailers at unmatched wholesale rates.
              </p>
            </div>
          </div>

          {/* Why Trust Us - Feature Grid */}
          <div className="pt-6 border-t border-black/5 space-y-4">
            <h3 className="text-lg font-serif text-primary-950 mb-3 text-center md:text-left">Why Trust Us</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-primary-50/40 p-3 sm:p-4 rounded-sm border border-black/5">
                <Award className="text-gold-500 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-[13.5px] text-primary-950">46 Years of Heritage</h4>
                  <p className="text-[12.5px] text-primary-950/70 font-light mt-0.5">Nurtured with trust and family legacy in Nagpur since 1978.</p>
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
                  <p className="text-[12.5px] text-primary-950/70 font-light mt-0.5">Handpicked georgette, silk, Paithani, linen and Banarasi weaves.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-primary-50/40 p-3 sm:p-4 rounded-sm border border-black/5">
                <ShieldCheck className="text-gold-500 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-[13.5px] text-primary-950">Free Pan-India Delivery</h4>
                  <p className="text-[12.5px] text-primary-950/70 font-light mt-0.5">Free premium shipping directly to your doorstep on orders above ₹499.</p>
                </div>
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
                    <strong>Address:</strong> {CONFIG.STORE_ADDRESS}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="text-gold-500 shrink-0" size={16} />
                  <span>
                    <strong>Phone:</strong> {CONFIG.STORE_PHONE}
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
