import { SEO } from './components/SEO';

export default function Terms() {
  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32 md:py-48">
        <SEO 
          title="Terms & Conditions | Mukesh Saree Centre" 
          description="Review the terms of service for Mukesh Saree Centre. Understanding our guidelines ensures a transparent and smooth shopping experience for all our patrons." 
          url="/terms"
        />
        <div className="mb-24">
          <h4 className="text-gold-500 mb-6 drop-shadow-sm uppercase tracking-[4px] font-bold text-[11px]">Protocols</h4>
          <h1 className="text-5xl md:text-7xl font-serif leading-tight text-onyx">Terms & Conditions</h1>
        </div>
        <div className="prose prose-lg text-onyx/70 font-medium max-w-none relative z-10 border-t border-onyx/5 pt-12 font-sans">
          <p className="leading-relaxed mb-10 text-onyx/80 italic font-serif text-xl border-l border-gold-500 pl-8 py-2">"Welcome to Mukesh Saree Centre. By using our website, you agree to comply with and be bound by the following terms and conditions of use."</p>
          
          <h3 className="text-[14px] tracking-[3px] uppercase mt-12 mb-6 text-onyx font-bold">1. Product Information</h3>
          <p className="leading-relaxed mb-10">We strive to display our products as accurately as possible. However, the actual colors you see will depend on your monitor, and we cannot guarantee that your monitor's display of any color will be accurate. All our fabrics are authentic and sourced carefully.</p>
          
          <h3 className="text-[14px] tracking-[3px] uppercase mt-12 mb-6 text-onyx font-bold">2. Pricing & Orders</h3>
          <p className="leading-relaxed mb-10">All prices are indicated in INR and are inclusive of relevant taxes. We reserve the right to modify prices without prior notice. Once an order is placed, it cannot be canceled if it has already been dispatched.</p>
          
          <h3 className="text-[14px] tracking-[3px] uppercase mt-12 mb-6 text-onyx font-bold">3. Shipping & Delivery</h3>
          <p className="leading-relaxed mb-10">We offer free shipping on all orders across India as part of our commitment to excellence. Delivery usually takes 5-7 business days depending on your location. We are not responsible for delays caused by courier partners.</p>
          
          <h3 className="text-[14px] tracking-[3px] uppercase mt-12 mb-6 text-onyx font-bold">4. Returns & Exchanges</h3>
          <p className="leading-relaxed mb-10">If you are not satisfied with your purchase, you may initiate a return within 7 days of delivery. Custom-stitched items and discounted products are non-returnable.</p>
        </div>
      </div>
    </div>
  );
}
