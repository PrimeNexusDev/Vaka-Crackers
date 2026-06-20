"use client";

import React from "react";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlist, products, toggleWishlist, addToCart, theme } = useApp();

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end no-print">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />

      {/* Drawer */}
      <div className={`relative w-full max-w-md h-full flex flex-col shadow-2xl border-l transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-neutral-950 border-neutral-850 text-white" 
          : "bg-white border-neutral-200 text-neutral-900"
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-primary-gold/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="text-crimson-red fill-crimson-red" size={20} />
            <h2 className="text-sm font-black font-cinzel text-primary-gold uppercase tracking-wider">Your Wishlist</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
              <span className="text-4xl text-neutral-600">❤️</span>
              <p className="text-xs text-neutral-400 font-medium">Your wishlist is empty.</p>
              <button
                onClick={onClose}
                className="py-2 px-4 rounded-lg bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold text-xs transition-colors"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistedProducts.map((prod) => {
                const discount = Math.round(((prod.mrp - prod.price) / prod.mrp) * 100);
                return (
                  <div
                    key={prod.id}
                    className={`p-3 rounded-xl border flex gap-3 items-center justify-between ${
                      theme === "dark" 
                        ? "bg-neutral-900/60 border-neutral-800" 
                        : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    {/* Thumbnail */}
                    <span className="text-2xl h-10 w-10 shrink-0 bg-neutral-950 rounded-lg flex items-center justify-center">
                      {prod.image}
                    </span>

                    {/* Information */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate leading-tight">{prod.name}</h4>
                      <p className="text-[10px] text-neutral-400">{prod.category}</p>
                      
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-black text-primary-gold">₹{prod.price}</span>
                        <span className="text-[10px] text-neutral-500 line-through">₹{prod.mrp}</span>
                        <span className="text-[9px] text-emerald-400 font-bold bg-emerald-400/10 px-1 rounded">
                          {discount}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => toggleWishlist(prod.id)}
                        className="text-neutral-500 hover:text-rose-500 p-1"
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>

                      <button
                        onClick={() => {
                          addToCart(prod, 1);
                          toggleWishlist(prod.id);
                        }}
                        className="py-1 px-2 flex items-center gap-1 rounded bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold text-[10px] transition-colors"
                      >
                        <ShoppingBag size={10} />
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
    </div>
  );
};
