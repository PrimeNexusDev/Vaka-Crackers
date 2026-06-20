"use client";

import React, { useState } from "react";
import { X, Trash2, Plus, Minus, Send, Tag, Percent, ShoppingBag } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    cart, removeFromCart, updateCartQuantity, theme, 
    activeCoupon, applyCoupon, removeAppliedCoupon, placeOrder 
  } = useApp();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Customer checkout form
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalMRP = cart.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
  const totalSavings = totalMRP - subtotal;
  
  let discountAmount = 0;
  if (activeCoupon) {
    discountAmount = (subtotal * activeCoupon.discountPercent) / 100;
  }
  
  const discountedSubtotal = subtotal - discountAmount;
  const gstAmount = Math.round(discountedSubtotal * 0.18);
  const finalTotal = Math.round(discountedSubtotal + gstAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    const success = applyCoupon(couponInput.trim());
    if (success) {
      setCouponSuccess(true);
      setCouponError("");
      setCouponInput("");
      setTimeout(() => setCouponSuccess(false), 3000);
    } else {
      setCouponError("Invalid coupon code. Try DIWALI90!");
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Please fill in all checkout details.");
      return;
    }

    // Place the order in the local state database
    const order = await placeOrder(customerName, customerPhone, customerAddress);

    // Build the WhatsApp message string
    let message = `🔥 *NEW ORDER - VAKA CRACKERS* 🔥\n`;
    message += `------------------------------------\n`;
    message += `*Order ID:* #${order.id}\n`;
    message += `*Customer:* ${customerName}\n`;
    message += `*Phone:* ${customerPhone}\n`;
    message += `*Address:* ${customerAddress}\n`;
    message += `------------------------------------\n`;
    message += `*ITEMS ORDERED:*\n`;
    
    cart.forEach((item, index) => {
      const savings = Math.round(((item.product.mrp - item.product.price) / item.product.mrp) * 100);
      message += `${index + 1}. ${item.product.name} x ${item.quantity}  - ₹${item.product.price * item.quantity} (${savings}% Off)\n`;
    });
    
    message += `------------------------------------\n`;
    message += `*Subtotal:* ₹${subtotal}\n`;
    if (activeCoupon) {
      message += `*Promo Discount (${activeCoupon.code}):* -₹${Math.round(discountAmount)} (${activeCoupon.discountPercent}% Off)\n`;
    }
    message += `*GST (18%):* +₹${gstAmount}\n`;
    message += `*Total Savings:* ₹${Math.round(totalSavings + discountAmount)} saved!\n`;
    message += `------------------------------------\n`;
    message += `*TOTAL PAYABLE:* ₹${finalTotal}\n`;
    message += `------------------------------------\n`;
    message += `Please confirm my order and send bank transfer details!`;

    // Encode text and redirect
    const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    
    // Clear cart & close
    setShowCheckoutForm(false);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    onClose();

    // Open WhatsApp
    window.open(waUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end no-print">
      {/* Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />

      {/* Drawer Body */}
      <div className={`relative w-full max-w-md h-full flex flex-col shadow-2xl border-l transition-colors duration-300 ${
        theme === "dark" 
          ? "bg-neutral-950 border-neutral-850 text-white" 
          : "bg-white border-neutral-200 text-neutral-900"
      }`}>
        
        {/* Header */}
        <div className="p-4 border-b border-primary-gold/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary-gold" size={20} />
            <h2 className="text-sm font-black font-cinzel text-primary-gold uppercase tracking-wider">Your Festival Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <span className="text-4xl">🎆</span>
              <p className="text-xs text-neutral-400 font-medium">Your cart is currently empty.</p>
              <button
                onClick={onClose}
                className="py-2 px-4 rounded-lg bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold text-xs transition-colors"
              >
                Go Shop Fireworks
              </button>
            </div>
          ) : (
            <>
              {/* Product list */}
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemSavingsPercent = Math.round(((item.product.mrp - item.product.price) / item.product.mrp) * 100);
                  return (
                    <div 
                      key={item.product.id}
                      className={`p-3 rounded-xl border flex gap-3 items-center justify-between ${
                        theme === "dark" 
                          ? "bg-neutral-900/60 border-neutral-800" 
                          : "bg-neutral-50 border-neutral-200"
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <span className="text-2xl h-10 w-10 shrink-0 bg-neutral-950 rounded-lg flex items-center justify-center">
                        {item.product.image}
                      </span>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate leading-tight">{item.product.name}</h4>
                        <p className="text-[10px] text-neutral-400">{item.product.category}</p>
                        
                        {/* Price tags */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-black text-primary-gold">₹{item.product.price}</span>
                          <span className="text-[10px] text-neutral-500 line-through">₹{item.product.mrp}</span>
                          <span className="text-[9px] text-emerald-400 font-bold bg-emerald-400/10 px-1 rounded">
                            {itemSavingsPercent}% OFF
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controller & Delete */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-neutral-500 hover:text-rose-500 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                        
                        <div className="flex items-center border border-neutral-700 rounded-md">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-black px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Coupon Form */}
              <div className="border-t border-neutral-900 pt-4">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon Code (DIWALI90)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError("");
                      }}
                      className={`w-full py-1.5 pl-8 pr-3 rounded-lg text-xs bg-neutral-900 border text-white focus:outline-none focus:border-primary-gold ${
                        couponError ? "border-rose-500" : "border-neutral-800"
                      }`}
                    />
                    <Tag size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  </div>
                  <button
                    type="submit"
                    className="py-1.5 px-3 rounded-lg bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold text-xs transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
                {couponError && <p className="text-[10px] text-rose-500 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-400 mt-1">Coupon Applied successfully!</p>}
                
                {activeCoupon && (
                  <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                    <span className="flex items-center gap-1 font-bold">
                      <Percent size={12} />
                      {activeCoupon.code} ({activeCoupon.discountPercent}% Off)
                    </span>
                    <button 
                      onClick={removeAppliedCoupon}
                      className="text-[10px] font-black underline hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Checkout Form */}
              {showCheckoutForm ? (
                <form onSubmit={handleCheckoutSubmit} className="border-t border-neutral-900 pt-4 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary-gold">Delivery Details</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp Mobile Number"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold"
                    />
                    <textarea
                      placeholder="Complete Shipping Address (With Pincode)"
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full py-2 px-3 rounded-lg text-xs bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-primary-gold resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCheckoutForm(false)}
                      className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/10"
                    >
                      <Send size={12} />
                      Order via WhatsApp
                    </button>
                  </div>
                </form>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={() => setShowCheckoutForm(true)}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary-gold to-primary-gold-hover text-neutral-950 font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-primary-gold/15"
                  >
                    Proceed to Delivery
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pricing Summary Footer */}
        {cart.length > 0 && !showCheckoutForm && (
          <div className="p-4 border-t border-neutral-900 bg-neutral-950 space-y-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Total MRP:</span>
              <span className="line-through">₹{totalMRP}</span>
            </div>
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Factory Discount Price:</span>
              <span className="font-bold text-white">₹{subtotal}</span>
            </div>
            {activeCoupon && (
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Promo Discount ({activeCoupon.code}):</span>
                <span>-₹{Math.round(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-neutral-400">
              <span>GST (18%):</span>
              <span>+₹{gstAmount}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-neutral-850 pt-2 font-black text-primary-gold">
              <span className="uppercase font-cinzel">Total Payable:</span>
              <span>₹{finalTotal}</span>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-emerald-400 font-bold tracking-wide">
                🎉 You saved ₹{Math.round(totalSavings + discountAmount)} ({Math.round(((totalMRP - finalTotal) / totalMRP) * 100)}% off MRP)!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
