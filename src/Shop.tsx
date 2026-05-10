import type { ChangeEvent } from 'react';
import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Filter, ChevronDown, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { products } from './mockData';
import { formatPrice, optimizeImage } from './utils';
import { ProductCard } from './components/ProductCard';
import { Product, useStore } from './store';
import QuickViewModal from './QuickViewModal';
import { SEO } from './components/SEO';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const fabricFilter = searchParams.get('fabric')?.split(',') || [];
  const colorFilter = searchParams.get('color')?.split(',') || [];
  const priceRangeFilter = searchParams.get('priceRange');
  const sortParam = searchParams.get('sort');
  const searchQuery = searchParams.get('search');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addToCart } = useStore();

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => !p.isVariant);

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        p.fabric.toLowerCase().includes(query)
      );
    }

    // Filter
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (fabricFilter.length > 0) {
      result = result.filter(p => 
        fabricFilter.some(f => p.fabric.toLowerCase().includes(f.toLowerCase()))
      );
    }

    if (colorFilter.length > 0) {
      result = result.filter(p => 
        colorFilter.some(c => p.color.toLowerCase() === c.toLowerCase())
      );
    }

    if (priceRangeFilter) {
      const parts = priceRangeFilter.split('-');
      if (parts.length === 2) {
        const minVal = parseInt(parts[0], 10) || 0;
        const maxVal = parts[1] ? parseInt(parts[1], 10) : Infinity;
        result = result.filter(p => p.price >= minVal && p.price <= maxVal);
      }
    }

    // Sort
    switch (sortParam) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'new':
        result.sort((a, b) => {
          if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
          const aIndex = products.findIndex(p => p.id === a.id);
          const bIndex = products.findIndex(p => p.id === b.id);
          return bIndex - aIndex;
        });
        break;
      case 'trending':
        result.sort((a, b) => (a.isTrending === b.isTrending ? 0 : a.isTrending ? -1 : 1));
        break;
      case 'best-selling':
        result.sort((a, b) => (a.isBestSelling === b.isBestSelling ? 0 : a.isBestSelling ? -1 : 1));
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [categoryFilter, fabricFilter, colorFilter, sortParam, searchQuery, priceRangeFilter]);

  const handleCategoryChange = (cat: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat) {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set('sort', e.target.value);
    } else {
      newParams.delete('sort');
    }
    setSearchParams(newParams);
  };

  const toggleFabric = (fabric: string) => {
    const newParams = new URLSearchParams(searchParams);
    let currentFabrics = newParams.get('fabric')?.split(',') || [];
    
    if (currentFabrics.includes(fabric)) {
      currentFabrics = currentFabrics.filter(f => f !== fabric);
    } else {
      currentFabrics.push(fabric);
    }

    if (currentFabrics.length > 0) {
      newParams.set('fabric', currentFabrics.join(','));
    } else {
      newParams.delete('fabric');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    if (sortParam) newParams.set('sort', sortParam);
    setSearchParams(newParams);
  };

  const baseFabrics = ['Silk', 'Organza', 'Crepe', 'Satin', 'Cotton'];
  const uniqueColors = Array.from(new Set(products.map(p => p.color)));

  return (
    <div className="bg-primary-50">
      <SEO 
        title={`${searchQuery ? `Search results for ${searchQuery}` : (categoryFilter ? `${categoryFilter} Collection` : 'Shop Our Collection')} | Mukesh Saree Centre`}
        description="Browse the latest trends in sarees and co-ord sets at Mukesh Saree Centre. Premium ethnic wear at deals you can't miss."
        url={searchQuery ? `/shop?search=${encodeURIComponent(searchQuery)}` : (categoryFilter ? `/shop?category=${encodeURIComponent(categoryFilter)}` : `/shop`)}
      />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-12 pt-[20px] md:pt-8 pb-12 mt-0 w-full" style={{ minHeight: "auto" }}>
        <header className="mb-8 md:mb-12 border-b border-black/5 pb-6 md:pb-8" style={{ overflow: "visible" }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl md:text-5xl font-serif text-primary-950 font-semibold tracking-[1px]" style={{ lineHeight: 1.2 }}>
                {searchQuery ? `Results for "${searchQuery}"` : (categoryFilter || 'Shop All')}
              </h1>
              <p className="text-primary-950/50 text-sm mt-3 md:text-base font-sans font-medium">
                {filteredAndSortedProducts.length} items found
              </p>
            </div>
            
            <div className="flex flex-row items-center gap-2 sm:gap-4 w-full md:w-auto mt-2 md:mt-0">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex-1 md:flex-none flex justify-center items-center gap-2 bg-white border border-black/5 px-4 py-3 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm"
              >
                <Filter size={16} /> Filters
              </button>
              
              <div className="relative group flex-1 md:flex-none">
                <select 
                  className="w-full bg-white border border-black/5 px-4 py-3 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm outline-none cursor-pointer focus:ring-1 focus:ring-gold-500 appearance-none min-w-[140px] md:min-w-[160px]"
                  value={sortParam || ''}
                  onChange={handleSortChange}
                >
                  <option value="">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="new">Newest First</option>
                  <option value="trending">Trending Now</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-950/20 pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Mobile Filter Backdrop */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-[60] lg:hidden backdrop-blur-sm"
                onClick={() => setIsFilterOpen(false)}
              />
            )}
          </AnimatePresence>
          
          {/* Sidebar Filters */}
          <aside className={`
            fixed lg:relative inset-y-0 left-0 w-[280px] lg:w-64 bg-white lg:bg-transparent z-[70] lg:z-0
            transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-transform duration-300 ease-in-out p-8 lg:p-0 overflow-y-auto lg:overflow-visible
            shadow-2xl lg:shadow-none
          `}>
            <div className="flex items-center justify-between lg:hidden mb-8">
              <h2 className="text-xl font-serif font-semibold tracking-[1px]">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
            </div>

            <div className="space-y-10">
              {/* Category */}
              <section>
                <h3 className="text-[10px] uppercase tracking-[2px] font-bold text-primary-950/30 mb-6">Category</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { name: 'All Collection', value: null },
                    { name: 'Sarees', value: 'Sarees' },
                    { name: 'Co-Ord Sets', value: 'Co-Ord Sets' }
                  ].map((cat) => (
                    <button 
                      key={cat.name}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`text-left text-sm font-medium transition-all ${(!categoryFilter && cat.value === null) || (categoryFilter === cat.value) ? 'text-gold-600 font-bold' : 'text-primary-950/60 hover:text-primary-950'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Fabric */}
              <section>
                <h3 className="text-[10px] uppercase tracking-[2px] font-bold text-primary-950/30 mb-6">Fabric</h3>
                <div className="flex flex-col gap-3">
                  {baseFabrics.map(fabric => (
                    <button 
                      key={fabric}
                      onClick={() => toggleFabric(fabric)}
                      className="flex items-center group w-full text-left gap-3"
                    >
                      <div className={`w-4 h-4 border rounded-sm transition-all ${fabricFilter.includes(fabric) ? 'bg-gold-500 border-gold-500' : 'border-black/10 group-hover:border-black/30'}`} />
                      <span className={`text-sm transition-colors ${fabricFilter.includes(fabric) ? 'text-primary-950 font-bold' : 'text-primary-950/60 group-hover:text-primary-950'}`}>
                        {fabric}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Price Range Placeholder */}
              <section>
                <h3 className="text-[10px] uppercase tracking-[2px] font-bold text-primary-950/30 mb-6">Selection Benefit</h3>
                <div className="bg-discount-bg p-4 rounded-sm border border-discount/10">
                  <p className="text-[11px] font-black font-discount text-discount uppercase tracking-widest leading-relaxed">
                    All items are 50% OFF.
                  </p>
                </div>
              </section>
            </div>
            
            <button 
              onClick={clearAllFilters}
              className="mt-12 w-full border border-black/10 py-3 text-[10px] uppercase tracking-[2px] font-bold hover:bg-black hover:text-white transition-all rounded-sm"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onQuickView={setQuickViewProduct} 
                  />
                ))}
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-black/5 rounded-sm shadow-sm">
                 <h3 className="text-xl font-serif text-primary-950 mb-4">No silhouettes found</h3>
                 <p className="text-primary-950/50 mb-8 max-w-xs px-6">
                   We couldn't find any products matching your current filters.
                 </p>
                 <button 
                  onClick={clearAllFilters} 
                  className="bg-gold-500 text-white rounded-sm shadow-md px-10 py-3 text-[10px] uppercase tracking-[2px] font-bold hover:bg-gold-600 transition-colors"
                 >
                   Reset Filters
                 </button>
               </div>
            )}
          </main>
        </div>
      </div>

      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </div>
  );
}
