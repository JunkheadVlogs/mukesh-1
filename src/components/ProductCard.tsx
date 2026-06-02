import React from "react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onViewProduct: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
}) => {
  return (
    <div 
      className="group bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
      onClick={() => onViewProduct(product.slug)}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow text-left">
        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">
          {product.category}
        </p>
        <h3 className="font-sans text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-tight flex-grow">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-base font-bold text-gray-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

