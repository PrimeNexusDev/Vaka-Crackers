"use client";

import React, { useState } from "react";
import { ShieldCheck, Truck, Percent, FileDown, Briefcase, Calculator, ChevronRight, UserCheck, AlertTriangle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Navbar } from "../../components/Layout/Navbar";
import { Footer } from "../../components/Layout/Footer";
import { CartDrawer } from "../../components/Shop/CartDrawer";
import { WishlistDrawer } from "../../components/Shop/WishlistDrawer";
import { CompareDrawer } from "../../components/Shop/CompareDrawer";

export default function DealerPortal() {
  const { dealerStatus, requestDealerAccess, theme, products, addToCart } = useApp();

  // Registration Form state
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [expectedVolume, setExpectedVolume] = useState("₹20,000 - ₹50,000");

  // Local state to simulate quick admin approval
  const [demoApproved, setDemoApproved] = useState(false);

  // Dialog toggles
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  // Bulk Calculator states
  const [calcItems, setCalcItems] = useState([
    { id: "p13", name: "Royal Diwali Treasure Box", qty: 10, price: 1200, wholesalePrice: 850 },
    { id: "p2", name: "1000 Wala Grand Celebration", qty: 25, price: 490, wholesalePrice: 320 },
    { id: "p4", name: "30cm Golden Ray Sparklers", qty: 50, price: 85, wholesalePrice: 55 }
  ]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !gstin || !ownerName || !phone || !address) {
      alert("Please fill in all registration parameters.");
      return;
    }
    requestDealerAccess({ businessName, gstin, ownerName, phone, address, expectedVolume });
    
    // Auto-approve in 1.5 seconds for a smooth demo!
    setTimeout(() => {
      setDemoApproved(true);
    }, 1500);
  };

  const handleCalcQtyChange = (idx: number, qty: number) => {
    const newItems = [...calcItems];
    newItems[idx].qty = Math.max(0, qty);
    setCalcItems(newItems);
  };

  const calcRetailTotal = calcItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const calcWholesaleTotal = calcItems.reduce((acc, item) => acc + item.wholesalePrice * item.qty, 0);
  const calcSavings = calcRetailTotal - calcWholesaleTotal;

  const handleAddCalcToCart = () => {
    // Add calc items to retail cart with wholesale prices
    calcItems.forEach(item => {
      if (item.qty > 0) {
        // Find actual product in products list
        const realProd = products.find(p => p.id === item.id);
        if (realProd) {
          // Adjust price to wholesale price for the cart (demo simulation)
          const wholesaleProduct = { ...realProd, price: item.wholesalePrice };
          addToCart(wholesaleProduct, item.qty);
        }
      }
    });
    setCartOpen(true);
  };

  const activeStatus = demoApproved ? "approved" : dealerStatus;

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar 
        onOpenCart={() => setCartOpen(true)}
        onOpenCompare={() => setCompareOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title Block */}
        <div className="text-center space-y-2 mb-10">
          <div className="flex justify-center items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            <span>Home</span>
            <ChevronRight size={10} />
            <span className="text-primary-gold">Wholesale Partner Portal</span>
          </div>
          <h1 className="text-2xl font-black font-cinzel text-white uppercase tracking-wider mt-1.5">
            B2B Wholesale Hub
          </h1>
          <p className="text-xs text-neutral-450 max-w-md mx-auto">
            Access direct manufacturer pricing tiers, bulk transport discounts, and customized GST invoices. Minimum wholesale threshold of ₹15,000.
          </p>
        </div>

        {/* Dynamic portal views based on registration status */}
        {activeStatus === "none" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            
            {/* Dealer Benefits */}
            <div className="space-y-6">
              <h2 className="text-lg font-black font-cinzel text-primary-gold uppercase tracking-wider border-b border-neutral-900 pb-2">
                Dealer Privileges & Benefits
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-2">
                  <Percent className="text-primary-gold" size={20} />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Wholesale Price Tiers</h4>
                  <p className="text-[10px] text-neutral-500 leading-relaxed">
                    Extra 25% to 40% discount off standard retail factory rates on bulk orders.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-2">
                  <Truck className="text-primary-gold" size={20} />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Free Bulk Transport</h4>
                  <p className="text-[10px] text-neutral-500 leading-relaxed">
                    Complimentary heavy transport containers directly to your retail shop address.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-2">
                  <ShieldCheck className="text-primary-gold" size={20} />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Priority Supply</h4>
                  <p className="text-[10px] text-neutral-500 leading-relaxed">
                    Guaranteed stock allocations during peak diwali rush times for B2B dealers.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-2">
                  <FileDown className="text-primary-gold" size={20} />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">GST Invoices</h4>
                  <p className="text-[10px] text-neutral-500 leading-relaxed">
                    Download verified GST invoices (Tax Category 18%) for input tax credits.
                  </p>
                </div>
              </div>

              {/* Bulk Interactive Calculator */}
              <div className="p-5 rounded-2xl border border-primary-gold/15 bg-neutral-950 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-primary-gold flex items-center gap-1.5">
                  <Calculator size={14} />
                  B2B Savings Estimator
                </h3>
                
                <div className="space-y-3">
                  {calcItems.map((item, idx) => (
                    <div key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-2 pb-2 border-b border-neutral-900">
                      <div>
                        <p className="font-bold text-white truncate max-w-[200px]">{item.name}</p>
                        <p className="text-[10px] text-neutral-500">Retail: ₹{item.price} | Wholesale B2B: <span className="text-primary-gold font-bold">₹{item.wholesalePrice}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Boxes:</span>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleCalcQtyChange(idx, Number(e.target.value))}
                          className="w-16 py-1 px-2 rounded bg-neutral-900 border border-neutral-800 text-white text-center text-xs font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs pt-2">
                  <div>
                    <span className="text-neutral-500 block">Standard Price: ₹{calcRetailTotal}</span>
                    <span className="text-emerald-400 font-bold block">You Save: ₹{calcSavings}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">B2B Payable</span>
                    <span className="text-sm font-black text-primary-gold block">₹{calcWholesaleTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleAddCalcToCart}
                  className="w-full py-2 px-3 rounded-xl bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Load Wholesale Estimate into Cart
                </button>
              </div>

            </div>

            {/* Registration Form */}
            <div className={`p-6 rounded-2xl border ${
              theme === "dark" ? "bg-neutral-950/80 border-neutral-850" : "bg-white border-neutral-200"
            }`}>
              <h2 className="text-lg font-black font-cinzel text-white uppercase tracking-wider border-b border-neutral-900 pb-2 mb-4">
                Partner Request Form
              </h2>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Business/Shop Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vaka Fireworks Retailers"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">GSTIN / Tax ID Number</label>
                    <input
                      type="text"
                      required
                      placeholder="33AAAAA0000A1Z0"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Owner Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Mobile Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Shop/Delivery Address</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter retail store or warehouse shipping address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Expected Purchase Volume</label>
                  <select
                    value={expectedVolume}
                    onChange={(e) => setExpectedVolume(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold cursor-pointer"
                  >
                    <option>₹15,000 - ₹30,000</option>
                    <option>₹30,000 - ₹75,000</option>
                    <option>₹75,000 - ₹2,00,000</option>
                    <option>₹2,00,000+</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-gold to-primary-gold-hover text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-primary-gold/10"
                >
                  Submit Registration Request
                </button>
              </form>
            </div>

          </div>
        )}

        {activeStatus === "pending" && (
          <div className="max-w-md mx-auto p-6 rounded-2xl border border-primary-gold/25 bg-neutral-950 text-center space-y-4">
            <span className="text-4xl animate-spin block">⏳</span>
            <h3 className="text-sm font-black font-cinzel text-primary-gold uppercase tracking-wider">Verification In Progress</h3>
            <p className="text-xs text-neutral-450 leading-relaxed">
              Your registration under GSTIN <span className="font-bold text-white font-mono">{gstin}</span> is being matched with the Sivakasi Factory Partner Registry.
            </p>
            <div className="p-3 bg-neutral-900 rounded-lg text-[10px] text-neutral-400">
              Note: Demonstration mode will automatically approve your partner access in a couple seconds!
            </div>
          </div>
        )}

        {activeStatus === "approved" && (
          <div className="space-y-8">
            {/* Approved Alert */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center gap-3">
              <UserCheck size={20} className="shrink-0 animate-bounce" />
              <div className="text-xs">
                <span className="font-bold block">✓ B2B Wholesale Account Activated!</span>
                <p className="text-[10px] text-neutral-400 mt-0.5">Welcome partner! Tier 2 factory pricing calculations are active for your address.</p>
              </div>
            </div>

            {/* Dealer Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Col 1: B2B Overview */}
              <div className={`p-5 rounded-2xl border space-y-4 ${
                theme === "dark" ? "bg-neutral-950 border-neutral-850" : "bg-white border-neutral-200"
              }`}>
                <h3 className="text-xs font-black uppercase tracking-wider text-primary-gold font-cinzel">B2B Profile Details</h3>
                <div className="space-y-3 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span>Business Name:</span>
                    <span className="font-bold text-white">{businessName || "Vaka Dealers Chennai"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verified GSTIN:</span>
                    <span className="font-bold text-white font-mono">{gstin || "33AAAAA9281Z9"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pricing Tier:</span>
                    <span className="font-bold text-emerald-400">Tier 2 (Wholesale 35%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Manager:</span>
                    <span className="font-bold text-white">S. Palanivel (Factory Liaison)</span>
                  </div>
                </div>

                <div className="border-t border-neutral-900 pt-4 space-y-2.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Partner Utilities</h4>
                  <button 
                    onClick={() => alert("Downloading latest Sivakasi Excise Tariff GST sheet...")}
                    className="w-full py-2 px-3 rounded-lg bg-neutral-900 border border-neutral-850 hover:bg-neutral-850 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileDown size={12} />
                    Download Bulk Price Excel
                  </button>
                  <button 
                    onClick={() => alert("GST Input invoice templates are available at checkout.")}
                    className="w-full py-2 px-3 rounded-lg bg-neutral-900 border border-neutral-850 hover:bg-neutral-850 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileDown size={12} />
                    Invoice Input Templates
                  </button>
                </div>
              </div>

              {/* Col 2 & 3: B2B Order Grid */}
              <div className={`lg:col-span-2 p-5 rounded-2xl border space-y-4 ${
                theme === "dark" ? "bg-neutral-950 border-neutral-850" : "bg-white border-neutral-200"
              }`}>
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">Wholesale Stock Placement</h3>
                  <span className="text-[10px] font-bold text-primary-gold bg-primary-gold/10 px-2 py-0.5 rounded">
                    Min. Order: ₹15,000
                  </span>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                  {products.map(prod => {
                    const wholesalePrice = Math.round(prod.price * 0.7); // 30% further off for B2B Bestsellers
                    return (
                      <div key={prod.id} className="flex justify-between items-center text-xs pb-2 border-b border-neutral-900/50 gap-4">
                        <div className="flex items-center gap-2 max-w-[60%]">
                          <span>{prod.image}</span>
                          <div className="truncate">
                            <p className="font-bold text-white leading-tight truncate">{prod.name}</p>
                            <p className="text-[9px] text-neutral-500">Retail: ₹{prod.price} | Wholesale: <span className="text-emerald-400 font-bold">₹{wholesalePrice}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-neutral-500 font-mono">Stock: {prod.stock}</span>
                          <button
                            onClick={() => {
                              const wholesaleProd = { ...prod, price: wholesalePrice };
                              addToCart(wholesaleProd, 5); // Add default bundle quantity
                              setCartOpen(true);
                            }}
                            className="py-1 px-2.5 rounded bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold text-[10px] transition-colors"
                          >
                            + Add B2B Pack (5)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CompareDrawer isOpen={compareOpen} onClose={() => setCompareOpen(false)} />
      <Footer />
    </div>
  );
}
