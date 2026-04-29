export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-[40px] font-serif text-primary-950 mb-6 font-normal">Privacy Policy</h1>
        <div className="w-16 h-[1px] bg-primary-950/20 mx-auto"></div>
      </div>
      <div className="prose prose-lg text-primary-950/80 font-light max-w-none">
        <p className="text-[11px] tracking-[1px] uppercase text-primary-950/50 mb-8 border-b border-black/5 pb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="leading-relaxed mb-10">At Mukesh Saree Centre, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you interact with our website.</p>
        
        <h3 className="text-[13px] tracking-[2px] uppercase text-primary-950 mt-12 mb-6">Information We Collect</h3>
        <p className="leading-relaxed mb-10">We may collect personal information such as your name, email address, phone number, shipping address, and payment details when you make a purchase, register for an account, or subscribe to our newsletter.</p>
        
        <h3 className="text-[13px] tracking-[2px] uppercase text-primary-950 mt-12 mb-6">How We Use Your Information</h3>
        <p className="leading-relaxed mb-10">We use your information to process transactions, deliver your orders, communicate with you about your purchases, and provide personalized marketing offers (if you have opted in).</p>
        
        <h3 className="text-[13px] tracking-[2px] uppercase text-primary-950 mt-12 mb-6">Data Security</h3>
        <p className="leading-relaxed mb-10">We implement strict security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use secure payment gateways to process transactions.</p>
      </div>
    </div>
  );
}
