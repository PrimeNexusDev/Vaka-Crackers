"use client";

import React, { useState } from "react";
import { Printer, Download, Search, FileText, ShoppingBag, ChevronRight, Check } from "lucide-react";
import { useApp, Product } from "../../context/AppContext";
import { Navbar } from "../../components/Layout/Navbar";
import { Footer } from "../../components/Layout/Footer";
import { CartDrawer } from "../../components/Shop/CartDrawer";
import { WishlistDrawer } from "../../components/Shop/WishlistDrawer";
import { CompareDrawer } from "../../components/Shop/CompareDrawer";

export default function PriceList() {
  const { products, addToCart, theme } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  // Dialog controls
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  // Success indicator for adding all items of a category
  const [addedCategory, setAddedCategory] = useState<string | null>(null);

  // Group products by category
  const categories = [
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

  // Filtering
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || prod.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleAddCategoryToCart = (categoryName: string) => {
    const categoryProds = products.filter(p => p.category === categoryName && p.stock > 0);
    categoryProds.forEach(prod => {
      addToCart(prod, 1);
    });
    setAddedCategory(categoryName);
    setCartOpen(true);
    setTimeout(() => setAddedCategory(null), 3000);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="no-print">
        <Navbar 
          onOpenCart={() => setCartOpen(true)}
          onOpenCompare={() => setCompareOpen(true)}
          onOpenWishlist={() => setWishlistOpen(true)}
        />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 no-print">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <span>Home</span>
              <ChevronRight size={10} />
              <span className="text-primary-gold">Digital Price List</span>
            </div>
            <h1 className="text-2xl font-black font-cinzel text-white uppercase tracking-wider mt-1.5">
              Digital Factory Catalog
            </h1>
            <p className="text-xs text-neutral-400">
              Download, print, or order direct from Sivakasi. Prices updated daily.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-primary-gold to-primary-gold-hover text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-primary-gold/15"
            >
              <Printer size={14} />
              Print Catalog
            </button>
            <button
              onClick={handlePrint}
              className="py-2 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              Download PDF
            </button>
          </div>
        </div>

        {/* PRINT ONLY BRAND HEADER */}
        <div className="hidden print-only text-center border-b pb-6 mb-8 text-black">
          <h1 className="text-2xl font-black tracking-widest uppercase">VAKA FIREWORKS SIVAKASI</h1>
          <p className="text-xs">142-C, Bypass Road, Paraipatti Area, Sivakasi - 626123</p>
          <p className="text-xs">Phone: +91 98765 43210 | Email: sales@vakacrackers.com</p>
          <h2 className="text-sm font-bold uppercase tracking-wider mt-4">OFFICIAL DIGITAL FACTORY PRICE LIST</h2>
          <p className="text-[10px] text-neutral-600">Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Filter Controls Bar */}
        <div className={`p-4 rounded-2xl border mb-8 flex flex-col md:flex-row gap-4 justify-between items-center no-print ${
          theme === "dark" ? "bg-neutral-950/80 border-neutral-850" : "bg-neutral-50 border-neutral-200"
        }`}>
          {/* Keyword Search */}
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search catalog products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs py-2 pl-9 pr-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:ring-1 focus:ring-primary-gold"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          </div>

          {/* Quick categories navigation scroll */}
          <div className="flex gap-2 w-full overflow-x-auto py-1 scrollbar-none justify-start md:justify-end">
            <button
              onClick={() => setCategoryFilter("All")}
              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors ${
                categoryFilter === "All"
                  ? "bg-primary-gold text-neutral-950"
                  : "bg-neutral-900 text-neutral-400 hover:text-white"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors ${
                  categoryFilter === cat
                    ? "bg-primary-gold text-neutral-950"
                    : "bg-neutral-900 text-neutral-400 hover:text-white"
              }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped Catalog Render */}
        <div className="space-y-10">
          {categories
            .filter(cat => categoryFilter === "All" || cat === categoryFilter)
            .map((catName) => {
              const catProducts = filteredProducts.filter((p) => p.category === catName);
              if (catProducts.length === 0) return null;

              return (
                <div key={catName} className="space-y-4">
                  {/* Category Title Header */}
                  <div className="flex justify-between items-center pb-2 border-b border-primary-gold/15 no-print">
                    <h3 className="text-sm font-black font-cinzel text-primary-gold uppercase tracking-wider">
                      {catName}
                    </h3>
                    <button
                      onClick={() => handleAddCategoryToCart(catName)}
                      className="py-1 px-2.5 rounded bg-primary-gold/10 hover:bg-primary-gold text-primary-gold hover:text-neutral-950 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-primary-gold/30 hover:border-transparent"
                    >
                      {addedCategory === catName ? (
                        <>
                          <Check size={10} />
                          Added Pack!
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={10} />
                          Add Entire Category
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Print Category Title Header */}
                  <h3 className="hidden print-only text-xs font-bold uppercase text-black border-b mt-6">
                    {catName}
                  </h3>

                  {/* Products Price Table */}
                  <div className="overflow-x-auto rounded-xl border border-neutral-900 bg-neutral-950/20 print:border-none print:bg-transparent">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-900 bg-neutral-950/50 print:bg-neutral-100 print:text-black">
                          <th className="p-3 text-neutral-400 font-bold uppercase tracking-wider print:text-black">Product Name</th>
                          <th className="p-3 text-neutral-400 font-bold uppercase tracking-wider text-center print:text-black">Sound Level</th>
                          <th className="p-3 text-neutral-400 font-bold uppercase tracking-wider text-center print:text-black">Age Rating</th>
                          <th className="p-3 text-neutral-400 font-bold uppercase tracking-wider text-right print:text-black">MRP</th>
                          <th className="p-3 text-neutral-400 font-bold uppercase tracking-wider text-right print:text-black">Offer Price</th>
                          <th className="p-3 text-neutral-400 font-bold uppercase tracking-wider text-right print:text-black">Discount</th>
                          <th className="p-3 text-neutral-400 font-bold uppercase tracking-wider text-center no-print">Quick Add</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 print:divide-y print:divide-neutral-200">
                        {catProducts.map((prod) => {
                          const savingsPercent = Math.round(((prod.mrp - prod.price) / prod.mrp) * 100);
                          return (
                            <tr 
                              key={prod.id} 
                              className="hover:bg-neutral-900/10 transition-colors print:text-black"
                            >
                              <td className="p-3 font-medium flex items-center gap-2">
                                <span className="text-lg no-print">{prod.image}</span>
                                <span className="text-white print:text-black">{prod.name}</span>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  prod.soundLevel === "Loud" 
                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                                    : prod.soundLevel === "Eco-Friendly"
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                }`}>
                                  {prod.soundLevel}
                                </span>
                              </td>
                              <td className="p-3 text-center text-neutral-300 print:text-black">{prod.ageGroup}</td>
                              <td className="p-3 text-right text-neutral-500 line-through">₹{prod.mrp}</td>
                              <td className="p-3 text-right font-black text-primary-gold">₹{prod.price}</td>
                              <td className="p-3 text-right font-bold text-emerald-400">{savingsPercent}% OFF</td>
                              <td className="p-3 text-center no-print">
                                <button
                                  onClick={() => addToCart(prod, 1)}
                                  className="py-1 px-2.5 rounded bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold text-[10px] transition-colors"
                                >
                                  Add
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      {/* Floating Drawers */}
      <div className="no-print">
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
        <CompareDrawer isOpen={compareOpen} onClose={() => setCompareOpen(false)} />
        <Footer />
      </div>
    </div>
  );
}
