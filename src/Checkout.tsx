import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useStore } from './store';
import { formatPrice } from './utils';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [couponCode, setCouponCode] = useState('FIRST100');
  const [isCouponApplied, setIsCouponApplied] = useState(true);

  const subtotal = cartTotal();
  const shipping = 0;
  
  // Calculate discount
  const discount = (paymentMethod === 'online' && isCouponApplied) ? 100 : 0;
  const total = subtotal + shipping - discount;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);

    // Prepare common data
    const orderDetails = {
      order_id: newOrderId,
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email_or_phone: formData.get('emailOrPhone'),
      address: formData.get('address'),
      city: formData.get('city'),
      pin_code: formData.get('pinCode'),
      payment_method: paymentMethod === 'online' ? 'Online (Razorpay)' : 'COD',
      total_amount: total,
      items: cart.map(item => `${item.name} (${item.size || 'N/A'}) x${item.quantity}`).join(', '),
      status: 'pending'
    };

    const finalizeOrder = async (razorpayId: string | null = null) => {
      try {
        // 1. Submit to Supabase
        const { error: supabaseError } = await supabase
          .from('orders')
          .insert([{ ...orderDetails, razorpay_id: razorpayId }]);

        if (supabaseError) {
          console.error('Supabase Error:', supabaseError);
        }

        // 2. Submit to Formspree
        const formspreeData = {
          ...orderDetails,
          razorpay_id: razorpayId || 'N/A',
          total_amount_formatted: formatPrice(total),
          order_summary: cart.map(item => `- ${item.name} (${item.size || 'Standard'}) x${item.quantity} [${formatPrice(item.price * item.quantity)}]`).join('\n'),
          submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };

        await fetch('https://formspree.io/f/xaqarzgk', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formspreeData)
        });
        
        console.log('Order finalized on all platforms');
        setIsSuccess(true);
        clearCart();
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (paymentMethod === 'online') {
      const options = {
        key: 'rzp_test_SjKF47ziF70i7R',
        amount: Math.round(total * 100), // amount in paisa
        currency: 'INR',
        name: 'Mukesh Saree Centre',
        description: `Order #${newOrderId}`,
        image: 'https://images.unsplash.com/photo-1610030469983-98e330328688?q=80&w=200', // Saree related placeholder
        handler: function (response: any) {
          finalizeOrder(response.razorpay_payment_id);
        },
        prefill: {
          name: `${formData.get('firstName')} ${formData.get('lastName')}`,
          contact: formData.get('emailOrPhone')
        },
        theme: {
          color: '#1a1005'
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      // Simulate small delay for COD
      setTimeout(() => {
        finalizeOrder();
      }, 1000);
    }
  };

  if (cart.length === 0 && !isSuccess) {
    navigate('/cart');
    return null;
  }

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <CheckCircle2 size={48} className="text-gold-500 mb-8" strokeWidth={1.5} />
        <h1 className="text-3xl md:text-5xl font-serif text-primary-950 mb-6 font-normal">Order Received</h1>
        <p className="text-lg text-primary-950/80 mb-2 font-light">Thank you for shopping with Mukesh Saree Centre.</p>
        <div className="max-w-md mx-auto bg-primary-50 p-6 my-8 border border-black/5 rounded-sm">
          <p className="text-sm text-primary-950 line-clamp-1 font-medium mb-2">Order ID: #{orderId}</p>
          {paymentMethod === 'online' ? (
            <p className="text-[13px] text-primary-950/70">
              Your payment of <span className="font-bold text-primary-950">{formatPrice(total)}</span> was successful. Your order is being processed and will be shipped shortly.
            </p>
          ) : (
            <p className="text-[13px] text-primary-950/70">
              Your order has been placed successfully via Cash on Delivery. We will contact you soon for confirmation.
            </p>
          )}
        </div>
        <Link 
          to="/shop" 
          className="border border-primary-950 text-primary-950 hover:bg-primary-950 hover:text-white px-8 py-3 text-[11px] tracking-[2px] uppercase transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl md:text-[40px] font-serif text-primary-950 mb-10 pb-6 border-b border-black/5 font-normal">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <div>
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-12">
            {/* Contact Info */}
            <section>
              <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-6 border-b border-black/5 pb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-[1px] text-primary-950/50 uppercase mb-2">Email / Phone (for WhatsApp updates)</label>
                  <input required name="emailOrPhone" type="text" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-6 border-b border-black/5 pb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[1px] text-primary-950/50 uppercase mb-2">First Name</label>
                  <input required name="firstName" type="text" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[1px] text-primary-950/50 uppercase mb-2">Last Name</label>
                  <input required name="lastName" type="text" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-[1px] text-primary-950/50 uppercase mb-2">Address</label>
                  <input required name="address" type="text" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[1px] text-primary-950/50 uppercase mb-2">City</label>
                  <input required name="city" type="text" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[1px] text-primary-950/50 uppercase mb-2">PIN Code</label>
                  <input required name="pinCode" type="text" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-6 border-b border-black/5 pb-4">Payment Method</h2>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border transition-colors cursor-pointer ${paymentMethod === 'online' ? 'border-primary-950 bg-primary-50' : 'border-black/10'}`}>
                  <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="text-gold-500 focus:ring-gold-500 h-4 w-4" />
                  <div className="ml-3 flex flex-col">
                    <span className="text-[13px] text-primary-950 font-medium">Pay via UPI Apps</span>
                    <span className="text-[10px] text-primary-950/60 mt-0.5">Google Pay, PhonePe, Paytm, BHIM, etc.</span>
                  </div>
                </label>
                <label className={`flex items-center p-4 border transition-colors cursor-pointer ${paymentMethod === 'cod' ? 'border-primary-950 bg-primary-50' : 'border-black/10'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-gold-500 focus:ring-gold-500 h-4 w-4" />
                  <span className="ml-3 text-[13px] text-primary-950 font-light">Cash on Delivery (COD)</span>
                </label>
              </div>
            </section>
            
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white py-4 text-[13px] font-bold tracking-[2px] uppercase transition-colors rounded-sm flex flex-col items-center justify-center gap-1 ${isSubmitting ? 'bg-primary-950/50 cursor-not-allowed' : (paymentMethod === 'online' ? 'bg-[#00B967] hover:bg-[#00B967]/90' : 'bg-primary-950 hover:bg-gold-500')}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{paymentMethod === 'online' ? 'Pay Securely via Razorpay' : 'Place Order via COD'}</span>
                )}
              </button>
              {paymentMethod === 'online' && (
                <p className="text-center text-[10px] text-primary-950/50 uppercase tracking-[1px] font-medium mt-3">
                  Secure checkout powered by Razorpay
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Order Summary Checkout view */}
        <div className="lg:pl-16 border-l border-black/5 hidden lg:block">
           <div className="mb-4 bg-green-50/50 text-green-700 text-[11px] px-3 py-2 border border-green-200/50 rounded-sm flex items-center justify-center font-medium tracking-wide uppercase">
             ✨ Limited Time Offer: Free shipping on all orders
           </div>
           <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-8 border-b border-black/5 pb-4">In Your Cart</h2>
           <div className="space-y-6 mb-8 pr-4 max-h-[40vh] overflow-y-auto">
             {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-6">
                  <div className="w-20 aspect-[9/16] bg-transparent relative flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    <span className="absolute -top-2 -right-2 bg-primary-950 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md z-10">{item.quantity}</span>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <p className="text-[15px] font-serif text-primary-950 line-clamp-1">{item.name}</p>
                    {item.size && <p className="text-[11px] uppercase tracking-[1px] text-primary-950/50 mt-1">Size: {item.size}</p>}
                    <p className="text-[14px] text-primary-950 mt-2">{formatPrice(item.price)}</p>
                  </div>
                </div>
             ))}
           </div>
           
           <div className="border-t border-black/5 pt-8 space-y-4 text-[13px] text-primary-950/80 border-b pb-8 font-light">
              
              {/* Coupon Section */}
              <div className="mb-6 bg-primary-50 p-4 border border-gold-500/20 rounded-md">
                <p className="text-[11px] uppercase tracking-[1px] font-bold text-primary-950 mb-3">Discount Code</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code" 
                    className="flex-1 bg-white border border-black/10 px-3 py-2 text-sm focus:border-gold-500 outline-none uppercase font-bold"
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      if (couponCode === 'FIRST100') {
                        setIsCouponApplied(true);
                      } else {
                        setIsCouponApplied(false);
                      }
                    }}
                    className="bg-primary-950 text-white px-4 py-2 text-[10px] uppercase tracking-[1px] hover:bg-gold-500 transition-colors font-bold"
                  >
                    Apply
                  </button>
                </div>
                {paymentMethod === 'online' && isCouponApplied && couponCode === 'FIRST100' ? (
                  <p className="text-[11px] text-green-600 mt-2 font-medium">✔️ EXTRA ₹100 OFF applied! (Prepaid Order)</p>
                ) : (
                  <p className="text-[11px] text-primary-950/60 mt-2 italic">Apply FIRST100 to save extra ₹100 (Prepaid Only)</p>
                )}
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-primary-950">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free (Offer Applied)</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount (FIRST100)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
           </div>
           
           <div className="flex justify-between items-end mt-8">
              <span className="text-[14px] font-bold uppercase tracking-[1px] text-primary-950">Final Price</span>
              <span className="text-3xl font-serif font-bold text-primary-950">{formatPrice(total)}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
