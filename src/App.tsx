import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { ProductCard } from "./components/ProductCard";
import { products } from "./data/products";
import { Product } from "./types";

interface CartItem extends Product {
  quantity: number;
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("/"); // '/', 'product-detail', 'checkout', 'checkout-success'
  const [selectedProductSlug, setSelectedProductSlug] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout state
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleViewProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentRoute("product-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeProduct = products.find((p) => p.slug === selectedProductSlug);

  const getFilteredProducts = () => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category.includes(selectedCategory));
  };

  const categories = ["All", "Sarees", "Linen Sarees", "Co-Ord Sets"];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);
    // Simulate API call and payment delay
    setTimeout(() => {
      setIsPlacingOrder(false);
      setCart([]); // Clear cart
      setCurrentRoute("checkout-success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-white text-gray-900">
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-grow w-full relative">
        {currentRoute === "/" && (
          <div className="flex flex-col">
            {/* HERO BANNER */}
            <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black overflow-hidden flex items-center justify-center">
              <picture className="absolute inset-0 w-full h-full">
                <source media="(max-width: 768px)" srcSet="https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469" />
                <img 
                  src="https://ik.imagekit.io/tus1loev9/homepage/heroimage.webp?updatedAt=1779907895469" 
                  alt="Mukesh Saree Centre Hero" 
                  className="w-full h-full object-cover object-center opacity-70"
                />
              </picture>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40">
                <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-widest text-center mb-4 text-white drop-shadow-md px-4">
                  A Legacy of Elegance
                </h2>
                <p className="font-serif text-xs md:text-sm italic tracking-widest max-w-lg text-center drop-shadow px-4 uppercase text-gray-200">
                  Timeless handwoven sarees, exquisite lehengas, and modern pure cotton co-ords since 1978.
                </p>
                <button 
                  onClick={() => document.getElementById("shop-collection")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-8 px-8 py-3 bg-white text-black font-bold text-xs tracking-widest uppercase hover:bg-gray-200 transition-all duration-300 shadow-xl cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            </div>

            {/* CATEGORIES / SHOWROOM PREVIEWS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
              <div className="text-center mb-12">
                <h3 className="font-display text-2xl font-semibold tracking-widest uppercase text-gray-900">Our Collections</h3>
                <div className="h-0.5 w-12 bg-gray-900 mx-auto mt-4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div 
                  className="group relative h-[400px] overflow-hidden cursor-pointer"
                  onClick={() => { setSelectedCategory("Sarees"); document.getElementById("shop-collection")?.scrollIntoView({ behavior: "smooth" }); }}
                >
                  <img src="https://ik.imagekit.io/tus1loev9/homepage/saree-category.webp?updatedAt=1779907894790" alt="Premium Sarees" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute bottom-8 left-8 text-left">
                    <h4 className="text-white text-2xl font-bold tracking-widest uppercase mb-1 drop-shadow-md">Select Sarees</h4>
                    <p className="text-gray-100 text-sm font-semibold tracking-wider font-serif italic drop-shadow-md">Discover Handwoven Elegance</p>
                  </div>
                </div>
                <div 
                  className="group relative h-[400px] overflow-hidden cursor-pointer"
                  onClick={() => { setSelectedCategory("Co-Ord Sets"); document.getElementById("shop-collection")?.scrollIntoView({ behavior: "smooth" }); }}  
                >
                  <img src="https://ik.imagekit.io/tus1loev9/homepage/coordsetcategory.webp?updatedAt=1779907895090" alt="Co-Ord Sets" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  <div className="absolute bottom-8 left-8 text-left">
                    <h4 className="text-white text-2xl font-bold tracking-widest uppercase mb-1 drop-shadow-md">Co-Ord Sets</h4>
                    <p className="text-gray-100 text-sm font-semibold tracking-wider font-serif italic drop-shadow-md">Modern Comfort & Style</p>
                  </div>
                </div>
              </div>

              {/* SHOP SHOWCASE CAROUSEL */}
              <div className="py-16 md:py-24 border-t border-gray-100 mt-10">
                <div className="text-center mb-10 max-w-2xl mx-auto px-4">
                  <h3 className="font-display text-2xl font-semibold tracking-widest uppercase text-gray-900 mb-4">Our Physical Store</h3>
                  <p className="text-sm text-gray-600 font-serif leading-loose mb-6">
                    MUKESH SAREE CENTRE is located in the heart of Nagpur. We have been a landmark for bridal and festive shopping since 1978. Experience our curated selection of fine fabrics, lehengas, and handwoven sarees in person.
                  </p>
                  <a 
                    href="https://maps.google.com/?q=Mukesh+Saree+Centre,+Jagnath+Road,+Nagpur" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-block px-8 py-3 border border-gray-900 text-gray-900 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 hover:text-white transition-colors duration-300"
                  >
                    Visit Shop on Google Maps
                  </a>
                </div>

                <div className="flex overflow-x-auto gap-4 sm:gap-6 snap-x snap-mandatory pt-4 pb-8 scrollbar-hide px-4 sm:px-0">
                  <div className="min-w-[85vw] sm:min-w-[60vw] md:min-w-[50vw] lg:min-w-[35vw] aspect-[4/3] flex-shrink-0 snap-center rounded-sm overflow-hidden bg-gray-100">
                     <img src="https://ik.imagekit.io/tus1loev9/homepage/shopenterence.webp?updatedAt=1779907894298" className="w-full h-full object-cover" alt="Shop Entrance" loading="lazy" />
                  </div>
                  <div className="min-w-[85vw] sm:min-w-[60vw] md:min-w-[50vw] lg:min-w-[35vw] aspect-[4/3] flex-shrink-0 snap-center rounded-sm overflow-hidden bg-gray-100">
                     <img src="https://ik.imagekit.io/tus1loev9/homepage/billingcounter.webp?updatedAt=1779907894357" className="w-full h-full object-cover" alt="Billing Counter" loading="lazy" />
                  </div>
                  <div className="min-w-[85vw] sm:min-w-[60vw] md:min-w-[50vw] lg:min-w-[35vw] aspect-[4/3] flex-shrink-0 snap-center rounded-sm overflow-hidden bg-gray-100">
                     <img src="https://ik.imagekit.io/tus1loev9/homepage/lehengasection.webp?updatedAt=1779907894691" className="w-full h-full object-cover" alt="Lehenga Section" loading="lazy" />
                  </div>
                </div>
              </div>

              {/* SHOP CATALOG */}
              <div id="shop-collection" className="pt-8 scroll-mt-24">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-4">
                  <h3 className="font-display text-xl font-semibold tracking-widest uppercase text-gray-900">
                    {selectedCategory === "All" ? "Featured Catalog" : selectedCategory}
                  </h3>
                  
                  {/* Minimalist Filter */}
                  <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors duration-200 ${selectedCategory === cat ? "text-gray-900 border-b border-gray-900 pb-1" : "text-gray-400 hover:text-gray-700"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                  {getFilteredProducts().map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onViewProduct={handleViewProduct}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentRoute === "product-detail" && activeProduct && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
              <button 
                onClick={() => setCurrentRoute("/")}
                className="text-xs uppercase tracking-wider font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                ← Back to Collection
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-gray-50">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">{activeProduct.category}</span>
                  <h1 className="font-display text-3xl font-semibold tracking-wide text-gray-900 uppercase mt-2 leading-tight">
                    {activeProduct.name}
                  </h1>
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-2xl font-medium text-gray-900 font-sans">₹{activeProduct.price.toLocaleString("en-IN")}</span>
                  {activeProduct.originalPrice && (
                    <span className="text-sm text-gray-400 line-through font-sans">₹{activeProduct.originalPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>

                <div className="pt-8 border-t border-gray-200 text-sm text-gray-600 leading-relaxed font-serif">
                  {activeProduct.description}
                </div>
                
                <div className="pt-8 flex flex-col gap-4">
                  <button onClick={() => addToCart(activeProduct)} className="w-full bg-gray-900 text-white py-4 text-xs tracking-widest uppercase hover:bg-black transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentRoute === "checkout" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <button 
                onClick={() => setCurrentRoute("/")}
                className="text-xs uppercase tracking-wider font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                ← Back to Shop
              </button>
            </div>
            
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-widest uppercase text-center mb-10">Secure Checkout</h1>
            
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-xs tracking-widest uppercase font-semibold border-b border-gray-200 pb-2">Shipping Information</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full border-b border-gray-300 py-2 outline-none focus:border-gray-900 transition-colors text-sm" />
                    <input type="email" placeholder="Email Address" className="w-full border-b border-gray-300 py-2 outline-none focus:border-gray-900 transition-colors text-sm" />
                    <input type="tel" placeholder="Phone Number" className="w-full border-b border-gray-300 py-2 outline-none focus:border-gray-900 transition-colors text-sm" />
                    <textarea placeholder="Delivery Address" className="w-full border-b border-gray-300 py-2 outline-none focus:border-gray-900 transition-colors text-sm resize-none h-20" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="City" className="w-full border-b border-gray-300 py-2 outline-none focus:border-gray-900 transition-colors text-sm" />
                      <input type="text" placeholder="PIN Code" className="w-full border-b border-gray-300 py-2 outline-none focus:border-gray-900 transition-colors text-sm" />
                    </div>
                  </div>

                  <h3 className="text-xs tracking-widest uppercase font-semibold border-b border-gray-200 pb-2 pt-4">Payment Method</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="payment" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="accent-gray-900" />
                      <span className="text-sm">Online Payment (Razorpay)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-gray-900" />
                      <span className="text-sm">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 space-y-6 self-start sticky top-24">
                  <h3 className="text-xs tracking-widest uppercase font-semibold border-b border-gray-200 pb-2">Order Summary</h3>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover" />
                        <div className="flex-1 text-sm">
                          <p className="font-semibold line-clamp-1">{item.name}</p>
                          <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                          <p className="font-medium mt-1">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
                      <span>Total</span>
                      <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-gray-900 text-white py-4 text-xs tracking-widest uppercase hover:bg-black transition-colors duration-200 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPlacingOrder ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentRoute === "checkout-success" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-[50vh] flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-widest uppercase text-gray-900 mb-4">Order Placed Satisfactorily</h1>
            <p className="text-gray-600 font-serif leading-loose max-w-lg mx-auto mb-10">
              Thank you for shopping with Mukesh Saree Centre. Your elegance has been secured. We will notify you once your exquisite pieces are dispatched from our boutique.
            </p>
            <button 
              onClick={() => setCurrentRoute("/")}
              className="px-8 py-3 bg-gray-900 text-white font-bold text-xs tracking-widest uppercase hover:bg-black transition-colors duration-300"
            >
              Return to Catalog
            </button>
          </div>
        )}

        {/* CART DRAWER */}
        {isCartOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl animate-slideUp">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="font-display text-lg font-semibold tracking-widest uppercase text-gray-900">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">&times;</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6">
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover" />
                      <div className="flex-1 flex flex-col">
                        <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                        <p className="font-medium text-sm mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                        <div className="flex items-center gap-4 mt-auto">
                          <div className="flex items-center border border-gray-200 rounded">
                            <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-gray-500 hover:text-gray-900">-</button>
                            <span className="px-2 text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-gray-500 hover:text-gray-900">+</button>
                          </div>
                          <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-xs text-red-500 hover:text-red-700 underline">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-semibold uppercase tracking-widest">Subtotal</span>
                    <span className="text-xl font-bold">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setCurrentRoute("checkout"); window.scrollTo({ top: 0 }); }}
                    className="w-full bg-gray-900 text-white py-4 text-xs tracking-widest uppercase hover:bg-black transition-colors duration-200"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="bg-[#0a0a0a] border-t border-gray-800 pt-16 pb-8 mt-16 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-16">
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <img 
                src="https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png?updatedAt=1780152565503" 
                alt="Mukesh Saree Centre Logo" 
                className="h-16 object-contain invert brightness-0"
              />
              <p className="text-sm text-gray-400 leading-relaxed mt-4 max-w-sm">
                A timeless symbol of elegance. Hand-embroidered, heritage weaving, and effortless luxury since 1978.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-xs tracking-widest uppercase text-gray-300">Visit Us</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Jagnath Road<br/>
                Nagpur, Maharashtra<br/>
                India
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-xs tracking-widest uppercase text-gray-300">Contact</h4>
              <p className="text-sm text-gray-400">
                <a href="mailto:Info.mukeshsarees.com" className="hover:text-white transition-colors">Info.mukeshsarees.com</a><br/>
                <a href="tel:+917020664641" className="hover:text-white transition-colors">+91 7020664641</a>
              </p>
              <div className="flex gap-4 justify-center md:justify-start pt-2 uppercase text-[10px] tracking-widest">
                <a href="https://instagram.com/mukeshsarees_nagpur" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                <a href="https://www.facebook.com/Mukeshsareesindia/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="https://www.youtube.com/@mukeshsarees" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">YouTube</a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 md:flex justify-between items-center text-center">
            <p className="font-sans text-[10px] uppercase tracking-widest text-gray-500">
              © {new Date().getFullYear()} Mukesh Saree Centre. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-4">
              <img src="https://ik.imagekit.io/tus1loev9/homepage/billingcounter.webp?updatedAt=1779907894357" alt="Store Interior" className="h-12 w-20 object-cover opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" title="Our Craft & Heritage" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
