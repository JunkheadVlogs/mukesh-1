import { SEO } from './components/SEO';

export default function About() {
  return (
    <div>
      <SEO 
        title="Our Story | Mukesh Saree Centre" 
        description="Heritage of trust and elegance. Learn about Mukesh Saree Centre's journey in bringing the finest sarees and modern ethnic wear to our valued customers." 
        url="/about"
      />
      <div className="bg-ivory pt-32 pb-48 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h4 className="text-gold-500 text-[10px] uppercase tracking-[4px] font-bold mb-10">Since 1976</h4>
          <h1 className="text-5xl md:text-8xl font-serif text-onyx mb-12 italic leading-tight">The Heritage of <br/>Mukesh Saree</h1>
          <p className="text-onyx/40 text-lg md:text-xl font-serif leading-relaxed italic max-w-2xl mx-auto">
            "We do not merely sell garments; we curate the living tapestries of our cultural legacy."
          </p>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-12">
             <div className="aspect-[21/9] overflow-hidden bg-white rounded-sm group relative border border-onyx/5 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="Textile Detail" 
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2s]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ivory via-transparent to-transparent flex items-end p-12">
                   <p className="text-[10px] uppercase tracking-[4px] text-onyx/40 font-bold italic">The Art of the Thread</p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-5 space-y-12">
            <h2 className="text-4xl md:text-5xl font-serif italic border-b border-onyx/5 pb-8 text-onyx">The Foundation</h2>
            <div className="space-y-8 text-onyx/60 text-sm leading-relaxed font-light">
              <p>
                Mukesh Saree Centre was founded in 1976 by the visionary <span className="text-onyx font-bold">Shri Nanakram Ji Khemchandani</span>. What started as a modest boutique with a passion for high-quality fabrics quickly grew into a beloved landmark for those seeking the perfect attire for their most cherished moments.
              </p>
              <p>
                For over four decades, our House has been anchored by the belief that every weave tells a story—a narrative of heritage, celebration, and the timeless grace of the Indian woman.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-10">
              <div className="aspect-[3/4] bg-white overflow-hidden rounded-sm group relative border border-onyx/5 shadow-sm">
                 <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80 transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                 <div className="absolute top-4 left-4">
                    <span className="text-[9px] uppercase tracking-[3px] text-onyx/20 font-bold">The Flagship</span>
                 </div>
              </div>
              <div className="aspect-[3/4] bg-white overflow-hidden rounded-sm group relative border border-onyx/5 shadow-sm">
                 <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80 transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                 <div className="absolute top-4 left-4">
                    <span className="text-[9px] uppercase tracking-[3px] text-onyx/20 font-bold">Heritage Gallery</span>
                 </div>
              </div>
          </div>

          <div className="lg:col-span-12 border-t border-onyx/5 pt-24 mt-24">
            <div className="max-w-4xl">
              <h2 className="text-onyx text-4xl md:text-5xl font-serif italic mb-16">The Contemporary Dialogue</h2>
              <div className="grid md:grid-cols-2 gap-20">
                <div className="space-y-6 text-onyx/50 text-sm leading-relaxed">
                  <p>
                    Today, the legacy is carried forward by his sons, including <span className="text-onyx font-bold">Mohit Khemchandani</span>. Under their stewardship, the House has seamlessly blended traditional values with a modern, global aesthetic.
                  </p>
                  <p>
                    They understand that the modern woman is a confluence of identities—she appreciates her roots but possesses a contemporary flair. Our curated collections of premium sarees and luxury co-ord sets reflect this perfect equilibrium.
                  </p>
                </div>
                <div className="space-y-12">
                   <div className="space-y-4">
                      <h4 className="text-gold-500 text-[10px] uppercase tracking-[4px] font-bold font-sans">Pure Silhouettes</h4>
                      <p className="text-sm text-onyx/60 leading-relaxed italic font-serif">Every thread is meticulously curated, hand-picked for its superior drape and narrative potential.</p>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-gold-500 text-[10px] uppercase tracking-[4px] font-bold font-sans">The Concierge Ethos</h4>
                      <p className="text-sm text-onyx/60 leading-relaxed italic font-serif">Every guest is a patron of our family legacy, treated with the personalized attention that only a boutique establishment can provide.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
