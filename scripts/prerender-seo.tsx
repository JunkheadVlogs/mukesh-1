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
    description: `Shop authentic Malvika sarees from ${BUSINESS_INFO.name} in ${BUSINESS_INFO.address.city}. Discover luxurious softness, elegant designs, and pure comfort.`,
    h1: "Malvika Saree Collection",
    intro:
      "Welcome to our exclusive Malvika saree collection. Known for its incredible softness, lightweight comfort, and graceful draping, the Malvika saree is a beloved choice for modern women who value both tradition and ease.",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          At <strong>{BUSINESS_INFO.name}</strong> (established{" "}
          {BUSINESS_INFO.established} in {BUSINESS_INFO.address.city}), we pride
          ourselves on offering the finest <strong>Malvika sarees</strong>.
          Whether you are seeking a saree for a casual gathering, an office
          event, or a festive celebration, the Malvika saree provides the
          perfect blend of elegance and all-day comfort.
        </p>
        <p>
          Each Malvika saree is crafted with attention to detail, ensuring rich
          colors and beautiful motifs that stand out. As a leading{" "}
          <em>saree shop in {BUSINESS_INFO.address.city}</em>, we ensure every
          piece meets our strict quality standards.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">
          Why Choose a Malvika Saree?
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Unmatched Softness:</strong> The fabric feels gentle against
            the skin.
          </li>
          <li>
            <strong>Perfect Draping:</strong> It falls gracefully, creating a
            flattering silhouette.
          </li>
          <li>
            <strong>Versatile Style:</strong> Suitable for daily wear, office
            environments, and intimate parties.
          </li>
        </ul>
      </div>
    ),
    faqs: [
      {
        question: "Where can I buy Malvika saree online?",
        answer: `You can buy authentic Malvika sarees online directly from the ${BUSINESS_INFO.name} website. We offer fast shipping across India.`,
      },
      {
        question: "Is the Malvika saree good for daily wear?",
        answer:
          "Yes! The lightweight and soft nature of the Malvika saree makes it exceptionally comfortable for daily wear and office use.",
      },
      {
        question: `Where is ${BUSINESS_INFO.name} located?`,
        answer: `${BUSINESS_INFO.name} is located at ${BUSINESS_INFO.address.street}, ${BUSINESS_INFO.address.area}, ${BUSINESS_INFO.address.city}, ${BUSINESS_INFO.address.region}.`,
      },
    ],
  },
  "mukesh-saree": {
    title: `Mukesh Saree - Premium Indian Ethnic Wear Since ${BUSINESS_INFO.established} | ${BUSINESS_INFO.address.city}`,
    description: `Discover the legacy of ${BUSINESS_INFO.name} in ${BUSINESS_INFO.address.city}. Offering an exquisite collection of premium sarees, lehengas, and ethnic wear since ${BUSINESS_INFO.established}.`,
    h1: `Mukesh Saree - A Legacy of Elegance Since ${BUSINESS_INFO.established}`,
    intro: `Welcome to ${BUSINESS_INFO.name}, your trusted destination for premium Indian ethnic wear in ${BUSINESS_INFO.address.city}. For over four decades, the name "Mukesh Saree" has been synonymous with quality, authenticity, and unparalleled customer service in the world of traditional Indian fashion.`,
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Established in {BUSINESS_INFO.established},{" "}
          <strong>{BUSINESS_INFO.name}</strong> has grown to become a premier{" "}
          <em>saree shop in {BUSINESS_INFO.address.city}</em>. We curate the
          finest fabrics and weaves from across India, presenting our customers
          with an unparalleled selection of <strong>Mukesh Saree</strong>{" "}
          collections, bridal wear, and festive ethnic attire.
        </p>
        <p>
          Our commitment is to bring the rich heritage of Indian textiles to
          modern women. From pure silk and Paithani to comfortable cottons and
          our signature Malvika sarees, every piece is chosen with care.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Who is ${BUSINESS_INFO.name}?",
        answer:
          "${BUSINESS_INFO.name} is a highly trusted, premium ethnic wear brand and store based in ${BUSINESS_INFO.address.city}, Maharashtra, established in ${BUSINESS_INFO.established}.",
      },
      {
        question: "What does ${BUSINESS_INFO.name} sell?",
        answer:
          "We sell a wide variety of premium ethnic wear including silk sarees, cotton sarees, bridal lehengas, uniform sarees, Malvika sarees, salwar suits, and designer wear.",
      },
      {
        question:
          "Is ${BUSINESS_INFO.name} a saree shop in ${BUSINESS_INFO.address.city}?",
        answer:
          "Yes, we are one of the oldest and most reputed saree shops in ${BUSINESS_INFO.address.city}, located at ${BUSINESS_INFO.address.street}, ${BUSINESS_INFO.address.area}.",
      },
    ],
  },
  "uniform-saree": {
    title:
      "Uniform Saree Collection | Corporate, School & Staff Sarees | ${BUSINESS_INFO.address.city}",
    description:
      "Shop durable and elegant uniform sarees for staff, schools, hospitals, and corporate use at ${BUSINESS_INFO.name}. Bulk orders available.",
    h1: "Uniform Sarees for Every Profession",
    intro:
      "${BUSINESS_INFO.name} offers a dedicated selection of high-quality uniform sarees designed for professionals, schools, hospitals, hospitality staff, and corporate teams.",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          A <strong>uniform saree</strong> needs to be more than just visually
          appealing; it requires durability for daily use, ease of maintenance,
          and comfort for long shifts. At ${BUSINESS_INFO.name}, we understand
          these requirements perfectly.
        </p>
        <p>
          Our collection of <em>staff uniform sarees</em> and{" "}
          <em>corporate uniform sarees</em> is available in various durable
          fabrics such as poly-crepe, georgette, and blended cotton. We provide
          consistent color matching for bulk orders, ensuring your team presents
          a unified and professional appearance.
        </p>
      </div>
    ),
    faqs: [
      {
        question: "Does ${BUSINESS_INFO.name} sell uniform sarees?",
        answer:
          "Yes, we offer a specialized collection of uniform sarees for corporate offices, hospitals, schools, and the hospitality sector.",
      },
      {
        question: "Are uniform sarees available for bulk or institutional use?",
        answer:
          "Absolutely. We cater to bulk wholesale and institutional orders, ensuring consistent quality and color matching.",
      },
      {
        question: "Which fabric is best for a uniform saree?",
        answer:
          "Crepe, georgette, and poly-cotton blends are usually best for uniform sarees because they are durable, easy to wash, and require little ironing.",
      },
    ],
  },
  "saree-shop-in-nagpur": {
    title:
      "Best Saree Shop in ${BUSINESS_INFO.address.city} Since ${BUSINESS_INFO.established} | ${BUSINESS_INFO.name}",
    description:
      "Looking for a authentic saree shop in ${BUSINESS_INFO.address.city}? Visit ${BUSINESS_INFO.name} for premium silk, bridal, and party wear sarees. Established ${BUSINESS_INFO.established}.",
    h1: "Your Trusted Saree Shop in ${BUSINESS_INFO.address.city}",
    intro:
      "Conveniently located in the heart of ${BUSINESS_INFO.address.city}, ${BUSINESS_INFO.name} is a landmark destination for ethnic wear enthusiasts.",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          When you search for a{" "}
          <strong>saree shop in ${BUSINESS_INFO.address.city}</strong> with a
          legacy of trust and quality, <em>${BUSINESS_INFO.name}</em> stands
          out. Since ${BUSINESS_INFO.established}, we have been serving the
          community with authentic Indian traditional sarees.
        </p>
        <p>
          Whether you are looking for luxurious silk sarees in $
          {BUSINESS_INFO.address.city}, traditional Paithani sarees, or modern
          party wear lehengas, our expansive showroom provides an unmatched
          shopping experience.
        </p>
      </div>
    ),
    faqs: [
      {
        question:
          "Where is the best saree shop in ${BUSINESS_INFO.address.city}?",
        answer:
          "${BUSINESS_INFO.name}, located at ${BUSINESS_INFO.address.area}, is widely regarded as one of the best and most trusted saree shops in ${BUSINESS_INFO.address.city}.",
      },
      {
        question:
          "What types of sarees are available in ${BUSINESS_INFO.address.city} at ${BUSINESS_INFO.name}?",
        answer:
          "We offer an extensive range including pure silk, cotton, Paithani, Malvika, uniform sarees, and designer bridal collections.",
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
    title: `Corporate Uniform Sarees | Professional Wear | ${BUSINESS_INFO.name}`,
    description: `Shop premium corporate uniform sarees at ${BUSINESS_INFO.name}. Wrinkle-free, elegant, and perfect for office professionals and corporate teams.`,
    h1: "Corporate Uniform Sarees",
    intro:
      "Enhance your corporate identity with our elegant corporate uniform sarees. Designed for comfort during long working hours and maintaining a crisp, professional look.",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          At <strong>{BUSINESS_INFO.name}</strong>, we provide high-quality{" "}
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
  },
  "school-uniform-sarees": {
    title: `School Uniform Sarees | Teachers & Staff | ${BUSINESS_INFO.name}`,
    description: `Durable, professional school uniform sarees for teachers and administrative staff. Discover comfortable fabrics suited for everyday wear at ${BUSINESS_INFO.name}.`,
    h1: "School Uniform Sarees",
    intro:
      "Empower your educational staff with comfortable and respectable school uniform sarees. Specially chosen fabrics to endure daily school activities.",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          <strong>School uniform sarees</strong> need to strike the perfect
          balance between comfort and authority. At{" "}
          <strong>{BUSINESS_INFO.name}</strong>, we offer a specialized range of
          sarees tailored for school environments.
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
  },
  "teacher-uniform-sarees": {
    title: `Teacher Uniform Sarees | Comfortable Educational Wear | ${BUSINESS_INFO.name}`,
    description: `Browse our exclusive collection of teacher uniform sarees at ${BUSINESS_INFO.name}. Look professional while commanding respect and staying comfortable.`,
    h1: "Teacher Uniform Sarees",
    intro:
      "We honor educators by offering teacher uniform sarees that combine traditional grace with pragmatic comfort for the modern classroom.",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          As a teacher, your attire speaks volumes.{" "}
          <strong>Teacher uniform sarees</strong> from{" "}
          <strong>{BUSINESS_INFO.name}</strong> are curated to provide an
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
        question: `Why choose ${BUSINESS_INFO.name} for teacher uniforms?`,
        answer: `With decades of experience since ${BUSINESS_INFO.established}, we understand the fabric durability and aesthetic required for daily academic use.`,
      },
      {
        question: "What colors are best for teacher sarees?",
        answer:
          "Muted tones, pastels, and earthy colors are most popular as they bring a calm and focused atmosphere to the classroom.",
      },
    ],
  },
  "hospital-uniform-sarees": {
    title: `Hospital Uniform Sarees | Healthcare Staff Wear | ${BUSINESS_INFO.name}`,
    description: `Provide your hospital administration and healthcare staff with hygienic, comfortable, and unified hospital uniform sarees from ${BUSINESS_INFO.name}.`,
    h1: "Hospital Uniform Sarees",
    intro:
      "Clean, subtle, and exceptionally comfortable. Our hospital uniform sarees are chosen for their resilience in fast-paced healthcare environments.",
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
    <meta data-rh="true" property="og:title" content="${pData.title}" />
    <meta data-rh="true" property="og:description" content="${pData.description}" />
    <meta data-rh="true" property="og:image" content="https://mukeshsarees.com/images/og-home.jpg" />
    <meta data-rh="true" property="og:url" content="https://mukeshsarees.com/${slug}" />
    <meta data-rh="true" property="og:type" content="website" />
    <meta data-rh="true" property="og:site_name" content="${BUSINESS_INFO.name}" />
    <meta data-rh="true" name="twitter:card" content="summary_large_image" />
    <meta data-rh="true" name="twitter:title" content="${pData.title}" />
    <meta data-rh="true" name="twitter:description" content="${pData.description}" />
    <meta data-rh="true" name="twitter:image" content="https://mukeshsarees.com/images/og-home.jpg" />
    <link data-rh="true" rel="canonical" href="https://mukeshsarees.com/${slug}" />
    <!-- End Dynamic OG Tags -->`;

    const phtml = createStaticPage({
      htmlTemplate: baseHtml,
      bodyHtml: fullBody,
      title: pData.title,
      description: pData.description,
      customOgTags: pageOgTags
    });

    const dirPath = path.join(distPath, slug);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(path.join(dirPath, "index.html"), phtml);
  }
}

run().catch(console.error);
