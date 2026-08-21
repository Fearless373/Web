"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingCart, Home } from "lucide-react";

export default function Header() {
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-amber-700">
            <span className="text-2xl">🍽️</span>
            <span className="hidden sm:inline">Bistro Order</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition"
            >
              <Home size={18} />
              <span className="hidden sm:inline text-sm font-medium">Menu</span>
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
