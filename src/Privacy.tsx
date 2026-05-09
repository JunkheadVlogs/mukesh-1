import { SEO } from './components/SEO';

export default function Privacy() {
  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32 md:py-48">
        <SEO 
          title="Privacy Policy | Mukesh Saree Centre" 
          description="Your privacy is our priority. Read Mukesh Saree Centre's privacy policy to understand how we protect and manage your personal data and shopping information." 
          url="/privacy"
        />
        <div className="mb-24">
          <h4 className="text-gold-500 mb-6 drop-shadow-sm uppercase tracking-[4px] font-bold text-[11px]">Transparency</h4>
          <h1 className="text-5xl md:text-7xl font-serif leading-tight text-onyx">Privacy Policy</h1>
        </div>
        <div className="prose prose-lg text-onyx/70 font-medium max-w-none relative z-10 font-sans">
          <p className="text-[11px] tracking-[2px] uppercase text-gold-500 mb-12 border-b border-onyx/5 pb-4 font-bold">Document Version: {new Date().toLocaleDateString()}</p>
          <p className="leading-relaxed mb-10 text-onyx/80 text-xl font-serif italic">"At Mukesh Saree Centre, we are committed to protecting your privacy and ensuring the security of your personal information."</p>
          <p className="leading-relaxed mb-10">This Privacy Policy outlines how we collect, use, and safeguard your data when you interact with our website.</p>
          
          <h3 className="text-[14px] tracking-[3px] uppercase mt-12 mb-6 text-onyx font-bold border-l-2 border-gold-500 pl-4">Information We Collect</h3>
          <p className="leading-relaxed mb-10">We may collect personal information such as your name, email address, phone number, shipping address, and payment details when you make a purchase, register for an account, or subscribe to our newsletter.</p>
          
          <h3 className="text-[14px] tracking-[3px] uppercase mt-12 mb-6 text-onyx font-bold border-l-2 border-gold-500 pl-4">How We Use Your Information</h3>
          <p className="leading-relaxed mb-10">We use your information to process transactions, deliver your orders, communicate with you about your purchases, and provide personalized marketing offers (if you have opted in).</p>
          
          <h3 className="text-[14px] tracking-[3px] uppercase mt-12 mb-6 text-onyx font-bold border-l-2 border-gold-500 pl-4">Data Security</h3>
          <p className="leading-relaxed mb-10">We implement strict security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use secure payment gateways to process transactions.</p>
        </div>
      </div>
    </div>
  );
}
