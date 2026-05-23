import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  productId?: string;
  category?: string;
}

interface UrgencyMessage {
  icon: string;
  text: string;
}

// 1. Category pools as requested by the user
const SAREES_POOL: UrgencyMessage[] = [
  { icon: "✨", text: "Most Loved Saree" },
  { icon: "🔥", text: "Trending Saree Collection" },
  { icon: "👑", text: "Premium Ethnic Pick" },
  { icon: "💫", text: "Customer Favorite Saree" },
  { icon: "⚡", text: "Fast Selling Saree" },
  { icon: "🖤", text: "Elegant Bestseller" },
  { icon: "⭐", text: "Most Ordered Today" },
  { icon: "🔥", text: "Viral Saree Collection" },
];

const CO_ORD_POOL: UrgencyMessage[] = [
  { icon: "🛍️", text: "Bestselling Co-Ord Set" },
  { icon: "⚡", text: "Selling Out Quickly" },
  { icon: "🔥", text: "Trending Co-Ord Style" },
  { icon: "💎", text: "Premium Fashion Pick" },
  { icon: "👑", text: "Most Loved Co-Ord Set" },
  { icon: "✨", text: "Fast Moving Style" },
  { icon: "⭐", text: "Top Rated Collection" },
  { icon: "🖤", text: "Premium Bestseller" },
];

const LEHENGAS_POOL: UrgencyMessage[] = [
  { icon: "👑", text: "Wedding Favorite" },
  { icon: "✨", text: "Premium Bridal Pick" },
  { icon: "🔥", text: "Trending Lehenga Style" },
  { icon: "💎", text: "Special Wedding Collection" },
  { icon: "⭐", text: "Most Loved Lehenga" },
  { icon: "⚡", text: "Limited Pieces Available" },
  { icon: "🖤", text: "Elegant Bridal Fashion" },
  { icon: "🔥", text: "Viral Wedding Collection" },
];

const SUITS_POOL: UrgencyMessage[] = [
  { icon: "💫", text: "Customer Favorite Suit" },
  { icon: "🔥", text: "Hot Selling Design" },
  { icon: "⚡", text: "Fast Selling Collection" },
  { icon: "👑", text: "Premium Suit Collection" },
  { icon: "⭐", text: "Top Pick Today" },
  { icon: "🛍️", text: "Most Ordered Style" },
  { icon: "✨", text: "Elegant Trending Design" },
  { icon: "🖤", text: "Premium Collection" },
];

const GENERAL_POOL: UrgencyMessage[] = [
  { icon: "✨", text: "Most Loved Saree Collection" },
  { icon: "👑", text: "Premium Ethnic Selection" },
  { icon: "🔥", text: "Trending Ethnic Piece" },
  { icon: "💫", text: "Customer Favorite Design" },
  { icon: "⚡", text: "Fast Selling Favorite" },
  { icon: "🖤", text: "Elegant Best Seller" },
  { icon: "⭐", text: "Highly Popular Today" },
];

export const LiveViewerCounter: React.FC<Props> = ({ productId, category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Determine matching pool dynamically based on the category of the product
  const selectedPool = useMemo(() => {
    const rawCat = (category || "").toLowerCase();
    
    if (rawCat.includes("co-ord")) {
      return CO_ORD_POOL;
    }
    if (rawCat.includes("lehenga")) {
      return LEHENGAS_POOL;
    }
    if (rawCat.includes("suit")) {
      return SUITS_POOL;
    }
    if (rawCat.includes("saree")) {
      return SAREES_POOL;
    }
    
    // Fallback to General/Saree style since Mukesh Saree Centre is a luxury ethnic brand
    return GENERAL_POOL;
  }, [category]);

  // Randomly select 4-5 unique messages from the matched array on load/productId change
  const dynamicMessages = useMemo(() => {
    const pool = [...selectedPool];
    
    // Simple Durstenfeld shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    // Take exactly 5 messages (or limit to pool length if smaller)
    const countToTake = Math.min(5, pool.length);
    return pool.slice(0, countToTake);
  }, [productId, selectedPool]);

  // Smooth rotation interval between the selected 5 messages
  useEffect(() => {
    setCurrentIndex(0); // Reset index on product change
    
    if (dynamicMessages.length <= 1) return;

    // Premium interval duration for rotation (4 seconds feels luxury, readable and elegant)
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dynamicMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [dynamicMessages]);

  const currentMessage = dynamicMessages[currentIndex];

  if (!currentMessage) return null;

  return (
    <div className="inline-flex items-center min-h-[20px] mt-1 sm:mt-2 mb-0 sm:mb-0.5 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${productId}_${currentIndex}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-1.5 bg-[#FAF6F0] border border-[#C8A96B]/25 rounded-full px-3.5 py-1 text-[10.5px] sm:text-[11px] font-medium tracking-wide text-[#2b2b2b] shadow-[0_2px_8px_rgba(200,169,107,0.06)] hover:scale-[1.01] hover:border-[#C8A96B]/40 hover:shadow-[0_4px_12px_rgba(200,169,107,0.1)] transition-all duration-300 cursor-default"
        >
          <span className="text-[12px] leading-none filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
            {currentMessage.icon}
          </span>
          <span className="font-sans leading-none mt-[0.5px]">
            {currentMessage.text}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Kept exported placeholders to avoid any import resolution breaking elsewhere in the codebase
export const LowStockMessage: React.FC<Props> = () => {
  return null;
};

export const CartActivityMessage: React.FC<Props> = () => {
  return null;
};
