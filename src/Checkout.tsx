import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useStore } from './store';
import { formatPrice } from './utils';
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { CONFIG, submitToGoogleSheets } from './config';
import { trackInitiateCheckout, trackPurchase } from './tracking';

export default function Checkout() {
  const { cart, cartTotal, clearCart, appliedCoupon, applyCoupon } = useStore();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponInput, setCouponInput] = useState(appliedCoupon || '');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cart.length > 0) {
      trackInitiateCheckout(cartTotal(), cart);
    }
  }, []);

  useEffect(() => {
    if (appliedCoupon) {
      setCouponInput(appliedCoupon);
    }
  }, [appliedCoupon]);

  const subtotal = cartTotal();
  const shipping = 0;
  
  // Calculate discount
  const discount = appliedCoupon === 'FIRST100' ? 100 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === 'FIRST100') {
      applyCoupon('FIRST100');
      setCouponError('');
    } else {
      applyCoupon(null);
      setCouponError('Invalid coupon code');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const fullName = formData.get('firstName')?.toString() || '';
      const nameParts = fullName.trim().split(' ');
      const parsedFirstName = nameParts[0] || '';
      const parsedLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' '; // Space if empty, just in case Google Sheets expects it

      const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(newOrderId);

      // Prepare common data
      const orderDetails = {
        order_id: newOrderId,
        first_name: parsedFirstName,
        last_name: parsedLastName,
        mobile_number: formData.get('mobileNumber')?.toString() || '',
        email: formData.get('email')?.toString() || 'N/A',
        address: formData.get('address')?.toString() || '',
        city: formData.get('city')?.toString() || '',
        pin_code: formData.get('pinCode')?.toString() || '',
        payment_method: paymentMethod === 'online' ? 'Online (Razorpay)' : 'COD',
        total_amount: total,
        items: cart.map(item => `${item.name} (${item.sku || 'N/A'}) (${item.size || 'N/A'}) x${item.quantity}`).join(', '),
        status: 'pending'
      };

      const finalizeOrder = async (razorpayId: string | null = null) => {
        console.log('Starting finalizeOrder process...');
        try {
            const sizeStr = cart.map(item => item.size || 'N/A').join(', ');
            const skuStr = cart.map(item => item.sku || 'N/A').join(', ');

            const googleSheetsData = {
              "First Name": fullName,
              "Last Name": orderDetails.mobile_number, // User wants mobile number here
              "Mobile Number": orderDetails.mobile_number,
              "email": orderDetails.email !== 'N/A' ? orderDetails.email : '',
              "Address": orderDetails.address,
              "City": orderDetails.city,
              "Zip Code": orderDetails.pin_code,
              "Product Name": orderDetails.items,
              "Size": sizeStr,
              "SKU ID": skuStr,
              "Total Amount": orderDetails.total_amount.toString(),
              "Date & Time": new Date().toLocaleString(),

              // Fallbacks for original google sheet that captured mobile number perfectly
              "firstName": fullName,
              "lastName": orderDetails.mobile_number,
              "last_name": orderDetails.mobile_number,
              "mobileNumber": orderDetails.mobile_number,
              "mobile_number": orderDetails.mobile_number,
              "phone": orderDetails.mobile_number,
              "contact": orderDetails.mobile_number,
              "address": orderDetails.address,
              "streetAddress": orderDetails.address,
              "street_address": orderDetails.address,
              "city": orderDetails.city,
              "zipCode": orderDetails.pin_code,
              "productName": orderDetails.items,
              "size": sizeStr,
              "skuId": skuStr,
              "sku": skuStr,
              "totalAmount": orderDetails.total_amount.toString()
            };
          
          console.log('Publishing to Google Sheets...', googleSheetsData);
          await submitToGoogleSheets(googleSheetsData);
          
          console.log('Order processed successfully');
          
          // Track purchase
          trackPurchase(total, cart, newOrderId);

          setIsSuccess(true);
          clearCart();
        } catch (error) {
          console.error('Finalize order error:', error);
          // Still show success since payment was likely taken or COD was clicked
          setIsSuccess(true);
          clearCart();
        } finally {
          setIsSubmitting(false);
          console.log('Checkout process finished');
        }
      };

      if (paymentMethod === 'online') {
        try {
          if (!(window as any).Razorpay) {
            throw new Error('Razorpay SDK not loaded. Please check your internet connection.');
          }
          const options = {
            key: CONFIG.RAZORPAY_KEY,
            amount: Math.round(total * 100),
            currency: 'INR',
            name: CONFIG.STORE_NAME,
            description: `Order #${newOrderId}`,
            image: 'https://images.unsplash.com/photo-1610030469983-98e330328688?q=80&w=200',
            handler: function (response: any) {
               console.log('Razorpay payment successful:', response.razorpay_payment_id);
               finalizeOrder(response.razorpay_payment_id);
            },
            prefill: {
              name: `${orderDetails.first_name} ${orderDetails.last_name}`,
              contact: orderDetails.mobile_number,
              email: orderDetails.email !== 'N/A' ? orderDetails.email : ''
            },
            theme: { color: '#1a1005' },
            modal: {
              handleback: true,
              ondismiss: function() {
                console.log('Razorpay modal closed by user');
                setIsSubmitting(false);
              }
            }
          };
          
          const rzp = new (window as any).Razorpay(options);
          
          // Safety fallback: If Razorpay gets stuck for 15 seconds without opening or failing, we reset state.
          const fallbackTimeout = setTimeout(() => {
            if (isSubmitting) {
              console.warn('Razorpay timeout reset applied');
              setIsSubmitting(false);
              alert('Payment is taking too long to load in this preview window. Please open the app in a new tab or try Cash on Delivery.');
            }
          }, 15000);

          rzp.on('payment.failed', function (response: any) {
             clearTimeout(fallbackTimeout);
             console.error('Razorpay payment failed:', response.error);
             const errorDesc = response.error ? (response.error.description || response.error.reason) : 'Unknown error';
             setIsSubmitting(false);
             alert('Payment failed: ' + errorDesc);
          });
          rzp.open();
        } catch (rzpErr: any) {
          console.error('Razorpay init error:', rzpErr);
          setIsSubmitting(false);
          alert(rzpErr.message || 'Could not start payment. Please refresh.');
        }
      } else {
        console.log('Processing COD order...');
        await finalizeOrder();
      }
    } catch (err) {
      console.error('Submit error:', err);
      setIsSubmitting(false);
      alert('Could not start checkout. Please check your internet connection.');
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
        <h1 className="text-2xl md:text-3xl font-serif text-primary-950 mb-6 font-normal">Order Received</h1>
        <p className="text-lg text-primary-950/80 mb-2 font-light">Thank you for shopping with Mukesh Saree Centre.</p>
        <div className="max-w-md mx-auto bg-primary-50 p-6 my-8 border border-black/5 rounded-sm">
          <p className="text-sm text-primary-950 line-clamp-1 font-medium mb-2">Order ID: #{orderId}</p>
          {paymentMethod === 'online' ? (
            <p className="text-[13px] text-primary-950/70">
              Your payment of <span className="font-medium text-primary-950">{formatPrice(total)}</span> was successful. Your order is being processed and will be shipped shortly.
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
      <h1 className="text-2xl md:text-[32px] font-serif text-primary-950 mb-10 pb-6 border-b border-black/5 font-normal">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Mobile Order Summary (Hidden on Desktop) */}
        <div className="lg:hidden bg-primary-50 p-6 border border-black/5 rounded-sm mb-4">
          <div className="mb-4 bg-primary-100/50 text-gold-600 text-[11px] px-3 py-2 border border-gold-200/50 rounded-sm flex items-center justify-center font-medium tracking-wide uppercase">
            ✨ Free shipping on your order
          </div>
          
          {/* Mobile Item List Summary */}
          <div className="mb-6 space-y-4">
            <p className="text-[10px] uppercase tracking-[1px] font-medium text-primary-950 mb-3">Your Items</p>
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 bg-primary-50 p-3 border border-black/5 rounded-sm">
                <div className="w-16 aspect-[9/16] bg-transparent relative flex-shrink-0 mt-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-white z-20 font-medium">{item.quantity}</span>
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <p className="text-[13px] font-serif text-primary-950 line-clamp-1">{item.name}</p>
                  {item.size && <p className="text-[10px] uppercase tracking-[1px] text-primary-950/50 mt-0.5">Size: {item.size}</p>}
                  <p className="text-[12px] text-primary-950 mt-1">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Coupon Section */}
          <div className="mb-6 bg-primary-50 p-4 border border-gold-500/20 rounded-md">
            <p className="text-[10px] uppercase tracking-[1px] font-medium text-primary-950 mb-3">Apply Coupon</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={couponInput} 
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase());
                  setCouponError('');
                }}
                placeholder="FIRST100" 
                className="flex-1 bg-primary-50 border border-black/10 px-3 py-2 text-xs focus:border-gold-500 outline-none uppercase font-medium"
              />
              <button 
                type="button" 
                onClick={handleApplyCoupon}
                className="bg-primary-950 text-white px-4 py-2 text-[10px] uppercase tracking-[1px] hover:bg-gold-500 transition-colors font-medium"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[10px] text-primary-600 mt-1">{couponError}</p>}
            {appliedCoupon === 'FIRST100' && (
              <p className="text-[10px] text-gold-600 mt-2 font-medium">
                ✔️ ₹100 OFF Applied Successfully
              </p>
            )}
          </div>

          <div className="space-y-2 mb-4 border-b border-black/5 pb-4">
            <div className="flex justify-between text-[13px]">
              <span className="text-primary-950/70">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[13px] text-gold-600">
                <span>Discount (FIRST100)</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
          </div>
          
          <p className="text-[14px] font-medium uppercase tracking-[1px] text-primary-950 flex justify-between items-center">
            <span>Total to Pay</span>
            <span className="text-2xl font-serif">{formatPrice(total)}</span>
          </p>
          <p className="text-[10px] text-primary-950/50 uppercase tracking-[1px] mt-2">Inclusive of all taxes & free delivery</p>
        </div>

        {/* Checkout Form */}
        <div>
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-12">
            {/* Contact Info */}
            <section>
              <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-6 border-b border-black/5 pb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] tracking-[1px] text-primary-950/50 uppercase mb-2">Email Address (Optional)</label>
                  <input name="email" type="email" placeholder="example@email.com" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-6 border-b border-black/5 pb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[1px] text-primary-950/50 uppercase mb-2">Full Name</label>
                  <input required name="firstName" type="text" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[1px] text-primary-950/50 uppercase mb-2">Mobile Number</label>
                  <input required name="mobileNumber" type="tel" placeholder="10-digit mobile number" className="w-full bg-transparent border border-black/10 px-4 py-3 text-sm focus:border-gold-500 outline-none transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-[1px] text-primary-950/50 uppercase mb-2">Street Address</label>
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
                <label className={`flex items-center p-4 border transition-colors cursor-pointer ${paymentMethod === 'cod' ? 'border-primary-950 bg-primary-50' : 'border-black/10'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-gold-500 focus:ring-gold-500 h-4 w-4" />
                  <span className="ml-3 text-[13px] text-primary-950 font-medium">Cash on Delivery (COD)</span>
                </label>
                <label className={`flex items-center p-4 border transition-colors cursor-pointer ${paymentMethod === 'online' ? 'border-primary-950 bg-primary-50' : 'border-black/10'}`}>
                  <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="text-gold-500 focus:ring-gold-500 h-4 w-4" />
                  <div className="ml-3 flex flex-col">
                    <span className="text-[13px] text-primary-950 font-medium">Pay via UPI / Online (Razorpay)</span>
                    <span className="text-[10px] text-primary-950/60 mt-0.5">Please test in a new tab if it gets stuck</span>
                  </div>
                </label>
              </div>
            </section>
            
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white py-4 text-[13px] font-medium tracking-[2px] uppercase transition-colors rounded-sm flex flex-col items-center justify-center gap-1 ${isSubmitting ? 'bg-primary-950/50 cursor-not-allowed' : (paymentMethod === 'online' ? 'bg-[#00B967] hover:bg-[#00B967]/90' : 'bg-primary-950 hover:bg-gold-500')}`}
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
           <div className="mb-4 bg-primary-100/50 text-gold-600 text-[11px] px-3 py-2 border border-gold-200/50 rounded-sm flex items-center justify-center font-medium tracking-wide uppercase">
             ✨ Limited Time Offer: Free shipping on all orders
           </div>
           <h2 className="text-[13px] tracking-[2px] uppercase text-primary-950 mb-8 border-b border-black/5 pb-4">In Your Cart</h2>
           <div className="space-y-6 mb-8 pr-4 max-h-[40vh] overflow-y-auto">
             {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-6">
                  <div className="w-20 aspect-[9/16] bg-transparent relative flex-shrink-0 mt-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover shadow-sm" referrerPolicy="no-referrer" />
                    <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[11px] font-medium w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-white z-20">{item.quantity}</span>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <p className="text-[15px] font-serif text-primary-950 line-clamp-1">{item.name}</p>
                    {item.sku && (
                      <p className="text-[10px] tracking-[1px] uppercase text-primary-950/40 mt-1 font-mono">SKU: {item.sku}</p>
                    )}
                    {item.size && <p className="text-[11px] uppercase tracking-[1px] text-primary-950/50 mt-1">Size: {item.size}</p>}
                    <p className="text-[14px] text-primary-950 mt-2">{formatPrice(item.price)}</p>
                  </div>
                </div>
             ))}
           </div>
           
           <div className="border-t border-black/5 pt-8 space-y-4 text-[13px] text-primary-950/80 border-b pb-8 font-light">
              {/* Coupon Section */}
              <div className="mb-6 bg-primary-50 p-4 border border-gold-500/20 rounded-md">
                <p className="text-[11px] uppercase tracking-[1px] font-medium text-primary-950 mb-3">Discount Code</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponInput} 
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Enter code" 
                    className="flex-1 bg-primary-50 border border-black/10 px-3 py-2 text-sm focus:border-gold-500 outline-none uppercase font-medium"
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    className="bg-primary-950 text-white px-4 py-2 text-[10px] uppercase tracking-[1px] hover:bg-gold-500 transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-primary-600 mt-1">{couponError}</p>}
                {appliedCoupon === 'FIRST100' ? (
                  <p className="text-[11px] text-gold-600 mt-2 font-medium">
                    ✔️ ₹100 OFF Applied Successfully
                  </p>
                ) : (
                  <p className="text-[11px] text-primary-950/60 mt-2 italic">Apply FIRST100 to save ₹100</p>
                )}
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-primary-950">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gold-600 font-medium">Free (Offer Applied)</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gold-600 font-medium">
                  <span>Discount (FIRST100)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
           </div>
           
           <div className="flex justify-between items-end mt-8">
              <span className="text-[14px] font-medium uppercase tracking-[1px] text-primary-950">Final Price</span>
              <span className="text-2xl font-serif font-medium text-primary-950">{formatPrice(total)}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
