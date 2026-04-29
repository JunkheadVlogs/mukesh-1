import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-[56px] font-serif text-primary-950 mb-6 font-normal">Contact Us</h1>
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
                  Mukesh Saree Centre,<br />
                  Jaganth Road, Gandibagh,<br />
                  Nagpur 440002
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
                <p className="text-primary-950/70 text-[14px] font-light mt-1">Contact Person: Mohit<br />+91 7020664641</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="text-gold-500 mt-0.5 mr-5 flex-shrink-0" size={20} strokeWidth={1.5} />
              <div>
                <h3 className="text-[11px] tracking-[1px] uppercase text-primary-950 mb-2">Email</h3>
                <p className="text-primary-950/70 text-[14px] font-light mt-1">Info.mukeshsareecentre@gmail.com</p>
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

        <div className="bg-primary-50 p-10 lg:p-12 border border-black/5 flex flex-col justify-center">
          <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-8 border-b border-black/5 pb-4">Send us a Message</h2>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
            <div>
              <label className="block text-[10px] tracking-[1px] uppercase text-primary-950/50 mb-2">Name</label>
              <input required type="text" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[1px] uppercase text-primary-950/50 mb-2">Email or Phone</label>
              <input required type="text" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[1px] uppercase text-primary-950/50 mb-2">Message</label>
              <textarea required rows={4} className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors resize-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary-950 text-white hover:bg-gold-500 py-4 text-[11px] tracking-[2px] uppercase transition-colors mt-4">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
