import { useState } from 'react';
import { MapPin, Phone, Mail, Award } from 'lucide-react';
import { SEO } from './components/SEO';
import { CONFIG, getWhatsAppNumber } from './config';
import { trackContact } from './tracking';
import { sendExitLeadToSheets } from './utils/googleSheets';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState('');
  const [requestType, setRequestType] = useState('Saree Customization Inquiry');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId] = useState(() => 'REQ-' + Math.floor(100000 + Math.random() * 900000));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedMsg = messageText.trim();

    if (!trimmedName || !trimmedPhone || !trimmedMsg) {
      setError('Please fill in all fields.');
      return;
    }

    // Indian 10-digit validation
    let cleanPhone = trimmedPhone.replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.substring(2);
    }

    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    // Call Contact event tracking (Pixel and CAPI)
    try {
      trackContact({
        name: trimmedName,
        phone: trimmedPhone
      });
    } catch (trackErr) {
      console.warn("Contact tracking failed:", trackErr);
    }

    // Submit details to Google Sheet first (using the exact same endpoint/tab as Exit Intent Details)
    try {
      await sendExitLeadToSheets({
        name: trimmedName,
        phone: trimmedPhone,
        request: `[${requestType}] ${trimmedMsg}`,
        requestId: requestId,
        source: 'Contact Page'
      });
    } catch (sheetErr) {
      console.warn("Failed sending contact message to Google Sheets:", sheetErr);
    }

    setIsSubmitting(false);

    // Submit via direct WhatsApp deep-link with detailed Request formatting
    const message = encodeURIComponent(
      `Hi Mukesh Saree Centre!\n\n*Support Request ID:* ${requestId}\n*Name:* ${trimmedName}\n*Category:* ${requestType}\n*Message:* ${trimmedMsg}`
    );
    window.open(`https://wa.me/917020664641?text=${message}`, '_blank');
  };

  const customSchema = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "mainEntity": {
        "@id": "https://mukeshsarees.com/#organization"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mukeshsarees.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact Us",
          "item": "https://mukeshsarees.com/contact"
        }
      ]
    }
  ];

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <SEO 
          title="Contact Us | Mukesh Saree Centre Nagpur — WhatsApp, Phone & Store Address" 
          description="Contact Mukesh Saree Centre in Nagpur. Call or WhatsApp +91 70206 64641. Visit our store on Jagnath Road, Gandhibagh, Nagpur 440002. Open Mon–Sat, 10AM–8PM." 
          url="/contact"
          schema={customSchema}
        />
        
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mb-2 tracking-wide uppercase">Mukesh Saree Centre</h1>
          <div className="w-16 h-[1px] bg-gold-200 mx-auto mb-3"></div>
          <p className="max-w-md mx-auto text-primary-950/60 text-[14px] font-light leading-relaxed">
            Since 1978. Providing beautiful sarees, party-wear lehengas, and designer outfits.
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
                        {CONFIG.STORE_ADDRESS}
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
                     <a href={`tel:${CONFIG.STORE_PHONE.replace(/[^0-9+]/g, '')}`} className="text-[14px] text-primary-950/70 font-light hover:text-gold-600 transition-colors block">
                       {CONFIG.STORE_PHONE}
                     </a>
                     <p className="text-[11px] text-primary-950/40 font-light mt-0.5">Available 10:30 AM — 9:00 PM IST</p>
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <Mail className="text-gold-500 mt-1 flex-shrink-0" size={18} />
                  <div>
                     <h3 className="text-[12px] uppercase tracking-wider font-semibold text-primary-950 mb-1">Email</h3>
                     <a href={`mailto:${CONFIG.STORE_EMAIL}`} className="text-[14px] text-primary-950/70 font-light hover:text-gold-600 transition-colors block">
                       {CONFIG.STORE_EMAIL}
                     </a>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center pt-2 md:pt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gold-600">
                    <Award size={18} />
                    <span className="text-[12px] uppercase tracking-wider font-semibold">Drop Us a Message</span>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="flex flex-col text-left">
                    {/* Unique Support Request ID Badge */}
                    <div className="flex justify-between items-center bg-amber-50/40 border border-amber-500/10 rounded-sm p-3 mb-3.5 select-none hover:bg-amber-50/75 transition-colors">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 font-sans">Support Request ID</span>
                      <span className="font-mono text-xs font-bold text-neutral-800 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/15">{requestId}</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all placeholder:text-neutral-400 rounded-sm font-sans text-xs sm:text-sm text-neutral-900 shadow-sm mb-3.5"
                      required
                    />

                    <div className="flex border border-neutral-200 rounded-sm overflow-hidden mb-3.5 focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500 transition-all shadow-sm">
                      <span className="bg-neutral-50 px-3.5 py-2.5 text-neutral-500 text-xs sm:text-sm border-r border-neutral-200 flex items-center font-sans select-none">+91</span>
                      <input
                        type="tel"
                        placeholder="WhatsApp Number"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                        className="flex-1 px-3.5 py-2.5 bg-transparent outline-none font-sans text-xs sm:text-sm text-neutral-900"
                        maxLength={10}
                        required
                      />
                    </div>

                    {/* Request Type Selection */}
                    <div className="mb-3.5">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-primary-950 font-sans mb-1.5 block select-none">Contact Topic / Request</label>
                      <select
                        value={requestType}
                        onChange={e => setRequestType(e.target.value)}
                        className="w-full px-3 px-2 py-2 bg-neutral-50/50 border border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all rounded-sm font-sans text-xs sm:text-sm text-neutral-900 shadow-sm cursor-pointer"
                      >
                        <option value="Saree Customization Inquiry">Saree Customization Inquiry</option>
                        <option value="Order Status & Tracking">Order Status &amp; Tracking</option>
                        <option value="Return / Refund Inquiry">Return / Refund Inquiry</option>
                        <option value="Bulk / Wholesale Inquiry">Bulk / Wholesale Inquiry</option>
                        <option value="Product Sizing & Quality Query">Product Sizing &amp; Quality Query</option>
                        <option value="General Support Inquiry">General Support Inquiry</option>
                      </select>
                    </div>

                    <div className="relative">
                      <textarea
                        placeholder="Your Message / Query Details"
                        value={messageText}
                        onChange={e => setMessageText(e.target.value.slice(0, 500))}
                        rows={4}
                        className="w-full px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all placeholder:text-neutral-400 rounded-sm font-sans text-xs sm:text-sm text-neutral-900 shadow-sm"
                        required
                      />
                      <div className="text-[10px] text-right text-neutral-400 mt-1 font-sans">
                        {messageText.length} / 500 chars
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-500 text-xs font-semibold mb-3.5 font-sans mt-1">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-[13px] tracking-wide uppercase rounded-sm py-3 transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-sm font-sans cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.91 2.54 15.69 3.46 17.18L2 22L6.96 20.66C8.42 21.52 10.15 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.37 20 8.84 19.6 7.51 18.9L4.1 19.82L5.05 16.5C4.28 15.19 3.84 13.65 3.84 12C3.84 7.5 7.5 3.84 12 3.84C16.5 3.84 20.16 7.5 20.16 12C20.16 16.5 16.5 20 12 20ZM16.29 14.89C16.03 14.76 14.75 14.13 14.51 14.04C14.28 13.96 14.11 13.92 13.94 14.17C13.77 14.43 13.27 15.02 13.12 15.2C12.96 15.37 12.8 15.39 12.54 15.26C12.28 15.13 11.45 14.86 10.46 13.98C9.69 13.3 9.17 12.44 9.02 12.18C8.86 11.92 9.01 11.78 9.14 11.65C9.25 11.53 9.4 11.35 9.53 11.2C9.66 11.05 9.7 10.95 9.79 10.77C9.88 10.6 9.83 10.45 9.77 10.32C9.7 10.19 9.19 8.92 8.98 8.4C8.77 7.89 8.56 7.96 8.41 7.95C8.26 7.94 8.09 7.94 7.92 7.94C7.75 7.94 7.48 8.01 7.24 8.27C7.01 8.53 6.35 9.14 6.35 10.37C6.35 11.61 7.28 12.8 7.41 12.97C7.54 13.14 9.15 15.65 11.61 16.71C12.19 16.96 12.65 17.11 13.0 17.22C13.58 17.41 14.12 17.38 14.54 17.31C15 17.22 16.03 16.67 16.24 16.06C16.45 15.45 16.45 14.93 16.38 14.82C16.31 14.7 16.14 14.63 15.88 14.5L16.29 14.89Z" />
                        </svg>
                      )}
                      {isSubmitting ? 'Submitting query...' : 'Send Message on WhatsApp'}
                    </button>
                  </form>
                </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
