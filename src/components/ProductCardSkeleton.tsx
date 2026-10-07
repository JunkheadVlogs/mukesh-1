export function ProductCardSkeleton() {
  return (
    <article className="h-full">
      <div className="product-card group flex flex-col h-full bg-white rounded-[18px] md:rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden pointer-events-none select-none">
        {/* Image Aspect Ratio Placeholder (3/4) */}
        <div
          className="relative aspect-[3/4] w-full overflow-hidden flex items-center justify-center p-0 flex-shrink-0"
          style={{ backgroundColor: '#FAF8F5' }}
        >
          <div className="absolute inset-0 bg-gray-200/70 animate-pulse" />
        </div>

        {/* Card Body matching exact padding and layout */}
        <div className="product-card-body flex flex-col flex-grow bg-white items-start text-left justify-between px-3 md:px-4 pb-3.5 md:pb-4 pt-3.5 md:pt-4 rounded-b-[18px] md:rounded-b-[24px]">
          {/* Title Area with reserved 2-line height */}
          <div className="flex flex-col items-start w-full mb-1.5 md:mb-2 min-h-[36px] h-[36px] justify-start gap-1">
            <div className="h-3.5 bg-gray-200 animate-pulse rounded w-[85%]" />
            <div className="h-3.5 bg-gray-200 animate-pulse rounded w-[60%]" />
          </div>

          {/* Price Row Placeholder */}
          <div className="mt-auto flex items-center justify-center gap-1.5 md:gap-2 w-full pt-1">
            <div className="h-4 sm:h-5 w-16 bg-gray-200 animate-pulse rounded shrink-0" />
            <div className="h-3.5 w-12 bg-gray-200/80 animate-pulse rounded shrink-0" />
            <div className="h-3 w-14 bg-gray-200/60 animate-pulse rounded-[4px] shrink-0" />
          </div>
        </div>
      </div>
    </article>
  );
}
