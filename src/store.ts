import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  notHelpful: number;
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  videoUrl?: string;
  category: 'Sarees' | 'Co-Ord Sets';
  fabric: string;
  color: string;
  isNew?: boolean;
  isTrending?: boolean;
  isBestSelling?: boolean;
  slug: string;
  description: string;
  rating: number;
  availableSizes?: string[];
}

interface CartItem extends Product {
  quantity: number;
  size?: string;
}

interface AppState {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, size: string | undefined, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  cartTotal: () => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      addToCart: (product, size, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id && item.size === size
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity, size }] };
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
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        }));
      },
      cartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'mukesh-saree-storage',
    }
  )
);
