import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  RefreshCw,
  Shield,
  Star,
  ThumbsDown,
  ThumbsUp,
  Truck,
  RotateCcw,
  ShieldCheck,
  X,
  Maximize2,
  MessageCircle,
  Phone,
  CheckCircle,
  Share2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useMemo, Fragment } from "react";
import { Helmet } from "react-helmet-async";
import { ProductDescription } from "./components/ProductDescription";
import { ProductSeoContent } from "./components/ProductSeoContent";
import { ProductAccordion } from "./components/ProductAccordion";
import { Link, useNavigate, useParams } from "react-router";
import { products } from "./mockData";
import { useStore } from "./store";
import { trackViewContent, trackAddToCart } from "./tracking";
import {
  formatPrice,
  optimizeImage,
  getProductReviewStats,
  getImageAlt,
} from "./utils";
import { CONFIG, submitToGoogleSheets, getApiUrl, getWhatsAppNumber } from "./config";
import { sendOrderToSheets } from "./utils/googleSheets";
import { OptimizedImage } from "./components/OptimizedImage";
import { ProductCard } from "./components/ProductCard";
import { SEO, cleanSEOText, cleanDescriptionForOG } from "./components/SEO";
import {
  LiveViewerCounter,
  LowStockMessage,
  CartActivityMessage,
} from "./components/UrgencyWidget";
import { ProductReviews } from "./components/ProductReviews";
import { TrustBadges } from "./components/TrustBadges";
import { WhyShopWithUs } from "./components/WhyShopWithUs";

const getImageSrc = (rawImageUrl: any): string => {
  if (!rawImageUrl) return '';
  let url = String(rawImageUrl);
  if (url.endsWith('.webm') || url.includes('.webm') || url.endsWith('.mp4') || url.includes('.mp4')) {
    return url;
  }
  return optimizeImage(url, 800, 'webp');
};

const isVideoUrl = (url: any): boolean => {
  if (!url) return false;
  const str = String(url);
  return str.endsWith('.webm') || str.includes('.webm') || str.endsWith('.mp4') || str.includes('.mp4');
};

const getWhatsAppSafeImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return 'https://mukeshsarees.com/images/og-home.jpg';
  
  // If already a clean URL (Cloudinary, direct hosting), use as-is
  if (imageUrl.includes('cloudinary.com') || imageUrl.includes('mukeshsarees.com/images')) {
    return imageUrl;
  }
  
  // For Google Drive URLs — extract the file ID and use the direct export URL
  // Direct export URLs work better for WhatsApp crawlers than thumbnail URLs
  const driveIdMatch = imageUrl.match(/[?&]id=([^&]+)/);
  if (driveIdMatch) {
    const fileId = driveIdMatch[1];
    // Use the direct download/view URL format which WhatsApp handles better:
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // For lh3.googleusercontent.com URLs (already processed Drive images)
  if (imageUrl.includes('lh3.googleusercontent.com')) {
    // These can be resized by appending =w1200-h630 at the end
    const cleanUrl = imageUrl.split('=')[0]; // remove any existing size params
    return `${cleanUrl}=w1200-h630`;
  }
  
  // Fallback to wsrv with better params for WhatsApp
  if (imageUrl.includes('wsrv.nl') || imageUrl.includes('drive.google.com')) {
    return imageUrl.replace('output=webp', 'output=jpg').replace('w=600', 'w=1200').replace('w=800', 'w=1200');
  }
  
  return imageUrl;
};

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);
  
  // Dynamic breadcrumb generation matching exactly the requested collection hierarchy
  const breadcrumbItems = useMemo(() => {
    if (!product) return [];
    const items = [
      { label: "Home", to: "/" }
    ];

    const category = product.category || "";
    const fabric = product.fabric || "";

    if (category === "Linen Sarees") {
      items.push({ label: "Sarees", to: "/shop?category=Sarees" });
      items.push({ label: "Linen Sarees", to: "/shop?category=Linen Sarees" });
    } else if (category === "Sarees") {
      items.push({ label: "Sarees", to: "/shop?category=Sarees" });
      
      // Map subcategories dynamically to match "Chiffon Sarees", "Georgette Sarees", etc.
      const fabLower = fabric.toLowerCase();
      if (fabLower.includes("chiffon")) {
        items.push({ label: "Chiffon Sarees", to: "/shop?category=Sarees&fabric=Chiffon" });
      } else if (fabLower.includes("georgette")) {
        items.push({ label: "Georgette Sarees", to: "/shop?category=Sarees&fabric=Georgette" });
      } else if (fabLower.includes("cotton") || fabLower.includes("khadi")) {
        items.push({ label: "Cotton Sarees", to: "/shop?category=Sarees&fabric=Cotton" });
      } else if (fabLower.includes("tissue")) {
        items.push({ label: "Tissue Sarees", to: "/shop?category=Sarees&fabric=Tissue" });
      } else if (fabLower.includes("silk")) {
        items.push({ label: "Silk Sarees", to: "/shop?category=Sarees&fabric=Silk" });
      } else if (fabLower.includes("linen")) {
        items.push({ label: "Linen Sarees", to: "/shop?category=Linen Sarees" });
      } else if (fabric) {
        items.push({ label: `${fabric} Sarees`, to: `/shop?category=Sarees&fabric=${encodeURIComponent(fabric)}` });
      }
    } else if (category === "Co-Ord Sets") {
      items.push({ label: "Co-Ord Sets", to: "/shop?category=Co-Ord Sets" });
      if (fabric.toLowerCase().includes("cotton")) {
        items.push({ label: "Cotton Co-Ord Sets", to: "/shop?category=Co-Ord Sets&fabric=Cotton" });
      }
    } else if (category) {
      items.push({ label: category, to: `/shop?category=${encodeURIComponent(category)}` });
    }

    return items;
  }, [product]);

  const { addToCart, toggleWishlist, wishlist } = useStore();

  const storeCoupon = useStore((state) => state.appliedCoupon);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(storeCoupon);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState(false);

  useEffect(() => {
    const mappedCoupon = storeCoupon ? storeCoupon.trim().toUpperCase() : '';
    if (mappedCoupon && (mappedCoupon === 'VIP50' || mappedCoupon === 'VIPCLUB60' || mappedCoupon === 'VIBCLUB60')) {
      setAppliedCoupon(mappedCoupon);
      setCouponMsg(mappedCoupon === 'VIP50' ? 'VIP50 Applied Successfully' : 'VIPCLUB60 Applied Successfully');
      setCouponInput(mappedCoupon);
    } else if (!storeCoupon) {
      setAppliedCoupon(null);
      setCouponMsg('');
      setCouponInput('');
    }
  }, [storeCoupon]);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === 'VIP50' || code === 'VIPCLUB60' || code === 'VIBCLUB60') {
      try {
        sessionStorage.removeItem('coupon_removed');
      } catch (e) {}
      setAppliedCoupon(code);
      setCouponError(false);
      setCouponMsg(code === 'VIP50' ? 'VIP50 Applied Successfully' : 'VIPCLUB60 Applied Successfully');
      useStore.getState().applyCoupon(code); // Update global store
    } else {
      setCouponError(true);
      setAppliedCoupon(null);
      setCouponMsg('');
      useStore.getState().applyCoupon(null);
    }
  };

  const mrpPrice = product ? (product.originalPrice || product.price * 2) : 0;
  const currentCoupon = appliedCoupon ? appliedCoupon.trim().toUpperCase() : null;
  const discountRate = currentCoupon === 'VIP50' ? 0.50 : (currentCoupon === 'VIPCLUB60' || currentCoupon === 'VIBCLUB60') ? 0.60 : 0.0;
  const finalPrice = mrpPrice - Math.round(mrpPrice * discountRate);
  const savedAmount = mrpPrice - finalPrice;

  const stats = useMemo(
    () =>
      product
        ? getProductReviewStats(product)
        : { rating: 4.8, reviewCount: 150 },
    [product?.id],
  );

  const isSaree = product ? product.category.toLowerCase().includes("saree") : false;
  const isCoOrdSet = product ? (product.category === "Co-Ord Sets" || product.category.toLowerCase().includes("co-ord")) : false;
  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].filter(s => !(isCoOrdSet && s === 'Free Size'));
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState<{ name: string; phone: string; address: string; size: string | null }>({
    name: '',
    phone: '',
    address: '',
    size: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setForm(prev => ({ ...prev, size: selectedSize }));
  }, [selectedSize]);

  const [isAdded, setIsAdded] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState<{
    visible: boolean;
    quantity: number;
    size?: string;
    customName?: string;
    customImg?: string;
  }>({ visible: false, quantity: 1 });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideUnit, setSizeGuideUnit] = useState<"in" | "cm">("in");
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  const touchRef = useRef<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    gestureLock: "horizontal" | "vertical" | null;
  }>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    gestureLock: null,
  });
  const mainAtcRef = useRef<HTMLButtonElement>(null);
  const [showStickyAtc, setShowStickyAtc] = useState(false);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      gestureLock: null,
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    const current = touchRef.current;
    current.currentX = touch.clientX;
    current.currentY = touch.clientY;

    if (!current.gestureLock) {
      const dx = Math.abs(touch.clientX - current.startX);
      const dy = Math.abs(touch.clientY - current.startY);
      if (dx > 10 || dy > 10) {
        if (dx > dy) {
          current.gestureLock = "horizontal";
        } else {
          current.gestureLock = "vertical";
        }
      }
    }
  };

  const onTouchEnd = () => {
    const current = touchRef.current;
    if (current.gestureLock === "horizontal") {
      const distance = current.startX - current.currentX;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;
      if (isLeftSwipe) {
        setActiveImageIndex((prev) => (prev + 1) % productImages.length);
      } else if (isRightSwipe) {
        setActiveImageIndex(
          (prev) => (prev - 1 + productImages.length) % productImages.length,
        );
      }
    }
    current.gestureLock = null;
  };
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [sizeError, setSizeError] = useState(false);
  const [stockError, setStockError] = useState(false);

  // Synchronous state reset on navigation
  const [currentSlug, setCurrentSlug] = useState(slug);
  if (slug !== currentSlug) {
    setCurrentSlug(slug);
    setActiveImageIndex(0);
    setSizeError(false);
    setStockError(false);
    setIsLightboxOpen(false);
    setIsZoomed(false);
    setSelectedSize(null);
    setQuantity(1);
  }

  const sizeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLightboxOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLightboxOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);

    if (product) {
      trackViewContent(product);
    }
  }, [slug, product]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setShowStickyAtc(!entries[0].isIntersecting);
        }
      },
      { threshold: 0 },
    );

    if (mainAtcRef.current) {
      observer.observe(mainAtcRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Dynamic Razorpay SDK dynamic loading
  useEffect(() => {
    if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Quick Checkout States
  const [showQuickCheckout, setShowQuickCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: "",
    mobileNumber: "",
    streetAddress: "",
    zipCode: "",
    city: "",
    email: "",
  });
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({});
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handleBuyNow = () => {
    if (!product) return;
    if (isOutOfStock) return;

    if (!isSaree && !selectedSize) {
      setSizeError(true);
      sizeSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setSizeError(false);
    setShowQuickCheckout(true);
  };

  const handleBuyNowPayment = async (method: "online" | "cod") => {
    const errors: Record<string, string> = {};
    if (!checkoutForm.fullName.trim()) errors.fullName = "Full name is required";
    if (!/^\d{10}$/.test(checkoutForm.mobileNumber.trim())) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number";
    }
    if (!checkoutForm.streetAddress.trim()) errors.streetAddress = "Delivery address is required";
    if (!/^\d{6}$/.test(checkoutForm.zipCode.trim())) errors.zipCode = "Enter a 6-digit PIN code";
    if (!checkoutForm.city.trim()) errors.city = "City is required";

    if (Object.keys(errors).length > 0) {
      setCheckoutErrors(errors);
      return;
    }

    setCheckoutErrors({});
    setIsSubmittingOrder(true);

    // Save client data for future quick auto-fills
    try {
      localStorage.setItem('customer_checkout_info', JSON.stringify({
        email: checkoutForm.email || "",
        phone: checkoutForm.mobileNumber,
        name: checkoutForm.fullName,
        city: checkoutForm.city,
        zip: checkoutForm.zipCode,
        address: checkoutForm.streetAddress
      }));
    } catch (err) {
      console.warn("Storage write failed", err);
    }

    const totalAmount = finalPrice * quantity;
    const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const finalizeBuyNowOrder = async (
      status: string,
      paymentId: string = "N/A"
    ) => {
      const istTime = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

      const googleSheetsData = {
        orderId: newOrderId,
        firstName: checkoutForm.fullName,
        mobileNumber: checkoutForm.mobileNumber,
        email: checkoutForm.email || "N/A",
        streetAddress: checkoutForm.streetAddress,
        city: checkoutForm.city,
        zipCode: checkoutForm.zipCode,
        productName: product.name,
        totalAmount: totalAmount.toString(),
        size: selectedSize || "Standard",
        sku: product.sku || "N/A",
        color: product.color || "N/A",
        paymentStatus: status,
        paymentId: paymentId,
        timestamp: istTime,
      };

      try {
        await submitToGoogleSheets(googleSheetsData);
      } catch (err) {
        console.warn("Sheets submission failed, continuing anyway:", err);
      }

      // ALSO POST to Google Sheets Apps Script URL directly
      const sheetPayload = {
        type: 'order' as const,
        firstName: checkoutForm.fullName,
        phone: checkoutForm.mobileNumber,
        email: checkoutForm.email || "N/A",
        address: checkoutForm.streetAddress,
        city: checkoutForm.city,
        zip: checkoutForm.zipCode,
        productName: product.name,
        amount: totalAmount,
        size: selectedSize || "Standard",
        sku: product.sku || "N/A",
        color: product.color || "N/A",
        couponUsed: appliedCoupon || 'None',
        source: 'Direct Order',
        paymentMethod: method === 'cod' ? 'COD' : 'Razorpay Online',
        status: method === 'cod' ? 'Pending COD' : 'Paid ✅',
        orderId: newOrderId,
        paymentId: paymentId
      };

      try {
        await sendOrderToSheets(sheetPayload);
      } catch (sheetErr) {
        console.warn("Direct Google Apps Script sheet POST failed:", sheetErr);
      }

      setIsSubmittingOrder(false);
      setShowQuickCheckout(false);

      navigate("/thank-you", {
        state: { 
          orderId: newOrderId, 
          total: totalAmount, 
          couponUsed: appliedCoupon || "VIP50",
          cart: [{
            ...product,
            quantity: quantity,
            size: selectedSize || "Standard"
          }],
          customer: {
            fullName: checkoutForm.fullName,
            mobileNumber: checkoutForm.mobileNumber,
            email: checkoutForm.email || "",
            streetAddress: checkoutForm.streetAddress,
            city: checkoutForm.city,
            state: "India",
            zipCode: checkoutForm.zipCode,
            paymentMethod: method
          }
        },
        replace: true,
      });
    };

    if (method === "cod") {
      await finalizeBuyNowOrder("Cash on Delivery");
    } else {
      try {
        setIsSubmittingOrder(true);

        if (!(window as any).Razorpay) {
          const loaded = await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
          if (!loaded) {
            throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
          }
        }

        // Create the order on the backend to get a valid order_id + correct live key
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: totalAmount,
            notes: {
              product_name: product.name,
              size: selectedSize || "Standard",
              coupon_used: appliedCoupon || "None",
              customer_name: checkoutForm.fullName,
              customer_phone: checkoutForm.mobileNumber
            }
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to create payment order on the server. Please choose Cash on Delivery or contact support.");
        }

        const orderData = await res.json();
        const serverKey = orderData.key;
        const serverOrderId = orderData.id || orderData.orderId;

        if (!serverKey) {
          throw new Error("Razorpay Client Key is not configured on the server.");
        }

        const options = {
          key: serverKey,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Mukesh Saree Centre",
          description: `${product.name} | Size: ${selectedSize || "Standard"}`,
          image: product.image.startsWith("http") ? product.image : `https://mukeshsarees.com${product.image.startsWith("/") ? "" : "/"}${product.image}`,
          order_id: serverOrderId,
          prefill: {
            name: checkoutForm.fullName,
            email: checkoutForm.email || "",
            contact: checkoutForm.mobileNumber
          },
          theme: { color: "#C8A96E" },
          notes: {
            product_name: product.name,
            size: selectedSize || "Standard",
            coupon_used: appliedCoupon || "None"
          },
          handler: async (response: any) => {
            console.log("Payment successful:", response.razorpay_payment_id);
            await finalizeBuyNowOrder("Online Paid", response.razorpay_payment_id || "Paid");
          },
          modal: {
            ondismiss: () => {
              setIsSubmittingOrder(false);
              console.log("Payment modal closed by user");
            },
            escape: true,
            backdropclose: false
          }
        };

        const rzp = new (window as any).Razorpay(options);
        
        rzp.on("payment.failed", function(response: any) {
          console.error("Payment failed:", response.error);
          alert(
            "Payment failed: " + (response.error.description || "Unknown error") + 
            "\n\nPlease try again or use Cash on Delivery."
          );
          setIsSubmittingOrder(false);
        });

        rzp.open();
      } catch (err: any) {
        console.error("Razorpay initiation failed:", err);
        setCheckoutErrors({
          general: err?.message || "There was a problem initiating payment. Please choose Cash on Delivery or try again."
        });
        setIsSubmittingOrder(false);
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-primary-50">
        <h2 className="mb-4 text-2xl font-serif">Product Not Found</h2>
        <Link
          to="/shop"
          className="text-gold-500 hover:underline font-bold uppercase tracking-widest text-xs"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isCoOrd = product.category === "Co-Ord Sets";
  const sizes = product.availableSizes || ["M", "L", "XL", "XXL", "XXXL"];

  const productImages =
    product.images && product.images.length > 0
      ? [...product.images]
      : [product.image];
  const totalMediaLength = productImages.length;

  // Intelligent preloading of remaining gallery images to ensure instantaneous transition of main gallery on clicks or swipes
  useEffect(() => {
    if (productImages && productImages.length > 1) {
      productImages.forEach((url, idx) => {
        if (idx !== activeImageIndex && !isVideoUrl(url)) {
          const img = new Image();
          img.src = getImageSrc(url);
        }
      });
    }
  }, [productImages, activeImageIndex]);

  const handleShare = async () => {
    // Determine the share URL. If we are in the development environment,
    // it will share the current URL. When deployed to production, it will be the real domain.
    // We clean up any AI Studio specific workarounds for production readiness.
    const shareUrl = window.location.href;

    const shareData = {
      title: `${product.name} | Mukesh Saree Centre`,
      text: "Check out this beautiful product at Mukesh Saree Centre!",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Error sharing:", err);
      }
    }
  };

  const handleAddToCart = (): boolean => {
    if (!isSaree && !selectedSize) {
      setSizeError(true);
      sizeSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return false;
    }

    setSizeError(false);
    addToCart(product, isSaree ? undefined : (selectedSize || undefined), quantity);
    trackAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);

    setShowAddedToast({
      visible: true,
      quantity,
      size: isSaree ? undefined : (selectedSize || undefined),
    });

    return true;
  };


  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length,
    );
  };

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock === 0;
  const maxStock = product.stock !== undefined ? product.stock : Infinity;

  const absoluteProductImages = productImages.map((img) =>
    img.startsWith("http") ? img : `https://mukeshsarees.com${img.startsWith("/") ? "" : "/"}${img}`
  );

  const detailedProductSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: absoluteProductImages,
    description: cleanSEOText(product.description).substring(0, 300),
    ...(product.keywords ? { keywords: product.keywords } : {}),
    sku: product.sku || product.id,
    mpn: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "Mukesh Saree Centre",
    },
    category: product.category,
    color: product.color,
    material: product.fabric,
    offers: {
      "@type": "Offer",
      url: `https://mukeshsarees.com/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      availability: isOutOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Mukesh Saree Centre",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR"
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY"
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY"
          }
        }
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnPeriod",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: stats.rating.toString(),
      reviewCount: stats.reviewCount.toString(),
    },
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Product",
      "name": product.name,
      "image": absoluteProductImages[0]
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": stats.rating.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Person",
      "name": "Verified Customer"
    },
    "reviewBody": "Premium quality fabric and excellent finishing. Exactly as described.",
    "datePublished": new Date().toISOString().split('T')[0]
  };

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": absoluteProductImages,
    "description": cleanSEOText(product.description).substring(0, 300),
    "sku": product.sku || product.id,
    "brand": { "@type": "Brand", "name": "Mukesh Saree Centre" },
    "offers": detailedProductSchema.offers,
    "aggregateRating": detailedProductSchema.aggregateRating,
    "review": reviewSchema
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": new URL(item.to, "https://mukeshsarees.com").href
    })).concat([
      {
        "@type": "ListItem",
        "position": breadcrumbItems.length + 1,
        "name": product.name,
        "item": `https://mukeshsarees.com/product/${product.slug}`
      }
    ])
  };

  const isSareeProduct = product.category.toLowerCase().includes("saree") || product.name.toLowerCase().includes("saree");
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is the color of the ${product.name} exactly as shown in the picture?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `We strive for 95% color accuracy. Due to bright studio lighting and individual monitor settings, very slight variations may occur, but the genuine beauty of the ${product.fabric} is always preserved.`
        }
      },
      {
        "@type": "Question",
        "name": "Is Cash on Delivery (COD) available for this item?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Cash on Delivery is available across all serviceable pincodes in India for this item."
        }
      },
      {
        "@type": "Question",
        "name": `How do I know if this ${product.fabric} is authentic?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mukesh Saree Centre has been a highly trusted name since 1978. Every piece undergoes rigorous quality checks to authenticate the weave and material."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get the blouse stitched before delivery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Currently, this is provided as an unstitched blouse piece. However, you can contact our WhatsApp support team to inquire about custom tailoring options prior to dispatch."
        }
      },
      {
        "@type": "Question",
        "name": "Will this fabric shrink after washing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Premium ${product.fabric} usually does not shrink if care instructions are strictly followed. Professional dry cleaning is highly recommended.`
        }
      },
      {
        "@type": "Question",
        "name": `Is this ${product.category} suitable for plus-size women?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": isSareeProduct ? "Absolutely. A 5.5-meter drape is universally flattering, easily accommodating and elegantly draping around all body types." : "Please refer to our detailed size chart. We ensure our cuts are flattering and comfortable across our entire size range."
        }
      },
      {
        "@type": "Question",
        "name": "How fast will my order be dispatched?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Orders are typically processed and dispatched within 24 to 48 hours from our Nagpur facility."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer wholesale or bulk discounts for this product?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we cater to boutique owners and bulk buyers. Please reach out to our wholesale department via our Contact Us page for specialized pricing."
        }
      },
      {
        "@type": "Question",
        "name": "What do I do if I receive a damaged product?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While rare, if you receive a defective item, simply share an unboxing video via WhatsApp within 24 hours of delivery, and we will arrange a swift replacement or refund."
        }
      },
      {
        "@type": "Question",
        "name": "Can I wear this for a full-day event without feeling uncomfortable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Without a doubt! This piece was selected specifically for its breathability and light weight, ensuring it remains comfortable even during 12-hour events."
        }
      }
    ]
  };

  const seoTitle = `${product.name} | Authentic ${product.fabric} ${product.category}`.substring(0, 60);
  const seoDescription = `Buy ${product.name} online. Premium ${product.fabric} ${product.category} perfect for elegant occasions, weddings, and daily wear. Free Shipping & COD.`.substring(0, 160);

  return (
    <div className="bg-primary-50 product-page-content pb-[70px] md:pb-0">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={product.keywords}
        image={product.image}
        url={`/product/${product.slug}`}
        type="product"
        product={product}
        schema={[productSchema, breadcrumbSchema, faqSchema] as any}
      />

      <div className="max-w-[1400px] mx-auto px-0 md:px-8 lg:px-12 pb-0 md:pb-12 pt-0">
        {/* Minimalist, super-low profile Breadcrumbs with absolutely zero wasted space */}
        <nav aria-label="Breadcrumb" className="breadcrumb-wrapper !px-4 md:!px-0 select-none py-1.5 md:py-2 bg-transparent shrink-0">
          <ol className="breadcrumb font-sans text-[10px] md:text-xs flex flex-wrap m-0 p-0 list-none content-start">
            {breadcrumbItems.map((item, idx) => (
              <Fragment key={idx}>
                <li className="flex items-center">
                  <Link to={item.to} className="!text-[#2b2b2b] hover:!text-[#C8A96B] transition-colors font-medium">
                    {item.label}
                  </Link>
                  <span className="separator !text-black/40 mx-1">/</span>
                </li>
              </Fragment>
            ))}
            <li className="flex items-center">
              <span className="current-page !text-black !font-semibold" aria-current="page">
                {product.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-2 md:gap-12 xl:gap-16">
          {/* Gallery Section */}
          <div className="w-full lg:w-7/12 space-y-2 md:space-y-4">
            <div
              className="gallery-main product-image-container relative cursor-zoom-in group mx-auto touch-pan-y"
              style={{
                touchAction: 'pan-y pinch-zoom',
                width: '100%',
                backgroundColor: '#f5f0e8',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
              onClick={() => setIsLightboxOpen(true)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {isVideoUrl(productImages[activeImageIndex]) ? (
                <video
                  key={productImages[activeImageIndex]}
                  src={productImages[activeImageIndex]}
                  autoPlay
                  loop
                  muted={true}
                  playsInline
                  controls
                  className="product-image-main product-main-img w-full h-full object-contain mx-auto"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <OptimizedImage
                  src={productImages[activeImageIndex]}
                  width={800}
                  alt={productImages.length > 1 ? `${getImageAlt(product)} - View ${activeImageIndex + 1} of ${productImages.length}` : getImageAlt(product)}
                  className="product-image-main product-main-img transition-transform duration-700 transform-gpu group-hover:scale-[1.02]"
                  priority={true}
                />
              )}
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-[var(--color-bg)]/90 backdrop-blur-md p-3 shadow-sm text-[var(--color-dark)]/70 opacity-0 group-hover:opacity-100 transition-all z-10 hidden md:block rounded-full hover:text-[var(--color-dark)]">
                <Maximize2 size={20} strokeWidth={1.5} />
              </div>

              {/* Slider Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage(e);
                    }}
                    className="absolute left-2.5 md:left-4 top-1/2 -translate-y-1/2 w-5.5 h-5.5 md:w-6.5 md:h-6.5 flex items-center justify-center bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white hover:text-[#C8A96B] transition-all duration-300 z-10 border border-white/5 rounded-full shadow-none"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft
                      size={14}
                      className="transition-colors"
                      strokeWidth={2.5}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage(e);
                    }}
                    className="absolute right-2.5 md:right-4 top-1/2 -translate-y-1/2 w-5.5 h-5.5 md:w-6.5 md:h-6.5 flex items-center justify-center bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white hover:text-[#C8A96B] transition-all duration-300 z-10 border border-white/5 rounded-full shadow-none"
                    aria-label="Next Image"
                  >
                    <ChevronRight
                      size={14}
                      className="transition-colors"
                      strokeWidth={2.5}
                    />
                  </button>
                </>
              )}


            </div>

            {productImages.length > 1 && (
              <div 
                className="product-thumbnails-container flex gap-2.5 overflow-x-auto scrollbar-hide snap-x px-4 md:px-0 pt-1 pb-1 md:py-2 touch-pan-x touch-pan-y"
                style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
              >
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`shrink-0 w-16 md:w-20 lg:w-24 aspect-[2/3] md:aspect-[3/4] relative overflow-hidden rounded-[4px] transition-all duration-300 flex items-center justify-center p-0 
                      ${activeImageIndex === idx ? "opacity-100 ring-1 ring-[var(--color-dark)] ring-offset-2" : "opacity-60 hover:opacity-100"}`}
                  >
                    <div className="absolute inset-0 bg-[#FAF8F5] -z-10" />
                    {isVideoUrl(img) ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black/5">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                            <span className="text-[11px] font-bold text-primary-950 pl-[1.5px]">▶</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <OptimizedImage
                        src={img}
                        width={150}
                        alt={`${getImageAlt(product)} - Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain object-center"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-5/12 px-0">
            <div className="lg:sticky lg:top-32 lg:pb-12">
              <header className="product-info-section flex flex-col items-start text-left mt-0 mb-1">
                {/* SKU + Category row compact */}
                <div className="product-meta-row select-none">
                  <span className="category">
                    {product.category}
                  </span>
                  {product.sku && (
                    <>
                      <span className="separator">|</span>
                      <span className="sku">
                        SKU: {product.sku}
                      </span>
                    </>
                  )}
                  {product.isNew && (
                    <>
                      <span className="separator">|</span>
                      <span className="trending-tag">
                        NEW
                      </span>
                    </>
                  )}
                  {product.isTrending && (
                    <>
                      <span className="separator">|</span>
                      <span className="trending-tag">
                        TRENDING
                      </span>
                    </>
                  )}
                  {product.isBestSelling && (
                    <>
                      <span className="separator">|</span>
                      <span className="trending-tag">
                        BEST SELLER
                      </span>
                    </>
                  )}
                </div>

                <h1
                  className="product-title font-serif text-[var(--color-dark)] font-normal"
                  title={product.name}
                >
                  {product.name}
                  <span className="sr-only"> - Premium {product.fabric} {product.category} for Women</span>
                </h1>

              </header>

              {/* Product Info Section wrapping clean, non-overlapping rows */}
              <div className="product-info-section px-0 py-2 border-b border-[var(--color-border)] mb-4">
                {/* ROW 1 — Price + Share + WhatsApp all on ONE single line */}
                <div className="price-action-row price-section">
                  <div className="price-group">
                    <span className="price-main text-[var(--color-dark)] font-serif leading-none tracking-wide text-[22px]">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="price-mrp line-through font-light leading-none">
                        MRP {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="price-off-badge font-medium text-[var(--color-terracotta)] bg-[#F8F0E5] tracking-wide">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100,
                        )}
                        % OFF
                      </span>
                    )}
                  </div>

                  <div className="buttons-group">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `https://mukeshsarees.com/product/${product.slug}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-btn border border-[#25D366]/30 bg-transparent hover:bg-[#25D366]/10 text-[#25D366] transition-colors"
                      aria-label="Share on WhatsApp"
                      title="Share on WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* ROW 2 — Ratings + urgency badge */}
                <div className="rating-badge-row rating-section badge-section">
                  <a
                    href="#reviews"
                    className="flex items-center gap-1.5 hover:opacity-80 transition-opacity flex-shrink-0"
                  >
                    <div className="flex items-center gap-[2px] rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] ${
                            stats.rating >= i + 1
                              ? "fill-[#F4B63D] text-[#F4B63D]"
                              : stats.rating >= i + 0.5
                                ? "fill-[#F4B63D] text-[#F4B63D] opacity-50"
                                : "fill-[#E6DEC8] text-[#E6DEC8]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] sm:text-[12px] text-[#9CA3AF] font-medium leading-none hover:underline underline-offset-4 decoration-[#9CA3AF] whitespace-nowrap">
                      ({product.reviewsCount || stats.reviewCount})
                    </span>
                  </a>
                  <span className="text-[#9CA3AF] text-[11px] sm:text-[12px] font-light flex-shrink-0 px-0.5 select-none opacity-60">|</span>
                  <div className="flex-shrink-0">
                    <LiveViewerCounter productId={product.id} category={product.category} />
                  </div>
                </div>
              </div>

              {/* Product Specifications - Clean Minimal List */}
              <div className="product-info product-specs-container">
                <table className="product-details-table w-full mb-3 border-collapse">
                  <tbody>
                    <tr className="border-none">
                      <td className="product-details-label font-light uppercase">
                        Fabric
                      </td>
                      <td className="text-[var(--color-dark)] align-middle">
                        {product.fabric}
                      </td>
                    </tr>

                    {product.category.toLowerCase().includes("saree") && (
                      <>
                        <tr className="border-none">
                          <td className="product-details-label font-light uppercase">
                            Dimensions
                          </td>
                          <td className="text-[var(--color-dark)] align-middle">
                            5.50 Meters
                          </td>
                        </tr>
                        <tr className="border-none">
                          <td className="product-details-label font-light uppercase">
                            Blouse
                          </td>
                          <td className="text-[var(--color-dark)] align-middle">
                            1 Meter (Unstitched)
                          </td>
                        </tr>
                      </>
                    )}

                    <tr className="border-none">
                      <td className="product-details-label font-light uppercase">
                        Color
                      </td>
                      <td className="text-[var(--color-dark)] align-middle">
                        {product.color}
                      </td>
                    </tr>

                    {!product.category.toLowerCase().includes("saree") && (
                      <tr className="border-none">
                        <td className="product-details-label font-light uppercase">
                          Style
                        </td>
                        <td className="text-[var(--color-dark)] align-middle">Premium</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Color Variants */}
              {product.colorVariants && product.colorVariants.length > 0 && (
                <section className="product-info mb-2.5">
                  <h2 className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)] font-medium mb-2">
                    Color Options
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {product.colorVariants.map((v) => (
                      <Link
                        key={v.slug}
                        to={`/product/${v.slug}`}
                        className={`group relative w-[52px] h-[72px] transition-all overflow-hidden bg-[var(--color-surface)] border ${v.slug === slug ? "border-[var(--color-gold)]" : "border-transparent hover:border-[var(--color-border)]"}`}
                      >
                        <OptimizedImage
                          src={v.image}
                          alt={`${product.name} in ${v.color} Color option - Mukesh Saree Centre Nagpur`}
                          width={150}
                          className={`w-full h-full object-contain object-center transition-all duration-500 ${v.slug === slug ? "" : "opacity-80 group-hover:scale-105 group-hover:opacity-100"}`}
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Size Selection */}
              {!isSaree && (
                <section ref={sizeSectionRef} className="product-info mb-4">
                  <div className="size-selector">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10.5px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">
                        Select Size: {sizeError && <span style={{color:'red'}} className="font-semibold ml-1">Please select a size</span>}
                      </p>
                      <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-[9.5px] sm:text-[10px] uppercase font-medium text-[var(--color-dark)]/80 hover:text-[var(--color-dark)] underline decoration-[var(--color-border)] underline-offset-4 hover:decoration-[var(--color-dark)] transition-colors tracking-[0.08em]"
                      >
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map(s => (
                        <button key={s}
                          className={`h-[32px] sm:h-[34px] min-w-[34px] sm:min-w-[36px] px-2.5 border text-[11px] sm:text-[11px] tracking-wider transition-all rounded-sm font-medium ${selectedSize === s ? 'size-btn active border-[var(--color-dark)] bg-[var(--color-dark)] text-white' : 'size-btn border-[var(--color-border)] text-[var(--color-dark)] hover:border-[var(--color-dark)] bg-transparent hover:border-[var(--color-dark)]'}`}
                          onClick={() => { setSelectedSize(s); setSizeError(false); }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              <div className="product-info">
                <LowStockMessage productId={product.id} />
              </div>

              {/* Actions */}
              <section className="product-info w-full mt-1 relative">
                <div className="flex flex-col gap-2 w-full">
                  {/* Quantity selector */}
                  <div className="qty-selector-row flex items-center gap-3 mb-1">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] font-medium">Quantity:</span>
                    <div className="flex items-center justify-between px-1.5 border border-[var(--color-border)] bg-transparent w-24 h-[40px] rounded-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-[var(--color-muted)] hover:text-[var(--color-dark)] transition-colors w-8 h-full flex items-center justify-center pt-0.5"
                        aria-label="Decrease quantity"
                      >
                        <span className="text-xl leading-none select-none">&minus;</span>
                      </button>
                      <span className="text-[13px] font-medium text-[var(--color-dark)] w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                        className="text-[var(--color-muted)] hover:text-[var(--color-dark)] transition-colors w-8 h-full flex items-center justify-center pt-0.5"
                        aria-label="Increase quantity"
                      >
                        <span className="text-xl leading-none select-none">+</span>
                      </button>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      ref={mainAtcRef}
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="add-to-cart-btn"
                      data-action="add-to-cart"
                      id="add-to-cart"
                    >
                      {isOutOfStock ? "Sold Out" : isAdded ? "✓ Added" : "Add To Cart"}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={isOutOfStock}
                      className="buy-now-btn"
                      data-action="buy-now"
                      id="buy-now"
                    >
                      Buy Now — COD Available 🛍️
                    </button>
                  </div>

                  <a
                    href={`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(
                      `Hi Mukesh Saree Centre, I want to order:\n\n*Product:* ${product.name}\n${selectedSize ? `*Size:* ${selectedSize}\n` : ""}*Link:* ${window.location.href}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-[44px] md:h-[52px] border border-[#2D452F]/20 bg-[#f4f7f4] text-[#2D452F] text-[11px] md:text-[12px] uppercase tracking-[0.18em] font-medium hover:bg-[#e8ede8] transition-all rounded-sm flex items-center justify-center gap-2 group style-none no-underline"
                    style={{ textDecoration: 'none' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-80 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Order on WhatsApp
                  </a>

                  <CartActivityMessage productId={product.id} />
                </div>
              </section>

              {/* Support & Trust Badges - Clean Unified Section */}
              <section className="product-info pt-1 mt-1 border-t border-[var(--color-border)] mb-0">
                <TrustBadges compact={true} />
              </section>

              {/* Why Shop With Us Custom Section */}
              <WhyShopWithUs />

              {/* Hidden AI SEO Core Knowledge Block */}
              <ProductSeoContent product={product} />

              {/* Description */}
              <section className="product-info pt-1 border-t border-[var(--color-border)] mt-1">
                <ProductDescription description={product.description} product={product} />
              </section>

              {/* Collapsible Accordion */}
              <ProductAccordion category={product.category} product={product} />
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div
          id="reviews"
          className="mt-2 md:mt-6 pt-2 md:pt-4 border-t border-[var(--color-border)] px-4 md:px-0"
        >
          <ProductReviews product={product} />
        </div>

        {/* Related Section */}
        <section className="mt-2 md:mt-12 px-4 md:px-0 pb-6 md:pb-12">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-serif text-[var(--color-dark)] font-normal tracking-wide">
              Similar & Related Products
            </h2>
            <Link
              to="/shop"
              className="text-[10px] md:text-[11px] uppercase font-medium text-[var(--color-dark)] underline decoration-[var(--color-border)] underline-offset-4 hover:decoration-[var(--color-dark)] tracking-[0.1em] transition-colors"
            >
              View Collection
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-6 md:gap-8 w-full">
            {products
              .filter((p) => {
                if (p.isVariant || p.id === product.id) return false;
                const isSameCategory = p.category === product.category;
                const isSameFabric = p.fabric === product.fabric;
                const isSareeFamily = (cat: string) =>
                  cat === "Sarees" || cat === "Linen Sarees";

                if (
                  isSareeFamily(product.category) &&
                  isSareeFamily(p.category)
                )
                  return true;
                return isSameCategory || isSameFabric;
              })
              .sort((a, b) => {
                const aCategory = a.category === product.category;
                const bCategory = b.category === product.category;
                const aFabric = a.fabric === product.fabric;
                const bFabric = b.fabric === product.fabric;

                const scoreA = (aCategory ? 2 : 0) + (aFabric ? 1 : 0);
                const scoreB = (bCategory ? 2 : 0) + (bFabric ? 1 : 0);

                return scoreB - scoreA;
              })
              .slice(0, 8)
              .map((p, index) => (
                <div
                  key={p.id}
                  className="w-full"
                >
                  <ProductCard product={p} priority={index < 4} />
                </div>
              ))}
          </div>

          {/* Additional AI SEO Component Grids */}
          {[
            { title: "Customers Also Bought", offset: 2 },
            { title: "Recently Viewed", offset: 4 },
            { title: "Related Products", offset: 6 },
          ].map((gridSet, setIdx) => {
            const gridProducts = products
              .filter((p) => p.id !== product.id && !p.isVariant)
              .sort((a, b) => b.price - a.price)
              .slice(gridSet.offset, gridSet.offset + 4);
              
            if(gridProducts.length === 0) return null;

            return (
              <div key={setIdx} className="mt-6 md:mt-10 pt-6 border-t border-[var(--color-border)]">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-serif text-[var(--color-dark)] font-normal tracking-wide">
                    {gridSet.title}
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-6 md:gap-8 w-full">
                  {gridProducts.map((p) => (
                    <div key={p.id} className="w-full">
                      <ProductCard product={p} priority={false} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Internal Links / Popular Searches - AI SEO Optimized */}
          <div className="mt-12 pt-6 border-t border-[var(--color-border)]">
            <h3 className="text-sm font-serif text-[var(--color-dark)] mb-4">Explore More Collections & Guides</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Link to={`/shop?category=${product.category}`} className="text-[11px] md:text-xs text-[#2C241B]/70 hover:text-[#C8A96B] transition-colors rounded-full border border-gray-200 px-3 py-1.5 bg-white">More {product.category}</Link>
              <Link to="/guides/saree-fabric-guide" className="text-[11px] md:text-xs text-[#2C241B]/70 hover:text-[#C8A96B] transition-colors rounded-full border border-gray-200 px-3 py-1.5 bg-white">Saree Fabric Guide</Link>
              <Link to="/guides/saree-care-guide" className="text-[11px] md:text-xs text-[#2C241B]/70 hover:text-[#C8A96B] transition-colors rounded-full border border-gray-200 px-3 py-1.5 bg-white">Saree Care Guide</Link>
              <Link to="/wholesale-sarees" className="text-[11px] md:text-xs text-[#2C241B]/70 hover:text-[#C8A96B] transition-colors rounded-full border border-gray-200 px-3 py-1.5 bg-white">Wholesale Buying</Link>
              <Link to="/shop" className="text-[11px] md:text-xs text-[#2C241B]/70 hover:text-[#C8A96B] transition-colors rounded-full border border-gray-200 px-3 py-1.5 bg-white">Similar Premium Products</Link>
              <Link to="/about" className="text-[11px] md:text-xs text-[#2C241B]/70 hover:text-[#C8A96B] transition-colors rounded-full border border-gray-200 px-3 py-1.5 bg-white">About Mukesh Saree Centre</Link>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox Component Here... (I will keep it simple relying on motion) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary-950/95 backdrop-blur-md flex flex-col items-center justify-center p-0 md:p-6"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition-colors z-[110] bg-black/20 p-2 rounded-full backdrop-blur-md"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full md:w-auto md:h-auto md:max-w-5xl md:max-h-full relative flex items-center justify-center pointer-events-none"
            >
              {isVideoUrl(productImages[activeImageIndex]) ? (
                <video
                  key={`lightbox-${productImages[activeImageIndex]}`}
                  src={productImages[activeImageIndex]}
                  autoPlay
                  loop
                  muted={true}
                  playsInline
                  controls
                  className="w-full h-full max-h-[95vh] md:w-auto md:h-auto md:max-h-[90vh] object-contain object-center md:rounded-sm md:shadow-2xl pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <OptimizedImage
                  src={productImages[activeImageIndex]}
                  width={1200}
                  alt={productImages.length > 1 ? `${getImageAlt(product)} - Fullscreen View ${activeImageIndex + 1} of ${productImages.length}` : `${getImageAlt(product)} - Fullscreen View`}
                  className="w-full h-full max-h-[95vh] md:w-auto md:h-auto md:max-h-[90vh] object-contain object-center md:rounded-sm md:shadow-2xl pointer-events-auto will-change-transform transform-gpu"
                  onClick={(e: any) => e.stopPropagation()}
                />
              )}
              <div className="absolute inset-y-0 left-2 md:-left-20 flex items-center pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage(e);
                  }}
                  className="p-2 text-white/70 hover:text-white bg-black/20 rounded-full backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-2 md:-right-20 flex items-center pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(e);
                  }}
                  className="p-2 text-white/70 hover:text-white bg-black/20 rounded-full backdrop-blur-sm transition-all"
                >
                  <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Toast Notification */}
      {/* Cart Toast Notification */}
      <AnimatePresence>
        {showAddedToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-[90px] md:top-28 right-4 md:right-8 z-[100] w-[calc(100%-32px)] sm:w-[420px] bg-white border border-black/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden flex flex-col pointer-events-auto mx-auto sm:mx-0 left-0 right-0 sm:left-auto"
          >
            {/* Elegant luxury top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gold-500 z-10" />

            <div className="bg-gradient-to-r from-gold-50/80 to-white px-5 py-4 flex items-center justify-between border-b border-black/5 relative">
              <div className="flex items-center gap-3 text-gold-700">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    delay: 0.1,
                    stiffness: 400,
                    damping: 20,
                  }}
                  className="bg-gold-500 text-white rounded-full p-1 shadow-sm"
                >
                  <CheckCircle size={16} strokeWidth={3} />
                </motion.div>
                <span className="text-[11px] md:text-sm font-bold uppercase tracking-[0.08em] text-primary-950">
                  Added to Cart Successfully
                </span>
              </div>
              <button
                onClick={() =>
                  setShowAddedToast((prev) => ({ ...prev, visible: false }))
                }
                className="text-primary-950/40 hover:text-primary-950 transition-colors p-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 flex gap-5 bg-white">
              <div className="w-[70px] h-[90px] bg-primary-50 rounded-[4px] relative overflow-hidden flex-shrink-0 border border-black/5 shadow-sm">
                <OptimizedImage
                  src={showAddedToast.customImg || product.image}
                  width={100}
                  alt={`${getImageAlt(product)} - Added to Bag Successfully`}
                  className="w-full h-full object-contain object-center will-change-transform transform-gpu"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="text-sm md:text-base font-serif text-primary-950 line-clamp-2 leading-snug font-medium mb-2">
                  {showAddedToast.customName || product.name}
                </h4>
                <div className="flex items-center text-[11px] md:text-xs font-bold text-primary-950/60 uppercase tracking-widest mt-auto pb-1">
                  <span>Qty: {showAddedToast.quantity}</span>
                  {showAddedToast.size && (
                    <>
                      <span className="mx-3 text-primary-950/20">•</span>
                      <span>Size: {showAddedToast.size}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 pt-2 flex gap-3 bg-white justify-between items-center rounded-b-xl border-t border-black/5 mt-1">
              <button
                onClick={() =>
                  setShowAddedToast((prev) => ({ ...prev, visible: false }))
                }
                className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-primary-950/60 hover:text-primary-950 underline underline-offset-4 transition-colors"
              >
                Continue <span className="hidden sm:inline">Shopping</span>
              </button>
              <Link
                to="/cart"
                className="bg-primary-950 hover:bg-gold-600 text-white text-[11px] md:text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors shadow-md transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
              >
                View Cart
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsSizeGuideOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-lg bg-[#FCFAF7] rounded-lg shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-[#E8D3A2]/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-4 border-b border-[#E8D3A2]/15 bg-white">
                <div>
                  <h3 className="text-base font-serif text-[var(--color-dark)] tracking-wide font-normal">
                    Size Guide
                  </h3>
                  <p className="text-[10px] text-[var(--color-muted)] tracking-wider uppercase mt-0.5">
                    Co-Ord Sets & Apparel
                  </p>
                </div>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-1 rounded-full text-[var(--color-dark)]/50 hover:text-[var(--color-dark)] hover:bg-[#FAF6F0] transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 overflow-y-auto max-h-[75vh] space-y-5 text-left font-body">
                {/* Unit Switcher */}
                <div className="flex items-center justify-between p-2.5 bg-[#FAF6F0] rounded-sm border border-[#E8D3A2]/10">
                  <span className="text-xs text-[var(--color-dark)]/75 font-medium tracking-wide">
                    Measurement Unit:
                  </span>
                  <div className="flex gap-1 bg-white p-0.5 border border-black/5 rounded-sm">
                    <button
                      onClick={() => setSizeGuideUnit("in")}
                      className={`px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all ${
                        sizeGuideUnit === "in"
                          ? "bg-[var(--color-dark)] text-white"
                          : "text-[var(--color-dark)]/60 hover:text-[var(--color-dark)] bg-transparent"
                      }`}
                    >
                      Inches
                    </button>
                    <button
                      onClick={() => setSizeGuideUnit("cm")}
                      className={`px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-sm transition-all ${
                        sizeGuideUnit === "cm"
                          ? "bg-[var(--color-dark)] text-white"
                          : "text-[var(--color-dark)]/60 hover:text-[var(--color-dark)] bg-transparent"
                      }`}
                    >
                      CM
                    </button>
                  </div>
                </div>

                {/* Table Container */}
                <div className="border border-[#E8D3A2]/15 rounded-sm overflow-hidden bg-white shadow-sm">
                  <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-center text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FAF6F0] border-b border-[#E8D3A2]/15 text-[10px] uppercase tracking-wider font-semibold text-[var(--color-dark)]">
                          <th className="py-2.5 px-2 text-left bg-[#FAF6F0]">Size</th>
                          <th className="py-2.5 px-2">Bust</th>
                          <th className="py-2.5 px-2">Waist</th>
                          <th className="py-2.5 px-2">Hips</th>
                          <th className="py-2.5 px-2">Top L</th>
                          <th className="py-2.5 px-2">Bottom L</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 text-[var(--color-dark)]/90">
                        {[
                          { sz: "S", b: 36, w: 30, h: 38, tl: 26, bl: 38 },
                          { sz: "M", b: 38, w: 32, h: 40, tl: 26.5, bl: 38.5 },
                          { sz: "L", b: 40, w: 34, h: 42, tl: 27, bl: 39 },
                          { sz: "XL", b: 42, w: 36, h: 44, tl: 27.5, bl: 39.5 },
                          { sz: "XXL", b: 44, w: 38, h: 46, tl: 28, bl: 40 },
                        ].map((row) => (
                          <tr key={row.sz} className="hover:bg-[#FAF8F5]/55 transition-colors">
                            <td className="py-3 px-2 font-bold text-[11px] text-left bg-white border-r border-black/5">{row.sz}</td>
                            <td className="py-3 px-2 font-light">
                              {sizeGuideUnit === "in" ? row.b : Math.round(row.b * 2.54)}
                            </td>
                            <td className="py-3 px-2 font-light">
                              {sizeGuideUnit === "in" ? row.w : Math.round(row.w * 2.54)}
                            </td>
                            <td className="py-3 px-2 font-light">
                              {sizeGuideUnit === "in" ? row.h : Math.round(row.h * 2.54)}
                            </td>
                            <td className="py-3 px-2 font-light">
                              {sizeGuideUnit === "in" ? row.tl : Math.round(row.tl * 2.54)}
                            </td>
                            <td className="py-3 px-2 font-light">
                              {sizeGuideUnit === "in" ? row.bl : Math.round(row.bl * 2.54)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sizing Note */}
                <p className="text-[10px] text-[var(--color-muted)] text-center leading-relaxed">
                  * Note: Sizing can vary slightly by 0.5 inches due to the premium handcrafted fabrication. For a relaxed fit, we suggest choosing one size up.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Mobile ATC Bar */}
      <AnimatePresence>
        {showStickyAtc && (
          <motion.div
            id="sticky-atc"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-[0px] left-0 right-0 bg-white border-t border-[var(--color-border)] z-[1000] flex items-center justify-between px-4 pb-[env(safe-area-inset-bottom)] md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
            style={{ height: "calc(64px + env(safe-area-inset-bottom))" }}
          >
            <div className="flex flex-col justify-center min-w-0 mr-4 pt-[env(safe-area-inset-bottom)]">
              <h4 className="text-[13px] font-medium text-[var(--color-dark)] truncate max-w-[160px] xs:max-w-[200px]">
                {product?.name}
              </h4>
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <span className="text-[15px] font-bold text-[var(--color-dark)] leading-none shrink-0">
                  {formatPrice(product?.price || 0)}
                </span>
                {product?.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-[11px] text-[#8C8276] line-through font-normal shrink-0 leading-none">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-[9px] font-extrabold text-[#8C1D18] bg-[#FFF1F2] border border-[#FECDD3] rounded-[4px] px-1.5 py-0.5 tracking-[0.05em] uppercase shrink-0 leading-none">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="mt-[env(safe-area-inset-bottom)] bg-[#C8A96B] hover:bg-[#B3965D] text-white px-6 h-[40px] rounded-sm text-[13px] uppercase tracking-[0.12em] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap min-w-[140px]"
            >
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Checkout Modal */}
      <AnimatePresence>
        {showQuickCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 xs:p-4 overflow-hidden"
            onClick={() => setShowQuickCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="bg-white rounded-t-xl sm:rounded-lg shadow-xl w-full max-w-md h-[95vh] sm:h-auto max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden relative border border-[#2C241B]/10 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#FAF9F5] border-b border-[#2C241B]/10 px-4 py-2.5 sm:px-6 sm:py-3.5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-serif text-sm sm:text-base text-[#2C241B] tracking-wide font-medium">⚡ Express Checkout</h3>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-[1px] sm:tracking-[1.5px] text-[#2C241B]/60 mt-0.5">Complete Your Order in 1 Minute</p>
                </div>
                <button
                  onClick={() => setShowQuickCheckout(false)}
                  className="text-[#2C241B]/60 hover:text-[#2C241B] transition-colors p-1"
                  aria-label="Close Checkout"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Summary Mini-Section - Beautiful Two-Section Compact Row style */}
              <div className="px-4 py-2.5 sm:px-6 sm:py-3.5 bg-[#F5F2EA]/30 border-b border-[#2C241B]/10 flex gap-3 sm:gap-4 shrink-0">
                {/* Product Image: exactly 120-150px height limit */}
                <div className="w-[85px] sm:w-[100px] h-[120px] sm:h-[135px] rounded border border-[#2C241B]/10 overflow-hidden flex-shrink-0 bg-white">
                  <OptimizedImage
                    src={product.image}
                    width={200}
                    alt={`${getImageAlt(product)} - Order Summary`}
                    className="w-full h-full object-cover object-top animate-fade-in"
                  />
                </div>
                {/* Product stats */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 text-left">
                  <div>
                    <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#2C241B] line-clamp-2 leading-tight">{product.name}</h4>
                    <p className="text-[10px] sm:text-[11px] text-[#2C241B]/70 mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                      <span>Color: <strong className="text-[#2C241B] font-bold">{product.color || "Gold"}</strong></span>
                      <span className="opacity-50">•</span>
                      <span>Size: <strong className="text-[#2C241B] font-bold">{selectedSize || "Free Size"}</strong></span>
                      <span className="opacity-50">•</span>
                      <span>Qty: <strong className="text-[#2C241B] font-bold">{quantity}</strong></span>
                    </p>
                  </div>
                  <div className="mt-1 border-t border-[#2C241B]/5 pt-1.5 font-sans space-y-0.5 text-[10px] sm:text-xs text-[#2C241B]/80">
                    <div className="flex justify-between items-center">
                      <span>MRP Total:</span>
                      <span className="line-through text-black/40">{formatPrice(mrpPrice * quantity)}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-600 font-medium">
                      <span>Discount:</span>
                      <span>
                        {(currentCoupon === "VIPCLUB60" || currentCoupon === "VIBCLUB60") ? "60% OFF" : "50% OFF"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#2C241B] font-bold mt-0.5 text-xs sm:text-sm">
                      <span>Grand Total:</span>
                      <span className="text-sm sm:text-base text-[#1A0A00]">{formatPrice(finalPrice * quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Form - now SCROLLABLE internally */}
              <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 space-y-3 min-h-0">
                {/* Full Name */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[1px] font-semibold text-[#2C241B] mb-0.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.fullName}
                    onChange={(e) => {
                      setCheckoutForm({ ...checkoutForm, fullName: e.target.value });
                      if (checkoutErrors.fullName) {
                        const { fullName, ...rest } = checkoutErrors;
                        setCheckoutErrors(rest);
                      }
                    }}
                    placeholder="Enter your full name"
                    className="w-full h-9 px-2.5 bg-[#FAF9F5] border border-[#2C241B]/15 rounded-[3px] focus:outline-none focus:border-[#2C241B] text-xs text-[#2C241B] placeholder-[#2C241B]/40"
                  />
                  {checkoutErrors.fullName && (
                    <p className="text-[10px] text-red-600 mt-0.5">{checkoutErrors.fullName}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[1px] font-semibold text-[#2C241B] mb-0.5">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#2C241B]/50 font-medium select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={checkoutForm.mobileNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setCheckoutForm({ ...checkoutForm, mobileNumber: val });
                        if (checkoutErrors.mobileNumber) {
                          const { mobileNumber, ...rest } = checkoutErrors;
                          setCheckoutErrors(rest);
                        }
                      }}
                      placeholder="10-digit mobile number"
                      className="w-full h-9 pl-10 pr-2.5 bg-[#FAF9F5] border border-[#2C241B]/15 rounded-[3px] focus:outline-none focus:border-[#2C241B] text-xs text-[#2C241B] placeholder-[#2C241B]/40"
                    />
                  </div>
                  {checkoutErrors.mobileNumber && (
                    <p className="text-[10px] text-red-600 mt-0.5">{checkoutErrors.mobileNumber}</p>
                  )}
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[1px] font-semibold text-[#2C241B] mb-0.5">
                    Email Address <span className="text-[#2C241B]/45 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    placeholder="name@email.com"
                    className="w-full h-9 px-2.5 bg-[#FAF9F5] border border-[#2C241B]/15 rounded-[3px] focus:outline-none focus:border-[#2C241B] text-xs text-[#2C241B] placeholder-[#2C241B]/40"
                  />
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[1px] font-semibold text-[#2C241B] mb-0.5">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    value={checkoutForm.streetAddress}
                    onChange={(e) => {
                      setCheckoutForm({ ...checkoutForm, streetAddress: e.target.value });
                      if (checkoutErrors.streetAddress) {
                        const { streetAddress, ...rest } = checkoutErrors;
                        setCheckoutErrors(rest);
                      }
                    }}
                    rows={1}
                    placeholder="House/Plot No, Street, Landmark, Area"
                    className="w-full h-11 py-1.5 px-2.5 bg-[#FAF9F5] border border-[#2C241B]/15 rounded-[3px] focus:outline-none focus:border-[#2C241B] text-xs text-[#2C241B] placeholder-[#2C241B]/40 resize-none"
                  />
                  {checkoutErrors.streetAddress && (
                    <p className="text-[10px] text-red-600 mt-0.5">{checkoutErrors.streetAddress}</p>
                  )}
                </div>

                {/* PIN Code & City */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[1px] font-semibold text-[#2C241B] mb-0.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={checkoutForm.zipCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setCheckoutForm({ ...checkoutForm, zipCode: val });
                        if (checkoutErrors.zipCode) {
                          const { zipCode, ...rest } = checkoutErrors;
                          setCheckoutErrors(rest);
                        }
                      }}
                      placeholder="6-digit PIN"
                      className="w-full h-9 px-2.5 bg-[#FAF9F5] border border-[#2C241B]/15 rounded-[3px] focus:outline-none focus:border-[#2C241B] text-xs text-[#2C241B] placeholder-[#2C241B]/40"
                    />
                    {checkoutErrors.zipCode && (
                      <p className="text-[10px] text-red-600 mt-0.5">{checkoutErrors.zipCode}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[1px] font-semibold text-[#2C241B] mb-0.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.city}
                      onChange={(e) => {
                        setCheckoutForm({ ...checkoutForm, city: e.target.value });
                        if (checkoutErrors.city) {
                          const { city, ...rest } = checkoutErrors;
                          setCheckoutErrors(rest);
                        }
                      }}
                      placeholder="e.g. Nagpur"
                      className="w-full h-9 px-2.5 bg-[#FAF9F5] border border-[#2C241B]/15 rounded-[3px] focus:outline-none focus:border-[#2C241B] text-xs text-[#2C241B] placeholder-[#2C241B]/40"
                    />
                    {checkoutErrors.city && (
                      <p className="text-[10px] text-red-600 mt-0.5">{checkoutErrors.city}</p>
                    )}
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="border border-[#2C241B]/10 p-2.5 rounded-[3px] bg-[#FDFDFB] text-left">
                  <span className="block text-[9px] uppercase tracking-[1px] font-semibold text-[#2C241B] mb-1.5">
                    Promo Code
                  </span>
                  
                  {!appliedCoupon ? (
                    <div className="flex gap-2 items-stretch w-full">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="ENTER COUPON CODE"
                        className="flex-grow min-w-0 bg-[#FAF9F5] border border-[#2C241B]/15 rounded-[3px] px-2.5 text-[9px] text-[#2C241B] placeholder-[#2C241B]/40 focus:outline-none focus:border-[#2C241B] uppercase font-medium tracking-wide h-8"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        className="bg-[#2C241B] hover:bg-black text-[9px] text-white px-3 font-bold uppercase tracking-wider rounded-[3px] shrink-0 flex items-center justify-center transition-colors h-8"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2.5 bg-[#E8F8EE] border border-[#3ECF6A]/20 px-2 py-1 rounded-[3px]">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-[#1E7E34] truncate">
                          ✓ Applied: {appliedCoupon}
                        </span>
                        <span className="text-[8px] text-[#1E7E34] font-medium uppercase tracking-wide text-left">
                          {(currentCoupon === "VIPCLUB60" || currentCoupon === "VIBCLUB60") ? "60% OFF ON MRP SUCCESSFULLY APPLIED" : "50% OFF ON MRP SUCCESSFULLY APPLIED"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            sessionStorage.setItem('coupon_removed', 'true');
                          } catch (e) {}
                          useStore.getState().applyCoupon(null);
                          setAppliedCoupon(null);
                          setCouponInput("");
                          setCouponMsg("");
                          setCouponError(false);
                        }}
                        className="text-[9px] font-bold text-red-600 uppercase tracking-wider hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-red-600 text-[10px] mt-1 text-left font-medium">✗ Invalid Coupon Code</p>
                  )}
                </div>

                {/* Pricing Summary Breakdown */}
                <div className="space-y-1.5 border-t border-[#2C241B]/10 pt-2.5 text-[10px] font-medium text-[#2C241B]/70 font-sans text-left pb-1">
                  <div className="flex justify-between">
                    <span>MRP Total</span>
                    <span className="text-[#2C241B] font-bold">{formatPrice(mrpPrice * quantity)}</span>
                  </div>

                  {currentCoupon === "VIP50" && (
                    <div className="flex justify-between text-[#1E7E34]">
                      <span>VIP50 Applied</span>
                      <span className="font-bold">-{formatPrice(Math.round(mrpPrice * 0.50) * quantity)}</span>
                    </div>
                  )}

                  {(currentCoupon === "VIPCLUB60" || currentCoupon === "VIBCLUB60") && (
                    <div className="flex justify-between text-[#1E7E34]">
                      <span>VIPCLUB60 Applied</span>
                      <span className="font-bold">-{formatPrice(Math.round(mrpPrice * 0.60) * quantity)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#1E7E34] font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST & All Taxes Included</span>
                    <span className="text-[#2C241B]/45 font-medium">Included</span>
                  </div>
                  <div className="pt-2 border-t border-[#2C241B]/10 flex justify-between items-center gap-2">
                    <span className="text-[10px] font-serif text-[#2C241B] font-normal">Grand Total</span>
                    <span className="text-xs sm:text-sm font-bold text-[#2C241B]">{formatPrice(finalPrice * quantity)}</span>
                  </div>
                </div>

                {/* General errors */}
                {checkoutErrors.general && (
                  <div className="bg-red-50 text-red-700 text-xs p-2 rounded border border-red-100 font-medium">
                    {checkoutErrors.general}
                  </div>
                )}
              </div>

              {/* Sticky/Fixed Footer with buttons */}
              <div className="shrink-0 bg-[#FAF9F5] border-t border-[#2C241B]/10 p-3 sm:px-6 sm:py-3.5">
                {/* Multi-payment Action Buttons */}
                <div className="grid grid-cols-2 gap-2 font-sans-serif">
                  <button
                    type="button"
                    disabled={isSubmittingOrder}
                    onClick={() => handleBuyNowPayment("cod")}
                    className="w-full h-11 bg-[#2C241B]/10 hover:bg-[#2C241B]/15 text-[#2C241B] tracking-[1px] font-bold text-[10px] uppercase transition-all rounded-[3px] active:scale-[0.99] flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 border border-[#2C241B]/15"
                  >
                    {isSubmittingOrder ? "..." : "Cash on Delivery"}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingOrder}
                    onClick={() => handleBuyNowPayment("online")}
                    className="w-full h-11 bg-[#C9A84C] text-white hover:bg-[#b0913c] tracking-[1px] font-bold text-[10px] uppercase transition-all rounded-[3px] active:scale-[0.99] flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    {isSubmittingOrder ? (
                      <span className="flex items-center gap-1 text-[9px] lowercase font-normal">
                        <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        opening...
                      </span>
                    ) : (
                      "Pay Online (UPI)"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showCheckout && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:9999,
          display:'flex',alignItems:'flex-end'}} onClick={()=>setShowCheckout(false)}>
          <div style={{background:'#fff',width:'100%',borderRadius:'20px 20px 0 0',
            padding:'24px 20px 40px', maxWidth:'500px', margin:'0 auto', position:'relative', fontFamily:'sans-serif'}} onClick={e=>e.stopPropagation()}>
            
            {/* Small drag bar to look like native bottom sheet */}
            <div style={{ width: '40px', height: '4px', background: '#e0e0e0', borderRadius: '2px', margin: '0 auto 16px', cursor: 'pointer' }} onClick={() => setShowCheckout(false)} />
            
            {/* Close button */}
            <button onClick={() => setShowCheckout(false)} style={{ position: 'absolute', right: '20px', top: '20px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>

            {submitted ? (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:'48px'}}>✅</div>
                <h3 style={{ fontFamily: 'serif', fontSize: '20px', color: '#1A0A00', marginTop: '12px' }}>Order Placed!</h3>
                <p style={{ color: '#555', fontSize: '14px', marginTop: '8px' }}>We'll call you within 24 hours to confirm your COD order.</p>
              </div>
            ) : (
              <>
                <h3 style={{marginBottom:'16px', fontFamily: 'serif', fontSize: '18px', color: '#1A0A00', paddingRight: '24px'}}>Place COD Order — {product?.name}</h3>
                <p style={{color:'#c8960a',fontWeight:'700',marginBottom:'16px', fontSize: '15px'}}>
                  ₹{finalPrice} — Cash on Delivery
                </p>
                <input placeholder="Full Name *" value={form.name}
                  onChange={e=>setForm({...form,name:e.target.value})}
                  style={{width:'100%',padding:'12px',border:'1px solid #ddd',
                    borderRadius:'8px',marginBottom:'12px',fontSize:'14px', outline: 'none'}} />
                <input placeholder="WhatsApp Number * (10 digits)" 
                  value={form.phone} type="tel"
                  onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,'').slice(0,10)})}
                  style={{width:'100%',padding:'12px',border:'1px solid #ddd',
                    borderRadius:'8px',marginBottom:'12px',fontSize:'14px', outline: 'none'}} />
                <input placeholder="Delivery Address *"
                  value={form.address||''}
                  onChange={e=>setForm({...form,address:e.target.value})}
                  style={{width:'100%',padding:'12px',border:'1px solid #ddd',
                    borderRadius:'8px',marginBottom:'16px',fontSize:'14px', outline: 'none'}} />
                <button disabled={submitting}
                  onClick={async()=>{
                    if(!form.name.trim()||!form.phone.trim()||!form.address.trim()) return alert('Fill all fields')
                    if(form.phone.trim().length !== 10) return alert('Enter a valid 10-digit phone number')
                    setSubmitting(true)
                    try {
                      await fetch(import.meta.env.VITE_SHEETS_WEBHOOK_URL || '', {
                        method:'POST', mode:'no-cors',
                        headers:{'Content-Type':'application/json'},
                        body: JSON.stringify({
                          name: form.name, phone: form.phone,
                          address: form.address, size: selectedSize || 'Standard',
                          product: product?.name, amount: finalPrice,
                          type: 'COD_ORDER',
                          timestamp: new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})
                        })
                      });
                    } catch (err) {
                      console.error("Sheets webhook failed:", err);
                    }
                    setSubmitting(false)
                    setSubmitted(true)
                  }}
                  style={{width:'100%',background:'#1A0A00',color:'#f0b429',
                    padding:'14px',borderRadius:'8px',fontWeight:'700',
                    fontSize:'15px',border:'none',cursor:'pointer'}}>
                  {submitting ? 'Placing Order...' : 'Confirm COD Order →'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
