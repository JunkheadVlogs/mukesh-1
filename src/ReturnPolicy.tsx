import { SEO } from './components/SEO';
import { ShieldCheck, RefreshCcw, HandCoins, AlertCircle, FileText, PackageX, HelpCircle } from 'lucide-react';
import { Link } from 'react-router';
import { Breadcrumbs } from './components/Breadcrumbs';

export default function ReturnPolicy() {
  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <SEO 
          title="Returns & Refunds Policy | Mukesh Saree Centre" 
          description="Mukesh Saree Centre's Return & Refund Policy. Understand our 7-day return period, refund timelines, and process for damaged or defective items." 
          url="/return-policy"
        />
        
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mb-3">Returns & Refunds Policy</h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-sm max-w-2xl mx-auto">
            We are committed to providing you with premium ethnic wear. If you are not entirely satisfied with your purchase, we're here to help.
          </p>
        </div>

        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-10 text-[14px] leading-relaxed text-primary-950/80">
          
          {/* Eligibility & Timeline */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <RefreshCcw size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">1. Return Eligibility & Timeline</h2>
            </div>
            <p>
              We accept return and exchange requests within <strong>7 days</strong> from the date of delivery. Eligible items can be returned for a refund, store credit, or exchanged for a different size or style, subject to stock availability.
            </p>
          </section>

          {/* Product Condition */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <ShieldCheck size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">2. Product Condition Requirements</h2>
            </div>
            <p>To be eligible for a return or exchange, the item must meet the following criteria:</p>
            <ul className="space-y-2 ml-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>The product must be <strong>unused, unwashed, and completely unworn</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>All <strong>original tags, labels, and packaging</strong> must be fully intact and attached to the garment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>The item must be free from any makeup stains, perfume, or odors.</span>
              </li>
            </ul>
          </section>

          {/* Non-Returnable Items */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <PackageX size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">3. Non-Returnable Items</h2>
            </div>
            <p>Due to hygiene and customization reasons, the following items are strictly non-returnable:</p>
            <ul className="space-y-2 ml-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>Sarees that have undergone <strong>Fall and Pico customization</strong> or blouse stitching.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>Items purchased during clearance sales or promotional deep discounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>Gift Cards.</span>
              </li>
            </ul>
            <p className="text-[13px] text-primary-950/60 mt-2 bg-primary-50 p-3 rounded-sm border border-primary-100">
              <em>Note: Slight color variations due to photography lighting or screen resolutions do not qualify as a defect and are not deemed valid reasons for return.</em>
            </p>
          </section>

          {/* Return Process */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <FileText size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">4. The Return Process</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <div className="font-bold text-gold-600 text-lg">Step 1</div>
                <div className="font-semibold text-primary-950">Raise a Request</div>
                <p className="text-[13px]">Contact our support team within 7 days. Provide your Order ID and clear photographs of the product.</p>
              </div>
              <div className="space-y-2">
                <div className="font-bold text-gold-600 text-lg">Step 2</div>
                <div className="font-semibold text-primary-950">Approval & Pickup</div>
                <p className="text-[13px]">Once approved (typically 24-48 hours), we will arrange a return pickup from your delivery address.</p>
              </div>
              <div className="space-y-2">
                <div className="font-bold text-gold-600 text-lg">Step 3</div>
                <div className="font-semibold text-primary-950">Inspection & Refund</div>
                <p className="text-[13px]">After the product reaches our warehouse, it passes quality checks, followed by the initiation of your refund or exchange.</p>
              </div>
            </div>
          </section>

          {/* Damaged or Defective Items */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <AlertCircle size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">5. Damaged, Defective, or Incorrect Items</h2>
            </div>
            <p>
              We conduct rigorous quality checks, but in the rare event that you receive a damaged, defective, or incorrect item:
            </p>
            <ul className="space-y-2 ml-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>You must notify us within <strong>48 hours</strong> of receiving the delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>Please share unboxing videos or images clearly highlighting the defect.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>We will arrange a free replacement. If a replacement is unavailable, a full refund will be processed.</span>
              </li>
            </ul>
          </section>

          {/* Refunds & Payment Methods */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <HandCoins size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">6. Refund Processing Timeline & Methods</h2>
            </div>
            <p>Once your returned item is received and inspected (typically 2-3 business days after arrival at our facility), refund timelines are as follows:</p>
            <ul className="space-y-3 ml-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-primary-950 text-[13px] block mb-0.5">Prepaid Orders (Cards/UPI/Netbanking):</span>
                  <span>Refunds will be credited to the original payment source within <strong>3-5 business days</strong> after approval.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-primary-950 text-[13px] block mb-0.5">Cash on Delivery (COD) Orders:</span>
                  <span>COD refunds are strictly processed via bank transfer or UPI. Our team will request your bank details via email. Once provided, expect the credit within <strong>3-5 business days</strong>.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-primary-950 text-[13px] block mb-0.5">Store Credit:</span>
                  <span>If you opt for store credit, a voucher will be issued immediately upon approval, valid for 6 months.</span>
                </div>
              </li>
            </ul>
          </section>

          {/* Frequently Asked Questions */}
          <section className="space-y-5 bg-primary-50 p-6 md:p-8 rounded-sm">
            <div className="flex items-center gap-3 text-primary-950 mb-2">
               <HelpCircle size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary-950 text-[14px]">Do I have to pay for return shipping?</h3>
                <p className="mt-1 text-[13px]">In standard return scenarios, a nominal return shipping fee may be deducted from your refund amount. For defective or incorrect items, the return is entirely free of charge.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-950 text-[14px]">Can I cancel my order?</h3>
                <p className="mt-1 text-[13px]">Orders can only be canceled if they have not yet been dispatched from our warehouse. Please contact support immediately if you wish to cancel an order.</p>
              </div>

              <div>
                <h3 className="font-semibold text-primary-950 text-[14px]">What happens if the courier cannot pick up the return?</h3>
                <p className="mt-1 text-[13px]">In rare cases where return pickup service is unavailable at your pincode, you may need to self-ship the item using a reliable courier service. We will reimburse standard shipping costs upon receipt of the receipt.</p>
              </div>
            </div>
          </section>

          {/* Support CTA */}
          <div className="pt-6">
            <div className="bg-primary-950 text-white p-6 md:p-8 text-center rounded-sm">
              <h3 className="text-xl font-serif mb-3">Initiate a Request</h3>
              <p className="text-white/80 mb-6 text-sm max-w-lg mx-auto leading-relaxed">
                Need to process a return or have questions regarding our policy? Our dedicated support team is ready to assist you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact" className="inline-block bg-white text-primary-950 px-8 py-3 text-[12px] uppercase tracking-widest font-bold hover:bg-gold-50 transition-colors w-full sm:w-auto text-center">
                  CONTACT SUPPORT
                </Link>
                <a href="mailto:info.mukeshsareecentre@gmail.com" className="inline-block border border-gold-500 text-gold-400 px-8 py-3 text-[12px] uppercase tracking-widest font-bold hover:bg-gold-500 hover:text-white transition-colors w-full sm:w-auto text-center">
                  EMAIL US
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

