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
      "Malvika Saree - Premium Collection | ${BUSINESS_INFO.name} ${BUSINESS_INFO.address.city}",
    description:
      "Shop authentic Malvika sarees from ${BUSINESS_INFO.name} in ${BUSINESS_INFO.address.city}. Discover luxurious softness, elegant designs, and pure comfort.",
    h1: "Malvika Saree Collection",
    intro:
      "Welcome to our exclusive Malvika saree collection. Known for its incredible softness, lightweight comfort, and graceful draping, the Malvika saree is a beloved choice for modern women who value both tradition and ease.",
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          At <strong>${BUSINESS_INFO.name}</strong> (established $
          {BUSINESS_INFO.established} in ${BUSINESS_INFO.address.city}), we
          pride ourselves on offering the finest <strong>Malvika sarees</strong>
          . Whether you are seeking a saree for a casual gathering, an office
          event, or a festive celebration, the Malvika saree provides the
          perfect blend of elegance and all-day comfort.
        </p>
        <p>
          Each Malvika saree is crafted with attention to detail, ensuring rich
          colors and beautiful motifs that stand out. As a leading{" "}
          <em>saree shop in ${BUSINESS_INFO.address.city}</em>, we ensure every
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
        answer:
          "You can buy authentic Malvika sarees online directly from the ${BUSINESS_INFO.name} website. We offer fast shipping across India.",
      },
      {
        question: "Is the Malvika saree good for daily wear?",
        answer:
          "Yes! The lightweight and soft nature of the Malvika saree makes it exceptionally comfortable for daily wear and office use.",
      },
      {
        question: "Where is ${BUSINESS_INFO.name} located?",
        answer:
          "${BUSINESS_INFO.name} is located at ${BUSINESS_INFO.address.street}, ${BUSINESS_INFO.address.area}, ${BUSINESS_INFO.address.city}, ${BUSINESS_INFO.address.region}.",
      },
    ],
    relatedKeywords: [
      "Mukesh Saree",
      "saree shop in ${BUSINESS_INFO.address.city}",
      "traditional Indian sarees",
    ],
  },
  "mukesh-saree": {
    title:
      "Mukesh Saree - Premium Indian Ethnic Wear Since ${BUSINESS_INFO.established} | ${BUSINESS_INFO.address.city}",
    description:
      "Discover the legacy of ${BUSINESS_INFO.name} in ${BUSINESS_INFO.address.city}. Offering an exquisite collection of premium sarees, lehengas, and ethnic wear since ${BUSINESS_INFO.established}.",
    h1: "Mukesh Saree - A Legacy of Elegance Since ${BUSINESS_INFO.established}",
    intro:
      'Welcome to ${BUSINESS_INFO.name}, your trusted destination for premium Indian ethnic wear in ${BUSINESS_INFO.address.city}. For over four decades, the name "Mukesh Saree" has been synonymous with quality, authenticity, and unparalleled customer service in the world of traditional Indian fashion.',
    filterCategory: "sarees",
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Established in ${BUSINESS_INFO.established},{" "}
          <strong>${BUSINESS_INFO.name}</strong> has grown to become a premier{" "}
          <em>saree shop in ${BUSINESS_INFO.address.city}</em>. We curate the
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
    relatedKeywords: [
      "${BUSINESS_INFO.name}",
      "sarees in ${BUSINESS_INFO.address.city}",
      "ethnic wear ${BUSINESS_INFO.address.city}",
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
    filterCategory: "sarees",
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
    relatedKeywords: [
      "uniform sarees for women",
      "staff uniform sarees",
      "school uniform sarees",
    ],
  },
  "saree-shop-in-nagpur": {
    title: "Best Saree Shop in Nagpur | Saree Wholesaler Nagpur - Mukesh Saree Centre",
    description: "Looking for the best saree shop in Nagpur or a trusted saree wholesaler in Nagpur? Read our ultimate 6,000-word guide on Paithani, Banarasi, Cotton, and Uniform sarees on Jagnath Road, Itwari.",
    h1: "Best Saree Shop in Nagpur",
    intro: "The ultimate 6,000-word definitive guide to buying, sourcing, and styling the finest sarees in Nagpur. Written by generational textile experts at Mukesh Saree Centre.",
    filterCategory: "sarees",
    body: <SareeShopInNagpurArticle />,
    faqs: [
      {
        question: "Where is Mukesh Saree Centre located?",
        answer: "Mukesh Saree Centre is located at Jagnath Road, Itwari, Nagpur, Maharashtra, 440002. We are situated in the heart of Nagpur's historic textile trading district."
      },
      {
        question: "Is Mukesh Saree Centre a retail store or a wholesale store?",
        answer: "We are both! We function as a premier Saree Wholesaler Nagpur, supplying bulk stock to boutiques and resellers, while also welcoming retail walk-in shoppers at highly competitive wholesale-matched prices."
      },
      {
        question: "Do you supply uniform sarees in bulk?",
        answer: "Yes, we are a leading provider of Uniform Sarees Nagpur, catering to schools, colleges, corporate offices, healthcare facilities, and hospitality services with perfect color matching and high durability."
      },
      {
        question: "Do you provide shipping across India?",
        answer: "Absolutely. We offer secure, fully tracked Pan India Delivery for all individual retail purchases and high-volume wholesale commercial shipments."
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
      "Uniform Sarees Nagpur"
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
        "@context": "https://schema.org",
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
