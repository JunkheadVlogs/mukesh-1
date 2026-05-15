import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag } from 'lucide-react';

const names = [
  "Priya", "Sneha", "Ritu", "Neha", "Kavya", 
  "Anushka", "Pooja", "Simran", "Aarti", "Nidhi",
  "Deepa", "Shweta", "Meera", "Tanvi", "Ishita"
];

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
];

const timings = [
  "just now", "2 minutes ago", "5 minutes ago", "8 minutes ago",
  "12 minutes ago", "15 minutes ago", "20 minutes ago"
];

export const RecentSalesPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: '', city: '', time: '' });

  useEffect(() => {
    const showNotification = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const time = timings[Math.floor(Math.random() * timings.length)];
      
      setData({ name, city, time });
      setVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setVisible(false);
      }, 4000);
    };

    // Initial delay
    const initialDelay = setTimeout(showNotification, 5000);

    const interval = setInterval(() => {
      showNotification();
    }, Math.random() * 6000 + 6000); // 6-12 seconds

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 left-4 z-[999] bg-white border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-xl p-3 flex items-center gap-3 min-w-[260px] md:min-w-[300px]"
        >
          <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
            <ShoppingBag size={18} className="text-primary-600" />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] text-primary-950/80 leading-snug">
              <span className="font-bold text-primary-900">{data.name}</span> from <span className="font-bold text-primary-900">{data.city}</span>
            </p>
            <p className="text-[11px] text-primary-950/50">
              purchased an item {data.time}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
