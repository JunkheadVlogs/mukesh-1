import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ShoppingCart, TrendingUp, Clock } from 'lucide-react';

interface UrgencyWidgetProps {
  productId: string;
}

const templates = [
  { icon: Users, text: (n: number) => `${n} people are viewing this product right now` },
  { icon: ShoppingCart, text: (n: number) => `${n} shoppers added this to cart today` },
  { icon: Clock, text: (n: number) => `${n < 10 ? n : (n % 5) + 3} left in stock` },
  { icon: TrendingUp, text: (n: number) => `${n} shoppers interested` },
  { icon: TrendingUp, text: () => `Fast Transaction` }
];

// Consistent random based on ID for initial value, but changes live
function getSeededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export const UrgencyWidget: React.FC<UrgencyWidgetProps> = ({ productId }) => {
  const [index, setIndex] = useState(0);
  const [number, setNumber] = useState(0);

  useEffect(() => {
    // Initial seeded index and number
    const baseHash = getSeededRandom(productId);
    setIndex(baseHash % templates.length);
    setNumber((baseHash % 25) + 3);

    const interval = setInterval(() => {
      // faster changes as requested (3-8 seconds)
      const shouldChangeIndex = Math.random() > 0.6;
      if (shouldChangeIndex) {
        setIndex((prev) => (prev + 1) % templates.length);
      }
      
      setNumber((prev) => {
        // Randomize between 8-35 as requested
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        let next = prev + change;
        if (next < 8) next = 8 + Math.floor(Math.random() * 5);
        if (next > 35) next = 35 - Math.floor(Math.random() * 5);
        return next;
      });
    }, Math.random() * 5000 + 3000); // 3-8 seconds interval

    return () => clearInterval(interval);
  }, [productId]);

  const CurrentTemplate = templates[index];
  const Icon = CurrentTemplate.icon;

  return (
    <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-red-50/50 border border-red-100 rounded-md max-w-fit overflow-hidden">
      <Icon className="w-4 h-4 text-red-600 shrink-0" />
      <AnimatePresence mode="wait">
        <motion.p
          key={index + '-' + number} 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-[13px] font-medium text-red-800"
        >
          {CurrentTemplate.text(number)}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
