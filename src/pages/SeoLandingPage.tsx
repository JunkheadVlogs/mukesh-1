import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router';
import { SEO } from '../components/SEO';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store';
import { ChevronRight } from 'lucide-react';
import { generateFaqSchema } from '../utils';

// Shared AI-friendly SEO Data for landing pages
const seoPagesData: Record<string, {
  title: string;
  description: string;
  h1: string;
  intro: string;
  body: React.ReactNode;
  faqs: { question: string; answer: string }[];
  relatedKeywords: string[];
  filterCategory?: string;
}> = {
  'malvika-saree': {
    title: 'Malvika Saree - Premium Collection | Mukesh Saree Centre Nagpur',
    description: 'Shop authentic Malvika sarees from Mukesh Saree Centre in Nagpur. Discover luxurious softness, elegant designs, and pure comfort.',
    h1: 'Malvika Saree Collection',
    intro: 'Welcome to our exclusive Malvika saree collection. Known for its incredible softness, lightweight comfort, and graceful draping, the Malvika saree is a beloved choice for modern women who value both tradition and ease.',
    filterCategory: 'sarees',
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          At <strong>Mukesh Saree Centre</strong> (established 1978 in Nagpur), we pride ourselves on offering the finest <strong>Malvika sarees</strong>. Whether you are seeking a saree for a casual gathering, an office event, or a festive celebration, the Malvika saree provides the perfect blend of elegance and all-day comfort.
        </p>
        <p>
          Each Malvika saree is crafted with attention to detail, ensuring rich colors and beautiful motifs that stand out. As a leading <em>saree shop in Nagpur</em>, we ensure every piece meets our strict quality standards.
        </p>
        <h2 className="text-2xl font-serif text-[var(--color-dark)] mt-8 mb-4">Why Choose a Malvika Saree?</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Unmatched Softness:</strong> The fabric feels gentle against the skin.</li>
          <li><strong>Perfect Draping:</strong> It falls gracefully, creating a flattering silhouette.</li>
          <li><strong>Versatile Style:</strong> Suitable for daily wear, office environments, and intimate parties.</li>
        </ul>
      </div>
    ),
    faqs: [
      { question: 'Where can I buy Malvika saree online?', answer: 'You can buy authentic Malvika sarees online directly from the Mukesh Saree Centre website. We offer fast shipping across India.' },
      { question: 'Is the Malvika saree good for daily wear?', answer: 'Yes! The lightweight and soft nature of the Malvika saree makes it exceptionally comfortable for daily wear and office use.' },
      { question: 'Where is Mukesh Saree Centre located?', answer: 'Mukesh Saree Centre is located at Gyaneshwar Mandir Road, Tin Nul Chowk, Hansapuri, Nagpur, Maharashtra.' }
    ],
    relatedKeywords: ['Mukesh Saree', 'saree shop in Nagpur', 'traditional Indian sarees']
  },
  'mukesh-saree': {
    title: 'Mukesh Saree - Premium Indian Ethnic Wear Since 1978 | Nagpur',
    description: 'Discover the legacy of Mukesh Saree Centre in Nagpur. Offering an exquisite collection of premium sarees, lehengas, and ethnic wear since 1978.',
    h1: 'Mukesh Saree - A Legacy of Elegance Since 1978',
    intro: 'Welcome to Mukesh Saree Centre, your trusted destination for premium Indian ethnic wear in Nagpur. For over four decades, the name "Mukesh Saree" has been synonymous with quality, authenticity, and unparalleled customer service in the world of traditional Indian fashion.',
    filterCategory: 'sarees',
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Established in 1978, <strong>Mukesh Saree Centre</strong> has grown to become a premier <em>saree shop in Nagpur</em>. We curate the finest fabrics and weaves from across India, presenting our customers with an unparalleled selection of <strong>Mukesh Saree</strong> collections, bridal wear, and festive ethnic attire.
        </p>
        <p>
          Our commitment is to bring the rich heritage of Indian textiles to modern women. From pure silk and Paithani to comfortable cottons and our signature Malvika sarees, every piece is chosen with care.
        </p>
      </div>
    ),
    faqs: [
      { question: 'Who is Mukesh Saree Centre?', answer: 'Mukesh Saree Centre is a highly trusted, premium ethnic wear brand and store based in Nagpur, Maharashtra, established in 1978.' },
      { question: 'What does Mukesh Saree Centre sell?', answer: 'We sell a wide variety of premium ethnic wear including silk sarees, cotton sarees, bridal lehengas, uniform sarees, Malvika sarees, salwar suits, and designer wear.' },
      { question: 'Is Mukesh Saree Centre a saree shop in Nagpur?', answer: 'Yes, we are one of the oldest and most reputed saree shops in Nagpur, located at Tin Nul Chowk, Hansapuri.' }
    ],
    relatedKeywords: ['Mukesh Saree Centre', 'sarees in Nagpur', 'ethnic wear Nagpur']
  },
  'uniform-saree': {
    title: 'Uniform Saree Collection | Corporate, School & Staff Sarees | Nagpur',
    description: 'Shop durable and elegant uniform sarees for staff, schools, hospitals, and corporate use at Mukesh Saree Centre. Bulk orders available.',
    h1: 'Uniform Sarees for Every Profession',
    intro: 'Mukesh Saree Centre offers a dedicated selection of high-quality uniform sarees designed for professionals, schools, hospitals, hospitality staff, and corporate teams.',
    filterCategory: 'sarees',
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          A <strong>uniform saree</strong> needs to be more than just visually appealing; it requires durability for daily use, ease of maintenance, and comfort for long shifts. At Mukesh Saree Centre, we understand these requirements perfectly.
        </p>
        <p>
          Our collection of <em>staff uniform sarees</em> and <em>corporate uniform sarees</em> is available in various durable fabrics such as poly-crepe, georgette, and blended cotton. We provide consistent color matching for bulk orders, ensuring your team presents a unified and professional appearance.
        </p>
      </div>
    ),
    faqs: [
      { question: 'Does Mukesh Saree Centre sell uniform sarees?', answer: 'Yes, we offer a specialized collection of uniform sarees for corporate offices, hospitals, schools, and the hospitality sector.' },
      { question: 'Are uniform sarees available for bulk or institutional use?', answer: 'Absolutely. We cater to bulk wholesale and institutional orders, ensuring consistent quality and color matching.' },
      { question: 'Which fabric is best for a uniform saree?', answer: 'Crepe, georgette, and poly-cotton blends are usually best for uniform sarees because they are durable, easy to wash, and require little ironing.' }
    ],
    relatedKeywords: ['uniform sarees for women', 'staff uniform sarees', 'school uniform sarees']
  },
  'saree-shop-in-nagpur': {
    title: 'Best Saree Shop in Nagpur Since 1978 | Mukesh Saree Centre',
    description: 'Looking for a authentic saree shop in Nagpur? Visit Mukesh Saree Centre for premium silk, bridal, and party wear sarees. Established 1978.',
    h1: 'Your Trusted Saree Shop in Nagpur',
    intro: 'Conveniently located in the heart of Nagpur, Mukesh Saree Centre is a landmark destination for ethnic wear enthusiasts.',
    filterCategory: 'sarees',
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          When you search for a <strong>saree shop in Nagpur</strong> with a legacy of trust and quality, <em>Mukesh Saree Centre</em> stands out. Since 1978, we have been serving the community with authentic Indian traditional sarees.
        </p>
        <p>
          Whether you are looking for luxurious silk sarees in Nagpur, traditional Paithani sarees, or modern party wear lehengas, our expansive showroom provides an unmatched shopping experience.
        </p>
      </div>
    ),
    faqs: [
      { question: 'Where is the best saree shop in Nagpur?', answer: 'Mukesh Saree Centre, located at Hansapuri, is widely regarded as one of the best and most trusted saree shops in Nagpur.' },
      { question: 'What types of sarees are available in Nagpur at Mukesh Saree Centre?', answer: 'We offer an extensive range including pure silk, cotton, Paithani, Malvika, uniform sarees, and designer bridal collections.' }
    ],
    relatedKeywords: ['sarees in Nagpur', 'ethnic wear Nagpur', 'Mukesh Saree Centre Nagpur']
  },
  'bridal-sarees-nagpur': {
    title: 'Bridal Sarees in Nagpur | Wedding Lehengas | Mukesh Saree Centre',
    description: 'Find exquisite bridal sarees in Nagpur at Mukesh Saree Centre. Shop designer wedding sarees, lehengas, and rich silks for your special day.',
    h1: 'Exquisite Bridal Sarees in Nagpur',
    intro: 'Your wedding day deserves the finest attire. Mukesh Saree Centre offers an exclusive collection of bridal sarees and lehengas to make your special moments unforgettable.',
    filterCategory: 'sarees',
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Searching for the perfect <strong>bridal sarees in Nagpur</strong>? Look no further. At Mukesh Saree Centre, we curate luxurious bridal collections featuring heavy embroidery, zardosi work, and imported fabrics.
        </p>
        <p>
          From vibrant red and gold Banarasi silks to contemporary designer <em>wedding sarees in Nagpur</em>, our bridal wear ensures you look breathtaking on your big day. We also offer elegant lehengas for sangeet and reception ceremonies.
        </p>
      </div>
    ),
    faqs: [
      { question: 'Does Mukesh Saree Centre sell bridal sarees?', answer: 'Yes, we have an extensive and exclusive collection of premium bridal sarees and designer lehengas perfect for weddings.' },
      { question: 'Which saree is best for weddings?', answer: 'Rich silk sarees like Kanjivaram, Banarasi, and Paithani are traditional favorites. Designer georgette and net sarees with heavy embroidery are also very popular for modern weddings.' }
    ],
    relatedKeywords: ['wedding sarees in Nagpur', 'lehengas in Nagpur', 'bridal lehengas']
  },
  'wedding-sarees': {
    title: 'Wedding Sarees Collection | Buy Authentic Bridal Wear Online',
    description: 'Shop stunning wedding sarees at Mukesh Saree Centre. Explore rich silks, heavy embroidery, and authentic Indian traditional bridal wear.',
    h1: 'Premium Wedding Sarees',
    intro: 'Celebrate life\'s biggest milestones with our exquisite collection of wedding sarees. Rich textures, vibrant hues, and masterful craftsmanship.',
    filterCategory: 'sarees',
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          A wedding signifies a new beginning, and <strong>wedding sarees</strong> are an integral part of this beautiful journey. At Mukesh Saree Centre, our hand-picked wedding collection celebrates pure Indian tradition.
        </p>
        <p>
          Discover everything from classic reds and maroons to contemporary pastels. We provide detailed guidance to help brides and their families select the perfect <em>traditional Indian sarees</em> for every wedding function.
        </p>
      </div>
    ),
    faqs: [
      { question: 'How do I choose the right saree for a wedding or festival?', answer: 'For weddings, look for rich fabrics like Silk or Banarasi with zari work. Choose colors that complement your skin tone and match the time of the event (bright colors for day, deep tones or metallics for night).' },
      { question: 'Can I buy wedding sarees online?', answer: 'Yes, you can confidently purchase premium wedding sarees online through our secure website with fast pan-India delivery.' }
    ],
    relatedKeywords: ['traditional Indian sarees', 'festive sarees', 'Mukesh Saree Centre']
  },
  'paithani-sarees': {
    title: 'Authentic Paithani Sarees in Nagpur | Mukesh Saree Centre',
    description: 'Shop genuine, hand-woven Paithani sarees at Mukesh Saree Centre in Nagpur. The pride of Maharashtra, available in rich colors and pure silk.',
    h1: 'Authentic Paithani Sarees',
    intro: 'The Paithani saree is a legacy of royalty. Known as the "Queen of Silks", these sarees are an essential part of Maharashtrian culture and heritage.',
    filterCategory: 'sarees',
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          If you are looking for pure, authentic <strong>Paithani sarees Nagpur</strong>, Mukesh Saree Centre is your ultimate destination. We stock an impressive range of Yeola Paithani and traditional motifs like peacocks (morpankh) and lotuses.
        </p>
        <p>
          Woven from the finest silk, our Paithani sarees feature intricate zari pallus that add a touch of regal elegance, making them perfect for weddings and festive occasions.
        </p>
      </div>
    ),
    faqs: [
      { question: 'What makes Paithani sarees special?', answer: 'Paithani sarees are meticulously handwoven using pure silk and real gold or silver zari. The unique sloping border and intricate motif work on the pallu set them apart from all other silks.' },
      { question: 'Where can I find real Paithani sarees in Nagpur?', answer: 'Mukesh Saree Centre in Nagpur houses a verified, authentic collection of premium Paithani sarees.' }
    ],
    relatedKeywords: ['silk sarees Nagpur', 'traditional Indian sarees', 'wedding sarees in Nagpur']
  },
  'ethnic-wear-nagpur': {
    title: 'Premium Ethnic Wear in Nagpur | Sarees, Suits & Lehengas',
    description: 'Explore the finest ethnic wear in Nagpur at Mukesh Saree Centre. From daily wear kurtis and suits to heavy designer lehengas and sarees.',
    h1: 'The Finest Ethnic Wear in Nagpur',
    intro: 'From subtle daily wear to spectacular festive ensembles, our ethnic wear collection covers every aspect of traditional Indian clothing.',
    filterCategory: 'sarees',
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          As a comprehensive hub for <strong>ethnic wear Nagpur</strong>, Mukesh Saree Centre offers far more than just sarees. We house an extensive range of dress materials, salwar suits, kurtis, and designer lehengas.
        </p>
        <p>
          Our mission is to provide <em>traditional Indian wear</em> that merges perfectly with contemporary tastes. Whether you need an elegant suit for an office party or a grand lehenga for a reception, our collection delivers unmatched quality since 1978.
        </p>
      </div>
    ),
    faqs: [
      { question: 'Apart from sarees, what ethnic wear does Mukesh Saree Centre sell?', answer: 'We sell a wide variety of ethnic wear including semi-stitched salwar suits, dress materials, kurtis, crop tops, and bridal lehengas.' },
      { question: 'Can I buy lehengas in Nagpur here?', answer: 'Yes, we have a vast array of lehengas in Nagpur suitable for weddings, sangeets, and festivals.' }
    ],
    relatedKeywords: ['lehengas in Nagpur', 'Mukesh Saree', 'designer sarees']
  },
  'saree-buying-guide': {
    title: 'Ultimate Saree Buying Guide | Tips & Advice | Mukesh Saree Centre',
    description: 'Expert tips on how to buy the right saree for body type, occasion, and budget. Comprehensive saree buying guide by Mukesh Saree Centre.',
    h1: 'The Ultimate Saree Buying Guide',
    intro: 'Choosing the right saree can be overwhelming. As experts since 1978, we have created this guide to help you find the perfect drape for your lifestyle and body type.',
    filterCategory: 'sarees',
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Our <strong>saree buying guide</strong> is designed to simplify your shopping experience. Consider these three main factors when buying a saree: Occasion, Fabric, and Color.
        </p>
        <h3 className="text-xl font-serif text-[var(--color-dark)] mt-6 mb-2">1. Occasion matters</h3>
        <p>For weddings, opt for heavy silks or embroidered georgettes. For daily wear or office use, our <em>Malvika saree</em> or pure cotton sarees are the most breathable and comfortable choices.</p>
        <h3 className="text-xl font-serif text-[var(--color-dark)] mt-6 mb-2">2. Choosing the Fabric</h3>
        <p>Understanding fabrics is crucial. Silk provides grandeur, georgette offers a slimming drape, and cotton ensures coolness in summer.</p>
      </div>
    ),
    faqs: [
      { question: 'Which saree fabric makes you look slim?', answer: 'Lightweight and flowy fabrics like georgette, chiffon, and crepe drape naturally around the body, giving a slimming and elegant silhouette.' },
      { question: 'How do I know the quality of a silk saree?', answer: 'Authentic silk feels soft and warm to the touch. Look for the Silk Mark certification and check the luster, which should change slightly under different lighting.' }
    ],
    relatedKeywords: ['sarees online India', 'Malvika saree', 'traditional Indian sarees']
  },
  'saree-care-guide': {
    title: 'Saree Care & Maintenance Guide | Mukesh Saree Centre',
    description: 'Learn how to wash, store, and maintain your precious silk and cotton sarees. Expert saree care tips from Mukesh Saree Centre.',
    h1: 'Saree Care & Maintenance Guide',
    intro: 'A premium saree is an investment that can be passed down through generations. Learn the best practices for washing, folding, and storing your sarees to preserve their beauty.',
    filterCategory: 'sarees',
    body: (
      <div className="prose max-w-none text-[var(--color-dark)]/80 mb-12">
        <p>
          Proper <strong>saree care</strong> ensures the longevity of the fabric and the brilliance of the colors. Heavy wedding sarees and <em>uniform sarees</em> require different maintenance approaches.
        </p>
        <h3 className="text-xl font-serif text-[var(--color-dark)] mt-6 mb-2">Washing Silk and Zari</h3>
        <p>Never machine-wash heavy silks or sarees with embroidery. Always dry clean them. If water drops fall on a silk saree, wipe them immediately with a dry cloth.</p>
        <h3 className="text-xl font-serif text-[var(--color-dark)] mt-6 mb-2">Storage Tips</h3>
        <p>Store your sarees in a cool, dry place wrapped in a muslin cloth to allow the fabric to breathe while preventing zari from oxidizing.</p>
      </div>
    ),
    faqs: [
      { question: 'Can I wash a Malvika saree at home?', answer: 'Most Malvika sarees can be gently hand-washed using a mild detergent, but always check the specific care instructions on the label.' },
      { question: 'How to store heavy bridal sarees?', answer: 'Wrap them individually in unbleached cotton or muslin cloths. Refold them every few months to prevent permanent creasing and fabric tearing at the folds.' }
    ],
    relatedKeywords: ['Mukesh Saree Centre', 'Saree buying guide', 'silk sarees Nagpur']
  }
};

export default function SeoLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const pageData = slug ? seoPagesData[slug] : null;
  const products = useStore((state) => state.products);

  if (!pageData) {
    return <Navigate to="/shop" replace />;
  }

  // Filter some relevant products
  const displayProducts = products
    .filter(p => !p.isVariant && (pageData.filterCategory ? p.category.toLowerCase() === pageData.filterCategory.toLowerCase() : true))
    .slice(0, 12);

  // Generate FAQ Schema dynamically
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pageData.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="bg-[#FAF9F8]">
      <SEO
        title={pageData.title}
        description={pageData.description}
        url={`/${slug}`}
        schema={[faqSchema]}
      />

      {/* Header Section */}
      <div className="bg-[#2C241B] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <nav className="flex text-sm text-[var(--color-light)]/60 mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[var(--color-light)] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 mt-0.5" />
            <span className="text-[var(--color-light)]" aria-current="page">{pageData.h1}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">{pageData.h1}</h1>
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
                  <h2 className="text-2xl font-serif text-[var(--color-dark)] mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                    {pageData.faqs.map((faq, idx) => (
                      <div key={idx}>
                        <h3 className="text-lg font-medium text-[var(--color-dark)] mb-2">{faq.question}</h3>
                        <p className="text-[var(--color-dark)]/70">{faq.answer}</p>
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
              <h3 className="text-xl font-serif text-[var(--color-dark)] mb-6">Explore Collection</h3>
              <div className="grid grid-cols-2 gap-4">
                {displayProducts.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-6 text-center">
                 <Link to="/shop" className="inline-block bg-[var(--color-dark)] text-white px-6 py-3 rounded-sm text-sm uppercase tracking-widest font-medium hover:bg-[var(--color-dark)]/90 transition-colors">
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
