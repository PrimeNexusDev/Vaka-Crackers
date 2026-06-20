"use client";

import React from "react";
import { X, ShoppingBag, GitCompare } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({ isOpen, onClose }) => {
  const { compareList, products, toggleCompare, addToCart, theme } = useApp();

  if (!isOpen) return null;

  const comparedProducts = products.filter((p) => compareList.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 md:p-6 no-print">
      {/* Overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />

      {/* Panel */}
      <div className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl p-5 flex flex-col max-h-[90vh] transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-neutral-950 border-neutral-850 text-white" 
          : "bg-white border-neutral-200 text-neutral-900"
      }`}>
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-primary-gold/15 mb-4">
          <div className="flex items-center gap-2">
            <GitCompare className="text-primary-gold" size={18} />
            <h3 className="text-sm font-black font-cinzel text-primary-gold uppercase tracking-wider">
              Compare Products ({comparedProducts.length}/3)
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto space-y-4">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              No products selected for comparison. Add items to compare list from the shop!
            </div>
          ) : (
            <div className="min-w-[600px] grid grid-cols-4 gap-4 text-xs">
              {/* Labels Col */}
              <div className="font-bold space-y-8 text-neutral-400 pt-32">
                <div className="h-6">Category</div>
                <div className="h-6">MRP</div>
                <div className="h-6">Offer Price</div>
                <div className="h-6">Sound Level</div>
                <div className="h-6">Age Recommendation</div>
                <div className="h-12">Description</div>
                <div className="h-6">Action</div>
              </div>

              {/* Product Columns */}
              {comparedProducts.map((prod) => (
                <div key={prod.id} className="relative border border-primary-gold/10 p-3 rounded-xl bg-neutral-900/40 text-center space-y-8">
                  {/* Remove Button */}
                  <button
                    onClick={() => toggleCompare(prod.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-neutral-800 text-neutral-400 hover:text-rose-500 rounded"
                    title="Remove from comparison"
                  >
                    <X size={12} />
                  </button>

                  {/* Header info */}
                  <div className="h-28 flex flex-col justify-between items-center pb-2 border-b border-neutral-800">
                    <span className="text-3xl">{prod.image}</span>
                    <h4 className="font-bold text-xs truncate max-w-full text-white">{prod.name}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-primary-gold font-bold">★ {prod.rating}</span>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="h-6 text-neutral-200">{prod.category}</div>
                  <div className="h-6 text-neutral-500 line-through">₹{prod.mrp}</div>
                  <div className="h-6 font-black text-primary-gold text-sm">₹{prod.price}</div>
                  <div className="h-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      prod.soundLevel === "Loud" 
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                        : prod.soundLevel === "Eco-Friendly"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {prod.soundLevel}
                    </span>
                  </div>
                  <div className="h-6 text-neutral-300 font-medium">{prod.ageGroup}</div>
                  <div className="h-12 text-[10px] text-neutral-400 overflow-y-auto leading-relaxed scrollbar-none px-1">
                    {prod.description}
                  </div>

                  {/* Add to Cart button */}
                  <div className="h-6">
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="w-full py-1.5 rounded-lg bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <ShoppingBag size={12} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}

              {/* Pad remaining empty slots to fit grid */}
              {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                <div key={i} className="border border-dashed border-neutral-800 rounded-xl flex items-center justify-center h-full min-h-[350px] text-neutral-600 text-xs">
                  Empty Slot
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
