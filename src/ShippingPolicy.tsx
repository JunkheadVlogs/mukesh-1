import { SEO } from './components/SEO';
import { Truck, Clock, MapPin, Coins, Package, Info, Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router';

export default function ShippingPolicy() {
  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <SEO 
          title="Shipping & Delivery Policy | Mukesh Saree Centre" 
          description="Learn about our free shipping across India, delivery timelines, trusted courier partners, COD availability, and order tracking." 
          url="/shipping-policy"
        />

        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mb-3">Shipping & Delivery Policy</h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-sm max-w-2xl mx-auto">
            Experience premium delivery services across India. We ensure your ethnic wear reaches you safely, promptly, and in pristine condition.
          </p>
        </div>

        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-10 text-[14px] leading-relaxed text-primary-950/80">
          
          {/* Delivery Timelines */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <Clock size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">1. Dispatch & Delivery Timelines</h2>
            </div>
            <p>
              We process orders promptly to ensure quick delivery. Please note our typical timelines:
            </p>
            <ul className="space-y-2 ml-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <div>
                  <span className="font-semibold text-primary-950">Dispatch Time:</span> Orders are carefully packed and dispatched from our boutique within <strong>24 to 48 hours</strong> of order placement.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <div>
                  <span className="font-semibold text-primary-950">Delivery Time:</span> Standard deliveries across India generally take <strong>3 to 7 business days</strong> post-dispatch.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <div>
                  <span className="font-semibold text-primary-950">Metro Regions:</span> Deliveries to Tier 1 cities and metro regions frequently experience expedited delivery times (2-4 Days).
                </div>
              </li>
            </ul>
            <p className="text-[13px] text-primary-950/60 mt-2 bg-primary-50 p-3 rounded-sm border border-primary-100 flex items-start gap-2">
              <Info size={16} className="text-gold-600 mt-0.5 shrink-0" />
              <span>Please note that customized items (like sarees with Fall and Pico) may require an additional 1-2 business days for processing before dispatch.</span>
            </p>
          </section>

          {/* Trusted Shipping Partners */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <Package size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">2. Trusted Courier Partners</h2>
            </div>
            <p>
              To guarantee secure and reliable transit, we have partnered with India's premier logistics providers. Depending on your region, your package will be delivered by one of our trusted partners:
            </p>
            <ul className="space-y-2 ml-2 list-none font-medium text-primary-950">
              <li className="flex items-center gap-2">
                <span className="text-gold-500">•</span> Delhivery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500">•</span> BlueDart
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500">•</span> Amazon Shipping
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500">•</span> Xpressbees
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold-500">•</span> DTDC
              </li>
            </ul>
          </section>

          {/* Shipping Costs and COD */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <Coins size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">3. Shipping Costs & Cash on Delivery (COD)</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="border border-black/5 rounded-sm p-5 bg-gray-50/50">
                <h3 className="font-semibold text-primary-950 mb-2 flex items-center gap-2">
                  <Truck size={18} className="text-gold-600" /> Free Shipping
                </h3>
                <p className="text-[13px]">We are proud to offer <strong>100% Free Shipping</strong> on all prepaid and COD orders across India above ₹499. Orders below ₹499 may incur a small shipping charge depending on the delivery location.</p>
              </div>
              <div className="border border-black/5 rounded-sm p-5 bg-amber-50/30">
                <h3 className="font-semibold text-primary-950 mb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-gold-600" /> COD Availability
                </h3>
                <p className="text-[13px]">Cash on Delivery is supported across 25,000+ pincodes in India. Serviceability for your specific pincode is dynamically verified during the checkout process.</p>
              </div>
            </div>
            <p className="text-[13px] text-[#2C241B] font-medium bg-amber-50/60 p-3 rounded-sm border border-amber-100">
              <strong>COD Note:</strong> For Cash on Delivery orders, our delivery partners may not always carry change. We kindly request keeping the exact order amount ready at the time of delivery.
            </p>
          </section>

          {/* Order Tracking */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <Search size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">4. Order Tracking Information</h2>
            </div>
            <p>
              We ensure complete transparency regarding your package's journey:
            </p>
            <ul className="space-y-2 ml-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span><strong>Tracking Link:</strong> Immediately upon dispatch, a unique airway bill (AWB) number and a live tracking link will be shared via Email and SMS/WhatsApp.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span><strong>Live Status:</strong> You can trace the package across multiple transit states directly through the provided courier link.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span><strong>Status Updates:</strong> Real-time delivery statuses (such as Out for Delivery) will be communicated to you by the courier partner.</span>
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
                <h3 className="font-semibold text-primary-950 text-[14px]">Do you ship internationally?</h3>
                <p className="mt-1 text-[13px]">Currently, we ship exclusively within India. We plan to expand our services globally in the near future.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-950 text-[14px]">What if my package is delayed?</h3>
                <p className="mt-1 text-[13px]">While 95% of our deliveries happen within the stipulated time frame, unforeseen circumstances (weather, logistical issues) can occasionally cause delays. Rest assured, your package is fully insured up to delivery. You can contact support for updates if the status hasn't changed for over 48 hours.</p>
              </div>

              <div>
                <h3 className="font-semibold text-primary-950 text-[14px]">What should I do if my package arrives damaged?</h3>
                <p className="mt-1 text-[13px]">Please refuse delivery if the external packaging appears tampered with or severely damaged. If you discover damage upon opening, kindly record a seamless unboxing video and notify us within 48 hours to arrange a swift replacement.</p>
              </div>
            </div>
          </section>

          {/* Support CTA */}
          <div className="pt-6">
            <div className="bg-primary-950 text-white p-6 md:p-8 text-center rounded-sm">
              <h3 className="text-xl font-serif mb-3">Need Logistics Assistance?</h3>
              <p className="text-white/80 mb-6 text-sm max-w-lg mx-auto leading-relaxed">
                If you have faced any anomalies during delivery or need real-time tracking updates, our support executives are here to assist.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact" className="inline-block bg-white text-primary-950 px-8 py-3 text-[12px] uppercase tracking-widest font-bold hover:bg-gold-50 transition-colors w-full sm:w-auto text-center">
                  CONTACT SUPPORT
                </Link>
                <a href="mailto:info@mukeshsarees.com" className="inline-block border border-gold-500 text-gold-400 px-8 py-3 text-[12px] uppercase tracking-widest font-bold hover:bg-gold-500 hover:text-white transition-colors w-full sm:w-auto text-center">
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

