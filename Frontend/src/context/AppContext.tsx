"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  stock: number;
  rating: number;
  soundLevel: 'Eco-Friendly' | 'Loud' | 'Musical' | 'Silent';
  description: string;
  ageGroup: 'Kids' | 'Family' | 'Adults';
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFavorite?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: { productName: string; quantity: number; price: number }[];
  total: number;
  status: 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}

interface AppContextType {
  products: Product[];
  setProducts: (prods: Product[] | ((prev: Product[]) => Product[])) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  compareList: string[];
  toggleCompare: (productId: string) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  festivalMode: boolean;
  setFestivalMode: (active: boolean) => void;
  timerEnabled: boolean;
  setTimerEnabled: (active: boolean) => void;
  timerTargetDate: string;
  setTimerTargetDate: (date: string) => void;
  orders: Order[];
  placeOrder: (customerName: string, phone: string, address: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  removeCoupon: (code: string) => void;
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeAppliedCoupon: () => void;
  dealerStatus: 'none' | 'pending' | 'approved';
  requestDealerAccess: (dealerData: any) => void;
  isOfflineMode: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE = "http://localhost:5000/api";

// Fallback Default Products Data
const defaultProducts: Product[] = [
  { id: "p1", name: "100 Wala Classic Spark", category: "One Sound Crackers", price: 120, mrp: 600, image: "💣", stock: 75, rating: 4.6, soundLevel: "Loud", description: "Classic red cracker string of 100 crackers that burst continuously, lighting up your courtyard.", ageGroup: "Adults", isBestSeller: true },
  { id: "p2", name: "1000 Wala Grand Celebration", category: "One Sound Crackers", price: 490, mrp: 2450, image: "💥", stock: 40, rating: 4.9, soundLevel: "Loud", description: "Gigantic string of 1000 premium red crackers. Brings a spectacular rhythmic audio show directly from Sivakasi factory.", ageGroup: "Adults", isTrending: true },
  { id: "p3", name: "15cm Crackling Sparklers", category: "Sparklers", price: 45, mrp: 225, image: "✨", stock: 120, rating: 4.8, soundLevel: "Eco-Friendly", description: "Sparkling silver sparkles with crackling sound effect. High performance, low smoke.", ageGroup: "Kids", isFavorite: true },
  { id: "p4", name: "30cm Golden Ray Sparklers", category: "Sparklers", price: 85, mrp: 425, image: "🌟", stock: 90, rating: 4.7, soundLevel: "Eco-Friendly", description: "Long-lasting premium golden sparklers. Ideal for children to hold safely and capture beautiful photos.", ageGroup: "Kids", isBestSeller: true },
  { id: "p5", name: "Golden Willow Fountain", category: "Fancy Crackers", price: 190, mrp: 950, image: "🌈", stock: 50, rating: 4.9, soundLevel: "Musical", description: "Shoots an extremely high fountain of golden sparks that cascade down like a weeping willow tree.", ageGroup: "Family", isTrending: true },
  { id: "p6", name: "Tri-Color Star Rain", category: "Fancy Crackers", price: 240, mrp: 1200, image: "🎨", stock: 35, rating: 4.5, soundLevel: "Silent", description: "Silent aerial fancy fireworks emitting beautiful red, green, and gold sparks that light up the night sky.", ageGroup: "Family" },
  { id: "p7", name: "Lunik Whistling Rocket", category: "Rockets", price: 150, mrp: 750, image: "🚀", stock: 65, rating: 4.6, soundLevel: "Musical", description: "Zoom upward into the sky with a sharp whistling sound before bursting into beautiful gold sparks.", ageGroup: "Adults", isBestSeller: true },
  { id: "p8", name: "Parachute Flares Rocket", category: "Rockets", price: 280, mrp: 1400, image: "🪂", stock: 30, rating: 4.8, soundLevel: "Silent", description: "Ascends extremely high and deploys a parachute with a bright red burning flare that floats down slowly.", ageGroup: "Family" },
  { id: "p9", name: "Flower Pot Giant Gold", category: "Flower Pots", price: 90, mrp: 450, image: "🎇", stock: 150, rating: 4.8, soundLevel: "Eco-Friendly", description: "Large traditional earthen style flower pot emitting giant showers of golden sparks up to 8 feet high.", ageGroup: "Kids", isBestSeller: true },
  { id: "p10", name: "Multi-Color Magic Pots", category: "Flower Pots", price: 130, mrp: 650, image: "🏺", stock: 80, rating: 4.7, soundLevel: "Eco-Friendly", description: "Dazzling flower pots that transition colors from sparkling red to emerald green and then silver crackles.", ageGroup: "Kids", isTrending: true },
  { id: "p11", name: "Hydro Bomb (Heavy Blast)", category: "Atom Bombs", price: 80, mrp: 400, image: "⚡", stock: 110, rating: 4.4, soundLevel: "Loud", description: "High decibel traditional green bomb with maximum sound intensity. Strictly for open outdoor areas.", ageGroup: "Adults" },
  { id: "p12", name: "Bullet Bomb Gold", category: "Atom Bombs", price: 60, mrp: 300, image: "🔥", stock: 140, rating: 4.5, soundLevel: "Loud", description: "Compact bullet shape, intense instantaneous explosion with minimal smoke. Best value pack of 10.", ageGroup: "Adults", isFavorite: true },
  { id: "p13", name: "Royal Diwali Treasure Box", category: "Gift Boxes", price: 1200, mrp: 6000, image: "🎁", stock: 25, rating: 4.9, soundLevel: "Eco-Friendly", description: "Premium assortment of 35 diverse items including sparklers, chakkars, pots, rockets, and fancy novelties.", ageGroup: "Family", isBestSeller: true },
  { id: "p14", name: "Kids Joy Package (Eco)", category: "Gift Boxes", price: 650, mrp: 3250, image: "🧸", stock: 45, rating: 4.8, soundLevel: "Silent", description: "Safe, low-noise selection of sparklers, magic pops, spinners, and snake eggs perfect for young children.", ageGroup: "Kids", isTrending: true },
  { id: "p15", name: "Premium Ground Chakkars (Spinners)", category: "Kids Special", price: 90, mrp: 450, image: "🌀", stock: 130, rating: 4.7, soundLevel: "Eco-Friendly", description: "Spins rapidly on the ground producing a glowing ring of red, green, and golden fire. Pack of 10.", ageGroup: "Kids", isBestSeller: true },
  { id: "p16", name: "Magic Pop Snap Crackers", category: "Kids Special", price: 25, mrp: 125, image: "🍿", stock: 200, rating: 4.6, soundLevel: "Silent", description: "Safe throwing pops that crackle when they hit the floor. No fire required, entirely chemical-safe fun.", ageGroup: "Kids" },
  { id: "p17", name: "30 Shots Multi Color Aerial", category: "Multi Shots", price: 750, mrp: 3750, image: "🎊", stock: 20, rating: 4.9, soundLevel: "Loud", description: "Shoots 30 individual shells rapidly into the air, bursting into magnificent chrysanthemums of light and sound.", ageGroup: "Family", isTrending: true },
  { id: "p18", name: "120 Shots Grand Celebration", category: "Multi Shots", price: 2200, mrp: 11000, image: "🏰", stock: 10, rating: 5.0, soundLevel: "Loud", description: "Ultimate showstopper: 120 consecutive shell blasts creating a sky-filling finale of colors, crackles, and whistling tails.", ageGroup: "Family", isBestSeller: true },
  { id: "p19", name: "Peacock Dance Deluxe Fountain", category: "Premium Collection", price: 350, mrp: 1750, image: "🦚", stock: 15, rating: 4.9, soundLevel: "Musical", description: "Luxury fountain that shoots sparkles spreading out in the shape of a peacock tail, shifting through 5 distinct colors.", ageGroup: "Family", isTrending: true },
  { id: "p20", name: "VIP Golden Rain Box", category: "Premium Collection", price: 1500, mrp: 7500, image: "👑", stock: 8, rating: 5.0, soundLevel: "Eco-Friendly", description: "Exclusive collector box containing large-bore fireworks that shower gold leaves and crackling palms over a wide area.", ageGroup: "Family", isFavorite: true }
];

const defaultCoupons: Coupon[] = [
  { code: "DIWALI90", discountPercent: 90, description: "Mega Diwali Festival Special discount of 90%!" },
  { code: "WELCOME10", discountPercent: 10, description: "Additional 10% discount on your first order." },
  { code: "FACTORYDIRECT", discountPercent: 15, description: "15% off for direct bulk orders from Sivakasi." }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOfflineMode, setIsOfflineMode] = useState(true);

  // Fallback Local states (for offline mode)
  const [localProducts, setLocalProducts] = useLocalStorage<Product[]>("vaka_products", defaultProducts);
  const [localOrders, setLocalOrders] = useLocalStorage<Order[]>("vaka_orders", []);
  const [localCoupons, setLocalCoupons] = useLocalStorage<Coupon[]>("vaka_coupons", defaultCoupons);
  const [localTimerEnabled, setLocalTimerEnabled] = useLocalStorage<boolean>("vaka_timer_enabled", true);
  
  const getDefaultTargetDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split("T")[0] + "T00:00:00";
  };
  const [localTimerTargetDate, setLocalTimerTargetDate] = useLocalStorage<string>("vaka_timer_target", getDefaultTargetDate());

  // Active React states (synced either from API or LocalStorage)
  const [products, setProductsState] = useState<Product[]>(defaultProducts);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [coupons, setCouponsState] = useState<Coupon[]>(defaultCoupons);
  const [timerEnabled, setTimerEnabledState] = useState<boolean>(true);
  const [timerTargetDate, setTimerTargetDateState] = useState<string>(getDefaultTargetDate());

  // Common browser states
  const [cart, setCart] = useLocalStorage<CartItem[]>("vaka_cart", []);
  const [wishlist, setWishlist] = useLocalStorage<string[]>("vaka_wishlist", []);
  const [compareList, setCompareList] = useLocalStorage<string[]>("vaka_compare", []);
  const [activeCoupon, setActiveCoupon] = useLocalStorage<Coupon | null>("vaka_applied_coupon", null);
  const [dealerStatus, setDealerStatus] = useLocalStorage<'none' | 'pending' | 'approved'>("vaka_dealer_status", "none");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [festivalMode, setFestivalMode] = useState<boolean>(true);

  // Sync API health
  useEffect(() => {
    async function checkApiHealth() {
      try {
        const res = await fetch(`${API_BASE}/health`);
        if (res.ok) {
          console.log("⚡ B2B Database Connected: http://localhost:5000/api");
          setIsOfflineMode(false);
          
          // Load from Backend SQLite
          const prodRes = await fetch(`${API_BASE}/products`);
          if (prodRes.ok) setProductsState(await prodRes.json());

          const couponRes = await fetch(`${API_BASE}/coupons`);
          if (couponRes.ok) setCouponsState(await couponRes.json());

          const ordersRes = await fetch(`${API_BASE}/orders`);
          if (ordersRes.ok) setOrdersState(await ordersRes.json());

          const timerEnabledRes = await fetch(`${API_BASE}/settings/timer_enabled`);
          if (timerEnabledRes.ok) {
            const data = await timerEnabledRes.json();
            setTimerEnabledState(data.value === "true");
          }

          const timerDateRes = await fetch(`${API_BASE}/settings/timer_target_date`);
          if (timerDateRes.ok) {
            const data = await timerDateRes.json();
            setTimerTargetDateState(data.value);
          }
        }
      } catch (err) {
        console.warn("⚠️ Backend Database server offline. Running in Offline Demo Mode.");
        setIsOfflineMode(true);
        // Load offline storage
        setProductsState(localProducts);
        setCouponsState(localCoupons);
        setOrdersState(localOrders);
        setTimerEnabledState(localTimerEnabled);
        setTimerTargetDateState(localTimerTargetDate);
      }
    }

    checkApiHealth();
  }, [localProducts, localCoupons, localOrders, localTimerEnabled, localTimerTargetDate]);

  // Sync theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [theme]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId)
        : [...prevWishlist, productId]
    );
  };

  // Compare operations
  const toggleCompare = (productId: string) => {
    setCompareList((prevCompare) => {
      if (prevCompare.includes(productId)) {
        return prevCompare.filter((id) => id !== productId);
      }
      if (prevCompare.length >= 3) {
        alert("You can compare up to 3 products at a time!");
        return prevCompare;
      }
      return [...prevCompare, productId];
    });
  };

  // Product Database update router
  const setProducts = async (prods: Product[] | ((prev: Product[]) => Product[])) => {
    const valueToStore = prods instanceof Function ? prods(products) : prods;
    setProductsState(valueToStore);
    
    if (isOfflineMode) {
      setLocalProducts(valueToStore);
    } else {
      // Sync deletes/creates/edits on server (simulated bulk refresh or single endpoints)
      // Since this is a simple Admin panel, we'll sync the local state.
      // To keep it simple: we can call singular endpoints on Admin actions, but we also support the direct array sync.
      try {
        // Find which items were modified, added, or deleted
        const dbItems: Product[] = await (await fetch(`${API_BASE}/products`)).json();
        
        // Simple syncing logic:
        for (const item of valueToStore) {
          const match = dbItems.find(p => p.id === item.id);
          if (!match) {
            // Create
            await fetch(`${API_BASE}/products`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item)
            });
          } else if (JSON.stringify(match) !== JSON.stringify(item)) {
            // Update
            await fetch(`${API_BASE}/products/${item.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item)
            });
          }
        }
        // Delete check
        for (const dbItem of dbItems) {
          const match = valueToStore.find(p => p.id === dbItem.id);
          if (!match) {
            await fetch(`${API_BASE}/products/${dbItem.id}`, { method: "DELETE" });
          }
        }
      } catch (err) {
        console.error("Failed to sync products with B2B API:", err);
      }
    }
  };

  // Timer settings synchronizers
  const setTimerEnabled = async (active: boolean) => {
    setTimerEnabledState(active);
    if (isOfflineMode) {
      setLocalTimerEnabled(active);
    } else {
      try {
        await fetch(`${API_BASE}/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "timer_enabled", value: String(active) })
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const setTimerTargetDate = async (date: string) => {
    setTimerTargetDateState(date);
    if (isOfflineMode) {
      setLocalTimerTargetDate(date);
    } else {
      try {
        await fetch(`${API_BASE}/settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "timer_target_date", value: date })
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Coupon operations
  const applyCoupon = (code: string): boolean => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      setActiveCoupon(coupon);
      return true;
    }
    return false;
  };

  const removeAppliedCoupon = () => {
    setActiveCoupon(null);
  };

  const addCoupon = async (coupon: Coupon) => {
    setCouponsState((prev) => [...prev, coupon]);
    if (isOfflineMode) {
      setLocalCoupons([...coupons, coupon]);
    } else {
      try {
        await fetch(`${API_BASE}/coupons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coupon)
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const removeCoupon = async (code: string) => {
    setCouponsState((prev) => prev.filter((c) => c.code !== code));
    if (isOfflineMode) {
      setLocalCoupons(coupons.filter((c) => c.code !== code));
    } else {
      try {
        await fetch(`${API_BASE}/coupons/${code}`, { method: "DELETE" });
      } catch (err) {
        console.error(err);
      }
    }
    if (activeCoupon?.code === code) {
      setActiveCoupon(null);
    }
  };

  // Place Order checkout B2B integration
  const placeOrder = async (customerName: string, phone: string, address: string): Promise<Order> => {
    const items = cart.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));
    
    let subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    let discountAmount = 0;
    if (activeCoupon) {
      discountAmount = (subtotal * activeCoupon.discountPercent) / 100;
    }
    const finalTotal = Math.round((subtotal - discountAmount) * 1.18); // 18% GST

    const orderPayload = {
      customerName,
      phone,
      address,
      items,
      total: finalTotal
    };

    if (isOfflineMode) {
      const orderId = `VC-${Math.floor(100000 + Math.random() * 900000)}`;
      const localNewOrder: Order = {
        id: orderId,
        customerName,
        phone,
        address,
        items,
        total: finalTotal,
        status: "Placed",
        createdAt: new Date().toISOString()
      };
      setOrdersState(prev => [localNewOrder, ...prev]);
      setLocalOrders([localNewOrder, ...localOrders]);
      clearCart();
      removeAppliedCoupon();
      return localNewOrder;
    } else {
      try {
        const res = await fetch(`${API_BASE}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload)
        });
        if (res.ok) {
          const apiOrder = await res.json();
          setOrdersState(prev => [apiOrder, ...prev]);
          clearCart();
          removeAppliedCoupon();
          return apiOrder;
        } else {
          throw new Error("Failed to post order to server");
        }
      } catch (err) {
        console.error("Order B2B API POST failed, fallback to local storage:", err);
        // Local fallback
        const orderId = `VC-${Math.floor(100000 + Math.random() * 900000)}`;
        const localNewOrder: Order = {
          id: orderId,
          customerName,
          phone,
          address,
          items,
          total: finalTotal,
          status: "Placed",
          createdAt: new Date().toISOString()
        };
        setOrdersState(prev => [localNewOrder, ...prev]);
        setLocalOrders([localNewOrder, ...localOrders]);
        clearCart();
        removeAppliedCoupon();
        return localNewOrder;
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrdersState((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    if (isOfflineMode) {
      setLocalOrders(localOrders.map(o => o.id === orderId ? { ...o, status } : o));
    } else {
      try {
        await fetch(`${API_BASE}/orders/${orderId}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // B2B Wholesaler requests
  const requestDealerAccess = async (dealerData: any) => {
    setDealerStatus('pending');
    
    if (!isOfflineMode) {
      try {
        await fetch(`${API_BASE}/dealers/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dealerData)
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        compareList,
        toggleCompare,
        theme,
        setTheme,
        festivalMode,
        setFestivalMode,
        timerEnabled,
        setTimerEnabled,
        timerTargetDate,
        setTimerTargetDate,
        orders,
        placeOrder,
        updateOrderStatus,
        coupons,
        addCoupon,
        removeCoupon,
        activeCoupon,
        applyCoupon,
        removeAppliedCoupon,
        dealerStatus,
        requestDealerAccess,
        isOfflineMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
