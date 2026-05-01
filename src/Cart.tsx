import { Link, useNavigate } from 'react-router';
import { useStore } from './store';
import { formatPrice } from './utils';
import { Trash2, Plus, Minus, ArrowRight, Shield } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, appliedCoupon } = useStore();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, size: string | undefined, qty: number) => {
    if (qty < 1) return;
    updateQuantity(id, size, qty);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl md:text-3xl font-serif text-primary-950 mb-6 font-normal">Your cart is empty</h2>
        <p className="text-primary-950/70 mb-10 font-light">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/shop" 
          className="border border-primary-950 text-primary-950 hover:bg-primary-950 hover:text-white px-8 py-3 text-[11px] tracking-[2px] uppercase transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = cartTotal();
  const shipping = 0;
  const discount = appliedCoupon === 'FIRST100' ? 100 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-2xl md:text-[32px] font-serif text-primary-950 mb-12 pb-8 border-b border-black/5 font-normal">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row gap-12 pb-12 border-b border-black/5">
              <div className="w-24 sm:w-32 aspect-[9/16] flex-shrink-0 bg-transparent relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow flex flex-col justify-between pt-2">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif text-primary-950">
                      <Link to={`/product/${item.slug}`} className="hover:text-gold-500 transition-colors">{item.name}</Link>
                    </h3>
                    <p className="font-medium text-primary-950 ml-4">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="text-[11px] tracking-[1px] uppercase text-primary-950/50 space-y-1">
                    <p>Fabric: {item.fabric}</p>
                    {item.size && <p>Size: <span className="font-medium text-primary-950">{item.size}</span></p>}
                    <p className="text-gold-500 mt-2">{formatPrice(item.price)} each</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center border border-black/10">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                      className="p-2 hover:bg-primary-50 text-primary-950/70 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-[12px] text-primary-950">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                      className="p-2 hover:bg-primary-50 text-primary-950/70 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-[10px] tracking-[1px] uppercase text-primary-950/50 hover:text-primary-950 hover:underline flex items-center transition-all"
                  >
                    <Trash2 size={14} className="mr-1.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-primary-50 p-8 sticky top-28 border border-black/5">
            <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-8 border-b border-black/5 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-8 text-[13px] text-primary-950/80 border-b border-black/5 pb-8 font-light">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span className="text-primary-950">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gold-600 font-medium">Free</span>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between text-gold-600 font-medium">
                  <span>Discount (FIRST100)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-gold-500 opacity-80">
                  <span>Discount</span>
                  <span>Apply in checkout</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-end mb-8">
              <span className="text-[12px] uppercase tracking-[1px] text-primary-950/70">Total</span>
              <span className="text-2xl text-primary-950">{formatPrice(total)}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary-950 border border-primary-950 hover:bg-transparent hover:text-primary-950 text-white py-4 text-[11px] tracking-[2px] uppercase flex items-center justify-center transition-colors"
            >
              Proceed to Checkout <ArrowRight size={14} className="ml-2" />
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 border-t border-black/5 pt-4">
               <Shield size={16} className="text-gold-600"/>
               <span className="text-xs text-primary-600">Secure Checkout Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
