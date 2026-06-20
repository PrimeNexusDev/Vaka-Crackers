"use client";

import React, { useState } from "react";
import { 
  Settings, ShoppingCart, Tag, Box, BarChart3, Plus, 
  Trash2, Edit, Calendar, Check, AlertCircle, RefreshCw, ChevronRight 
} from "lucide-react";
import { useApp, Product, Order, Coupon } from "../../context/AppContext";
import { Navbar } from "../../components/Layout/Navbar";
import { Footer } from "../../components/Layout/Footer";
import { CartDrawer } from "../../components/Shop/CartDrawer";
import { WishlistDrawer } from "../../components/Shop/WishlistDrawer";
import { CompareDrawer } from "../../components/Shop/CompareDrawer";

export default function AdminDashboard() {
  const { 
    products, setProducts, orders, updateOrderStatus, coupons, 
    addCoupon, removeCoupon, timerEnabled, setTimerEnabled, 
    timerTargetDate, setTimerTargetDate, theme 
  } = useApp();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<"analytics" | "inventory" | "orders" | "promotions" | "settings">("analytics");

  // Product Form states
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("One Sound Crackers");
  const [prodPrice, setProdPrice] = useState(100);
  const [prodMRP, setProdMRP] = useState(500);
  const [prodImage, setProdImage] = useState("🎆");
  const [prodStock, setProdStock] = useState(100);
  const [prodSound, setProdSound] = useState<Product['soundLevel']>("Loud");
  const [prodAge, setProdAge] = useState<Product['ageGroup']>("Family");
  const [prodDesc, setProdDesc] = useState("");

  // Coupon Form states
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponPct, setNewCouponPct] = useState(10);
  const [newCouponDesc, setNewCouponDesc] = useState("");

  // UI state
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Categories list
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

  // Analytics helper metrics
  const totalRetailSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRetailSales / totalOrdersCount) : 0;
  
  // Product management actions
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditingProduct && editingProdId) {
      // Edit
      const updated = products.map(p => {
        if (p.id === editingProdId) {
          return {
            ...p,
            name: prodName,
            category: prodCategory,
            price: Number(prodPrice),
            mrp: Number(prodMRP),
            image: prodImage,
            stock: Number(prodStock),
            soundLevel: prodSound,
            ageGroup: prodAge,
            description: prodDesc
          };
        }
        return p;
      });
      setProducts(updated);
    } else {
      // Create new
      const newProd: Product = {
        id: `p-${Math.floor(1000 + Math.random() * 9000)}`,
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        mrp: Number(prodMRP),
        image: prodImage,
        stock: Number(prodStock),
        rating: 4.5,
        soundLevel: prodSound,
        ageGroup: prodAge,
        description: prodDesc
      };
      setProducts([newProd, ...products]);
    }

    // Reset Form
    handleResetProductForm();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleEditProductClick = (prod: Product) => {
    setIsEditingProduct(true);
    setEditingProdId(prod.id);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdMRP(prod.mrp);
    setProdImage(prod.image);
    setProdStock(prod.stock);
    setProdSound(prod.soundLevel);
    setProdAge(prod.ageGroup);
    setProdDesc(prod.description);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product from the inventory database?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleResetProductForm = () => {
    setIsEditingProduct(false);
    setEditingProdId(null);
    setProdName("");
    setProdCategory("One Sound Crackers");
    setProdPrice(100);
    setProdMRP(500);
    setProdImage("🎆");
    setProdStock(100);
    setProdSound("Loud");
    setProdAge("Family");
    setProdDesc("");
  };

  // Coupon actions
  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newCoupon: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: Number(newCouponPct),
      description: newCouponDesc
    };

    addCoupon(newCoupon);
    setNewCouponCode("");
    setNewCouponPct(10);
    setNewCouponDesc("");
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar 
        onOpenCart={() => setCartOpen(true)}
        onOpenCompare={() => setCompareOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <span>Home</span>
              <ChevronRight size={10} />
              <span className="text-primary-gold">Admin Panel</span>
            </div>
            <h1 className="text-2xl font-black font-cinzel text-white uppercase tracking-wider mt-1.5">
              Merchant Management Control
            </h1>
            <p className="text-xs text-neutral-400">
              Manage product listings, track orders, generate coupons, and monitor sales dashboard.
            </p>
          </div>
        </div>

        {/* Outer Grid Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Menu options */}
          <div className={`p-4 rounded-2xl border space-y-2 h-fit ${
            theme === "dark" ? "bg-neutral-950 border-neutral-850" : "bg-neutral-50 border-neutral-200"
          }`}>
            {[
              { id: "analytics", name: "Sales Analytics", icon: <BarChart3 size={14} /> },
              { id: "inventory", name: "Product Inventory", icon: <Box size={14} /> },
              { id: "orders", name: "Manage Orders", icon: <ShoppingCart size={14} /> },
              { id: "promotions", name: "Coupon Codes", icon: <Tag size={14} /> },
              { id: "settings", name: "Timer Settings", icon: <Settings size={14} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary-gold text-neutral-950"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Tab 1: Analytics Dashboard */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                
                {/* Scorecards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-1">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">Total Retail Revenue</span>
                    <span className="block text-2xl font-black text-primary-gold font-mono">₹{totalRetailSales}</span>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-1">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">Total Orders Placed</span>
                    <span className="block text-2xl font-black text-white font-mono">{totalOrdersCount} Orders</span>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-1">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">Average Order Value</span>
                    <span className="block text-2xl font-black text-primary-gold font-mono">₹{avgOrderValue}</span>
                  </div>
                </div>

                {/* SVG Graphs Panel */}
                <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/40 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">Sales Chart (Mock Analytics)</h3>
                  
                  {/* Custom CSS/SVG Line Chart */}
                  <div className="h-48 w-full border-b border-l border-neutral-800 relative pt-4 flex items-end">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px)] [background-size:100%_40px] pointer-events-none" />
                    
                    {/* SVG Line path */}
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                      <path
                        d="M 0 160 Q 80 120 160 140 T 320 80 T 480 90 T 640 40"
                        fill="none"
                        stroke="#d4af37"
                        strokeWidth="3"
                      />
                      <path
                        d="M 0 160 Q 80 120 160 140 T 320 80 T 480 90 T 640 40 L 640 180 L 0 180 Z"
                        fill="url(#grad)"
                        opacity="0.15"
                      />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#d4af37" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Chart points */}
                    <div className="flex justify-between w-full px-2 text-[9px] text-neutral-500 select-none relative z-10">
                      <span>Jan</span>
                      <span>Mar</span>
                      <span>May</span>
                      <span>Jul</span>
                      <span>Sep</span>
                      <span>Diwali Peak</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Product Inventory */}
            {activeTab === "inventory" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                
                {/* Form to Create/Edit */}
                <div className={`p-5 rounded-2xl border xl:col-span-1 space-y-4 ${
                  theme === "dark" ? "bg-neutral-950/80 border-neutral-850" : "bg-white border-neutral-200"
                }`}>
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary-gold border-b border-neutral-900 pb-2 flex items-center justify-between">
                    <span>{isEditingProduct ? "Edit Crackers Item" : "Add Crackers Item"}</span>
                    {isEditingProduct && (
                      <button 
                        onClick={handleResetProductForm}
                        className="text-[9px] underline font-bold uppercase hover:text-white"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </h3>

                  <form onSubmit={handleSaveProduct} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-neutral-500">Name</label>
                      <input
                        type="text"
                        required
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full py-1.5 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-neutral-500">Category</label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          className="w-full py-1.5 px-2 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                        >
                          {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-neutral-500">Image Icon</label>
                        <select
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          className="w-full py-1.5 px-2 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                        >
                          <option>🎆</option>
                          <option>✨</option>
                          <option>🌈</option>
                          <option>🚀</option>
                          <option>🎇</option>
                          <option>💥</option>
                          <option>🎁</option>
                          <option>🌀</option>
                          <option>🍿</option>
                          <option>🏺</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-neutral-500">Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={prodPrice}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          className="w-full py-1.5 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-neutral-500">MRP (₹)</label>
                        <input
                          type="number"
                          required
                          value={prodMRP}
                          onChange={(e) => setProdMRP(Number(e.target.value))}
                          className="w-full py-1.5 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-neutral-500">Stock Qty</label>
                        <input
                          type="number"
                          required
                          value={prodStock}
                          onChange={(e) => setProdStock(Number(e.target.value))}
                          className="w-full py-1.5 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-neutral-500">Sound Level</label>
                        <select
                          value={prodSound}
                          onChange={(e) => setProdSound(e.target.value as any)}
                          className="w-full py-1.5 px-2 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                        >
                          <option>Eco-Friendly</option>
                          <option>Loud</option>
                          <option>Musical</option>
                          <option>Silent</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-neutral-500">Age Rating</label>
                      <select
                        value={prodAge}
                        onChange={(e) => setProdAge(e.target.value as any)}
                        className="w-full py-1.5 px-2 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
                      >
                        <option>Kids</option>
                        <option>Family</option>
                        <option>Adults</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-neutral-500">Description</label>
                      <textarea
                        required
                        rows={2}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        className="w-full py-1.5 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors"
                    >
                      {isEditingProduct ? "Save Changes" : "Create Product"}
                    </button>
                  </form>
                  {saveSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold text-center flex items-center justify-center gap-1">
                      <Check size={10} /> Product settings saved.
                    </div>
                  )}
                </div>

                {/* Inventory Table */}
                <div className="xl:col-span-2 overflow-x-auto rounded-2xl border border-neutral-900 bg-neutral-950/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-900 bg-neutral-950/50">
                        <th className="p-3 text-neutral-400 font-bold uppercase">Product</th>
                        <th className="p-3 text-neutral-400 font-bold uppercase text-center">Stock</th>
                        <th className="p-3 text-neutral-400 font-bold uppercase text-right">Price</th>
                        <th className="p-3 text-neutral-400 font-bold uppercase text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-neutral-900/10 transition-colors">
                          <td className="p-3 font-semibold flex items-center gap-2">
                            <span>{prod.image}</span>
                            <div>
                              <p className="text-white truncate max-w-[120px]">{prod.name}</p>
                              <p className="text-[9px] text-neutral-500">{prod.category}</p>
                            </div>
                          </td>
                          <td className={`p-3 text-center font-bold ${prod.stock > 0 ? "text-emerald-400" : "text-rose-500"}`}>
                            {prod.stock} Box
                          </td>
                          <td className="p-3 text-right font-black text-primary-gold">₹{prod.price}</td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditProductClick(prod)}
                                className="p-1 hover:bg-neutral-900 text-neutral-450 hover:text-white rounded"
                                title="Edit"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1 hover:bg-neutral-900 text-neutral-450 hover:text-rose-500 rounded"
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* Tab 3: Order Management */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-20 border border-neutral-900 border-dashed rounded-2xl p-6 text-neutral-400">
                    No client orders placed in local storage database yet. Place orders via the Cart Drawer to test.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        className={`p-4 rounded-xl border space-y-4 ${
                          theme === "dark" ? "bg-neutral-950/80 border-neutral-850" : "bg-neutral-50 border-neutral-200"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-900 pb-3 gap-2">
                          <div>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase">Order Tracking ID</span>
                            <h4 className="text-xs font-black text-primary-gold mt-0.5">{order.id}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-neutral-500 font-bold uppercase">Status:</span>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className="py-1 px-2.5 rounded bg-neutral-900 border border-neutral-800 text-white font-bold text-[10px]"
                            >
                              <option>Placed</option>
                              <option>Confirmed</option>
                              <option>Packed</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase">Consignee</p>
                            <p className="font-bold text-white mt-1">{order.customerName}</p>
                            <p className="text-neutral-400">{order.phone}</p>
                            <p className="text-neutral-400 mt-1 leading-relaxed">{order.address}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase">Items Ordered</p>
                            <div className="space-y-1.5 mt-1.5">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs text-neutral-400">
                                  <span>{item.productName}</span>
                                  <span className="font-bold text-white">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-neutral-900 pt-2 mt-2 flex justify-between items-center font-bold text-primary-gold">
                              <span>Total (incl. GST):</span>
                              <span>₹{order.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Promotions & Coupon Manager */}
            {activeTab === "promotions" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Create form */}
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  theme === "dark" ? "bg-neutral-950/80 border-neutral-850" : "bg-white border-neutral-200"
                }`}>
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary-gold border-b border-neutral-900 pb-2">
                    Create Promo Coupon
                  </h3>
                  
                  <form onSubmit={handleAddCouponSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-neutral-500">Coupon Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. MEGA95"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        className="w-full py-1.5 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold uppercase font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-neutral-500">Discount Percent (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        required
                        value={newCouponPct}
                        onChange={(e) => setNewCouponPct(Number(e.target.value))}
                        className="w-full py-1.5 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-neutral-500">Description</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Special seasonal discount..."
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        className="w-full py-1.5 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold resize-none"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors"
                    >
                      Add Coupon
                    </button>
                  </form>
                </div>

                {/* Listing */}
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">Active Promo Coupons</h3>
                  <div className="space-y-3">
                    {coupons.map((c) => (
                      <div 
                        key={c.code}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${
                          theme === "dark" ? "bg-neutral-950/80 border-neutral-850" : "bg-neutral-50 border-neutral-200"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-xs">
                              {c.code}
                            </span>
                            <span className="text-emerald-400 font-bold text-xs">({c.discountPercent}% Off)</span>
                          </div>
                          <p className="text-[10px] text-neutral-450 mt-1">{c.description}</p>
                        </div>
                        
                        <button
                          onClick={() => removeCoupon(c.code)}
                          className="p-1 text-neutral-500 hover:text-rose-500 hover:bg-neutral-900/50 rounded shrink-0"
                          title="Delete Coupon"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 5: Settings / Timer */}
            {activeTab === "settings" && (
              <div className={`p-6 rounded-2xl border space-y-6 ${
                theme === "dark" ? "bg-neutral-950 border-neutral-850" : "bg-white border-neutral-200"
              }`}>
                <h3 className="text-xs font-black uppercase tracking-wider text-primary-gold border-b border-neutral-900 pb-2">
                  Countdown Timer Controls
                </h3>

                <div className="space-y-4 max-w-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-bold uppercase tracking-wider">Enable Banner Timer:</span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={timerEnabled}
                        onChange={(e) => setTimerEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-neutral-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-primary-gold peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-gold" />
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Target End Date/Time</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={timerTargetDate}
                        onChange={(e) => setTimerTargetDate(e.target.value)}
                        className="w-full py-2 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold font-mono"
                      />
                    </div>
                    <p className="text-[9px] text-neutral-500">Sets the final timestamp count on the landing page sale banner.</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CompareDrawer isOpen={compareOpen} onClose={() => setCompareOpen(false)} />
      <Footer />
    </div>
  );
}
