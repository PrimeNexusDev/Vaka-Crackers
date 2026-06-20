"use client";

import React from "react";
import { Flame, Star, Award, Zap } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="relative w-full h-8 overflow-hidden bg-gradient-to-r from-crimson-red via-neutral-900 to-crimson-red text-white border-b border-primary-gold/20 flex items-center z-40 no-print">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Double items to enable seamless infinite scroll loop */}
        {Array.from({ length: 4 }).map((_, repeatIdx) => (
          <div key={repeatIdx} className="flex items-center gap-12 px-6">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary-gold">
              <Flame size={12} className="text-red-500 fill-red-500 animate-pulse" />
              Festival Mega Sale Live
            </span>
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white">
              <Star size={12} className="text-primary-gold fill-primary-gold" />
              Up To 90% Discount
            </span>
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary-gold">
              <Award size={12} className="text-yellow-400" />
              Direct Sivakasi Factory Rates
            </span>
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white">
              <Zap size={12} className="text-emerald-400 fill-emerald-400" />
              Wholesale & Bulk Orders Accepted
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
