"use client";

import React, { useState } from "react";
import { Search, MapPin, Truck, Box, Calendar, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Navbar } from "../../components/Layout/Navbar";
import { Footer } from "../../components/Layout/Footer";
import { CartDrawer } from "../../components/Shop/CartDrawer";
import { WishlistDrawer } from "../../components/Shop/WishlistDrawer";
import { CompareDrawer } from "../../components/Shop/CompareDrawer";

export default function TrackOrder() {
  const { orders, theme } = useApp();
  const [orderIdInput, setOrderIdInput] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Dialog toggles
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  // Mock demo order in case no orders exist
  const demoOrder = {
    id: "VC-100284",
    customerName: "Siddharth Raj",
    phone: "+91 98765 00112",
    address: "Flat 4B, Skyview Towers, T-Nagar, Chennai, 600017",
    items: [
      { productName: "1000 Wala Grand Celebration", quantity: 1, price: 490 },
      { productName: "Royal Diwali Treasure Box", quantity: 1, price: 1200 },
      { productName: "30cm Golden Ray Sparklers", quantity: 3, price: 85 }
    ],
    total: 2294, // including GST
    status: "Packed" as const,
    createdAt: new Date().toISOString()
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    // Look up in context orders
    const matched = orders.find(
      (o) => o.id.toUpperCase() === orderIdInput.trim().toUpperCase()
    );

    if (matched) {
      setSearchedOrder(matched);
      setErrorMsg("");
    } else if (orderIdInput.trim().toUpperCase() === "VC-100284") {
      setSearchedOrder(demoOrder);
      setErrorMsg("");
    } else {
      setSearchedOrder(null);
      setErrorMsg("No order found with this tracking ID. Try 'VC-100284' for a live demo!");
    }
  };

  const trackingStages = [
    { name: "Placed", desc: "Order details received" },
    { name: "Confirmed", desc: "Payment verified by factory" },
    { name: "Packed", desc: "Securely boxed in wood crates" },
    { name: "Shipped", desc: "Dispatched via Sivakasi Transport" },
    { name: "Delivered", desc: "Arrived at destination address" }
  ];

  const getStatusIndex = (status: string) => {
    switch (status) {
      case "Placed": return 0;
      case "Confirmed": return 1;
      case "Packed": return 2;
      case "Shipped": return 3;
      case "Delivered": return 4;
      default: return 0;
    }
  };

  const currentStatusIndex = searchedOrder ? getStatusIndex(searchedOrder.status) : 0;

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar 
        onOpenCart={() => setCartOpen(true)}
        onOpenCompare={() => setCompareOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="text-center space-y-2 mb-10">
          <div className="flex justify-center items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            <span>Home</span>
            <ChevronRight size={10} />
            <span className="text-primary-gold">Order Tracking</span>
          </div>
          <h1 className="text-2xl font-black font-cinzel text-white uppercase tracking-wider mt-1.5">
            Track Delivery Status
          </h1>
          <p className="text-xs text-neutral-450 max-w-sm mx-auto">
            Enter your Vaka Crackers tracking ID (e.g. VC-XXXXXX) to monitor real-time packing and transport dispatch stages.
          </p>
        </div>

        {/* Tracking Search Input Form */}
        <form onSubmit={handleTrackSubmit} className="max-w-md mx-auto mb-10">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. VC-100284)"
                value={orderIdInput}
                onChange={(e) => {
                  setOrderIdInput(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:ring-1 focus:ring-primary-gold"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors"
            >
              Track
            </button>
          </div>
          {errorMsg && (
            <p className="text-[10px] text-rose-500 mt-2 flex items-center gap-1">
              <AlertCircle size={10} />
              {errorMsg}
            </p>
          )}
        </form>

        {/* Tracking Output Block */}
        {searchedOrder ? (
          <div className={`rounded-2xl border p-6 space-y-8 ${
            theme === "dark" ? "bg-neutral-950/80 border-neutral-850" : "bg-neutral-50 border-neutral-200"
          }`}>
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-neutral-900 gap-4">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Tracking Code</span>
                <h3 className="text-sm font-black text-primary-gold mt-0.5">{searchedOrder.id}</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Estimated Delivery</span>
                  <span className="text-xs font-bold text-white block mt-0.5">3-5 Business Days</span>
                </div>
                <div className="p-2.5 rounded-xl bg-primary-gold/10 border border-primary-gold/25 text-primary-gold">
                  <Truck size={18} />
                </div>
              </div>
            </div>

            {/* Horizontal Timeline Tracker */}
            <div className="py-6">
              {/* Timeline bar */}
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-900 -translate-y-1/2 -z-15" />
                
                {/* Completed colored bar */}
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary-gold to-crimson-red -translate-y-1/2 -z-10 transition-all duration-500" 
                  style={{ width: `${(currentStatusIndex / (trackingStages.length - 1)) * 100}%` }}
                />

                <div className="flex justify-between items-center relative z-10">
                  {trackingStages.map((stage, idx) => {
                    const isCompleted = idx <= currentStatusIndex;
                    const isActive = idx === currentStatusIndex;
                    
                    return (
                      <div key={stage.name} className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all ${
                          isCompleted 
                            ? "bg-gradient-to-tr from-primary-gold to-crimson-red border-transparent text-neutral-950" 
                            : "bg-neutral-950 border-neutral-800 text-neutral-500"
                        }`}>
                          {isCompleted ? <CheckCircle2 size={16} className="text-white" /> : <span>{idx + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-bold mt-2 ${isCompleted ? "text-primary-gold" : "text-neutral-500"}`}>
                          {stage.name}
                        </span>
                        <span className="text-[8px] text-neutral-500 hidden sm:block mt-0.5 max-w-[80px] text-center">
                          {stage.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary Grid details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-900">
              {/* Column 1: Consignee */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Shipping Details</h4>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-white">{searchedOrder.customerName}</p>
                  <p className="text-neutral-400">{searchedOrder.phone}</p>
                  <p className="text-neutral-400 leading-relaxed mt-1">{searchedOrder.address}</p>
                </div>
              </div>

              {/* Column 2: Items list */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Items Package Summary</h4>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2">
                  {searchedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400 truncate max-w-[70%]">✓ {item.productName}</span>
                      <span className="text-white font-bold shrink-0">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-900 pt-2 flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-bold uppercase tracking-wider">Amount paid (GST incl.):</span>
                  <span className="text-primary-gold font-black">₹{searchedOrder.total}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 border border-neutral-900 border-dashed rounded-2xl max-w-md mx-auto p-4 space-y-2">
            <Calendar className="mx-auto text-neutral-600" size={32} />
            <h4 className="text-xs font-bold text-white">No Order Tracked Yet</h4>
            <p className="text-[10px] text-neutral-450 leading-relaxed">
              If you haven\'t placed an order yet, you can use the sample tracking ID <span className="text-primary-gold font-bold font-mono">VC-100284</span> to test.
            </p>
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
