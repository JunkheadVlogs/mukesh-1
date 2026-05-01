import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { CONFIG } from './config';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-20">
        <h1 className="text-2xl md:text-[44px] font-serif text-primary-950 mb-6 font-normal">Contact Us</h1>
        <div className="w-16 h-[1px] bg-primary-950/20 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-8 border-b border-black/5 pb-4">Get in Touch</h2>
          <p className="text-primary-950/70 mb-12 font-light leading-relaxed">
            Whether you have a question about an order, need styling advice, or want to explore our collections in person, we're here to help.
          </p>
          
          <div className="space-y-10">
            <div className="flex items-start">
              <MapPin className="text-gold-500 mt-0.5 mr-5 flex-shrink-0" size={20} strokeWidth={1.5} />
              <div>
                <h3 className="text-[11px] tracking-[1px] uppercase text-primary-950 mb-2">Visit Our Store</h3>
                <p className="text-primary-950/70 text-[14px] font-light leading-relaxed">
                  {CONFIG.STORE_NAME},<br />
                  {CONFIG.STORE_ADDRESS}
                </p>
                <a 
                  href="https://share.google/n9O7GlYck8DrF7u2J" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] tracking-[1px] uppercase text-gold-500 hover:text-primary-950 inline-block mt-3 border-b border-gold-500 hover:border-primary-950 pb-0.5 transition-colors"
                >
                  Get Directions &rarr;
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="text-gold-500 mt-0.5 mr-5 flex-shrink-0" size={20} strokeWidth={1.5} />
              <div>
                <h3 className="text-[11px] tracking-[1px] uppercase text-primary-950 mb-2">Call / WhatsApp</h3>
                <p className="text-primary-950/70 text-[14px] font-light mt-1">Contact Person: Mohit<br />{CONFIG.STORE_PHONE}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="text-gold-500 mt-0.5 mr-5 flex-shrink-0" size={20} strokeWidth={1.5} />
              <div>
                <h3 className="text-[11px] tracking-[1px] uppercase text-primary-950 mb-2">Email</h3>
                <p className="text-primary-950/70 text-[14px] font-light mt-1">{CONFIG.STORE_EMAIL}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="text-gold-500 mt-0.5 mr-5 flex-shrink-0" size={20} strokeWidth={1.5} />
              <div>
                <h3 className="text-[11px] tracking-[1px] uppercase text-primary-950 mb-2">Store Hours</h3>
                <p className="text-primary-950/70 text-[14px] font-light mt-1">Monday - Sunday: 10:30 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary-50 p-10 lg:p-12 border border-black/5 flex flex-col justify-center relative overflow-hidden min-h-[400px]">
          <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-8 border-b border-black/5 pb-4">Visit Our Store</h2>
          <div className="flex-grow flex items-center justify-center bg-black/5 rounded overflow-hidden">
             {/* Map Placeholder or image */}
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.0858547285694!2d79.09703647600021!3d21.148962683642146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0f1659929a5%3A0xc34586c95c2ec428!2sMukesh%20Saree%20Centre!5e0!3m2!1sen!2sin!4v1709669528001!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '100%' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
