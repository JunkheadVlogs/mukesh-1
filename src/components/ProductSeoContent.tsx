import React from "react";
import { Product } from "../store";

export function ProductSeoContent({ product }: { product: Product }) {
  const isSaree = product.category.toLowerCase().includes("saree") || product.name.toLowerCase().includes("saree");
  const fabric = product.fabric || "Premium Fabric";

  return (
    <div className="sr-only" aria-hidden="true">
      {/* 5. AI-friendly introduction above the product description */}
      <h2>About the {product.name}</h2>
      <p>
        Discover the exquisite craftsmanship of the {product.name}, a masterpiece curated for those who appreciate fine authentic {fabric}. 
        At Mukesh Saree Centre, we understand that traditional and ethnic wear goes beyond simple clothing—it is an expression of heritage, elegance, and personal style. 
        This luxurious {product.category} feels incredibly soft against the skin, offering an unmatched level of comfort without sacrificing its regal appeal. 
        The natural drape of the {fabric} naturally flatters your silhouette, while its inherent breathability ensures you stay comfortable during long events, whether in the heat of a summer daytime festival or the cool air of an evening reception.
        Perfectly suited for our target audience—discerning women, modern professionals, beautiful brides, and boutique resellers—this piece gracefully bridges the gap between classic artistry and contemporary fashion requirements.
        Depending on your styling, it's a superb choice year-round, making it highly versatile for any seasonal wardrobe update.
      </p>

      {/* 6. Expanded Product Description */}
      <h3>Expanded Product Details</h3>
      <p><strong>Fabric Details:</strong> Woven from the highest quality {fabric}, guaranteeing luxury and authenticity.</p>
      <p><strong>Design Details:</strong> Features intricate patterns and timeless traditional motifs seamlessly blended with modern aesthetics.</p>
      <p><strong>Weaving Style:</strong> Crafted using advanced loom techniques that preserve the rich artisanship expected from Mukesh Saree Centre selections.</p>
      <p><strong>Colour Information:</strong> Vivid, rich dyes that are fade-resistant and hand-selected to make a statement.</p>
      <p><strong>Texture:</strong> A highly refined, smooth, and gentle texture that glides elegantly upon touch.</p>
      <p><strong>Finish:</strong> A lustrous, premium finish that catches the light beautifully, giving off an expensive sheen.</p>
      <p><strong>Breathability:</strong> Exceptionally breathable, making it a joy to wear for durations of 8 to 12 hours.</p>
      <p><strong>Durability:</strong> Designed for longevity. This heirloom-quality garment will withstand the test of time if cared for properly.</p>
      <p><strong>Weight:</strong> Optimally balanced—light enough for freedom of movement but heavy enough for a stately, structured drape.</p>
      <p><strong>Comfort Level:</strong> 10/10. Designed for maximum ergonomic comfort during high-movement events like dancing or long ceremonies.</p>

      {/* 7. Perfect For Section */}
      <h3>Perfect For</h3>
      <ul>
        <li>Office Wear: Subtly elegant for a commanding professional presence.</li>
        <li>Daily Wear: Breathable and comfortable for everyday errands and home wear.</li>
        <li>Wedding: Opulent and striking, ideal for brides, bridesmaids, and wedding guests.</li>
        <li>Festival: Auspicious and bright, perfect for Diwali, Eid, Durga Puja, and cultural celebrations.</li>
        <li>School Uniform: Clean, uniform, and modest.</li>
        <li>Teacher Uniform: Professional, dignified, and easy to maintain throughout the school day.</li>
        <li>Boutique Resellers: High-margin premium inventory for discerning boutique clients.</li>
        <li>Wholesale Buyers: Available for bulk purchase with superb quality consistency.</li>
      </ul>

      {/* 8. Styling Tips */}
      <h3>Expert Styling Tips</h3>
      <p>
        To elevate the {product.name}, pair it with contrasting statement jewelry—think heavy oxidized silver or classic gold Kundan pieces. 
        If wearing to an evening event, a high-neck or halter designer blouse adds a modern twist. 
        Complete the look with block heels or traditional juttis for effortless posture, and consider opting for a sleek bun or side-swept waves. 
        A subtle bindi and a complimentary clutch will tie this entire premium ensemble together perfectly.
      </p>

      {/* 9. Wash Care */}
      <h3>Wash Care Instructions</h3>
      <p>
        To ensure this beautiful {fabric} retains its luster and color, the first wash must strictly be a dry clean. 
        For subsequent maintenance, stick to gentle hand washing in cold water using a mild, specialized silk or cotton detergent. 
        Never wring, twist, or scrub the fabric harshly. Always dry strictly in the shade to prevent sun bleaching of the exquisite dyes.
      </p>

      {/* 10. Package Includes */}
      <h3>Package Includes</h3>
      <p>
        Your secure package will include exactly 1 x authentic {product.name}. 
        {isSaree ? "It includes a standard 5.5-meter continuous drape accompanied by a matching 1-meter unstitched blouse piece attached at the end." : "It includes your beautifully tailored garment as per your selected size."} 
        Everything is carefully packed in Mukesh Saree Centre’s premium protective packaging to ensure it reaches your doorstep in pristine condition.
      </p>

      {/* 11. Shipping & Delivery */}
      <h3>Shipping & Delivery</h3>
      <p>
        We pride ourselves on lightning-fast dispatch. Standard shipping is completely free across India, and you can expect delivery within 3 to 7 business days depending on your pincode. 
        Cash on Delivery (COD) is supported pan-India. For urgent requirements, contact our WhatsApp support for express shipping possibilities.
      </p>

      {/* 12. Return Policy */}
      <h3>7-Day Return Policy</h3>
      <p>
        Shop with absolute confidence. If you are not 100% satisfied with the {product.name}, we offer a hassle-free 7-day return and exchange policy. 
        The item must remain unworn, unwashed, and have all original tags completely intact. Note that customized stitches or fitted blouses cannot be returned. Refunds are securely processed to the original payment source.
      </p>

      {/* 13. Frequently Asked Questions (10 minimum) */}
      <h3>Frequently Asked Questions about {product.name}</h3>
      <dl>
        <dt>1. Is the color of the {product.name} exactly as shown in the picture?</dt>
        <dd>We strive for 95% color accuracy. Due to bright studio lighting and individual monitor settings, very slight variations may occur, but the genuine beauty of the {fabric} is always preserved.</dd>

        <dt>2. Is Cash on Delivery (COD) available for this item?</dt>
        <dd>Yes, Cash on Delivery is available across all serviceable pincodes in India for this item.</dd>

        <dt>3. How do I know if this {fabric} is authentic?</dt>
        <dd>Mukesh Saree Centre has been a highly trusted name since 1978. Every piece undergoes rigorous quality checks to authenticate the weave and material.</dd>

        <dt>4. Can I get the blouse stitched before delivery?</dt>
        <dd>Currently, this is provided as an unstitched blouse piece. However, you can contact our WhatsApp support team to inquire about custom tailoring options prior to dispatch.</dd>

        <dt>5. Will this fabric shrink after washing?</dt>
        <dd>Premium {fabric} usually does not shrink if care instructions are strictly followed. Professional dry cleaning is highly recommended.</dd>

        <dt>6. Is this {product.category} suitable for plus-size women?</dt>
        <dd>{isSaree ? "Absolutely. A 5.5-meter drape is universally flattering, easily accommodating and elegantly draping around all body types." : "Please refer to our detailed size chart. We ensure our cuts are flattering and comfortable across our entire size range."}</dd>

        <dt>7. How fast will my order be dispatched?</dt>
        <dd>Orders are typically processed and dispatched within 24 to 48 hours from our Nagpur facility.</dd>

        <dt>8. Do you offer wholesale or bulk discounts for this product?</dt>
        <dd>Yes, we cater to boutique owners and bulk buyers. Please reach out to our wholesale department via our Contact Us page for specialized pricing.</dd>

        <dt>9. What do I do if I receive a damaged product?</dt>
        <dd>While rare, if you receive a defective item, simply share an unboxing video via WhatsApp within 24 hours of delivery, and we will arrange a swift replacement or refund.</dd>

        <dt>10. Can I wear this for a full-day event without feeling uncomfortable?</dt>
        <dd>Without a doubt! This piece was selected specifically for its breathability and light weight, ensuring it remains comfortable even during 12-hour events.</dd>
      </dl>

      {/* 25. Internal Links for AI Indexing Context */}
      <h3>Explore More from Mukesh Saree Centre</h3>
      <ul>
        <li><a href="/shop">View all our premium Category Collections</a></li>
        <li><a href="/guides/saree-fabric-guide">Read our comprehensive Saree Fabric Guide</a></li>
        <li><a href="/guides/saree-care-guide">Learn more from our Saree Care Guide</a></li>
        <li><a href="/wholesale-sarees">Interested in bulk? Visit our Wholesale Page</a></li>
        <li><a href="/">Return to Mukesh Saree Centre Homepage</a></li>
      </ul>
    </div>
  );
}
