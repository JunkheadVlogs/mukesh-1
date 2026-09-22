import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeLocalStorage } from './utils/safeStorage';

export interface Review {
  id: string;
  productId?: string;
  author?: string;
  userName?: string;
  rating: number;
  comment?: string;
  text?: string;
  date: string;
  helpful?: number;
  notHelpful?: number;
  verified?: boolean;
}

export interface ColorVariant {
  color: string;
  image: string;
  slug: string;
}

export interface Product {
  id: string;
  sku?: string;
  codAvailable?: boolean;
  name: string;
  tagline?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  videoUrl?: string;
  category: 'Sarees' | string;
  fabric: string;
  color: string;
  colorVariants?: ColorVariant[];
  isNew?: boolean;
  isTrending?: boolean;
  isBestSelling?: boolean;
  isVariant?: boolean;
  isHidden?: boolean;
  slug: string;
  oldSlug?: string;
  metaTitle?: string;
  metaDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  description: string;
  rating: number;
  reviewsCount?: number;
  reviews?: Review[];
  enableUrgency?: boolean;
  noCareInstructions?: boolean;
  availableSizes?: string[];
  stock?: number;
  keywords?: string;
  blouseDetails?: string;
  faqs?: { question: string; answer: string }[];
}

interface CartItem extends Product {
  quantity: number;
  size?: string;
}

interface AppState {
  cart: CartItem[];
  wishlist: string[];
  appliedCoupon: string | null;
  isCheckoutActive: boolean;
  inventory?: Record<string, number>;
  setCheckoutActive: (active: boolean) => void;
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, size: string | undefined, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  cartTotal: () => number;
  applyCoupon: (code: string | null) => void;
  getStock: (skuOrId: string, defaultStock?: number) => number;
  reduceStock: (skuOrId: string, quantity?: number) => void;
  setStock: (skuOrId: string, stock: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      appliedCoupon: 'VIP50',
      isCheckoutActive: false,
      setCheckoutActive: (active: boolean) => set({ isCheckoutActive: active }),
      addToCart: (product, size, quantity = 1) => {
        set((state) => {
          const newState = { appliedCoupon: state.appliedCoupon, cart: state.cart };
          
          const existingItem = state.cart.find(
            (item) => item.id === product.id && item.size === size
          );
          if (existingItem) {
             newState.cart = state.cart.map((item) =>
                item.id === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );
          } else {
             newState.cart = [...state.cart, { ...product, quantity, size }];
          }
          return newState;
        });
      },
      removeFromCart: (productId, size) => {
        set((state) => ({
          cart: state.cart.filter((item) => !(item.id === productId && item.size === size)),
        }));
      },
      updateQuantity: (productId, size, qty) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId && item.size === size
              ? { ...item, quantity: Math.max(1, qty) }
              : item
          ),
        }));
      },
      clearCart: () => set({ cart: [], appliedCoupon: 'VIP50' }),
      toggleWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        }));
      },
      cartTotal: () => {
        const state = get();
        const activeCoupon = state.appliedCoupon ? state.appliedCoupon.trim().toUpperCase() : 'VIP50';
        const discountRate = (activeCoupon === 'VIPCLUB60' || activeCoupon === 'VIP60' || activeCoupon === 'VIBCLUB60') ? 0.60 : 0.50;
        
        return state.cart.reduce((total, item) => {
          const mrp = item.originalPrice || item.price * 2;
          const standardCalculatedPrice = mrp - Math.round(mrp * discountRate);
          // For items with a custom promotional price like SAR-LIN-BRD-062, respect item.price if lower
          const calculatedPrice = (item.codAvailable === false || item.sku === 'SAR-LIN-BRD-062')
            ? item.price
            : standardCalculatedPrice;
          return total + calculatedPrice * item.quantity;
        }, 0);
      },
      applyCoupon: (code) => set({ appliedCoupon: code }),
      inventory: {
        'SAR-LIN-BRD-062': 9,
      },
      getStock: (skuOrId: string, defaultStock?: number) => {
        const state = get();
        const currentInv = state.inventory || {};
        if (typeof currentInv[skuOrId] === 'number') {
          return currentInv[skuOrId];
        }
        if (defaultStock !== undefined) {
          return defaultStock;
        }
        return skuOrId === 'SAR-LIN-BRD-062' ? 9 : 9;
      },
      reduceStock: (skuOrId: string, quantity = 1) => {
        set((state) => {
          const inv = state.inventory ? { ...state.inventory } : {};
          const current = typeof inv[skuOrId] === 'number'
            ? inv[skuOrId]
            : (skuOrId === 'SAR-LIN-BRD-062' ? 9 : 9);
          const nextStock = Math.max(0, current - quantity);
          return {
            inventory: {
              ...inv,
              [skuOrId]: nextStock,
            },
          };
        });
      },
      setStock: (skuOrId: string, stock: number) => {
        set((state) => ({
          inventory: {
            ...(state.inventory || {}),
            [skuOrId]: Math.max(0, stock),
          },
        }));
      },
    }),
    {
      name: 'mukesh-saree-storage',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        appliedCoupon: state.appliedCoupon,
        inventory: state.inventory,
      }),
    }
  )
);
