import { SEO } from './components/SEO';

export default function Terms() {
  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <SEO 
          title="Terms & Conditions | Mukesh Saree Centre" 
          description="Review the terms of service for Mukesh Saree Centre. Understanding our guidelines ensures a transparent and smooth shopping experience for all our customers." 
          url="/terms"
        />
        
        <div className="text-center mb-4 md:mb-5">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mb-2">Terms & Conditions</h1>
          <div className="w-12 h-[1px] bg-gold-200 mx-auto"></div>
        </div>
        
        <div className="bg-white rounded-sm border border-black/5 p-5 md:p-6 shadow-sm text-[14px] leading-relaxed text-primary-950/70">
          <p className="mb-4 font-serif italic text-base md:text-lg text-primary-950">"Welcome to Mukesh Saree Centre. By using our website, you agree to comply with and be bound by the following terms and conditions of use."</p>
          
          <h3 className="text-[13px] uppercase tracking-wider font-bold text-primary-950 mt-5 mb-1.5">1. Product Information</h3>
          <p className="mb-4">We strive to display our products as accurately as possible. However, the actual colors you see will depend on your monitor, and we cannot guarantee that your monitor's display of any color will be accurate. All our fabrics are authentic and sourced carefully.</p>
          
          <h3 className="text-[13px] uppercase tracking-wider font-bold text-primary-950 mt-5 mb-1.5">2. Pricing & Orders</h3>
          <p className="mb-4">All prices are indicated in INR and are inclusive of relevant taxes. We reserve the right to modify prices without prior notice. Once an order is placed, it cannot be canceled if it has already been dispatched.</p>
          
          <h3 className="text-[13px] uppercase tracking-wider font-bold text-primary-950 mt-5 mb-1.5">3. Shipping & Delivery</h3>
          <p className="mb-4">We offer free shipping on all orders across India as part of our commitment to excellence. Delivery usually takes 5-7 business days depending on your location. We are not responsible for delays caused by courier partners.</p>
          
          <h3 className="text-[13px] uppercase tracking-wider font-bold text-primary-950 mt-5 mb-1.5">4. Returns & Exchanges</h3>
          <p className="mb-2">If you are not satisfied with your purchase, you may initiate a return within 7 days of delivery. Custom-stitched items and discounted products are non-returnable.</p>
        </div>
      </div>
    </div>
  );
}
