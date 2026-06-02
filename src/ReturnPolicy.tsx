import { SEO } from './components/SEO';
import { ShieldCheck, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router';

export default function ReturnPolicy() {
  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <SEO 
          title="Returns & Exchanges | Mukesh Saree Centre" 
          description="Mukesh Saree Centre return policy — 7-day returns on all products. Refund via UPI/Bank Transfer within 3-5 business days. Easy hassle-free process." 
          url="/return-policy"
        />
        
        <div className="text-center mb-4 md:mb-5">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mb-2">Returns & Exchanges</h1>
          <div className="w-12 h-[1px] bg-gold-200 mx-auto"></div>
        </div>

        <div className="bg-white rounded-sm border border-black/5 p-5 md:p-6 shadow-sm space-y-5 text-[14px] leading-relaxed text-primary-950/70">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary-950">
               <ShieldCheck size={20} className="text-gold-500" />
               <h2 className="text-lg font-serif">Our Commitment to Quality</h2>
            </div>
            <p>
              Every garment at Mukesh Saree Centre undergoes a rigorous quality assurance process before it reaches your hands. We are committed to ensuring your complete satisfaction with your acquisition.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-black/5">
             <div className="flex items-center gap-3 text-primary-950">
                <RefreshCcw size={20} className="text-gold-500" />
                <h2 className="text-lg font-serif">Exchange Policy</h2>
             </div>
             <p>
               We accept exchange requests within <strong>7 days</strong> of delivery. Eligible items can be exchanged for a different size or style, subject to stock availability and conditions. 
               In cases where the desired size or color is unavailable, an exclusive store credit or refund may be issued according to our conditions.
             </p>
          </div>
          
          <div className="space-y-3.5 pt-4 border-t border-black/5">
            <h3 className="text-lg font-serif text-primary-950">Return Conditions</h3>
            <p>
              We want you to love every purchase from Mukesh Saree Centre. While we maintain strict quality checks before dispatch, returns and exchanges are accepted only under eligible conditions.
            </p>
            <p className="font-semibold text-primary-950 text-[13px] pt-1">
              Returns or exchanges are accepted in the following cases:
            </p>
            <ul className="space-y-1 ml-4 list-none text-primary-950/70">
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Damaged or defective product received</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Incorrect item received</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Size issue for eligible apparel products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Product significantly different from the description or image</span>
              </li>
            </ul>

            <p className="font-semibold text-primary-950 text-[13px] pt-2">
              Important Guidelines:
            </p>
            <ul className="space-y-1 ml-4 list-none text-primary-950/70">
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Request must be raised within 7 days of delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Product must be unused, unwashed, and in original condition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Original tags and packaging must be intact</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Sarees with fall-pico customization are not eligible for return</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Slight color variation due to lighting or screen settings is not considered a defect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Exchange is subject to stock availability</span>
              </li>
            </ul>

            <p className="font-semibold text-primary-950 text-[13px] pt-2">
              For approved requests, customers may receive:
            </p>
            <ul className="space-y-1 ml-4 list-none text-primary-950/70">
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Exchange product</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Store credit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500">•</span>
                <span>Refund (only in eligible cases)</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <div className="bg-primary-950 text-white p-5 md:p-6 text-center rounded-sm">
              <h3 className="text-lg font-serif mb-2">Initiate a Request</h3>
              <p className="text-white/70 mb-5 text-sm max-w-lg mx-auto leading-relaxed">
                To request a return or exchange, please contact our support team with your order number and clear product images within 7 days of delivery. Our team will review the request and assist you with the next steps.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link to="/contact" className="inline-block bg-white text-primary-950 px-6 py-2.5 text-[11px] uppercase tracking-widest font-bold hover:bg-gold-50 transition-colors w-full sm:w-auto">
                  CONTACT SUPPORT
                </Link>
                <Link to="/shipping-policy" className="inline-block border border-gold-500 text-gold-500 px-6 py-2.5 text-[11px] uppercase tracking-widest font-bold hover:bg-gold-500 hover:text-white transition-colors w-full sm:w-auto">
                  REQUEST RETURN
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
