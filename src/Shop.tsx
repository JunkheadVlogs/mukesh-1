import type { ChangeEvent } from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router";
import { Filter, ChevronDown, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { products } from "./mockData";
import { formatPrice, optimizeImage } from "./utils";
import { searchProducts } from "./services/search";
import { ProductCard } from "./components/ProductCard";
import { ProductCardSkeleton } from "./components/ProductCardSkeleton";
import { Product, useStore } from "./store";
import QuickViewModal from "./QuickViewModal";
import { SEO } from "./components/SEO";
import { trackViewItemList } from "./tracking";

const categoryDescriptions = {
  "linen-sarees": {
    title: "Buy Linen Sarees Online | Mukesh Saree Centre Nagpur",
    metaDescription: "Shop premium linen sarees online at Mukesh Saree Centre. Lightweight, breathable, and perfect for everyday wear. Cash on Delivery. Free shipping above ₹499.",
    heading: "Linen Sarees — Light, Elegant & Perfect for Daily Wear",
    description: "Linen sarees are loved for their breathable fabric and natural texture. At Mukesh Saree Centre, our linen saree collection features beautiful prints and solid colours perfect for office wear, casual outings, and festive occasions. Sourced from top weavers, every linen saree in our collection is soft, durable, and elegantly crafted. Shop online with Cash on Delivery across India."
  },
  "paithani-sarees": {
    title: "Paithani Sarees Online | Mukesh Saree Centre Nagpur",
    metaDescription: "Buy authentic Paithani sarees from Mukesh Saree Centre, Nagpur. Maharashtra's heritage weave with zari work and peacock motifs. COD available.",
    heading: "Paithani Sarees — Maharashtra's Royal Heritage Weave",
    description: "Paithani sarees are the pride of Maharashtra, known for their rich zari borders, vibrant silk body, and iconic peacock and lotus motifs. At Mukesh Saree Centre, we carry authentic Paithani sarees sourced from skilled weavers, perfect for weddings, festivals, and cultural occasions. Each Paithani is a work of art that carries centuries of tradition. Available online with Cash on Delivery across India."
  },
  "banarasi-sarees": {
    title: "Banarasi Sarees Online | Mukesh Saree Centre Nagpur",
    metaDescription: "Shop Banarasi silk sarees at Mukesh Saree Centre. Pure silk, georgette, and satin Banarasi weaves for weddings and festivals. COD & Free Shipping.",
    heading: "Banarasi Sarees — The Gold Standard of Indian Bridal Wear",
    description: "Banarasi sarees from Varanasi are the most sought-after bridal sarees in India. Known for their opulent zari work, intricate brocade patterns, and lustrous silk, these sarees are perfect for weddings, receptions, and grand celebrations. Our collection includes pure silk Banarasi, georgette Banarasi, and satin Banarasi in a range of colours. Shop online with free shipping above ₹499 and Cash on Delivery."
  },
  "silk-sarees": {
    title: "Silk Sarees Online | Mukesh Saree Centre Nagpur",
    metaDescription: "Buy pure silk sarees online — Kanjivaram, soft silk, art silk and more at Mukesh Saree Centre Nagpur. COD. Free shipping above ₹499.",
    heading: "Silk Sarees — Timeless Elegance for Every Occasion",
    description: "Silk sarees are a wardrobe essential for every Indian woman. Our silk collection includes Kanjivaram, pure silk, soft silk, art silk, and Upada silk — each handpicked from the finest weaving centres in India. Whether you are dressing for a wedding, puja, or family celebration, our silk sarees offer richness, sheen, and grace that is unmatched. Available online with Cash on Delivery all across India."
  },
  "cotton-sarees": {
    title: "Cotton Sarees Online | Mukesh Saree Centre Nagpur",
    metaDescription: "Shop handloom and printed cotton sarees at Mukesh Saree Centre. Comfortable, everyday sarees in beautiful designs. COD available.",
    heading: "Cotton Sarees — Comfortable, Stylish & Made for Every Day",
    description: "Cotton sarees are the most comfortable and versatile sarees you can own. Our cotton saree collection covers mulmul cotton, handloom cotton, printed cotton, and pure cotton in a wide range of designs, colours, and patterns. These sarees are perfect for daily wear, office, and casual occasions. Lightweight and easy to drape, cotton sarees from Mukesh Saree Centre combine comfort with timeless Indian style."
  }
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategoryFilter = searchParams.get("category");
  
  const path = window.location.pathname.toLowerCase();
  
  const { categoryFilter, fabricFilter } = useMemo(() => {
    let cat = rawCategoryFilter === "Co-Ord-Sets" ? "Co-Ord Sets" : rawCategoryFilter;
    let fabs = searchParams.get("fabric") ? (searchParams.get("fabric") || "").split(",") : [];

    if (!cat) {
      if (path.includes("/sarees")) {
        cat = "Sarees";
        if (path.includes("linen-sarees")) {
          fabs = ["Linen"];
        } else if (path.includes("paithani-sarees")) {
          fabs = ["Paithani"];
        } else if (path.includes("banarasi-sarees")) {
          fabs = ["Banarasi"];
        } else if (path.includes("silk-sarees")) {
          fabs = ["Silk"];
        } else if (path.includes("cotton-sarees")) {
          fabs = ["Cotton"];
        }
      } else if (path.includes("/lehengas")) {
        cat = "Lehengas";
      } else if (path.includes("/suits")) {
        cat = "Kurtas";
      } else if (path.includes("/coord-sets")) {
        cat = "Co-Ord Sets";
      }
    }

    return { categoryFilter: cat, fabricFilter: fabs };
  }, [rawCategoryFilter, searchParams, path]);

  const colorParam = searchParams.get("color") || "";
  const colorFilter = useMemo(() => colorParam ? colorParam.split(",") : [], [colorParam]);
  const priceRangeFilter = searchParams.get("priceRange");
  const sortParam = searchParams.get("sort");
  const searchQuery = searchParams.get("search") || searchParams.get("q");

  const fabricParam = searchParams.get("fabric") || "";

  const activeSEOKey = useMemo(() => {
    const path = window.location.pathname.toLowerCase();
    for (const key of Object.keys(categoryDescriptions)) {
      if (path.includes(key)) {
        return key as keyof typeof categoryDescriptions;
      }
    }

    if (categoryFilter) {
      const normalizedQueryCat = categoryFilter.toLowerCase().trim().replace(/[\s_]+/g, "-");
      
      if (normalizedQueryCat === "linen-sarees" || normalizedQueryCat === "linen") {
        return "linen-sarees";
      }
      if (normalizedQueryCat === "paithani-sarees" || normalizedQueryCat === "paithani") {
        return "paithani-sarees";
      }
      if (normalizedQueryCat === "banarasi-sarees" || normalizedQueryCat === "banarasi") {
        return "banarasi-sarees";
      }
      if (normalizedQueryCat === "silk-sarees" || normalizedQueryCat === "silk") {
        return "silk-sarees";
      }
      if (normalizedQueryCat === "cotton-sarees" || normalizedQueryCat === "cotton") {
        return "cotton-sarees";
      }
      
      if (normalizedQueryCat in categoryDescriptions) {
        return normalizedQueryCat as keyof typeof categoryDescriptions;
      }
    }

    if (!categoryFilter || categoryFilter === "Sarees") {
      if (fabricFilter.length === 1) {
        const fab = fabricFilter[0].toLowerCase();
        if (fab === "linen") return "linen-sarees";
        if (fab === "paithani") return "paithani-sarees";
        if (fab === "banarasi") return "banarasi-sarees";
        if (fab === "silk") return "silk-sarees";
        if (fab === "cotton") return "cotton-sarees";
      }
    }

    return null;
  }, [categoryFilter, fabricFilter]);

  const seoData = useMemo(() => {
    if (activeSEOKey && categoryDescriptions[activeSEOKey]) {
      const match = categoryDescriptions[activeSEOKey];
      return {
        title: match.title,
        description: match.metaDescription,
        heading: match.heading,
        paragraph: match.description
      };
    }

    const cat = categoryFilter || "";
    if (cat === "Sarees" || cat === "Linen Sarees") {
      return {
        title: "Buy Sarees Online | Mukesh Saree Centre Nagpur — Paithani, Banarasi, Silk, Linen",
        description: "Shop 100+ saree styles online at Mukesh Saree Centre, Nagpur. Paithani, Banarasi, Kanjivaram, linen, cotton, silk & more. Cash on Delivery. Free shipping above ₹499.",
        heading: "Saree Collection — Elegant & Exquisite Weaves",
        paragraph: "Sarees are the soul of Indian ethnic fashion, embodying timeless grace and cultural pride. At Mukesh Saree Centre, our curated collection brings you authentic weaves and designs ranging from lightweight cotton and modern printed linens to royal silk katan Banarasis and intricate handloom Paithanis. Sourced directly from premier weaving centers, each saree in our collection showcases unparalleled craftsmanship, soft premium fabrics, and rich colors. Enjoy a seamless online shopping experience with free shipping above ₹499 and reliable Cash on Delivery service anywhere in India."
      };
    }

    if (cat === "Lehengas") {
      return {
        title: "Buy Lehengas Online | Mukesh Saree Centre Nagpur — Bridal & Designer",
        description: "Browse bridal and designer lehengas at Mukesh Saree Centre, Nagpur. Beautiful embroidered and printed lehengas with Cash on Delivery. Free shipping above ₹499.",
        heading: "Bridal & Designer Lehengas — Grace, Contrast & Opulence",
        paragraph: "Step into any celebration with unmatched confidence and luxury in a premium lehenga from Mukesh Saree Centre. Our lehenga collection spans a rich variety of designs, from opulent, heavy-crafted bridal lehengas adorned with intricate zari work, hand embroidery, and premium sequins, to modern, breathable printed and georgette designer lehengas perfect for sangeet, receptions, and bridesmaid attire. Expertly selected and sized for absolute comfort and styling versatility, our lehengas deliver flawless fits and eye-catching drapes. Buy online with authentic quality guarantees, free nationwide shipping above ₹499, and easy Cash on Delivery options."
      };
    }
    
    return {
      title: categoryFilter 
        ? `Shop ${categoryFilter} Online | Mukesh Saree Centre` 
        : "Shop Sarees, Co-Ord Sets & Ethnic Wear — Mukesh Saree Centre",
      description: categoryFilter
        ? `Explore our beautiful collection of ${categoryFilter}. Cash on Delivery, free shipping above ₹499, and easy 7-day returns on orders.`
        : "Browse 50+ premium sarees, linen sarees, co-ord sets and lehengas. Cash on Delivery available. Free shipping above ₹499. Trusted since 1978.",
      heading: searchQuery
        ? `Results for "${searchQuery}"`
        : categoryFilter || "Shop All",
      paragraph: null
    };
  }, [activeSEOKey, categoryFilter, searchQuery]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useStore();

  const [page, setPage] = useState(1);
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const PER_PAGE = 12;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((p) => !p.isVariant && !p.isHidden);

    // Search
    if (searchQuery) {
      result = searchProducts(searchQuery);
    }

    // Filter
    if (categoryFilter) {
      if (categoryFilter === "Sarees") {
        result = result.filter(
          (p) => p.category === "Sarees" || p.category === "Linen Sarees",
        );
      } else {
        result = result.filter((p) => p.category === categoryFilter);
      }
    }

    if (fabricFilter.length > 0) {
      result = result.filter((p) =>
        fabricFilter.some((f) =>
          p.fabric.toLowerCase().includes(f.toLowerCase()),
        ),
      );
    }

    if (colorFilter.length > 0) {
      result = result.filter((p) =>
        colorFilter.some((c) => p.color.toLowerCase() === c.toLowerCase()),
      );
    }

    if (priceRangeFilter) {
      const parts = priceRangeFilter.split("-");
      if (parts.length === 2) {
        const minVal = parseInt(parts[0], 10) || 0;
        const maxVal = parts[1] ? parseInt(parts[1], 10) : Infinity;
        result = result.filter((p) => p.price >= minVal && p.price <= maxVal);
      }
    }

    // Sort
    const sortedResult = [...result];
    switch (sortParam) {
      case "price-low":
        sortedResult.sort((a, b) => {
          const valA = Number(a.price) || 0;
          const valB = Number(b.price) || 0;
          return valA - valB;
        });
        break;
      case "price-high":
        sortedResult.sort((a, b) => {
          const valA = Number(a.price) || 0;
          const valB = Number(b.price) || 0;
          return valB - valA;
        });
        break;
      case "new":
        sortedResult.sort((a, b) => {
          if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
          const aIndex = products.findIndex((p) => p.id === a.id);
          const bIndex = products.findIndex((p) => p.id === b.id);
          return bIndex - aIndex;
        });
        break;
      case "trending":
        sortedResult.sort((a, b) => {
          const trendA = a.isTrending ? 1 : 0;
          const trendB = b.isTrending ? 1 : 0;
          return trendB - trendA;
        });
        break;
      case "best-selling":
        sortedResult.sort((a, b) => {
          const sellA = a.isBestSelling ? 1 : 0;
          const sellB = b.isBestSelling ? 1 : 0;
          return sellB - sellA;
        });
        break;
      case "name-az":
        sortedResult.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-za":
        sortedResult.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      default:
        break;
    }

    return sortedResult;
  }, [
    categoryFilter,
    fabricParam,
    colorParam,
    sortParam,
    searchQuery,
    priceRangeFilter,
  ]);

  // Reset page when filters or search query change
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, fabricParam, colorParam, priceRangeFilter, sortParam, searchQuery]);

  // Trigger ecommerce view_item_list when filtered results change
  useEffect(() => {
    if (filteredAndSortedProducts.length > 0) {
      trackViewItemList(filteredAndSortedProducts, categoryFilter || "All Collections");
    }
  }, [filteredAndSortedProducts, categoryFilter]);

  const visible = useMemo(() => {
    return filteredAndSortedProducts.slice(0, page * PER_PAGE);
  }, [filteredAndSortedProducts, page]);

  const loadNextPage = () => {
    if (isBatchLoading || visible.length >= filteredAndSortedProducts.length) return;
    setIsBatchLoading(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsBatchLoading(false);
    }, 350);
  };

  const handleCategoryChange = (cat: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat) {
      newParams.set("category", cat === "Co-Ord Sets" ? "Co-Ord-Sets" : cat);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
    setIsFilterOpen(false); // Close mobile drawer
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set("sort", e.target.value);
    } else {
      newParams.delete("sort");
    }
    setSearchParams(newParams);
  };

  const toggleFabric = (fabric: string) => {
    const newParams = new URLSearchParams(searchParams);
    let currentFabrics = newParams.get("fabric")?.split(",") || [];

    if (currentFabrics.includes(fabric)) {
      currentFabrics = currentFabrics.filter((f) => f !== fabric);
    } else {
      currentFabrics.push(fabric);
    }

    if (currentFabrics.length > 0) {
      newParams.set("fabric", currentFabrics.join(","));
    } else {
      newParams.delete("fabric");
    }
    setSearchParams(newParams);
    setIsFilterOpen(false); // Close mobile drawer
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set("search", searchQuery);
    if (sortParam) newParams.set("sort", sortParam);
    setSearchParams(newParams);
    setIsFilterOpen(false); // Close mobile drawer
  };

  const baseFabrics = [
    "Silk",
    "Organza",
    "Crepe",
    "Satin",
    "Cotton",
    "Linen",
    "Georgette",
    "Chiffon",
    "Khadi Cotton",
  ];
  const uniqueColors = Array.from(new Set(products.filter((p) => !p.isHidden).map((p) => p.color)));

  const categoryOgImages: Record<string, string> = {
    "Sarees": "https://ik.imagekit.io/tus1loev9/homepage/saree-category.webp?updatedAt=1779907894790",
    "Linen Sarees": "https://ik.imagekit.io/tus1loev9/homepage/saree-category.webp?updatedAt=1779907894790",
    "Co-Ord Sets": "https://ik.imagekit.io/tus1loev9/homepage/coordsetcategory.webp?updatedAt=1779907895090",
    "Lehengas": "https://ik.imagekit.io/tus1loev9/homepage/lehengasection.webp?updatedAt=1779907894691",
    "default": "https://wsrv.nl/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fd%2F1NmruXVYozTPtYyuyipddgCODomwUd2me&w=1200&h=630&fit=cover&a=attention&output=jpg&q=85",
  };

  const activeCategory = categoryFilter || "default";
  const ogImageUrl = categoryOgImages[activeCategory] || categoryOgImages.default;

  const currentUrl = "https://mukeshsarees.com" + window.location.pathname + window.location.search;
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mukeshsarees.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": seoData.heading,
        "item": currentUrl
      }
    ]
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoData.title,
    "description": seoData.description,
    "url": currentUrl,
    "publisher": { "@id": "https://mukeshsarees.com/#organization" }
  };

  return (
    <div className="shop-page bg-[var(--color-bg)]">
      <SEO
        title={seoData.title}
        description={seoData.description}
        image={ogImageUrl}
        url={window.location.pathname + window.location.search}
        type="website"
        schema={[breadcrumbSchema, collectionSchema] as any}
      />

      <div
        className="shop-container max-w-[1600px] mx-auto pt-0 pb-8 mt-0 w-full"
        style={{ minHeight: "auto" }}
      >
        {/* ROW 1: Shop All Heading */}
        <div className="collection-header-wrapper" style={{ margin: "4px 0", padding: "0 8px" }}>
          <h1
            className="collection-hero__title for-seo-only font-serif text-[var(--color-dark)] tracking-wide flex items-baseline gap-2"
            style={{ fontSize: "18px", margin: "0", lineHeight: "1.2", fontWeight: "normal" }}
          >
            <span className="collection-title-text">
              {seoData.heading}
            </span>
            <span className="product-count product-count__text text-[12px] font-sans text-neutral-500 tracking-wider font-normal lowercase normal-case whitespace-nowrap">
              ({filteredAndSortedProducts.length} items)
            </span>
          </h1>
        </div>

        {/* ROW 2: Filters and Sort by Buttons */}
        <div className="controls-bar flex flex-row items-center gap-2" style={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center", margin: "0 0 2px 0", width: "100%" }}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 bg-white cursor-pointer select-none"
            style={{
              width: "fit-content",
              height: "28px",
              fontSize: "11px",
              padding: "0 10px",
              border: "1px solid #ddd",
              borderRadius: "20px",
              boxShadow: "none",
              backgroundColor: "#fff",
              fontWeight: "normal",
              color: "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Filter size={10} strokeWidth={1.5} /> Filters
          </button>

          <div className="relative" style={{ display: "flex", alignItems: "center", width: "fit-content" }}>
            <select
              className="bg-white cursor-pointer appearance-none outline-none select-none"
              style={{
                width: "fit-content",
                minWidth: "90px",
                height: "28px",
                fontSize: "11px",
                padding: "0 20px 0 10px",
                border: "1px solid #ddd",
                borderRadius: "20px",
                boxShadow: "none",
                backgroundColor: "#fff",
                fontWeight: "normal",
                color: "#333"
              }}
              value={sortParam || ""}
              onChange={handleSortChange}
            >
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="new">Newest First</option>
              <option value="trending">Trending Now</option>
              <option value="best-selling">Best Sellers</option>
            </select>
            <ChevronDown 
              className="absolute pointer-events-none text-neutral-400" 
              size={11} 
              style={{
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)"
              }}
            />
          </div>
        </div>

        {/* ROW 3: Category Filter Pills Row (Sticky and Mobile-optimized scrollable row) */}
        <div className="filter-pills-container category-filters flex gap-2 overflow-x-auto select-none scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-screen sm:w-auto sticky top-[91px] z-40 bg-[#FAF7F2] border-b border-gray-100/80" style={{ marginBottom: "2px", marginTop: "0", paddingTop: "2px", paddingBottom: "2px" }}>
          {[
            { label: "All", value: null },
            { label: "Co-Ord Sets", value: "Co-Ord Sets" },
            { label: "Sarees", value: "Sarees" },
            { label: "Linen Sarees", value: "Linen Sarees" },
            { label: "Lehengas", value: "Lehengas" }
          ].map((pill) => {
            const isActive = (!pill.value && !categoryFilter) || (categoryFilter === pill.value);
            return (
              <button
                key={pill.label || "all"}
                onClick={() => handleCategoryChange(pill.value)}
                className={`filter-pill category-pill shrink-0 flex-shrink-0 rounded-full font-normal uppercase tracking-wider whitespace-nowrap transition-all border duration-200 cursor-pointer ${
                  isActive
                     ? "bg-gold-500 border-gold-500 text-white shadow-sm font-medium"
                     : "bg-white border-black/5 text-[#2b2b2b]/70 hover:text-[#2b2b2b] hover:border-black/20"
                }`}
                style={{
                  height: "28px",
                  fontSize: "11px",
                  padding: "0 12px",
                  borderRadius: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-12">
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
          <aside
            className={`
            fixed lg:relative inset-y-0 left-0 w-[280px] lg:w-64 bg-white lg:bg-transparent z-[70] lg:z-0
            transform ${isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            transition-transform duration-300 ease-in-out pt-5 pb-6 px-6 lg:p-0 overflow-y-auto lg:overflow-visible
            shadow-2xl lg:shadow-none
          `}
          >
            <div className="flex items-center justify-between lg:hidden mb-2.5 lg:mb-8">
              <h2 className="text-xl font-serif font-semibold tracking-[1px]">
                Filters
              </h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 lg:space-y-10">
              {/* Category */}
              <section className="category-filter-section">
                <h3 className="category-filter-heading text-[10px] uppercase tracking-[2px] font-bold text-primary-950/30 mb-1.5 lg:mb-6">
                  Category
                </h3>
                <div className="category-filter-links flex flex-col gap-1.5 lg:gap-3">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`category-filter-btn text-left text-sm font-medium transition-all ${!categoryFilter ? "text-gold-600 font-bold" : "text-primary-950/60 hover:text-primary-950"}`}
                  >
                    All Collection
                  </button>

                  <div className="flex flex-col gap-1 lg:gap-2">
                    <button
                      onClick={() => handleCategoryChange("Sarees")}
                      className={`category-filter-btn text-left text-sm font-medium transition-all ${categoryFilter === "Sarees" || categoryFilter === "Linen Sarees" ? "text-gold-600 font-bold" : "text-primary-950/60 hover:text-primary-950"}`}
                    >
                      Sarees
                    </button>
                    {(categoryFilter === "Sarees" ||
                      categoryFilter === "Linen Sarees") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pl-4 flex flex-col gap-1 lg:gap-2 border-l border-gold-500/20 ml-1 overflow-hidden"
                      >
                        <button
                          onClick={() => handleCategoryChange("Linen Sarees")}
                          className={`category-filter-btn text-left text-xs font-medium transition-all py-0.5 lg:py-1 ${categoryFilter === "Linen Sarees" ? "text-gold-600 font-bold" : "text-primary-950/60 hover:text-primary-950"}`}
                        >
                          — Linen Sarees
                        </button>
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={() => handleCategoryChange("Co-Ord Sets")}
                    className={`category-filter-btn text-left text-sm font-medium transition-all ${categoryFilter === "Co-Ord Sets" ? "text-gold-600 font-bold" : "text-primary-950/60 hover:text-primary-950"}`}
                  >
                    Co-Ord Sets
                  </button>
                </div>
              </section>

              {/* Fabric */}
              <section className="fabric-filter-section !mt-4 lg:!mt-10">
                <h3 className="fabric-filter-heading text-[10px] uppercase tracking-[2px] font-bold text-primary-950/30 mb-6">
                  Fabric
                </h3>
                <div className="fabric-filter-options flex flex-col gap-3">
                  {baseFabrics.map((fabric) => (
                    <button
                      key={fabric}
                      onClick={() => toggleFabric(fabric)}
                      className="fabric-filter-btn flex items-center group w-full text-left gap-3"
                    >
                      <div
                        className={`w-4 h-4 border rounded-sm transition-all ${fabricFilter.includes(fabric) ? "bg-gold-500 border-gold-500" : "border-black/10 group-hover:border-black/30"}`}
                      />
                      <span
                        className={`text-sm transition-colors ${fabricFilter.includes(fabric) ? "text-primary-950 font-bold" : "text-primary-950/60 group-hover:text-primary-950"}`}
                      >
                        {fabric}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Price Range Placeholder */}
              <section>
                <h3 className="text-[10px] uppercase tracking-[2px] font-bold text-primary-950/30 mb-6">
                  Selection Benefit
                </h3>
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
            {seoData.paragraph && (
              <div className="category-seo-description sr-only">
                <p>
                  {seoData.paragraph}
                </p>
              </div>
            )}
            {isLoading ? (
              <div className="product-grid">
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="flex flex-col items-center w-full">
                <div className="product-grid w-full">
                  {visible.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      idx={idx}
                      priority={idx < 4}
                      product={product}
                      hideCategory={true}
                      hideRating={true}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                  {isBatchLoading && (
                    [...Array(4)].map((_, i) => (
                      <ProductCardSkeleton key={`batch-skeleton-${i}`} />
                    ))
                  )}
                </div>
                
                {visible.length < filteredAndSortedProducts.length && (
                  <div className="mt-12 flex flex-col items-center justify-center gap-4 w-full">
                    {!isBatchLoading && (
                      <button
                        onClick={loadNextPage}
                        className="bg-white border border-[#2C241B]/15 text-[#2C241B] px-8 py-3.5 text-[11px] uppercase tracking-[2px] font-bold hover:bg-primary-950 hover:text-white transition-all rounded-[4px] shadow-sm active:scale-[0.98]"
                      >
                        Load More Products
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-12">
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-black/5 rounded-sm shadow-sm w-full">
                  <h3 className="text-xl font-serif text-primary-950 mb-3">
                    No items matched your style criteria
                  </h3>
                  <p className="text-primary-950/50 mb-6 max-w-md px-6 text-sm">
                    {searchQuery 
                      ? `We couldn't find any direct matches for "${searchQuery}". Please check the spelling or explore our popular items below.`
                      : "We couldn't find any matches with current filters. Clear filters or explore our collection below."}
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-gold-500 text-white rounded-sm px-8 py-2.5 text-[10px] uppercase tracking-[2px] font-bold hover:bg-gold-600 transition-colors shadow-sm"
                  >
                    Reset & Browse All
                  </button>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[2px] font-bold text-primary-950/40 mb-6 text-center">
                    Discover Our Bestselling Masterpieces
                  </h4>
                  <div className="product-grid">
                    {products
                      .filter((p) => !p.isVariant && (p.isBestSelling || p.isTrending || p.isNew))
                      .slice(0, 4)
                      .map((product, idx) => (
                        <ProductCard
                          key={product.id}
                          idx={idx}
                          priority={idx < 4}
                          product={product}
                          hideCategory={true}
                          hideRating={true}
                          onQuickView={setQuickViewProduct}
                        />
                      ))}
                  </div>
                </div>
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
