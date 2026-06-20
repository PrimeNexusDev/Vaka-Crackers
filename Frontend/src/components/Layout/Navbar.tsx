"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShoppingBag, Heart, GitCompare, Sun, Moon, Sparkles, 
  Search, Mic, Menu, X, Settings, ArrowRight, Volume2 
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface NavbarProps {
  onOpenCart: () => void;
  onOpenCompare: () => void;
  onOpenWishlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenCompare, onOpenWishlist }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    cart, wishlist, compareList, theme, setTheme, 
    festivalMode, setFestivalMode, products 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products for suggestions
  const suggestions = searchQuery.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
    : products.filter(p => p.isBestSeller).slice(0, 3); // Default trending if empty

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchSuggestions(false);
    }
  };

  const triggerVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice recognition after 2 seconds
    setTimeout(() => {
      const sampleQueries = ["120 Shots", "Flower Pot", "Sparklers", "Hydro Bomb", "Gift Box"];
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      setSearchQuery(randomQuery);
      setIsListening(false);
      router.push(`/shop?search=${encodeURIComponent(randomQuery)}`);
      setShowSearchSuggestions(false);
    }, 2000);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Digital Price List", href: "/price-list" },
    { name: "Dealer / Wholesale", href: "/dealer" },
    { name: "Track Order", href: "/track-order" }
  ];

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 w-full z-50 transition-colors duration-300 no-print">
      {/* Background with blur */}
      <div className={`absolute inset-0 -z-10 backdrop-blur-md border-b transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-neutral-950/80 border-primary-gold/15" 
          : "bg-white/80 border-primary-gold/10"
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-gold via-crimson-red to-primary-gold p-[1px]">
              <div className="w-full h-full rounded-[11px] bg-neutral-950 flex items-center justify-center">
                <Sparkles size={18} className="text-primary-gold group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="block text-sm font-black tracking-widest font-cinzel text-primary-gold leading-none">
                VAKA
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase leading-none mt-0.5">
                Crackers
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-primary-gold relative py-2 ${
                    isActive 
                      ? "text-primary-gold font-bold" 
                      : theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary-gold to-crimson-red rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Advanced Search Bar (Desktop) */}
          <div ref={searchRef} className="hidden md:block relative max-w-xs xl:max-w-md w-full">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search premium crackers..."
                value={searchQuery}
                onFocus={() => setShowSearchSuggestions(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs py-2.5 pl-10 pr-12 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-gold transition-all ${
                  theme === "dark" 
                    ? "bg-neutral-900/90 text-white placeholder-neutral-500 border border-neutral-800" 
                    : "bg-neutral-100 text-neutral-900 placeholder-neutral-400 border border-neutral-200"
                }`}
              />
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              
              <button
                type="button"
                onClick={triggerVoiceSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary-gold transition-colors"
                title="Voice Search"
              >
                {isListening ? (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-crimson-red"></span>
                  </span>
                ) : (
                  <Mic size={14} />
                )}
              </button>
            </form>

            {/* Smart Search Suggestions Dropdown */}
            {showSearchSuggestions && (
              <div className={`absolute top-full left-0 mt-2 w-full rounded-2xl border p-4 shadow-2xl transition-all ${
                theme === "dark"
                  ? "bg-neutral-950/95 border-neutral-800 text-white"
                  : "bg-white border-neutral-200 text-neutral-900"
              }`}>
                {isListening ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <div className="flex gap-1 justify-center items-end h-8">
                      <span className="w-1.5 bg-primary-gold rounded animate-[bounce_0.8s_infinite] h-8" />
                      <span className="w-1.5 bg-crimson-red rounded animate-[bounce_0.8s_infinite_0.15s] h-6" />
                      <span className="w-1.5 bg-primary-gold rounded animate-[bounce_0.8s_infinite_0.3s] h-7" />
                      <span className="w-1.5 bg-crimson-red rounded animate-[bounce_0.8s_infinite_0.45s] h-5" />
                    </div>
                    <p className="text-xs font-semibold text-neutral-400">Listening for \"Atom Bomb\" or \"Sparklers\"...</p>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">
                      {searchQuery ? "Search Results" : "Trending Products"}
                    </p>
                    <div className="space-y-2">
                      {suggestions.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            router.push(`/shop?search=${encodeURIComponent(prod.name)}`);
                            setShowSearchSuggestions(false);
                            setSearchQuery(prod.name);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-primary-gold/10 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{prod.image}</span>
                            <div>
                              <h4 className="text-xs font-bold leading-tight">{prod.name}</h4>
                              <p className="text-[10px] text-neutral-400">{prod.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs font-black text-primary-gold">₹{prod.price}</span>
                            <span className="block text-[9px] text-neutral-500 line-through">₹{prod.mrp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {searchQuery && suggestions.length === 0 && (
                      <p className="text-xs text-neutral-400 text-center py-2">No matching products found.</p>
                    )}

                    <div className="mt-3 pt-3 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-400">
                      <span>Quick Search Options</span>
                      <button 
                        onClick={() => {
                          setSearchQuery("Combo Box");
                          router.push("/shop?search=Box");
                          setShowSearchSuggestions(false);
                        }}
                        className="hover:text-primary-gold flex items-center gap-1 font-bold"
                      >
                        Gift Boxes <ArrowRight size={10} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action Utilities (Right side) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Festival Theme Toggle */}
            <button
              onClick={() => setFestivalMode(!festivalMode)}
              className={`p-2 rounded-full border transition-all duration-300 relative ${
                festivalMode
                  ? "bg-gradient-to-tr from-primary-gold to-crimson-red text-white border-transparent animate-pulse"
                  : theme === "dark" 
                    ? "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white" 
                    : "bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900"
              }`}
              title="Toggle Fireworks Mode"
            >
              <Sparkles size={15} className={festivalMode ? "animate-spin" : ""} />
              {festivalMode && (
                <span className="absolute -bottom-1 -right-1 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-full border transition-all ${
                theme === "dark" 
                  ? "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white" 
                  : "bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900"
              }`}
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Compare Button */}
            <button
              onClick={onOpenCompare}
              className={`p-2 rounded-full border relative hidden md:block transition-all ${
                theme === "dark" 
                  ? "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white" 
                  : "bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900"
              }`}
              title="Compare Products"
            >
              <GitCompare size={15} />
              {compareList.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary-gold text-neutral-950 text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-neutral-950 animate-bounce">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className={`p-2 rounded-full border relative hidden md:block transition-all ${
                theme === "dark" 
                  ? "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white" 
                  : "bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900"
              }`}
              title="Wishlist"
            >
              <Heart size={15} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-crimson-red text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-neutral-950 animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="p-2.5 rounded-full bg-gradient-to-tr from-primary-gold to-primary-gold-hover hover:from-primary-gold hover:to-crimson-red text-neutral-950 hover:text-white transition-all shadow-md shadow-primary-gold/10 hover:shadow-crimson-red/20 relative"
              title="Shopping Cart"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-crimson-red text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-neutral-900 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin shortcut */}
            <Link
              href="/admin"
              className={`p-2 rounded-full border transition-all ${
                pathname === "/admin"
                  ? "border-primary-gold text-primary-gold"
                  : theme === "dark" 
                    ? "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white" 
                    : "bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900"
              }`}
              title="Admin Panel"
            >
              <Settings size={15} className="hover:rotate-45 transition-transform" />
            </Link>

            {/* Hamburger (Mobile Menu Toggle) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-all ${
                theme === "dark" 
                  ? "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white" 
                  : "bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 py-6 space-y-6 shadow-2xl animate-fade-in ${
          theme === "dark" ? "bg-neutral-950 border-neutral-900" : "bg-white border-neutral-100"
        }`}>
          {/* Mobile Search */}
          <div className="relative">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs py-2 px-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-gold ${
                  theme === "dark" 
                    ? "bg-neutral-900 text-white border border-neutral-850" 
                    : "bg-neutral-100 text-neutral-900 border border-neutral-200"
                }`}
              />
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs uppercase font-bold tracking-widest ${
                  pathname === link.href ? "text-primary-gold" : "text-neutral-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Wishlist & Compare Mobile Row */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
            <button
              onClick={() => {
                onOpenWishlist();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs text-neutral-400 font-bold"
            >
              <Heart size={14} className="text-crimson-red" />
              Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => {
                onOpenCompare();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs text-neutral-400 font-bold"
            >
              <GitCompare size={14} className="text-primary-gold" />
              Compare ({compareList.length})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
