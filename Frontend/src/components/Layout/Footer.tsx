"use client";

import React from "react";
import Link from "next/link";
import { 
  Phone, Mail, MapPin, MessageSquare, ShieldCheck, Truck, ShieldAlert 
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Footer: React.FC = () => {
  const { theme } = useApp();

  return (
    <footer className={`border-t transition-colors duration-300 relative no-print ${
      theme === "dark" 
        ? "bg-neutral-950 border-neutral-900 text-neutral-400" 
        : "bg-neutral-50 border-neutral-200 text-neutral-600"
    }`}>
      {/* Top badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-primary-gold/15">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2 p-4 bg-primary-gold/5 rounded-xl border border-primary-gold/10">
            <ShieldCheck className="text-primary-gold" size={24} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-gold">100% Original Products</h4>
            <p className="text-[10px] text-neutral-500">Genuine Sivakasi manufacturer guarantee</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-primary-gold/5 rounded-xl border border-primary-gold/10">
            <Truck className="text-primary-gold" size={24} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-gold">Secure Packaging</h4>
            <p className="text-[10px] text-neutral-500">Waterproof wood-dust packing box</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-primary-gold/5 rounded-xl border border-primary-gold/10">
            <Phone className="text-primary-gold" size={24} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-gold">WhatsApp Support</h4>
            <p className="text-[10px] text-neutral-500">Instant chat order verification</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-primary-gold/5 rounded-xl border border-primary-gold/10">
            <ShieldAlert className="text-primary-gold" size={24} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-gold">Direct Sivakasi Rates</h4>
            <p className="text-[10px] text-neutral-500">Cut out middle-men, save up to 90%</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-widest font-cinzel text-primary-gold leading-none">
                VAKA FIREWORKS
              </span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-500">
              Vaka Fireworks is Sivakasi\'s premier licensed manufacturer of high-quality, eco-friendly crackers. Celebrating over 25 years of crafting spectacular aerial bursts, sparklers, and gift boxes. Direct factory delivery right to your door.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-primary-gold transition-colors">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-3.3 0-5 1.7-5 5v2z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-primary-gold transition-colors">
                <svg className="h-3.5 w-3.5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Twitter X" className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-primary-gold transition-colors">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-primary-gold transition-colors">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-primary-gold font-cinzel mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-primary-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-primary-gold transition-colors">Shop Catalog</Link>
              </li>
              <li>
                <Link href="/price-list" className="hover:text-primary-gold transition-colors">Digital Price List</Link>
              </li>
              <li>
                <Link href="/dealer" className="hover:text-primary-gold transition-colors">Wholesale & Dealer Hub</Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-primary-gold transition-colors">Track Order Status</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Address */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-primary-gold font-cinzel">Contact Factory</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-primary-gold shrink-0 mt-0.5" />
                <span>
                  142-C, Bypass Road, Paraipatti Area,
                  Sivakasi, Tamil Nadu, 626123, India
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-primary-gold shrink-0" />
                <span>+91 98765 43210 / +91 94433 12345</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-primary-gold shrink-0" />
                <span>sales@vakacrackers.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare size={16} className="text-primary-gold shrink-0" />
                <span>WhatsApp Order Support Live</span>
              </div>
            </div>
          </div>

          {/* Column 4: Interactive Mock Map */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-primary-gold font-cinzel">Factory Location</h4>
            <div className="w-full h-32 rounded-xl overflow-hidden border border-primary-gold/25 relative bg-neutral-900 flex items-center justify-center text-center p-3 group">
              <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="relative z-10 space-y-1">
                <MapPin size={24} className="text-crimson-red mx-auto animate-bounce" />
                <h5 className="text-[10px] font-bold text-white uppercase tracking-widest">Vaka Factory Map</h5>
                <p className="text-[9px] text-neutral-500">Sivakasi Bypass Road Industrial Estate</p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block text-[9px] font-black text-primary-gold underline uppercase tracking-wider mt-1 hover:text-white"
                >
                  Get Directions
                </a>
              </div>
              {/* Gold borders */}
              <div className="absolute inset-0 border border-primary-gold/10 group-hover:border-primary-gold/30 transition-colors pointer-events-none rounded-xl" />
            </div>
          </div>

        </div>

        {/* Legal bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Vaka Crackers Sivakasi. All Rights Reserved. Manufactured under Explosive License No: TN-SVK/9284.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary-gold">Terms & Conditions</a>
            <span>•</span>
            <a href="#" className="hover:text-primary-gold">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary-gold">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
