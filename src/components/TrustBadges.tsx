import { ShieldCheck, Users, CheckCircle2, Award, Truck } from "lucide-react";
import { Link } from "react-router";

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  const badges = [
    {
      icon: <Award size={20} strokeWidth={1} />,
      title: "Trusted Since 1978",
    },
    {
      icon: <Users size={20} strokeWidth={1} />,
      title: "Thousands of Happy Customers",
    },
    {
      icon: <ShieldCheck size={20} strokeWidth={1} />,
      title: "Quality Assured",
    },
    {
      icon: <CheckCircle2 size={20} strokeWidth={1} />,
      title: "Premium Fabric Selection",
    },
    {
      icon: <Truck size={20} strokeWidth={1} />,
      title: "COD & Free Shipping",
    },
  ];

  if (compact) {
    return (
      <div className="flex flex-col gap-1.5 py-1.5 my-0.5">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 group cursor-default"
          >
            <span className="text-[14px] md:text-[16px] text-gold-600 opacity-80 group-hover:opacity-100 transition-opacity">
              {badge.icon}
            </span>
            <span className="text-[11px] font-sans tracking-[0.1em] text-primary-600 group-hover:text-primary-950 transition-colors font-medium uppercase">
              {badge.title}
            </span>
          </div>
        ))}
        <div className="pt-2 mt-1 border-t border-black/5">
           <Link to="/return-policy" className="inline-flex items-center gap-2 group hover:opacity-80 transition-opacity">
             <span className="text-[11px] font-sans tracking-[0.1em] text-gold-600 underline underline-offset-4 decoration-gold-600/30 group-hover:text-gold-500 font-medium uppercase">
               7-Day Easy Returns Policy
             </span>
           </Link>
        </div>
      </div>
    );
  }

  const containerColsClass = badges.length === 5
    ? "grid grid-cols-2 md:grid-cols-5 gap-y-4 gap-x-3 md:gap-8 lg:gap-12"
    : "grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-3 md:gap-8 lg:gap-12";

  return (
    <div className="w-full py-3.5 md:py-5 border-b border-gold-200/50 bg-gradient-to-b from-transparent to-primary-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={containerColsClass}>
          {badges.map((badge, idx) => {
            const isLastOdd = badges.length % 2 !== 0 && idx === badges.length - 1;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center gap-1.5 md:gap-2.5 group cursor-default transition-all duration-300 ${
                  isLastOdd ? "col-span-2 md:col-span-1" : "col-span-1"
                }`}
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gold-50/50 border border-gold-100 flex items-center justify-center text-gold-600 group-hover:bg-gold-50 group-hover:-translate-y-0.5 transition-all duration-300">
                  <span className="opacity-90 scale-[0.65] md:scale-90">{badge.icon}</span>
                </div>
                <span className="text-[9px] md:text-[11px] font-medium tracking-[0.1em] md:tracking-[0.15em] uppercase text-primary-950/80 group-hover:text-primary-950 transition-colors leading-[1.3] max-w-[120px] mx-auto">
                  {badge.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

