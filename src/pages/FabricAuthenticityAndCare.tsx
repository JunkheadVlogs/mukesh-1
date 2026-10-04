import React from "react";
import { Link } from "react-router";
import { SEO } from "../components/SEO";
import { BUSINESS_INFO } from "../config/business";
import { 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Info,
  Droplets,
  Sun,
  Flame,
  Layers,
  Scissors
} from "lucide-react";

export default function FabricAuthenticityAndCare() {
  const customSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Fabric Authenticity & Saree Care Guide | ${BUSINESS_INFO.name}`,
      "description": `Comprehensive fabric transparency, authentic weave classifications, washing guidelines, and saree care advice from ${BUSINESS_INFO.name}, Gandhibagh, Nagpur since 1978.`,
      "url": `${BUSINESS_INFO.website}/fabric-authenticity-and-care/`,
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
          "name": "Fabric Authenticity & Care",
          "item": `${BUSINESS_INFO.website}/fabric-authenticity-and-care/`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does Mukesh Saree Centre classify pure fabrics versus blended fabrics?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We believe in strict textile transparency. We only label sarees as 'Pure Linen' or 'Pure Silk' when the warp and weft fibers are certified 100% natural flax or silk yarns. When fabrics incorporate cotton or synthetic strength blends (such as linen-cotton or poly-georgette for wrinkle resistance and durability), we state the exact blend clearly in our product specifications."
          }
        },
        {
          "@type": "Question",
          "name": "What standard dimensions are provided with each saree?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Unless explicitly marked otherwise on the product page, every traditional saree includes an unstitched drape of 5.50 metres, along with a running unstitched blouse piece measuring 0.80 to 1.00 metre, providing sufficient fabric for custom tailoring."
          }
        },
        {
          "@type": "Question",
          "name": "What is the recommended first wash method for festive and silk sarees?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We strongly recommend professional dry cleaning for the first wash of all silk, zari-embellished, chiffon, and dyed festive sarees. This locks in the natural vegetable or azo-free dyes, preserves delicate metallic threadwork, and protects natural fiber luster."
          }
        },
        {
          "@type": "Question",
          "name": "How can I verify the fabric in person before placing a bulk or wedding order?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can visit our historic wholesale and retail showroom on Jagnath Road, Gandhibagh, Nagpur. Alternatively, connect directly with Mohit Khemchandani on WhatsApp (+91 7020664641) to request unedited natural light video clips and close-up fabric texture inspections."
          }
        }
      ]
    }
  ];

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent("Hi Mukesh Saree Centre! I have a question about fabric authenticity, drape specifications, or care instructions.");
    window.open(`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const fabricCategories = [
    {
      name: "Pure Linen & Linen Blends",
      distinction: "Natural flax yarn woven with organic slub texture. We distinguish between 100% pure linen (breathable, structured, artisanal) and linen-cotton blends (softer hand-feel, easier daily ironing).",
      care: "Dry clean first wash. Later, gentle hand wash in cold water with mild detergent. Iron while damp on medium-high heat.",
      link: "/linen-sarees-for-office-wear/",
      linkText: "Explore Office Linen Sarees"
    },
    {
      name: "Chiffon & Georgette",
      distinction: "High-twist sheer yarns creating an ultra-lightweight, fluid silhouette. Chiffon offers an ethereal gossamer drape, while Georgette features a slightly pebbled crepe texture for enduring festive pleating.",
      care: "First wash dry clean. If hand washing later, use cold water and baby shampoo. Never wring or twist; lay flat on clean towel in shade to dry.",
      link: "/chiffon-sarees-for-wedding-functions/",
      linkText: "Explore Wedding Chiffons"
    },
    {
      name: "Festive & Haldi Georgettes",
      distinction: "Bright, colorfast turmeric yellows and sunshine tones engineered for celebratory ceremonies. High drape fluidity allows unrestricted movement during haldi, mehendi, and sangeet rituals.",
      care: "Dry clean recommended to prevent turmeric staining from fixing into delicate fibers. Keep away from harsh bleaching agents.",
      link: "/yellow-sarees-for-haldi/",
      linkText: "Explore Haldi Yellow Sarees"
    },
    {
      name: "Pure Silk, Paithani & Banarasi Weaves",
      distinction: "Traditional mulberry and katan silk weaves featuring real zari or tested metallic threads. Only items proven to be woven on heritage looms are labeled handloom or pure silk.",
      care: "Strictly dry clean only. Store wrapped in breathable muslin or unbleached cotton cloth. Never spray perfume directly onto zari borders.",
      link: "/sarees/",
      linkText: "View Heritage Saree Range"
    },
    {
      name: "Khadi, Mulmul & Soft Cotton",
      distinction: "Combed long-staple cotton yarns offering all-day cooling in tropical climates. Pre-shrunk and softened for zero stiffness.",
      care: "Gentle cold water hand or machine cycle with similar colors. Shade dry to protect vibrancy; iron with light steam.",
      link: "/sarees/cotton-sarees/",
      linkText: "View Soft Cotton Collection"
    },
    {
      name: "Institutional Uniform Fabrics",
      distinction: "Durable polyester-cotton and blended poly-crepe engineered specifically for high tear strength, colorfastness across 100+ washes, and uniform dye consistency for schools and colleges.",
      care: "Machine washable in cold or warm water with standard detergent. Wrinkle-resistant with quick-dry properties.",
      link: "/school-uniform-sarees/",
      linkText: "Explore School Uniform Sarees"
    }
  ];

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO 
          title={`Fabric Authenticity & Saree Care Guide | ${BUSINESS_INFO.name} Nagpur`}
          description={`Factual fabric classifications, weave transparency, wash care recommendations, and saree dimensions from ${BUSINESS_INFO.name}, Gandhibagh, Nagpur. Established 1978.`}
          url="/fabric-authenticity-and-care/"
          schema={customSchema}
        />

        {/* Page Header */}
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold-600">
            Transparency & Craft Knowledge
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mt-2 mb-3 tracking-wide uppercase">
            Fabric Authenticity & Care
          </h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-[14px] md:text-[15px] font-light max-w-2xl mx-auto leading-relaxed">
            At {BUSINESS_INFO.name}, our 46-year legacy in Gandhibagh, Nagpur is founded on honest textile descriptions. We never exaggerate thread counts or mislabel synthetic blends as pure natural silks.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-8 text-[14px] sm:text-[15px] leading-relaxed text-primary-950/80">

          {/* Core Authenticity Principle */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 border-b border-black/5 pb-2 flex items-center gap-2">
              <ShieldCheck className="text-gold-500" size={24} />
              Our Standard for Factual Fabric Descriptions
            </h2>
            <p className="font-light text-justify">
              In an online marketplace flooded with deceptive terms like "art silk sold as pure Kanjivaram" or "poly-viscose labeled as 100% linen", {BUSINESS_INFO.name} upholds a strict factual policy:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-primary-50/50 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  "Pure Linen" Guarantee
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light">
                  Applied exclusively when the woven yarn is 100% natural flax. Blends with cotton or poly-viscose are explicitly named "Linen Cotton" or "Linen Blend".
                </p>
              </div>

              <div className="p-3.5 bg-primary-50/50 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13.5px] text-primary-950 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  "Pure Silk" & "Handloom" Verification
                </h4>
                <p className="text-[12.5px] text-primary-950/70 font-light">
                  We reserve "Pure Silk" and "Handloom" descriptions strictly for verified natural silk cocoons and shuttle hand-operated looms from recognized craft clusters.
                </p>
              </div>
            </div>
          </div>

          {/* "What You Receive" Factual Standard */}
          <div className="space-y-4 pt-2 border-t border-black/5">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 border-b border-black/5 pb-2 flex items-center gap-2">
              <Scissors className="text-gold-500" size={24} />
              What You Receive: Standard Saree Specifications
            </h2>
            <p className="font-light">
              Every traditional saree shipped from our Nagpur warehouse includes verified physical dimensions designed to give you a complete, drape-ready garment:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-primary-50/60 rounded-sm border border-black/5 text-center">
                <span className="text-[11px] uppercase tracking-wider text-black/60 font-semibold block">Saree Body Length</span>
                <span className="text-xl font-serif font-semibold text-primary-950 mt-1 block">5.50 Metres</span>
                <span className="text-[11.5px] text-primary-950/70 font-light mt-1 block">Sufficient for standard Nivi, Nauvari, or Gujarati pleats</span>
              </div>

              <div className="p-4 bg-primary-50/60 rounded-sm border border-black/5 text-center">
                <span className="text-[11px] uppercase tracking-wider text-black/60 font-semibold block">Blouse Piece</span>
                <span className="text-xl font-serif font-semibold text-primary-950 mt-1 block">0.80 – 1.00 Metre</span>
                <span className="text-[11.5px] text-primary-950/70 font-light mt-1 block">Matching unstitched fabric piece included</span>
              </div>

              <div className="p-4 bg-primary-50/60 rounded-sm border border-black/5 text-center">
                <span className="text-[11px] uppercase tracking-wider text-black/60 font-semibold block">Inspection Seal</span>
                <span className="text-xl font-serif font-semibold text-primary-950 mt-1 block">Zero Defect</span>
                <span className="text-[11.5px] text-primary-950/70 font-light mt-1 block">Hand-checked for tears, pulls & print uniformity</span>
              </div>
            </div>
          </div>

          {/* Detailed Fabric Classifications & Care Guide */}
          <div className="space-y-4 pt-2 border-t border-black/5">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 border-b border-black/5 pb-2 flex items-center gap-2">
              <Layers className="text-gold-500" size={24} />
              Fabric Classifications & Washing Instructions
            </h2>
            <div className="space-y-4">
              {fabricCategories.map((item, idx) => (
                <div key={idx} className="p-4 rounded-sm border border-black/10 bg-white hover:border-gold-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h3 className="font-serif text-base font-semibold text-primary-950 m-0">
                      {item.name}
                    </h3>
                    <Link 
                      to={item.link}
                      className="text-[12px] text-gold-600 hover:text-gold-700 underline font-medium"
                    >
                      {item.linkText} →
                    </Link>
                  </div>
                  <p className="text-[13px] text-primary-950/80 mb-2">
                    <strong>Textile Distinction:</strong> {item.distinction}
                  </p>
                  <p className="text-[12.5px] text-primary-950/70 bg-primary-50/40 p-2.5 rounded-sm border border-black/5">
                    <strong>Recommended Care:</strong> {item.care}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Color Fidelity and Lighting Reality */}
          <div className="space-y-3 pt-2 border-t border-black/5">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 border-b border-black/5 pb-2 flex items-center gap-2">
              <Sun className="text-gold-500" size={24} />
              Colour Accuracy & Visual Transparency
            </h2>
            <p className="font-light text-justify">
              All photography at {BUSINESS_INFO.name} is conducted using calibrated 5500K daylight-balanced illumination. We deliberately avoid artificial saturation boosts or filters that deceive buyers regarding color vibrancy:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-light text-[13.5px]">
              <li>We achieve approximately 95%+ visual match under natural indoor lighting.</li>
              <li>Slight shifts can occur across OLED versus IPS phone displays due to user screen temperature settings.</li>
              <li>If you wish to view a saree under direct unedited WhatsApp video call, message us prior to placing your order.</li>
            </ul>
          </div>

          {/* Shipping, Returns & COD Confidence */}
          <div className="space-y-3 pt-2 border-t border-black/5">
            <h2 className="text-xl md:text-2xl font-serif text-primary-950 border-b border-black/5 pb-2 flex items-center gap-2">
              <Truck className="text-gold-500" size={24} />
              Fair Purchase Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-primary-50/50 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13px] text-primary-950 mb-1">Pan-India COD</h4>
                <p className="text-[12px] text-primary-950/70 font-light">
                  Cash on Delivery is available across 25,000+ Indian pincodes. Pay only upon package arrival at your doorstep.
                </p>
              </div>

              <div className="p-3.5 bg-primary-50/50 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13px] text-primary-950 mb-1">7-Day Genuine Return</h4>
                <p className="text-[12px] text-primary-950/70 font-light">
                  Unworn, unwashed sarees with original tags intact can be returned within 7 days. Simple WhatsApp returns assistance.
                </p>
              </div>

              <div className="p-3.5 bg-primary-50/50 rounded-sm border border-black/5">
                <h4 className="font-semibold text-[13px] text-primary-950 mb-1">Free Delivery &gt; ₹499</h4>
                <p className="text-[12px] text-primary-950/70 font-light">
                  All orders above ₹499 qualify for complimentary insured surface or air express courier transit.
                </p>
              </div>
            </div>
          </div>

          {/* Internal Hub Links */}
          <div className="pt-4 border-t border-black/5 space-y-3">
            <h3 className="text-base font-serif text-primary-950 font-semibold">
              Explore Related Guides & Dedicated Collections
            </h3>
            <div className="flex flex-wrap gap-2 text-[12px]">
              <Link to="/linen-sarees-for-office-wear/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Linen Sarees for Office
              </Link>
              <Link to="/chiffon-sarees-for-wedding-functions/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Wedding Chiffon Sarees
              </Link>
              <Link to="/yellow-sarees-for-haldi/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Yellow Sarees for Haldi
              </Link>
              <Link to="/saree-shop-in-nagpur/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Nagpur Showroom Visit
              </Link>
              <Link to="/wholesale-sarees-for-boutiques/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Wholesale for Boutiques
              </Link>
              <Link to="/school-uniform-sarees/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                School Uniform Sarees
              </Link>
              <Link to="/guides/saree-care-guide/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Complete Care Guide
              </Link>
              <Link to="/why-mukesh-saree-centre/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Why Mukesh Saree Centre
              </Link>
              <Link to="/reviews/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Customer Reviews
              </Link>
              <Link to="/media/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Media & Press
              </Link>
              <Link to="/return-policy/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Return & Refund Policy
              </Link>
              <Link to="/about/" className="px-3 py-1.5 bg-primary-50 text-primary-950 hover:bg-gold-500 hover:text-white transition-colors border border-black/5 rounded-sm">
                Our Heritage Since 1978
              </Link>
            </div>
          </div>

          {/* Showroom & Contact Support */}
          <div className="pt-6 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-serif text-primary-950">Showroom Inspection Welcome</h3>
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
                <p className="text-[12px] text-primary-950/60 pt-1">
                  Open Mon–Sat: 10:00 AM – 8:00 PM IST (Gandhibagh, Nagpur)
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-[#25D366]/5 rounded-sm p-5 border border-[#25D366]/10 text-center">
              <MessageCircle className="text-[#25D366] mb-2" size={30} />
              <h4 className="font-serif text-base font-semibold text-primary-950 mb-1">
                Have a Fabric Question?
              </h4>
              <p className="text-[12px] text-primary-950/65 font-light mb-3">
                Chat with Mohit Khemchandani for instant fabric clarification or close-up video preview.
              </p>
              <button
                onClick={handleWhatsAppContact}
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2 text-[12px] uppercase tracking-wide font-medium rounded-sm transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <MessageCircle size={15} />
                WhatsApp Fabric Help
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
