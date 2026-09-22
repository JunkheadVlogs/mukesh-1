import fs from "fs";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createStaticPage } from "./prerenderHelper.js";

// To avoid window/document not defined errors when importing React files, we mock them minimally
if (typeof global !== "undefined") {
  (global as any).window = {};
  (global as any).document = {
    createElement: () => ({}),
  };
}

// Read the clean index HTML
const distPath = path.resolve(process.cwd(), "dist");
const cleanHtmlPath = path.join(distPath, "index-clean.html");

import { BUSINESS_INFO } from "../src/config/business.js";

if (!fs.existsSync(cleanHtmlPath)) {
  console.error("clean HTML not found");
  process.exit(1);
}
let baseHtml = fs.readFileSync(cleanHtmlPath, "utf-8");

// Generate Header and Footer skeleton (copied from prerender.ts)
function getHeaderHtml(): string {
  return `
    <header style="background: rgba(250, 246, 240, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.04); font-family: 'Playfair Display', serif; position: sticky; top: 0; z-index: 100;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <a href="/" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
          <img src="/images/logo.webp" alt="${BUSINESS_INFO.name} Logo" style="width: auto; height: auto; min-width: 160px; max-width: 180px; object-fit: contain;" />
        </a>
      </div>
      <nav style="display: flex; gap: 24px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px;">
        <a href="/shop" style="text-decoration: none; color: #1a0a00; padding: 4px 0;">Shop</a>
        <a href="/shop?category=Sarees" style="text-decoration: none; color: #1a0a00; padding: 4px 0;">Sarees</a>
        <a href="/contact" style="text-decoration: none; color: #1a0a00; padding: 4px 0;">Contact</a>
      </nav>
    </header>
  `;
}

function getFooterHtml(): string {
  return `
    <footer style="background-color: #1A0A00; color: #faf6f0; padding: 80px 32px; font-family: 'Inter', sans-serif; border-top: 1px solid rgba(255,255,255,0.05);">
      <div style="text-align: center; border-top: 1px solid rgba(250,246,240,0.08); padding-top: 24px; margin-top: 64px; font-size: 12px; opacity: 0.55; color: #faf6f0;">
        &copy; ${BUSINESS_INFO.established} - 2026 ${BUSINESS_INFO.name} ${BUSINESS_INFO.address.city}. All Rights Reserved. Specializing in luxury silk drapes and designer ethnic ensembles.
      </div>
    </footer>
  `;
}

// We will define the pages map directly to avoid ESM import issues with react-helmet-async
const seoPagesData: Record<
  string,
  {
    title: string;
    description: string;
    h1: string;
    intro: string;
    body: React.ReactNode;
    faqs: { question: string; answer: string }[];
  }
> = {
  "malvika-saree": {
    title: `Malvika Saree - Premium Collection | ${BUSINESS_INFO.name} ${BUSINESS_INFO.address.city}`,
    description: `Shop authentic Malvika sarees from ${BUSINESS_INFO.name} in Gandhibagh, ${BUSINESS_INFO.address.city}. Lightweight, silky-soft, easy-drape sarees ideal for daily wear, office, and events.`,
    h1: "Malvika Saree Collection",
    intro:
      "A Malvika saree is a soft, lightweight, and easy-to-drape everyday saree known for its breathable comfort, subtle luster, and effortless maintenance. Explore our exclusive collection curated by Mukesh Saree Centre in Gandhibagh, Nagpur.",
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
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
            >
              Get Store Address & Directions
            </a>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Related Collections & Pages
        </h2>
        <p className="space-x-2">
          <a href="/sarees/cotton-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Pure Cotton Sarees</a> •{" "}
          <a href="/sarees/linen-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Linen Sarees</a> •{" "}
          <a href="/uniform-saree" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Institutional Uniform Sarees</a> •{" "}
          <a href="/saree-shop-in-nagpur" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur Guide</a> •{" "}
          <a href="/mukesh-saree" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Mukesh Saree Legacy</a> •{" "}
          <a href="/wholesalesarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wholesale Sarees Nagpur</a>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "What is a Malvika saree and why is it popular?",
        answer:
          "A Malvika saree is a lightweight, soft-drape saree made from micro-blend tissue fabrics. It is popular because it provides the elegance of a silk-blend saree with the breathable, wrinkle-free comfort required for daily wear and long office shifts.",
      },
      {
        question: "Is the Malvika saree suitable for summer and long wear?",
        answer:
          "Yes. The micro-blend fabric offers high breathability and a light touch against the skin, making it exceptionally comfortable for summer months and 8-10 hour work shifts.",
      },
      {
        question: "How should I wash and care for my Malvika saree?",
        answer:
          "Wash with gentle hand care or mild machine cycle in cold water using gentle detergent. Line dry in shade. Low-heat steam ironing on the reverse side keeps the fabric crisp.",
      },
      {
        question: "Where can I buy authentic Malvika sarees in Nagpur?",
        answer:
          "You can buy authentic Malvika sarees at Mukesh Saree Centre, located at Jagnath Road, Gandhibagh, Nagpur. We offer retail and wholesale rates with direct weaver connections.",
      },
      {
        question: "Does Mukesh Saree Centre offer nationwide shipping across India?",
        answer:
          "Yes! We provide fast, fully tracked shipping across India for both individual retail purchases and bulk wholesale orders.",
      },
      {
        question: "Can I buy Malvika sarees in bulk for wholesale or resale?",
        answer:
          "Yes, Mukesh Saree Centre caters to boutique owners, online resellers, and corporate buyers with wholesale catalog pricing and bulk shipping options.",
      },
    ],
  },
  "mukesh-saree": {
    title: `Mukesh Saree - Premium Indian Ethnic Wear Since ${BUSINESS_INFO.established} | ${BUSINESS_INFO.address.city}`,
    description: `Discover the legacy of ${BUSINESS_INFO.name} in Gandhibagh, ${BUSINESS_INFO.address.city}. Offering authentic Paithani, Banarasi silk, cotton, linen, Malvika, and uniform sarees since ${BUSINESS_INFO.established}.`,
    h1: `Mukesh Saree - A Legacy of Elegance Since ${BUSINESS_INFO.established}`,
    intro: `Mukesh Saree Centre is a landmark saree and ethnic wear store established in ${BUSINESS_INFO.established} in Gandhibagh, Nagpur, Maharashtra. Renowned for authentic silk, Paithani, Banarasi, linen, cotton, uniform sarees, and bridal lehengas at direct wholesale-matched rates.`,
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
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
            >
              Visit Showroom in Nagpur
            </a>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Our Saree Collections
        </h2>
        <p className="space-x-2">
          <a href="/saree-shop-in-nagpur" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Best Saree Shop in Nagpur Guide</a> •{" "}
          <a href="/sarees/paithani-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Pure Paithani Sarees</a> •{" "}
          <a href="/sarees/banarasi-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Banarasi Silk Sarees</a> •{" "}
          <a href="/malvika-saree" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Malvika Saree Collection</a> •{" "}
          <a href="/uniform-saree" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Institutional Uniform Sarees</a> •{" "}
          <a href="/wholesalesarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wholesale Sarees Nagpur</a>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Where is Mukesh Saree Centre located in Nagpur?",
        answer:
          "Mukesh Saree Centre is located at Jagnath Road, Gandhibagh, Itwari, Nagpur, Maharashtra, 440002. We are situated in Nagpur's main wholesale and retail textile market.",
      },
      {
        question: "Is Mukesh Saree Centre a retail or wholesale saree shop?",
        answer:
          "We function as both a leading saree wholesaler for boutique owners and resellers, and a retail store offering wholesale-matched prices to individual buyers and families.",
      },
      {
        question: "What types of sarees does Mukesh Saree Centre sell?",
        answer:
          "We offer pure silk Paithani, Banarasi zari, Kanjivaram, pure cotton, linen, Kota Doria, Malvika daily-wear sarees, institutional uniform sarees, and bridal lehengas.",
      },
      {
        question: "Do you offer video shopping for customers outside Nagpur?",
        answer:
          "Yes! We offer live video call shopping via WhatsApp (+91 9325034636). Our team shows fabrics, colors, and drapes in real-time with full home delivery.",
      },
      {
        question: "Are all silk sarees at Mukesh Saree Centre authentic?",
        answer:
          "Yes, all our silk sarees are sourced directly from handloom weaving centers with genuine fabric authenticity guarantees.",
      },
      {
        question: "How can I place a bulk or wholesale order?",
        answer:
          "You can place wholesale orders directly at our Gandhibagh store or by connecting with our bulk sales desk on WhatsApp (+91 9325034636).",
      },
    ],
  },
  "uniform-saree": {
    title:
      `Uniform Saree Collection | Corporate, School & Staff Sarees | ${BUSINESS_INFO.address.city}`,
    description:
      `Shop durable, color-matched uniform sarees for schools, hospitals, corporate offices, and hospitality staff at ${BUSINESS_INFO.name}, Nagpur. Bulk wholesale rates available.`,
    h1: "Uniform Sarees for Schools, Hospitals & Corporate Staff",
    intro:
      `Uniform sarees are durable, color-consistent, and easy-care sarees specifically manufactured for institutional, corporate, school, hospital, and hospitality staff uniforms. Explore Central India's leading bulk uniform saree supplier in Gandhibagh, Nagpur.`,
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
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
            >
              Visit Store in Gandhibagh Nagpur
            </a>
          </div>
        </div>

        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Explore Related Uniform & Saree Pages
        </h2>
        <p className="space-x-2">
          <a href="/teacher-uniform-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Teacher Uniform Sarees</a> •{" "}
          <a href="/school-uniform-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">School Uniform Sarees</a> •{" "}
          <a href="/hospital-uniform-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Hospital Uniform Sarees</a> •{" "}
          <a href="/corporate-uniform-sarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Corporate Uniform Sarees</a> •{" "}
          <a href="/saree-shop-in-nagpur" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Saree Shop in Nagpur Guide</a> •{" "}
          <a href="/malvika-saree" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Malvika Sarees</a> •{" "}
          <a href="/wholesalesarees" className="text-[#B5894A] underline font-medium hover:text-[#2C241B]">Wholesale Sarees Nagpur</a>
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Does Mukesh Saree Centre supply uniform sarees in bulk?",
        answer:
          "Yes. We are a major bulk uniform saree supplier in Central India, providing uniform sarees for schools, colleges, hospitals, hotels, and corporate offices.",
      },
      {
        question: "What is the minimum order quantity (MOQ) for uniform sarees?",
        answer:
          "We accommodate orders ranging from small staff groups (10-20 sarees) up to large institutional batches of 500+ sarees with consistent color matching.",
      },
      {
        question: "Can you guarantee exact color matching for future re-orders?",
        answer:
          "Yes. We maintain strict dye-lot records for all corporate and school clients so that new staff additions receive perfectly matched uniform sarees.",
      },
      {
        question: "Which fabric is recommended for daily teacher or staff uniform sarees?",
        answer:
          "Poly-crepe and poly-cotton blends are best because they offer wrinkle resistance, high durability, fast drying, and comfort during long shifts.",
      },
      {
        question: "Can we get sample swatches before placing a bulk uniform order?",
        answer:
          "Yes! We dispatch fabric sample swatches across India so institutional decision-makers can inspect quality and color before finalizing orders.",
      },
      {
        question: "Where is Mukesh Saree Centre located for in-person uniform selection?",
        answer:
          "We are located at Jagnath Road, Gandhibagh, Itwari, Nagpur, Maharashtra, 440002. You can inspect physical sample sets in our wholesale division.",
      },
    ],
  },
  "saree-shop-in-nagpur": {
    title:
      `Best Saree Shop in ${BUSINESS_INFO.address.city} Since ${BUSINESS_INFO.established} | ${BUSINESS_INFO.name}`,
    description:
      `Looking for an authentic saree shop in ${BUSINESS_INFO.address.city}? Visit ${BUSINESS_INFO.name} in Gandhibagh for Paithani, Banarasi, Cotton, Malvika, and Uniform Sarees. Established ${BUSINESS_INFO.established}.`,
    h1: `Best Saree Shop in ${BUSINESS_INFO.address.city}`,
    intro:
      `Mukesh Saree Centre is Nagpur's premier saree shop and leading saree wholesaler on Jagnath Road, Gandhibagh, Itwari, Nagpur. Trusted since 1978 for authentic Paithani, Banarasi silk, cotton, Malvika, and uniform sarees at direct weaver prices.`,
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <div className="p-5 bg-[#FAF6F0] border-l-4 border-[#B5894A] rounded-r-sm mb-8 text-[#2C241B]">
          <h2 className="text-lg font-serif font-bold mb-2 mt-0 text-[#2C241B]">
            Direct Answer: What is the Best Saree Shop in Nagpur?
          </h2>
          <p className="text-sm leading-relaxed mb-0">
            <strong>Mukesh Saree Centre</strong>, located at Jagnath Road, Gandhibagh, Itwari, Nagpur (Estd. 1978), is widely recognized as the premier saree shop and leading saree wholesaler in Nagpur. Offering an extensive collection of authentic Paithani silks, Banarasi weaves, Kota cottons, daily-wear <strong>Malvika sarees</strong>, and institutional <strong>uniform sarees</strong>, Mukesh Saree Centre combines direct weaver pricing with over 45 years of trusted craftsmanship and Pan-India delivery.
          </p>
        </div>

        <p>
          When you search for a <strong>saree shop in {BUSINESS_INFO.address.city}</strong> with a legacy of trust and quality, <em>{BUSINESS_INFO.name}</em> stands out. Since {BUSINESS_INFO.established}, we have been serving the community with authentic Indian traditional sarees directly from master handloom weavers.
        </p>
        <p>
          Whether you are looking for luxurious silk sarees in {BUSINESS_INFO.address.city}, traditional Paithani sarees, soft-drape Malvika sarees for daily office wear, or durable institutional uniform sarees for staff, our expansive Gandhibagh showroom provides an unmatched shopping experience.
        </p>

        {/* WhatsApp & Contact CTA */}
        <div className="p-6 bg-[#2C241B] text-white rounded-sm my-8 border border-[#B5894A]/30">
          <h3 className="text-xl font-serif text-white mb-2 mt-0 font-medium">
            Visit Store in Gandhibagh or Request WhatsApp Catalog
          </h3>
          <p className="text-sm text-white/80 mb-4 leading-relaxed">
            Discover Central India's finest collection of sarees at direct wholesale prices. Visit our Gandhibagh, Nagpur showroom or chat on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/919325034636?text=Hi%20Mukesh%20Saree%20Centre,%20I%20want%20to%20view%20your%20latest%20saree%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#B5894A] text-[#2C241B] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#a0763d] transition-all"
            >
              Chat on WhatsApp (+91 9325034636)
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
            >
              Store Location & Directions
            </a>
          </div>
        </div>
      </div>
    ),
    faqs: [
      {
        question: `Where is the best saree shop in ${BUSINESS_INFO.address.city}?`,
        answer: `${BUSINESS_INFO.name}, located at Jagnath Road, ${BUSINESS_INFO.address.area}, ${BUSINESS_INFO.address.city}, is widely regarded as one of the best and most trusted saree shops in ${BUSINESS_INFO.address.city}.`,
      },
      {
        question: `What types of sarees are available in ${BUSINESS_INFO.address.city} at ${BUSINESS_INFO.name}?`,
        answer: "We offer an extensive range including pure silk Paithani, Banarasi zari, cotton, linen, Malvika sarees, institutional uniform sarees, and designer bridal collections.",
      },
      {
        question: "Does Mukesh Saree Centre supply uniform sarees in bulk?",
        answer: "Yes, we are a primary supplier of uniform sarees for schools, hospitals, hotels, and corporate offices across Central India with dye-lot color consistency.",
      },
      {
        question: "Can I order online or schedule a video shopping call?",
        answer: "Yes! We offer live WhatsApp video shopping (+91 9325034636) and ship tracked orders across India.",
      },
    ],
  },
  "bridal-sarees-nagpur": {
    title:
      "Bridal Sarees in ${BUSINESS_INFO.address.city} | Wedding Lehengas | ${BUSINESS_INFO.name}",
    description:
      "Find exquisite bridal sarees in ${BUSINESS_INFO.address.city} at ${BUSINESS_INFO.name}. Shop designer wedding sarees, lehengas, and rich silks for your special day.",
    h1: "Exquisite Bridal Sarees in ${BUSINESS_INFO.address.city}",
    intro:
      "Your wedding day deserves the finest attire. ${BUSINESS_INFO.name} offers an exclusive collection of bridal sarees and lehengas to make your special moments unforgettable.",
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
  },
  "wedding-sarees": {
    title: "Wedding Sarees Collection | Buy Authentic Bridal Wear Online",
    description:
      "Shop stunning wedding sarees at ${BUSINESS_INFO.name}. Explore rich silks, heavy embroidery, and authentic Indian traditional bridal wear.",
    h1: "Premium Wedding Sarees",
    intro:
      "Celebrate life's biggest milestones with our exquisite collection of wedding sarees. Rich textures, vibrant hues, and masterful craftsmanship.",
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
  },
  "paithani-sarees": {
    title:
      "Authentic Paithani Sarees in ${BUSINESS_INFO.address.city} | ${BUSINESS_INFO.name}",
    description:
      "Shop genuine, hand-woven Paithani sarees at ${BUSINESS_INFO.name} in ${BUSINESS_INFO.address.city}. The pride of Maharashtra, available in rich colors and pure silk.",
    h1: "Authentic Paithani Sarees",
    intro:
      'The Paithani saree is a legacy of royalty. Known as the "Queen of Silks", these sarees are an essential part of Maharashtrian culture and heritage.',
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
  },
  "ethnic-wear-nagpur": {
    title:
      "Premium Ethnic Wear in ${BUSINESS_INFO.address.city} | Sarees, Suits & Lehengas",
    description:
      "Explore the finest ethnic wear in ${BUSINESS_INFO.address.city} at ${BUSINESS_INFO.name}. From daily wear kurtis and suits to heavy designer lehengas and sarees.",
    h1: "The Finest Ethnic Wear in ${BUSINESS_INFO.address.city}",
    intro:
      "From subtle daily wear to spectacular festive ensembles, our ethnic wear collection covers every aspect of traditional Indian clothing.",
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
  },
  "saree-buying-guide": {
    title:
      "Ultimate Saree Buying Guide | Tips & Advice | ${BUSINESS_INFO.name}",
    description:
      "Expert tips on how to buy the right saree for body type, occasion, and budget. Comprehensive saree buying guide by ${BUSINESS_INFO.name}.",
    h1: "The Ultimate Saree Buying Guide",
    intro:
      "Choosing the right saree can be overwhelming. As experts since ${BUSINESS_INFO.established}, we have created this guide to help you find the perfect drape for your lifestyle and body type.",
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
  },
  "saree-care-guide": {
    title: "Saree Care & Maintenance Guide | ${BUSINESS_INFO.name}",
    description:
      "Learn how to wash, store, and maintain your precious silk and cotton sarees. Expert saree care tips from ${BUSINESS_INFO.name}.",
    h1: "Saree Care & Maintenance Guide",
    intro:
      "A premium saree is an investment that can be passed down through generations. Learn the best practices for washing, folding, and storing your sarees to preserve their beauty.",
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
  },
  "corporate-uniform-sarees": {
    title: `Corporate Uniform Sarees for Front Desk & Staff | ${BUSINESS_INFO.name}`,
    description: `Premium corporate uniform sarees for front-desk executives, hospitality staff, corporate events & banks. Crisp wrinkle-free crepe & georgette at wholesale rates.`,
    h1: "Corporate Uniform Sarees",
    intro:
      "Project a cohesive, sophisticated corporate image with bespoke uniform sarees from Mukesh Saree Centre. Crafted from premium wrinkle-free crepe and georgette blends for executive teams, banks, and hospitality leaders.",
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
  },
  "school-uniform-sarees": {
    title: `School Uniform Sarees in Bulk & Wholesale | Mukesh Saree Centre Nagpur`,
    description: `Supplying durable, breathable school uniform sarees for teachers, administrative staff, and school faculty. Direct weaver pricing, bulk discounts & custom color matching.`,
    h1: "School Uniform Sarees",
    intro:
      "Outfit your school faculty and administrative staff in cohesive, dignified, and exceptionally comfortable school uniform sarees from Mukesh Saree Centre, Nagpur. Sourced directly from premier textile hubs since 1978.",
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
  },
  "teacher-uniform-sarees": {
    title: `Teacher Uniform Sarees for Schools & Colleges | Mukesh Saree Centre`,
    description: `Comfortable, elegant teacher uniform sarees designed for all-day classroom lecturing and campus mobility. Breathable linen blends, micro-crepe & khadi cotton at wholesale rates.`,
    h1: "Teacher Uniform Sarees",
    intro:
      "Designed specifically for teachers, lecturers, and academic professors who spend long hours on their feet. Experience non-creasing, lightweight drapes that combine professional authority with effortless comfort.",
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
  },
  "hospital-uniform-sarees": {
    title: `Hospital Uniform Sarees for Nurses & Healthcare Staff | ${BUSINESS_INFO.name}`,
    description: `Hygienic, easy-care hospital uniform sarees for nursing supervisors, healthcare administrators & hospital front desk teams. Stain-resistant, quick-drying poly-crepe.`,
    h1: "Hospital Uniform Sarees",
    intro:
      "Equip your hospital administration, nursing superintendents, and healthcare staff with hygienic, wrinkle-free, and stain-resistant uniform sarees from Nagpur's trusted textile distributor since 1978.",
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
  },
  "wholesale-sarees-nagpur": {
    title: `Wholesale Sarees in Nagpur | Direct Weaver Rates | ${BUSINESS_INFO.name}`,
    description: `Nagpur's premier wholesale saree dealer since 1978 in Gandhibagh & Itwari market. Bulk sarees, lehengas & uniform drapes at direct weaver prices with pan-India dispatch.`,
    h1: "Wholesale Sarees in Nagpur",
    intro:
      `Sourcing directly from India's master weaving clusters in Surat, Varanasi, Kanchipuram, and Kolkata, ${BUSINESS_INFO.name} on Jagnath Road, Gandhibagh is Nagpur and Vidarbha's leading wholesale saree distributor since 1978.`,
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
            <a
              href="/contact/"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-white/40 text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all"
            >
              Store Location & Directions
            </a>
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
  },
  "pure-linen-sarees": {
    title: `Pure Linen Sarees Online | Breathable Handcrafted Drapes | ${BUSINESS_INFO.name}`,
    description: `Shop pure linen sarees online at ${BUSINESS_INFO.name}. Sourced from fine flax fibers, breathable organic weaves, digital prints & zari borders. Free shipping across India.`,
    h1: "Pure Linen Sarees",
    intro: "Celebrated for their natural texture, breathability, and timeless organic appeal, our pure linen sarees bring effortless elegance to modern Indian wardrobes. Handcrafted from premium organic flax fibers, each drape balances lightweight comfort with refined, contemporary aesthetics.",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          The Art & Anatomy of Pure Linen Weaving
        </h2>
        <p>
          At <strong>{BUSINESS_INFO.name}</strong>, our pure linen sarees are woven using high-grade European and indigenous flax yarn ranging from 60s to 100s count. This superior thread density yields an airy, breathable weave that softens organically with every drape. Unlike synthetic blends that trap humidity, pure linen naturally regulates body temperature, making it the premier choice for India's warm tropical climates. The collection features crisp selvage borders, delicate tissue zari detailing, woven geometric pallus, and artistic digital prints ranging from Warli motifs to soft botanical florals.
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
          Serving discerning textile lovers since 1978 from Gandhibagh, Nagpur, {BUSINESS_INFO.name} inspects every linen weave for tensile strength, yarn purity, and print precision. With more than 30 curated linen styles in stock—spanning pure linens and premium linen-cotton blends—you enjoy authentic loom-finished textiles with dependable Cash on Delivery and pan-India doorstep delivery.
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
  },
  "soft-cotton-sarees": {
    title: `Soft Cotton Sarees Online | Daily Wear & Handloom | ${BUSINESS_INFO.name}`,
    description: `Discover soft cotton sarees at ${BUSINESS_INFO.name}. Premium khadi cotton, Jamdani weaves, tissue cotton & breathable blends with COD and free shipping across India.`,
    h1: "Soft Cotton Sarees",
    intro: "Soft cotton sarees represent the cornerstone of authentic Indian comfort and graceful everyday dressing. Spun from long-staple natural cotton yarns, our collection offers unparalleled softness against the skin, effortless pleating, and enduring elegance for every season.",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Natural Fibers & Gentle Comfort
        </h2>
        <p>
          Nothing rivals the pure comfort of a soft cotton saree for daily life. At <strong>{BUSINESS_INFO.name}</strong>, our soft cotton drapes are spun from combed, long-staple cotton threads that eliminate scratchiness and stiffness. The collection features hand-spun Khadi cottons, fine Jamdani weaves like our Lal Pari artisan drape, delicate tissue-cotton blends with festive floral printing, and airy cotton-linen fusions. Each saree is pre-washed and treated for natural suppleness, allowing the fabric to drape gracefully without puffing or resisting pleat formation.
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
          Since 1978, {BUSINESS_INFO.name} in Gandhibagh, Nagpur has championed traditional weavers and ethical cotton textile production. Every cotton saree is tested for colorfastness, breathable weave openness, and structural durability so you can enjoy easy maintenance and lasting beauty wash after wash. Shop our ready inventory with Cash on Delivery and express nationwide shipping.
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
  },
  "banarasi-silk-sarees": {
    title: `Banarasi Silk Sarees | Bridal & Festive Silks | ${BUSINESS_INFO.name} Nagpur`,
    description: `Explore luxury Banarasi and festive silk sarees at ${BUSINESS_INFO.name}. Handpicked zari weaves, tissue silks & bridal collections. Visit Gandhibagh showroom or order online.`,
    h1: "Banarasi Silk Sarees",
    intro: "Renowned across the globe as the crown jewel of Indian heritage, Banarasi silk sarees capture regal grandeur through rich textures, luminous sheen, and exquisite zari craftsmanship. A must-have in every bridal trousseau, these timeless weaves celebrate centuries of textile mastery.",
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
          While our digital catalog showcases selective contemporary festive silk and tissue drapes—such as our White Fendy Space Silk and Peacock Green Raga Tissue Silk—<strong>{BUSINESS_INFO.name}'s</strong> flagship multi-floor showroom in Gandhibagh, Nagpur houses an extensive physical vault of pure Katan silk Banarasis, lightweight georgette Banarasis, and traditional bridal ensembles. If you are seeking a specific weave, colorway, or bulk bridal trousseau order, our personal shopping team provides live video consultations directly from our Nagpur store.
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
          Founded in 1978, {BUSINESS_INFO.name} is Nagpur's premier family destination for wedding silks and festive wear. Every silk piece is hand-inspected for authentic zari purity, drape fluidity, and pristine finish. Enjoy transparent pricing, dedicated bridal consultation, Cash on Delivery, and pan-India insured shipping.
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
  },
  "designer-party-wear-sarees": {
    title: `Designer Party Wear Sarees Online | Cocktail & Festive Drapes | ${BUSINESS_INFO.name}`,
    description: `Shop designer party wear sarees online at ${BUSINESS_INFO.name}. Flowy georgettes, embroidered drapes, shimmer tissue & cocktail sarees with COD across India.`,
    h1: "Designer Party Wear Sarees",
    intro: "Make a captivating entrance at receptions, cocktail parties, and festive celebrations with our designer party wear sarees. Featuring fluid drapes, contemporary color palettes, and intricate artistic embellishments, these modern ensembles effortlessly blend glamour with comfort.",
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
          With over 45 years of textile leadership in Nagpur, <strong>{BUSINESS_INFO.name}</strong> curates trend-setting party wear sarees that deliver celebrity-inspired silhouettes at accessible direct-to-consumer pricing. Discover over a dozen handpicked designer drapes ready to ship with Cash on Delivery and complimentary delivery across India.
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
  },
};

async function run() {
  for (const [slug, data] of Object.entries(seoPagesData)) {
    const pData = data as any;
    console.log("[SEO PRERENDER] Generating /" + slug);

    const bodyContent = renderToString(pData.body);

    const fullBody = `
      <div style="background-color: #faf6f0; min-height: 100vh;">
        ${getHeaderHtml()}
        <main style="max-width: 800px; margin: 60px auto; padding: 0 24px; font-family: 'Inter', sans-serif; text-align: left;">
          <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; color: #1a0a00; margin-bottom: 24px; font-weight: 500;">${pData.h1}</h1>
          <p style="font-size: 16px; line-height: 1.8; color: #4a4a4a; margin-bottom: 40px; font-weight: 500;">${pData.intro}</p>
          <div style="background: white; border-radius: 4px; border: 1px solid rgba(0,0,0,0.05); padding: 32px; margin-bottom: 48px; line-height: 1.8; color: #4a4a4a;">
             ${bodyContent}
          </div>
          <div>
            <h2 style="font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 16px; color: #1a0a00;">Frequently Asked Questions</h2>
            ${pData.faqs
              .map(
                (f: any) => `
              <div style="margin-bottom: 16px;">
                <h3 style="font-size: 15px; font-weight: bold; color: #1a0a00; margin-bottom: 8px;">${f.question}</h3>
                <p style="font-size: 14px; color: #4a4a4a;">${f.answer}</p>
              </div>
            `,
              )
              .join("")}
          </div>
        </main>
        ${getFooterHtml()}
      </div>
    `;

    const pageOgTags = `<!-- Dynamic OG Tags -->
    <meta property="og:title" content="${pData.title}" />
    <meta property="og:description" content="${pData.description}" />
    <meta property="og:image" content="https://mukeshsarees.com/og-image.jpg" />
    <meta property="og:url" content="https://mukeshsarees.com/${slug}/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${BUSINESS_INFO.name}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pData.title}" />
    <meta name="twitter:description" content="${pData.description}" />
    <meta name="twitter:image" content="https://mukeshsarees.com/og-image.jpg" />
    <link data-rh="true" rel="canonical" href="https://mukeshsarees.com/${slug}/" />
    <!-- End Dynamic OG Tags -->`;

    const graph = [];
    
    // Breadcrumb Schema
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `https://mukeshsarees.com/${slug}/#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mukeshsarees.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": pData.h1,
          "item": `https://mukeshsarees.com/${slug}/`
        }
      ]
    });

    // FAQ Schema
    if (pData.faqs && pData.faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `https://mukeshsarees.com/${slug}/#faq`,
        "mainEntity": pData.faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      });
    }

    // Organization & Local Business & Article Schema
    graph.push({
      "@type": "Organization",
      "@id": "https://mukeshsarees.com/#organization",
      "name": "Mukesh Saree Centre",
      "url": "https://mukeshsarees.com/",
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
    });

    graph.push({
      "@type": "ClothingStore",
      "@id": "https://mukeshsarees.com/#localbusiness",
      "name": "Mukesh Saree Centre",
      "image": "https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png",
      "telephone": "+919325034636",
      "url": "https://mukeshsarees.com/",
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
    });

    graph.push({
      "@type": "Article",
      "@id": `https://mukeshsarees.com/${slug}/#article`,
      "isPartOf": {
        "@id": `https://mukeshsarees.com/${slug}/`
      },
      "headline": pData.title,
      "description": pData.description,
      "image": "https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png",
      "datePublished": "2026-05-30T08:00:00+05:30",
      "dateModified": "2026-07-15T10:00:00+05:30",
      "mainEntityOfPage": `https://mukeshsarees.com/${slug}/`,
      "author": {
        "@id": "https://mukeshsarees.com/#organization"
      },
      "publisher": {
        "@id": "https://mukeshsarees.com/#organization"
      }
    });

    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": graph
    };

    const phtml = createStaticPage({
      htmlTemplate: baseHtml,
      bodyHtml: fullBody,
      title: pData.title,
      description: pData.description,
      customOgTags: pageOgTags,
      schemaJson: combinedSchema
    });

    let finalHtml = phtml;
    // Post-processing to fully replace any leftover template string placeholders caused by quoting issues
    finalHtml = finalHtml.replace(/$\{BUSINESS_INFO\.name\}/g, "Mukesh Saree Centre");
    finalHtml = finalHtml.replace(/$\{BUSINESS_INFO\.address\.city\}/g, "Nagpur");
    finalHtml = finalHtml.replace(/$\{BUSINESS_INFO\.established\}/g, "1978");
    finalHtml = finalHtml.replace(/$\{BUSINESS_INFO\.phone\}/g, "+91 7020664641");
    finalHtml = finalHtml.replace(/$\{BUSINESS_INFO\.email\}/g, "info@mukeshsarees.com");
    finalHtml = finalHtml.replace(/$\{BUSINESS_INFO\.address\.area\}/g, "Gandhibagh");
    finalHtml = finalHtml.replace(/$\{BUSINESS_INFO\.address\.street\}/g, "Jagnath Road");
    finalHtml = finalHtml.replace(/$\{BUSINESS_INFO\.address\.fullAddress\}/g, "Jagnath Road, Gandhibagh, Nagpur");

    const dirPath = path.join(distPath, slug);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, "index.html"), finalHtml);
  }
}

run().catch(console.error);
