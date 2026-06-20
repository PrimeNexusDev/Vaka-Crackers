"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Award, ShieldCheck, Zap, ArrowRight, Play, Eye, 
  ShoppingBag, Heart, GitCompare, ChevronLeft, ChevronRight, 
  CheckCircle, MessageSquare, AlertCircle, RefreshCw, X, Volume2 
} from "lucide-react";

import { useApp, Product } from "../context/AppContext";
import { AnnouncementBar } from "../components/Layout/AnnouncementBar";
import { Navbar } from "../components/Layout/Navbar";
import { Footer } from "../components/Layout/Footer";
import { FireworksCanvas } from "../components/Animations/FireworksCanvas";
import { CrackersAssistant } from "../components/AI/CrackersAssistant";
import { CartDrawer } from "../components/Shop/CartDrawer";
import { WishlistDrawer } from "../components/Shop/WishlistDrawer";
import { CompareDrawer } from "../components/Shop/CompareDrawer";
import { QuickViewModal } from "../components/Shop/QuickViewModal";

export default function Home() {
  const router = useRouter();
  const { 
    products, addToCart, wishlist, toggleWishlist, compareList, 
    toggleCompare, theme, timerEnabled, timerTargetDate 
  } = useApp();

  // Dialog & Drawer toggles
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  // Active Category filter
  const [activeCategory, setActiveCategory] = useState("All");

  // Quantities selected per product
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timerMounted, setTimerMounted] = useState(false);

  // Popups state
  const [showFloatingOffer, setShowFloatingOffer] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExit, setHasShownExit] = useState(false);

  // Product Showcase Gallery active index
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Review Slider State
  const [reviewIndex, setReviewIndex] = useState(0);

  // Mount effects
  useEffect(() => {
    setTimerMounted(true);
    
    // Floating Offer Popup timer (shows after 6 seconds)
    const offerTimer = setTimeout(() => {
      setShowFloatingOffer(true);
    }, 6000);

    // Exit intent listener
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 50 && !hasShownExit) {
        setShowExitIntent(true);
        setHasShownExit(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(offerTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShownExit]);

  // Countdown calculation
  useEffect(() => {
    if (!timerEnabled) return;

    const interval = setInterval(() => {
      const target = new Date(timerTargetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEnabled, timerTargetDate]);

  // Categories
  const categoriesList = [
    { name: "One Sound Crackers", count: 6, icon: "🎆" },
    { name: "Sparklers", count: 4, icon: "✨" },
    { name: "Fancy Crackers", count: 4, icon: "🌈" },
    { name: "Rockets", count: 4, icon: "🚀" },
    { name: "Flower Pots", count: 4, icon: "🎇" },
    { name: "Atom Bombs", count: 3, icon: "💥" },
    { name: "Gift Boxes", count: 3, icon: "🎁" },
    { name: "Kids Special", count: 4, icon: "👶" },
    { name: "Multi Shots", count: 3, icon: "🎊" },
    { name: "Premium Collection", count: 3, icon: "🔥" }
  ];

  // Best Sellers Products
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  // Customer Reviews
  const reviews = [
    { name: "Rajesh Kumar", rating: 5, comment: "Ordered the Royal Diwali Box. Every single item exploded beautifully. The packing was outstandingly safe and neat. WhatsApp billing process was super fast!" },
    { name: "Priya Sundar", rating: 5, comment: "Direct factory pricing from Sivakasi saved me thousands this year! The sparklers are completely eco-friendly and produce very little smoke, perfect for my kids." },
    { name: "Anand Sharma", rating: 5, comment: "The 120 Shots Grand Celebration is worth every rupee! It filled the night sky with gorgeous patterns. Will buy exclusively from Vaka Crackers next year." }
  ];

  // Showcase Products list
  const showcaseProducts = products.filter(p => p.category === "Fancy Crackers" || p.category === "Premium Collection").slice(0, 3);
  const currentShowcase = showcaseProducts[showcaseIndex] || products[0];

  const handleQtyChange = (prodId: string, val: number) => {
    setQuantities(prev => ({ ...prev, [prodId]: Math.max(1, val) }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    // Reset quantity selection
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    setCartOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    setCartOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Dynamic Interactive Fireworks Background */}
      <FireworksCanvas />

      {/* Offers marquee bar */}
      <AnnouncementBar />

      {/* Header navbar */}
      <Navbar 
        onOpenCart={() => setCartOpen(true)}
        onOpenCompare={() => setCompareOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-32 flex items-center">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[350px] bg-primary-gold/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-crimson-red/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Diwali Sparkle Badges */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-gold/10 border border-primary-gold/30 text-primary-gold text-[10px] font-black uppercase tracking-widest mb-6 animate-pulse">
            <Sparkles size={12} />
            Sivakasi Licensed Manufacturer
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-cinzel leading-tight tracking-wider text-white">
            Celebrate Every Moment <br />
            <span className="text-gold-gradient">With Premium Sivakasi Crackers</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl mx-auto text-xs sm:text-sm text-neutral-400 font-medium tracking-wide leading-relaxed">
            Original Products | Maximum Discount | Direct Supply from Sivakasi Factories. <br />
            Make your festivals louder, colorful, and safer with our premium collection.
          </p>

          {/* Hero CTAs */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/price-list"
              className="px-6 py-3 rounded-xl border border-primary-gold/30 hover:border-primary-gold bg-neutral-950/70 hover:bg-neutral-900 text-primary-gold font-bold text-xs uppercase tracking-widest transition-all"
            >
              View Price List
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3 rounded-xl bg-gradient-to-tr from-primary-gold via-primary-gold-hover to-crimson-red hover:from-primary-gold hover:to-crimson-red text-neutral-950 hover:text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary-gold/20"
            >
              Shop Now
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hello%20Vaka%20Crackers%2C%20I%20want%20to%20place%20a%20new%20order."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/10"
            >
              <MessageSquare size={14} className="fill-white" />
              WhatsApp Order
            </a>
          </div>

          {/* Badges Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-neutral-900 pt-8 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-primary-gold shrink-0" size={18} />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Original Products</h4>
                <p className="text-[9px] text-neutral-500">100% Sivakasi Certified</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="text-primary-gold shrink-0" size={18} />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Direct Supply</h4>
                <p className="text-[9px] text-neutral-500">No middle-men pricing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="text-primary-gold shrink-0" size={18} />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Safe Packing</h4>
                <p className="text-[9px] text-neutral-500">Premium wooden-box protection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="text-primary-gold shrink-0" size={18} />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Mega Discounts</h4>
                <p className="text-[9px] text-neutral-500">Save up to 90% direct</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 border-t border-neutral-900 bg-neutral-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl font-black font-cinzel text-white uppercase tracking-wider">
              Explore Our Categories
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              From dazzling aerial multi-shots to kids-safe sparkles, discover Sivakasi\'s finest collections.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categoriesList.map((cat) => (
              <div
                key={cat.name}
                onClick={() => router.push(`/shop?category=${encodeURIComponent(cat.name)}`)}
                className="group relative rounded-2xl border border-neutral-900 bg-neutral-900/40 hover:border-primary-gold/30 hover:bg-neutral-950 p-4 text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-gold/5 to-crimson-red/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-3xl block mb-2 transition-transform group-hover:scale-110 group-hover:rotate-6">{cat.icon}</span>
                <h4 className="text-xs font-bold text-white group-hover:text-primary-gold transition-colors truncate">
                  {cat.name}
                </h4>
                <span className="text-[10px] text-neutral-500 mt-0.5 block">{cat.count} Items available</span>
                
                <button className="mt-3 text-[9px] font-black uppercase text-primary-gold underline opacity-0 group-hover:opacity-100 transition-all">
                  View Products
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE PRODUCT GALLERY / SHOWCASE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-primary-gold/15 bg-neutral-950/60 p-6 md:p-10 flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
          
          {/* Gallery display panel */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="aspect-square w-full rounded-2xl bg-neutral-900 flex items-center justify-center relative p-8 group overflow-hidden border border-neutral-850">
              <span className="text-9xl select-none animate-float">{currentShowcase.image}</span>
              
              {/* Play video overlay button */}
              <button
                onClick={() => setShowVideoModal(true)}
                className="absolute bottom-4 right-4 py-2 px-3 rounded-lg bg-neutral-950/90 hover:bg-primary-gold hover:text-neutral-950 border border-primary-gold/25 hover:border-transparent text-primary-gold text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg"
              >
                <Play size={10} className="fill-current" />
                Play Burst Video
              </button>

              <span className="absolute top-4 left-4 bg-primary-gold text-neutral-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                Showcase
              </span>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-3 justify-center">
              {showcaseProducts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setShowcaseIndex(idx)}
                  className={`h-14 w-14 rounded-xl border flex items-center justify-center text-xl transition-all ${
                    showcaseIndex === idx 
                      ? "border-primary-gold bg-primary-gold/15 scale-105" 
                      : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                  }`}
                >
                  {p.image}
                </button>
              ))}
            </div>
          </div>

          {/* Details panel */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <span className="text-[10px] font-bold text-primary-gold uppercase tracking-widest">Featured Collection</span>
              <h3 className="text-xl md:text-3xl font-black font-cinzel text-white mt-1 leading-snug">
                {currentShowcase.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                {currentShowcase.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-neutral-900 py-4 text-xs">
              <div>
                <span className="text-neutral-500 block">Sound Rating</span>
                <span className="text-white font-bold block mt-0.5">{currentShowcase.soundLevel} Effect</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Safety Category</span>
                <span className="text-white font-bold block mt-0.5">Approved for {currentShowcase.ageGroup}</span>
              </div>
            </div>

            {/* Price list */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-primary-gold">₹{currentShowcase.price}</span>
              <span className="text-sm text-neutral-500 line-through">₹{currentShowcase.mrp}</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                Save 80% Direct From Sivakasi
              </span>
            </div>

            {/* CTAs */}
            <div className="flex gap-4">
              <button
                onClick={() => handleAddToCart(currentShowcase)}
                className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 border border-neutral-850 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-850"
              >
                <ShoppingBag size={14} />
                Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow(currentShowcase)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-gold to-primary-gold-hover text-neutral-950 font-black text-xs uppercase tracking-wider"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLERS SECTION */}
      <section className="py-16 bg-neutral-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-black font-cinzel text-white uppercase tracking-wider">
                Trending Bestsellers
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Top-rated favorites ordered directly from Sivakasi factory. Highly discounts apply.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase text-primary-gold hover:text-white flex items-center gap-1 shrink-0"
            >
              Explore Full Shop <ArrowRight size={12} />
            </Link>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((prod) => {
              const discount = Math.round(((prod.mrp - prod.price) / prod.mrp) * 100);
              const isWish = wishlist.includes(prod.id);
              const isComp = compareList.includes(prod.id);
              const qty = quantities[prod.id] || 1;

              return (
                <div
                  key={prod.id}
                  className="group relative rounded-2xl border border-neutral-900 bg-neutral-900/30 p-4 flex flex-col justify-between transition-all duration-300 hover:border-primary-gold/30 hover:bg-neutral-950"
                >
                  <div>
                    {/* Visual box */}
                    <div className="aspect-square w-full bg-neutral-900 rounded-xl flex items-center justify-center relative p-6 mb-4 overflow-hidden border border-neutral-850">
                      <span className="text-6xl select-none group-hover:scale-110 transition-transform duration-300">{prod.image}</span>
                      
                      {/* Action hover overlays */}
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

                      {/* Floating Discount tag */}
                      <span className="absolute top-2.5 left-2.5 bg-crimson-red text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                        {discount}% OFF
                      </span>
                    </div>

                    {/* Metadata */}
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

                  {/* Buy workflow */}
                  <div className="mt-4 pt-3 border-t border-neutral-900 space-y-3">
                    {/* Qty and QuickView row */}
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
        </div>
      </section>

      {/* MEGA DISCOUNT SECTION & COUNTDOWN TIMER */}
      {timerEnabled && (
        <section className="py-16 border-y border-primary-gold/15 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-primary-gold uppercase tracking-widest">Hurry Up! Time is Ticking</span>
              <h2 className="text-2xl md:text-4xl font-black font-cinzel text-white uppercase tracking-wider">
                Festival Mega Discount Sale
              </h2>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Get up to 90% direct wholesale discount on premium products. Offers close in:
              </p>
            </div>

            {/* Countdown Grid */}
            {timerMounted && (
              <div className="flex justify-center gap-4 max-w-lg mx-auto">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" }
                ].map((unit) => (
                  <div key={unit.label} className="w-16 sm:w-20 bg-neutral-950 border border-primary-gold/25 p-3 rounded-2xl">
                    <span className="block text-xl sm:text-3xl font-black text-primary-gold font-mono leading-none">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                    <span className="block text-[9px] font-bold uppercase text-neutral-400 mt-1">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Promo banner cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-950/60">
                <span className="text-2xl font-black text-primary-gold">90% OFF</span>
                <p className="text-[10px] text-neutral-400 mt-1">One Sound Strings</p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-950/60">
                <span className="text-2xl font-black text-primary-gold">85% OFF</span>
                <p className="text-[10px] text-neutral-400 mt-1">Sparklers & Pots</p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-950/60">
                <span className="text-2xl font-black text-primary-gold">Combo Pack</span>
                <p className="text-[10px] text-neutral-400 mt-1">Royal Assortment Box</p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-950/60">
                <span className="text-2xl font-black text-primary-gold">Free Ship</span>
                <p className="text-[10px] text-neutral-400 mt-1">Orders above ₹5,000</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-black font-cinzel text-white uppercase tracking-wider">
            Why Choose Vaka Fireworks
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Safeguarding your celebrations since 1995 with Sivakasi\'s finest, licensed craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-neutral-900 bg-neutral-900/20 text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-primary-gold/10 text-primary-gold flex items-center justify-center mx-auto border border-primary-gold/20">
              <Award size={18} />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Sivakasi Manufacturer</h4>
            <p className="text-[11px] text-neutral-450 leading-relaxed">
              We own licensed production units in Sivakasi. Our products bypass distributors, meaning you buy at real cost.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-neutral-900 bg-neutral-900/20 text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-primary-gold/10 text-primary-gold flex items-center justify-center mx-auto border border-primary-gold/20">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Original & Safe Products</h4>
            <p className="text-[11px] text-neutral-450 leading-relaxed">
              Tested formulations designed for stability, low smoke emissions, and bright, spectacular coloring.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-neutral-900 bg-neutral-900/20 text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-primary-gold/10 text-primary-gold flex items-center justify-center mx-auto border border-primary-gold/20">
              <Zap size={18} />
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Waterproof Safe Packing</h4>
            <p className="text-[11px] text-neutral-450 leading-relaxed">
              Every parcel is protected inside premium high-density wooden dust crates preventing heat-shocks and humidity.
            </p>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="py-16 bg-neutral-950/45">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-black font-cinzel text-white uppercase tracking-wider">
              Customer Feedbacks
            </h2>
            <p className="text-xs text-neutral-400">
              Hear what our verified families and corporate organizers say about their experience.
            </p>
          </div>

          {/* Testimonial card */}
          <div className="relative p-6 rounded-2xl border border-neutral-850 bg-neutral-950 max-w-xl mx-auto text-left space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-primary-gold">{reviews[reviewIndex].name}</h4>
              <div className="text-xs text-primary-gold">★★★★★</div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed italic">
              " {reviews[reviewIndex].comment} "
            </p>
            {/* Slide triggers */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReviewIndex(prev => (prev === 0 ? reviews.length - 1 : prev - 1))}
                className="p-1 border border-neutral-850 hover:border-neutral-600 rounded text-neutral-400 hover:text-white"
              >
                <ChevronLeft size={12} />
              </button>
              <button
                onClick={() => setReviewIndex(prev => (prev === reviews.length - 1 ? 0 : prev + 1))}
                className="p-1 border border-neutral-850 hover:border-neutral-600 rounded text-neutral-400 hover:text-white"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER PROCESS TIMELINE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-black font-cinzel text-white uppercase tracking-wider">
            Our Ordering Process
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Order seamlessly through WhatsApp direct verification in 5 simple stages.
          </p>
        </div>

        {/* Steps flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center relative">
          {[
            { step: "01", name: "Browse Products", desc: "Select high-quality items from shop" },
            { step: "02", name: "Add to Cart", desc: "Compile items, apply promo codes" },
            { step: "03", name: "Confirm Details", desc: "Fill in name, phone, and address" },
            { step: "04", name: "WhatsApp Verification", desc: "Send cart text directly to sales team" },
            { step: "05", name: "Safe Delivery", desc: "Secure parcel shipped from Sivakasi factory" }
          ].map((item, idx) => (
            <div key={item.step} className="p-4 rounded-xl border border-neutral-900 bg-neutral-900/10 space-y-2 relative">
              <span className="text-xs font-black text-primary-gold block font-mono">{item.step}</span>
              <h4 className="text-xs font-bold text-white">{item.name}</h4>
              <p className="text-[10px] text-neutral-500 leading-relaxed">{item.desc}</p>
              {idx < 4 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-primary-gold/20 -z-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING OFFER POPUP */}
      {showFloatingOffer && (
        <div className="fixed bottom-24 left-4 z-40 max-w-xs p-4 rounded-2xl border border-primary-gold/30 bg-neutral-950 text-white shadow-2xl animate-fade-in no-print">
          <button
            onClick={() => setShowFloatingOffer(false)}
            className="absolute top-2 right-2 text-neutral-500 hover:text-white"
          >
            <X size={14} />
          </button>
          <div className="flex gap-3 items-start">
            <span className="text-2xl shrink-0">🎁</span>
            <div>
              <h4 className="text-xs font-bold text-primary-gold font-cinzel uppercase tracking-wider">Festival Welcome Offer</h4>
              <p className="text-[10px] text-neutral-400 mt-1 leading-tight">
                Get an extra 10% off your entire cart! Apply coupon code:
              </p>
              <span className="inline-block bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded text-[10px] text-white font-mono font-bold mt-2">
                WELCOME10
              </span>
            </div>
          </div>
        </div>
      )}

      {/* EXIT INTENT POPUP */}
      {showExitIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm no-print">
          <div className="relative w-full max-w-md rounded-2xl border border-primary-gold/45 bg-neutral-950 p-6 text-center space-y-4">
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X size={16} />
            </button>
            <span className="text-4xl block">🔥</span>
            <h3 className="text-sm font-black font-cinzel text-primary-gold uppercase tracking-widest">
              Don\'t Leave empty handed!
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
              Sivakasi factory discounts are ending soon! Complete your purchase now and save up to 90%. Use this code at checkout:
            </p>
            <div className="bg-neutral-900 border border-neutral-850 p-2.5 rounded-xl text-xs text-white font-mono font-black max-w-xs mx-auto">
              DIWALI90
            </div>
            <button
              onClick={() => {
                setShowExitIntent(false);
                router.push("/shop");
              }}
              className="w-full py-2.5 rounded-lg bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Back to Shop Catalog
            </button>
          </div>
        </div>
      )}

      {/* VIDEO MOCK LIGHTBOX MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md no-print">
          <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-primary-gold/30 bg-black">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-neutral-950/60 hover:bg-neutral-900 text-white"
            >
              <X size={18} />
            </button>

            {/* Simulated Firework burst looping animation */}
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 bg-neutral-950" />
              {/* Dynamic canvas loop inside lightbox */}
              <div className="absolute w-[300px] h-[300px] bg-primary-gold/15 rounded-full blur-[80px] animate-[pulse-gold_3s_infinite]" />
              <div className="absolute w-[200px] h-[200px] bg-crimson-red/15 rounded-full blur-[60px] animate-[pulse-gold_3s_infinite_1.5s] top-1/4 left-1/4" />
              
              <div className="z-10 text-center space-y-3 text-white">
                <span className="text-5xl animate-bounce inline-block">✨🎇⚡🎆</span>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary-gold font-cinzel">
                  {currentShowcase.name} Burst Loop
                </h4>
                <p className="text-[10px] text-neutral-500 max-w-xs mx-auto">
                  Demonstrating beautiful gold trailing chrysanthemums rising to 12 feet high.
                </p>
                <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">
                  <Volume2 size={10} /> Simulated Sound Active
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chatbot Assistant */}
      <CrackersAssistant />

      {/* Floating Drawers & Lightboxes */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CompareDrawer isOpen={compareOpen} onClose={() => setCompareOpen(false)} />
      <QuickViewModal productId={quickViewProductId} onClose={() => setQuickViewProductId(null)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
