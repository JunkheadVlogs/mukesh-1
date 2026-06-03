import { SEO } from './components/SEO';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Link } from 'react-router';

export default function Terms() {
  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <SEO 
          title="Terms & Conditions | Mukesh Saree Centre" 
          description="Review the terms and conditions for Mukesh Saree Centre. Understanding our guidelines, policies, and terms ensures a transparent and smooth shopping experience." 
          url="/terms"
        />
        
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mb-3">Terms & Conditions</h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-sm max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        
        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-8 text-[14px] leading-relaxed text-primary-950/80">
          <p className="font-serif italic text-base md:text-lg text-primary-950/90 border-l-4 border-gold-300 pl-4 py-1">
            "Welcome to Mukesh Saree Centre. By accessing our website, placing an order, or using our services, you agree to comply with and be bound by the following legally protected terms and conditions."
          </p>
          
          <section className="space-y-3 pt-2">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">1. Acceptance of Terms & Eligibility</h2>
            <p>By using <a href="https://mukeshsarees.com" className="text-gold-600 hover:underline">mukeshsarees.com</a>, you confirm that you have read, understood, and agreed to these Terms & Conditions. You must be at least 18 years of age, or accessing the website under the supervision of a parent or guardian, to make a purchase. We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">2. Product Information & Disclaimer</h2>
            <p>We strive to accurately display the colors, textures, and details of our premium ethnic wear. However, we cannot guarantee that your device's display will accurately reflect the true colors of the products. All product descriptions and pricing are subject to change without notice. We reserve the right to discontinue any product at any time.</p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">3. Pricing, Orders, and Cancellations</h2>
            <p>Once an order is successfully placed, you will receive an order confirmation email or SMS. This confirmation does not signify our final acceptance of your order. We reserve the right to accept or decline your order at any time after receipt for reasons including (but not limited to) inventory shortage, payment fraud flags, or pricing errors.</p>
            <p>Orders can only be canceled if they have not yet been dispatched from our facility. Once an order is handed over to the courier partner, it cannot be canceled.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">4. Payment Terms & Methods</h2>
            <p>We use Razorpay to seamlessly process secure online payments. Accepted methods include major Credit/Debit Cards, UPI, Netbanking, and Wallets. By proceeding to checkout, you agree to Razorpay's terms of service for payment processing.</p>
            <div className="bg-primary-50 p-4 rounded-sm border border-primary-100">
              <h3 className="font-semibold text-primary-950 mb-1">Cash on Delivery (COD) Conditions:</h3>
              <p className="text-[13px]">COD is available at select locations. By opting for COD, you agree to have the exact cash amount ready at the time of delivery. Excessive refusal of COD orders upon delivery may result in account blacklisting and restriction from placing future COD orders.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">5. Shipping & Delivery</h2>
            <p>We provide free standard shipping across India. Delivery times range between 3 to 7 business days. While we partner with top-tier courier services, we are not liable for delayed deliveries due to unforeseen circumstances or force majeure events. For full details, please review our <Link to="/shipping-policy" className="text-gold-600 hover:underline">Shipping & Delivery Policy</Link>.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">6. Return, Refund & Exchange Policy</h2>
            <p>We offer a 7-day easy return and exchange window on eligible orders, provided the garments are unused, unwashed, and have original tags intact. Products customized with Fall and Pico are strictly non-returnable. Refunds for prepaid orders will be credited to the original payment source. COD refunds require bank account provision. Please review our comprehensive <Link to="/return-policy" className="text-gold-600 hover:underline">Return & Refund Policy</Link> for exact guidelines.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">7. Customer Responsibilities and Account Accuracy</h2>
            <p>You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You are responsible for all activities that occur under your account.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">8. Intellectual Property & Content Ownership</h2>
            <p>All content included on this website, such as text, graphics, logos, images, digital downloads, and software, is the exclusive property of Mukesh Saree Centre and protected by Indian and international copyright laws. You may not extract or utilize parts of the content without our express written consent.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">9. Prevention of Fraudulent Transactions</h2>
            <p>To provide a safe shopping environment, we monitor transactions for fraudulent activity. In the event of detecting suspicious activity, Mukesh Saree Centre reserves the right to cancel past, pending, or future orders without any liability. We may request additional verification or information before accepting any order.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">10. Limitation of Liability</h2>
            <p>Mukesh Saree Centre shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our website or products, including damages for loss of profits, data, or other intangible losses.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif text-primary-950 border-b border-black/5 pb-2">11. Governing Law & Dispute Resolution</h2>
            <p>These Terms & Conditions and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India. Any disputes arising out of your use of this website shall be subject to the exclusive jurisdiction of the courts located in Nagpur, Maharashtra.</p>
          </section>

          <section className="space-y-3 bg-primary-950 text-white p-6 md:p-8 rounded-sm mt-4 text-center">
            <h2 className="text-xl font-serif mb-2">12. Contact Information</h2>
            <p className="text-white/80">Questions about the Terms & Conditions? We're here to help.</p>
            <p className="text-white/80 mt-2">
              Email us at: <a href="mailto:info.mukeshsareecentre@gmail.com" className="text-gold-400 hover:text-white transition-colors">info.mukeshsareecentre@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
