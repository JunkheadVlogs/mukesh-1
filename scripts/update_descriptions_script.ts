import fs from 'fs';
import path from 'path';
import { products } from '../src/mockData.js';

// Pool definitions to build highly rich, customized, and non-repeating descriptions.
const coOrdFabrics = [
  "premium long-staple 100% pure cotton fabric, offering a soothing, exceptionally soft matte finish",
  "refined slub-textured premium organic cotton, designed to provide ultra-breathable cooling comfort and natural ease",
  "lightweight structural combed pure cotton, engineered for exceptional shape retention and gentle all-day softness",
  "richly woven high-density organic cotton, providing structured drape elegance with a fresh, airy feel",
  "exceptionally soft-washed mercerized pure cotton, showcasing a subtle luxurious luster and smooth touch",
  "premium-grade breathable khadi cotton weave, celebrating natural textures and unmatched heat-resistant wear",
  "premium-grade double-combed pure cotton with an extra-soft finish that drapes comfortably over any silhouette",
  "pure organic cotton fabric engineered with a lightweight breathable weave and structural longevity",
  "luxuriously soft, premium-weight cotton with a structured handle that hugs your silhouette beautifully",
  "breathable premium pure cotton showing a refined slub texture and soft-washed comfort",
  "high-grade premium organic cotton presenting a lightweight, breezy handle with natural thermoregulating fibers",
  "premium structured cotton weave that blends daily comfort with clean, modern structural lines"
];

const coOrdDesigns = [
  "subtle, clean-finished self-toned micro-piping and custom hand-stitched detailing near the neckline",
  "stunning, high-definition watercolor floral vines printed in rich contrasting pastel shades",
  "delicate traditional miniature hand-block floral boots that are spread elegantly across the fabric",
  "exquisite contemporary leaf motifs screen printed with organic vegetable dyes for a handcrafted look",
  "impeccable tonal threadwork embroidery with delicate classic button trims along the front placard",
  "meticulous contrast-color embroidery paired with understated delicate lace inserts on the cuffs",
  "vibrant multi-colored floral vine thread embroidery showcasing gorgeous traditional craftsmanship",
  "gorgeous tone-on-tone fine needlework motifs that outline the sleek keyhole neckline beautifully",
  "exquisite hand-guided floral embroidery and a modern geometric threadwork border design",
  "gorgeous modern abstract floral block printing accented with a fine geometric border motif",
  "dainty, hand-finished lace overlays and custom-tailored coordinating side-slits",
  "chic, clean-cut modern design highlights with subtle contrasting shoulder and hem embroidery lines"
];

const linenFabrics = [
  "handloaded premium natural linen woven from the finest organic flax fibers",
  "breathable and crisp natural linen-cotton blend that softens beautifully with every wear",
  "premium-grade linen displaying characteristic slub textures and a cooling open-weave structure",
  "incredibly soft finished, lightweight linen weave that drapes flawlessly without starching",
  "pure organic linen featuring a luxurious, rich handle and a beautifully structured fluid fall",
  "artisanal slub linen offering exceptional breathability and a cooling sensation in warm climates",
  "select high-twist pure linen yarn with a lightweight, relaxed feel perfect for tropical comfort",
  "premium combed natural flax linen showcasing a fine cellular weave and rich tactile grip",
  "luxurious linen-cotton slub presenting an elegant drape and a subtle, sophisticated natural texture",
  "breathable natural linen weave pre-washed for exceptionally soft touch and graceful drape",
  "hand-loomed organic linen characterized by high moisture-wicking and a light breezy feel",
  "premium light-weave linen displaying an authentic hand-spun structure and elegant fall",
  "refined flax linen fabric with a lightweight, airy touch and a sophisticated structured drape",
  "soft-washed natural slub linen combining a breezy open weave with a premium luxurious handle",
  "premium-grade natural linen offering an exceptionally cool feel and a fluid, non-stiff drape"
];

const linenDesigns = [
  "delicate watercolor garden peonies and contrasting botanical vine prints across the body",
  "stunning hand-screened watercolor-style botanical scroll patterns and floral leaf designs",
  "intricate tribal-inspired geometric line prints combined with a contrasting solid border",
  "authentic Warli dance postures screen-printed along the pallu with delicate border accents",
  "exquisite hand-illustrated floral vines and an artistic floral patch design on the pallu",
  "whimsical handcrafted bird and foliage motifs screen-printed with rich dye detailing",
  "bold abstract contrasting tie-dye shibori patterns and hand-tied tassel fringes",
  "delicate rose-petal scatter printing and elegant multi-colored border stripes",
  "traditional folk-art narratives of elephants and dancers printed in classic earthy tones",
  "scenic garden illustrations and delicate blossom trails on a beautifully finished base",
  "sophisticated geometric checkerboards and fine hand-woven metallic zari border lines",
  "impeccable silver stripe weaving and vertical metallic accents that catch the light beautifully",
  "exquisite peacock and floral artistic print layouts highlighted by elegant border details",
  "vibrant multicolor traditional vines and intricate mandala woven pallu-end decorations",
  "delicate paisley woven borders and artistic botanical leaf silhouettes on the drape"
];

const occasionPools = [
  "high-profile corporate daytime presentations, casual boardrooms, or a chic weekend brunch",
  "laid-back daytime business meetings, sophisticated gallery walks, or cozy family lunches",
  "upscale high-tea gatherings, festive daytime celebrations, and stylish weekend brunches",
  "chic airport looks, elevated working days, or an interactive cultural panel discussion",
  "formal daytime business seminars, elegance garden lunches, and high-end boutique openings",
  "traditional morning prayer ceremonies, cultural panel events, or elegant family get-togethers",
  "sophisticated daytime birthday celebrations, botanical garden walks, and refined casual outings",
  "exclusive corporate lunches, professional conferences, or casual elegant dinner dates"
];

const festiveOccasionPools = [
  "glamorous sangeet dance nights, high-end evening reception dinners, or grand festive galas",
  "regal wedding afterparties, ceremonial family gatherings, and high-fashion evening receptions",
  "dazzling festive celebrations, cocktail parties, and spectacular traditional holiday dinners",
  "contemporary wedding bashes, upscale festive card parties, and grand evening functions",
  "traditional wedding ceremonies, auspicious festive gatherings, and luxurious evening celebrations"
];

const uspPools = [
  "its innovative easy-care finish keeps the garment virtually crease-free throughout long hours of wear",
  "designed with a proprietary comfort-stretch drape that ensures flawless ease of motion and absolute comfort",
  "hand-knotted edge tassels and reinforced flatlock seams guarantee exceptional heirloom durability",
  "provides a completely non-slippery textured grip, allowing you to move with supreme confidence and grace",
  "the ultra-lightweight fabric acts as a natural thermoregulator to keep you fresh and comfortable",
  "requires absolutely no starching or heavy maintenance to maintain its pristine, fall-prone fluid drape",
  "engineered with smart-crease properties to stay flawless from busy morning hours to cozy evening settings",
  "featuring a perfectly balanced weight distribution that naturally stays in place without constant adjustment",
  "its incredibly compact packing density makes it an essential chic option for destination weeding wardrobes",
  "fully handcrafted utilizing eco-friendly, hypoallergenic color dyes that are exceptionally gentle on the skin",
  "the elegant fabric finish prevents linting and color fading, preserving its rich boutique look for years to come",
  "accentuated with custom-milled reinforcing weaves that prevent tearing and offer long-lasting durability"
];

function generateDescription(p: any, idx: number): string {
  // We need a unique 3-4 line description mentioning:
  // - Specific fabric detail
  // - Specific embroidery or print detail
  // - Best occasion to wear it
  // - One unique selling point
  
  const name = p.name;
  const category = p.category;
  
  let fabric = "";
  let design = "";
  let occasion = "";
  let usp = "";
  
  if (category === "Co-Ord Sets") {
    fabric = coOrdFabrics[idx % coOrdFabrics.length];
    design = coOrdDesigns[idx % coOrdDesigns.length];
    occasion = occasionPools[idx % occasionPools.length];
    usp = uspPools[idx % uspPools.length];
  } else if (category === "Sarees") {
    // Determine fabric and design based on ID/name
    if (p.id === "p10") { // Sunshine Yellow Chiffon Saree
      fabric = "an ultra-delicate and gossamer premium-grade Chiffon that floats weightlessly around the silhouette";
      design = "a beautiful solid sunny drape accented by an exquisite gold-threaded lace border and hand-tied pallu tassels";
      occasion = festiveOccasionPools[0];
      usp = "its exceptionally low density allows it to be folded compactly while draping smoothly in seconds";
    } else if (p.id === "p11") { // Black Khadi Cotton Saree
      fabric = "traditional hand-spun Khadi Cotton weave, offering rich rustic textures and an incredibly breathable structure";
      design = "vibrant multicolor contrast geometric stripes on the pallu and a sleek solid border";
      occasion = occasionPools[1];
      usp = "its naturally textured grip holds pleats firmly in place without the need for safety pins";
    } else if (p.id === "p60") { // Tissue Cotton
      fabric = "shimmering golden-threaded Tissue Cotton fabric, merging lightweight comfort with a celebratory metallic luster";
      design = "vibrant multi-hued digital floral prints that seem to bloom radiantly under the evening lights";
      occasion = festiveOccasionPools[2];
      usp = "and highlights a light, crisp structure that retains its theatrical puff and flares spectacularly";
    } else if (p.id.startsWith("p6") || p.id.startsWith("p7")) { // Fendy Space Silk p66-p71
      const FendyFabrics = [
        "illustrious and high-shine Fendy Space Silk with a rich, multi-dimensional satin sheen and sleek hand-feel",
        "premium-grade, supple Fendy Space Silk featuring an exceptionally smooth texture and modern liquid drape",
        "luxurious Fendy Space Silk fabric designed with a heavy, substantial flow that drapes like liquid gold",
        "premium Space Silk characterized by high-density fibers that offer a structured, dramatic body-hugging silhouette",
        "gleaming Fendy Space Silk weaving, bringing a radiant luminous shine that enhances the body's natural movement",
        "soft, premium-combed Space Silk offering a magnificent luxury handle and rich, light-catching sheen"
      ];
      const FendyDesigns = [
        "elaborate micro-sequin shadow embroidery and a heavy gold fancy fringes lace border for heavy glamour",
        "spectacular tonal gold and silver sequin embroidery with a luxurious designer fringes lace border",
        "exquisite handcrafted rani-pink sequin embroidery with an ultra-rich golden fringes lace work",
        "twinkling royal-blue sequin work paired with high-contrast golden zari lace borders",
        "subtle metallic copper sequin embroidery and an ornate heavy gold fringes trim for rich appeal",
        "striking vermillion-red sequin embroidery and a majestic glittering gold fringes lace border"
      ];
      const fIdx = idx % FendyFabrics.length;
      fabric = FendyFabrics[fIdx];
      design = FendyDesigns[fIdx];
      occasion = festiveOccasionPools[idx % festiveOccasionPools.length];
      usp = "it incorporates a soft body-contouring technology that stays perfectly in place and resists slipping";
    } else { // Georgette Sarees (p21-p24)
      const geoFabrics = [
        "supremely fluid, high-twist premium georgette fabric that cascades into clean, body-accentuating pleats",
        "sheer, featherlight georgette weave featuring a subtle, understated drape and non-slippery textured grip",
        "luxurious crinkle-finished premium georgette, designed to catch the light beautifully during evening movements",
        "highly durable, breathable georgette fabric offering an exceptionally smooth, uniform drape and luxurious fall"
      ];
      const geoDesigns = [
        "stunning emerald-green contrasting borders and running floral gold-weave borders",
        "intricate deep-red thread accents and elegant gold-weave motifs across the drape",
        "vibrant festive solid red palette highlighted by subtle golden zari piping along the outer borders",
        "brilliant pink foil borders and delicate linear metallic highlight lines"
      ];
      const gIdx = idx % geoFabrics.length;
      fabric = geoFabrics[gIdx];
      design = geoDesigns[gIdx];
      occasion = festiveOccasionPools[idx % festiveOccasionPools.length];
      usp = "the highly resilient georgette fibers naturally fight wrinkles, keeping your look pristine all night long";
    }
  } else { // Linen Sarees (41 products)
    fabric = linenFabrics[idx % linenFabrics.length];
    
    // Inject custom print descriptions based on keywords
    const lowerName = name.toLowerCase();
    if (lowerName.includes("warli")) {
      design = "enchanting Warli tribal dance stick-figures in ivory white printed with high-contrast precision";
    } else if (lowerName.includes("bird")) {
      design = "delicate nature-inspired bird prints and subtle gold-toned outline detailing across the pallu";
    } else if (lowerName.includes("elephant")) {
      design = "colorful, spectacular digital elephant drawings and artistic geometric tribal border printing";
    } else if (lowerName.includes("peacock")) {
      design = "graceful regal peacock illustrations amidst floral paths printed in premium vibrant colors";
    } else if (lowerName.includes("shibori") || lowerName.includes("chevron")) {
      design = "contemporary tie-dye shibori chevron patterns and gorgeous hand-tied contrast tassels";
    } else if (lowerName.includes("geometric") || lowerName.includes("stripe")) {
      design = "intricate tribal geometric lines and subtle woven metallic block designs";
    } else if (lowerName.includes("paisley")) {
      design = "traditional royal paisley woven borders combined with delicate leafy vine prints";
    } else {
      design = linenDesigns[idx % linenDesigns.length];
    }
    
    // Select occasion and USP
    occasion = occasionPools[idx % occasionPools.length];
    usp = uspPools[idx % uspPools.length];
  }

  // Synthesize paragraph layout styles to make sure they are grammatically various and read completely differently.
  const layout = idx % 4;
  let text = "";
  if (layout === 0) {
    text = `This beautiful ${name} is meticulously fashioned from ${fabric}, showcasing a lightweight texture of pure quality. Adorned with ${design}, it adds a layered touch of classic charm and visual richness to your look. It is an exceptional choice for ${occasion}, while ${usp} for a truly delightful wearing experience.`;
  } else if (layout === 1) {
    text = `Imbued with boutique elegance, this sophisticated ${name} is made from ${fabric} that offers high tactile comfort and a graceful frame. The design spotlights ${design}, showcasing incredible artistic detailing that commands quiet attention. This piece is perfect to style for ${occasion}, and is distinguished by the fact that ${usp}.`;
  } else if (layout === 2) {
    text = `For your next ${occasion}, opt for this premium ${name} beautifully crafted in ${fabric}. Highlighted by ${design}, it celebrates timeless handcrafting legacies while keeping the silhouette highly modern. A major highlight of this ensemble is that ${usp}, keeping you stress-free and elegant.`;
  } else {
    text = `Understated luxury meets tradition in this bespoke ${name}, woven carefully with ${fabric} for maximum breathability. The drape is elegantly elevated by ${design}, evoking an aura of premium handcrafted couture. Perfect for wearing to ${occasion}, it features the outstanding benefit that ${usp}.`;
  }

  return text;
}

try {
  const filePath = path.resolve(process.cwd(), 'src/mockData.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  const parts = content.split("    description: `**DESCRIPTION:**\n");
  if (parts.length !== 67) {
    throw new Error(`Expected exactly 66 product description tags but found ${parts.length - 1}`);
  }

  console.log(`[UPDATE] Found ${parts.length - 1} product blocks. Commencing custom unique overrides...`);

  const updatedParts: string[] = [parts[0]];
  const allGenerated: string[] = [];

  for (let i = 1; i < parts.length; i++) {
    const p = products[i - 1];
    const newPara = generateDescription(p, i - 1);
    
    // Check for duplicates
    if (allGenerated.includes(newPara)) {
      console.warn(`[WARNING] Duplicate generated for product index ${i - 1} (${p.id}): "${newPara}"`);
    }
    allGenerated.push(newPara);

    const subParts = parts[i].split("**HIGHLIGHTS:**");
    if (subParts.length < 2) {
      throw new Error(`Could not find **HIGHLIGHTS:** tag in product block at index ${i - 1} (${p.id})`);
    }

    const restOfBlock = subParts.slice(1).join("**HIGHLIGHTS:**");
    
    // Rebuild the description segment including the generated unique paragraph
    const newBlockSegment = `${newPara}\n\n**HIGHLIGHTS:**${restOfBlock}`;
    updatedParts.push(newBlockSegment);
  }

  // Join everything back
  const finalContent = updatedParts.join("    description: `**DESCRIPTION:**\n");
  fs.writeFileSync(filePath, finalContent, 'utf8');

  console.log(`[UPDATE] Success! Overwrote 66 product descriptions in src/mockData.ts.`);

  // Assert description uniqueness across the board
  const uniqueCount = new Set(allGenerated).size;
  console.log(`[VERIFY] Unique descriptions: ${uniqueCount} out of 66.`);
  if (uniqueCount !== 66) {
    console.error("[ERROR] Uniqueness constraint failed! Some products have overlapping descriptions.");
    process.exit(1);
  } else {
    console.log("[VERIFY] All 66 descriptions are 100% unique as requested.");
  }

} catch (e) {
  console.error("[ERROR] Failed to update descriptions programmatically:", e);
  process.exit(1);
}
