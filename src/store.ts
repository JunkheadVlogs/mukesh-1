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
  category: 'Sarees' | 'Co-Ord Sets';
  fabric: string;
  color: string;
  isNew?: boolean;
  isTrending?: boolean;
  isBestSelling?: boolean;
  slug: string;
  description: string;
  rating: number;
  reviews?: Review[];
  availableSizes?: string[];
}

interface CartItem extends Product {
  quantity: number;
  size?: string;
}

interface AppState {
  cart: CartItem[];
  wishlist: string[];
  reviews: Review[];
  user: null | { name: string; email: string };
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, size: string | undefined, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'notHelpful'>) => void;
  voteReview: (reviewId: string, type: 'helpful' | 'notHelpful') => void;
  login: (name: string, email: string) => void;
  logout: () => void;
  cartTotal: () => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      reviews: [
        {
          id: 'rev1',
          productId: 'p4',
          userName: 'Anjali Sharma',
          rating: 5,
          comment: 'The cotton co-ord set is of exceptional quality. The embroidery is even more beautiful in person. Worth every rupee!',
          date: '2024-03-15T10:30:00Z',
          helpful: 12,
          notHelpful: 0
        },
        {
          id: 'rev2',
          productId: 'p4',
          userName: 'Priya Verma',
          rating: 4,
          comment: 'Beautiful co-ord set, very lightweight and comfortable. The fit is perfect.',
          date: '2024-03-20T14:45:00Z',
          helpful: 8,
          notHelpful: 1
        }
      ],
      user: null,
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
      addReview: (review) => {
        set((state) => ({
          reviews: [
            ...state.reviews,
            {
              ...review,
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString(),
              helpful: 0,
              notHelpful: 0,
            },
          ],
        }));
      },
      voteReview: (reviewId, type) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId
              ? { ...r, [type]: r[type] + 1 }
              : r
          ),
        }));
      },
      login: (name, email) => set({ user: { name, email } }),
      logout: () => set({ user: null }),
      cartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'mukesh-saree-storage',
    }
  )
);
