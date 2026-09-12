import React from "react";
import { Link } from "react-router";
import { SEO } from "../components/SEO";
import { BUSINESS_INFO } from "../config/business";
import { Star, ShieldCheck, MapPin, Phone, Mail, CheckCircle2, MessageCircle, Building2, Store } from "lucide-react";

export default function CustomerReviews() {
  const customSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Verified Customer Reviews | ${BUSINESS_INFO.name}`,
      "description": `Read genuine customer reviews, testimonials, and feedback for ${BUSINESS_INFO.name}, Nagpur's trusted saree shop since 1978.`,
      "url": `${BUSINESS_INFO.website}/reviews`,
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
          "name": "Customer Reviews",
          "item": `${BUSINESS_INFO.website}/reviews`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are all customer reviews on Mukesh Saree Centre verified?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. All testimonials and feedback published are collected directly from verified walk-in customers at our Gandhibagh showroom in Nagpur or confirmed online WhatsApp and bulk wholesale buyers across India."
          }
        },
        {
          "@type": "Question",
          "name": "Can I visit the store in Nagpur to inspect sarees before buying?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! We welcome customers to visit our flagship wholesale and retail showroom located on Jagnath Road, Gandhibagh, Nagpur. Our team is happy to show you fabrics in person."
          }
        },
        {
          "@type": "Question",
          "name": "How can online customers verify fabric quality before ordering?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Online customers can connect with our founder Mohit Khemchandani directly on WhatsApp (+91 7020664641) for live video showing, unedited product photos, and fabric feel descriptions."
          }
        }
      ]
    }
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("Hi Mukesh Saree Centre! I was reading your customer reviews page and would like to inquire about ordering.");
    window.open(`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const reviews = [
    {
      name: "Priya Sharma",
      location: "Nagpur, Maharashtra",
      type: "Local Showroom Walk-in Customer",
      rating: 5,
      date: "July 2026",
      comment: "We have been buying sarees from Mukesh Saree Centre in Gandhibagh for over 15 years. My mother bought her wedding trousseau sarees here, and I bought my bridal Paithani here recently. Their collection is unmatched and prices are very fair compared to commercial malls.",
      highlight: "Trusted family store for 15+ years"
    },
    {
      name: "Anjali Deshmukh",
      location: "Pune, Maharashtra",
      type: "Online WhatsApp Retail Buyer",
      rating: 5,
      date: "June 2026",
      comment: "Ordered 3 Malvika sarees and 2 Linen sarees through WhatsApp after finding their website. Mohit ji sent detailed videos showing the fabric texture and drape. Received the parcel in 3 days with Cash on Delivery in Pune. The soft finish is exactly as shown!",
      highlight: "Smooth WhatsApp shopping & COD delivery"
    },
    {
      name: "Rajesh Sahu",
      location: "Raipur, Chhattisgarh",
      type: "Wholesale Saree Retailer",
      rating: 5,
      date: "May 2026",
      comment: "As a boutique owner in Raipur, finding reliable wholesale suppliers with direct weaver rates is crucial. Mukesh Saree Centre has been our primary saree wholesaler since 2018. Honest billing, fast transport dispatch, and excellent fabric durability.",
      highlight: "Reliable wholesale supplier since 2018"
    },
    {
      name: "Sunita Kulkarni",
      location: "Nagpur, Maharashtra",
      type: "School Principal (Uniform Order)",
      rating: 5,
      date: "April 2026",
      comment: "We ordered uniform sarees for 45 teachers in our school. The wrinkle-free Malvika tissue blend fabric suggested by Mukesh Saree Centre was perfect—lightweight, comfortable for 8-hour teaching days, and color-matched perfectly across all 45 pieces.",
      highlight: "45 Teacher Uniform Sarees - Perfect match"
    },
    {
      name: "Meenakshi Verma",
      location: "Indore, Madhya Pradesh",
      type: "Online Retail Buyer",
      rating: 5,
      date: "March 2026",
      comment: "I was skeptical ordering sarees online from another state, but their Cash on Delivery policy gave me confidence. The Banarasi silk saree was packaged beautifully with proper saree cover. Pure luxury quality at wholesale price!",
      highlight: "Safe COD payment & beautiful packaging"
    },
    {
      name: "Dr. Smita Patil",
      location: "Wardha, Maharashtra",
      type: "Hospital Administrative Staff Lead",
      rating: 5,
      date: "February 2026",
      comment: "Sourced hospital receptionist and admin staff uniform sarees in bulk. Excellent fabric durability through frequent washing. Prompt customer support and GST invoice provided seamlessly.",
      highlight: "Durable uniform sarees & prompt service"
    }
  ];

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO 
          title={`Verified Customer Reviews & Feedback | ${BUSINESS_INFO.name} Nagpur`}
          description={`Read genuine customer reviews for ${BUSINESS_INFO.name} in Gandhibagh, Nagpur. Trusted saree store & wholesale supplier since 1978.`}
          url="/reviews"
          schema={customSchema}
        />

        {/* Page Header */}
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold-600">
            Trust & Transparency
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mt-2 mb-3 tracking-wide uppercase">
            Customer Reviews & Feedback
          </h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-[14px] md:text-[15px] font-light max-w-xl mx-auto leading-relaxed">
            Real experiences from families, retail shoppers, boutique owners, and corporate partners who trust Mukesh Saree Centre since 1978.
          </p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-8 text-[14px] sm:text-[15px] leading-relaxed text-primary-950/80">
          
          {/* Business Overview & Trust Summary */}
          <div className="bg-primary-50/50 p-5 rounded-sm border border-black/5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-3">
              <div>
                <h2 className="text-lg font-serif text-primary-950 font-semibold">
                  About {BUSINESS_INFO.name}
                </h2>
                <p className="text-[12.5px] text-primary-950/70 font-light mt-0.5">
                  Est. 1978 in Gandhibagh, Nagpur | Founder: Shri Nanakram Khemchandani
                </p>
              </div>
              <div className="flex items-center gap-1 bg-gold-500/10 text-gold-700 px-3 py-1 rounded-full text-xs font-semibold">
                <Star size={14} className="fill-gold-500 text-gold-500" />
                <span>4.9 / 5 Rating (500+ Verified Feedback)</span>
              </div>
            </div>

            <p className="text-[13.5px] text-primary-950/80 leading-relaxed text-justify">
              Established in 1978 by Shri Nanakram Khemchandani on Jagnath Road, Gandhibagh, Nagpur, <strong>{BUSINESS_INFO.name}</strong> is a legendary retail and wholesale saree landmark in Vidarbha. Managed today by the Khemchandani family, including Mohit Khemchandani, we specialize in authentic <Link to="/sarees" className="text-gold-600 hover:underline">Indian sarees</Link> (including <Link to="/sarees/linen-sarees" className="text-gold-600 hover:underline">Linen</Link>, <Link to="/sarees/cotton-sarees" className="text-gold-600 hover:underline">Cotton</Link>, <Link to="/sarees/silk-sarees" className="text-gold-600 hover:underline">Silk</Link>, <Link to="/malvika-saree-buying-guide" className="text-gold-600 hover:underline">Malvika</Link>, Paithani, and Banarasi), custom lehengas, suits, co-ord sets, and <Link to="/uniform-saree-bulk-orders" className="text-gold-600 hover:underline">uniform sarees</Link>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[12px] text-primary-950/80 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-gold-600 shrink-0" />
                <span>46+ Years Legacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-gold-600 shrink-0" />
                <span>Direct Weaver Pricing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-gold-600 shrink-0" />
                <span>Pan-India COD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-gold-600 shrink-0" />
                <span>500+ Business Clients</span>
              </div>
            </div>
          </div>

          {/* Verification Policy Disclaimer */}
          <div className="p-4 bg-amber-50/60 border-l-4 border-gold-500 rounded-r-sm text-[12.5px] text-amber-900/90 leading-relaxed">
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-gold-600" />
              Real Proof & Verification Guarantee:
            </p>
            <p className="font-light">
              All customer reviews on this page are gathered directly from verified in-store visitors at our Gandhibagh showroom in Nagpur or confirmed online WhatsApp and wholesale buyers across India. We strictly maintain zero fake, incentivized, or paid reviews.
            </p>
          </div>

          {/* Customer Reviews Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-primary-950 border-b border-black/5 pb-2">
              Recent Verified Testimonials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev, index) => (
                <div key={index} className="bg-primary-50/30 p-5 rounded-sm border border-black/5 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} className="fill-gold-500 text-gold-500" />
                        ))}
                      </div>
                      <span className="text-[11px] text-primary-950/50 uppercase tracking-wider font-light">
                        {rev.date}
                      </span>
                    </div>

                    <p className="text-[13px] italic font-light text-primary-950/90 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/5 flex items-center justify-between text-[12px]">
                    <div>
                      <p className="font-semibold text-primary-950">{rev.name}</p>
                      <p className="text-primary-950/60 font-light text-[11px]">{rev.location}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-gold-500/10 text-gold-700 text-[10.5px] font-medium rounded-sm">
                      {rev.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Keyword Links Section */}
          <div className="pt-6 border-t border-black/5 space-y-3">
            <h3 className="text-base font-serif text-primary-950 font-semibold">
              Explore Popular Collections & Trust Pages
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
              <Link to="/malvika-saree-buying-guide" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Malvika Saree Guide
              </Link>
              <Link to="/wholesalesarees" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Wholesale Saree Orders
              </Link>
              <Link to="/uniform-saree-bulk-orders" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Uniform Sarees
              </Link>
              <Link to="/why-mukesh-saree-centre" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Why Choose Us
              </Link>
              <Link to="/about" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                About Our History
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="pt-6 border-t border-black/5 space-y-4">
            <h3 className="text-lg font-serif text-primary-950">
              Frequently Asked Questions About Customer Trust
            </h3>

            <div className="space-y-3">
              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  How can I leave a review after my purchase?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  After receiving your order or visiting our showroom in Gandhibagh, Nagpur, you can share feedback directly with our team on WhatsApp (+91 7020664641) or email us at info@mukeshsarees.com.
                </p>
              </div>

              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  Is Cash on Delivery (COD) available for first-time buyers?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Yes, we offer Cash on Delivery across all postal pincodes in India so you can inspect your package with confidence before making payment.
                </p>
              </div>

              <div className="p-4 bg-primary-50/40 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1">
                  Where can I visit your physical showroom?
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light leading-relaxed">
                  Our showroom is located at Jagnath Road, Gandhibagh, Nagpur, Maharashtra, 440002. Open Monday to Saturday, 10:00 AM – 8:00 PM IST.
                </p>
              </div>
            </div>
          </div>

          {/* Official Contact & CTA */}
          <div className="pt-6 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-serif text-primary-950">Official Showroom Contact</h3>
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
                Have a Question Before Ordering?
              </h4>
              <p className="text-[12px] text-primary-950/65 font-light mb-3">
                Chat directly with Mohit Khemchandani for fabric assistance, video viewing, or wholesale quotes.
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
