import type { ChangeEvent } from 'react';
import { useState, useMemo, lazy, Suspense } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Filter, ChevronDown, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { products } from './mockData';
import { formatPrice, optimizeImage } from './utils';
import { ProductCard } from './components/ProductCard';
import { Product, useStore } from './store';

const QuickViewModal = lazy(() => import('./QuickViewModal'));

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const fabricFilter = searchParams.get('fabric')?.split(',') || [];
  const colorFilter = searchParams.get('color')?.split(',') || [];
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
  }, [categoryFilter, fabricFilter, colorFilter, sortParam, searchQuery]);

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

  const toggleColor = (color: string) => {
    const newParams = new URLSearchParams(searchParams);
    let currentColors = newParams.get('color')?.split(',') || [];
    
    if (currentColors.some(c => c.toLowerCase() === color.toLowerCase())) {
      currentColors = currentColors.filter(c => c.toLowerCase() !== color.toLowerCase());
    } else {
      currentColors.push(color);
    }

    if (currentColors.length > 0) {
      newParams.set('color', currentColors.join(','));
    } else {
      newParams.delete('color');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    // Keep search and sort if they exist
    if (searchQuery) newParams.set('search', searchQuery);
    if (sortParam) newParams.set('sort', sortParam);
    setSearchParams(newParams);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const uniqueFabrics = Array.from(new Set(products.map(p => p.fabric.split(' ').pop()))); // Simplistic extractor
  const baseFabrics = ['Silk', 'Organza', 'Crepe', 'Satin', 'Cotton'];
  const uniqueColors = Array.from(new Set(products.map(p => p.color)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      {/* Header */}
      <div className="text-center mb-10 mt-2">
        <h1 className="text-2xl md:text-3xl font-serif text-primary-950 mb-4 font-normal">
          {searchQuery ? `Results for "${searchQuery}"` : (categoryFilter || 'All Collection')}
        </h1>
        {searchQuery ? (
          <button 
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('search');
              setSearchParams(newParams);
            }}
            className="text-[10px] tracking-[2px] uppercase text-gold-500 font-medium hover:underline"
          >
            Clear Search
          </button>
        ) : (
          <p className="text-primary-950/70 max-w-2xl mx-auto font-light leading-relaxed">
            Explore our handpicked curation of luxurious fabrics and modern silhouettes.
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center bg-transparent border-y border-black/5 py-4 mb-6">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center text-[11px] tracking-[2px] uppercase text-primary-950 hover:text-gold-500 transition-colors"
          >
            <Filter size={16} className="mr-2" strokeWidth={1.5} />
            Filters
          </button>
          
          <select 
            className="bg-transparent text-[11px] tracking-[2px] uppercase text-primary-950 outline-none"
            value={sortParam || ''}
            onChange={handleSortChange}
          >
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="new">New Arrivals</option>
            <option value="best-selling">Best Selling</option>
            <option value="name-az">Name: A-Z</option>
            <option value="name-za">Name: Z-A</option>
          </select>
        </div>

        {/* Sidebar Filters */}
        <div className={`lg:w-1/5 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-28 space-y-10">
            <div className="flex items-center justify-between pb-2 border-b border-black/5">
              <h3 className="text-[10px] tracking-[2px] uppercase text-primary-950/40">Filters</h3>
              {(categoryFilter || fabricFilter.length > 0 || colorFilter.length > 0) && (
                <button 
                  onClick={clearAllFilters}
                  className="text-[9px] tracking-[1px] uppercase text-gold-500 hover:underline font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            <div>
              <h3 className="text-[10px] tracking-[2px] uppercase mb-6 text-primary-950/50 pb-2 border-b border-black/5">Categories</h3>
              <ul className="space-y-4">
                <li>
                  <button 
                    onClick={() => handleCategoryChange(null)}
                    className={`text-left w-full text-[13px] tracking-[1px] hover:text-gold-500 transition-colors ${!categoryFilter ? 'text-gold-500' : 'text-primary-950'}`}
                  >
                    All Products
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleCategoryChange('Sarees')}
                    className={`text-left w-full text-[13px] tracking-[1px] hover:text-gold-500 transition-colors ${categoryFilter === 'Sarees' ? 'text-gold-500' : 'text-primary-950'}`}
                  >
                    Sarees
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleCategoryChange('Co-Ord Sets')}
                    className={`text-left w-full text-[13px] tracking-[1px] hover:text-gold-500 transition-colors ${categoryFilter === 'Co-Ord Sets' ? 'text-gold-500' : 'text-primary-950'}`}
                  >
                    Co-Ord Sets
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] tracking-[2px] uppercase mb-6 text-primary-950/50 pb-2 border-b border-black/5">Fabrics</h3>
              <ul className="space-y-3">
                {baseFabrics.map(fabric => (
                  <li key={fabric}>
                    <button 
                      onClick={() => toggleFabric(fabric)}
                      className="flex items-center group w-full text-left"
                    >
                      <div className={`w-3.5 h-3.5 border mr-3 rounded-sm flex items-center justify-center transition-colors ${fabricFilter.includes(fabric) ? 'bg-primary-950 border-primary-950' : 'border-black/20 group-hover:border-gold-500'}`}>
                        {fabricFilter.includes(fabric) && <div className="w-1.5 h-1.5 bg-primary-50 rounded-full"></div>}
                      </div>
                      <span className={`text-[13px] tracking-[1px] transition-colors ${fabricFilter.includes(fabric) ? 'text-primary-950 font-medium' : 'text-primary-950/60 hover:text-gold-500'}`}>
                        {fabric}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] tracking-[2px] uppercase mb-6 text-primary-950/50 pb-2 border-b border-black/5">Colors</h3>
              <div className="flex flex-wrap gap-3">
                {uniqueColors.map(color => {
                  const isSelected = colorFilter.some(c => c.toLowerCase() === color.toLowerCase());
                  return (
                    <button 
                      key={color}
                      onClick={() => toggleColor(color)}
                      title={color}
                      className={`w-8 h-8 rounded-full border border-black/10 transition-all transform hover:scale-110 ${isSelected ? 'ring-2 ring-gold-500 ring-offset-2' : ''}`}
                      style={{ backgroundColor: color.toLowerCase() === 'ivory' ? '#FFFFF0' : color.toLowerCase() === 'beige' ? '#F5F5DC' : color.toLowerCase() }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:w-4/5">
          <div className="hidden lg:flex justify-between items-center mb-8 pb-4">
            <span className="text-[12px] tracking-[1px] uppercase text-primary-950/50">{filteredAndSortedProducts.length} Results</span>
            <div className="flex items-center">
              <span className="mr-3 text-[10px] uppercase tracking-[2px] text-primary-950/50">Sort by:</span>
              <div className="relative">
                <select 
                  className="appearance-none bg-transparent border-b border-black/10 text-primary-950 py-1 pl-1 pr-6 hover:border-gold-500 focus:outline-none focus:border-gold-500 text-[12px] uppercase tracking-[1px] cursor-pointer transition-colors"
                  value={sortParam || ''}
                  onChange={handleSortChange}
                >
                  <option value="">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="new">New Arrivals</option>
                  <option value="trending">Trending</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="name-az">Name: A-Z</option>
                  <option value="name-za">Name: Z-A</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary-950">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-16 lg:gap-x-12 lg:gap-y-20">
              {filteredAndSortedProducts.map((product, idx) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  idx={idx} 
                  onQuickView={setQuickViewProduct} 
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-20">
               <h3 className="text-2xl font-serif text-primary-900 mb-2">No products found</h3>
               <p className="text-primary-600">Try adjusting your filters to find what you're looking for.</p>
             </div>
          )}
        </div>
      </div>


      <Suspense fallback={null}>
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      </Suspense>
    </div>
  );
}
