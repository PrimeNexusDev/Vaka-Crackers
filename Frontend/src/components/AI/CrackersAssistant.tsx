"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles, ShoppingBag, RotateCcw } from "lucide-react";
import { useApp, Product } from "../../context/AppContext";

interface Message {
  sender: "bot" | "user";
  text: string;
  options?: string[];
  type?: "budget" | "age" | "occasion" | "package" | "text";
  packageData?: {
    name: string;
    price: number;
    items: { name: string; quantity: number }[];
    description: string;
    productObjects: { product: Product; qty: number }[];
  };
}

export const CrackersAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { products, addToCart } = useApp();
  
  // Quiz State
  const [quizState, setQuizState] = useState({
    budget: 0,
    age: "",
    occasion: ""
  });

  const initialBotMessage: Message = {
    sender: "bot",
    text: "🔥 Welcome to Vaka Fireworks AI Assistant! I can design the perfect crackers package for your budget and celebration. Let's start with your budget limit:",
    options: ["Under ₹1,500", "₹1,500 - ₹3,500", "₹3,500 - ₹6,000", "₹6,000+"],
    type: "budget"
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [inputValue, setInputValue] = useState("");

  const generatePackage = (budget: number, age: string, occasion: string) => {
    // Select products from App Context matching age group
    let filteredProds = products.filter(p => p.stock > 0);
    
    if (age === "Kids") {
      filteredProds = filteredProds.filter(p => p.ageGroup === "Kids" || p.soundLevel === "Eco-Friendly" || p.soundLevel === "Silent");
    } else if (age === "Adults") {
      filteredProds = filteredProds.filter(p => p.ageGroup === "Adults" || p.soundLevel === "Loud");
    }

    const packageItems: { product: Product; qty: number }[] = [];
    let currentCost = 0;
    
    // Sort products: put bestsellers first, or randomise
    const sortedProds = [...filteredProds].sort(() => Math.random() - 0.5);
    
    // Greedy select products to fit 85% of budget (leaving room for taxes/shipping if any)
    const targetBudget = budget * 0.85;

    for (const prod of sortedProds) {
      if (currentCost + prod.price <= targetBudget) {
        // How many of this item can we add?
        const maxQty = Math.min(3, Math.floor((targetBudget - currentCost) / prod.price));
        if (maxQty > 0) {
          packageItems.push({ product: prod, qty: maxQty });
          currentCost += prod.price * maxQty;
        }
      }
      if (currentCost >= targetBudget) break;
    }

    // Fallback: If list is empty, pick a pre-designed gift box
    if (packageItems.length === 0) {
      const giftBox = products.find(p => p.category === "Gift Boxes") || products[0];
      packageItems.push({ product: giftBox, qty: 1 });
      currentCost = giftBox.price;
    }

    const packageName = `${occasion} ${age} Special Bundle`;
    const packageDesc = `A bespoke premium selection of ${packageItems.reduce((a, b) => a + b.qty, 0)} items crafted for a glorious ${occasion.toLowerCase()} event safety-tailored for ${age.toLowerCase()}.`;

    return {
      name: packageName,
      price: Math.round(currentCost),
      description: packageDesc,
      items: packageItems.map(item => ({ name: item.product.name, quantity: item.qty })),
      productObjects: packageItems
    };
  };

  const handleOptionClick = (option: string, type: Message['type']) => {
    // Add user response to chat
    const newUserMsg: Message = { sender: "user", text: option };
    setMessages(prev => [...prev, newUserMsg]);

    setTimeout(() => {
      if (type === "budget") {
        let budgetVal = 1000;
        if (option.includes("1,500 -")) budgetVal = 2500;
        else if (option.includes("3,500 -")) budgetVal = 4800;
        else if (option.includes("6,000+")) budgetVal = 8000;
        
        setQuizState(prev => ({ ...prev, budget: budgetVal }));

        setMessages(prev => [...prev, {
          sender: "bot",
          text: "Perfect! Who will be enjoying this fireworks display the most?",
          options: ["Kids Special (Low noise/Safe)", "Family Combo (All age groups)", "Adults Blast (High decibel bombs)"],
          type: "age"
        }]);
      } else if (type === "age") {
        let ageVal = "Family";
        if (option.includes("Kids")) ageVal = "Kids";
        else if (option.includes("Adults")) ageVal = "Adults";

        setQuizState(prev => ({ ...prev, age: ageVal }));

        setMessages(prev => [...prev, {
          sender: "bot",
          text: "Got it. What occasion is this festive collection for?",
          options: ["Diwali Celebration", "Grand Wedding", "Temple Festival", "Birthday/New Year Bash"],
          type: "occasion"
        }]);
      } else if (type === "occasion") {
        const finalOccasion = option.split(" ")[0];
        const budget = quizState.budget;
        const age = quizState.age;
        
        const createdPackage = generatePackage(budget, age, finalOccasion);

        setMessages(prev => [...prev, {
          sender: "bot",
          text: "✨ I've designed the ultimate luxury package matching all your preferences! Check the details below:",
          type: "package",
          packageData: createdPackage
        }]);
      }
    }, 500);
  };

  const handleReset = () => {
    setMessages([initialBotMessage]);
    setQuizState({ budget: 0, age: "", occasion: "" });
  };

  const handleAddPackageToCart = (pkgData: NonNullable<Message['packageData']>) => {
    pkgData.productObjects.forEach(item => {
      addToCart(item.product, item.qty);
    });
    
    // Add success message
    setMessages(prev => [...prev, {
      sender: "bot",
      text: `🎉 Success! Added "${pkgData.name}" items to your cart! You can preview your cart or run another recommendation helper.`
    }]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInputValue("");

    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "I am best at tailoring packages using my interactive assistant guides. Click Reset below to configure your custom fireworks bundle!",
      }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6 no-print">
      {/* Bot Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary-gold to-crimson-red text-white shadow-lg shadow-primary-gold/20 hover:scale-105 transition-all duration-300 group"
        aria-label="AI Fireworks Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-gold text-[9px] font-bold text-black items-center justify-center">AI</span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[90vw] sm:w-[380px] max-h-[500px] flex flex-col rounded-2xl border border-primary-gold/20 bg-neutral-950/95 backdrop-blur-xl shadow-2xl text-white overflow-hidden transition-all duration-300 scale-95 origin-bottom-right">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border-b border-primary-gold/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <Sparkles size={16} className="text-primary-gold animate-bounce" />
              <div>
                <h3 className="text-sm font-bold tracking-wide font-cinzel text-primary-gold">AI Crackers Matcher</h3>
                <p className="text-[10px] text-neutral-400">Powered by Vaka Sivakasi</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Restart Chat"
                className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-400 hover:text-white"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[340px] text-sm scrollbar-thin scrollbar-thumb-primary-gold">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    msg.sender === "user"
                      ? "bg-primary-gold text-neutral-950 font-medium rounded-tr-none"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>

                {/* Option Chips */}
                {msg.options && (
                  <div className="mt-2 flex flex-wrap gap-2 justify-start max-w-[90%]">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(opt, msg.type)}
                        className="py-1.5 px-3 rounded-full border border-primary-gold/30 bg-neutral-950 hover:bg-primary-gold hover:text-neutral-950 text-primary-gold text-xs transition-colors duration-200"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Package Presentation Card */}
                {msg.type === "package" && msg.packageData && (
                  <div className="mt-3 w-full bg-gradient-to-b from-neutral-900 to-neutral-950 border border-primary-gold/40 rounded-xl p-3.5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-primary-gold font-cinzel text-xs uppercase tracking-wider">
                        {msg.packageData.name}
                      </h4>
                      <span className="text-sm font-black text-white bg-crimson-red/20 border border-crimson-red/40 px-2 py-0.5 rounded">
                        ₹{msg.packageData.price}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-tight">
                      {msg.packageData.description}
                    </p>

                    <div className="border-t border-neutral-800 pt-2 space-y-1.5">
                      <p className="text-[10px] text-primary-gold font-semibold uppercase tracking-wider">Includes:</p>
                      <ul className="text-xs space-y-1 text-neutral-300">
                        {msg.packageData.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span className="truncate max-w-[80%]">✓ {item.name}</span>
                            <span className="font-bold text-primary-gold">x{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleAddPackageToCart(msg.packageData!)}
                      className="w-full mt-2 py-2 px-3 flex items-center justify-center gap-1.5 rounded-lg bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 font-bold text-xs transition-colors shadow-md shadow-primary-gold/10"
                    >
                      <ShoppingBag size={14} />
                      Add Bundle to Cart
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Text Input Footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-neutral-900 bg-neutral-950 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 py-1.5 px-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-gold text-xs"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-primary-gold hover:bg-primary-gold-hover text-neutral-950 transition-colors"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
