import { SEO } from './components/SEO';
import { Truck, Clock, MapPin } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <SEO 
          title="Shipping & Delivery Policy | Mukesh Saree Centre" 
          description="Learn about our free shipping across India, delivery timelines, and order tracking." 
          url="/shipping-policy"
        />
        
        <div className="text-center mb-4 md:mb-5">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mb-2">Shipping & Delivery</h1>
          <div className="w-12 h-[1px] bg-gold-200 mx-auto"></div>
        </div>

        <div className="bg-white rounded-sm border border-black/5 p-5 md:p-6 shadow-sm space-y-4 text-[14px] leading-relaxed text-primary-950/70">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary-950">
              <Truck size={20} className="text-gold-500" />
              <h2 className="text-lg font-serif">Standard Delivery</h2>
            </div>
            <p>
              Free Shipping Available on All Orders Across India. Cash on Delivery (COD) and Prepaid Orders Supported.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-black/5">
            <div className="flex items-center gap-3 text-primary-950">
              <Clock size={20} className="text-gold-500" />
              <h2 className="text-lg font-serif">Dispatch Timelines</h2>
            </div>
            <p>
              Our ready-to-wear collections and unstitched selections are typically processed and dispatched from our boutique within 24 to 48 hours. Please allow additional time during peak festive seasons.
            </p>
          </div>
          
          <div className="space-y-2 pt-4 border-t border-black/5">
            <div className="flex items-center gap-3 text-primary-950">
              <MapPin size={20} className="text-gold-500" />
              <h2 className="text-lg font-serif">Transit Time</h2>
            </div>
            <p>
              Once dispatched, standard deliveries within India take 3 to 7 business days depending on your location. Tier 1 cities generally experience swifter delivery times.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-black/5">
            <h3 className="text-lg font-serif text-primary-950">Order Tracking</h3>
            <p>
              Upon dispatch, a personalized tracking link will be shared via email and SMS, allowing you to monitor the journey of your acquisition.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-sm border border-black/5 p-5 md:p-6 shadow-sm text-center">
          <h3 className="text-xl md:text-2xl font-serif text-primary-950 mb-1.5">Returns & Exchanges</h3>
          <p className="text-[14px] text-primary-950/60 mb-4 max-w-md mx-auto">
            If you face any issues with your delivery or wish to initiate a return, please reach out to us on WhatsApp.
          </p>

          <a 
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '917020664641'}?text=Hello Mukesh Saree Centre, I would like to request a return/exchange for my order.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium text-[14px] rounded-md py-3.5 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm max-w-sm mx-auto"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.91 2.54 15.69 3.46 17.18L2 22L6.96 20.66C8.42 21.52 10.15 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.37 20 8.84 19.6 7.51 18.9L4.1 19.82L5.05 16.5C4.28 15.19 3.84 13.65 3.84 12C3.84 7.5 7.5 3.84 12 3.84C16.5 3.84 20.16 7.5 20.16 12C20.16 16.5 16.5 20 12 20ZM16.29 14.89C16.03 14.76 14.75 14.13 14.51 14.04C14.28 13.96 14.11 13.92 13.94 14.17C13.77 14.43 13.27 15.02 13.12 15.2C12.96 15.37 12.8 15.39 12.54 15.26C12.28 15.13 11.45 14.86 10.46 13.98C9.69 13.3 9.17 12.44 9.02 12.18C8.86 11.92 9.01 11.78 9.14 11.65C9.25 11.53 9.4 11.35 9.53 11.2C9.66 11.05 9.7 10.95 9.79 10.77C9.88 10.6 9.83 10.45 9.77 10.32C9.7 10.19 9.19 8.92 8.98 8.4C8.77 7.89 8.56 7.96 8.41 7.95C8.26 7.94 8.09 7.94 7.92 7.94C7.75 7.94 7.48 8.01 7.24 8.27C7.01 8.53 6.35 9.14 6.35 10.37C6.35 11.61 7.28 12.8 7.41 12.97C7.54 13.14 9.15 15.65 11.61 16.71C12.19 16.96 12.65 17.11 13.0 17.22C13.58 17.41 14.12 17.38 14.54 17.31C15 17.22 16.03 16.67 16.24 16.06C16.45 15.45 16.45 14.93 16.38 14.82C16.31 14.7 16.14 14.63 15.88 14.5L16.29 14.89Z" />
            </svg>
            Request Return on WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
