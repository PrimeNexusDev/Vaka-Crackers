"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, FileText, Settings, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface StickyBottomNavProps {
  onOpenCart: () => void;
}

export const StickyBottomNav: React.FC<StickyBottomNavProps> = ({ onOpenCart }) => {
  const pathname = usePathname();
  const { cart, theme } = useApp();
  
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Shop", href: "/shop", icon: <Sparkles size={18} /> },
    { name: "Price List", href: "/price-list", icon: <FileText size={18} /> },
    { name: "Admin", href: "/admin", icon: <Settings size={18} /> }
  ];

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around py-2 px-4 backdrop-blur-md transition-colors duration-300 no-print ${
      theme === "dark" 
        ? "bg-neutral-950/90 border-neutral-900 text-neutral-400" 
        : "bg-white/90 border-neutral-200 text-neutral-600"
    }`}>
      {/* Home, Shop, Price List */}
      {navItems.slice(0, 2).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold tracking-wider ${
              isActive ? "text-primary-gold" : ""
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        );
      })}

      {/* Center Sticky Cart Trigger */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center justify-center -translate-y-4 h-12 w-12 rounded-full bg-gradient-to-tr from-primary-gold to-crimson-red text-neutral-950 shadow-lg shadow-primary-gold/25 relative border-4 border-neutral-950"
      >
        <ShoppingBag size={18} className="text-white" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-crimson-red text-[8px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center border border-crimson-red">
            {cartCount}
          </span>
        )}
      </button>

      {/* Price List and Admin */}
      {navItems.slice(2).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold tracking-wider ${
              isActive ? "text-primary-gold" : ""
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};
