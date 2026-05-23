import { motion } from "motion/react";

export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col pointer-events-none">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-sm">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        
        {/* Placeholder for Wishlist Button */}
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/50 animate-pulse backdrop-blur-sm z-10" />
      </div>

      <div className="pt-3 pb-2 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-1">
          <div className="flex-1 w-full space-y-2">
            {/* Title Placeholder */}
            <div className="h-4 bg-gray-200 animate-pulse rounded max-w-[80%]" />
            {/* Subtitle/Category Placeholder */}
            <div className="h-3 bg-gray-200 animate-pulse rounded max-w-[60%]" />
          </div>
          {/* Price Placeholder */}
          <div className="h-4 bg-gray-200 animate-pulse rounded w-12" />
        </div>
      </div>
    </div>
  );
}
