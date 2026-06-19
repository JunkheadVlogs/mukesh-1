export interface FAQ {
  question: string;
  answer: string;
}

export interface GuideMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  lastUpdated: string;
  image: string;
  relatedSlugs: string[];
  productCategories: string[];
  faqs: FAQ[];
}

export const guidesMeta: GuideMeta[] = [
  {
    id: "choose-perfect-saree",
    slug: "how-to-choose-the-perfect-saree",
    title: "How to Choose the Perfect Saree",
    description: "An in-depth guide on selecting the right saree for your body type, occasion, and personal style.",
    author: "Mukesh Saree Centre",
    date: "2024-05-10",
    lastUpdated: "2024-05-15",
    image: "https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695",
    relatedSlugs: ["saree-fabric-guide", "wedding-saree-guide", "party-wear-saree-guide"],
    productCategories: ["Sarees", "Silk Sarees", "Cotton Sarees"],
    faqs: [
      { question: "How do I choose a saree for my body type?", answer: "Consider fabrics that drape well. Georgette and chiffon are great for curving draping, while cotton gives structure. Taller individuals can carry bold prints, while petite figures shine in smaller motifs and narrow borders." },
      { question: "What is the best saree for a wedding?", answer: "Banarasi silk, Kanjeevaram, and heavy designer silk sarees are timeless choices for weddings due to their opulent look and rich heritage." },
      { question: "How do I ensure the color suits my skin tone?", answer: "Warm undertones look stunning in reds, golds, oranges, and earthy tones. Cool undertones pop in jewel tones like emerald, sapphire, and deep purples." }
    ]
  },
  {
    id: "linen-saree-buying-guide",
    slug: "linen-saree-buying-guide",
    title: "Linen Saree Buying Guide",
    description: "Everything you need to know about buying, identifying, and styling authentic linen sarees.",
    author: "Mukesh Saree Centre",
    date: "2024-05-11",
    lastUpdated: "2024-05-15",
    image: "https://ik.imagekit.io/tus1loev9/homepage/file_0000000019b871f8bffede768176be45.webp",
    relatedSlugs: ["cotton-saree-guide", "saree-fabric-guide", "saree-care-guide"],
    productCategories: ["Linen Sarees", "Daily Wear Sarees"],
    faqs: [
      { question: "How can I tell if a linen saree is pure?", answer: "Pure linen has natural slubs (small imperfections) in the weave. It feels cool to the touch and wrinkles easily, which is part of its organic charm." },
      { question: "Are linen sarees good for summer?", answer: "Absolutely. Linen is highly breathable and moisture-wicking, making it one of the most comfortable fabrics for hot and humid climates." },
      { question: "Do linen sarees need starching?", answer: "It depends on personal preference. Starching gives them a crisp, formal look, but they can also be worn soft for a more relaxed, casual drape." }
    ]
  },
  {
    id: "banarasi-saree-guide",
    slug: "banarasi-saree-guide",
    title: "Banarasi Saree Guide",
    description: "A comprehensive journey through the heritage, types, and styling of the majestic Banarasi saree.",
    author: "Mukesh Saree Centre",
    date: "2024-05-12",
    lastUpdated: "2024-05-16",
    image: "https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469",
    relatedSlugs: ["wedding-saree-guide", "how-to-choose-the-perfect-saree", "saree-care-guide"],
    productCategories: ["Banarasi Sarees", "Silk Sarees", "Bridal Wear"],
    faqs: [
      { question: "What makes a Banarasi saree authentic?", answer: "Authentic Banarasi sarees are handwoven in Varanasi using pure silk threads and genuine zari (gold or silver threads). Look for the float threads on the reverse side as a sign of handloom weaving." },
      { question: "How should I store my Banarasi saree?", answer: "Store them in a pure cotton cloth bag to let the fabric breathe. Avoid hanging them on metal hangers to prevent zari tarnishing, and refold them every few months to avoid permanent creases." },
      { question: "Can a Banarasi saree be worn for occasions other than weddings?", answer: "Yes, lighter variants like Banarasi georgette or organza are perfect for parties and festive gatherings." }
    ]
  },
  {
    id: "cotton-saree-guide",
    slug: "cotton-saree-guide",
    title: "Cotton Saree Guide",
    description: "Explore the variety, comfort, and everyday elegance of cotton sarees.",
    author: "Mukesh Saree Centre",
    date: "2024-05-13",
    lastUpdated: "2024-05-17",
    image: "https://ik.imagekit.io/tus1loev9/homepage/shopenterence.webp?updatedAt=1779907894298",
    relatedSlugs: ["linen-saree-buying-guide", "saree-fabric-guide"],
    productCategories: ["Cotton Sarees", "Daily Wear Sarees", "Uniform Sarees"],
    faqs: [
      { question: "What are the different types of cotton sarees?", answer: "Popular types include Chanderi from Madhya Pradesh, Gadwal from Telangana, Jamdani from Bengal, and pure staple cottons from various regions of India." },
      { question: "Do cotton sarees shrink after washing?", answer: "Pure cotton can experience minor shrinkage. It is recommended to hand wash them in cold water or dry clean the first time." },
      { question: "Is starch necessary for cotton sarees?", answer: "Starch is a personal choice. It gives the saree a crisp and firm drape, adding structure, but wearing it without starch makes it softer and more comfortable for long hours." }
    ]
  },
  {
    id: "uniform-saree-guide",
    slug: "uniform-saree-guide",
    title: "Uniform Saree Guide",
    description: "Your go-to resource for selecting durable, elegant, and comfortable uniform sarees for your organization.",
    author: "Mukesh Saree Centre",
    date: "2024-05-14",
    lastUpdated: "2024-05-17",
    image: "https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695",
    relatedSlugs: ["school-uniform-saree-guide", "teacher-uniform-saree-guide", "wholesale-saree-buying-guide"],
    productCategories: ["Uniform Sarees", "Corporate Wear", "Wholesale Sarees"],
    faqs: [
      { question: "What fabrics are best for uniform sarees?", answer: "Crepe, georgette-blends, and poly-cottons are excellent as they are wrinkle-resistant, easy to wash, and retain their color well over time." },
      { question: "Do you provide bulk discounts for corporate uniforms?", answer: "Yes, Mukesh Saree Centre specializes in wholesale uniform sarees with tiered pricing for large orders." },
      { question: "Can uniform sarees be customized with logos?", answer: "We offer customized weaving, printing, and embroidery options for bulk corporate orders to match your brand identity." }
    ]
  },
  {
    id: "saree-fabric-guide",
    slug: "saree-fabric-guide",
    title: "Saree Fabric Guide",
    description: "Understand the differences between silk, cotton, linen, georgette, and crepe to make informed buying decisions.",
    author: "Mukesh Saree Centre",
    date: "2024-05-15",
    lastUpdated: "2024-05-18",
    image: "https://ik.imagekit.io/tus1loev9/homepage/file_0000000019b871f8bffede768176be45.webp",
    relatedSlugs: ["how-to-choose-the-perfect-saree", "cotton-saree-guide", "linen-saree-buying-guide"],
    productCategories: ["Silk Sarees", "Cotton Sarees", "Linen Sarees", "Georgette Sarees"],
    faqs: [
      { question: "Which saree fabric is the easiest to drape?", answer: "Georgette and chiffon are typically the easiest fabrics to drape as they fall naturally and require minimal pleat setting." },
      { question: "Which fabric is best for plus-size women?", answer: "Fabrics that drape smoothly without adding volume, such as crepe, georgette, and soft silks, are highly flattering." },
      { question: "How do I choose between pure silk and art silk?", answer: "Pure silk is an investment piece, highly breathable, and heirloom quality. Art silk is more affordable, easier to maintain, and offers a similar look for casual occasions." }
    ]
  },
  {
    id: "saree-care-guide",
    slug: "saree-care-guide",
    title: "Saree Care Guide",
    description: "Expert tips on washing, storing, and maintaining your precious sarees to make them last generations.",
    author: "Mukesh Saree Centre",
    date: "2024-05-16",
    lastUpdated: "2024-05-18",
    image: "https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695",
    relatedSlugs: ["banarasi-saree-guide", "saree-fabric-guide"],
    productCategories: ["All Sarees", "Silk Sarees", "Cotton Sarees"],
    faqs: [
      { question: "Can I machine wash my sarees?", answer: "It is strictly not recommended for silk, handloom, or embellished sarees. Everyday synthetic or poly-cotton sarees may be machine washed on a gentle cycle, but hand washing is always safer." },
      { question: "How do I remove stains from a silk saree?", answer: "Do not use harsh chemicals. For minor stains, gently dab with cold water and mild baby shampoo. For stubborn stains, professional dry cleaning is highly recommended." },
      { question: "How should I iron a heavy zari saree?", answer: "Always iron on the reverse side using low heat. For extra protection, place a thin cotton cloth over the saree while ironing." }
    ]
  },
  {
    id: "saree-draping-guide",
    slug: "saree-draping-guide",
    title: "Saree Draping Guide",
    description: "Step-by-step instructions for mastering the art of saree draping, from the classic Nivi to regional styles.",
    author: "Mukesh Saree Centre",
    date: "2024-05-17",
    lastUpdated: "2024-05-19",
    image: "https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469",
    relatedSlugs: ["how-to-choose-the-perfect-saree", "party-wear-saree-guide"],
    productCategories: ["Sarees", "Ready to Wear"],
    faqs: [
      { question: "How many safety pins should I use?", answer: "Ideally, 3-4 safety pins are enough: one for the shoulder pleats, one for the waist pleats, and optionally one to secure the pallu to the blouse." },
      { question: "What is the Nivi drape?", answer: "The Nivi drape is the most common and universally recognized style of wearing a saree, originating from Andhra Pradesh. The pallu is pinned to the left shoulder." },
      { question: "Can I wear a saree without a petticoat?", answer: "While traditional draping requires an underskirt or petticoat for anchoring, modern styles often use shapewear or even pants as a base." }
    ]
  },
  {
    id: "wholesale-saree-buying-guide",
    slug: "wholesale-saree-buying-guide",
    title: "Wholesale Saree Buying Guide",
    description: "A business guide to sourcing high-quality sarees in bulk from trusted wholesalers in India.",
    author: "Mukesh Saree Centre",
    date: "2024-05-18",
    lastUpdated: "2024-05-20",
    image: "https://ik.imagekit.io/tus1loev9/homepage/billingcounter.webp?updatedAt=1779907894357",
    relatedSlugs: ["uniform-saree-guide"],
    productCategories: ["Wholesale Sarees", "Bulk Orders"],
    faqs: [
      { question: "What is the minimum order quantity (MOQ) for wholesale purchasing?", answer: "At Mukesh Saree Centre, the MOQ typically varies by catalog, but we accommodate small boutique owners with flexible bundle options." },
      { question: "How do I ensure quality when buying in bulk?", answer: "Always rely on trusted wholesalers with a physical presence and years of experience, like our 46-year legacy in Nagpur. We also offer sample sets before large commitments." },
      { question: "Can I get GST invoices for my wholesale purchases?", answer: "Yes, all bulk purchases for business purpose are billed with proper GST invoices allowing you to claim input tax credit." }
    ]
  },
  {
    id: "school-uniform-saree-guide",
    slug: "school-uniform-saree-guide",
    title: "School Uniform Saree Guide",
    description: "How to choose the most comfortable and durable sarees for school teachers and staff.",
    author: "Mukesh Saree Centre",
    date: "2024-05-19",
    lastUpdated: "2024-05-20",
    image: "https://ik.imagekit.io/tus1loev9/homepage/sareesection.webp?updatedAt=1779907895695",
    relatedSlugs: ["teacher-uniform-saree-guide", "uniform-saree-guide"],
    productCategories: ["Uniform Sarees", "School Uniforms"],
    faqs: [
      { question: "What is the best fabric for school uniforms?", answer: "Crepe and poly-cotton blends are ideal as they resist wrinkling throughout the long school day and are easy to maintain." },
      { question: "Can school uniforms be customized?", answer: "Yes, school logos or specific border stripes matching the school colors can be integrated into bulk orders." },
      { question: "Are uniform sarees supplied throughout the year?", answer: "Yes, Mukesh Saree Centre maintains steady production runs to ensure schools can request replacements mid-year." }
    ]
  },
  {
    id: "teacher-uniform-saree-guide",
    slug: "teacher-uniform-saree-guide",
    title: "Teacher Uniform Saree Guide",
    description: "A focus on elegant, professional, and comfortable saree designs specifically for educators.",
    author: "Mukesh Saree Centre",
    date: "2024-05-20",
    lastUpdated: "2024-05-21",
    image: "https://ik.imagekit.io/tus1loev9/homepage/file_0000000019b871f8bffede768176be45.webp",
    relatedSlugs: ["school-uniform-saree-guide", "uniform-saree-guide"],
    productCategories: ["Uniform Sarees", "Corporate Wear"],
    faqs: [
      { question: "What colors are best for teacher uniforms?", answer: "Subtle pastels, earth tones, and muted blues or pinks present a calm, authoritative, and approachable aesthetic." },
      { question: "Should teacher sarees have heavy borders?", answer: "No, minimalist borders and subtle prints are preferred for a professional academic environment." },
      { question: "Do you offer matching blouses?", answer: "Yes, all our uniform sarees come with pre-matched or running blouse pieces to ensure a cohesive look." }
    ]
  },
  {
    id: "party-wear-saree-guide",
    slug: "party-wear-saree-guide",
    title: "Party Wear Saree Guide",
    description: "Glamour meets tradition: How to choose the perfect spotlight-stealing saree for evening events.",
    author: "Mukesh Saree Centre",
    date: "2024-05-21",
    lastUpdated: "2024-05-22",
    image: "https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469",
    relatedSlugs: ["wedding-saree-guide", "banarasi-saree-guide", "how-to-choose-the-perfect-saree"],
    productCategories: ["Party Wear", "Designer Sarees", "Georgette Sarees"],
    faqs: [
      { question: "What fabrics say 'party ready'?", answer: "Net, sequence-work, organza, shimmer georgette, and satin provide the ultimate glamorous look for parties." },
      { question: "How do I style a party wear saree?", answer: "Pair with a contemporary blouse (like a halter neck, backless, or cape design) and bold statement jewelry. Keep the makeup complementary to the saree's intensity." },
      { question: "Are dark colors better for night events?", answer: "Deep colors like midnight blue, emerald green, and classic black naturally absorb light and create an elegant, slimming silhouette perfect for evening galas." }
    ]
  },
  {
    id: "wedding-saree-guide",
    slug: "wedding-saree-guide",
    title: "Wedding Saree Guide",
    description: "The ultimate compendium on selecting the most important drapes for the bride and her entourage.",
    author: "Mukesh Saree Centre",
    date: "2024-05-22",
    lastUpdated: "2024-05-23",
    image: "https://ik.imagekit.io/tus1loev9/homepage/lehengasection.webp?updatedAt=1779907894691",
    relatedSlugs: ["banarasi-saree-guide", "party-wear-saree-guide", "how-to-choose-the-perfect-saree"],
    productCategories: ["Bridal Sarees", "Banarasi Sarees", "Silk Sarees"],
    faqs: [
      { question: "What are the most popular bridal sarees in India?", answer: "Banarasi silk, Kanjeevaram silk, Paithani, and heavy Zardosi georgettes top the list for brides." },
      { question: "Should I buy my wedding saree online?", answer: "Yes, provided you buy from a trusted seller with heritage like Mukesh Saree Centre, where high-quality images and transparent policies guarantee satisfaction." },
      { question: "How long in advance should I buy my wedding saree?", answer: "It is best to purchase 2-3 months in advance to allow time for blouse stitching, embroidery work, and matching jewelry." }
    ]
  }
];
