export default function About() {
  return (
    <div>
      <div className="bg-transparent py-24 text-center border-b border-black/5">
        <h1 className="text-2xl md:text-[44px] font-serif mb-6 text-primary-950 font-normal leading-tight">Our Legacy</h1>
        <p className="text-primary-950/70 max-w-2xl mx-auto px-4 font-light text-lg">Since 1976, we have been crafting elegance and upholding the tradition of fine Indian wear.</p>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="prose prose-lg text-primary-950/80 font-light prose-headings:font-serif prose-headings:text-primary-950 prose-headings:font-normal max-w-none prose-a:text-gold-500">
          <h2 className="text-2xl md:text-3xl">The Journey Begins</h2>
          <p className="leading-relaxed">
            Mukesh Saree Centre was founded in 1976 by the visionary <strong className="text-primary-950 font-medium">Shri Nanakram Ji Khemchandani</strong>. What started as a modest store with a passion for high-quality fabrics quickly grew into a beloved landmark for women seeking the perfect attire for their most cherished moments. 
          </p>
          
          <div className="my-16 aspect-video overflow-hidden bg-primary-50 border border-black/5 p-4">
             <img src="https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Vintage textile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          </div>

          <h2 className="text-2xl md:text-3xl mt-12">The Physical Experience</h2>
          <p className="leading-relaxed mb-8">
            Step into our store and experience a world of heritage and craftsmanship. From the inviting storefront to the carefully curated indoor presentation, every detail at Mukesh Saree Centre is designed to provide you with a memorable shopping journey.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10">
             <div className="aspect-[4/5] overflow-hidden bg-primary-50 border border-black/5 p-2 shadow-sm">
                <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Shop Front" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                <p className="text-center text-[11px] uppercase tracking-[1px] mt-3 text-primary-950/60">Shop Front</p>
             </div>
             <div className="aspect-[4/5] overflow-hidden bg-primary-50 border border-black/5 p-2 shadow-sm">
                <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Shop Interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                <p className="text-center text-[11px] uppercase tracking-[1px] mt-3 text-primary-950/60">Indoor Collection</p>
             </div>
             <div className="sm:col-span-2 aspect-video overflow-hidden bg-primary-50 border border-black/5 p-2 shadow-sm relative group cursor-pointer mt-4">
                <img src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Shop Video Tour" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-950"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  </div>
                </div>
                <p className="absolute bottom-4 left-0 right-0 text-center text-[11px] uppercase tracking-[2px] text-white font-medium drop-shadow-md">Watch Store Tour</p>
             </div>
          </div>

          <h2 className="text-2xl md:text-3xl mt-12">Generations of Trust</h2>
          <p className="leading-relaxed">
            For decades, we have been more than just a store; we are a part of our customers' families, dressing generations of brides, mothers, and daughters. Today, the legacy continues under the dynamic leadership of his sons, including <strong className="text-primary-950 font-medium">Mohit Khemchandani</strong>.
          </p>
          <p className="leading-relaxed">
            Mohit and his brothers have seamlessly blended their father's traditional values with modern aesthetics. They understand that today’s woman appreciates her roots but also desires contemporary flair. This perfect balance is reflected in our curated collections of premium sarees and trendy co-ord sets.
          </p>

          <h2 className="text-2xl md:text-3xl mt-12">Our Promise</h2>
          <ul className="space-y-4 marker:text-gold-500">
            <li><strong className="text-primary-950 font-medium">Premium Quality You Can Feel:</strong> Every thread is woven with care, and every fabric is hand-picked.</li>
            <li><strong className="text-primary-950 font-medium">Affordable Luxury:</strong> Elegance should not always come at an exorbitant price.</li>
            <li><strong className="text-primary-950 font-medium">Personalized Service:</strong> We believe in building relationships, not just completing transactions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
