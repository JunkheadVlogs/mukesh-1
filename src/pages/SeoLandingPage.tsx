import React, { useMemo } from "react";
import { useParams, Navigate, Link } from "react-router";
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
              to="/contact"
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
          <Link to="/sarees/cotton-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Pure Cotton Sarees</Link> •{" "}
          <Link to="/sarees/linen-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Linen Sarees</Link> •{" "}
          <Link to="/uniform-saree" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Institutional Uniform Sarees</Link> •{" "}
          <Link to="/saree-shop-in-nagpur" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur Guide</Link> •{" "}
          <Link to="/mukesh-saree" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Mukesh Saree Legacy</Link> •{" "}
          <Link to="/wholesalesarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wholesale Sarees Nagpur</Link>
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
              to="/contact"
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
          <Link to="/saree-shop-in-nagpur" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur Guide</Link> •{" "}
          <Link to="/sarees/paithani-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Pure Paithani Sarees</Link> •{" "}
          <Link to="/sarees/banarasi-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Banarasi Silk Sarees</Link> •{" "}
          <Link to="/malvika-saree" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Malvika Saree Collection</Link> •{" "}
          <Link to="/uniform-saree" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Institutional Uniform Sarees</Link> •{" "}
          <Link to="/wholesalesarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wholesale Sarees Nagpur</Link>
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
              to="/contact"
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
          <Link to="/teacher-uniform-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Teacher Uniform Sarees</Link> •{" "}
          <Link to="/school-uniform-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">School Uniform Sarees</Link> •{" "}
          <Link to="/hospital-uniform-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Hospital Uniform Sarees</Link> •{" "}
          <Link to="/corporate-uniform-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Corporate Uniform Sarees</Link> •{" "}
          <Link to="/saree-shop-in-nagpur" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Saree Shop in Nagpur Guide</Link> •{" "}
          <Link to="/malvika-saree" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Malvika Sarees</Link> •{" "}
          <Link to="/wholesalesarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wholesale Sarees Nagpur</Link>
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
      "Bridal Sarees in ${BUSINESS_INFO.address.city} | Wedding Lehengas | ${BUSINESS_INFO.name}",
    description:
      "Find exquisite bridal sarees in ${BUSINESS_INFO.address.city} at ${BUSINESS_INFO.name}. Shop designer wedding sarees, lehengas, and rich silks for your special day.",
    h1: "Exquisite Bridal Sarees in ${BUSINESS_INFO.address.city}",
    intro:
      "Your wedding day deserves the finest attire. ${BUSINESS_INFO.name} offers an exclusive collection of bridal sarees and lehengas to make your special moments unforgettable.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Searching for the perfect{" "}
          <strong>bridal sarees in ${BUSINESS_INFO.address.city}</strong>? Look
          no further. At ${BUSINESS_INFO.name}, we curate luxurious bridal
          collections featuring heavy embroidery, zardosi work, and imported
          fabrics.
        </p>
        <p>
          From vibrant red and gold Banarasi silks to contemporary designer{" "}
          <em>wedding sarees in ${BUSINESS_INFO.address.city}</em>, our bridal
          wear ensures you look breathtaking on your big day. We also offer
          elegant lehengas for sangeet and reception ceremonies.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Does ${BUSINESS_INFO.name} sell bridal sarees?",
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
      "wedding sarees in ${BUSINESS_INFO.address.city}",
      "lehengas in ${BUSINESS_INFO.address.city}",
      "bridal lehengas",
    ],
  },
  "wedding-sarees": {
    title: "Wedding Sarees Collection | Buy Authentic Bridal Wear Online",
    description:
      "Shop stunning wedding sarees at ${BUSINESS_INFO.name}. Explore rich silks, heavy embroidery, and authentic Indian traditional bridal wear.",
    h1: "Premium Wedding Sarees",
    intro:
      "Celebrate life's biggest milestones with our exquisite collection of wedding sarees. Rich textures, vibrant hues, and masterful craftsmanship.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          A wedding signifies a new beginning, and{" "}
          <strong>wedding sarees</strong> are an integral part of this beautiful
          journey. At ${BUSINESS_INFO.name}, our hand-picked wedding collection
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
      "${BUSINESS_INFO.name}",
    ],
  },
  "paithani-sarees": {
    title:
      "Authentic Paithani Sarees in ${BUSINESS_INFO.address.city} | ${BUSINESS_INFO.name}",
    description:
      "Shop genuine, hand-woven Paithani sarees at ${BUSINESS_INFO.name} in ${BUSINESS_INFO.address.city}. The pride of Maharashtra, available in rich colors and pure silk.",
    h1: "Authentic Paithani Sarees",
    intro:
      'The Paithani saree is a legacy of royalty. Known as the "Queen of Silks", these sarees are an essential part of Maharashtrian culture and heritage.',
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          If you are looking for pure, authentic{" "}
          <strong>Paithani sarees ${BUSINESS_INFO.address.city}</strong>, $
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
          "Where can I find real Paithani sarees in ${BUSINESS_INFO.address.city}?",
        answer:
          "${BUSINESS_INFO.name} in ${BUSINESS_INFO.address.city} houses a verified, authentic collection of premium Paithani sarees.",
      },
    ],
    relatedKeywords: [
      "silk sarees ${BUSINESS_INFO.address.city}",
      "traditional Indian sarees",
      "wedding sarees in ${BUSINESS_INFO.address.city}",
    ],
  },
  "ethnic-wear-nagpur": {
    title:
      "Premium Ethnic Wear in ${BUSINESS_INFO.address.city} | Sarees, Suits & Lehengas",
    description:
      "Explore the finest ethnic wear in ${BUSINESS_INFO.address.city} at ${BUSINESS_INFO.name}. From daily wear kurtis and suits to heavy designer lehengas and sarees.",
    h1: "The Finest Ethnic Wear in ${BUSINESS_INFO.address.city}",
    intro:
      "From subtle daily wear to spectacular festive ensembles, our ethnic wear collection covers every aspect of traditional Indian clothing.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          As a comprehensive hub for{" "}
          <strong>ethnic wear ${BUSINESS_INFO.address.city}</strong>, $
          {BUSINESS_INFO.name} offers far more than just sarees. We house an
          extensive range of dress materials, salwar suits, kurtis, and designer
          lehengas.
        </p>
        <p>
          Our mission is to provide <em>traditional Indian wear</em> that merges
          perfectly with contemporary tastes. Whether you need an elegant suit
          for an office party or a grand lehenga for a reception, our collection
          delivers unmatched quality since ${BUSINESS_INFO.established}.
        </p>
      </div>
    ),
    faqs: [
      {
        question:
          "Apart from sarees, what ethnic wear does ${BUSINESS_INFO.name} sell?",
        answer:
          "We sell a wide variety of ethnic wear including semi-stitched salwar suits, dress materials, kurtis, crop tops, and bridal lehengas.",
      },
      {
        question: "Can I buy lehengas in ${BUSINESS_INFO.address.city} here?",
        answer:
          "Yes, we have a vast array of lehengas in ${BUSINESS_INFO.address.city} suitable for weddings, sangeets, and festivals.",
      },
    ],
    relatedKeywords: [
      "lehengas in ${BUSINESS_INFO.address.city}",
      "Mukesh Saree",
      "designer sarees",
    ],
  },
  "saree-buying-guide": {
    title:
      "Ultimate Saree Buying Guide | Tips & Advice | ${BUSINESS_INFO.name}",
    description:
      "Expert tips on how to buy the right saree for body type, occasion, and budget. Comprehensive saree buying guide by ${BUSINESS_INFO.name}.",
    h1: "The Ultimate Saree Buying Guide",
    intro:
      "Choosing the right saree can be overwhelming. As experts since ${BUSINESS_INFO.established}, we have created this guide to help you find the perfect drape for your lifestyle and body type.",
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
    title: "Saree Care & Maintenance Guide | ${BUSINESS_INFO.name}",
    description:
      "Learn how to wash, store, and maintain your precious silk and cotton sarees. Expert saree care tips from ${BUSINESS_INFO.name}.",
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
      "${BUSINESS_INFO.name}",
      "Saree buying guide",
      "silk sarees ${BUSINESS_INFO.address.city}",
    ],
  },
  "corporate-uniform-sarees": {
    title:
      "Corporate Uniform Sarees | Professional Wear | ${BUSINESS_INFO.name}",
    description:
      "Shop premium corporate uniform sarees at ${BUSINESS_INFO.name}. Wrinkle-free, elegant, and perfect for office professionals and corporate teams.",
    h1: "Corporate Uniform Sarees",
    intro:
      "Enhance your corporate identity with our elegant corporate uniform sarees. Designed for comfort during long working hours and maintaining a crisp, professional look.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          At <strong>${BUSINESS_INFO.name}</strong>, we provide high-quality{" "}
          <strong>corporate uniform sarees</strong> crafted from premium crepe
          and georgette blends. These fabrics offer a wrinkle-free finish that
          ensures your team members always look their best.
        </p>
        <p>
          Whether for front-desk executives, hospitality staff, or corporate
          teams, our corporate sarees bring consistency and professionalism. We
          take bulk orders and offer customized color matching.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "What fabrics do you use for corporate sarees?",
        answer:
          "We primarily use durable crepe, poly-crepe, and georgette blends that require minimal ironing and remain crisp all day.",
      },
      {
        question: "Do you take bulk orders for corporate teams?",
        answer:
          "Yes, we specialize in bulk and wholesale orders with customized patterns and company branding.",
      },
    ],
    relatedKeywords: [
      "corporate sarees",
      "office wear sarees",
      "hospitality uniform sarees",
    ],
  },
  "school-uniform-sarees": {
    title: "School Uniform Sarees | Teachers & Staff | ${BUSINESS_INFO.name}",
    description:
      "Durable, professional school uniform sarees for teachers and administrative staff. Discover comfortable fabrics suited for everyday wear at ${BUSINESS_INFO.name}.",
    h1: "School Uniform Sarees",
    intro:
      "Empower your educational staff with comfortable and respectable school uniform sarees. Specially chosen fabrics to endure daily school activities.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          <strong>School uniform sarees</strong> need to strike the perfect
          balance between comfort and authority. At{" "}
          <strong>${BUSINESS_INFO.name}</strong>, we offer a specialized range
          of sarees tailored for school environments.
        </p>
        <p>
          Our poly-cotton and crepe sarees are breathable, easy to maintain, and
          come in subtle, elegant shades appropriate for educational
          institutions.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "What makes a good school uniform saree?",
        answer:
          "A good school uniform saree should be made of breathable, low-maintenance fabric like poly-cotton or crepe, allowing teachers to move freely throughout the day.",
      },
      {
        question: "Can schools order specific border designs?",
        answer:
          "Yes, we can provide specific borders and color combinations to match your school's official colors.",
      },
    ],
    relatedKeywords: [
      "school teacher sarees",
      "school uniform sarees",
      "poly-cotton sarees",
    ],
  },
  "teacher-uniform-sarees": {
    title:
      "Teacher Uniform Sarees | Comfortable Educational Wear | ${BUSINESS_INFO.name}",
    description:
      "Browse our exclusive collection of teacher uniform sarees at ${BUSINESS_INFO.name}. Look professional while commanding respect and staying comfortable.",
    h1: "Teacher Uniform Sarees",
    intro:
      "We honor educators by offering teacher uniform sarees that combine traditional grace with pragmatic comfort for the modern classroom.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          As a teacher, your attire speaks volumes.{" "}
          <strong>Teacher uniform sarees</strong> from{" "}
          <strong>${BUSINESS_INFO.name}</strong> are curated to provide an
          authoritative yet approachable appearance.
        </p>
        <p>
          Our sarees reflect modesty and elegance. From subtle prints to solid
          shades with contrasting borders, find the perfect uniform for your
          teaching staff.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Why choose ${BUSINESS_INFO.name} for teacher uniforms?",
        answer:
          "With decades of experience since ${BUSINESS_INFO.established}, we understand the fabric durability and aesthetic required for daily academic use.",
      },
      {
        question: "What colors are best for teacher sarees?",
        answer:
          "Muted tones, pastels, and earthy colors are most popular as they bring a calm and focused atmosphere to the classroom.",
      },
    ],
    relatedKeywords: ["teacher sarees", "uniform sarees", "daily wear silk"],
  },
  "hospital-uniform-sarees": {
    title:
      "Hospital Uniform Sarees | Healthcare Staff Wear | ${BUSINESS_INFO.name}",
    description:
      "Provide your hospital administration and healthcare staff with hygienic, comfortable, and unified hospital uniform sarees from ${BUSINESS_INFO.name}.",
    h1: "Hospital Uniform Sarees",
    intro:
      "Clean, subtle, and exceptionally comfortable. Our hospital uniform sarees are chosen for their resilience in fast-paced healthcare environments.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Healthcare professionals and administrative personnel require attire
          that is both comforting to patients and easy for staff to wash
          frequently. Our <strong>hospital uniform sarees</strong> are exactly
          that.
        </p>
        <p>
          Available in soft blues, pristine whites, and gentle greens, our
          selection of poly-blend sarees ensure that hospital staff look
          unified, professional, and composed.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Are the hospital sarees easily washable?",
        answer:
          "Yes, they are designed for frequent machine washing and quick drying, which is essential in a healthcare setting.",
      },
      {
        question: "Do you offer uniform sarees for reception staff?",
        answer:
          "Absolutely, we cater to all departments within a hospital, from nursing administration to front desk.",
      },
    ],
    relatedKeywords: [
      "hospital sarees",
      "nursing uniform sarees",
      "hospitality wear",
    ],
  },
};

export default function SeoLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const pageData = slug ? seoPagesData[slug] : null;

  if (!pageData) {
    return <Navigate to="/shop" replace />;
  }

  // Filter some relevant products
  const displayProducts = products
    .filter(
      (p) =>
        !p.isVariant &&
        (pageData.filterCategory
          ? p.category.toLowerCase() === pageData.filterCategory.toLowerCase()
          : true),
    )
    .slice(0, 12);

  // Generate Combined Advanced Schemas dynamically
  const combinedSchema = useMemo(() => {
    const graph = [];

    // 1. Breadcrumb Schema (For ALL SEO Landing Pages)
    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": `https://mukeshsarees.com/${slug}#breadcrumb`,
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
          "item": `https://mukeshsarees.com/${slug}`
        }
      ]
    };
    graph.push(breadcrumbSchema);

    // 2. FAQ Schema (ONLY if FAQs exist on the page)
    if (pageData.faqs && pageData.faqs.length > 0) {
      const faqSchemaObj = {
        "@type": "FAQPage",
        "@id": `https://mukeshsarees.com/${slug}#faq`,
        "mainEntity": pageData.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      };
      graph.push(faqSchemaObj);
    }

    // 3. Organization, LocalBusiness, Article (For Nagpur specific / all landing pages)
    // The instructions say "Keep Organization, LocalBusiness, WebSite schema."
    const organizationSchema = {
      "@type": "Organization",
      "@id": "https://mukeshsarees.com/#organization",
      "name": "Mukesh Saree Centre",
      "url": "https://mukeshsarees.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9325034636",
        "contactType": "sales",
        "areaServed": "IN",
        "availableLanguage": ["en", "hi", "mr"]
      },
      "sameAs": [
        "https://www.facebook.com/mukeshsareecentre",
        "https://www.instagram.com/mukeshsareecentre"
      ]
    };
    graph.push(organizationSchema);

    const localBusinessSchema = {
      "@type": "ClothingStore",
      "@id": "https://mukeshsarees.com/#localbusiness",
      "name": "Mukesh Saree Centre",
      "image": "https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png",
      "telephone": "+919325034636",
      "url": "https://mukeshsarees.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Jagnath Road, Itwari",
        "addressLocality": "Nagpur",
        "addressRegion": "Maharashtra",
        "postalCode": "440002",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "21.1528",
        "longitude": "79.1121"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "11:00",
        "closes": "21:00"
      },
      "priceRange": "₹₹"
    };
    graph.push(localBusinessSchema);

    const articleSchema = {
      "@type": "Article",
      "@id": `https://mukeshsarees.com/${slug}#article`,
      "isPartOf": {
        "@id": `https://mukeshsarees.com/${slug}`
      },
      "headline": pageData.title,
      "description": pageData.description,
      "image": "https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png",
      "datePublished": "2026-05-30T08:00:00+05:30",
      "dateModified": "2026-07-15T10:00:00+05:30",
      "mainEntityOfPage": `https://mukeshsarees.com/${slug}`,
      "author": {
        "@id": "https://mukeshsarees.com/#organization"
      },
      "publisher": {
        "@id": "https://mukeshsarees.com/#organization"
      }
    };
    graph.push(articleSchema);

    // Return combined graph schema
    return {
      "@context": "https://schema.org",
      "@graph": graph
    };
  }, [pageData, slug]);

  return (
    <div className="bg-[#FAF9F8]">
      <SEO
        title={pageData.title}
        description={pageData.description}
        url={`/${slug}`}
        schema={combinedSchema}
      />

      {/* Header Section */}
      <div className="bg-[#2C241B] text-white py-16 md:py-24">
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

          {/* Sidebar / Products */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <h3 className="text-xl font-serif text-[var(--color-dark)] mb-6">
                Explore Collection
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {displayProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/shop"
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
  );
}
