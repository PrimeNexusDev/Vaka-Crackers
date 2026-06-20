"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  SlidersHorizontal, ShoppingBag, Heart, GitCompare, Eye, 
  Search, RefreshCw, X, ChevronRight 
} from "lucide-react";

import { useApp, Product } from "../../context/AppContext";
import { Navbar } from "../../components/Layout/Navbar";
import { Footer } from "../../components/Layout/Footer";
import { CartDrawer } from "../../components/Shop/CartDrawer";
import { WishlistDrawer } from "../../components/Shop/WishlistDrawer";
import { CompareDrawer } from "../../components/Shop/CompareDrawer";
import { QuickViewModal } from "../../components/Shop/QuickViewModal";

// Sub-component wrapper that uses useSearchParams inside a Suspense boundary
const ShopContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { 
    products, addToCart, wishlist, toggleWishlist, compareList, 
    toggleCompare, theme 
  } = useApp();

  // URL search and category params
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [soundLevelFilter, setSoundLevelFilter] = useState("All");
  const [ageGroupFilter, setAgeGroupFilter] = useState("All");
  const [maxPrice, setMaxPrice] = useState(12000);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Overlay state
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  // Per-product quantities selected
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Sync state if query URL parameters change
  useEffect(() => {
    const categoryQuery = searchParams.get("category");
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    }
    const searchQueryParam = searchParams.get("search");
    if (searchQueryParam !== null) {
      setSearchQuery(searchQueryParam);
    }
  }, [searchParams]);

  // Categories list
  const categories = [
    "All",
    "One Sound Crackers",
    "Sparklers",
    "Fancy Crackers",
    "Rockets",
    "Flower Pots",
    "Atom Bombs",
    "Gift Boxes",
    "Kids Special",
    "Multi Shots",
    "Premium Collection"
  ];

  // Filtering logic
  const filteredProducts = products.filter((prod) => {
    // Category filter
    if (selectedCategory !== "All" && prod.category !== selectedCategory) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim() && !prod.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Sound level filter
    if (soundLevelFilter !== "All" && prod.soundLevel !== soundLevelFilter) {
      return false;
    }
    // Age group filter
    if (ageGroupFilter !== "All" && prod.ageGroup !== ageGroupFilter) {
      return false;
    }
    // Price filter
    if (prod.price > maxPrice) {
      return false;
    }
    // Stock filter
    if (onlyInStock && prod.stock <= 0) {
      return false;
    }
    return true;
  });

  const handleQtyChange = (prodId: string, val: number) => {
    setQuantities(prev => ({ ...prev, [prodId]: Math.max(1, val) }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    setCartOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSoundLevelFilter("All");
    setAgeGroupFilter("All");
    setMaxPrice(12000);
    setOnlyInStock(false);
    // Clear url query params
    router.push("/shop");
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar 
        onOpenCart={() => setCartOpen(true)}
        onOpenCompare={() => setCompareOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <span>Home</span>
              <ChevronRight size={10} />
              <span className="text-primary-gold">Shop Catalog</span>
            </div>
            <h1 className="text-2xl font-black font-cinzel text-white uppercase tracking-wider mt-1.5">
              Premium Fireworks Catalog
            </h1>
            <p className="text-xs text-neutral-400">
              Showing {filteredProducts.length} premium Sivakasi crackers matching your requirements
            </p>
          </div>
          
          <button
            onClick={handleResetFilters}
            className="py-1.5 px-3 rounded-lg border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={12} />
            Reset All Filters
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 shrink-0 rounded-2xl border p-5 space-y-6 self-start ${
            theme === "dark" ? "bg-neutral-950/80 border-neutral-850" : "bg-neutral-50 border-neutral-200"
          }`}>
            
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-900">
              <SlidersHorizontal size={14} className="text-primary-gold" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Filter Products</h3>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Search Products</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs py-1.5 pl-8 pr-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                />
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            {/* Category Dropdown/Selector */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Categories</h4>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-xs py-1 px-2 rounded transition-colors truncate ${
                      selectedCategory === cat 
                        ? "bg-primary-gold/15 text-primary-gold font-bold" 
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Level Filter */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Sound decibel</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {["All", "Eco-Friendly", "Loud", "Musical", "Silent"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSoundLevelFilter(lvl)}
                    className={`py-1 px-2 rounded border text-[10px] font-bold transition-all text-center ${
                      soundLevelFilter === lvl 
                        ? "border-primary-gold bg-primary-gold/10 text-primary-gold" 
                        : "border-neutral-850 text-neutral-500 hover:text-neutral-300"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Group Filter */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Age Rating</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {["All", "Kids", "Family", "Adults"].map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeGroupFilter(age)}
                    className={`py-1 px-2 rounded border text-[10px] font-bold transition-all text-center ${
                      ageGroupFilter === age 
                        ? "border-primary-gold bg-primary-gold/10 text-primary-gold" 
                        : "border-neutral-850 text-neutral-500 hover:text-neutral-300"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Range */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                <span>Max Budget</span>
                <span className="text-white">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="30"
                max="12000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary-gold cursor-pointer"
              />
            </div>

            {/* Availability Checkbox */}
            <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded accent-primary-gold bg-neutral-900 border-neutral-800"
              />
              <span>Show In Stock Only</span>
            </label>

          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl p-6">
                <span className="text-3xl">🏜️</span>
                <h3 className="text-sm font-bold text-white mt-4">No Products Match Your Filters</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  Try clearing some filters, widening your price range, or searching for other keywords.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 py-2 px-4 rounded-xl bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold text-xs"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => {
                  const discount = Math.round(((prod.mrp - prod.price) / prod.mrp) * 100);
                  const isWish = wishlist.includes(prod.id);
                  const isComp = compareList.includes(prod.id);
                  const qty = quantities[prod.id] || 1;

                  return (
                    <div
                      key={prod.id}
                      className="group rounded-2xl border border-neutral-900 bg-neutral-900/30 p-4 flex flex-col justify-between transition-all duration-300 hover:border-primary-gold/30 hover:bg-neutral-950"
                    >
                      <div>
                        {/* Image Panel */}
                        <div className="aspect-square w-full bg-neutral-900 rounded-xl flex items-center justify-center relative p-6 mb-4 overflow-hidden border border-neutral-850">
                          <span className="text-6xl select-none group-hover:scale-110 transition-transform duration-300">
                            {prod.image}
                          </span>
                          
                          {/* Wishlist / Compare Overlays */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleWishlist(prod.id)}
                              className={`p-1.5 rounded-lg border text-neutral-400 bg-neutral-950 hover:text-white transition-colors ${
                                isWish ? "border-rose-500/40 text-rose-400" : "border-neutral-800"
                              }`}
                              title="Wishlist"
                            >
                              <Heart size={12} className={isWish ? "fill-rose-500" : ""} />
                            </button>
                            <button
                              onClick={() => toggleCompare(prod.id)}
                              className={`p-1.5 rounded-lg border text-neutral-400 bg-neutral-950 hover:text-white transition-colors ${
                                isComp ? "border-primary-gold/40 text-primary-gold" : "border-neutral-800"
                              }`}
                              title="Compare"
                            >
                              <GitCompare size={12} />
                            </button>
                          </div>

                          {/* Floating Discount Tag */}
                          <span className="absolute top-2.5 left-2.5 bg-crimson-red text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                            {discount}% OFF
                          </span>
                        </div>

                        {/* Text details */}
                        <span className="text-[9px] font-bold text-primary-gold uppercase tracking-wider">{prod.category}</span>
                        <h4 className="text-xs font-bold text-white mt-1 group-hover:text-primary-gold transition-colors truncate">
                          {prod.name}
                        </h4>

                        {/* Prices */}
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-sm font-black text-white">₹{prod.price}</span>
                          <span className="text-[10px] text-neutral-500 line-through">₹{prod.mrp}</span>
                        </div>
                      </div>

                      {/* Buy Footer */}
                      <div className="mt-4 pt-3 border-t border-neutral-900 space-y-3">
                        {/* Qty and QuickView */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center border border-neutral-800 rounded-lg">
                            <button
                              onClick={() => handleQtyChange(prod.id, qty - 1)}
                              className="p-1 hover:text-white text-neutral-500 text-[10px] font-bold"
                            >
                              -
                            </button>
                            <span className="text-[10px] font-bold text-white px-2">{qty}</span>
                            <button
                              onClick={() => handleQtyChange(prod.id, qty + 1)}
                              className="p-1 hover:text-white text-neutral-500 text-[10px] font-bold"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => setQuickViewProductId(prod.id)}
                            className="py-1 px-2 rounded-lg border border-neutral-800 hover:border-neutral-600 hover:text-white text-neutral-400 text-[10px] font-bold flex items-center gap-1"
                          >
                            <Eye size={10} /> Quick View
                          </button>
                        </div>

                        <button
                          onClick={() => handleAddToCart(prod)}
                          className="w-full py-2 rounded-lg bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-black text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag size={12} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Floating Drawers */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CompareDrawer isOpen={compareOpen} onClose={() => setCompareOpen(false)} />
      <QuickViewModal productId={quickViewProductId} onClose={() => setQuickViewProductId(null)} />

      <Footer />
    </div>
  );
};

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <div className="flex gap-1 justify-center items-end h-8">
          <span className="w-1.5 bg-primary-gold rounded animate-[bounce_0.8s_infinite] h-8" />
          <span className="w-1.5 bg-crimson-red rounded animate-[bounce_0.8s_infinite_0.15s] h-6" />
          <span className="w-1.5 bg-primary-gold rounded animate-[bounce_0.8s_infinite_0.3s] h-7" />
        </div>
        <p className="text-xs text-neutral-400 mt-4">Loading Shop Catalog...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
