import { MapPin, Phone, Mail, Award } from 'lucide-react';
import { SEO } from './components/SEO';

export default function Contact() {
  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO 
          title="Contact Us | Mukesh Saree Centre" 
          description="Need assistance? Reach out to Mukesh Saree Centre. Our team is here to help with your orders, product inquiries, or general feedback. Get in touch now." 
          url="/contact"
        />
        
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mb-2 tracking-wide uppercase">Mukesh Saree Centre</h1>
          <div className="w-16 h-[1px] bg-gold-200 mx-auto mb-3"></div>
          <p className="max-w-md mx-auto text-primary-950/60 text-[14px] font-light leading-relaxed">
            Since 1978. Curating authentic sarees, luxury lehengas, and designer ensembles.
          </p>
        </div>
        
        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div className="flex-1 space-y-5 border-b md:border-b-0 md:border-r border-black/5 pb-6 md:pb-0 md:pr-10">
               <div className="flex items-start gap-4">
                  <MapPin className="text-gold-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                     <h3 className="text-[12px] uppercase tracking-wider font-semibold text-primary-950 mb-1">Address</h3>
                     <p className="text-[14px] text-primary-950/70 leading-relaxed font-light">
                        Jagnath Road, Nagpur, Maharashtra
                     </p>
                     <a 
                        href="https://share.google/n9O7GlYck8DrF7u2J" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[12px] text-gold-600 hover:text-primary-950 transition-colors mt-1 inline-block font-medium underline underline-offset-4"
                     >
                        Get Directions
                     </a>
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <Phone className="text-gold-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                     <h3 className="text-[12px] uppercase tracking-wider font-semibold text-primary-950 mb-1">Contact</h3>
                     <p className="text-[14px] text-primary-950/70 font-light">+91 70206 64641</p>
                     <p className="text-[11px] text-primary-950/40 font-light mt-0.5">Available 10:30 AM — 9:00 PM IST</p>
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <Mail className="text-gold-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                     <h3 className="text-[12px] uppercase tracking-wider font-semibold text-primary-950 mb-1">Email</h3>
                     <p className="text-[14px] text-primary-950/70 font-light">info@mukeshsarees.com</p>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center pt-2 md:pt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gold-600">
                    <Award size={18} />
                    <span className="text-[12px] uppercase tracking-wider font-semibold">Premium Concierge</span>
                  </div>
                  <p className="text-[13px] text-primary-950/60 font-light leading-relaxed">
                    Have a question or looking to place a bespoke order? Chat directly with our boutique assistants.
                  </p>
                  <a 
                    href="https://wa.me/917020664641?text=Hello Mukesh Saree Centre, I need assistance."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium text-[13px] tracking-wide uppercase rounded-sm py-3 transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-sm font-sans"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.91 2.54 15.69 3.46 17.18L2 22L6.96 20.66C8.42 21.52 10.15 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.37 20 8.84 19.6 7.51 18.9L4.1 19.82L5.05 16.5C4.28 15.19 3.84 13.65 3.84 12C3.84 7.5 7.5 3.84 12 3.84C16.5 3.84 20.16 7.5 20.16 12C20.16 16.5 16.5 20 12 20ZM16.29 14.89C16.03 14.76 14.75 14.13 14.51 14.04C14.28 13.96 14.11 13.92 13.94 14.17C13.77 14.43 13.27 15.02 13.12 15.2C12.96 15.37 12.8 15.39 12.54 15.26C12.28 15.13 11.45 14.86 10.46 13.98C9.69 13.3 9.17 12.44 9.02 12.18C8.86 11.92 9.01 11.78 9.14 11.65C9.25 11.53 9.4 11.35 9.53 11.2C9.66 11.05 9.7 10.95 9.79 10.77C9.88 10.6 9.83 10.45 9.77 10.32C9.7 10.19 9.19 8.92 8.98 8.4C8.77 7.89 8.56 7.96 8.41 7.95C8.26 7.94 8.09 7.94 7.92 7.94C7.75 7.94 7.48 8.01 7.24 8.27C7.01 8.53 6.35 9.14 6.35 10.37C6.35 11.61 7.28 12.8 7.41 12.97C7.54 13.14 9.15 15.65 11.61 16.71C12.19 16.96 12.65 17.11 13.0 17.22C13.58 17.41 14.12 17.38 14.54 17.31C15 17.22 16.03 16.67 16.24 16.06C16.45 15.45 16.45 14.93 16.38 14.82C16.31 14.7 16.14 14.63 15.88 14.5L16.29 14.89Z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
