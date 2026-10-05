import React, { useMemo } from "react";
import { useParams, useLocation, Navigate, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { SEO } from "../components/SEO";
import { ProductCard } from "../components/ProductCard";
import { SareeShopInNagpurArticle } from "../components/SareeShopInNagpurArticle";
import { useStore } from "../store";
import { ChevronRight } from "lucide-react";
import { BUSINESS_INFO } from "../config/business";
import { products } from "../mockData";

// Shared AI-friendly SEO Data for landing pages
const seoPagesData: Record<
  string,
  {
    title: string;
    description: string;
    h1: string;
    intro: string;
    body: React.ReactNode;
    faqs: { question: string; answer: string }[];
    relatedKeywords: string[];
    filterCategory?: string;
    customFilter?: (product: (typeof products)[0]) => boolean;
  }
> = {
  "malvika-saree": {
    title:
      `Malvika Saree - Premium Collection | ${BUSINESS_INFO.name} ${BUSINESS_INFO.address.city}`,
    description:
      `Shop authentic Malvika sarees from ${BUSINESS_INFO.name} in Gandhibagh, ${BUSINESS_INFO.address.city}. Lightweight, silky-soft, easy-drape sarees ideal for daily wear, office, and events.`,
    h1: "Malvika Saree Collection",
    intro:
      "A Malvika saree is a soft, lightweight, and easy-to-drape everyday saree known for its breathable comfort, subtle luster, and effortless maintenance. Explore our exclusive collection curated by Mukesh Saree Centre in Gandhibagh, Nagpur.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        {/* Direct Answer Box */}
        <div className="p-5 bg-[#FAF6F0] border-l-4 border-[#B5894A] rounded-r-sm mb-8 text-[#2C241B]">
          <h2 className="text-lg font-serif font-bold mb-2 mt-0 text-[#2C241B]">
            Direct Answer: What is a Malvika Saree?
          </h2>
          <p className="text-sm leading-relaxed mb-0">
            A <strong>Malvika saree</strong> is a lightweight, silky-soft daily wear drape crafted from breathable micro-blend fabrics with a smooth tissue finish. It combines the breathable comfort of fine cotton with the wrinkle-resistant drape of silk blends, making it ideal for long office hours, academic teaching, daily wear, and festive gatherings across Nagpur and India.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          About the Malvika Saree Collection at Mukesh Saree Centre
        </h2>
        <p>
          At <strong>Mukesh Saree Centre</strong> (established 1978 in Gandhibagh, Nagpur), we curate and supply authentic <strong>Malvika sarees</strong> directly from master weavers. Renowned for their feather-light weight, smooth touch, and non-creasing weave, Malvika sarees give modern women the perfect balance between timeless traditional grace and all-day ease.
        </p>
        <p>
          Unlike heavy silk sarees that require careful pinning and frequent dry cleaning, Malvika sarees fall into clean, natural pleats in under two minutes. Whether you are walking through busy workdays or hosting guests at home, the fabric maintains its crisp, fresh appearance without clinging or feeling stiff.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Who Should Buy a Malvika Saree?
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Working Professionals & Teachers:</strong> Excellent for 8 to 10-hour shifts requiring a neat, professional appearance without deep wrinkles.
          </li>
          <li>
            <strong>Homemakers & Daily Wearers:</strong> Lightweight and airy, ideal for effortless daily household management and errand runs.
          </li>
          <li>
            <strong>Festive & Family Event Attendees:</strong> Provides an elegant, subtle sheen for family get-togethers, temple visits, and festive functions without heavy zari weight.
          </li>
          <li>
            <strong>Boutique Buyers & Resellers:</strong> High-turnover category with consistent customer demand and excellent repeat order rates.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Fabric Characteristics, Styles & Use Cases
        </h2>
        <p>
          Every piece in our Malvika collection is chosen with strict attention to fiber quality, colorfastness, and border craftsmanship:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Fabric Weave:</strong> Soft micro-crepe and tissue-touch poly-blend weaves engineered for high tensile strength and air circulation.
          </li>
          <li>
            <strong>Styles & Prints:</strong> Subtle pastel florals, geometric digital prints, classic temple borders, and contrast pallus.
          </li>
          <li>
            <strong>Best Use Cases:</strong> Office workwear, school/college teaching shifts, family lunches, summer travel, and festive occasions.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Buying Guidance & Blouse Styling Tips
        </h2>
        <p>
          When selecting a Malvika saree, choose delicate prints in soothing pastels for daytime work environments, and richer jewel tones with woven zari borders for evening events.
        </p>
        <p>
          <strong>Styling Recommendation:</strong> Pair your Malvika saree with a fitted elbow-sleeve cotton-silk blouse or a solid contrast boat-neck blouse. Add minimal silver or antique brass jewelry to highlight the subtle texture of the fabric.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Care & Washing Instructions
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Washing:</strong> Gentle hand wash or mild machine cycle in cold water using neutral detergent.
          </li>
          <li>
            <strong>Drying:</strong> Line dry in shade to preserve color brightness and prevent fabric weakening.
          </li>
          <li>
            <strong>Ironing:</strong> Low-heat steam iron on reverse side if required. The fabric is naturally wrinkle-resistant.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Local Nagpur Heritage & Quality Assurance
        </h2>
        <p>
          Located at Jagnath Road, Gandhibagh, Nagpur, <strong>Mukesh Saree Centre</strong> has been a trusted landmark for ethnic textiles since 1978. Every Malvika saree sold in our store or shipped online undergoes manual quality checks for weave consistency, thread count, and border finish. We offer direct wholesale rates with transparent pricing and no middleman markup.
        </p>

        {/* WhatsApp & Contact CTA */}
        <div className="p-6 bg-[#2C241B] text-white rounded-sm my-8 border border-[#B5894A]/30">
          <h3 className="text-xl font-serif text-white mb-2 mt-0 font-medium">
            Order Malvika Sarees Online or Visit Store
          </h3>
          <p className="text-sm text-white/80 mb-4 leading-relaxed">
            Interested in viewing our latest live Malvika saree catalog or placing a bulk order? Chat directly with our Gandhibagh showroom team on WhatsApp or visit us in person.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/919325034636?text=Hi%20Mukesh%20Saree%20Centre,%20I%20am%20interested%20in%20Malvika%20sarees."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#B5894A] text-[#2C241B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#a0763d] transition-all"
            >
              Chat on WhatsApp (+91 9325034636)
            </a>
            <Link
              to="/contact/"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
            >
              Get Store Address & Directions
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Related Collections & Pages
        </h2>
        <p className="space-x-2">
          <Link to="/sarees/cotton-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Pure Cotton Sarees</Link> •{" "}
          <Link to="/sarees/linen-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Linen Sarees</Link> •{" "}
          <Link to="/uniform-saree/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Institutional Uniform Sarees</Link> •{" "}
          <Link to="/saree-shop-in-nagpur/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur Guide</Link> •{" "}
          <Link to="/mukesh-saree/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Mukesh Saree Legacy</Link> •{" "}
          <Link to="/wholesalesarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wholesale Sarees Nagpur</Link>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "What is a Malvika saree and why is it popular?",
        answer:
          "A Malvika saree is a lightweight, soft-drape saree made from micro-blend tissue fabrics. It is popular because it provides the elegance of a silk-blend saree with the breathable, wrinkle-free comfort required for daily wear and long office shifts."
      },
      {
        question: "Is the Malvika saree suitable for summer and long wear?",
        answer:
          "Yes. The micro-blend fabric offers high breathability and a light touch against the skin, making it exceptionally comfortable for summer months and 8-10 hour work shifts."
      },
      {
        question: "How should I wash and care for my Malvika saree?",
        answer:
          "Wash with gentle hand care or mild machine cycle in cold water using gentle detergent. Line dry in shade. Low-heat steam ironing on the reverse side keeps the fabric crisp."
      },
      {
        question: "Where can I buy authentic Malvika sarees in Nagpur?",
        answer:
          "You can buy authentic Malvika sarees at Mukesh Saree Centre, located at Jagnath Road, Gandhibagh, Nagpur. We offer retail and wholesale rates with direct weaver connections."
      },
      {
        question: "Does Mukesh Saree Centre offer nationwide shipping across India?",
        answer:
          "Yes! We provide fast, fully tracked shipping across India for both individual retail purchases and bulk wholesale orders."
      },
      {
        question: "Can I buy Malvika sarees in bulk for wholesale or resale?",
        answer:
          "Yes, Mukesh Saree Centre caters to boutique owners, online resellers, and corporate buyers with wholesale catalog pricing and bulk shipping options."
      }
    ],
    relatedKeywords: [
      "Malvika saree Nagpur",
      "Mukesh Saree Centre",
      "saree shop in Nagpur",
      "lightweight daily wear sarees",
      "soft tissue sarees Nagpur",
      "wholesale sarees Gandhibagh"
    ]
  },
  "mukesh-saree": {
    title:
      `Mukesh Saree - Premium Indian Ethnic Wear Since ${BUSINESS_INFO.established} | ${BUSINESS_INFO.address.city}`,
    description:
      `Discover the legacy of ${BUSINESS_INFO.name} in Gandhibagh, ${BUSINESS_INFO.address.city}. Offering authentic Paithani, Banarasi silk, cotton, linen, Malvika, and uniform sarees since ${BUSINESS_INFO.established}.`,
    h1: `Mukesh Saree - A Legacy of Elegance Since ${BUSINESS_INFO.established}`,
    intro:
      `Mukesh Saree Centre is a landmark saree and ethnic wear store established in ${BUSINESS_INFO.established} in Gandhibagh, Nagpur, Maharashtra. Renowned for authentic silk, Paithani, Banarasi, linen, cotton, uniform sarees, and bridal lehengas at direct wholesale-matched rates.`,
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        {/* Direct Answer Box */}
        <div className="p-5 bg-[#FAF6F0] border-l-4 border-[#B5894A] rounded-r-sm mb-8 text-[#2C241B]">
          <h2 className="text-lg font-serif font-bold mb-2 mt-0 text-[#2C241B]">
            Direct Answer: Who is Mukesh Saree Centre?
          </h2>
          <p className="text-sm leading-relaxed mb-0">
            <strong>Mukesh Saree Centre</strong> is a premier saree store and wholesale destination located at Jagnath Road, Gandhibagh, Nagpur (Estd. 1978). For over 45 years, we have brought authentic handloom weaves—from pure Yeola Paithani and Banarasi silk to everyday cotton, Malvika sarees, and institutional uniform sarees—directly from weaver clusters to families and retailers across Central India.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Our Heritage & Direct Weaver Relationships
        </h2>
        <p>
          Founded in 1978 in the historic textile quarter of Gandhibagh, Nagpur, <strong>Mukesh Saree Centre</strong> was built on a simple promise: delivering authentic Indian textiles with uncompromised quality and fair pricing. Over four decades, we have established direct partnerships with master handloom weavers in Yeola, Varanasi, Kanchipuram, Surat, and Chanderi.
        </p>
        <p>
          By removing intermediaries, we ensure that every customer—whether shopping for a once-in-a-lifetime bridal Paithani or ordering 200 uniform sarees for a hospital—receives verified craftsmanship at direct wholesale rates.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Who Should Shop at Mukesh Saree Centre?
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Brides & Wedding Families:</strong> Seeking certified pure silk Paithani sarees, Banarasi brocades, and heavy bridal lehengas for wedding pheras and receptions.
          </li>
          <li>
            <strong>Working Women & Everyday Shoppers:</strong> Looking for breathable cottons, linen sarees, Kota Doria, and soft Malvika sarees for comfortable daily elegance.
          </li>
          <li>
            <strong>Boutique Owners & Resellers:</strong> Sourcing high-margin wholesale catalogs with bulk pricing, low minimum order quantities, and tracked delivery.
          </li>
          <li>
            <strong>Schools, Hospitals & Corporate Procurement:</strong> Sourcing high-durability, color-matched institutional uniform sarees in bulk.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Our Signature Product Categories
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Pure Silk & Paithani:</strong> Hand-woven Maharashtrian Paithani sarees featuring pure silk body, gold zari borders, and peacock/muniya motifs.
          </li>
          <li>
            <strong>Banarasi & Kanjivaram:</strong> Rich wedding silks with intricate zari brocade, kadwa weaving, and timeless regal allure.
          </li>
          <li>
            <strong>Malvika & Daily Wear:</strong> Micro-blend soft sarees engineered for non-crease daily office and home wear.
          </li>
          <li>
            <strong>Uniform Sarees:</strong> High-durability crepe and poly-cotton sarees for corporate staff, schools, and healthcare institutions.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Buying Guidance & In-Store Experience
        </h2>
        <p>
          Our Gandhibagh showroom in Nagpur offers a spacious, hospitable environment where experienced saree consultants guide you through fabric feel, drape weight, and color harmonizing.
        </p>
        <p>
          For outstation customers across India and abroad, we offer <strong>Live WhatsApp Video Shopping</strong>. You can view saree drapes, inspect zari work under natural light, and receive direct home delivery.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Care & Preservation Protocol for Fine Sarees
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Pure Silk & Paithani:</strong> Dry clean only. Store wrapped in unbleached white cotton or muslin fabric. Avoid plastic covers or cardboard boxes.
          </li>
          <li>
            <strong>Rest & Rotation:</strong> Refold fine silk sarees every 3 months along different lines to avoid permanent creasing at zari edges.
          </li>
          <li>
            <strong>Cotton & Linen:</strong> Gentle hand wash in cold water. Use mild liquid detergent and dry in shaded outdoor areas.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Local Nagpur Trust Signal
        </h2>
        <p>
          Located in the heart of Gandhibagh, Nagpur, <strong>Mukesh Saree Centre</strong> has served three generations of families across Vidarbha and Maharashtra. We stand behind every saree with a 100% authenticity guarantee and honest pricing.
        </p>

        {/* WhatsApp & Contact CTA */}
        <div className="p-6 bg-[#2C241B] text-white rounded-sm my-8 border border-[#B5894A]/30">
          <h3 className="text-xl font-serif text-white mb-2 mt-0 font-medium">
            Visit Mukesh Saree Centre or Order Online
          </h3>
          <p className="text-sm text-white/80 mb-4 leading-relaxed">
            Experience four decades of textile excellence. Visit our Gandhibagh, Nagpur store or connect on WhatsApp for live video calls and latest catalog access.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/919325034636?text=Hi%20Mukesh%20Saree%20Centre,%20I%20would%20like%20to%20see%20your%20saree%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#B5894A] text-[#2C241B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#a0763d] transition-all"
            >
              WhatsApp Us (+91 9325034636)
            </a>
            <Link
              to="/contact/"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
            >
              Visit Showroom in Nagpur
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Our Saree Collections
        </h2>
        <p className="space-x-2">
          <Link to="/saree-shop-in-nagpur/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur Guide</Link> •{" "}
          <Link to="/sarees/paithani-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Pure Paithani Sarees</Link> •{" "}
          <Link to="/sarees/banarasi-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Banarasi Silk Sarees</Link> •{" "}
          <Link to="/malvika-saree/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Malvika Saree Collection</Link> •{" "}
          <Link to="/uniform-saree/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Institutional Uniform Sarees</Link> •{" "}
          <Link to="/wholesalesarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wholesale Sarees Nagpur</Link>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Where is Mukesh Saree Centre located in Nagpur?",
        answer:
          "Mukesh Saree Centre is located at Jagnath Road, Gandhibagh, Itwari, Nagpur, Maharashtra, 440002. We are situated in Nagpur's main wholesale and retail textile market."
      },
      {
        question: "Is Mukesh Saree Centre a retail or wholesale saree shop?",
        answer:
          "We function as both a leading saree wholesaler for boutique owners and resellers, and a retail store offering wholesale-matched prices to individual buyers and families."
      },
      {
        question: "What types of sarees does Mukesh Saree Centre sell?",
        answer:
          "We offer pure silk Paithani, Banarasi zari, Kanjivaram, pure cotton, linen, Kota Doria, Malvika daily-wear sarees, institutional uniform sarees, and bridal lehengas."
      },
      {
        question: "Do you offer video shopping for customers outside Nagpur?",
        answer:
          "Yes! We offer live video call shopping via WhatsApp (+91 9325034636). Our team shows fabrics, colors, and drapes in real-time with full home delivery."
      },
      {
        question: "Are all silk sarees at Mukesh Saree Centre authentic?",
        answer:
          "Yes, all our silk sarees are sourced directly from handloom weaving centers with genuine fabric authenticity guarantees."
      },
      {
        question: "How can I place a bulk or wholesale order?",
        answer:
          "You can place wholesale orders directly at our Gandhibagh store or by connecting with our bulk sales desk on WhatsApp (+91 9325034636)."
      }
    ],
    relatedKeywords: [
      "Mukesh Saree Centre Nagpur",
      "saree shop in Gandhibagh Nagpur",
      "best saree store Nagpur",
      "saree wholesaler Nagpur",
      "Paithani saree shop Nagpur",
      "bridal sarees Gandhibagh"
    ]
  },
  "uniform-saree": {
    title:
      `Uniform Saree Collection | Corporate, School & Staff Sarees | ${BUSINESS_INFO.address.city}`,
    description:
      `Shop durable, color-matched uniform sarees for schools, hospitals, corporate offices, and hospitality staff at ${BUSINESS_INFO.name}, Nagpur. Bulk wholesale rates available.`,
    h1: "Uniform Sarees for Schools, Hospitals & Corporate Staff",
    intro:
      `Uniform sarees are durable, color-consistent, and easy-care sarees specifically manufactured for institutional, corporate, school, hospital, and hospitality staff uniforms. Explore Central India's leading bulk uniform saree supplier in Gandhibagh, Nagpur.`,
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        {/* Direct Answer Box */}
        <div className="p-5 bg-[#FAF6F0] border-l-4 border-[#B5894A] rounded-r-sm mb-8 text-[#2C241B]">
          <h2 className="text-lg font-serif font-bold mb-2 mt-0 text-[#2C241B]">
            Direct Answer: What is a Uniform Saree?
          </h2>
          <p className="text-sm leading-relaxed mb-0">
            A <strong>uniform saree</strong> is a specialized, highly durable saree engineered for institutional and professional staff. Manufactured with color-fast dyes, wrinkle-resistant crepe and poly-cotton fabrics, and uniform dye-lot consistency, these sarees ensure that teams—from school teachers to hospital staff and corporate front desks—present a cohesive, polished appearance every single day.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Institutional Uniform Saree Solutions by Mukesh Saree Centre
        </h2>
        <p>
          At <strong>Mukesh Saree Centre</strong> (Gandhibagh, Nagpur), we specialize in manufacturing and supplying bulk <strong>uniform sarees</strong> for schools, colleges, healthcare facilities, hotel chains, and corporate organizations across Maharashtra and Central India.
        </p>
        <p>
          A great uniform saree must balance three vital elements: professional aesthetics, long-lasting durability, and wearer comfort during extended work shifts. We supply institutional fabrics that withstand daily wear, repeated machine washing, and active mobility without fading or losing shape.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Who Should Buy Uniform Sarees? (Sectors & Applications)
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Educational Institutions (Schools & Colleges):</strong> Graceful, dignified uniform sarees for school teachers and female faculty members in cohesive pastel, navy, maroon, or green border motifs.
          </li>
          <li>
            <strong>Hospitals & Healthcare Facilities:</strong> Easy-to-clean, hygienic uniform sarees for nursing staff, ward supervisors, and administrative personnel.
          </li>
          <li>
            <strong>Corporate Offices & Front Desks:</strong> Sleek crepe and georgette uniform sarees for receptionists, guest relations managers, and corporate staff.
          </li>
          <li>
            <strong>Hotels, Resorts & Hospitality:</strong> Elegant uniform drapes tailored to match brand color palettes for banquet hosts, front-of-house staff, and airline/travel counters.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Fabric Options & Quality Specifications
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Poly-Crepe & Georgette:</strong> Lightweight, smooth texture, zero ironing needed, highly fluid drape.
          </li>
          <li>
            <strong>Poly-Cotton & Art Silk Blends:</strong> Structured weave for formal academic and government environments.
          </li>
          <li>
            <strong>Dye-Lot Consistency:</strong> Guaranteed 100% color matching across initial orders and future batch re-orders for new team hires.
          </li>
          <li>
            <strong>Colorfastness:</strong> High-grade industrial dyes that retain vibrancy through repeated home or commercial washing.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Buying Guidance for Bulk Institutional Orders
        </h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Select Fabric & Pattern:</strong> Browse our uniform catalog or request physical sample swatches sent directly to your institution.
          </li>
          <li>
            <strong>Confirm Dye-Lot & Quantity:</strong> Order with a 5-10% extra buffer to account for staff additions during the academic or financial year.
          </li>
          <li>
            <strong>Approve Sample Saree:</strong> Inspect border alignment, texture, and color before mass dispatch.
          </li>
          <li>
            <strong>Dispatch & Delivery:</strong> Fast batch packing and tracked delivery across Nagpur and all Indian states.
          </li>
        </ol>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Care & Maintenance Protocol for Uniform Sarees
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Washing:</strong> Machine wash on regular gentle cycle with mild detergent in cold water.
          </li>
          <li>
            <strong>Drying:</strong> Air dry indoors or in shade; dries rapidly within 30–45 minutes.
          </li>
          <li>
            <strong>Ironing:</strong> Minimal or zero ironing required due to crease-resistant poly-crepe properties.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Trusted Uniform Saree Wholesaler in Nagpur Since 1978
        </h2>
        <p>
          Located at Jagnath Road, Gandhibagh, Nagpur, <strong>Mukesh Saree Centre</strong> has supplied bulk uniform sarees to over 500+ institutions across Central India. We offer factory-direct bulk rates, sample dispatch services, and reliable fulfillment.
        </p>

        {/* WhatsApp & Contact CTA */}
        <div className="p-6 bg-[#2C241B] text-white rounded-sm my-8 border border-[#B5894A]/30">
          <h3 className="text-xl font-serif text-white mb-2 mt-0 font-medium">
            Request Bulk Uniform Saree Swatches & Wholesale Quotes
          </h3>
          <p className="text-sm text-white/80 mb-4 leading-relaxed">
            Planning uniform sarees for your school, hospital, hotel, or corporate team? Contact our wholesale procurement team on WhatsApp for swatches and institutional pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/919325034636?text=Hi%20Mukesh%20Saree%20Centre,%20I%20need%20a%20quote%20for%20bulk%20uniform%20sarees."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#B5894A] text-[#2C241B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#a0763d] transition-all"
            >
              Get Wholesale Quote (+91 9325034636)
            </a>
            <Link
              to="/contact/"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
            >
              Visit Store in Gandhibagh Nagpur
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Related Uniform & Saree Pages
        </h2>
        <p className="space-x-2">
          <Link to="/teacher-uniform-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Teacher Uniform Sarees</Link> •{" "}
          <Link to="/school-uniform-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">School Uniform Sarees</Link> •{" "}
          <Link to="/hospital-uniform-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Hospital Uniform Sarees</Link> •{" "}
          <Link to="/corporate-uniform-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Corporate Uniform Sarees</Link> •{" "}
          <Link to="/saree-shop-in-nagpur/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Saree Shop in Nagpur Guide</Link> •{" "}
          <Link to="/malvika-saree/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Malvika Sarees</Link> •{" "}
          <Link to="/wholesalesarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wholesale Sarees Nagpur</Link>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Does Mukesh Saree Centre supply uniform sarees in bulk?",
        answer:
          "Yes. We are a major bulk uniform saree supplier in Central India, providing uniform sarees for schools, colleges, hospitals, hotels, and corporate offices."
      },
      {
        question: "What is the minimum order quantity (MOQ) for uniform sarees?",
        answer:
          "We accommodate orders ranging from small staff groups (10-20 sarees) up to large institutional batches of 500+ sarees with consistent color matching."
      },
      {
        question: "Can you guarantee exact color matching for future re-orders?",
        answer:
          "Yes. We maintain strict dye-lot records for all corporate and school clients so that new staff additions receive perfectly matched uniform sarees."
      },
      {
        question: "Which fabric is recommended for daily teacher or staff uniform sarees?",
        answer:
          "Poly-crepe and poly-cotton blends are best because they offer wrinkle resistance, high durability, fast drying, and comfort during long shifts."
      },
      {
        question: "Can we get sample swatches before placing a bulk uniform order?",
        answer:
          "Yes! We dispatch fabric sample swatches across India so institutional decision-makers can inspect quality and color before finalizing orders."
      },
      {
        question: "Where is Mukesh Saree Centre located for in-person uniform selection?",
        answer:
          "We are located at Jagnath Road, Gandhibagh, Itwari, Nagpur, Maharashtra, 440002. You can inspect physical sample sets in our wholesale division."
      }
    ],
    relatedKeywords: [
      "uniform saree Nagpur",
      "bulk uniform sarees",
      "teacher uniform sarees",
      "hospital uniform sarees",
      "corporate uniform sarees",
      "uniform saree wholesaler Gandhibagh"
    ]
  },
  "saree-shop-in-nagpur": {
    title: "Best Saree Shop in Nagpur | Saree Wholesaler Nagpur - Mukesh Saree Centre",
    description: "Looking for the best saree shop in Nagpur or a trusted saree wholesaler in Nagpur? Read our ultimate 6,000-word guide on Paithani, Banarasi, Cotton, Malvika, and Uniform sarees on Jagnath Road, Itwari.",
    h1: "Best Saree Shop in Nagpur",
    intro: "The ultimate 6,000-word definitive guide to buying, sourcing, and styling the finest sarees in Nagpur. Written by generational textile experts at Mukesh Saree Centre.",
    filterCategory: "sarees",
    body: <SareeShopInNagpurArticle />,
    faqs: [
      {
        question: "Where is the best saree shop in Nagpur located?",
        answer: "Mukesh Saree Centre is located at Jagnath Road, Gandhibagh, Itwari, Nagpur, Maharashtra, 440002. Situated in Nagpur's historical textile market, we serve retail families and wholesale buyers across Central India."
      },
      {
        question: "Does Mukesh Saree Centre sell Malvika sarees and uniform sarees?",
        answer: "Yes! We stock an exclusive collection of lightweight, soft-drape Malvika sarees for daily and office wear, as well as institutional uniform sarees for schools, hospitals, corporate teams, and hotel staff."
      },
      {
        question: "Is Mukesh Saree Centre a retail store or a wholesale saree shop?",
        answer: "We function as both! We are a primary Saree Wholesaler in Nagpur supplying resellers and boutiques, while offering individual shoppers wholesale-matched pricing with zero middleman markup."
      },
      {
        question: "Do you supply uniform sarees in bulk with custom dye-lots?",
        answer: "Yes, we cater to bulk uniform saree requirements for schools, healthcare institutions, and corporate front desks with guaranteed color consistency and sample swatch dispatch."
      },
      {
        question: "Can I order sarees online or schedule a WhatsApp video call?",
        answer: "Yes, we offer live WhatsApp video shopping (+91 9325034636) so customers across India can view fabrics, drapes, and colors with fast home delivery."
      }
    ],
    relatedKeywords: [
      "Best Saree Shop in Nagpur",
      "Saree Wholesaler Nagpur",
      "Wholesale Saree Shop Nagpur",
      "Best Saree Store Nagpur",
      "Saree Shop Near Me",
      "Wholesale Sarees Nagpur",
      "Cotton Saree Shop Nagpur",
      "Designer Saree Shop Nagpur",
      "Wedding Sarees Nagpur",
      "Bridal Sarees Nagpur",
      "Uniform Sarees Nagpur",
      "Malvika Saree Nagpur"
    ]
  },
  "saree-wholesaler-nagpur": {
    title: "Saree Wholesaler Nagpur | Best Saree Shop in Nagpur - Mukesh Saree Centre",
    description: "Sourcing premium sarees in bulk? Mukesh Saree Centre is the leading Saree Wholesaler in Nagpur, offering Paithani, cotton, and uniform sarees on Jagnath Road, Itwari.",
    h1: "Saree Wholesaler Nagpur",
    intro: "The premier bulk sourcing destination for boutiques, retailers, and online resellers in Central India. Explore Nagpur's best-priced wholesale collection.",
    filterCategory: "sarees",
    body: <SareeShopInNagpurArticle />,
    faqs: [
      {
        question: "Why should I buy bulk sarees from a Saree Wholesaler Nagpur like Mukesh Saree Centre?",
        answer: "Buying directly from us bypasses mid-tier distributors, allowing you to access near-factory prices and maximize your profit margins while ensuring top-tier weave quality."
      },
      {
        question: "What is your minimum order quantity for wholesale buyers?",
        answer: "We offer highly flexible, low MOQs specifically designed to help home-based resellers and boutique owners launch and scale their businesses without high capital risk."
      }
    ],
    relatedKeywords: [
      "Saree Wholesaler Nagpur",
      "Best Saree Shop in Nagpur",
      "Wholesale Saree Shop Nagpur",
      "Wholesale Sarees Nagpur"
    ]
  },
  "wholesale-saree-shop-nagpur": {
    title: "Wholesale Saree Shop Nagpur | Direct Factory Prices | Mukesh Saree Centre",
    description: "Visit our wholesale saree shop in Nagpur for unbeatable rates on bulk wedding sarees, cotton drapes, and high-quality staff uniforms on Jagnath Road, Itwari.",
    h1: "Wholesale Saree Shop Nagpur",
    intro: "Access direct-from-weaver wholesale prices on traditional Maharashtrian silks, soft summer cottons, and custom uniform solutions.",
    filterCategory: "sarees",
    body: <SareeShopInNagpurArticle />,
    faqs: [
      {
        question: "Are your sarees sourced directly from weavers?",
        answer: "Yes, we maintain direct relationships with traditional weaving circles and handloom clusters across Banaras, Yeola, Surat, and Kanchipuram to guarantee genuine quality."
      },
      {
        question: "Do you offer digital catalogs for remote ordering?",
        answer: "Yes, we provide full digital catalogs via WhatsApp and provide seamless national shipping with tracking."
      }
    ],
    relatedKeywords: [
      "Wholesale Saree Shop Nagpur",
      "Saree Wholesaler Nagpur",
      "Best Saree Shop in Nagpur",
      "Wholesale Sarees Nagpur"
    ]
  },
  "bridal-sarees-nagpur": {
    title:
      `Bridal Sarees in ${BUSINESS_INFO.address.city} | Wedding Lehengas | ${BUSINESS_INFO.name}`,
    description:
      `Find exquisite bridal sarees in ${BUSINESS_INFO.address.city} at ${BUSINESS_INFO.name}. Shop designer wedding sarees, lehengas, and rich silks for your special day.`,
    h1: `Exquisite Bridal Sarees in ${BUSINESS_INFO.address.city}`,
    intro:
      `Your wedding day deserves the finest attire. ${BUSINESS_INFO.name} offers an exclusive collection of bridal sarees and lehengas to make your special moments unforgettable.`,
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Searching for the perfect{" "}
          <strong>bridal sarees in {BUSINESS_INFO.address.city}</strong>? Look
          no further. At {BUSINESS_INFO.name}, we curate luxurious bridal
          collections featuring heavy embroidery, zardosi work, and imported
          fabrics.
        </p>
        <p>
          From vibrant red and gold Banarasi silks to contemporary designer{" "}
          <em>wedding sarees in {BUSINESS_INFO.address.city}</em>, our bridal
          wear ensures you look breathtaking on your big day. We also offer
          elegant lehengas for sangeet and reception ceremonies.
        </p>
      </div>
    ),
    faqs: [
      {
        question: `Does ${BUSINESS_INFO.name} sell bridal sarees?`,
        answer:
          "Yes, we have an extensive and exclusive collection of premium bridal sarees and designer lehengas perfect for weddings.",
      },
      {
        question: "Which saree is best for weddings?",
        answer:
          "Rich silk sarees like Kanjivaram, Banarasi, and Paithani are traditional favorites. Designer georgette and net sarees with heavy embroidery are also very popular for modern weddings.",
      },
    ],
    relatedKeywords: [
      `wedding sarees in ${BUSINESS_INFO.address.city}`,
      `lehengas in ${BUSINESS_INFO.address.city}`,
      "bridal lehengas",
    ],
  },
  "wedding-sarees": {
    title: "Wedding Sarees Collection | Buy Authentic Bridal Wear Online",
    description:
      `Shop stunning wedding sarees at ${BUSINESS_INFO.name}. Explore rich silks, heavy embroidery, and authentic Indian traditional bridal wear.`,
    h1: "Premium Wedding Sarees",
    intro:
      "Celebrate life's biggest milestones with our exquisite collection of wedding sarees. Rich textures, vibrant hues, and masterful craftsmanship.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          A wedding signifies a new beginning, and{" "}
          <strong>wedding sarees</strong> are an integral part of this beautiful
          journey. At {BUSINESS_INFO.name}, our hand-picked wedding collection
          celebrates pure Indian tradition.
        </p>
        <p>
          Discover everything from classic reds and maroons to contemporary
          pastels. We provide detailed guidance to help brides and their
          families select the perfect <em>traditional Indian sarees</em> for
          every wedding function.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "How do I choose the right saree for a wedding or festival?",
        answer:
          "For weddings, look for rich fabrics like Silk or Banarasi with zari work. Choose colors that complement your skin tone and match the time of the event (bright colors for day, deep tones or metallics for night).",
      },
      {
        question: "Can I buy wedding sarees online?",
        answer:
          "Yes, you can confidently purchase premium wedding sarees online through our secure website with fast pan-India delivery.",
      },
    ],
    relatedKeywords: [
      "traditional Indian sarees",
      "festive sarees",
      BUSINESS_INFO.name,
    ],
  },
  "paithani-sarees": {
    title:
      `Authentic Paithani Sarees in ${BUSINESS_INFO.address.city} | ${BUSINESS_INFO.name}`,
    description:
      `Shop genuine, hand-woven Paithani sarees at ${BUSINESS_INFO.name} in ${BUSINESS_INFO.address.city}. The pride of Maharashtra, available in rich colors and pure silk.`,
    h1: "Authentic Paithani Sarees",
    intro:
      'The Paithani saree is a legacy of royalty. Known as the "Queen of Silks", these sarees are an essential part of Maharashtrian culture and heritage.',
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          If you are looking for pure, authentic{" "}
          <strong>Paithani sarees in {BUSINESS_INFO.address.city}</strong>,{" "}
          {BUSINESS_INFO.name} is your ultimate destination. We stock an
          impressive range of Yeola Paithani and traditional motifs like
          peacocks (morpankh) and lotuses.
        </p>
        <p>
          Woven from the finest silk, our Paithani sarees feature intricate zari
          pallus that add a touch of regal elegance, making them perfect for
          weddings and festive occasions.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "What makes Paithani sarees special?",
        answer:
          "Paithani sarees are meticulously handwoven using pure silk and real gold or silver zari. The unique sloping border and intricate motif work on the pallu set them apart from all other silks.",
      },
      {
        question:
          `Where can I find real Paithani sarees in ${BUSINESS_INFO.address.city}?`,
        answer:
          `${BUSINESS_INFO.name} in ${BUSINESS_INFO.address.city} houses a verified, authentic collection of premium Paithani sarees.`,
      },
    ],
    relatedKeywords: [
      `silk sarees ${BUSINESS_INFO.address.city}`,
      "traditional Indian sarees",
      `wedding sarees in ${BUSINESS_INFO.address.city}`,
    ],
  },
  "ethnic-wear-nagpur": {
    title:
      `Premium Ethnic Wear in ${BUSINESS_INFO.address.city} | Sarees, Suits & Lehengas`,
    description:
      `Explore the finest ethnic wear in ${BUSINESS_INFO.address.city} at ${BUSINESS_INFO.name}. From daily wear kurtis and suits to heavy designer lehengas and sarees.`,
    h1: `The Finest Ethnic Wear in ${BUSINESS_INFO.address.city}`,
    intro:
      "From subtle daily wear to spectacular festive ensembles, our ethnic wear collection covers every aspect of traditional Indian clothing.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          As a comprehensive hub for{" "}
          <strong>ethnic wear in {BUSINESS_INFO.address.city}</strong>,{" "}
          {BUSINESS_INFO.name} offers far more than just sarees. We house an
          extensive range of dress materials, salwar suits, kurtis, and designer
          lehengas.
        </p>
        <p>
          Our mission is to provide <em>traditional Indian wear</em> that merges
          perfectly with contemporary tastes. Whether you need an elegant suit
          for an office party or a grand lehenga for a reception, our collection
          delivers unmatched quality since {BUSINESS_INFO.established}.
        </p>
      </div>
    ),
    faqs: [
      {
        question:
          `Apart from sarees, what ethnic wear does ${BUSINESS_INFO.name} sell?`,
        answer:
          "We sell a wide variety of ethnic wear including semi-stitched salwar suits, dress materials, kurtis, crop tops, and bridal lehengas.",
      },
      {
        question: `Can I buy lehengas in ${BUSINESS_INFO.address.city} here?`,
        answer:
          `Yes, we have a vast array of lehengas in ${BUSINESS_INFO.address.city} suitable for weddings, sangeets, and festivals.`,
      },
    ],
    relatedKeywords: [
      `lehengas in ${BUSINESS_INFO.address.city}`,
      "Mukesh Saree",
      "designer sarees",
    ],
  },
  "saree-buying-guide": {
    title:
      `Ultimate Saree Buying Guide | Tips & Advice | ${BUSINESS_INFO.name}`,
    description:
      `Expert tips on how to buy the right saree for body type, occasion, and budget. Comprehensive saree buying guide by ${BUSINESS_INFO.name}.`,
    h1: "The Ultimate Saree Buying Guide",
    intro:
      `Choosing the right saree can be overwhelming. As experts since ${BUSINESS_INFO.established}, we have created this guide to help you find the perfect drape for your lifestyle and body type.`,
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Our <strong>saree buying guide</strong> is designed to simplify your
          shopping experience. Consider these three main factors when buying a
          saree: Occasion, Fabric, and Color.
        </p>
        <h3 className="text-xl font-serif text-[var(--color-dark)] mt-6 mb-2">
          1. Occasion matters
        </h3>
        <p>
          For weddings, opt for heavy silks or embroidered georgettes. For daily
          wear or office use, our <em>Malvika saree</em> or pure cotton sarees
          are the most breathable and comfortable choices.
        </p>
        <h3 className="text-xl font-serif text-[var(--color-dark)] mt-6 mb-2">
          2. Choosing the Fabric
        </h3>
        <p>
          Understanding fabrics is crucial. Silk provides grandeur, georgette
          offers a slimming drape, and cotton ensures coolness in summer.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Which saree fabric makes you look slim?",
        answer:
          "Lightweight and flowy fabrics like georgette, chiffon, and crepe drape naturally around the body, giving a slimming and elegant silhouette.",
      },
      {
        question: "How do I know the quality of a silk saree?",
        answer:
          "Authentic silk feels soft and warm to the touch. Look for the Silk Mark certification and check the luster, which should change slightly under different lighting.",
      },
    ],
    relatedKeywords: [
      "sarees online India",
      "Malvika saree",
      "traditional Indian sarees",
    ],
  },
  "saree-care-guide": {
    title: `Saree Care & Maintenance Guide | ${BUSINESS_INFO.name}`,
    description:
      `Learn how to wash, store, and maintain your precious silk and cotton sarees. Expert saree care tips from ${BUSINESS_INFO.name}.`,
    h1: "Saree Care & Maintenance Guide",
    intro:
      "A premium saree is an investment that can be passed down through generations. Learn the best practices for washing, folding, and storing your sarees to preserve their beauty.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Proper <strong>saree care</strong> ensures the longevity of the fabric
          and the brilliance of the colors. Heavy wedding sarees and{" "}
          <em>uniform sarees</em> require different maintenance approaches.
        </p>
        <h3 className="text-xl font-serif text-[var(--color-dark)] mt-6 mb-2">
          Washing Silk and Zari
        </h3>
        <p>
          Never machine-wash heavy silks or sarees with embroidery. Always dry
          clean them. If water drops fall on a silk saree, wipe them immediately
          with a dry cloth.
        </p>
        <h3 className="text-xl font-serif text-[var(--color-dark)] mt-6 mb-2">
          Storage Tips
        </h3>
        <p>
          Store your sarees in a cool, dry place wrapped in a muslin cloth to
          allow the fabric to breathe while preventing zari from oxidizing.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Can I wash a Malvika saree at home?",
        answer:
          "Most Malvika sarees can be gently hand-washed using a mild detergent, but always check the specific care instructions on the label.",
      },
      {
        question: "How to store heavy bridal sarees?",
        answer:
          "Wrap them individually in unbleached cotton or muslin cloths. Refold them every few months to prevent permanent creasing and fabric tearing at the folds.",
      },
    ],
    relatedKeywords: [
      BUSINESS_INFO.name,
      "Saree buying guide",
      `silk sarees ${BUSINESS_INFO.address.city}`,
    ],
  },
  "corporate-uniform-sarees": {
    title: `Corporate Uniform Sarees for Front Desk & Staff | ${BUSINESS_INFO.name}`,
    description: `Premium corporate uniform sarees for front-desk executives, hospitality staff, corporate events & banks. Crisp wrinkle-free crepe & georgette at wholesale rates.`,
    h1: "Corporate Uniform Sarees",
    intro:
      "Project a cohesive, sophisticated corporate image with bespoke uniform sarees from Mukesh Saree Centre. Crafted from premium wrinkle-free crepe and georgette blends for executive teams, banks, and hospitality leaders.",
    filterCategory: "sarees",
    customFilter: (p) => {
      const f = ((p.fabric || '') + " " + p.name + " " + (p.description || '')).toLowerCase();
      return f.includes("crepe") || f.includes("silk") || f.includes("georgette") || f.includes("linen") || f.includes("corporate");
    },
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <div className="bg-[#FAF6F0] p-6 rounded-md border border-[#E8DFD1] mb-8">
          <h2 className="text-xl font-serif text-[var(--color-dark)] mt-0 mb-3 font-semibold">
            Corporate Saree Standards: What Makes Professional Office Drapes
          </h2>
          <p className="text-[15px] leading-relaxed mb-0">
            Corporate uniform sarees must achieve three non-negotiable standards: <strong>impeccable wrinkle recovery</strong> during 9-hour desk shifts, <strong>subtle modern aesthetics</strong> that complement corporate branding, and <strong>low-maintenance durability</strong> for frequent wearing. At <strong>{BUSINESS_INFO.name}</strong>, our corporate collection is designed for reception executives, flight hospitality, banking staff, and boardroom teams who need to look dignified and composed all day.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Wrinkle-Free Crepe & Georgette Engineered for Active Workdays
        </h2>
        <p>
          Standard cottons crush within hours of commute or desk seating. For corporate environments, <strong>{BUSINESS_INFO.name}</strong> prioritizes high-twist poly-crepe, premium moss crepe, and matte georgette micro-blends. These textiles boast superior tensile resilience—falling into neat, sharp pleats that stay in place without multiple safety pins. Whether your staff travels by air, drives long commutes, or hosts corporate seminars, our drapes maintain a razor-crisp silhouette from morning check-in to evening wrap-up.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Boardroom Color Palettes & Contemporary Geometric Accents
        </h2>
        <p>
          Corporate elegance demands understated authority. We curate uniform palettes including executive slate grey, deep navy, rich wine, muted bottle green, charcoal, and warm corporate beige. Embellishments are deliberately restrained—featuring clean geometric woven borders, fine metallic zari selvedges, or dual-tone contrast piping that look sharp on camera, in video conferences, and across luxury hotel reception lobbies.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Corporate Procurement, Pantone Matching & GST Invoicing
        </h2>
        <p>
          We simplify B2B procurement for HR directors, administrative heads, and facility managers across India:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Pantone & Brand Alignment:</strong> Custom border weaving and fabric dyeing to match your company logo and brand book standards.</li>
          <li><strong>Compliant GST Billing:</strong> Full tax invoices for corporate input credit and transparent corporate auditing.</li>
          <li><strong>Sample Approval Kits:</strong> Pre-production physical swatch books and complete drape samples dispatched directly to your office.</li>
          <li><strong>Guaranteed Reorder Consistency:</strong> Archived mill dye-lot recipes ensure replacement sarees for new employee onboarding match existing team attire 100%.</li>
        </ul>
      </div>
    ),
    faqs: [
      {
        question: "Can you match corporate brand guidelines and Pantone colors?",
        answer:
          "Yes, we collaborate directly with corporate procurement and HR teams to match exact brand colors, contrast border specifications, and custom logos for batches of 15 sarees or more.",
      },
      {
        question: "Do you provide itemized GST invoices for corporate orders?",
        answer:
          "Yes, all corporate B2B orders include formal GST invoices with your company name and GSTIN, enabling full input tax credit eligibility.",
      },
      {
        question: "How do corporate uniform sarees perform during travel and long shifts?",
        answer:
          "Our poly-crepe and matte georgette blends are wrinkle-resistant and lightweight, retaining clean pleats during flights, metro commutes, and 9-hour desk shifts without requiring daily ironing.",
      },
      {
        question: "Can our management team evaluate fabric samples before ordering?",
        answer:
          "Yes, we dispatch fabric swatch cards and finished sample sarees via courier to corporate offices for HR, admin, and management review.",
      },
      {
        question: "What is the turnaround time and reorder policy for new hires?",
        answer:
          "Ready-to-ship stock dispatches in 24 to 48 hours; custom weaves take 7 to 14 days. We store exact mill dye recipes so new employee uniforms match existing staff seamlessly.",
      },
    ],
    relatedKeywords: [
      "corporate uniform sarees",
      "office wear sarees",
      "hospitality uniform sarees",
      "bank uniform sarees nagpur",
      "wrinkle free sarees",
      "front desk uniform sarees",
    ],
  },
  "school-uniform-sarees": {
    title: `School Uniform Sarees in Bulk & Wholesale | Mukesh Saree Centre Nagpur`,
    description: `Supplying durable, breathable school uniform sarees for teachers, administrative staff, and school faculty. Direct weaver pricing, bulk discounts & custom color matching.`,
    h1: "School Uniform Sarees",
    intro:
      "Outfit your school faculty and administrative staff in cohesive, dignified, and exceptionally comfortable school uniform sarees from Mukesh Saree Centre, Nagpur. Sourced directly from premier textile hubs since 1978.",
    filterCategory: "sarees",
    customFilter: (p) => {
      const f = ((p.fabric || '') + " " + p.name + " " + (p.description || '')).toLowerCase();
      return f.includes("cotton") || f.includes("linen") || f.includes("khadi") || f.includes("crepe") || f.includes("daily");
    },
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <div className="bg-[#FAF6F0] p-6 rounded-md border border-[#E8DFD1] mb-8">
          <h2 className="text-xl font-serif text-[var(--color-dark)] mt-0 mb-3 font-semibold">
            Institutional Dress Codes: Balancing Academic Authority with Active Comfort
          </h2>
          <p className="text-[15px] leading-relaxed mb-0">
            A school uniform saree must project educator dignity while withstanding the physical demands of dynamic campus life. From morning assemblies and continuous classroom lectures to laboratory supervision and playground duties, teachers need sarees that remain <strong>breathable in tropical heat</strong>, <strong>free from heavy daily starching</strong>, and <strong>uniform in exact shade across the entire faculty</strong>.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Fabric Selection: Poly-Cotton, Soft Khadi & Non-Creasing Crepe
        </h2>
        <p>
          At <strong>{BUSINESS_INFO.name}</strong>, our school uniform range is constructed using high-density poly-cotton weaves, pre-washed linen blends, and easy-drape poly-crepe. These fabrics offer high airflow for warm classroom months while resisting static cling. Unlike pure starched cottons that wrinkle and stiffen, our chosen blends wash out easily, dry quickly indoors, and maintain gentle, natural pleating through 8+ hour school days.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Dye-Lot Consistency for Whole Faculty Uniformity
        </h2>
        <p>
          Nothing compromises institutional aesthetics like mismatched shades among staff members. We dye entire school uniform batches in single, synchronized mill lots. This guarantees that all 20, 50, or 100+ teachers receive identical color tones and border finishes. Additionally, we preserve the technical dye-lot specifications so replacement sarees ordered for mid-term new joiners match the existing faculty attire with 100% precision.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Low MOQs, Custom School House Borders & Weaver-Direct Pricing
        </h2>
        <p>
          Located in Gandhibagh, Nagpur, we supply educational trusts, missionary schools, and private academies across Central India and nationwide with flexible wholesale terms:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Accessible Institutional MOQ:</strong> Orders start at just 15 to 20 sarees, accommodating small academic departments as easily as entire school bodies.</li>
          <li><strong>Custom House & Crest Borders:</strong> Contrast border weaving or printing matched to your institution's crest, house divisions, or anniversary celebrations.</li>
          <li><strong>Sample Approval Parcels:</strong> Physical swatch books and sample drape pieces couriered to school management prior to bulk production.</li>
          <li><strong>Direct Gandhibagh Wholesale Rates:</strong> Sourced directly from master looms in Surat and Varanasi, eliminating retail middleman surcharges.</li>
        </ul>

        {/* WhatsApp & Institutional Lead CTA (No fake online checkout) */}
        <div className="p-6 md:p-8 bg-[#2C241B] text-white rounded-sm my-8 border border-[#B5894A]/30 not-prose">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5894A] font-bold block mb-1">
            Institutional Saree Desk • Estd. 1978
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-white mb-2 mt-0 font-medium">
            Order School Uniform Sarees in Bulk or Request Free Swatch Kit
          </h3>
          <p className="text-sm text-white/80 mb-6 leading-relaxed max-w-2xl">
            Planning faculty uniforms for your school or college? Connect directly with our institutional uniform specialists in Gandhibagh, Nagpur. We provide dye-lot consistency, sample swatches couriered to your campus, and customized crest border options.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/919325034636?text=Hi%20Mukesh%20Saree%20Centre,%20I%20am%20inquiring%20about%20School%20Uniform%20Sarees%20for%20our%20faculty."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#20b858] transition-all no-underline shadow-sm"
            >
              Chat on WhatsApp (+91 9325034636)
            </a>
            <a
              href="tel:+917020664641"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#B5894A] text-[#2C241B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#a0763d] transition-all no-underline"
            >
              Call Uniform Desk (+91 7020664641)
            </a>
            <Link
              to="/contact/"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all no-underline"
            >
              Request Campus Swatch Parcel
            </Link>
          </div>
          <p className="text-[11px] text-white/50 font-mono mt-4 mb-0 uppercase tracking-wider">
            Minimum Order: 15–20 Sarees • Pan-India Courier • GST Invoicing
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Related Collections & Useful Guides
        </h2>
        <p className="space-x-2">
          <Link to="/wholesale-sarees-for-boutiques/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wholesale Sarees for Boutiques</Link> •{" "}
          <Link to="/linen-sarees-for-office-wear/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Linen Sarees for Office Wear</Link> •{" "}
          <Link to="/saree-shop-in-nagpur/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur</Link> •{" "}
          <Link to="/about/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">About Mukesh Saree Centre</Link> •{" "}
          <Link to="/reviews/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Customer Reviews</Link> •{" "}
          <Link to="/contact/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Contact & Showroom Visit</Link>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "What fabrics are recommended for daily school uniform sarees?",
        answer:
          "We recommend durable poly-cotton blends, soft-spun khadi cotton, and micro-crepe. These fabrics are breathable for warm weather, resist creasing, and do not require time-consuming daily starching.",
      },
      {
        question: "What is the Minimum Order Quantity (MOQ) for school uniform sarees?",
        answer:
          "Our institutional MOQ starts at just 15 to 20 sarees per order, making it accessible for small private academies, subject departments, and large school trusts alike.",
      },
      {
        question: "Can you match our school's official house and crest colors?",
        answer:
          "Yes, we provide custom border weaving and contrast pallu combinations tailored to your school's official branding, crest colors, or house themes.",
      },
      {
        question: "How do you handle saree reorders when new teachers join mid-year?",
        answer:
          "We archive the exact mill dye-lot recipes and retain reserve inventory, ensuring mid-academic year new hires receive sarees that match existing staff uniforms seamlessly.",
      },
      {
        question: "How can school management review samples before finalizing the order?",
        answer:
          "We courier fabric swatch cards and complete sample sarees directly to your school principal or trustee board for hands-on review and fabric testing.",
      },
    ],
    relatedKeywords: [
      "school uniform sarees",
      "school teacher sarees",
      "poly cotton uniform sarees",
      "institutional sarees nagpur",
      "teacher dress code sarees",
      "school faculty uniform sarees",
    ],
  },
  "teacher-uniform-sarees": {
    title: `Teacher Uniform Sarees for Schools & Colleges | Mukesh Saree Centre`,
    description: `Comfortable, elegant teacher uniform sarees designed for all-day classroom lecturing and campus mobility. Breathable linen blends, micro-crepe & khadi cotton at wholesale rates.`,
    h1: "Teacher Uniform Sarees",
    intro:
      "Designed specifically for teachers, lecturers, and academic professors who spend long hours on their feet. Experience non-creasing, lightweight drapes that combine professional authority with effortless comfort.",
    filterCategory: "sarees",
    customFilter: (p) => {
      const f = ((p.fabric || '') + " " + p.name + " " + (p.description || '')).toLowerCase();
      return f.includes("linen") || f.includes("cotton") || f.includes("khadi") || f.includes("crepe");
    },
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <div className="bg-[#FAF6F0] p-6 rounded-md border border-[#E8DFD1] mb-8">
          <h2 className="text-xl font-serif text-[var(--color-dark)] mt-0 mb-3 font-semibold">
            All-Day Classroom Ergonomics: Sarees Designed for Educators
          </h2>
          <p className="text-[15px] leading-relaxed mb-0">
            Teaching is a physically demanding profession requiring 6 to 8 hours of standing, whiteboard writing, walking between lectures, and engaging with students. A teacher's saree must offer <strong>ergonomic drape security</strong>—staying neatly tucked at the waist without slipping—while maintaining a graceful, authoritative academic presence that commands classroom respect.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Chalk Dust Resistance & Breathable Daily Fabrics
        </h2>
        <p>
          Traditional heavy silks and clingy synthetics are impractical for daily chalk-and-board lecturing. At <strong>{BUSINESS_INFO.name}</strong>, our teacher collection highlights fine-spun khadi cottons, organic linen-cotton blends, and smooth micro-crepe weaves. These fabrics feature a tight, lint-free surface that naturally repels chalk dust and dry marker smudges. Teachers can effortlessly brush off dust between classes without leaving visible residue or permanent stains.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Dignified Academic Aesthetics & Secure Pleat Retention
        </h2>
        <p>
          Our teacher sarees feature balanced 5.5-meter drapes with generous 0.8m to 1.0m unstitched matching blouse pieces. The lightweight weave falls naturally into uniform pleats that stay anchored throughout busy school periods. Our color palettes emphasize calm, focused classroom environments: sage greens, dusty pastels, earthy terracottas, elegant teals, and soft rose tones with understated woven zari or threadwork borders.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Departmental Orders for Colleges & Degree Institutions
        </h2>
        <p>
          We cater to university colleges, polytechnics, and higher secondary faculties across India:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Department-Specific Palettes:</strong> Choose distinct coordinated shades for Science, Arts, Commerce, or Engineering faculties.</li>
          <li><strong>Zero-Starch Easy Care:</strong> Machine-washable or easy cold-water hand wash fabrics that dry fast indoors and need minimal ironing.</li>
          <li><strong>WhatsApp Video Fabric Inspection:</strong> Connect directly with our team at +91 70206 64641 to see drape, pleat behavior, and border detailing on live video.</li>
          <li><strong>Pan-India Doorstep Dispatch:</strong> Reliable courier and transport logistics with full tracking to schools and college campuses across India.</li>
        </ul>
      </div>
    ),
    faqs: [
      {
        question: "Why are linen-cotton and micro-crepe ideal for teaching professionals?",
        answer:
          "These fabrics provide superior breathability during long lectures in warm classrooms, resist perspiration marks, and drape comfortably without clinginess or stiff starched discomfort.",
      },
      {
        question: "Do teacher uniform sarees resist chalk dust and whiteboard marker stains?",
        answer:
          "Yes, our tight-weave cotton blends and smooth poly-crepes do not trap chalk powder within the weave. Most superficial dust brushes off effortlessly with a light sweep of the hand.",
      },
      {
        question: "Can college departments order distinct color combinations?",
        answer:
          "Yes, degree colleges and universities frequently order differentiated color themes for distinct academic faculties (such as blue for Science, maroon for Arts, and teal for Commerce).",
      },
      {
        question: "How easy is daily maintenance for busy educators?",
        answer:
          "These sarees require zero starching, dry quickly indoors, and retain neat pleats with a quick, low-temperature iron, making them ideal for daily morning routines.",
      },
      {
        question: "How can faculty committees inspect fabric quality before buying?",
        answer:
          "You can connect directly with our Gandhibagh team via WhatsApp video call at +91 70206 64641 to inspect fabric textures live, or request physical swatch parcels by courier.",
      },
    ],
    relatedKeywords: [
      "teacher uniform sarees",
      "college lecturer sarees",
      "khadi cotton teacher sarees",
      "comfortable sarees for teachers",
      "educational staff sarees nagpur",
      "daily wear teacher sarees",
    ],
  },
  "hospital-uniform-sarees": {
    title: `Hospital Uniform Sarees for Nurses & Healthcare Staff | ${BUSINESS_INFO.name}`,
    description: `Hygienic, easy-care hospital uniform sarees for nursing supervisors, healthcare administrators & hospital front desk teams. Stain-resistant, quick-drying poly-crepe.`,
    h1: "Hospital Uniform Sarees",
    intro:
      "Equip your hospital administration, nursing superintendents, and healthcare staff with hygienic, wrinkle-free, and stain-resistant uniform sarees from Nagpur's trusted textile distributor since 1978.",
    filterCategory: "sarees",
    customFilter: (p) => {
      const f = ((p.fabric || '') + " " + p.name + " " + (p.description || '')).toLowerCase();
      return f.includes("crepe") || f.includes("georgette") || f.includes("blend") || f.includes("chiffon");
    },
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <div className="bg-[#FAF6F0] p-6 rounded-md border border-[#E8DFD1] mb-8">
          <h2 className="text-xl font-serif text-[var(--color-dark)] mt-0 mb-3 font-semibold">
            Clinical Standards: Hygiene, Stain Resistance & Shift Resilience
          </h2>
          <p className="text-[15px] leading-relaxed mb-0">
            Healthcare settings demand the strictest standards of textile hygiene and physical resilience. Hospital uniform sarees must endure <strong>high-temperature commercial laundering</strong>, <strong>exposure to antiseptic cleansers</strong>, and <strong>strenuous 12-hour duty shifts</strong> without losing their color, thinning, or collecting clinical lint.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Poly-Crepe & Matte Georgette for Active 12-Hour Hospital Shifts
        </h2>
        <p>
          At <strong>{BUSINESS_INFO.name}</strong>, our hospital uniform sarees are woven from premium poly-crepe and high-twist georgette microfibers. These specialized yarns are naturally fluid-repellent and quick-drying. When fluids or sanitizers splash onto the fabric, the tight weave prevents immediate soaking, allowing rapid cleaning. Unlike traditional cotton that wrinkles instantly and requires heavy starching, poly-crepe bounces back into shape, keeping nursing supervisors and administrative staff looking poised and professional through night shifts.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Departmental Color Discipline & Soothing Medical Palettes
        </h2>
        <p>
          Visual distinction among healthcare departments improves hospital workflow and comforts arriving patients. We offer coordinated uniform sets in proven clinical palettes:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Serene Teal & Sky Blue:</strong> The international benchmark for nursing supervisors and in-patient ward leads.</li>
          <li><strong>Soothing Mint & Sage Green:</strong> Calming tones for surgical recovery, pharmacy staff, and pediatric units.</li>
          <li><strong>Warm Beige & Soft Lavender:</strong> Welcoming, dignified shades for front-desk patient reception, billing counters, and OPD coordinators.</li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Supplying Hospitals, Nursing Colleges & Diagnostic Centers Pan-India
        </h2>
        <p>
          From multispeciality hospital chains in Nagpur to private nursing homes and diagnostics centers across Vidarbha, MP, and Chhattisgarh, we provide certified bulk wholesale supply:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Disinfection Tested:</strong> Tested for color-fastness against regular commercial detergents and hot-water wash cycles.</li>
          <li><strong>Flexible MOQs:</strong> Orders starting from 15 sarees per shade with archived dye recipes for effortless future replenishment.</li>
          <li><strong>Matching Blouse Pieces:</strong> Each saree includes 0.85m to 1.0m unstitched fabric to accommodate all staff body sizes.</li>
          <li><strong>Fast Dispatch:</strong> Ready stock dispatches within 24 to 48 hours with full GST tax invoice documentation.</li>
        </ul>
      </div>
    ),
    faqs: [
      {
        question: "Can hospital uniform sarees withstand frequent commercial laundering?",
        answer:
          "Yes, our poly-crepe and high-twist georgette yarns are tested for high-temperature washes and disinfectant detergents without color fading, shrinking, or fiber degradation.",
      },
      {
        question: "Are these sarees wrinkle-resistant during 12-hour shifts?",
        answer:
          "Yes, the micro-crepe weave offers instant wrinkle bounce-back, maintaining a crisp, lint-free, professional appearance throughout strenuous hospital duty shifts.",
      },
      {
        question: "Do you provide color-coded sarees for different hospital designations?",
        answer:
          "Yes, we supply standardized color sets tailored to each department: nursing superintendents (teal/blue), reception executives (beige/peach), and administrative staff (lavender/grey).",
      },
      {
        question: "What is the MOQ and reorder process for hospital staff uniforms?",
        answer:
          "Our MOQ starts at 15 sarees per shade. We archive exact mill dye-lot recipes so subsequent orders for newly hired medical personnel match existing staff attire perfectly.",
      },
      {
        question: "How quickly can orders be delivered to hospitals across Central India?",
        answer:
          "Ready stock batches dispatch within 24 to 48 hours via fast road logistics and express couriers, reaching hospitals across Maharashtra, MP, and CG within 2 to 4 days.",
      },
    ],
    relatedKeywords: [
      "hospital uniform sarees",
      "nursing staff uniform sarees",
      "healthcare receptionist sarees",
      "stain resistant sarees nagpur",
      "clinic uniform sarees",
      "medical staff sarees",
    ],
  },
  "wholesale-sarees-nagpur": {
    title: `Wholesale Sarees in Nagpur | Direct Weaver Rates | ${BUSINESS_INFO.name}`,
    description: `Nagpur's premier wholesale saree dealer since 1978 in Gandhibagh & Itwari market. Bulk sarees, lehengas & uniform drapes at direct weaver prices with pan-India dispatch.`,
    h1: "Wholesale Sarees in Nagpur",
    intro:
      `Sourcing directly from India's master weaving clusters in Surat, Varanasi, Kanchipuram, and Kolkata, ${BUSINESS_INFO.name} on Jagnath Road, Gandhibagh is Nagpur and Vidarbha's leading wholesale saree distributor since 1978.`,
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <div className="bg-[#FAF6F0] p-6 rounded-md border border-[#E8DFD1] mb-8">
          <h2 className="text-xl font-serif text-[var(--color-dark)] mt-0 mb-3 font-semibold">
            Central India's Premier Wholesale Textile Hub: Gandhibagh & Itwari
          </h2>
          <p className="text-[15px] leading-relaxed mb-0">
            For over 46 years, <strong>{BUSINESS_INFO.name}</strong> on Jagnath Road, Gandhibagh, has stood as the cornerstone of wholesale saree distribution in Nagpur and the wider Vidarbha, Madhya Pradesh, and Chhattisgarh regions. We supply more than <strong>500+ independent retail boutiques</strong>, regional saree showrooms, home-based women entrepreneurs, and institutional buyers with direct loom-finished textiles at genuine factory rates.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Direct Weaver Loom Sourcing: Zero Intermediary Brokerage
        </h2>
        <p>
          Most regional wholesalers purchase through multi-tiered broker networks in Surat, Kolkata, or Varanasi, which inflates product costs by 20% to 35%. <strong>{BUSINESS_INFO.name}</strong> maintains established, direct-contract partnerships with loom clusters across Surat, Banaras, Kanchipuram, Chanderi, and Bengal. By eliminating commission agents and middleman markups, we pass maximum profit margins directly to our retail partners.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Ready 30+ Category Inventory Under One Roof
        </h2>
        <p>
          Whether your store caters to luxury bridal trousseaus or budget-conscious everyday shoppers, our Gandhibagh showroom houses over 30 distinct product categories:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Pure Linen Sarees:</strong> 60s to 100s count organic flax linen with zari borders and contemporary digital prints.</li>
          <li><strong>Signature Malvika Sarees:</strong> Silky-soft, wrinkle-free tissue blends that sell out rapidly across retail counters.</li>
          <li><strong>Traditional Handlooms:</strong> Authentic Yeola Paithani, Kanjivaram silk, Banarasi brocades, and Chanderi drapes.</li>
          <li><strong>Everyday Cotton & Daily Wear:</strong> Breathable soft cottons, Mulmul, Jamdani, and easy-care synthetic prints.</li>
          <li><strong>Bridal & Party Wear:</strong> Heavily embroidered bridal lehengas, semi-stitched suits, and designer sequins drapes.</li>
          <li><strong>Institutional Uniform Sarees:</strong> Bulk uniform drapes for schools, colleges, hospitals, and corporate organizations.</li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Low Starting MOQs, Transparent Slabs & Fast Logistics Dispatch
        </h2>
        <p>
          We believe in nurturing growing businesses. Our wholesale catalog bundles start with <strong>minimum orders as low as 10 to 15 sarees</strong>, allowing new boutique owners to curate diverse collections without heavy capital outlay. We provide daily fresh arrivals via our WhatsApp dealer broadcast, real-time video inspections, itemized GST tax invoices, and same-day parcel dispatch via premier transport logistics (Delhivery, Blue Dart, and dedicated regional cargo lines).
        </p>

        <div className="bg-[#2C241B] text-white p-6 rounded-md mt-8 mb-4">
          <h3 className="text-lg font-serif font-semibold text-[#D4AF37] mb-2">
            Visit Our Gandhibagh Showroom or Order via WhatsApp
          </h3>
          <p className="text-sm text-white/80 mb-4 leading-relaxed">
            Walk into our wholesale counter at Jagnath Road, Gandhibagh, Nagpur (Mon–Sat, 11 AM – 8:30 PM) for hands-on lot selection, or message our wholesale desk directly for instant catalog access.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hi Mukesh Saree Centre, I am a retailer/buyer inquiring about your wholesale saree catalog and price list.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#D4AF37] text-[#2C241B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#e0be4d] transition-all"
            >
              WhatsApp Wholesale Catalog
            </a>
            <Link
              to="/contact/"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
            >
              Store Location & Directions
            </Link>
          </div>
        </div>
      </div>
    ),
    faqs: [
      {
        question: `Where is ${BUSINESS_INFO.name} located in Nagpur for wholesale purchases?`,
        answer:
          `Our wholesale showroom is located at Jagnath Road, Gandhibagh, Nagpur 440002, adjacent to the Itwari textile market. Boutique owners and retailers are welcome for in-person lot selection Monday through Saturday.`,
      },
      {
        question: "What is the Minimum Order Quantity (MOQ) for wholesale buyers?",
        answer:
          "Our wholesale lots start at just 10 to 15 sarees per catalog bundle, making it simple for new boutique owners and home entrepreneurs to launch without huge capital commitments.",
      },
      {
        question: "How can outstation retailers access the daily wholesale catalog?",
        answer:
          `Outstation buyers can message our wholesale department on WhatsApp at ${BUSINESS_INFO.phone}. We send daily fresh arrivals, wholesale price tiers, and offer live video call fabric inspections.`,
      },
      {
        question: "What saree varieties are available at wholesale prices?",
        answer:
          "We supply over 30 categories including Pure Linen, Malvika Silk, Paithani, Banarasi Silk, Chanderi, Soft Cotton, Organza, Heavy Bridal Lehengas, and Institutional Uniform Sarees.",
      },
      {
        question: "What payment terms and transport delivery methods do you support?",
        answer:
          "We accept RTGS, NEFT, UPI, and bank transfers, and ship daily via trusted transport networks and courier partners (Delhivery, Blue Dart, regional transport) across Maharashtra, MP, CG, and pan-India.",
      },
    ],
    relatedKeywords: [
      "wholesale sarees nagpur",
      "gandhibagh saree wholesale market",
      "itwari cloth market nagpur",
      "saree wholesaler vidarbha",
      "bulk saree supplier maharashtra",
      "nagpur saree dealer",
      "wholesale paithani sarees nagpur",
    ],
  },

  "pure-linen-sarees": {
    title: "Pure Linen Sarees Online | Breathable Handcrafted Drapes | Mukesh Saree Centre",
    description: "Shop pure linen sarees online at Mukesh Saree Centre. Sourced from fine flax fibers, breathable organic weaves, digital prints & zari borders. Free shipping across India.",
    h1: "Pure Linen Sarees",
    intro: "Celebrated for their natural texture, breathability, and timeless organic appeal, our pure linen sarees bring effortless elegance to modern Indian wardrobes. Handcrafted from premium organic flax fibers, each drape balances lightweight comfort with refined, contemporary aesthetics.",
    filterCategory: "sarees",
    customFilter: (p) => (p.fabric && p.fabric.toLowerCase().includes("linen")) || p.category.toLowerCase().includes("linen") || p.name.toLowerCase().includes("linen"),
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          The Art & Anatomy of Pure Linen Weaving
        </h2>
        <p>
          At <strong>Mukesh Saree Centre</strong>, our pure linen sarees are woven using high-grade European and indigenous flax yarn ranging from 60s to 100s count. This superior thread density yields an airy, breathable weave that softens organically with every drape. Unlike synthetic blends that trap humidity, pure linen naturally regulates body temperature, making it the premier choice for India's warm tropical climates. The collection features crisp selvage borders, delicate tissue zari detailing, woven geometric pallus, and artistic digital prints ranging from Warli motifs to soft botanical florals.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Styling & Everyday Versatility
        </h2>
        <p>
          Pure linen's natural slub texture and structured drape make it exceptionally versatile across diverse settings. For professional boardroom settings and corporate elegance, pair a solid-toned pastel ivory, charcoal, or slate grey linen saree with a structured boat-neck blouse and minimalist silver jewelry. For daytime festive gatherings, gallery visits, or intimate family pujas, opt for our floral garden prints, vibrant sunshine yellows, or contrast tribal woven borders styled with oxidised silver jhumkas and block heels.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Draping Ease & Sustainable Fabric Care
        </h2>
        <p>
          Draping a linen saree is straightforward because the natural fiber holds its shape with crisp, clean lines without requiring dozens of safety pins. The pallu falls gracefully over the shoulder, creating an elongated silhouette that flatters all body types. For care, we advise an initial dry clean followed by gentle cold-water hand washing with mild liquid detergents to preserve fiber strength and color depth.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Mukesh Saree Centre Craftsmanship Since 1978
        </h2>
        <p>
          Serving discerning textile lovers since 1978 from Gandhibagh, Nagpur, Mukesh Saree Centre inspects every linen weave for tensile strength, yarn purity, and print precision. With more than 30 curated linen styles in stock—spanning pure linens and premium linen-cotton blends—you enjoy authentic loom-finished textiles with dependable Cash on Delivery and pan-India doorstep delivery.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "How do I care for and wash a pure linen saree?",
        answer: "We recommend dry cleaning for the first wash to preserve the fabric's natural sheen and crisp texture. Subsequent washes can be done by gentle hand washing in cold water with a mild liquid detergent. Always shade-dry and iron while slightly damp using medium heat."
      },
      {
        question: "Are pure linen sarees comfortable for summer and office wear?",
        answer: "Yes, pure linen is one of the most breathable natural textiles in the world. Its hollow flax fibers conduct heat away from the body, making it exceptionally comfortable for 8 to 10 hours of active office wear."
      }
    ],
    relatedKeywords: [
      "pure linen sarees",
      "handloom linen sarees",
      "linen saree online",
      "organic linen sarees nagpur",
      "office wear linen saree"
    ]
  },
  "soft-cotton-sarees": {
    title: "Soft Cotton Sarees Online | Daily Wear & Handloom | Mukesh Saree Centre",
    description: "Discover soft cotton sarees at Mukesh Saree Centre. Premium khadi cotton, Jamdani weaves, tissue cotton & breathable blends with COD and free shipping across India.",
    h1: "Soft Cotton Sarees",
    intro: "Soft cotton sarees represent the cornerstone of authentic Indian comfort and graceful everyday dressing. Spun from long-staple natural cotton yarns, our collection offers unparalleled softness against the skin, effortless pleating, and enduring elegance for every season.",
    filterCategory: "sarees",
    customFilter: (p) => (p.fabric && p.fabric.toLowerCase().includes("cotton")) || p.name.toLowerCase().includes("cotton"),
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Natural Fibers & Gentle Comfort
        </h2>
        <p>
          Nothing rivals the pure comfort of a soft cotton saree for daily life. At <strong>Mukesh Saree Centre</strong>, our soft cotton drapes are spun from combed, long-staple cotton threads that eliminate scratchiness and stiffness. The collection features hand-spun Khadi cottons, fine Jamdani weaves like our Lal Pari artisan drape, delicate tissue-cotton blends with festive floral printing, and airy cotton-linen fusions. Each saree is pre-washed and treated for natural suppleness, allowing the fabric to drape gracefully without puffing or resisting pleat formation.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Styling for Daily Wear & Warm Climates
        </h2>
        <p>
          Soft cotton sarees seamlessly transition from morning pujas and school lectures to corporate offices and casual weekend brunches. For a poised academic or office look, style a monochrome or striped Khadi cotton saree with a collared elbow-sleeve blouse and leather kolhapuris. For weekend outings or temple visits, choose a vibrant floral tissue-cotton or Jamdani drape with subtle zari selvage, complemented by terracotta earrings and a classic bindi.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Effortless Pleats & Zero-Stiff Maintenance
        </h2>
        <p>
          Because our soft cottons are specially finished to eliminate rigidity, they do not require heavy starching to maintain a neat appearance. The fabric hugs the body naturally, making pleating quick and comfortable for daily morning routines. Simply hand-wash separately in cold salt water for the first cycle, dry in shaded breeze, and steam iron for a fresh, fluid finish.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Authentic Handloom Heritage in Nagpur
        </h2>
        <p>
          Since 1978, Mukesh Saree Centre in Gandhibagh, Nagpur has championed traditional weavers and ethical cotton textile production. Every cotton saree is tested for colorfastness, breathable weave openness, and structural durability so you can enjoy easy maintenance and lasting beauty wash after wash. Shop our ready inventory with Cash on Delivery and express nationwide shipping.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Do soft cotton sarees require starching?",
        answer: "Unlike stiff formal starch cottons, our soft cotton sarees are specially spun and finished for a soft, fluid drape right out of the box. You do not need to starch them unless you specifically prefer a razor-sharp, crisp finish."
      },
      {
        question: "Will the colors bleed upon washing?",
        answer: "Our sarees use high-grade colorfast dyes. To ensure longevity, we advise soaking separately in cold salt water for the very first wash, followed by mild hand washing and shaded line drying."
      }
    ],
    relatedKeywords: [
      "soft cotton sarees",
      "daily wear cotton sarees",
      "handloom cotton sarees",
      "khadi cotton saree nagpur",
      "jamdani cotton saree"
    ]
  },
  "banarasi-silk-sarees": {
    title: "Banarasi Silk Sarees | Bridal & Festive Silks | Mukesh Saree Centre Nagpur",
    description: "Explore luxury Banarasi and festive silk sarees at Mukesh Saree Centre. Handpicked zari weaves, tissue silks & bridal collections. Visit Gandhibagh showroom or order online.",
    h1: "Banarasi Silk Sarees",
    intro: "Renowned across the globe as the crown jewel of Indian heritage, Banarasi silk sarees capture regal grandeur through rich textures, luminous sheen, and exquisite zari craftsmanship. A must-have in every bridal trousseau, these timeless weaves celebrate centuries of textile mastery.",
    filterCategory: "sarees",
    customFilter: (p) => (p.fabric && (p.fabric.toLowerCase().includes("silk") || p.fabric.toLowerCase().includes("banarasi"))) || p.name.toLowerCase().includes("silk") || p.name.toLowerCase().includes("banarasi"),
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          The Regal Art of Banarasi & Silk Brocades
        </h2>
        <p>
          Originating from the holy city of Varanasi, traditional Banarasi sarees are distinguished by their intricate brocade motifs—including kalga (mango), jhallar (floral net), and shikargah (hunting scenes)—woven into lustrous mulberry and tissue silk warps with metallic gold and silver zari. The heavy pallu and opulent borders create a majestic drape that holds its shape with imperial dignity, transforming every bride and festive host into a vision of classic grace.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Showroom Vault & Online Exclusive Silk Drapes
        </h2>
        <p>
          While our digital catalog showcases selective contemporary festive silk and tissue drapes—such as our White Fendy Space Silk and Peacock Green Raga Tissue Silk—<strong>Mukesh Saree Centre's</strong> flagship multi-floor showroom in Gandhibagh, Nagpur houses an extensive physical vault of pure Katan silk Banarasis, lightweight georgette Banarasis, and traditional bridal ensembles. If you are seeking a specific weave, colorway, or bulk bridal trousseau order, our personal shopping team provides live video consultations directly from our Nagpur store.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Heirloom Preservation & Silk Care
        </h2>
        <p>
          To preserve the intricate metallic zari and pure silk filaments, always store your Banarasi saree wrapped in breathable unbleached muslin cloth away from direct sunlight and humidity. Never spray perfumes directly onto the fabric, and schedule gentle dry cleaning after heavy wedding use. Refolding along alternative lines twice a year ensures the brocade stays pristine across generations.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Four Decades of Trust in Nagpur
        </h2>
        <p>
          Founded in 1978, Mukesh Saree Centre is Nagpur's premier family destination for wedding silks and festive wear. Every silk piece is hand-inspected for authentic zari purity, drape fluidity, and pristine finish. Enjoy transparent pricing, dedicated bridal consultation, Cash on Delivery, and pan-India insured shipping.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Can I view more Banarasi silk sarees on video call?",
        answer: "Yes! Because many of our high-end Banarasi bridal silks are exclusive single-piece drapes housed in our Gandhibagh showroom, we offer personalized WhatsApp video shopping sessions. Contact us at +91 7020664641 to schedule an appointment."
      },
      {
        question: "How should I store and protect a pure Banarasi silk saree?",
        answer: "Always wrap your Banarasi silk saree in a clean, breathable unbleached cotton or muslin cloth. Store it flat in a cool, dry wardrobe, away from moisture and direct sunlight. Refold along new creases every six months to prevent zari breakage."
      }
    ],
    relatedKeywords: [
      "banarasi silk sarees",
      "banarasi sarees nagpur",
      "bridal silk sarees",
      "katan silk banarasi",
      "tissue silk saree"
    ]
  },
  "designer-party-wear-sarees": {
    title: "Designer Party Wear Sarees Online | Cocktail & Festive Drapes | Mukesh Saree Centre",
    description: "Shop designer party wear sarees online at Mukesh Saree Centre. Flowy georgettes, embroidered drapes, shimmer tissue & cocktail sarees with COD across India.",
    h1: "Designer Party Wear Sarees",
    intro: "Make a captivating entrance at receptions, cocktail parties, and festive celebrations with our designer party wear sarees. Featuring fluid drapes, contemporary color palettes, and intricate artistic embellishments, these modern ensembles effortlessly blend glamour with comfort.",
    filterCategory: "sarees",
    customFilter: (p) => (p.fabric && (p.fabric.toLowerCase().includes("georgette") || p.fabric.toLowerCase().includes("chiffon") || p.fabric.toLowerCase().includes("silk") || p.fabric.toLowerCase().includes("tissue"))) || p.name.toLowerCase().includes("party") || p.name.toLowerCase().includes("designer"),
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Couture Aesthetics & Modern Fabric Innovations
        </h2>
        <p>
          Our designer party wear collection embraces fluid, modern fabrics engineered for movement and visual impact. From lightweight, gossamer georgettes and sheer festive chiffons to glamorous foil-accented drapes, delicate embroidery, and lustrous metallic tissue silks, each saree is designed to catch the evening light. Instead of heavy, cumbersome garments, our party wear drapes offer featherlight drapeability, allowing you to dance, celebrate, and socialize in complete comfort without compromising on high-fashion allure.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Styling for Sangeets, Receptions & Cocktails
        </h2>
        <p>
          Designer party wear sarees lend themselves brilliantly to contemporary styling. For an evening cocktail or sangeet night, pair a rich emerald green or ruby red georgette drape with an embellished sleeveless bustier, statement chandelier earrings, and a metallic clutch. For daytime weddings or festive anniversary celebrations, choose a sunshine yellow chiffon or pastel tissue silk saree with subtle mirror work or foil borders, styled with sleek dewy makeup and delicate diamond or crystal accessories.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Fluid Movement & Wrinkle-Resistant Draping
        </h2>
        <p>
          The lightweight composition of chiffon, georgette, and tissue silk ensures seamless pleating that stays secure throughout long celebrations. These resilient fabrics resist creasing even when seated for hours, maintaining a camera-ready silhouette from the grand entrance to the final farewell. We suggest professional dry cleaning or delicate hand steaming to keep foil borders and embroidery threads in mint condition.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Boutique Quality from Mukesh Saree Centre
        </h2>
        <p>
          With over 45 years of textile leadership in Nagpur, <strong>Mukesh Saree Centre</strong> curates trend-setting party wear sarees that deliver celebrity-inspired silhouettes at accessible direct-to-consumer pricing. Discover over a dozen handpicked designer drapes ready to ship with Cash on Delivery and complimentary delivery across India.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Are designer party wear sarees heavy to carry during events?",
        answer: "Not at all. Our designer collection prioritizes lightweight, flowing fabrics like premium georgette, chiffon, and soft tissue silk. They drape closely to the body and are comfortable to wear for hours of celebration."
      },
      {
        question: "Do these sarees come with matching blouse pieces?",
        answer: "Yes, all our designer party wear sarees include an unstitched matching or coordinated contrast 0.8-meter blouse piece with matching borders or embroidery accents."
      }
    ],
    relatedKeywords: [
      "designer party wear sarees",
      "party wear sarees online",
      "georgette party saree",
      "cocktail sarees nagpur",
      "festive wear saree"
    ]
  },
  "linen-sarees-for-office-wear": {
    title: "Linen Sarees for Office Wear | Elegant Formal Drapes – Mukesh Saree Centre",
    description: "Discover breathable, lightweight linen sarees for office wear and long working hours. Shop pure linen and linen-cotton blends online from Mukesh Saree Centre, Nagpur.",
    h1: "Linen Sarees for Office Wear",
    intro: "Experience the ideal union of professional authority, natural breathability, and understated elegance. Our curated collection of pure linen and linen-cotton sarees is handcrafted for all-day comfort during corporate meetings, boardroom presentations, and daily workplace hours.",
    filterCategory: "sarees",
    customFilter: (p) => {
      const f = ((p.fabric || "") + " " + p.name + " " + (p.description || "")).toLowerCase();
      return f.includes("linen");
    },
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        {/* Direct Answer Box */}
        <div className="p-5 bg-[#FAF6F0] border-l-4 border-[#B5894A] rounded-r-sm mb-8 text-[#2C241B]">
          <h2 className="text-lg font-serif font-bold mb-2 mt-0 text-[#2C241B]">
            Direct Answer: Why Are Linen Sarees the Best Choice for Office Wear?
          </h2>
          <p className="text-sm leading-relaxed mb-0">
            <strong>Linen sarees</strong> are considered the gold standard for Indian office wear because pure flax fibers naturally absorb moisture, regulate body temperature in both air-conditioned offices and tropical heat, and maintain a crisp, structured drape without clinging. Their subtle organic texture projects understated sophistication and executive authority without excessive gloss or heavy embroidery.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          The 8-Hour Workday Test: All-Day Comfort & Crease Resilience
        </h2>
        <p>
          Corporate working hours demand attire that retains neat, intentional pleats from the first morning team standup to late evening executive debriefs. Unlike stiff synthetic polyesters that trap sweat or heavy silks that feel suffocating during desk commutes, <strong>pure linen sarees</strong> allow continuous air circulation across the weave.
        </p>
        <p>
          At <strong>Mukesh Saree Centre</strong> (Estd. 1978 in Gandhibagh, Nagpur), we curate high-density 80s to 100s yarn-count linens and pre-washed linen-cotton blends. These fabrics soften with every wash while retaining their architectural shoulder fall. The natural micro-slubs of linen disguise minor sitting creases as organic character rather than messy wrinkles, making them effortlessly workplace-ready.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Corporate Saree Styling: Blouse Pairings, Necklines & Etiquette
        </h2>
        <p>
          Achieving a polished corporate aesthetic with a linen saree requires intentional styling balance:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Blouse Cuts:</strong> Pair your linen drape with structured elbow-length sleeves, high jewel necks, boat necks, or formal shirt-collared blouses in solid cotton, raw silk, or handloom cotton.
          </li>
          <li>
            <strong>Color Schemes:</strong> Soothing earth tones, muted pastels, slate grey, sage green, indigo blue, and subtle mustard tones maintain dignified workplace composure.
          </li>
          <li>
            <strong>Jewelry & Accessories:</strong> Keep ornamentation minimal. Matte terracotta earrings, sterling silver studs, a leather-strap watch, and comfortable low-block footwear complete an empowered executive presence.
          </li>
          <li>
            <strong>Pleating Technique:</strong> Pin 4 to 5 crisp, equal pleats at the shoulder with a concealed safety pin beneath the blouse shoulder seam to ensure hands-free comfort during presentations and laptop work.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Fabric Guide: Pure Organic Linen vs Linen-Cotton Blends
        </h2>
        <div className="overflow-x-auto my-6">
          <table className="min-w-full divide-y divide-black/10 text-sm border border-black/10 rounded-sm">
            <thead className="bg-[#FAF6F0] text-[#2C241B] font-serif text-left">
              <tr>
                <th className="px-4 py-3 border-b">Fabric Type</th>
                <th className="px-4 py-3 border-b">Yarn Count</th>
                <th className="px-4 py-3 border-b">Drape & Texture</th>
                <th className="px-4 py-3 border-b">Ideal Work Environment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[#2C241B]/80">
              <tr>
                <td className="px-4 py-3 font-semibold">100% Pure Linen</td>
                <td className="px-4 py-3">80s – 100s Flax</td>
                <td className="px-4 py-3">Crisp, breathable, gets softer with each wash</td>
                <td className="px-4 py-3">Senior leadership, board meetings, formal seminars</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Linen Cotton Blend</td>
                <td className="px-4 py-3">60s Linen + 40s Cotton</td>
                <td className="px-4 py-3">Ultra-soft, easy to iron, high drape fluidity</td>
                <td className="px-4 py-3">Daily office commuting, academic lecturing, desk shifts</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold">Zari Border Linen</td>
                <td className="px-4 py-3">Fine Linen + Antique Zari</td>
                <td className="px-4 py-3">Structured drape with thin matte gold/silver border</td>
                <td className="px-4 py-3">Office festivals, corporate dinners, farewell lunches</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Care & Maintenance Guide for Working Women
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Washing:</strong> Cold gentle hand wash or delicate machine cycle with mild organic liquid detergent. Never use harsh optical brighteners.
          </li>
          <li>
            <strong>Drying:</strong> Dry flat on a hanger in shaded, breezy areas. Avoid direct mid-day sunlight to preserve natural dye luster.
          </li>
          <li>
            <strong>Quick Steam Ironing:</strong> Iron while the saree is slightly damp on medium-high steam heat, or spritz lightly with pure water before pressing.
          </li>
        </ul>

        {/* WhatsApp & Purchase CTA */}
        <div className="p-6 md:p-8 bg-[#2C241B] text-white rounded-sm my-8 border border-[#B5894A]/30 not-prose">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5894A] font-bold block mb-1">
            Mukesh Saree Centre • Gandhibagh, Nagpur
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-white mb-2 mt-0 font-medium">
            Shop Authentic Linen Office Wear Sarees Online
          </h3>
          <p className="text-sm text-white/80 mb-6 leading-relaxed max-w-2xl">
            Choose from our real in-stock linen collection below, or connect with our Gandhibagh showroom team on WhatsApp for personalized video draping and fast Pan-India dispatch with Cash on Delivery options.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/shop/?category=Sarees"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#B5894A] text-[#2C241B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#a0763d] transition-all no-underline shadow-sm"
            >
              Browse All Office Sarees
            </Link>
            <a
              href="https://wa.me/919325034636?text=Hi%20Mukesh%20Saree%20Centre,%20I%20am%20looking%20for%20linen%20sarees%20for%20office%20wear."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#20b858] transition-all no-underline"
            >
              WhatsApp Styling Help (+91 9325034636)
            </a>
            <Link
              to="/contact/"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all no-underline"
            >
              Visit Nagpur Showroom
            </Link>
          </div>
          <p className="text-[11px] text-white/50 font-mono mt-4 mb-0 uppercase tracking-wider">
            100% Real Products • Free Shipping Across India • 7-Day Exchange
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Related Collections & Pages
        </h2>
        <p className="space-x-2">
          <Link to="/sarees/linen-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Pure Linen Sarees</Link> •{" "}
          <Link to="/sarees/cotton-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Soft Cotton Sarees</Link> •{" "}
          <Link to="/saree-care-guide/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Saree Care & Washing Guide</Link> •{" "}
          <Link to="/saree-shop-in-nagpur/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur</Link> •{" "}
          <Link to="/about/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Our 45-Year Legacy</Link> •{" "}
          <Link to="/reviews/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Customer Reviews</Link> •{" "}
          <Link to="/contact/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Contact Us</Link>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Are linen sarees suitable for daily 9-to-5 office wear?",
        answer: "Yes, linen sarees are widely considered the most breathable, sweat-wicking ethnic fabric for professional environments. Their structured drape projects executive presence while keeping you cool through long work shifts."
      },
      {
        question: "How do I prevent a linen saree from crushing during office hours?",
        answer: "Opt for higher yarn-count linens (80s or 100s) or pre-washed linen-cotton blends. Iron the saree while slightly damp using steam heat. When seated, smooth the back pleats flat against the chair to avoid sharp horizontal creases."
      },
      {
        question: "What blouse styles look best with linen sarees for office settings?",
        answer: "Fitted elbow-length blouses, closed high necks, boat necks, and mandarin collared cotton blouses pair exceptionally well with linen. Sticking to solid contrasting tones maintains an elegant corporate look."
      },
      {
        question: "What is the difference between pure linen and linen-cotton blend sarees?",
        answer: "Pure linen is woven entirely from flax yarn, offering an organic texture, maximum breathability, and a structured fall. Linen-cotton blends incorporate combed cotton threads, providing a softer hand-feel with slightly less creasing and effortless daily maintenance."
      },
      {
        question: "Can I order linen office wear sarees online with Cash on Delivery?",
        answer: "Yes! Mukesh Saree Centre offers fast pan-India delivery with Cash on Delivery (COD) options and free shipping across India directly from our Gandhibagh showroom in Nagpur."
      }
    ],
    relatedKeywords: [
      "linen sarees for office wear",
      "pure linen office saree",
      "formal linen sarees for work",
      "breathable workwear sarees",
      "cotton linen sarees for teachers",
      "corporate linen saree nagpur"
    ]
  },
  "chiffon-sarees-for-wedding-functions": {
    title: "Chiffon Sarees for Wedding Functions | Evening Drapes – Mukesh Saree Centre",
    description: "Shop weightless, glamorous chiffon sarees for wedding functions, sangeet nights, and cocktail receptions. Premium fall and delicate borders at Mukesh Saree Centre, Nagpur.",
    h1: "Chiffon Sarees for Wedding Functions",
    intro: "Float through wedding festivities with ethereal grace. Our collection of premium chiffon sarees brings feather-light fluidity, flattering body contours, and delicate zari lace borders—crafted for joyful sangeet dances, mehendi ceremonies, and cocktail celebrations.",
    filterCategory: "sarees",
    customFilter: (p) => {
      const text = ((p.fabric || "") + " " + p.name + " " + (p.description || "")).toLowerCase();
      return (text.includes("chiffon") || text.includes("georgette")) && !p.name.toLowerCase().includes("lehenga");
    },
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        {/* Direct Answer Box */}
        <div className="p-5 bg-[#FAF6F0] border-l-4 border-[#B5894A] rounded-r-sm mb-8 text-[#2C241B]">
          <h2 className="text-lg font-serif font-bold mb-2 mt-0 text-[#2C241B]">
            Direct Answer: Why Wear a Chiffon Saree to Wedding Functions?
          </h2>
          <p className="text-sm leading-relaxed mb-0">
            <strong>Chiffon sarees</strong> are the preferred choice for pre-wedding functions and evening wedding celebrations because their weightless, gossamer weave provides an effortlessly fluid drape that flatters all body types. Unlike heavy brocades or stiff silks, chiffon allows unrestricted movement for dancing at Sangeet nights, stays comfortable through long receptions, and catches banquet lighting with subtle elegance.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Event-by-Event Wedding Styling Guide
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded border border-black/5 shadow-2xs">
            <h3 className="text-lg font-serif font-semibold text-[#2C241B] m-0 mb-1">
              1. Sangeet & Cocktail Nights: High-Energy Movement
            </h3>
            <p className="text-sm text-[#2C241B]/80 m-0">
              Chiffon’s low yarn density means you can perform choreographed dance routines without fabric resistance. Pair a jewel-toned chiffon saree with an embroidered sequin or mirror-work bustier blouse and statement chandeliers for modern Bollywood glamour.
            </p>
          </div>
          <div className="p-4 bg-white rounded border border-black/5 shadow-2xs">
            <h3 className="text-lg font-serif font-semibold text-[#2C241B] m-0 mb-1">
              2. Mehendi & Daylight Celebrations: Fresh Pastels
            </h3>
            <p className="text-sm text-[#2C241B]/80 m-0">
              For open-air lawn ceremonies, floral printed chiffons in blush pink, mint green, or sunshine yellow provide breezy sun protection while remaining weightless. Match with delicate pearl gota jewelry for a chic daytime festive look.
            </p>
          </div>
          <div className="p-4 bg-white rounded border border-black/5 shadow-2xs">
            <h3 className="text-lg font-serif font-semibold text-[#2C241B] m-0 mb-1">
              3. Evening Receptions: Regal Zari Borders
            </h3>
            <p className="text-sm text-[#2C241B]/80 m-0">
              Solid black, ruby red, or royal sapphire chiffons accented with hand-tied pallu tassels and scalloped antique gold lace borders project effortless luxury. Add a contrasting velvet or raw silk blouse for rich winter wedding depth.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Chiffon vs Georgette: Texture, Sheerness & Weight Comparison
        </h2>
        <p>
          While both fabrics are celebrated for fluidity, understanding their textile characteristics helps you choose the perfect drape for your function:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Pure Chiffon:</strong> Created with alternating S- and Z-twist crepe yarns, chiffon is lighter, more translucent, and possesses a gossamer sheer finish that floats around the silhouette.
          </li>
          <li>
            <strong>Georgette:</strong> Features tighter yarn twists, giving it a slightly heavier pebble-grain texture with higher opacity. Georgette handles heavier zari and resham thread embroidery more easily.
          </li>
          <li>
            <strong>Weight Comparison:</strong> A pure chiffon saree typically weighs under 400 grams, eliminating shoulder and waist strain during multi-hour wedding galas.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Safety Pinning & Draping Protocol for Delicate Fabrics
        </h2>
        <p>
          Because fine chiffon is crafted from micro-denier yarns, improper pinning can pull threads or leave visible puncture holes. Follow these master styling tips:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Use Safety Pin Guards:</strong> Slip a small plastic pearl or folded cardstock paper over the pin before piercing the fabric so threads never catch in the pin coil.
          </li>
          <li>
            <strong>Floating Single Pallu vs Pleats:</strong> Chiffon looks most breathtaking when draped with a single open floating pallu pinned lightly at the shoulder. If pleating, pin 3 broad, loose folds rather than tight accordion pleats.
          </li>
          <li>
            <strong>Petticoat Selection:</strong> Wear a seamless satin or lycra mermaid-fit underskirt in an exact matching shade to let the sheer drape fall smoothly without bunching.
          </li>
        </ul>

        {/* WhatsApp & Purchase CTA */}
        <div className="p-6 md:p-8 bg-[#2C241B] text-white rounded-sm my-8 border border-[#B5894A]/30 not-prose">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5894A] font-bold block mb-1">
            Mukesh Saree Centre • Wedding Collection
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-white mb-2 mt-0 font-medium">
            Explore Wedding Chiffon Sarees with Live Video Assistance
          </h3>
          <p className="text-sm text-white/80 mb-6 leading-relaxed max-w-2xl">
            Shopping for an upcoming family wedding? Browse our curated real chiffon collection below or connect with our Gandhibagh showroom for live WhatsApp video selection and express Pan-India shipping.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/shop/?category=Sarees"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#B5894A] text-[#2C241B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#a0763d] transition-all no-underline shadow-sm"
            >
              Shop Wedding Sarees
            </Link>
            <a
              href="https://wa.me/919325034636?text=Hi%20Mukesh%20Saree%20Centre,%20I%20am%20interested%20in%20chiffon%20sarees%20for%20a%20wedding%20function."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#20b858] transition-all no-underline"
            >
              WhatsApp Video Tour (+91 9325034636)
            </a>
            <Link
              to="/contact/"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all no-underline"
            >
              Visit Showroom
            </Link>
          </div>
          <p className="text-[11px] text-white/50 font-mono mt-4 mb-0 uppercase tracking-wider">
            Curated Designer Stock • Fast Dispatch • Cash on Delivery
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Related Collections & Useful Guides
        </h2>
        <p className="space-x-2">
          <Link to="/yellow-sarees-for-haldi/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Yellow Sarees for Haldi</Link> •{" "}
          <Link to="/wedding-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wedding Sarees Nagpur</Link> •{" "}
          <Link to="/bridal-sarees-nagpur/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Bridal Sarees Nagpur</Link> •{" "}
          <Link to="/saree-shop-in-nagpur/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur</Link> •{" "}
          <Link to="/about/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">About Us</Link> •{" "}
          <Link to="/reviews/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Customer Reviews</Link> •{" "}
          <Link to="/contact/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Contact Showroom</Link>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Why is chiffon considered the best fabric for sangeet and cocktail dances?",
        answer: "Chiffon's featherlight weight (under 400g) and natural fluid bounce allow unrestricted movement for choreographed dances and energetic walking, keeping you fresh and unencumbered throughout the celebration."
      },
      {
        question: "How do I drape a chiffon saree so it stays in place without slipping?",
        answer: "Pair your chiffon with a well-fitted satin or knit lycra petticoat. Pin the pleats securely at the waist and use safety pin guards at the shoulder so the sheer fabric does not tear or slide down."
      },
      {
        question: "Can chiffon sarees be worn for winter wedding receptions?",
        answer: "Absolutely. Chiffon pairs exquisitely with structured winter blouses crafted from raw silk, velvet, or brocade, along with an elegant pashmina or tailored ethnic jacket draped over the opposite shoulder."
      },
      {
        question: "What accessories complement wedding chiffon sarees?",
        answer: "Minimalist fine jewelry works wonders with chiffon. Consider diamond or polki drop earrings, delicate layered tennis necklaces, and sleek metallic clutches that do not snag on the sheer weave."
      },
      {
        question: "How should I care for and store delicate wedding chiffon sarees?",
        answer: "Professional dry cleaning is recommended. Store your chiffon rolled gently inside a breathable muslin bag rather than sharply creased on wire hangers to preserve weave elasticity and border zari."
      }
    ],
    relatedKeywords: [
      "chiffon sarees for wedding functions",
      "wedding chiffon saree",
      "chiffon sangeet saree",
      "cocktail party chiffon sarees",
      "designer chiffon sarees nagpur",
      "lightweight wedding saree"
    ]
  },
  "yellow-sarees-for-haldi": {
    title: "Yellow Sarees for Haldi Ceremony | Bright Haldi Drapes – Mukesh Saree Centre",
    description: "Discover radiant yellow sarees for Haldi ceremonies, mangalsnanam, and pre-wedding festivities. Lightweight chiffon, georgette, and linen sarees from Mukesh Saree Centre, Nagpur.",
    h1: "Yellow Sarees for Haldi Ceremony",
    intro: "Celebrate sacred pre-wedding moments in radiant shades of turmeric, marigold, and sunshine. Discover breathable, comfortable, and photo-ready yellow sarees designed for the bride, bridesmaids, and family during joyful Haldi and Ubtan rituals.",
    filterCategory: "sarees",
    customFilter: (p) => {
      const color = (p.color || "").toLowerCase();
      const name = p.name.toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const isYellowOrGold =
        color.includes("yellow") ||
        color.includes("mustard") ||
        color.includes("gold") ||
        name.includes("yellow") ||
        name.includes("mustard") ||
        name.includes("haldi") ||
        desc.includes("haldi");
      return isYellowOrGold && p.category.toLowerCase().includes("saree");
    },
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        {/* Direct Answer Box */}
        <div className="p-5 bg-[#FAF6F0] border-l-4 border-[#B5894A] rounded-r-sm mb-8 text-[#2C241B]">
          <h2 className="text-lg font-serif font-bold mb-2 mt-0 text-[#2C241B]">
            Direct Answer: What Makes the Perfect Saree for a Haldi Ceremony?
          </h2>
          <p className="text-sm leading-relaxed mb-0">
            The ideal <strong>Haldi saree</strong> combines a vibrant, photogenic yellow hue (from joyful sunshine to traditional mustard) with lightweight, breathable fabrics like soft cotton, linen, georgette, or chiffon. Because Haldi involves wet ubtan pastes, holy water, and joyful outdoor celebrations, the fabric must dry easily, feel gentle on sensitive skin, and allow comfortable movement without weighing the wearer down.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          The Haldi Shade Spectrum: Choosing the Right Tone for Your Event
        </h2>
        <p>
          Haldi photography is defined by rich golden contrasts. Selecting the right tone depends on your ceremonial setting:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Sunshine & Lemon Yellow:</strong> Exceptional for daytime garden rituals and open-air poolside ceremonies. The bright luminance pops against lush green floral decor.
          </li>
          <li>
            <strong>Deep Mustard & Ochre:</strong> A time-honored traditional favorite that echoes pure ground turmeric. Flattering on all Indian complexions and majestic in heritage courtyards.
          </li>
          <li>
            <strong>Marigold & Mango Yellow:</strong> Warm, energetic tones with subtle orange undertones that harmonize seamlessly with fresh floral gajras and marigold garlands.
          </li>
          <li>
            <strong>Bronze Gold & Tissue Accents:</strong> Favored by the bride's sisters and bridesmaids who desire festive shimmer without heavy bridal embroidery.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Fabric Recommendations: Practicality Meets Festive Radiance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 bg-white border border-black/5 rounded shadow-2xs">
            <h4 className="font-serif font-bold text-base text-[#2C241B] m-0 mb-1">
              Chiffon & Georgette
            </h4>
            <p className="text-xs text-[#2C241B]/80 m-0 leading-relaxed">
              Fast-drying and feather-light. Ideal if the ritual includes water splashes or flower petal showers. Drapes softly and photographs with cinematic movement.
            </p>
          </div>
          <div className="p-4 bg-white border border-black/5 rounded shadow-2xs">
            <h4 className="font-serif font-bold text-base text-[#2C241B] m-0 mb-1">
              Pure Linen & Soft Cotton
            </h4>
            <p className="text-xs text-[#2C241B]/80 m-0 leading-relaxed">
              100% natural and skin-friendly. Highly recommended for brides with sensitive skin who will have turmeric paste sitting on arms and neck for hours.
            </p>
          </div>
          <div className="p-4 bg-white border border-black/5 rounded shadow-2xs">
            <h4 className="font-serif font-bold text-base text-[#2C241B] m-0 mb-1">
              Tissue Silk with Gold Lace
            </h4>
            <p className="text-xs text-[#2C241B]/80 m-0 leading-relaxed">
              Provides opulent metallic luster for bridesmaids, mothers, and guests who want regal celebration photos without heavy zari weight.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Floral Jewelry & Styling Harmony
        </h2>
        <p>
          Haldi aesthetics are rooted in organic beauty. Complement your yellow saree with fresh or hand-crafted floral accessories:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Floral Ornaments:</strong> White jasmine (mogra) chokers and bracelets create a crisp, refreshing contrast against bright sunny yellows.
          </li>
          <li>
            <strong>Gota Patti Accents:</strong> Yellow gota patti bangles and maang tikas add traditional festive sparkle without the weight of heavy gold.
          </li>
          <li>
            <strong>Contrast Blouse Ideas:</strong> While monochrome yellow looks modern and cohesive, contrasting bottle green, fuchsia pink, or mirror-work ivory blouses add vibrant visual depth.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Post-Ceremony Turmeric Stain Removal Tips
        </h2>
        <p>
          Turmeric is a natural dye that binds quickly to organic fibers. Treat splashes promptly:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Immediate Cold Water Rinse:</strong> Never use hot water, which sets the turmeric dye. Flush the affected area with cold running water as soon as the ceremony concludes.
          </li>
          <li>
            <strong>Mild Liquid Detergent:</strong> Apply gentle liquid soap directly to the spot and gently massage with your fingertips.
          </li>
          <li>
            <strong>Natural Sunlight Bleaching:</strong> After washing, dry the saree in gentle morning sunlight. Sun rays naturally break down curcumin compounds and fade yellow stains without damaging delicate fabric threads.
          </li>
        </ul>

        {/* WhatsApp & Purchase CTA */}
        <div className="p-6 md:p-8 bg-[#2C241B] text-white rounded-sm my-8 border border-[#B5894A]/30 not-prose">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5894A] font-bold block mb-1">
            Mukesh Saree Centre • Haldi & Festive Collection
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-white mb-2 mt-0 font-medium">
            Find Your Radiant Haldi Saree Today
          </h3>
          <p className="text-sm text-white/80 mb-6 leading-relaxed max-w-2xl">
            Browse our handpicked real yellow sarees below or connect with our Gandhibagh showroom stylists on WhatsApp. We provide live video tours, bridesmaid coordination, and fast express dispatch across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/shop/?category=Sarees"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#B5894A] text-[#2C241B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#a0763d] transition-all no-underline shadow-sm"
            >
              Shop All Yellow Sarees
            </Link>
            <a
              href="https://wa.me/919325034636?text=Hi%20Mukesh%20Saree%20Centre,%20I%20am%20looking%20for%20a%20yellow%20saree%20for%20a%20Haldi%20function."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#20b858] transition-all no-underline"
            >
              WhatsApp Haldi Styling (+91 9325034636)
            </a>
            <Link
              to="/contact/"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all no-underline"
            >
              Visit Showroom
            </Link>
          </div>
          <p className="text-[11px] text-white/50 font-mono mt-4 mb-0 uppercase tracking-wider">
            Ready Stock • Express Delivery Across India • Cash on Delivery
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Related Collections & Guides
        </h2>
        <p className="space-x-2">
          <Link to="/chiffon-sarees-for-wedding-functions/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Chiffon Sarees for Wedding Functions</Link> •{" "}
          <Link to="/wedding-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wedding Sarees</Link> •{" "}
          <Link to="/sarees/linen-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Linen Sarees</Link> •{" "}
          <Link to="/saree-shop-in-nagpur/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur</Link> •{" "}
          <Link to="/about/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">About Mukesh Saree Centre</Link> •{" "}
          <Link to="/reviews/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Customer Reviews</Link> •{" "}
          <Link to="/contact/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Contact Us</Link>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Which shade of yellow looks most photogenic for Haldi ceremonies?",
        answer: "Warm mustard and sunshine yellow are widely celebrated by wedding photographers because they provide a rich natural contrast against floral backdrops without washing out under strong daylight or studio flash."
      },
      {
        question: "What saree fabric is best when wet ubtan or turmeric paste is applied?",
        answer: "Breathable natural fibers like soft linen and cotton are ideal for sensitive skin. If you expect water splashes or flower petal showers, lightweight georgette or chiffon is excellent because it dries rapidly."
      },
      {
        question: "Can bridesmaids coordinate matching yellow sarees for the Haldi ritual?",
        answer: "Yes! Mukesh Saree Centre provides coordinated sets in chiffon, georgette, and linen so bridesmaids and close family members can achieve a cohesive, festive aesthetic."
      },
      {
        question: "How do I remove turmeric stains from my saree after the Haldi ritual?",
        answer: "Immediately rinse the stain in cold water (never hot). Rub gently with mild liquid detergent and dry in morning sunlight, which naturally fades curcumin stains without harsh chemicals."
      },
      {
        question: "How quickly can Mukesh Saree Centre deliver a Haldi saree across India?",
        answer: "All items listed on our website are in stock in our Gandhibagh showroom. Orders are dispatched within 24 to 48 hours with express door delivery across all major Indian cities."
      }
    ],
    relatedKeywords: [
      "yellow sarees for haldi",
      "haldi ceremony saree",
      "mustard yellow saree for haldi",
      "yellow chiffon saree haldi",
      "bridal haldi saree nagpur",
      "haldi function sarees"
    ]
  },
  "wholesale-sarees-for-boutiques": {
    title: "Wholesale Sarees for Boutiques & Resellers | Direct Weaver Bulk Rates – Mukesh Saree Centre",
    description: "Source wholesale sarees for boutiques, home resellers, and retail stores directly from Mukesh Saree Centre, Nagpur. Low MOQs, weaver-direct pricing & fast dispatch.",
    h1: "Wholesale Sarees for Boutiques & Resellers",
    intro: "Empower your boutique or online reselling venture with direct-from-weaver wholesale saree collections. Mukesh Saree Centre in Gandhibagh, Nagpur has supplied over 1,200+ boutique partners across India since 1978 with low MOQs, transparent pricing, and zero middleman markups.",
    filterCategory: "sarees",
    customFilter: (p) => {
      const text = ((p.fabric || "") + " " + p.name + " " + (p.category || "")).toLowerCase();
      return text.includes("linen") || text.includes("silk") || text.includes("chiffon") || text.includes("cotton");
    },
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        {/* Direct Answer Box */}
        <div className="p-5 bg-[#FAF6F0] border-l-4 border-[#B5894A] rounded-r-sm mb-8 text-[#2C241B]">
          <h2 className="text-lg font-serif font-bold mb-2 mt-0 text-[#2C241B]">
            Direct Answer: How Boutiques Can Source Directly from Mukesh Saree Centre
          </h2>
          <p className="text-sm leading-relaxed mb-0">
            Boutique owners, retail store buyers, and home-based fashion resellers can purchase high-margin sarees at <strong>direct weaver-matched wholesale rates</strong> directly from <strong>Mukesh Saree Centre</strong> in Gandhibagh, Nagpur. With an accessible Minimum Order Quantity (MOQ) of just 10 to 15 sarees across mixed designs, high-definition unbranded catalog photography, and pan-India insured cargo delivery, we help boutiques maximize margins without heavy capital commitment.
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          The Boutique Owner's Sourcing Advantage
        </h2>
        <p>
          Running a successful fashion boutique requires fresh weekly collections, fast inventory turns, and consistent product quality that keeps clients returning. Sourcing through mid-tier brokers or traveling to multiple distant textile markets erodes profit margins and drains valuable business hours.
        </p>
        <p>
          At <strong>Mukesh Saree Centre</strong>, we consolidate prime master looms from Surat, Varanasi, Chanderi, and Bangalore into our Gandhibagh showroom and wholesale fulfillment hub. By eliminating multi-layer distributor markups, our boutique partners routinely achieve <strong>40% to 80% retail profit margins</strong> while offering their customers exceptional fabric authenticity.
        </p>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Why Over 1,200+ Boutiques Source from Mukesh Saree Centre
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-5 bg-white border border-black/5 rounded shadow-2xs">
            <h3 className="font-serif font-bold text-base text-[#2C241B] m-0 mb-2">
              1. Accessible Low MOQs (10–15 Pieces)
            </h3>
            <p className="text-sm text-[#2C241B]/80 m-0 leading-relaxed">
              Test new fabrics and color palettes with minimal capital outlay. Mix different fabrics—such as linen, chiffon, cotton, and party wear—in a single wholesale parcel.
            </p>
          </div>
          <div className="p-5 bg-white border border-black/5 rounded shadow-2xs">
            <h3 className="font-serif font-bold text-base text-[#2C241B] m-0 mb-2">
              2. 100% Manual Quality Inspection
            </h3>
            <p className="text-sm text-[#2C241B]/80 m-0 leading-relaxed">
              Every saree is individually examined for weaving consistency, thread pulls, and uniform dye finish before dispatch, eliminating customer returns for your boutique.
            </p>
          </div>
          <div className="p-5 bg-white border border-black/5 rounded shadow-2xs">
            <h3 className="font-serif font-bold text-base text-[#2C241B] m-0 mb-2">
              3. Unbranded High-Resolution Media
            </h3>
            <p className="text-sm text-[#2C241B]/80 m-0 leading-relaxed">
              We provide professional, unwatermarked photographs and video clips that you can immediately publish on your boutique’s Instagram page and WhatsApp customer groups.
            </p>
          </div>
          <div className="p-5 bg-white border border-black/5 rounded shadow-2xs">
            <h3 className="font-serif font-bold text-base text-[#2C241B] m-0 mb-2">
              4. Insured Pan-India Express Logistics
            </h3>
            <p className="text-sm text-[#2C241B]/80 m-0 leading-relaxed">
              Fast parcel transport via BlueDart, DTDC, and trusted national transport cargo with GST invoicing and end-to-end tracking to every state and union territory.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          High-Velocity Saree Categories for Boutiques
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Daily & Workwear Linens:</strong> High-density pure linen and linen-cotton blends priced attractively for working professionals and teachers.
          </li>
          <li>
            <strong>Event Chiffons & Georgettes:</strong> Featherlight flowy drapes with lace and tassel accents for cocktail celebrations and sangeet parties.
          </li>
          <li>
            <strong>Festive Tissue & Paithani Silks:</strong> Regal heritage weaves for festive trousseau seekers and wedding guests.
          </li>
          <li>
            <strong>Malvika & Soft Crepe Drapes:</strong> Best-selling wrinkle-resistant daily wear sarees with consistent customer repeat orders.
          </li>
        </ul>

        {/* WhatsApp & B2B Lead CTA (No fake online checkout flow) */}
        <div className="p-6 md:p-8 bg-[#2C241B] text-white rounded-sm my-8 border border-[#B5894A]/30 not-prose">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5894A] font-bold block mb-1">
            B2B Wholesale Division • Estd. 1978
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-white mb-2 mt-0 font-medium">
            Request B2B Wholesale Catalog & Live Price Sheet
          </h3>
          <p className="text-sm text-white/80 mb-6 leading-relaxed max-w-2xl">
            Are you a boutique owner, showroom buyer, or online reseller? Chat directly with our wholesale team on WhatsApp to receive our live B2B catalog, wholesale tier pricing, and sample parcel details.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/919325034636?text=Hi%20Mukesh%20Saree%20Centre,%20I%20am%20a%20boutique%20owner%20interested%20in%20your%20wholesale%20saree%20catalog%20and%20price%20sheet."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#20b858] transition-all no-underline shadow-sm"
            >
              Chat on WhatsApp (+91 9325034636)
            </a>
            <a
              href="tel:+917020664641"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-[#B5894A] text-[#2C241B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#a0763d] transition-all no-underline"
            >
              Call Wholesale Desk (+91 7020664641)
            </a>
            <Link
              to="/contact/"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all no-underline"
            >
              Submit Wholesale Inquiry
            </Link>
          </div>
          <p className="text-[11px] text-white/50 font-mono mt-4 mb-0 uppercase tracking-wider">
            Low MOQ (10–15 Pcs) • GST Invoicing • Surface & Air Cargo
          </p>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Related Collections & Pages
        </h2>
        <p className="space-x-2">
          <Link to="/school-uniform-sarees/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">School Uniform Sarees</Link> •{" "}
          <Link to="/linen-sarees-for-office-wear/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Linen Sarees for Office Wear</Link> •{" "}
          <Link to="/saree-shop-in-nagpur/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur</Link> •{" "}
          <Link to="/about/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">About Mukesh Saree Centre</Link> •{" "}
          <Link to="/reviews/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Customer Reviews</Link> •{" "}
          <Link to="/contact/" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Contact & Showroom Visit</Link>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "What is the Minimum Order Quantity (MOQ) for boutique owners and resellers?",
        answer: "Our wholesale MOQ is designed for growing businesses, starting at just 10 to 15 sarees per order. You can mix and match different fabrics, colors, and styles in a single order."
      },
      {
        question: "Do you provide unbranded product photos and videos for boutique marketing?",
        answer: "Yes, all verified boutique buyers receive access to our high-resolution, unwatermarked digital media library for easy sharing across WhatsApp catalogs, Instagram, and boutique websites."
      },
      {
        question: "Can I mix different saree fabrics and styles within one wholesale order?",
        answer: "Absolutely. We encourage boutique buyers to curate balanced parcels containing linen office wear, party chiffons, and soft cottons to test client demand across multiple price points."
      },
      {
        question: "How are wholesale sarees packaged and shipped across India?",
        answer: "Wholesale consignments are packed in tamper-proof, moisture-resistant industrial packaging. We dispatch via premium air express or insured surface cargo depending on volume, with tracking provided immediately."
      },
      {
        question: "Do you issue official GST invoices for B2B accounting and tax credit?",
        answer: "Yes, every wholesale transaction is accompanied by a compliant GST tax invoice, enabling your business to claim full input tax credit (ITC)."
      }
    ],
    relatedKeywords: [
      "wholesale sarees for boutiques",
      "saree wholesale suppliers for resellers",
      "boutique saree wholesale nagpur",
      "direct weaver sarees wholesale",
      "low moq wholesale sarees",
      "surat wholesale sarees nagpur"
    ]
  },
};

export default function SeoLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  // Support both dynamic route param and explicit route paths cleanly
  const effectiveSlug = (
    slug ||
    location.pathname.split("/").filter(Boolean)[0] ||
    ""
  ).replace(/^\/+|\/+$/g, "");

  const pageData = effectiveSlug ? seoPagesData[effectiveSlug] : null;

  const isWholesaleOrUniform =
    effectiveSlug.includes("wholesale") || effectiveSlug.includes("uniform");

  // Filter some relevant products from real inventory
  const displayProducts = pageData
    ? products
        .filter((p) => {
          if (p.isVariant || p.isHidden) return false;
          if (pageData.customFilter) return pageData.customFilter(p);
          if (pageData.filterCategory) {
            return p.category.toLowerCase() === pageData.filterCategory.toLowerCase();
          }
          return true;
        })
        .slice(0, 12)
    : [];

  // Generate Combined Advanced Schemas dynamically
  const combinedSchema = useMemo(() => {
    if (!pageData) return null;
    const graph: any[] = [];

    // 1. Breadcrumb Schema (For ALL SEO Landing Pages)
    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": `https://mukeshsarees.com/${effectiveSlug}/#breadcrumb`,
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
          "name": pageData.h1,
          "item": `https://mukeshsarees.com/${effectiveSlug}/`
        }
      ]
    };
    graph.push(breadcrumbSchema);

    // 2. CollectionPage Schema (Where appropriate - collection landing pages)
    if (displayProducts.length > 0) {
      const collectionSchema = {
        "@type": "CollectionPage",
        "@id": `https://mukeshsarees.com/${effectiveSlug}/#collection`,
        "url": `https://mukeshsarees.com/${effectiveSlug}/`,
        "name": pageData.title,
        "description": pageData.description,
        "isPartOf": {
          "@id": "https://mukeshsarees.com/#website"
        },
        "breadcrumb": {
          "@id": `https://mukeshsarees.com/${effectiveSlug}/#breadcrumb`
        },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": displayProducts.length,
          "itemListElement": displayProducts.map((p, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "url": `https://mukeshsarees.com/product/${p.slug}/`,
            "name": p.name,
            "image": p.image
              ? p.image.startsWith("http")
                ? p.image
                : `https://mukeshsarees.com${p.image}`
              : undefined
          }))
        }
      };
      graph.push(collectionSchema);
    }

    // 3. Local Store / ClothingStore Schema for Nagpur showroom
    if (effectiveSlug === "saree-shop-in-nagpur" || effectiveSlug.includes("nagpur")) {
      const localStoreSchema = {
        "@type": "ClothingStore",
        "@id": "https://mukeshsarees.com/#organization",
        "name": BUSINESS_INFO.name,
        "image": "https://mukeshsarees.com/images/logo.webp",
        "telephone": BUSINESS_INFO.phone,
        "email": BUSINESS_INFO.email,
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": `${BUSINESS_INFO.address.street}, ${BUSINESS_INFO.address.area}`,
          "addressLocality": BUSINESS_INFO.address.city,
          "addressRegion": BUSINESS_INFO.address.region,
          "postalCode": BUSINESS_INFO.address.postalCode,
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "21.1504",
          "longitude": "79.1066"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "10:30",
            "closes": "21:00"
          }
        ],
        "hasMap": "https://maps.google.com/?q=Mukesh+Saree+Centre+Gandhibagh+Nagpur",
        "url": "https://mukeshsarees.com/saree-shop-in-nagpur/"
      };
      graph.push(localStoreSchema);
    }

    // 4. Article Schema referencing shared organization #organization
    const articleSchema = {
      "@type": "Article",
      "@id": `https://mukeshsarees.com/${effectiveSlug}/#article`,
      "isPartOf": {
        "@id": `https://mukeshsarees.com/${effectiveSlug}/`
      },
      "headline": pageData.title,
      "description": pageData.description,
      "image": "https://mukeshsarees.com/og-image.jpg",
      "datePublished": "2026-05-30T08:00:00+05:30",
      "dateModified": "2026-07-15T10:00:00+05:30",
      "mainEntityOfPage": `https://mukeshsarees.com/${effectiveSlug}/`,
      "author": {
        "@id": "https://mukeshsarees.com/#organization"
      },
      "publisher": {
        "@id": "https://mukeshsarees.com/#organization"
      }
    };
    graph.push(articleSchema);

    if (pageData.faqs && pageData.faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `https://mukeshsarees.com/${effectiveSlug}/#faq`,
        "mainEntity": pageData.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }

    // Return combined graph schema
    return {
      "@context": "https://schema.org",
      "@graph": graph
    };
  }, [pageData, effectiveSlug, displayProducts]);

  // Standalone FAQPage Schema (matching /guides/ and /faqs/)
  const faqSchema = useMemo(() => {
    if (!pageData?.faqs || pageData.faqs.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": pageData.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }, [pageData]);

  if (!pageData) {
    return <Navigate to="/shop/" replace />;
  }

  return (
    <div className="bg-[#FAF9F8]">
      <SEO
        title={pageData.title}
        description={pageData.description}
        url={`/${effectiveSlug}/`}
        schema={combinedSchema}
      />

      {faqSchema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        </Helmet>
      )}

      {/* Header Section */}
      <div className="bg-[#2C241B] text-white py-8 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <nav
            className="flex text-sm text-[var(--color-light)]/60 mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-[var(--color-light)] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 mt-0.5" />
            <span className="text-[var(--color-light)]" aria-current="page">
              {pageData.h1}
            </span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">
            {pageData.h1}
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-light)]/90 max-w-3xl leading-relaxed">
            {pageData.intro}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 md:p-12 shadow-sm border border-black/5 rounded-sm">
              {pageData.body}

              {/* FAQs Section */}
              {pageData.faqs.length > 0 && (
                <div className="mt-12 pt-8 border-t border-black/5">
                  <h2 className="text-2xl font-serif text-[var(--color-dark)] mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    {pageData.faqs.map((faq, idx) => (
                      <div key={idx}>
                        <h3 className="text-lg font-medium text-[var(--color-dark)] mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-[var(--color-dark)]/70">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Products & B2B Lead Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {isWholesaleOrUniform && (
                <div className="bg-[#FAF6F0] p-6 rounded-sm border border-[#B5894A]/30 shadow-sm not-prose">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5894A] font-bold block mb-1">
                    B2B & Institutional Desk
                  </span>
                  <h3 className="text-xl font-serif text-[#2C241B] mb-2 font-semibold">
                    {effectiveSlug.includes("school")
                      ? "School Uniform Quotation"
                      : "Wholesale Boutique Catalog"}
                  </h3>
                  <p className="text-xs text-[#2C241B]/75 leading-relaxed mb-4">
                    {effectiveSlug.includes("school")
                      ? "Request institutional dye-lot swatches, custom crest border samples, and school faculty bulk pricing."
                      : "Access weaver-direct wholesale prices, low MOQs (10-15 pcs), and unwatermarked catalog imagery for boutiques."}
                  </p>
                  <div className="space-y-2.5">
                    <a
                      href={`https://wa.me/919325034636?text=${encodeURIComponent(
                        effectiveSlug.includes("school")
                          ? "Hi Mukesh Saree Centre, I need a bulk quote and fabric swatches for school uniform sarees."
                          : "Hi Mukesh Saree Centre, I am a boutique owner interested in your wholesale saree catalog and price sheet."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#20b858] transition-all shadow-sm no-underline"
                    >
                      Chat on WhatsApp (+91 9325034636)
                    </a>
                    <a
                      href="tel:+917020664641"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#2C241B]/20 text-[#2C241B] font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-[#FAF9F8] transition-all no-underline"
                    >
                      Call Showroom (+91 7020664641)
                    </a>
                    <Link
                      to="/contact/"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2C241B] text-white font-semibold text-xs uppercase tracking-wider rounded-sm hover:bg-[#3D2C23] transition-all no-underline"
                    >
                      Submit In-Depth Inquiry
                    </Link>
                  </div>
                  <div className="mt-4 pt-4 border-t border-black/5 text-[11px] text-[#2C241B]/60 space-y-1">
                    <p>✓ Minimum Order Quantity from 10-15 sarees</p>
                    <p>✓ Physical sample swatch courier available</p>
                    <p>✓ Pan-India insured cargo & GST invoice</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-serif text-[var(--color-dark)] mb-6">
                  {isWholesaleOrUniform
                    ? "Sample Saree Swatches"
                    : "Explore Collection"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {displayProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    to="/shop/"
                    className="inline-block bg-[var(--color-dark)] text-white px-6 py-3 rounded-sm text-sm uppercase tracking-widest font-medium hover:bg-[var(--color-dark)]/90 transition-colors"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
