import { BUSINESS_INFO } from "./config/business";
import { Link } from "react-router";
import { useState, useRef, useEffect, lazy, Suspense } from "react";
const ProductCard = lazy(() => import("./components/ProductCard").then(m => ({ default: m.ProductCard })));
const LookReelCard = lazy(() => import("./components/LookReelCard").then(m => ({ default: m.LookReelCard })));
import { ProductCardSkeleton } from "./components/ProductCardSkeleton";
import { SEO } from "./components/SEO";
import { CONFIG } from "./config";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  Clock,
  Heart,
  ChevronDown,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { products } from "./mockData";
import { type Product } from "./store";
import { formatPrice, optimizeImage } from "./utils";
import { OptimizedImage } from "./components/OptimizedImage";
const TrustBadges = lazy(() => import("./components/TrustBadges").then(m => ({ default: m.TrustBadges })));
const CustomerReviews = lazy(() => import("./components/CustomerReviews").then(m => ({ default: m.CustomerReviews })));

const LOOK_REELS = [
  {
    id: "look-1",
    youtubeId: "https://ik.imagekit.io/tus1loev9/VID-20260601-WA0034.mp4",
    title: "ABP News Feature",
    category: "MEDIA COVERAGE",
    subtitle: "Exquisite Saree Exhibition",
    badge: "📺 TV News",
    poster: "https://ik.imagekit.io/tus1loev9/VID-20260601-WA0034.mp4/ik-thumbnail.jpg"
  },
  {
    id: "look-2",
    youtubeId: "https://ik.imagekit.io/tus1loev9/VID-20260521-WA0037.mp4",
    title: "Saree Trend Report",
    category: "FASHION PRESS",
    subtitle: "Nagpur Silk Collection",
    badge: "🔥 Trending",
    poster: "https://ik.imagekit.io/tus1loev9/VID-20260521-WA0037.mp4/ik-thumbnail.jpg"
  },
  {
    id: "look-3",
    youtubeId: "https://ik.imagekit.io/tus1loev9/VID-20260513-WA0026.mp4",
    title: "Lokmat Special",
    category: "MEDIA SHOWCODE",
    subtitle: "Elite Festive Drapes",
    badge: "🌟 Exclusive",
    poster: "https://ik.imagekit.io/tus1loev9/VID-20260513-WA0026.mp4/ik-thumbnail.jpg"
  },
  {
    id: "look-4",
    youtubeId: "https://ik.imagekit.io/tus1loev9/VID-20260513-WA0025.mp4",
    title: "Boutique Launch",
    category: "FIRST IMPRESSION",
    subtitle: "Luxury Organza & Silks",
    badge: "✨ Verified",
    poster: "https://ik.imagekit.io/tus1loev9/VID-20260513-WA0025.mp4/ik-thumbnail.jpg"
  },
  {
    id: "look-5",
    youtubeId: "https://ik.imagekit.io/tus1loev9/VID_20260124_071257_055_bsl5200255307509945724.mp4",
    title: "Nagpur Today Scoop",
    category: "PRESS RELEASE",
    subtitle: "Designer Bridal Georgets",
    badge: "💎 Premium",
    poster: "https://ik.imagekit.io/tus1loev9/VID_20260124_071257_055_bsl5200255307509945724.mp4/ik-thumbnail.jpg"
  }
];

/* const faqs = [
  {
    q: "How do I buy sarees online from Mukesh Saree Centre?",
    a: "Buying sarees online with Mukesh Saree Centre is a simple, premium experience. To begin your online saree shopping journey, browse our curated collection of sarees including authentic silk sarees, linen sarees, cotton sarees, and exquisite designer sarees. Once you find your preferred drape, select any customization or blouse options, click \"Add to Cart,\" and proceed to checkout. We require basic shipping details and offer secure payment options like credit/debit cards, UPI, net banking, or Cash on Delivery (COD) for convenience. Our high-resolution product photography captures true-to-life fabric textures and colors, ensuring that your chosen wedding sarees or party wear sarees arrive exactly as depicted on your screen."
  },
  {
    q: "Where is your physical saree shop located?",
    a: "Our landmark physical retail flagship is proudly located at Jagnath Road, Gandhibagh, Nagpur, Maharashtra, 440002, India. As a trusted physical saree shop in Nagpur since 1978, we welcome customers to explore our premium collection of handloom masterpieces, bridal lehengas, party wear sarees, and traditional silk sarees in person. Our central Nagpur location is fully air-conditioned and staffed by custom ethnic wear consultants ready to guide you through fabric selections, intricate embroidery details, and draping techniques, making it the perfect destination for wedding sarees shopping. We are open Monday to Saturday from 10:00 AM to 8:00 PM."
  },
  {
    q: "Do you provide Cash on Delivery (COD) for online saree shopping?",
    a: "Yes, we provide 100% reliable Cash on Delivery (COD) options globally across India for all our online saree shopping orders. Whether you are purchasing lightweight cotton sarees, premium linen sarees, highly detailed Banarasi sarees, or luxurious silk sarees, you can complete your order securely by selecting Cash on Delivery at checkout. There are absolutely no additional hidden handling fees or upfront charges for choosing COD, keeping our trust-centric shopping policy intact. This allows you to verify the premium quality, soft drape, and packaging of our ethnic wear products before making the final cash payment to our courier delivery agent."
  },
  {
    q: "What is the shipping cost and minimum order for free shipping?",
    a: "At Mukesh Saree Centre, we are delighted to offer 100% FREE Standard Shipping across India on all prepaid and Cash on Delivery (COD) orders above ₹499. For orders below ₹499, a nominal shipping and delivery fee is calculated at checkout based on your exact delivery location. We partner exclusively with top-tier national logistics services like BlueDart, Delhivery, Amazon Shipping, and DTDC to ensure that your precious silk sarees, cotton sarees, and party wear sarees are handled with maximum care and delivered securely in pristine condition, accompanied by real-time SMS tracking updates in 3–7 business days."
  },
  {
    q: "What is your return and exchange policy for sarees bought online?",
    a: "We want you to be completely in love with your purchase from Mukesh Saree Centre. Therefore, we offer a hassle-free, customer-friendly 7-day return and exchange policy for all sarees bought online. If your received silk sarees, cotton sarees, linen sarees, or wedding sarees do not meet your expectations, simply initiate a return on our website or get in touch with our customer support team on WhatsApp at +91 70206 64641 within 7 days of delivery. Please ensure that the sarees remain completely unused, unwashed, unstitched, and in their original packaging with all brand tags and price tags intact to qualify for a full refund."
  },
  {
    q: "What makes Banarasi sarees from Mukesh Saree Centre special?",
    a: "Our premium collection of Banarasi sarees represents the pinnacle of rich Indian heritage and luxury. Sourced directly from highly skilled master weavers in Varanasi (Benares), these sarees are woven on traditional handlooms utilizing genuine fine silk threads and exquisite metallic zari embroidery. Known for their royal, opulent appearance, our Banarasi sarees are perfect for weddings, grand festivals, receptions, and bridal trousseaus. We carefully test the zari quality and silk weight of every piece, guaranteeing a soft, non-scratchy texture that drapes majestically, which has made us the trusted choice for wedding sarees and bridal wear since 1978."
  },
  {
    q: "How should I care for my silk sarees to ensure they last?",
    a: "To preserve the timeless luster, gold zari embroidery, and fabric integrity of your premium silk sarees, we advise professional dry cleaning only. Store your pure silk sarees, Kanjivaram sarees, and Banarasi sarees wrapped individually in soft, clean white muslin or cotton cloths to protect them from environmental moisture, dust, and friction. Avoid hanging silk sarees on metal hangers as this can distort the weave and fold lines over time. Additionally, remember to periodically unfold and air out your heirloom silk sarees in a clean, shaded space inside your wardrobe, shielding them from any direct sunlight which can fade the delicate organic natural dyes."
  },
  {
    q: "Are your linen sarees suitable for hot summer weather?",
    a: "Absolutely! Our premium linen sarees are specifically woven from high-grade natural flax fibers, rendering them exceptionally breathable, sweat-absorbent, lightweight, and skin-friendly during hot and humid summers. As a leading saree shop in Nagpur, we offer a versatile collection of linen sarees that beautifully blend crisp natural textures with modern prints, solid pastel colors, and elegant zari borders. These linen sarees are perfect for professional office daily wear, high-profile corporate environments, formal meetings, casual daytime get-togethers, and daytime summer festivities, providing a chic, contemporary ethnic vibe with effortless lightweight elegance."
  },
  {
    q: "Do you sell premium cotton sarees for daily office wear?",
    a: "Yes, Mukesh Saree Centre Nagpur specializes in sourcing premium, authentic cotton sarees perfect for long workdays and professional corporate attire. Our pure cotton sarees selection includes iconic regional handlooms like Chanderi, Kota Doria, Maheshwari, traditional block prints, kalamkari, and mulmul cottons. Woven from high-tension natural cotton yarns, these sarees offer incomparable all-day comfort, exceptional breathability, and structure. They are easy to drape and maintain, retaining their vibrant colors and crisp look even after regular gentle washes. Explore our online saree shopping search to find the perfect cotton drapes for your regular office wardrobe."
  },
  {
    q: "How can I contact customer support for order tracking or assistance?",
    a: "Our boutique customer support is easily accessible and highly responsive. You can reach out directly via live WhatsApp chat or phone call at +91 70206 64641, or email us at info@mukeshsarees.com. Whether you need styling advice on party wear sarees, help selecting wedding sarees, size guidance for readymade blouses, or live updates on your order dispatch, our dedicated team is there to assist you. As an established boutique saree shop in Nagpur, we take immense pride in delivering personalized, friendly assistance to ensure your online shopping experience is as warm, delightful, and smooth as visiting our physical Nagpur store."
  },
  {
    q: "Do you supply sarees at wholesale rates for bulk or business orders?",
    a: "Yes, Mukesh Saree Centre is a highly reputable wholesale supplier of sarees, lehengas, and ethnic wear. Since 1978, we have acted as a direct distributor supplying retail stores, boutiques, home sellers, and online businesses all across Vidarbha, Maharashtra, Madhya Pradesh, Chhattisgarh, and beyond. If you are a retailer looking to source silk sarees, linen sarees, or party wear sarees in bulk, you can contact our wholesale team directly on WhatsApp. We offer highly competitive catalog prices, strict quality checks, custom brand packaging support, and reliable bulk logistics to help scale your ethnic wear business."
  },
  {
    q: "Can I customize the blouse or fall-pico of the saree?",
    a: "Yes! We offer professional customizable fall-pico, edge-stitching, and customized blouse tailoring services on special request for all our online saree shopping orders. Once you have placed your order for any silk sarees, cotton sarees, or party wear sarees, simply ping our support team on WhatsApp at +91 70206 64641 with your specific order number and customized measurement details. Our in-house boutique tailors will craft the ideal custom-fitted padded or non-padded designer blouse and stitch the matching fall-pico precisely, ensuring your saree is completely prepped, elegant, and ready for you to wear immediately upon unboxing."
  },
  {
    q: "What is the typical delivery timeline for pan-India orders?",
    a: "For orders shipped across India, our typical standard shipping timeline is 3 to 7 business days. Orders placed from major metro cities like Maharashtra, Mumbai, Pune, Pune Rural, Delhi NCR, Bangalore, Hyderabad, and Chennai are often dispatched within 24 hours of confirmation and delivered in just 2 to 4 business days. For remote locations, it may take up to 7 business days. We ship out directly from our warehouse located in Gandhibagh, Nagpur. Customers will receive a live Tracking Link via SMS and email as soon as the package is handed over to our premium shipping partners."
  },
  {
    q: "What are the popular choices for party wear sarees on your boutique?",
    a: "For glamorous parties, evening cocktails, sangeet ceremonies, and high-fashion social gatherings, our hot-selling party wear sarees collection is second to none. We showcase a magnificent range of modern fluid organza sarees with hand-painted floral prints, metallic georgette sarees with shimmering sequins, soft designer net sarees adorned with heavy zardozi embroidery, and glossy silk satin sarees. Designed to make you look radiant under both natural sunlight and evening hall lights, these lightweight designer sarees combine contemporary western silhouettes with centuries-old Indian craftsmanship, ensuring you feel incredibly glamorous, confident, and light on your feet throughout the celebration."
  },
  {
    q: "Which sarees are best suited for traditional Indian weddings?",
    a: "For bride, bridesmaids, mother of the bride, and esteemed wedding guests, traditional handloom sarees represent the highest standard of elegance. We highly recommend our curated heritage wedding sarees collection, featuring heavy-bordered pure Kanjivaram silk sarees, intricate silk Paithani sarees displaying iconic peacock border motifs, and opulent Varanasi-woven Banarasi silk sarees with rich golden zari brocades. These sarees hold an evergreen, prized spot in Indian bridal couture. They carry a timeless artistic allure, incredible fabric drape, and luxurious sheen that elevates the ceremonial atmosphere, keeping true cultural Indian heritage close to your heart on your special wedding day."
  },
  {
    q: "Are the colors of the sarees on the website accurate to real life?",
    a: "We make extraordinary efforts to ensure all product images appearing on MukeshSarees.com represent the real, actual colors, weaves, and textures as closely as humanly possible. Our catalog photography is shot under balanced daylight studio conditions using state-of-the-art camera sensors. However, please be slightly mindful that minor variations (typically within 5% to 10%) can occasionally occur due to differences in screen contrast settings, display temperatures, or mobile phone panels (such as OLED or LCD). If you ever feel doubtful or wish to double-check, our WhatsApp team is happy to send you quick unedited smartphone videos of the sarees under natural home lighting before dispatch."
  },
  {
    q: "How do I choose the right fabric: Silk, Cotton, or Linen?",
    a: "Choosing the perfect saree fabric essentially depends on the planned occasion, weather, and your personal styling preference: Silk sarees offer unmatched royal luster, structured drape, and premium stiffness, making them the gold-standard for weddings, Pujas, receptions, and festivals. Cotton sarees offer incredible softness, natural insulation, and sweat-absorption, making them ideal for long school/office days, humid summers, and everyday comfort. Linen sarees provide a modern, sophisticated texture with crisp drapes that are both breathable and stylish, making them a fantastic premium corporate and casual option. All three variations are expertly sourced at our saree shop in Nagpur."
  },
  {
    q: "Do you offer discounts on festive seasons or bulk purchasing?",
    a: "Yes, we treat our community to exclusive seasonal promotions, festive sales, and introductory offers during popular celebrations like Diwali, Ganesh Chaturthi, Karwa Chauth, and Dusshera. Furthermore, we offer customized discounts on volume packaging and bulk transactions for wedding trousseaus or special family gatherings. For wholesale purchases, we provide special low catalog prices based on order quantities. To stay updated with our latest designer sarees launches, upcoming clearance offers, and exclusive discount codes, we invite you to subscribe to our announcement bar or chat directly with our helpful Nagpur store representatives over WhatsApp."
  },
  {
    q: "What is the difference between a Paithani saree and a Kanjivaram saree?",
    a: "While both are highly esteemed premium silk sarees, they originate from entirely distinct regions and traditional craftsmanship techniques: Paithani sarees, hailing from Maharashtra, are renowned for their signature glossy silk texture, heavy gold square-borders (Kath), and artistic hand-woven pallus depicting natural motifs like peacocks (Muni), parrots, and blooming lotuses. Kanjivaram sarees, hailing from Tamil Nadu, are distinguished by their heavy Mulberry three-ply silk construction, grand temple borders, and solid contrast pallus intricately woven with genuine silver and gold metallic zari threads in symmetric geometrical checks or classic epic patterns."
  },
  {
    q: "Can I track my saree order status online easily?",
    a: "Yes, tracking your delivery with Mukesh Saree Centre is completely seamless. Once your order has been dispatched from our Nagpur warehouse, you will automatically receive a detailed dispatch notice via SMS and email containing the tracking number and a live courier tracking URL. You can click on this tracking link at any time of day to view the live dispatch records, current transit hub, and expected delivery date. If you ever experience any difficulty tracking your parcel, simply share your order ID with our helpful WhatsApp team at +91 70206 64641 for immediate live status verification."
  },
  {
    q: "Do you provide international shipping for overseas customers?",
    a: "Currently, our online checkout process is optimized to handle shipping services within India. However, we have a loyal database of international shoppers who love our premium sarees, designer sarees, and bridal wear! If you are located outside India (e.g., in USA, UK, Canada, Australia, UAE, or Singapore) and wish to purchase our gorgeous drapes, simply connect directly with our helpful export-support desk on WhatsApp at +91 70206 64641. We will manually arrange custom international shipping via reliable overseas services (such as DHL Express or FedEx) and handle calculations transparently."
  },
  {
    q: "What payment methods do you accept online on MukeshSarees.com?",
    a: "We incorporate an extremely secure, RBI-compliant payment gateway on our boutique website to offer you maximum safety and convenience. We accept all major Credit Cards, Debit Cards, RuPay, Visa, Mastercard, and American Express. In addition, you can pay instantly using popular UPI wallets (including Google Pay, PhonePe, Paytm, and BHIM), Net Banking across 50+ central Indian banks, or opt for our secure Cash on Delivery (COD) service. All online digital transactions are processed with powerful 256-bit SSL encryption, ensuring your billing details, bank coordinates, and credentials remain entirely private, safe, and confidential."
  },
  {
    q: "Is Cash on Delivery (COD) costlier than prepaid orders?",
    a: "Absolutely not! Unlike many other online saree shopping sites that charge additional COD handling fees, Mukesh Saree Centre does not ask for any extra charge, convenience fee, or handling premium for Cash on Delivery orders. We believe in complete pricing transparency and building long-lasting customer relationships across India. Whether you choose online prepaid options or cash payment upon delivery at your home, the total cart amount remains exactly the same. However, for faster and contactless handovers, we encourage choosing prepaid UPI or online payment whenever possible."
  },
  {
    q: "Can I change or cancel my order after placing it?",
    a: "Yes, you can easily request a change or cancellation for your order, provided our warehouse team has not yet packed and dispatched the parcel. Because we strive to deliver your gorgeous sarees as quickly as possible, orders are often prepared for shipping within 3 to 12 hours. If you need to update the delivery address, change the saree color, swap items, or cancel the order entirely, please contact us immediately on WhatsApp at +91 70206 64641 with your Order ID. Once our courier team has picked up and dispatched the parcel, we cannot alter or stop the delivery in transit."
  },
  {
    q: "Do you sell readymade designer blouses and ethnic co-ord sets?",
    a: "Yes! Beyond our world-class linen sarees and silk sarees, Mukesh Saree Centre showcases a highly curated modern collection of premium breathable co-ord sets, stylish ladies' readymade suits, and designer blouses in elegant fabrics. Our co-ord sets are incredibly popular for everyday loungewear, travel comfort, and stylish daytime social meets. Our readymade blouses come with flexible margin stitches so they can be adjusted effortlessly to match any saree drape. Explore our category sections today to build the ultimate contemporary ethnic wardrobe that effortlessly blends traditional artisan values with active modern aesthetics."
  },
  {
    q: "How can I identify the authenticity of a pure silk saree?",
    a: "Verifying the authenticity of real silk sarees involves simple, classic tests: The Touch Test suggests that genuine luxury silk warms up slightly when rubbed vigorously between your fingers, whereas synthetic fibers remain cold and static. The Burn Test (for loose threads) states that if you burn a single thread pulled from the saree's fringe, authentic pure silk burns with a smell similar to burning hair and leaves crumbly black ash, while synthetic fibers melt, smell like plastic, and form hard, non-crumbly beads. Our premium handloom silks are sourced with full authenticity guarantees directly from highly reputed weavers."
  },
  {
    q: "Do your sarees come with a run blouse piece attached?",
    a: "Yes, almost all our premium sarees, including Banarasi silk sarees, linen sarees, and cotton sarees, include an unstitched running blouse piece (typically 80cm to 1 meter in length) attached to the saree body itself. The blouse piece is styled to perfectly balance or contrast with the saree's border and body print, giving you a cohesive and tailored designer look. In cases of certain designer sarees or exclusive modern fabrics where a separate fabric is provided, we will clearly state \"Blouse: Separate\" or \"Running Blouse Included\" directly on the product specifications panel."
  },
  {
    q: "What should I do if I receive a damaged or incorrect saree?",
    a: "At Mukesh Saree Centre, we implement a strict triple-point quality control layout before folding, packaging, and dispatching any saree. In the exceedingly rare event that you receive a saree showing any manufacturing defect, weaving run, or if the wrong item was packed, please do not worry. Simply contact our support on WhatsApp at +91 70206 64641 within 48 hours of delivery. Share a clear photo or short unboxing video showing the damage. We will immediately arrange a free replacement pickup and dispatch the brand-new, perfect saree with highest priority at zero extra cost to you."
  },
  {
    q: "Why has Mukesh Saree Centre been trusted since 1978?",
    a: "For over four decades, Mukesh Saree Centre (founded by the Nanakram Khemchandani family in Nagpur) has symbolized unwavering quality, authentic handloom sourcing, and warm hospitality. Unlike massive corporations, we treat saree retailing as a sacred heritage craft. By skipping middle agents and working directly with premier weaving clusters, we make high-quality premium sarees accessible at extremely honest prices. Our physical store has welcomed generations of Nagpur families, and we carry this exact same standard of integrity, personal customer care, transparent refund policies, and authentic handloom curation into our global online saree store."
  }
]; */

export default function Home() {
  const mainProducts = products.filter((p) => !p.isVariant && !p.isHidden);
  const trendingProductsList = mainProducts.filter((p) => p.isTrending);
  const trendingProducts =
    trendingProductsList.length >= 8
      ? trendingProductsList.slice(0, 8)
      : [
          ...trendingProductsList,
          ...mainProducts.filter((p) => !p.isTrending),
        ].slice(0, 8);

  const trendingIds = new Set(trendingProducts.map((p) => p.id));
  const newArrivalsProductsList = [...mainProducts]
    .reverse()
    .filter((p) => p.isNew && !trendingIds.has(p.id));
  // If there are less than 8 new arrivals, fill with other non-trending products to make sure we show 8
  const newArrivals =
    newArrivalsProductsList.length >= 8
      ? newArrivalsProductsList.slice(0, 8)
      : [
          ...newArrivalsProductsList,
          ...mainProducts.filter(
            (p) =>
              !trendingIds.has(p.id) &&
              !newArrivalsProductsList.find((n) => n.id === p.id),
          ),
        ].slice(0, 8);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const [selectedShopImage, setSelectedShopImage] = useState<string | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const [reelsScrollProgress, setReelsScrollProgress] = useState(0);
  const reelsScrollRef = useRef<HTMLDivElement>(null);
  const [activeReelId, setActiveReelId] = useState<string>("look-1");

  const [visibleReelIds, setVisibleReelIds] = useState<Record<string, boolean>>({});

  const handleReelVisibilityChange = (id: string, isVisible: boolean) => {
    setVisibleReelIds((prev) => {
      if (prev[id] === isVisible) return prev;
      return { ...prev, [id]: isVisible };
    });
  };

  const visibleIndices = LOOK_REELS.map((reel, index) => visibleReelIds[reel.id] ? index : -1).filter((idx) => idx !== -1);

  const reelsScrollTick = useRef<boolean>(false);

  const handleReelsScroll = () => {
    if (!reelsScrollTick.current) {
      window.requestAnimationFrame(() => {
        performReelsScrollCalculation();
        reelsScrollTick.current = false;
      });
      reelsScrollTick.current = true;
    }
  };

  const performReelsScrollCalculation = () => {
    if (reelsScrollRef.current) {
      const container = reelsScrollRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable > 0) {
        const progress = scrollLeft / totalScrollable;
        setReelsScrollProgress(progress);

        // Highly performant active index calculation avoiding any DOM bounding box calculations (zero reflows):
        // Since look reels are in a snapped, horizontal layout, mapping progress directly to index
        // yields the active center reel perfectly with no layout-thrashing getBoundingClientRect() calls.
        const activeIndex = Math.min(
          LOOK_REELS.length - 1,
          Math.max(0, Math.round(progress * (LOOK_REELS.length - 1)))
        );
        const closestId = LOOK_REELS[activeIndex]?.id;
        if (closestId && closestId !== activeReelId) {
          setActiveReelId(closestId);
        }
      }
    }
  };

  // Perform alignment calculation on window loading/resizing
  useEffect(() => {
    // Small timeout to let elements lay out properly
    const timer = setTimeout(() => {
      handleReelsScroll();
    }, 100);

    window.addEventListener("resize", handleReelsScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleReelsScroll);
    };
  }, []);

  const shopImages = [
    {
      url: "https://ik.imagekit.io/tus1loev9/homepage/shopenterence.webp?updatedAt=1779907894298",
      label: "Main Shop Enterence",
      alt: "Entrance of Mukesh Saree Centre physical shop in Gandhibagh Nagpur",
    },
    {
      url: "https://ik.imagekit.io/tus1loev9/homepage/billingcounter.webp?updatedAt=1779907894357",
      label: "Billing Counter",
      alt: "Interior view showing the busy billing counter at Mukesh Saree Centre",
    },
    {
      url: "https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695",
      label: "Saree Section",
      alt: "Beautiful display of premium silk and cotton sarees in our wholesale showroom",
    },
    {
      url: "https://ik.imagekit.io/tus1loev9/homepage/lehengasection.webp?updatedAt=1779907894691",
      label: "Lehenga Section",
      alt: "Exclusive bridal lehenga section displaying rich ethnic wedding wear",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const { scrollY } = useScroll();
  const heroTextOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 300], [0, 50]);
  const heroOverlayOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroImageY = useTransform(scrollY, [0, 800], [0, 150]);

  return (
    <div className="flex flex-col">
      <SEO
        title="Mukesh Saree Centre – Best Saree Shop in Nagpur | Est. 1978"
        description="Looking for a saree shop in Nagpur? Mukesh Saree Centre has been Nagpur's trusted saree destination since 1978. Shop premium sarees online or visit us."
        image="https://mukeshsarees.com/images/og-home.jpg"
        url="/"
      />

      {/* Hero Section */}
      <section className="relative w-full h-[85vh] md:h-[90vh] bg-[#1A0A00] flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full z-0 overflow-hidden"
          style={{ y: heroImageY }}
        >
          {/* Mobile Hero Image (hidden on desktop) */}
          <img
            src="https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469&tr=w-768,f-webp,q-75"
            srcSet="https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469&tr=w-400,f-webp,q-75 400w, https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469&tr=w-768,f-webp,q-75 768w"
            sizes="(max-width: 768px) 100vw, 768px"
            width={768}
            height={1000}
            alt="Mukesh Saree Centre Premium Saree Collection - Trusted saree shop in Nagpur offering offline and online sales in India"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="block md:hidden w-full h-full object-cover object-[72%_bottom] opacity-100 transition-opacity duration-700"
          />
          {/* Desktop Hero Image (hidden on mobile) */}
          <img
            src="https://ik.imagekit.io/tus1loev9/homepage/file_0000000019b871f8bffede768176be45.webp?tr=w-1200,f-webp,q-75"
            srcSet="https://ik.imagekit.io/tus1loev9/homepage/file_0000000019b871f8bffede768176be45.webp?tr=w-800,f-webp,q-75 800w, https://ik.imagekit.io/tus1loev9/homepage/file_0000000019b871f8bffede768176be45.webp?tr=w-1200,f-webp,q-75 1200w, https://ik.imagekit.io/tus1loev9/homepage/file_0000000019b871f8bffede768176be45.webp?tr=w-1600,f-webp,q-75 1600w, https://ik.imagekit.io/tus1loev9/homepage/file_0000000019b871f8bffede768176be45.webp?tr=w-2000,f-webp,q-75 2000w"
            sizes="(min-width: 768px) 100vw, 1200px"
            width={1200}
            height={1000}
            alt="Mukesh Saree Centre Premium Saree Collection - Trusted saree shop in Nagpur offering offline and online sales in India"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="hidden md:block w-full h-full object-cover object-bottom opacity-100 transition-opacity duration-700"
          />
        </motion.div>

        {/* Cinematic gradient overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.12) 35%, transparent 65%), linear-gradient(to top, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 30%, transparent 60%)",
          }}
        />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full flex flex-col justify-center items-start h-full pt-[100px] md:pt-[110px] pb-12"
          style={{ opacity: heroTextOpacity, y: heroTextY }}
        >
          <div className="max-w-[200px] xs:max-w-[220px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[500px] text-left mb-4 md:mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[19px] xs:text-[21px] sm:text-[30px] md:text-[38px] lg:text-[45px] font-serif mb-2.5 md:mb-4 leading-[1.35] sm:leading-[1.2] font-normal tracking-[0.14em] sm:tracking-[0.12em] uppercase"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.45), 0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.2)",
                color: "#FFFDF8",
              }}
            >
              Mukesh Saree Centre <br className="block sm:hidden" />– Saree Shop in Nagpur
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[10px] xs:text-[11px] sm:text-[13px] md:text-[15px] leading-[1.8] mb-8 md:mb-10 max-w-[190px] xs:max-w-[200px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[420px] font-sans font-light tracking-[0.12em] uppercase opacity-95"
              style={{
                textShadow: "0 2px 8px rgba(0,0,0,0.4), 0 4px 18px rgba(0,0,0,0.25)",
                color: "#F5EFE6",
              }}
            >
              Beautiful Designs. Trusted Quality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-start"
            >
              <Link
                to="/shop"
                className="btn-hero-white w-[145px] xs:w-[160px] sm:w-[220px] tracking-[0.2em] text-[9.5px] md:text-[11px]"
                aria-label="Shop our entire collection of sarees and ethnic wear at Mukesh Saree Centre"
              >
                SHOP NOW
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-20 p-4"
          style={{ opacity: heroTextOpacity }}
          onClick={() => {
            const nextSec = document.getElementById("next-section");
            if (nextSec) {
              const rect = nextSec.getBoundingClientRect();
              window.scrollTo({
                top: rect.top + window.scrollY - 80,
                behavior: "smooth",
              });
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="text-white/90 w-5 h-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </motion.div>
        </motion.div>
      </section>

      {/* Shop by Category */}
      <section id="next-section" className="bg-primary-50 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-8 text-center md:text-left bg-white/40 p-4 md:p-6 rounded-lg border border-black/5">
            <p className="text-[13px] sm:text-[14px] md:text-[15px] text-primary-950/80 font-sans leading-relaxed max-w-4xl">
              Welcome to Mukesh Saree Centre, the best saree shop in Nagpur offering an exquisite collection of hand-picked ethnic wear since 1978. Whether you are searching for premium sarees near me or visiting our iconic physical showroom in Gandhibagh, we provide unmatched quality and designs. Discover why generations of families trust us as their favorite saree shop in Nagpur for every special celebration.
            </p>
          </div>
          <div className="flex justify-between items-baseline mb-3 md:mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light tracking-[0.06em] text-[var(--color-dark)]">
              Shop by <span className="italic">Category</span>
            </h2>
            <Link
              to="/shop"
              className="text-[12px] uppercase text-gold-600 tracking-[0.15em] hover:text-gold-500 transition-colors font-medium"
            >
              View Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
            <div className="sr-only">
              <h3>Designer Co-Ord Sets Collection</h3>
              <p>
                Who it is for: Modern women looking for chic, effortless, and coordinated everyday wear.
                Fabric highlights: Premium breathable cottons, high-quality linen blends, and soft rayon.
                Best occasions: Office wear, casual outings, daytime parties, and semi-formal events.
                Benefits: Ready-to-wear comfort with perfectly matched tops and bottoms for an instantly put-together look.
                Styling tips: Pair with minimal jewelry and block heels for an elegant contemporary outfit.
              </p>
            </div>
            <Link
              to="/shop?category=Co-Ord-Sets"
              className="lg:col-span-7 xl:col-span-8 relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group rounded-2xl"
              aria-label="Shop our Designer Co-Ord Sets Collection"
            >
              <div className="absolute inset-0">
                <OptimizedImage
                  src="https://ik.imagekit.io/tus1loev9/homepage/coordsetcategory.webp?updatedAt=1779907895090"
                  width={800}
                  alt="Women wearing premium Co-Ord sets from Mukesh Saree Centre"
                  className="w-full h-full object-cover object-center lg:object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-serif mb-2 text-white font-semibold tracking-wide" style={{ color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,0.95)" }}>
                  Co-Ord Sets
                </h3>
                <div className="text-[13px] md:text-[14px] font-sans font-normal tracking-wide text-white mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                  Best Sellers |{" "}
                  <span className="font-discount font-semibold">50% OFF</span>
                </div>
                <div className="text-[14px] font-sans font-semibold text-[var(--color-gold-light)] mb-4" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                  Starting at ₹995
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-white border-b border-white pb-1 group-hover:text-[var(--color-gold-light)] group-hover:border-[var(--color-gold-light)] transition-colors" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>

            <div className="sr-only">
              <h3>Premium Sarees Collection</h3>
              <p>
                Who it is for: Women seeking authentic, high-quality traditional and contemporary sarees.
                Fabric highlights: Rich silk, authentic Banarasi, breathable cotton, and luxurious linen.
                Best occasions: Weddings, festivals, corporate wear, and daily elegant dressing.
                Benefits: A timeless drape with flawless weaving, long-lasting colors, and unmatched elegance.
                Styling tips: Accessorize with traditional gold jewelry for weddings or minimal oxidized silver for a chic daily look.
              </p>
            </div>
            <Link
              to="/shop?category=Sarees"
              className="lg:col-span-5 xl:col-span-4 relative h-[450px] md:h-[550px] overflow-hidden group rounded-2xl"
              aria-label="Shop our Premium Sarees Collection"
            >
              <div className="absolute inset-0">
                <OptimizedImage
                  src="https://ik.imagekit.io/tus1loev9/homepage/saree-category.webp?updatedAt=1779907894790"
                  width={800}
                  alt="Beautiful traditional Saree from Mukesh Saree Centre collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-serif mb-2 text-white font-semibold tracking-wide" style={{ color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,0.95)" }}>
                  Sarees
                </h3>
                <div className="text-[13px] md:text-[14px] font-sans font-normal tracking-wide text-white mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                  Premium Quality |{" "}
                  <span className="font-discount font-semibold">50% OFF</span>
                </div>
                <div className="text-[14px] font-sans font-semibold text-[var(--color-gold-light)] mb-4" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                  Starting at ₹649
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-white border-b border-white pb-1 group-hover:text-[var(--color-gold-light)] group-hover:border-[var(--color-gold-light)] transition-colors" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.85)" }}>
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="bg-white pt-4 md:pt-6 pb-2.5 md:pb-3 border-t border-gold-200/30">
        <div className="sr-only">
          <p>
            Who it is for: Fashion-forward women looking for the latest styles securely delivered to their doorstep.
            Fabric highlights: Lightweight silks, comfortable daily cottons, and intricately embroidered georgettes.
            Best occasions: Current season festivities, upcoming weddings, and highly-anticipated parties.
            Benefits: Stay ahead of the fashion curve with our most loved and frequently bought styles.
            Styling tips: Mix and match with contemporary blouses and statement jewelry for a fashionable edge.
          </p>
        </div>
        <div className="px-2 sm:px-4 lg:px-6 sm:max-w-7xl mx-auto">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-baseline mb-3 md:mb-5 px-1.5 sm:px-0">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light tracking-[0.06em] text-[var(--color-dark)] flex items-center justify-center md:justify-start gap-2">
                Trending <span className="sr-only">Ethnic Wear & Sarees</span> <span className="italic">Now</span>
              </h2>
            </div>
            <Link
              to="/shop?sort=trending"
              className="hidden md:block text-[12px] uppercase text-[var(--color-gold)] tracking-[0.15em] hover:text-[var(--color-gold-light)] transition-colors mt-4 md:mt-0 font-medium"
            >
              View Collection
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[6px] md:gap-3 lg:gap-4 w-full mx-auto">
            {isLoading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : trendingProducts.map((product, index) => (
                  <Suspense fallback={<ProductCardSkeleton />} key={product.id}>
                    <ProductCard product={product} priority={index < 4} />
                  </Suspense>
                ))}
          </div>
          <div className="text-center mt-3 md:mt-4">
            <Link to="/shop?sort=trending" className="btn-primary" aria-label="Shop our top selling trending sarees and ethnic wear">
              Shop Top Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* Why Shop With Us Section */}
      <section className="why-us-section pt-4 pb-0 bg-white border-t border-gold-200/30">
        <div className="max-w-4xl mx-auto px-1 sm:px-2">
          <div className="text-center mb-2 md:mb-3">
            <h2 className="text-xl sm:text-2xl font-serif font-light tracking-[0.06em] text-[var(--color-dark)]">
              Why Customers Choose <span className="italic">Mukesh Saree Centre</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="text-center p-1">
              <div className="text-2xl sm:text-3xl mb-1">🏆</div>
              <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-sans font-semibold text-[var(--color-dark)] uppercase tracking-wider mb-0.5">46 Years of Trust</h3>
              <p className="text-[11px] sm:text-[12px] md:text-[13px] text-[var(--color-dark)]/75">Established in Nagpur since 1978</p>
            </div>
            <div className="text-center p-1">
              <div className="text-2xl sm:text-3xl mb-1">🚚</div>
              <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-sans font-semibold text-[var(--color-dark)] uppercase tracking-wider mb-0.5">Cash on Delivery</h3>
              <p className="text-[11px] sm:text-[12px] md:text-[13px] text-[var(--color-dark)]/75">Available all across India</p>
            </div>
            <div className="text-center p-1">
              <div className="text-2xl sm:text-3xl mb-1">📦</div>
              <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-sans font-semibold text-[var(--color-dark)] uppercase tracking-wider mb-0.5">Free Shipping</h3>
              <p className="text-[11px] sm:text-[12px] md:text-[13px] text-[var(--color-dark)]/75">On all orders above ₹999</p>
            </div>
            <div className="text-center p-1">
              <div className="text-2xl sm:text-3xl mb-1">✨</div>
              <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-sans font-semibold text-[var(--color-dark)] uppercase tracking-wider mb-0.5">30+ Saree Varieties</h3>
              <p className="text-[11px] sm:text-[12px] md:text-[13px] text-[var(--color-dark)]/75">From Paithani to Banarasi to Linen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop The Look Cinematic Reels Section (Temporarily Hidden) */}
      {true && (
        <section className="bg-[#FAF8F5] py-1.5 md:py-3 border-y border-[#C8A96B]/10">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header with improved, elegant, slightly compact premium luxury typography */}
            <div className="text-center mb-1.5 md:mb-3 animate-fade-in animate-duration-500">
              <div className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[var(--color-gold-dark)] mb-1 font-bold font-sans">
                REELS COLLECTION
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-light tracking-[0.06em] text-[var(--color-dark)] mb-1">
                Shop Our Latest <span className="italic">Video Styles</span>
              </h2>
              <p className="text-[11px] sm:text-[12px] text-[var(--color-dark)]/70 max-w-xl mx-auto font-sans font-light">
                Discover trending sarees through elegant short videos curated for modern fashion lovers.
              </p>
            </div>

            {/* Reels Carousel/Grid Wrapper with Ambient Luxury Overlays */}
            <div className="relative w-full">
              {/* Ambient edge fades for mobile immersion */}
              <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10 pointer-events-none md:hidden" />
              <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10 pointer-events-none md:hidden" />

              {/* Reels Carousel/Grid with snap pads */}
              <div 
                ref={reelsScrollRef}
                onScroll={handleReelsScroll}
                style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
                className="flex lg:grid lg:grid-cols-3 xl:grid-cols-6 gap-3.5 md:gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar scrollbar-hide w-full tracking-wide px-10 md:px-0 scroll-px-10 md:scroll-px-0 touch-pan-x touch-pan-y"
              >
                {LOOK_REELS.map((reel, index) => {
                  return (
                    <Suspense fallback={<div className="min-w-[70vw] md:min-w-0 snap-center snap-always bg-gray-100 animate-pulse aspect-[9/16] rounded-md shrink-0 lg:w-full h-[65vh] max-h-[460px] md:h-[480px] lg:h-[320px] 2xl:h-[400px]" />} key={reel.id}>
                      <LookReelCard
                        reel={reel}
                        onVisibilityChange={handleReelVisibilityChange}
                        shouldRenderIframe={!!visibleReelIds[reel.id] || activeReelId === reel.id}
                        isActive={activeReelId === reel.id}
                      />
                    </Suspense>
                  );
                })}
              </div>

              {/* Elegant premium swipe cue & pagination indicator underneath (mobile-only) */}
              <div className="flex items-center justify-between px-6 mt-3.5 select-none md:hidden gap-4">
                <div className="flex items-center gap-1.5 text-[8.5px] tracking-[0.18em] text-[#C8A96B]/80 font-sans uppercase font-semibold">
                  <span>Swipe to Explore</span>
                  <span className="text-[10px] animate-bounce-horizontal">→</span>
                </div>
                
                {/* Premium Slim Horizontal Progress Tracker */}
                <div className="w-16 h-[1.5px] bg-[#C8A96B]/15 rounded-full relative overflow-hidden">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-[#C8A96B] rounded-full transition-all duration-100 ease-out"
                    style={{ 
                      width: '35%', 
                      left: `${reelsScrollProgress * 65}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      <section className="bg-primary-50 py-3 md:py-6 border-t border-gold-200/30">
        <div className="sr-only">
          <p>
            Who it is for: Trendsetters seeking the most recently launched fabrics and exclusive boutique additions.
            Fabric highlights: Innovative silk blends, crisp organzas, and newly patterned handlooms.
            Best occasions: Stand out at all upcoming prestigious events with out-of-the-box fresh designs.
            Benefits: Be the first to own our unique seasonal launches in very limited quantities.
            Styling tips: Let the fresh patterns speak for themselves by keeping accessories elegant and understated.
          </p>
        </div>
        <div className="px-2 sm:px-4 lg:px-6 sm:max-w-7xl mx-auto">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-baseline mb-3 md:mb-5 px-1.5 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light tracking-[0.06em] text-[var(--color-dark)]">
              New<span className="sr-only"> Saree</span> <span className="italic">Arrivals</span>
            </h2>
            <Link
              to="/shop?sort=new"
              className="hidden md:block text-[12px] uppercase text-[var(--color-gold)] tracking-[0.15em] hover:text-[var(--color-gold-light)] transition-colors mt-4 md:mt-0 font-medium"
            >
              Shop New Arrivals
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[6px] md:gap-3 lg:gap-4 w-full mx-auto">
            {isLoading
              ? [...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)
              : newArrivals.map((product, index) => (
                  <Suspense fallback={<ProductCardSkeleton />} key={product.id}>
                    <ProductCard product={product} priority={index < 4} />
                  </Suspense>
                ))}
          </div>
          <div className="text-center mt-4 md:mt-6">
            <Link to="/shop?sort=new" className="btn-secondary" aria-label="Shop our newest arrivals of sarees and ethnic wear">
              Shop New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges section removed - duplicate */}

      {/* Offer Banner */}
      <section className="bg-[var(--color-surface)] text-[var(--color-dark)] text-center relative overflow-hidden py-4 sm:py-6 md:py-10 border-t border-gold-200/30">
        <div
          className="absolute inset-0 z-0 opacity-[0.15] mix-blend-multiply"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=45')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 relative z-10 w-full">
          <div className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-gold-dark)] mb-1.5 sm:mb-2 font-medium">
            Special Collection
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[var(--color-dark)] mb-1.5 sm:mb-2 font-normal tracking-wide leading-tight">
            Premium Collections at 50% OFF
          </h2>
          <p className="text-[14px] sm:text-[15px] opacity-90 font-light max-w-lg mx-auto text-[var(--color-dark)] leading-normal mb-3 sm:mb-4">
            Discover our selection of beautiful fabrics and sarees made with love. Don't miss out on our special sale of the season.
          </p>
          <div className="text-center mt-3 sm:mt-4 md:mt-6">
            <Link to="/shop" className="btn-primary px-10" aria-label="Shop the special collection with 50% off">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Subtle Divider Before Section */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-16 my-1.5 md:my-3">
        <div className="h-[1px] bg-[#C8A96B]/20" />
      </div>

      {/* Experience Store Section */}
      <section className="bg-white overflow-hidden py-2 md:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Gallery Slider with slightly reduced height and rounded corners (Image section first) */}
          <div className="relative group">
            {/* Arrows (Hidden on mobile for pure swipe-only navigation) */}
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
              <button
                onClick={() => scroll("left")}
                className="pointer-events-auto bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-md text-primary-950 hover:bg-[#C8A96B] hover:text-white transition-all transform hover:scale-105 active:scale-95"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
              <button
                onClick={() => scroll("right")}
                className="pointer-events-auto bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-md text-primary-950 hover:bg-[#C8A96B] hover:text-white transition-all transform hover:scale-105 active:scale-95"
                aria-label="Scroll Right"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Gallery Slider content */}
            <div
              ref={scrollRef}
              style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
              className="flex gap-3 md:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide no-scrollbar h-[270px] sm:h-[340px] md:h-[450px] lg:h-[480px] touch-pan-x touch-pan-y will-change-scroll"
            >
              {shopImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="flex-none w-[82%] sm:w-[500px] md:w-[600px] h-full relative overflow-hidden group/item rounded-xl md:rounded-2xl shadow-md border border-[#C8A96B]/10 cursor-zoom-in snap-center"
                  onClick={() => setSelectedShopImage(image.url)}
                >
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <OptimizedImage
                      src={image.url}
                      width={800}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-1000 ease-out"
                    />
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 pointer-events-none">
                    <Maximize2
                      size={28}
                      className="text-white drop-shadow-md"
                    />
                  </div>
                  <div className="absolute inset-0 transition-all duration-300 flex flex-col justify-end p-5 sm:p-8 z-10 pointer-events-none">
                    <div 
                      style={{ color: '#E7D3A8', fontWeight: 600, opacity: 1, visibility: 'visible', textShadow: '0px 2px 8px rgba(0,0,0,0.85), 0px 1px 3px rgba(0,0,0,0.95)' }}
                      className="text-xl sm:text-2xl font-serif mb-0 tracking-wide"
                    >
                      {image.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Premium Indicator Track */}
            <div className="flex justify-center gap-1.5 mt-2">
              {shopImages.map((_, i) => (
                <div
                  key={i}
                  className="w-8 sm:w-12 h-[2px] bg-primary-950/5 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-[#C8A96B]"
                    initial={{ translateX: "-100%" }}
                    whileInView={{ translateX: "0%" }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + i * 0.08,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Text block (Placed after the Image/Gallery with tight spacing) */}
          <div className="text-center mt-2">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold-dark)] mb-0.5 font-semibold">
              Visit Us
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light tracking-[0.06em] text-[var(--color-dark)] mb-2 leading-tight">
              Visit Our Store <span className="italic">In-Person</span>
            </h2>
            <p className="text-[13.5px] sm:text-[14px] text-[var(--color-dark)]/75 max-w-[90%] md:max-w-2xl mx-auto font-light leading-normal px-2">
              Step into the world of Mukesh Saree Centre. Visit our popular Nagpur store and discover beautiful sarees, premium designs, and timeless traditional styles since 1978.
            </p>
          </div>

          {/* Elegant Small Labels Row / Bullet list */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 mt-2 px-4 text-center text-[10px] sm:text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-dark)]/50 font-medium font-sans">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-[#C8A96B]" />
              Trusted Since 1978
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-[#C8A96B]" />
              Flagship Store • Nagpur
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-[#C8A96B]" />
              Luxury Shopping Experience
            </span>
          </div>

          {/* Premium Call to Action Button (Single button, tightly connected) */}
          <div className="flex justify-center mt-2 w-full px-4">
            <a
              href="https://share.google/NxoqmjodTDirGBDUo"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-56 inline-flex items-center justify-center text-center py-2.5 transform active:scale-95 transition-all duration-300"
            >
              Visit Our Store
            </a>
          </div>

        </div>
      </section>

      {/* Subtle Divider After Section */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-16 my-1.5 md:my-3">
        <div className="h-[1px] bg-[#C8A96B]/20" />
      </div>

      <Suspense fallback={<div className="h-40 bg-gray-50" />}>
        <CustomerReviews />
      </Suspense>

      {/* About Section (Hidden for UI, kept for Local SEO) */}
      <section className="about-section sr-only">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-gold-dark)] mb-2 font-semibold">
            Our Heritage
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light tracking-[0.06em] text-[var(--color-dark)] mb-6 md:mb-8">
            Nagpur's Most Trusted Saree Store <span className="italic">Since 1978</span>
          </h2>
          <div className="space-y-4 text-[13.5px] sm:text-[15px] font-light leading-relaxed text-[var(--color-dark)]/80 text-justify sm:text-center">
            <p>
              Founded in 1978 by the Nanakram Khemchandani family, <strong>Mukesh Saree Centre</strong> has grown into one of the largest and most trusted saree distributors in Vidarbha. For over 46 years, we have proudly shared the rich heritage of Indian ethnic wear with our customers right from our base in Nagpur, Maharashtra. We have built our reputation on unmatched quality, variety, and a deep commitment to customer trust.
            </p>
            <p>
              We bring you an exquisite collection of over 30 varieties of premium fabrics sourced directly from weavers across Surat, Varanasi, Jaipur, Bangalore, Kolkata, and Madurai. Whether you are looking for luxurious Paithani, pure silk, elegant bridal sarees for your wedding day, or comfortable cotton and linen sarees, our catalogue caters to every occasion. Our highly popular <strong>Malvika saree</strong> collection provides incredible softness and a graceful drape, beloved by our customers for both festive and office wear. We also specialize in high-quality <strong>uniform sarees</strong>, fulfilling bulk institutional orders for schools, corporate teams, and hospitality staff with durable, color-coordinated fabrics.
            </p>
            <p>
              If you are searching for the best <strong>saree shop in Nagpur</strong> to experience these traditional fabrics in person, our showroom welcomes you. For our pan-India customers, we strive to make premium ethnic fashion accessible through a flawless online shopping experience. We offer Cash on Delivery (COD) everywhere in India, fast free shipping on all orders above ₹499, secure checkouts, and a hassle-free 7-day returns policy. Embrace the legacy of the <em>Mukesh Saree</em> brand—where tradition seamlessly meets modern elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedShopImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-primary-950/95 backdrop-blur-md"
            onClick={() => setSelectedShopImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[101]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedShopImage(null);
              }}
            >
              <X size={32} strokeWidth={1.5} />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-full max-h-full shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={selectedShopImage}
                alt="Store View"
                width={1200}
                height={900}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
