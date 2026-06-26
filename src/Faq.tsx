import { BUSINESS_INFO } from "./config/business";
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './components/SEO';
import { 
  Search, 
  ChevronDown, 
  HelpCircle, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Sparkles, 
  Scissors, 
  Award,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router';

interface FAQ {
  q: string;
  a: string;
  category: "orders" | "shipping" | "returns" | "payments" | "fabrics" | "wholesale" | "guides" | "support";
}

const faqs: FAQ[] = [
  {
    category: "orders",
    q: "How do I buy sarees online from Mukesh Saree Centre?",
    a: "Buying sarees online with Mukesh Saree Centre is a simple, premium experience. To begin your online saree shopping journey, browse our curated collection of sarees including authentic silk sarees, linen sarees, cotton sarees, and exquisite designer sarees. Once you find your preferred drape, select any customization or blouse options, click \"Add to Cart,\" and proceed to checkout. We require basic shipping details and offer secure payment options like credit/debit cards, UPI, net banking, or Cash on Delivery (COD) for convenience. Our high-resolution product photography captures true-to-life fabric textures and colors, ensuring that your chosen wedding sarees or party wear sarees arrive exactly as depicted on your screen."
  },
  {
    category: "support",
    q: "Where is your physical saree shop located?",
    a: "Our landmark physical retail flagship is proudly located at Jagnath Road, Gandhibagh, Nagpur, Maharashtra, 440002, India. As a trusted physical saree shop in Nagpur since 1978, we welcome customers to explore our premium collection of handloom masterpieces, bridal lehengas, party wear sarees, and traditional silk sarees in person. Our central Nagpur location is fully air-conditioned and staffed by custom ethnic wear consultants ready to guide you through fabric selections, intricate embroidery details, and draping techniques, making it the perfect destination for wedding sarees shopping. We are open Monday to Saturday from 10:00 AM to 8:00 PM."
  },
  {
    category: "payments",
    q: "Do you provide Cash on Delivery (COD) for online saree shopping?",
    a: "Yes, we provide 100% reliable Cash on Delivery (COD) options globally across India for all our online saree shopping orders. Whether you are purchasing lightweight cotton sarees, premium linen sarees, highly detailed Banarasi sarees, or luxurious silk sarees, you can complete your order securely by selecting Cash on Delivery at checkout. There are absolutely no additional hidden handling fees or upfront charges for choosing COD, keeping our trust-centric shopping policy intact. This allows you to verify the premium quality, soft drape, and packaging of our ethnic wear products before making the final cash payment to our courier delivery agent."
  },
  {
    category: "shipping",
    q: "What is the shipping cost and minimum order for free shipping?",
    a: "At Mukesh Saree Centre, we are delighted to offer 100% FREE Standard Shipping across India on all prepaid and Cash on Delivery (COD) orders above ₹499. For orders below ₹499, a nominal shipping and delivery fee is calculated at checkout based on your exact delivery location. We partner exclusively with top-tier national logistics services like BlueDart, Delhivery, Amazon Shipping, and DTDC to ensure that your precious silk sarees, cotton sarees, and party wear sarees are handled with maximum care and delivered securely in pristine condition, accompanied by real-time SMS tracking updates in 3–7 business days."
  },
  {
    category: "returns",
    q: "What is your return and exchange policy for sarees bought online?",
    a: "We want you to be completely in love with your purchase from Mukesh Saree Centre. Therefore, we offer a hassle-friendly, customer-friendly 7-day return and exchange policy for all sarees bought online. If your received silk sarees, cotton sarees, linen sarees, or wedding sarees do not meet your expectations, simply initiate a return on our website or get in touch with our customer support team on WhatsApp at +91 70206 64641 within 7 days of delivery. Please ensure that the sarees remain completely unused, unwashed, unstitched, and in their original packaging with all brand tags and price tags intact to qualify for a full refund."
  },
  {
    category: "fabrics",
    q: "What makes Banarasi sarees from Mukesh Saree Centre special?",
    a: "Our premium collection of Banarasi sarees represents the pinnacle of rich Indian heritage and luxury. Sourced directly from highly skilled master weavers in Varanasi (Benares), these sarees are woven on traditional handlooms utilizing genuine fine silk threads and exquisite metallic zari embroidery. Known for their royal, opulent appearance, our Banarasi sarees are perfect for weddings, grand festivals, receptions, and bridal trousseaus. We carefully test the zari quality and silk weight of every piece, guaranteeing a soft, non-scratchy texture that drapes majestically, which has made us the trusted choice for wedding sarees and bridal wear since 1978."
  },
  {
    category: "fabrics",
    q: "How should I care for my silk sarees to ensure they last?",
    a: "To preserve the timeless luster, gold zari embroidery, and fabric integrity of your premium silk sarees, we advise professional dry cleaning only. Store your pure silk sarees, Kanjivaram sarees, and Banarasi sarees wrapped individually in soft, clean white muslin or cotton cloths to protect them from environmental moisture, dust, and friction. Avoid hanging silk sarees on metal hangers as this can distort the weave and fold lines over time. Additionally, remember to periodically unfold and air out your heirloom silk sarees in a clean, shaded space inside your wardrobe, shielding them from any direct sunlight which can fade the delicate organic natural dyes."
  },
  {
    category: "fabrics",
    q: "Are your linen sarees suitable for hot summer weather?",
    a: "Absolutely! Our premium linen sarees are specifically woven from high-grade natural flax fibers, rendering them exceptionally breathable, sweat-absorbent, lightweight, and skin-friendly during hot and humid summers. As a leading saree shop in Nagpur, we offer a versatile collection of linen sarees that beautifully blend crisp natural textures with modern prints, solid pastel colors, and elegant zari borders. These linen sarees are perfect for professional office daily wear, high-profile corporate environments, formal meetings, casual daytime get-togethers, and daytime summer festivities, providing a chic, contemporary ethnic vibe with effortless lightweight elegance."
  },
  {
    category: "fabrics",
    q: "Do you sell premium cotton sarees for daily office wear?",
    a: "Yes, Mukesh Saree Centre Nagpur specializes in sourcing premium, authentic cotton sarees perfect for long workdays and professional corporate attire. Our pure cotton sarees selection includes iconic regional handlooms like Chanderi, Kota Doria, Maheshwari, traditional block prints, kalamkari, and mulmul cottons. Woven from high-tension natural cotton yarns, these sarees offer incomparable all-day comfort, exceptional breathability, and structure. They are easy to drape and maintain, retaining their vibrant colors and crisp look even after regular gentle washes. Explore our online saree shopping search to find the perfect cotton drapes for your regular office wardrobe."
  },
  {
    category: "support",
    q: "How can I contact customer support for order tracking or assistance?",
    a: "Our boutique customer support is easily accessible and highly responsive. You can reach out directly via live WhatsApp chat or phone call at +91 70206 64641, or email us at info@mukeshsarees.com. Whether you need styling advice on party wear sarees, help selecting wedding sarees, size guidance for readymade blouses, or live updates on your order dispatch, our dedicated team is there to assist you. As an established boutique saree shop in Nagpur, we take immense pride in delivering personalized, friendly assistance to ensure your online shopping experience is as warm, delightful, and smooth as visiting our physical Nagpur store."
  },
  {
    category: "wholesale",
    q: "Do you supply sarees at wholesale rates for bulk or business orders?",
    a: "Yes, Mukesh Saree Centre is a highly reputable wholesale supplier of sarees, lehengas, and ethnic wear. Since 1978, we have acted as a direct distributor supplying retail stores, boutiques, home sellers, and online businesses all across Vidarbha, Maharashtra, Madhya Pradesh, Chhattisgarh, and beyond. If you are a retailer looking to source silk sarees, linen sarees, or party wear sarees in bulk, you can contact our wholesale team directly on WhatsApp. We offer highly competitive catalog prices, strict quality checks, custom brand packaging support, and reliable bulk logistics to help scale your ethnic wear business."
  },
  {
    category: "wholesale",
    q: "Can I customize the blouse or fall-pico of the saree?",
    a: "Yes! We offer professional customizable fall-pico, edge-stitching, and customized blouse tailoring services on special request for all our online saree shopping orders. Once you have placed your order for any silk sarees, cotton sarees, or party wear sarees, simply ping our support team on WhatsApp at +91 70206 64641 with your specific order number and customized measurement details. Our in-house boutique tailors will craft the ideal custom-fitted padded or non-padded designer blouse and stitch the matching fall-pico precisely, ensuring your saree is completely prepped, elegant, and ready for you to wear immediately upon unboxing."
  },
  {
    category: "shipping",
    q: "What is the typical delivery timeline for pan-India orders?",
    a: "For orders shipped across India, our typical standard shipping timeline is 3 to 7 business days. Orders placed from major metro cities like Maharashtra, Mumbai, Pune, Pune Rural, Delhi NCR, Bangalore, Hyderabad, and Chennai are often dispatched within 24 hours of confirmation and delivered in just 2 to 4 business days. For remote locations, it may take up to 7 business days. We ship out directly from our warehouse located in Gandhibagh, Nagpur. Customers will receive a live Tracking Link via SMS and email as soon as the package is handed over to our premium shipping partners."
  },
  {
    category: "guides",
    q: "What are the popular choices for party wear sarees on your boutique?",
    a: "For glamorous parties, evening cocktails, sangeet ceremonies, and high-fashion social gatherings, our hot-selling party wear sarees collection is second to none. We showcase a magnificent range of modern fluid organza sarees with hand-painted floral prints, metallic georgette sarees with shimmering sequins, soft designer net sarees adorned with heavy zardozi embroidery, and glossy silk satin sarees. Designed to make you look radiant under both natural sunlight and evening hall lights, these lightweight designer sarees combine contemporary western silhouettes with centuries-old Indian craftsmanship, ensuring you feel incredibly glamorous, confident, and light on your feet throughout the celebration."
  },
  {
    category: "guides",
    q: "Which sarees are best suited for traditional Indian weddings?",
    a: "For bride, bridesmaids, mother of the bride, and esteemed wedding guests, traditional handloom sarees represent the highest standard of elegance. We highly recommend our curated heritage wedding sarees collection, featuring heavy-bordered pure Kanjivaram silk sarees, intricate silk Paithani sarees displaying iconic peacock border motifs, and opulent Varanasi-woven Banarasi silk sarees with rich golden zari brocades. These sarees hold an evergreen, prized spot in Indian bridal couture. They carry a timeless artistic allure, incredible fabric drape, and luxurious sheen that elevates the ceremonial atmosphere, keeping true cultural Indian heritage close to your heart on your special wedding day."
  },
  {
    category: "fabrics",
    q: "Are the colors of the sarees on the website accurate to real life?",
    a: "We make extraordinary efforts to ensure all product images appearing on MukeshSarees.com represent the real, actual colors, weaves, and textures as closely as humanly possible. Our catalog photography is shot under balanced daylight studio conditions using state-of-the-art camera sensors. However, please be slightly mindful that minor variations (typically within 5% to 10%) can occasionally occur due to differences in screen contrast settings, display temperatures, or mobile phone panels (such as OLED or LCD). If you ever feel doubtful or wish to double-check, our WhatsApp team is happy to send you quick unedited smartphone videos of the sarees under natural home lighting before dispatch."
  },
  {
    category: "guides",
    q: "How do I choose the right fabric: Silk, Cotton, or Linen?",
    a: "Choosing the perfect saree fabric essentially depends on the planned occasion, weather, and your personal styling preference: Silk sarees offer unmatched royal luster, structured drape, and premium stiffness, making them the gold-standard for weddings, Pujas, receptions, and festivals. Cotton sarees offer incredible softness, natural insulation, and sweat-absorption, making them ideal for long school/office days, humid summers, and everyday comfort. Linen sarees provide a modern, sophisticated texture with crisp drapes that are both breathable and stylish, making them a fantastic premium corporate and casual option. All three variations are expertly sourced at our saree shop in Nagpur."
  },
  {
    category: "wholesale",
    q: "Do you offer discounts on festive seasons or bulk purchasing?",
    a: "Yes, we treat our community to exclusive seasonal promotions, festive sales, and introductory offers during popular celebrations like Diwali, Ganesh Chaturthi, Karwa Chauth, and Dusshera. Furthermore, we offer customized discounts on volume packaging and bulk transactions for wedding trousseaus or special family gatherings. For wholesale purchases, we provide special low catalog prices based on order quantities. To stay updated with our latest designer sarees launches, upcoming clearance offers, and exclusive discount codes, we invite you to subscribe to our announcement bar or chat directly with our helpful Nagpur store representatives over WhatsApp."
  },
  {
    category: "guides",
    q: "What is the difference between a Paithani saree and a Kanjivaram saree?",
    a: "While both are highly esteemed premium silk sarees, they originate from entirely distinct regions and traditional craftsmanship techniques: Paithani sarees, hailing from Maharashtra, are renowned for their signature glossy silk texture, heavy gold square-borders (Kath), and artistic hand-woven pallus depicting natural motifs like peacocks (Muni), parrots, and blooming lotuses. Kanjivaram sarees, hailing from Tamil Nadu, are distinguished by their heavy Mulberry three-ply silk construction, grand temple borders, and solid contrast pallus intricately woven with genuine silver and gold metallic zari threads in symmetric geometrical checks or classic epic patterns."
  },
  {
    category: "shipping",
    q: "Can I track my saree order status online easily?",
    a: "Yes, tracking your delivery with Mukesh Saree Centre is completely seamless. Once your order has been dispatched from our Nagpur warehouse, you will automatically receive a detailed dispatch notice via SMS and email containing the tracking number and a live courier tracking URL. You can click on this tracking link at any time of day to view the live dispatch records, current transit hub, and expected delivery date. If you ever experience any difficulty tracking your parcel, simply share your order ID with our helpful WhatsApp team at +91 70206 64641 for immediate live status verification."
  },
  {
    category: "shipping",
    q: "Do you provide international shipping for overseas customers?",
    a: "Currently, our online checkout process is optimized to handle shipping services within India. However, we have a loyal database of international shoppers who love our premium sarees, designer sarees, and bridal wear! If you are located outside India (e.g., in USA, UK, Canada, Australia, UAE, or Singapore) and wish to purchase our gorgeous drapes, simply connect directly with our helpful export-support desk on WhatsApp at +91 70206 64641. We will manually arrange custom international shipping via reliable overseas services (such as DHL Express or FedEx) and handle calculations transparently."
  },
  {
    category: "payments",
    q: "What payment methods do you accept online on MukeshSarees.com?",
    a: "We incorporate an extremely secure, RBI-compliant payment gateway on our boutique website to offer you maximum safety and convenience. We accept all major Credit Cards, Debit Cards, RuPay, Visa, Mastercard, and American Express. In addition, you can pay instantly using popular UPI wallets (including Google Pay, PhonePe, Paytm, and BHIM), Net Banking across 50+ central Indian banks, or opt for our secure Cash on Delivery (COD) service. All online digital transactions are processed with powerful 256-bit SSL encryption, ensuring your billing details, bank coordinates, and credentials remain entirely private, safe, and confidential."
  },
  {
    category: "payments",
    q: "Is Cash on Delivery (COD) costlier than prepaid orders?",
    a: "Absolutely not! Unlike many other online saree shopping sites that charge additional COD handling fees, Mukesh Saree Centre does not ask for any extra charge, convenience fee, or handling premium for Cash on Delivery orders. We believe in complete pricing transparency and building long-lasting customer relationships across India. Whether you choose online prepaid options or cash payment upon delivery at your home, the total cart amount remains exactly the same. However, for faster and contactless handovers, we encourage choosing prepaid UPI or online payment whenever possible."
  },
  {
    category: "orders",
    q: "Can I change or cancel my order after placing it?",
    a: "Yes, you can easily request a change or cancellation for your order, provided our warehouse team has not yet packed and dispatched the parcel. Because we strive to deliver your gorgeous sarees as quickly as possible, orders are often prepared for shipping within 3 to 12 hours. If you need to update the delivery address, change the saree color, swap items, or cancel the order entirely, please contact us immediately on WhatsApp at +91 70206 64641 with your Order ID. Once our courier team has picked up and dispatched the parcel, we cannot alter or stop the delivery in transit."
  },
  {
    category: "fabrics",
    q: "Do you sell readymade designer blouses and ethnic co-ord sets?",
    a: "Yes! Beyond our world-class linen sarees and silk sarees, Mukesh Saree Centre showcases a highly curated modern collection of premium breathable co-ord sets, stylish ladies' readymade suits, and designer blouses in elegant fabrics. Our co-ord sets are incredibly popular for everyday loungewear, travel comfort, and stylish daytime social meets. Our readymade blouses come with flexible margin stitches so they can be adjusted effortlessly to match any saree drape. Explore our category sections today to build the ultimate contemporary ethnic wardrobe that effortlessly blends traditional artisan values with active modern aesthetics."
  },
  {
    category: "guides",
    q: "How can I identify the authenticity of a pure silk saree?",
    a: "Verifying the authenticity of real silk sarees involves simple, classic tests: The Touch Test suggests that genuine luxury silk warms up slightly when rubbed vigorously between your fingers, whereas synthetic fibers remain cold and static. The Burn Test (for loose threads) states that if you burn a single thread pulled from the saree's fringe, authentic pure silk burns with a smell similar to burning hair and leaves crumbly black ash, while synthetic fibers melt, smell like plastic, and form hard, non-crumbly beads. Our premium handloom silks are sourced with full authenticity guarantees directly from highly reputed weavers."
  },
  {
    category: "guides",
    q: "Do your sarees come with a run blouse piece attached?",
    a: "Yes, almost all our premium sarees, including Banarasi silk sarees, linen sarees, and cotton sarees, include an unstitched running blouse piece (typically 80cm to 1 meter in length) attached to the saree body itself. The blouse piece is styled to perfectly balance or contrast with the saree's border and body print, giving you a cohesive and tailored designer look. In cases of certain designer sarees or exclusive modern fabrics where a separate fabric is provided, we will clearly state \"Blouse: Separate\" or \"Running Blouse Included\" directly on the product specifications panel."
  },
  {
    category: "returns",
    q: "What should I do if I receive a damaged or incorrect saree?",
    a: "At Mukesh Saree Centre, we implement a strict triple-point quality control layout before folding, packaging, and dispatching any saree. In the exceedingly rare event that you receive a saree showing any manufacturing defect, weaving run, or if the wrong item was packed, please do not worry. Simply contact our support on WhatsApp at +91 70206 64641 within 48 hours of delivery. Share a clear photo or short unboxing video showing the damage. We will immediately arrange a free replacement pickup and dispatch the brand-new, perfect saree with highest priority at zero extra cost to you."
  },
  {
    category: "support",
    q: "Why has Mukesh Saree Centre been trusted since 1978?",
    a: "For over four decades, Mukesh Saree Centre (founded by the Nanakram Khemchandani family in Nagpur) has symbolized unwavering quality, authentic handloom sourcing, and warm hospitality. Unlike massive corporations, we treat saree retailing as a sacred heritage craft. By skipping middle agents and working directly with premier weaving clusters, we make high-quality premium sarees accessible at extremely honest prices. Our physical store has welcomed generations of Nagpur families, and we carry this exact same standard of integrity, personal customer care, transparent refund policies, and authentic handloom curation into our global online saree store."
  }
];

const categoryLabels = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "orders", label: "Ordering", icon: ShoppingBag },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "returns", label: "Returns", icon: RotateCcw },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "fabrics", label: "Fabrics & Care", icon: Sparkles },
  { id: "wholesale", label: "Wholesale", icon: Award },
  { id: "guides", label: "Buying Guides", icon: BookOpen },
  { id: "support", label: "Support", icon: Scissors }
];

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Initialize with all questions set to collapsed (false) by default
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    faqs.forEach((faq) => {
      initial[faq.q] = false;
    });
    return initial;
  });

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch = 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const jsonLdSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };
  }, []);

  const handleToggle = (questionText: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionText]: !prev[questionText]
    }));
  };

  const isAllExpanded = useMemo(() => {
    if (filteredFaqs.length === 0) return false;
    return filteredFaqs.every((faq) => !!expandedQuestions[faq.q]);
  }, [filteredFaqs, expandedQuestions]);

  const toggleAll = () => {
    const nextState: Record<string, boolean> = {};
    if (!isAllExpanded) {
      filteredFaqs.forEach((faq) => {
        nextState[faq.q] = true;
      });
    }
    setExpandedQuestions(nextState);
  };

  return (
    <div className="bg-primary-50">
      <SEO 
        title="Frequently Asked Questions (FAQ) | Mukesh Saree Centre" 
        description="Browse frequently asked questions regarding shopping, delivery, payments, pure silks, linen fabrics, customized blouses, wholesale rates, and returns at Mukesh Saree Centre, Nagpur." 
        url="/faqs"
        schema={jsonLdSchema}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 md:pt-8 md:pb-16">
        
        {/* Header Section / Compact and elegant footprint */}
        <header className="faq-header text-center mb-3 md:mb-5">
          <h1 className="text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] font-serif tracking-[0.05em] text-[var(--color-dark)] mb-1 md:mb-1.5 leading-[1.3] font-normal mx-auto max-w-full px-2 text-center break-words">
            Frequently Asked Questions
          </h1>
          <div className="w-8 md:w-12 h-[1px] bg-[#C8A96B] mx-auto mb-0"></div>
        </header>

        {/* Intelligent Search Input - Compact Height 40px/44px */}
        <div className="faq-search-wrapper max-w-xl mx-auto mb-2 md:mb-3.5 relative px-1 sm:px-0">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-3.5 flex items-center pointer-events-none text-primary-950/40">
            <Search size={15} className="md:w-[16px] md:h-[16px]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Search questions (e.g. shipping, Paithani, wholesale)..."
            className="w-full h-[38px] md:h-[42px] bg-white pl-9 pr-14 border border-[var(--color-border)] rounded-[4px] focus:outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B]/25 text-[11.5px] md:text-[12.5px] tracking-wide transition-all placeholder:text-neutral-400 font-sans shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[9px] sm:text-[10px] tracking-widest text-[#C8A96B] hover:text-[#a6864b] uppercase font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Tab Layout - Highly Compact, responsive and uniform */}
        <div className="faq-categories-wrapper flex flex-wrap justify-center gap-1 md:gap-1.5 mb-2.5 md:mb-4 overflow-x-auto pb-1 px-1 sm:px-0 no-scrollbar scrollbar-hide">
          {categoryLabels.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                }}
                className={`flex items-center justify-center gap-1 px-2.5 py-1.5 md:gap-1.5 md:px-3 md:py-2 text-[9.5px] xs:text-[10px] sm:text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.1em] font-sans transition-all duration-300 rounded-[4px] border select-none shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-dark)] border-[var(--color-dark)] text-white shadow-sm"
                    : "bg-white border-[var(--color-border)] text-[#2C241B]/80 hover:border-[#C8A96B] hover:text-[#C8A96B]"
                }`}
              >
                <Icon className={`${isActive ? "text-gold-200" : "text-[#2C241B]/40"} w-3 h-3 md:w-3.5 md:h-3.5`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Expand/Collapse Controls - Compact Margins */}
        <div className="faq-controls-wrapper max-w-4xl mx-auto flex justify-between items-center mb-1.5 md:mb-2 px-1.5">
          <span className="text-[11px] sm:text-[12px] text-[#2C241B]/60 uppercase tracking-[0.08em] font-sans font-medium">
            {filteredFaqs.length} {filteredFaqs.length === 1 ? "Question" : "Questions"} found
          </span>
          {filteredFaqs.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="text-[11px] sm:text-[11.5px] text-[#C8A96B] hover:text-[#a6864b] uppercase tracking-[0.05em] font-sans font-semibold cursor-pointer transition-colors focus:outline-none"
            >
              {isAllExpanded ? "Collapse All" : "Expand All"}
            </button>
          )}
        </div>

        {/* FAQs Accordion Container */}
        <div className="faq-accordion-container bg-white rounded-[4px] border border-[var(--color-border)] shadow-sm max-w-4xl mx-auto overflow-hidden">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-0 text-left">
              {filteredFaqs.map((faq, idx) => {
                const isExpanded = !!expandedQuestions[faq.q];
                return (
                  <div 
                    key={idx} 
                    className={`faq-accordion-item border-b border-[var(--color-border)]/40 last:border-b-0 transition-colors duration-300 ${
                      isExpanded ? "bg-[#FAF8F4]/30" : "hover:bg-neutral-50/20"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggle(faq.q)}
                      aria-expanded={isExpanded}
                      className="faq-accordion-button w-full text-left py-[6px] px-[12px] md:py-[8px] md:px-[18px] flex justify-between items-center gap-2.5 md:gap-4 focus:outline-none cursor-pointer group transition-colors duration-300"
                    >
                      <span className="text-[12.5px] xs:text-[13px] sm:text-[13.5px] md:text-[14.5px] font-medium text-[#2C241B]/95 tracking-wide leading-[1.35] group-hover:text-[#C8A96B] transition-colors duration-300 m-0">
                        {faq.q}
                      </span>
                      <span className="text-[#C8A96B] shrink-0 transition-transform duration-300 ease-in-out flex items-center" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                        <ChevronDown size={14} strokeWidth={2} className="xs:w-[15px] xs:h-[15px] md:w-[17px] md:h-[17px]" />
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-[14px] pb-[12px] pt-[3px] md:px-[20px] md:pb-[15px] md:pt-[5px] border-t border-[var(--color-border)]/20">
                            <p className="text-[12px] xs:text-[12.5px] sm:text-[13px] md:text-[13.5px] text-[#2C241B]/75 leading-relaxed font-normal m-0 whitespace-pre-wrap">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <HelpCircle className="mx-auto text-primary-950/20 mb-3" size={38} />
              <h4 className="text-sm font-serif text-primary-950/60 uppercase tracking-[0.1em] font-bold">No questions found</h4>
              <p className="text-xs text-primary-950/50 mt-1">Try broadening your search query or choosing another category above.</p>
            </div>
          )}
        </div>

        {/* Still Need Help CTA Block */}
        <div className="mt-6 md:mt-8 text-center bg-[var(--color-dark)] rounded-[4px] py-6 px-4 md:py-8 md:px-6 max-w-4xl mx-auto text-white shadow-md border border-[var(--color-border)]/20">
          <h2 className="text-base sm:text-lg md:text-xl font-serif text-[#E7D3A8] mb-1.5 md:mb-2 tracking-wide font-normal">Still have questions?</h2>
          <p className="text-white/70 mb-4 md:mb-5 text-[11px] sm:text-[12px] md:text-[12.5px] max-w-md mx-auto leading-relaxed font-sans">
            Our boutique specialists are here to guide you with fabric weights, customized measurements, tailored readymade blouses, or bulk shipping.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 max-w-xs sm:max-w-md mx-auto">
            <Link 
              to="/contact" 
              className="w-full sm:w-auto inline-block bg-white text-[var(--color-dark)] px-6 py-2.5 text-[10.5px] font-bold uppercase tracking-widest hover:bg-[#FAF8F4]/90 transition-all duration-300 shadow-sm rounded-[2px] cursor-pointer"
            >
              Get in Touch
            </Link>
            <a 
              href={`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/25 text-white px-6 py-2.5 text-[10.5px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300 rounded-[2px] cursor-pointer"
            >
              WhatsApp Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
