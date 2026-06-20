"use client";

import React, { useState } from "react";
import { X, ShoppingBag, Heart, GitCompare, ChevronRight, ShieldCheck, RefreshCw } from "lucide-react";
import { useApp, Product } from "../../context/AppContext";

interface QuickViewModalProps {
  productId: string | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ productId, onClose }) => {
  const { products, addToCart, toggleWishlist, toggleCompare, wishlist, compareList, theme } = useApp();
  const [quantity, setQuantity] = useState(1);

  if (!productId) return null;

  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    // Direct checkout trigger: in a production app this would redirect to checkout, 
    // here we'll just let them open the cart drawer which is already pre-configured.
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 no-print">
      {/* Overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
      />

      {/* Modal Dialog */}
      <div className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-neutral-950 border-neutral-850 text-white" 
          : "bg-white border-neutral-200 text-neutral-900"
      }`}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Product Visual Area */}
        <div className="md:w-1/2 bg-neutral-900 flex items-center justify-center p-12 min-h-[300px] relative">
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          <span className="text-8xl select-none animate-float relative z-10">{product.image}</span>
          
          {/* Discount Badge */}
          <span className="absolute top-4 left-4 bg-crimson-red text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Product details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-primary-gold uppercase tracking-widest">
                {product.category}
              </span>
              <h2 className="text-lg font-black font-cinzel text-white mt-1 leading-snug">
                {product.name}
              </h2>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex text-primary-gold text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-[10px] text-neutral-400 font-bold">({product.rating} Customer Rating)</span>
              </div>
            </div>

            {/* Price list */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-xl font-black text-primary-gold">₹{product.price}</span>
              <span className="text-xs text-neutral-500 line-through">₹{product.mrp}</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded">
                Direct Sivakasi Price
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-400 leading-relaxed">
              {product.description}
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-900 text-xs">
              <div className="flex justify-between items-center bg-neutral-900/50 p-2 rounded-lg border border-neutral-850">
                <span className="text-neutral-500 font-medium">Sound Level:</span>
                <span className="font-bold text-white">{product.soundLevel}</span>
              </div>
              <div className="flex justify-between items-center bg-neutral-900/50 p-2 rounded-lg border border-neutral-850">
                <span className="text-neutral-500 font-medium">Age Group:</span>
                <span className="font-bold text-white">{product.ageGroup}</span>
              </div>
            </div>

            {/* Stock status indicator */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`h-2.5 w-2.5 rounded-full ${product.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              <span className={product.stock > 0 ? "text-emerald-400 font-bold" : "text-rose-500"}>
                {product.stock > 0 ? `In Stock (${product.stock} boxes remaining)` : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-4 border-t border-neutral-900 space-y-4">
            <div className="flex items-center justify-between gap-4">
              {/* Qty Selector */}
              <div className="flex items-center border border-neutral-800 rounded-xl px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-white text-neutral-400 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-black text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-white text-neutral-400 text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Utility shortcuts */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isWishlisted 
                      ? "bg-rose-500/10 border-rose-500/40 text-rose-400" 
                      : "border-neutral-800 hover:text-white text-neutral-400"
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart size={14} className={isWishlisted ? "fill-rose-500" : ""} />
                </button>
                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isCompared 
                      ? "bg-primary-gold/10 border-primary-gold/40 text-primary-gold" 
                      : "border-neutral-800 hover:text-white text-neutral-400"
                  }`}
                  title="Compare Product"
                >
                  <GitCompare size={14} />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-white font-bold text-xs flex items-center justify-center gap-2 border border-neutral-800 transition-colors"
              >
                <ShoppingBag size={14} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-gold to-primary-gold-hover text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-primary-gold/10"
              >
                Instant Order
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
