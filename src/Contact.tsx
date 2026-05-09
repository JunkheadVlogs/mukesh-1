import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SEO } from './components/SEO';
import { CONFIG } from './config';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
      <SEO 
        title="Contact Us | Mukesh Saree Centre" 
        description="Need assistance? Reach out to Mukesh Saree Centre. Our team is here to help with your orders, product inquiries, or general feedback. Get in touch now." 
        url="/contact"
      />
      <div className="bg-ivory pt-32 pb-48 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h4 className="text-gold-500 text-[10px] uppercase tracking-[4px] font-bold mb-10">The Concierge</h4>
          <h1 className="text-5xl md:text-8xl font-serif text-onyx mb-12 italic leading-tight">Connect with <br/>the House</h1>
          <p className="text-onyx/40 text-lg md:text-xl font-serif leading-relaxed italic max-w-2xl mx-auto">
            "Whether you are curating a bridal trousseau or seeking styling advice, our experts are at your service for a bespoke consultation."
          </p>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-5 space-y-20">
            <div className="space-y-12">
               <div className="flex items-start group">
                  <div className="pt-2 text-gold-500 opacity-40 group-hover:opacity-100 transition-all mr-8">
                     <MapPin size={24} strokeWidth={1} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-[10px] uppercase tracking-[4px] font-bold text-onyx/20">The Boutique Address</h3>
                     <p className="text-xl md:text-2xl font-serif leading-tight text-onyx">
                        {CONFIG.STORE_NAME},<br />
                        {CONFIG.STORE_ADDRESS}
                     </p>
                     <a 
                        href="https://share.google/n9O7GlYck8DrF7u2J" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] tracking-[4px] uppercase text-gold-500 border-b border-gold-500/20 hover:border-onyx transition-all pb-1 font-bold inline-block"
                     >
                        Navigate to the House
                     </a>
                  </div>
               </div>

               <div className="flex items-start group">
                  <div className="pt-2 text-gold-500 opacity-40 group-hover:opacity-100 transition-all mr-8">
                     <Phone size={24} strokeWidth={1} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-[10px] uppercase tracking-[4px] font-bold text-onyx/20">Direct Line</h3>
                     <p className="text-2xl font-serif text-onyx">{CONFIG.STORE_PHONE}</p>
                     <p className="text-[10px] uppercase tracking-[2px] text-onyx/40 font-medium italic">Available 10:30 AM — 9:00 PM IST</p>
                  </div>
               </div>

               <div className="flex items-start group">
                  <div className="pt-2 text-gold-500 opacity-40 group-hover:opacity-100 transition-all mr-8">
                     <Mail size={24} strokeWidth={1} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-[10px] uppercase tracking-[4px] font-bold text-onyx/20">Digital Correspondance</h3>
                     <p className="text-2xl font-serif text-onyx">{CONFIG.STORE_EMAIL}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-7">
             <div className="aspect-square md:aspect-video bg-white rounded-sm overflow-hidden border border-onyx/5 shadow-luxury relative group">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.0858547285694!2d79.09703647600021!3d21.148962683642146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0f1659929a5%3A0xc34586c95c2ec428!2sMukesh%20Saree%20Centre!5e0!3m2!1sen!2sin!4v1709669528001!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, minHeight: '100%', filter: 'grayscale(1) contrast(1.1) brightness(1.1)' }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Boutique Location"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none border-[20px] border-onyx/[0.02] group-hover:border-onyx/[0.05] transition-all duration-1000" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
