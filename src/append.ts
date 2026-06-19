import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/content/guides');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

const addition = `

## 8. Deep Dive: Regional Influences and Geographical Indications (GI)

Every traditional piece of ethnic Indian fashion holds within it the story of its birthplace. Geography, climate, local flora, and regional history all profoundly shape the final textile. Many fabrics hold a Geographical Indication (GI) tag, an intellectual property mark certifying that the product possesses certain qualities or a reputation due exclusively to its geographical origin.

### Northern and Western Horizons
The cooler, drier parts of the north and the vibrant deserts of the west give rise to distinct textile traditions. In Varanasi (Banaras), the air hums with the sound of jacquard looms weaving intricate Mughal-inspired motifs in heavy brocade. Rajasthan and Gujarat, meanwhile, embrace the sun with their brilliant tie-and-dye (Bandhani and Leheriya) techniques. There, lightweight fabrics are preferred, dyed in spectacularly bright colors to contrast against the arid landscape. The embroideries are rich—often incorporating mirrors (shisha work) intended to reflect the harsh desert sun and ward off the evil eye.

### Eastern Elegance
The east is the land of sublime luxury and delicate weaving. From the silkworm farms of Assam, which yield the golden Muga silk, to the delicate Jamdani weavers of Bengal, the textiles here are airy, intricate, and deeply connected to nature. Bengal cottons are legendary for their feather-light embrace, making them ideal for the humid Indian summer. The motifs often draw directly from the lush surroundings—creepers, fish, and floral vines.

### Southern Mastery
Southern India is a powerhouse of textile manufacturing. The Kanchipuram (Kanjeevaram) silks of Tamil Nadu are legendary for their durability and weight. Their borders are often woven separately from the main body using a technique called *Korvai*, and joined with masterful interlocking stitches visible only as a faint zig-zag line. Weaving hubs in Karnataka offer the soft, luxurious Mysore silk, while Andhra Pradesh and Telangana give us the incredibly complex Ikat weaves, where the yarn is tie-dyed *before* it is woven into the loom. 

Understanding these regional differences transforms a simple shopping experience into a profound cultural journey. When you purchase from genuine curators like Mukesh Saree Centre, you are directly participating in the survival of these ancient regional crafts.

## 9. Comprehensive Glossary of Terms

As you delve deeper into this world, you will encounter terms that might seem confusing. Keep this quick reference glossary handy.

- **Ahimsa Silk:** Also known as peace silk. Silk spun after the silkworm has safely emerged from its cocoon, causing no harm to the creature.
- **Brocade:** A heavily woven fabric, often with raised floral or geometric designs introduced during the weaving process, usually involving gold or silver thread (Zari).
- **Buti / Butta:** Small, distinct motifs (like a mango, flower, or geometric shape) woven or embroidered consistently across the body of the fabric.
- **Count:** A measurement of yarn thickness. Higher counts indicate finer, thinner yarn, resulting in softer and sheerer fabric.
- **End-piece / Pallu:** The loose end of the drape that typically hangs over the shoulder, usually the most heavily decorated part of the entire garment.
- **Handloom:** A manual, human-powered loom used to weave cloth without electricity. It allows for incredibly complex and irregular patterns that machines cannot easily replicate.
- **Ikat:** A dyeing technique where yarn is resist-dyed (tie-dyed) prior to weaving, producing a distinctive blurred or feathered edge to the motifs.
- **Jacquard:** A mechanical attachment to a loom that allows for individual control of each warp thread, enabling the weaving of complex, large-scale patterns like brocades and damasks.
- **Korvai:** A traditional South Indian weaving technique where the body and the border are woven separately and interlocked later, allowing for starkly contrasting colors.
- **Plain Weave:** The simplest and most common type of weave, where the warp and weft threads alternate over and under each other.
- **Powerloom:** Mechanized looms driven by electric power. They produce fabric much faster and cheaper than handlooms but lack the distinctive artisanal 'flaws' and complexities.
- **Selvedge:** The securely woven edge of a fabric that runs parallel to the warp, preventing it from unraveling.
- **Slub:** A thicker, uneven spot in a yarn, purposely left or spun into materials like linen and raw silk to give the fabric a textured, organic look.
- **Weft and Warp:** The two sets of threads woven together to create fabric. Warp threads run lengthwise, tightly stretched into the loom. Weft threads are woven horizontally over and under the warp.
- **Zari:** Metallic thread, traditionally made of fine gold or silver wire, wrapped around a silk core. Modern affordable zari often uses metallic polyester or copper wire coated with silver or gold.

`;

files.forEach(f => {
  const filePath = path.join(dir, f);
  const content = fs.readFileSync(filePath, 'utf8');
  if(!content.includes("Geographical Indications (GI)")) {
    fs.writeFileSync(filePath, content + addition);
  }
});

console.log("Appended to " + files.length + " files");
