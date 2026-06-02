import React from "react";
import { Landmark, ShoppingBag } from "lucide-react";

interface NavbarProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount = 0, onCartClick }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          <div className="w-10"></div> {/* Spacer for symmetry */}

          {/* Logo & Brand Name */}
          <div className="flex items-center cursor-pointer justify-center" onClick={() => window.location.href = "/"}>
            <img 
              src="https://ik.imagekit.io/tus1loev9/homepage/IMG_20260530_201904.png?updatedAt=1780152565503" 
              alt="Mukesh Saree Centre Logo" 
              className="h-14 sm:h-16 object-contain"
            />
          </div>

          <div className="flex items-center w-10 justify-end">
            <button 
              onClick={onCartClick} 
              className="relative p-2 text-gray-800 hover:text-black transition-colors"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

