import { useState } from 'react';
import { SEO } from './components/SEO';
import { ShieldCheck, RefreshCcw, HandCoins, AlertCircle, FileText, PackageX, HelpCircle, ChevronDown, ChevronUp, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { Breadcrumbs } from './components/Breadcrumbs';

export default function ReturnPolicy() {
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [touched, setTouched] = useState({
    orderId: false,
    fullName: false,
    phone: false,
    reason: false
  });

  const [errors, setErrors] = useState({
    orderId: "",
    fullName: "",
    phone: "",
    reason: ""
  });

  const validateForm = (oId = orderId, name = fullName, mob = phone, reas = reason) => {
    const newErrors = {
      orderId: !oId.trim() ? "Order ID is required" : "",
      fullName: !name.trim() ? "Full Name is required" : name.trim().length < 2 ? "Name must be at least 2 characters long" : "",
      phone: !mob.trim() ? "Mobile number is required" : !/^[0-9]{10}$/.test(mob.trim()) ? "Mobile number must be exactly 10 digits" : "",
      reason: !reas ? "Please select a reason for return" : ""
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(err => err !== "");
  };

  const handleFieldBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      orderId: true,
      fullName: true,
      phone: true,
      reason: true
    });
    
    const isValid = validateForm();
    if (!isValid) {
      setError("Please correct the highlighted errors before submitting.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/return-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          fullName,
          phone,
          reason,
          comments
        })
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        // Clear fields and touched status on success
        setOrderId("");
        setFullName("");
        setPhone("");
        setReason("");
        setComments("");
        setTouched({
          orderId: false,
          fullName: false,
          phone: false,
          reason: false
        });
        setErrors({
          orderId: "",
          fullName: "",
          phone: "",
          reason: ""
        });
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to submit request. Please check your internet connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <SEO 
          title="Returns & Refunds Policy | Mukesh Saree Centre" 
          description="Mukesh Saree Centre's Return & Refund Policy. Understand our 7-day return period, refund timelines, and process for damaged or defective items." 
          url="/return-policy"
        />
        
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-950 mb-3">Returns & Refunds Policy</h1>
          <div className="w-16 h-[2px] bg-gold-200 mx-auto"></div>
          <p className="mt-4 text-primary-950/70 text-sm max-w-2xl mx-auto">
            We are committed to providing you with premium ethnic wear. If you are not entirely satisfied with your purchase, we're here to help.
          </p>
        </div>

        <div className="bg-white rounded-sm border border-black/5 p-6 md:p-8 shadow-sm space-y-10 text-[14px] leading-relaxed text-primary-950/80">
          
          {/* Eligibility & Timeline */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <RefreshCcw size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">1. Return Eligibility & Timeline</h2>
            </div>
            <p>
              We accept return and exchange requests within <strong>7 days</strong> from the date of delivery. Eligible items can be returned for a refund, store credit, or exchanged for a different size or style, subject to stock availability.
            </p>
          </section>

          {/* Product Condition */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <ShieldCheck size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">2. Product Condition Requirements</h2>
            </div>
            <p>To be eligible for a return or exchange, the item must meet the following criteria:</p>
            <ul className="space-y-2 ml-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>The product must be <strong>unused, unwashed, and completely unworn</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>All <strong>original tags, labels, and packaging</strong> must be fully intact and attached to the garment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>The item must be free from any makeup stains, perfume, or odors.</span>
              </li>
            </ul>
          </section>

          {/* Non-Returnable Items */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <PackageX size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">3. Non-Returnable Items</h2>
            </div>
            <p>Due to hygiene and customization reasons, the following items are strictly non-returnable:</p>
            <ul className="space-y-2 ml-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>Sarees that have undergone <strong>Fall and Pico customization</strong> or blouse stitching.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>Items purchased during clearance sales or promotional deep discounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>Gift Cards.</span>
              </li>
            </ul>
            <p className="text-[13px] text-primary-950/60 mt-2 bg-primary-50 p-3 rounded-sm border border-primary-100">
              <em>Note: Slight color variations due to photography lighting or screen resolutions do not qualify as a defect and are not deemed valid reasons for return.</em>
            </p>
          </section>

          {/* Return Process */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <FileText size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">4. The Return Process</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <div className="font-bold text-gold-600 text-lg">Step 1</div>
                <div className="font-semibold text-primary-950">Raise a Request</div>
                <p className="text-[13px]">Contact our support team within 7 days. Provide your Order ID and clear photographs of the product.</p>
              </div>
              <div className="space-y-2">
                <div className="font-bold text-gold-600 text-lg">Step 2</div>
                <div className="font-semibold text-primary-950">Approval & Pickup</div>
                <p className="text-[13px]">Once approved (typically 24-48 hours), we will arrange a return pickup from your delivery address.</p>
              </div>
              <div className="space-y-2">
                <div className="font-bold text-gold-600 text-lg">Step 3</div>
                <div className="font-semibold text-primary-950">Inspection & Refund</div>
                <p className="text-[13px]">After the product reaches our warehouse, it passes quality checks, followed by the initiation of your refund or exchange.</p>
              </div>
            </div>
          </section>

          {/* Damaged or Defective Items */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <AlertCircle size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">5. Damaged, Defective, or Incorrect Items</h2>
            </div>
            <p>
              We conduct rigorous quality checks, but in the rare event that you receive a damaged, defective, or incorrect item:
            </p>
            <ul className="space-y-2 ml-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>You must notify us within <strong>48 hours</strong> of receiving the delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>Please share unboxing videos or images clearly highlighting the defect.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-0.5">•</span>
                <span>We will arrange a free replacement. If a replacement is unavailable, a full refund will be processed.</span>
              </li>
            </ul>
          </section>

          {/* Refunds & Payment Methods */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary-950 border-b border-black/5 pb-2">
               <HandCoins size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">6. Refund Processing Timeline & Methods</h2>
            </div>
            <p>Once your returned item is received and inspected (typically 2-3 business days after arrival at our facility), refund timelines are as follows:</p>
            <ul className="space-y-3 ml-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-primary-950 text-[13px] block mb-0.5">Prepaid Orders (Cards/UPI/Netbanking):</span>
                  <span>Refunds will be credited to the original payment source within <strong>3-5 business days</strong> after approval.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-primary-950 text-[13px] block mb-0.5">Cash on Delivery (COD) Orders:</span>
                  <span>COD refunds are strictly processed via bank transfer or UPI. Our team will request your bank details via email. Once provided, expect the credit within <strong>3-5 business days</strong>.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-primary-950 text-[13px] block mb-0.5">Store Credit:</span>
                  <span>If you opt for store credit, a voucher will be issued immediately upon approval, valid for 6 months.</span>
                </div>
              </li>
            </ul>
          </section>

          {/* Frequently Asked Questions */}
          <section className="space-y-5 bg-primary-50 p-6 md:p-8 rounded-sm">
            <div className="flex items-center gap-3 text-primary-950 mb-2">
               <HelpCircle size={22} className="text-gold-500" />
               <h2 className="text-xl font-serif">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary-950 text-[14px]">Do I have to pay for return shipping?</h3>
                <p className="mt-1 text-[13px]">In standard return scenarios, a nominal return shipping fee may be deducted from your refund amount. For defective or incorrect items, the return is entirely free of charge.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-950 text-[14px]">Can I cancel my order?</h3>
                <p className="mt-1 text-[13px]">Orders can only be canceled if they have not yet been dispatched from our warehouse. Please contact support immediately if you wish to cancel an order.</p>
              </div>

              <div>
                <h3 className="font-semibold text-primary-950 text-[14px]">What happens if the courier cannot pick up the return?</h3>
                <p className="mt-1 text-[13px]">In rare cases where return pickup service is unavailable at your pincode, you may need to self-ship the item using a reliable courier service. We will reimburse standard shipping costs upon receipt of the receipt.</p>
              </div>
            </div>
          </section>

          {/* Return Request Accordion & Form */}
          <section className="border border-neutral-200 rounded-sm overflow-hidden bg-neutral-50/50 transition-all duration-300">
            <button
              type="button"
              onClick={() => setIsFormExpanded(!isFormExpanded)}
              className="w-full bg-primary-950 text-white hover:bg-primary-950/95 px-6 py-5 flex items-center justify-between text-left font-serif transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-gold-400" size={22} />
                <span className="text-lg md:text-xl tracking-wider font-medium uppercase font-serif">REQUEST A RETURN</span>
              </div>
              <div>
                {isFormExpanded ? <ChevronUp size={20} className="text-gold-200" /> : <ChevronDown size={20} className="text-gold-200" />}
              </div>
            </button>

            {isFormExpanded && (
              <div className="p-6 md:p-8 bg-white border-t border-neutral-100 transition-all duration-500">
                <h3 className="text-lg font-serif text-primary-950 mb-1 border-b border-neutral-100 pb-2 flex items-center gap-2">
                  <span>Return Request Form</span>
                </h3>
                <p className="text-primary-950/60 text-xs mb-6">
                  Please provide your details below to initiate your return or exchange request. All fields marked <span className="text-rose-500">*</span> are required.
                </p>

                {submitted ? (
                  <div className="text-center py-8 px-4 border border-emerald-100 bg-emerald-50/30 rounded-sm mb-4">
                    <CheckCircle2 className="mx-auto text-emerald-600 mb-3" size={44} />
                    <h4 className="text-lg font-serif text-primary-950 font-medium mb-2">Submission Successful</h4>
                    <p className="text-emerald-800 text-sm max-w-md mx-auto leading-relaxed font-semibold">
                      "Your return request has been submitted successfully. Our team will contact you shortly."
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-xs text-primary-950 hover:text-gold-600 underline font-semibold uppercase tracking-wider"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-sm">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-primary-950/70 mb-1.5">
                          Order ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={orderId}
                          onBlur={() => handleFieldBlur('orderId')}
                          onChange={(e) => {
                            setOrderId(e.target.value);
                            if (touched.orderId) {
                              validateForm(e.target.value, fullName, phone, reason);
                            }
                          }}
                          placeholder="e.g. MSC-12345"
                          className={`w-full bg-neutral-50 px-4 py-3 border focus:outline-none focus:bg-white text-xs tracking-wider transition-colors placeholder:text-neutral-400 ${
                            touched.orderId && errors.orderId ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-neutral-200 focus:border-[#C8A96B]'
                          }`}
                        />
                        {touched.orderId && errors.orderId && (
                          <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{errors.orderId}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-primary-950/70 mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onBlur={() => handleFieldBlur('fullName')}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (touched.fullName) {
                              validateForm(orderId, e.target.value, phone, reason);
                            }
                          }}
                          placeholder="Enter your full name"
                          className={`w-full bg-neutral-50 px-4 py-3 border focus:outline-none focus:bg-white text-xs tracking-wider transition-colors placeholder:text-neutral-400 ${
                            touched.fullName && errors.fullName ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-neutral-200 focus:border-[#C8A96B]'
                          }`}
                        />
                        {touched.fullName && errors.fullName && (
                          <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{errors.fullName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-primary-950/70 mb-1.5">
                          Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-col">
                          <div className="flex">
                            <span className={`inline-flex items-center px-3 bg-neutral-100 border border-r-0 text-neutral-500 text-xs select-none font-sans ${
                              touched.phone && errors.phone ? 'border-rose-500' : 'border-neutral-200'
                            }`}>
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              pattern="[0-9]{10}"
                              title="Please enter a valid 10-digit mobile number"
                              value={phone}
                              onBlur={() => handleFieldBlur('phone')}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setPhone(val);
                                if (touched.phone) {
                                  validateForm(orderId, fullName, val, reason);
                                }
                              }}
                              placeholder="10-digit mobile number"
                              className={`w-full bg-neutral-50 px-4 py-3 border focus:outline-none focus:bg-white text-xs tracking-wider transition-colors placeholder:text-neutral-400 ${
                                touched.phone && errors.phone ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-neutral-200 focus:border-[#C8A96B]'
                              }`}
                            />
                          </div>
                          {touched.phone && errors.phone && (
                            <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                              <AlertCircle size={14} className="shrink-0" />
                              <span>{errors.phone}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-primary-950/70 mb-1.5">
                          Reason for Return <span className="text-rose-500">*</span>
                        </label>
                        <select
                          required
                          value={reason}
                          onBlur={() => handleFieldBlur('reason')}
                          onChange={(e) => {
                            setReason(e.target.value);
                            if (touched.reason) {
                              validateForm(orderId, fullName, phone, e.target.value);
                            }
                          }}
                          className={`w-full bg-neutral-50 px-4 py-3 border focus:outline-none focus:bg-white text-xs tracking-wider transition-colors ${
                            touched.reason && errors.reason ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-neutral-200 focus:border-[#C8A96B]'
                          }`}
                        >
                          <option value="">-- Select Reason --</option>
                          <option value="Damaged or Defective Product">Damaged or Defective Product</option>
                          <option value="Incorrect Item Received">Incorrect Item Received</option>
                          <option value="Quality not as expected">Quality not as expected</option>
                          <option value="Color or Pattern Mismatch">Color or Pattern Mismatch</option>
                          <option value="Size or Fit Issue">Size or Fit Issue</option>
                          <option value="Other">Other / Unshared Reason</option>
                        </select>
                        {touched.reason && errors.reason && (
                          <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{errors.reason}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-primary-950/70 mb-1.5">
                        Additional Comments <span className="text-neutral-400">(Optional)</span>
                      </label>
                      <textarea
                        rows={4}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Please write details about your package condition, unboxing details, or other queries..."
                        className="w-full bg-neutral-50 px-4 py-3 border border-neutral-200 focus:outline-none focus:border-[#C8A96B] focus:bg-white text-xs tracking-wider transition-colors placeholder:text-neutral-400 resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-neutral-950 hover:bg-[#C8A96B] text-white hover:text-neutral-950 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="animate-spin text-white" size={16} />
                            <span>Submitting Request...</span>
                          </>
                        ) : (
                          "SUBMIT RETURN REQUEST"
                        )}
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-wider">
                  <div className="font-semibold text-primary-950 uppercase tracking-widest">
                    Need Help?
                  </div>
                  <div>
                    <span className="text-primary-950/60 mr-2">Call/WhatsApp:</span>
                    <a
                      href="https://wa.me/917020664641"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-primary-950 hover:text-gold-600 transition-colors"
                    >
                      +91 7020664641
                    </a>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Support CTA */}
          <div className="pt-6">
            <div className="bg-primary-950 text-white p-6 md:p-8 text-center rounded-sm">
              <h3 className="text-xl font-serif mb-3">Initiate a Request</h3>
              <p className="text-white/80 mb-6 text-sm max-w-lg mx-auto leading-relaxed">
                Need to process a return or have questions regarding our policy? Our dedicated support team is ready to assist you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact" className="inline-block bg-white text-primary-950 px-8 py-3 text-[12px] uppercase tracking-widest font-bold hover:bg-gold-50 transition-colors w-full sm:w-auto text-center">
                  CONTACT SUPPORT
                </Link>
                <a href="mailto:info@mukeshsarees.com" className="inline-block border border-gold-500 text-gold-400 px-8 py-3 text-[12px] uppercase tracking-widest font-bold hover:bg-gold-500 hover:text-white transition-colors w-full sm:w-auto text-center">
                  EMAIL US
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

