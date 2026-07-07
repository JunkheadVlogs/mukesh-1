import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import { Scale, Search, X, Check, HelpCircle, Star, ArrowLeftRight, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../store";
import { products } from "../mockData";
import { formatPrice, optimizeImage } from "../utils";

interface ProductComparisonProps {
  currentProduct: Product;
}

export function ProductComparison({ currentProduct }: ProductComparisonProps) {
  // We can filter the list to products that are in the same overall category
  const eligibleProducts = useMemo(() => {
    return products.filter(
      (p) => !p.isHidden && p.id !== currentProduct.id
    );
  }, [currentProduct.id]);

  // Suggestions (products of the same category or similarly tagged)
  const suggestedProducts = useMemo(() => {
    const sameCat = eligibleProducts.filter((p) => p.category === currentProduct.category);
    if (sameCat.length > 0) return sameCat.slice(0, 3);
    return eligibleProducts.slice(0, 3);
  }, [eligibleProducts, currentProduct.category]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [highlightDiffs, setHighlightDiffs] = useState(false);

  // Filter options based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return eligibleProducts.slice(0, 8);
    const query = searchQuery.toLowerCase();
    return eligibleProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.fabric && p.fabric.toLowerCase().includes(query)) ||
        (p.color && p.color.toLowerCase().includes(query))
    );
  }, [eligibleProducts, searchQuery]);

  // Helper parser to extract details dynamically from rich descriptions
  const parseProductDetails = (productObj: Product) => {
    const desc = productObj.description || "";
    const highlights: string[] = [];
    const occasions: string[] = [];

    const lines = desc.split("\n");
    let insideHighlights = false;
    let insideOccasions = false;

    for (const line of lines) {
      const trimmed = line.trim();
      const upper = trimmed.toUpperCase();
      if (upper.includes("HIGHLIGHTS:")) {
        insideHighlights = true;
        insideOccasions = false;
        continue;
      }
      if (upper.includes("STYLING:") || upper.includes("IDEAL OCCASIONS:")) {
        insideOccasions = true;
        insideHighlights = false;
        continue;
      }
      if (upper.includes("FABRIC DETAILS:") || upper.includes("CARE INSTRUCTIONS:")) {
        insideHighlights = false;
        insideOccasions = false;
      }

      if (insideHighlights && (trimmed.startsWith("•") || trimmed.startsWith("-"))) {
        highlights.push(trimmed.slice(1).trim());
      }
      if (insideOccasions && (trimmed.startsWith("-") || trimmed.startsWith("•"))) {
        occasions.push(trimmed.slice(1).trim());
      }
    }

    return {
      highlights: highlights.slice(0, 3).join(", ") || "Premium design & soft finish",
      occasions: occasions.slice(0, 2).join(", ") || "Festive & daily luxury wear",
    };
  };

  const currentDetails = useMemo(() => parseProductDetails(currentProduct), [currentProduct]);
  const selectedDetails = useMemo(() => {
    if (!selectedProduct) return null;
    return parseProductDetails(selectedProduct);
  }, [selectedProduct]);

  // Define the row fields to compare
  const comparisonRows = useMemo(() => {
    if (!selectedProduct || !selectedDetails) return [];

    const isOutOfStockCurrent = (currentProduct.stock ?? 0) <= 0;
    const isOutOfStockSelected = (selectedProduct.stock ?? 0) <= 0;

    return [
      {
        id: "price",
        label: "Price Value",
        val1: `₹${formatPrice(currentProduct.price)}`,
        val2: `₹${formatPrice(selectedProduct.price)}`,
        diff: currentProduct.price !== selectedProduct.price,
        raw1: currentProduct.price,
        raw2: selectedProduct.price,
      },
      {
        id: "fabric",
        label: "Fabric Meter & Weave",
        val1: currentProduct.fabric || "Premium Fabric",
        val2: selectedProduct.fabric || "Premium Fabric",
        diff: (currentProduct.fabric || "").toLowerCase() !== (selectedProduct.fabric || "").toLowerCase(),
      },
      {
        id: "color",
        label: "Primary Shade / Color",
        val1: currentProduct.color || "Designer Hue",
        val2: selectedProduct.color || "Designer Hue",
        diff: (currentProduct.color || "").toLowerCase() !== (selectedProduct.color || "").toLowerCase(),
      },
      {
        id: "category",
        label: "Product Category",
        val1: currentProduct.category,
        val2: selectedProduct.category,
        diff: currentProduct.category !== selectedProduct.category,
      },
      {
        id: "highlights",
        label: "Signature Highlights",
        val1: currentDetails.highlights,
        val2: selectedDetails.highlights,
        diff: currentDetails.highlights.toLowerCase() !== selectedDetails.highlights.toLowerCase(),
      },
      {
        id: "occasions",
        label: "Best Occasions",
        val1: currentDetails.occasions,
        val2: selectedDetails.occasions,
        diff: currentDetails.occasions.toLowerCase() !== selectedDetails.occasions.toLowerCase(),
      },
      {
        id: "stock",
        label: "Availability Status",
        val1: isOutOfStockCurrent ? "Sold Out" : `In Stock (${currentProduct.stock} Left)`,
        val2: isOutOfStockSelected ? "Sold Out" : `In Stock (${selectedProduct.stock} Left)`,
        diff: isOutOfStockCurrent !== isOutOfStockSelected,
      },
      {
        id: "tailoring",
        label: "Boutique Blouse Options",
        val1: "Custom fall-pico & blouse stitching available",
        val2: "Custom fall-pico & blouse stitching available",
        diff: false,
      },
    ];
  }, [currentProduct, selectedProduct, currentDetails, selectedDetails]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsSearching(false);
    setSearchQuery("");
  };

  return (
    <div className="w-full bg-white border border-[#2C241B]/15 rounded-[4px] p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-[#2C241B]/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gold-600 mb-1">
            <ArrowLeftRight size={18} strokeWidth={1.5} />
            <h2 className="text-xs font-sans tracking-[0.15em] uppercase font-bold text-primary-950">
              Saree Comparison Studio
            </h2>
          </div>
          <p className="text-[12px] text-primary-950/70 font-sans tracking-wide">
            Compare material, weave patterns, prices, and features side-by-side to make the perfect retail or wholesale selection.
          </p>
        </div>

        {selectedProduct && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHighlightDiffs(!highlightDiffs)}
              className={`text-[10px] uppercase font-bold tracking-[0.1em] px-3 py-1.5 rounded-[2px] border transition-all duration-300 ${
                highlightDiffs
                  ? "bg-amber-50 border-amber-300 text-amber-800"
                  : "bg-white border-[#2C241B]/15 text-primary-950/70 hover:text-primary-950 hover:border-primary-950"
              }`}
            >
              Highlight Differences
            </button>
            <button
              onClick={() => {
                setSelectedProduct(null);
                setHighlightDiffs(false);
              }}
              className="text-[10px] uppercase font-bold tracking-[0.1em] px-3 py-1.5 rounded-[2px] border border-red-200 text-red-650 bg-red-50/50 hover:bg-red-50"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedProduct ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Search Input Selector */}
            <div className="max-w-xl">
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-primary-950/80 mb-2">
                Select Saree or Co-Ord Set to Compare
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-950/40">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearching(true);
                  }}
                  onFocus={() => setIsSearching(true)}
                  placeholder="Type to search sarees (e.g. Cotton, Linen, Forest Green)..."
                  className="w-full bg-white pl-9 pr-8 py-2.5 border border-black/10 rounded-sm focus:outline-none focus:border-[#C8A96B] focus:ring-1 focus:ring-[#C8A96B]/25 text-[12px] tracking-wider transition-all placeholder:text-neutral-400 font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearching(false);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-950/40 hover:text-primary-950"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search Dropdown Panel */}
              <AnimatePresence>
                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute z-10 mt-1 max-w-xl w-full max-h-[280px] overflow-y-auto bg-white border border-[#2C241B]/15 rounded-md shadow-lg"
                  >
                    {filteredProducts.length === 0 ? (
                      <div className="p-4 text-center text-primary-950/50 text-[12px]">
                        No sarees found matching "{searchQuery}"
                      </div>
                    ) : (
                      <div className="py-1">
                        {filteredProducts.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleSelectProduct(p)}
                            className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-3 transition-colors text-primary-950 font-sans border-b border-black/[0.03] last:border-0"
                          >
                            <img
                              src={optimizeImage(p.image, 80, "webp")}
                              alt={p.name}
                              width={32}
                              height={40}
                              className="w-8 h-10 object-cover rounded bg-neutral-50"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium truncate">{p.name}</p>
                              <p className="text-[10px] text-primary-950/60 truncate">
                                {p.category} • {p.fabric || "Premium drape"} • ₹{formatPrice(p.price)}
                              </p>
                            </div>
                            <ChevronRight size={14} className="text-primary-950/30" />
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Suggestions Row */}
            <div>
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C8A96B] mb-3">
                Suggested Comparisons
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {suggestedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="border border-black/5 bg-[#FAF8F5]/30 hover:border-[#C8A96B]/50 hover:bg-white p-3 rounded-sm flex items-center gap-3 cursor-pointer transition-all duration-300 group"
                  >
                    <img
                      src={optimizeImage(p.image, 100, "webp")}
                      alt={p.name}
                      width={40}
                      height={48}
                      className="w-10 h-12 object-cover rounded bg-neutral-50 shrink-0 border border-black/[0.02]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] font-serif font-medium text-primary-950 truncate group-hover:text-[#C8A96B] transition-colors">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-primary-950/60 font-sans truncate">
                        ₹{p.price} • {p.fabric || "Weave material"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {/* Desktop / Tablet Comparison Grid Table */}
            <table className="w-full table-fixed md:table-auto border-collapse text-left text-[12.5px] font-sans text-primary-950">
              <thead>
                <tr className="border-b border-[#2C241B]/10">
                  <th className="py-3 w-[25%] md:w-[22%] text-primary-950/60 font-medium font-sans uppercase tracking-widest text-[10px] pr-2">
                    Attribute Details
                  </th>
                  <th className="py-3 w-[37.5%] md:w-[39%] pr-4">
                    <div className="flex flex-col gap-2">
                      <span className="inline-block text-[9px] uppercase tracking-widest font-bold text-gold-600 bg-gold-50 border border-gold-200 px-1.5 py-0.5 rounded-sm w-fit leading-none mb-1">
                        Current Product
                      </span>
                      <div className="flex items-start gap-2.5">
                        <img
                          src={optimizeImage(currentProduct.image, 120, "webp")}
                          alt={currentProduct.name}
                          width={48}
                          height={64}
                          className="w-10 h-14 md:w-12 md:h-16 object-cover rounded border border-black/[0.05] bg-neutral-50 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-serif font-medium text-primary-950 text-[12px] md:text-[13.5px] leading-tight line-clamp-2">
                            {currentProduct.name}
                          </p>
                          <p className="font-mono text-[10px] mt-1 text-primary-950/50">
                            {currentProduct.sku || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th className="py-3 w-[37.5%] md:w-[39%] pl-4 border-l border-black/[0.04]">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center pr-2">
                        <span className="inline-block text-[9px] uppercase tracking-widest font-bold text-[#2C241B]/55 bg-neutral-50 border border-black/5 px-1.5 py-0.5 rounded-sm leading-none mb-1">
                          Comparing To
                        </span>
                        <button
                          onClick={() => {
                            setIsSearching(true);
                            setSelectedProduct(null);
                          }}
                          className="text-[10px] font-sans font-bold text-[#C8A96B] hover:underline flex items-center gap-1 cursor-pointer leading-none"
                        >
                          Change Saree
                        </button>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Link to={`/product/${selectedProduct.slug}`} className="shrink-0">
                          <img
                            src={optimizeImage(selectedProduct.image, 120, "webp")}
                            alt={selectedProduct.name}
                            width={48}
                            height={64}
                            className="w-10 h-14 md:w-12 md:h-16 object-cover rounded border border-black/[0.05] bg-neutral-50 hover:opacity-90 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            to={`/product/${selectedProduct.slug}`}
                            className="font-serif font-medium text-primary-950 text-[12px] md:text-[13.5px] leading-tight line-clamp-2 hover:text-[#C8A96B] transition-colors"
                          >
                            {selectedProduct.name}
                          </Link>
                          <p className="font-mono text-[10px] mt-1 text-primary-950/50">
                            {selectedProduct.sku || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => {
                  const isHighlighted = highlightDiffs && row.diff;
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-black/[0.03] transition-colors duration-200 ${
                        isHighlighted ? "bg-amber-50/20" : "hover:bg-neutral-50/30"
                      }`}
                    >
                      <td className="py-3 px-1 md:py-3.5 md:px-2 font-sans font-semibold text-primary-950/70 text-[11px] uppercase tracking-wider pr-2">
                        <div className="flex items-center gap-1.5">
                          {row.label}
                          {isHighlighted && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          )}
                        </div>
                      </td>
                      <td className={`py-3 pr-4 pr-2.5 md:py-3.5 md:pr-4 text-primary-950 text-[12px] sm:text-[13px] ${isHighlighted ? "font-medium" : ""}`}>
                        {row.id === "stock" && row.val1.includes("In Stock") ? (
                          <div className="flex items-center gap-1 text-emerald-700">
                            <Check size={14} />
                            <span>{row.val1}</span>
                          </div>
                        ) : row.id === "price" ? (
                          <div>
                            <span className="font-serif font-bold text-primary-950 text-[13px] sm:text-[14px]">
                              {row.val1}
                            </span>
                            {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                              <span className="text-[10px] text-primary-950/50 line-through ml-2">
                                ₹{formatPrice(currentProduct.originalPrice)}
                              </span>
                            )}
                          </div>
                        ) : (
                          row.val1
                        )}
                      </td>
                      <td className={`py-3 pl-4 md:py-3.5 md:pl-4 text-primary-950 text-[12px] sm:text-[13px] border-l border-black/[0.04] ${isHighlighted ? "font-medium" : ""}`}>
                        {row.id === "stock" && row.val2.includes("In Stock") ? (
                          <div className="flex items-center gap-1 text-emerald-700">
                            <Check size={14} />
                            <span>{row.val2}</span>
                          </div>
                        ) : row.id === "price" ? (
                          <div>
                            <span className="font-serif font-bold text-primary-950 text-[13px] sm:text-[14px]">
                              {row.val2}
                            </span>
                            {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                              <span className="text-[10px] text-primary-950/50 line-through ml-2">
                                ₹{formatPrice(selectedProduct.originalPrice)}
                              </span>
                            )}
                          </div>
                        ) : (
                          row.val2
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
