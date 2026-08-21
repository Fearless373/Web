"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotals, clearCart } = useCartStore();
  const totals = getTotals();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-stone-900">Your cart is empty</h1>
        <p className="text-stone-500 mt-2">Add some delicious dishes from the menu</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-stone-500 hover:text-red-600 transition"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={`${item.menuItemId}-${JSON.stringify(item.customizations)}`}
            className="bg-white rounded-2xl border border-stone-100 p-4 flex gap-4"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-20 h-20 rounded-xl object-cover bg-stone-100"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-stone-900 truncate">{item.name}</h3>
              <p className="text-sm text-amber-700 font-medium mt-0.5">
                {formatCurrency(item.price)}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 bg-stone-100 rounded-lg">
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItemId, item.quantity - 1, item.customizations)
                    }
                    className="p-1.5 hover:bg-stone-200 rounded-l-lg"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItemId, item.quantity + 1, item.customizations)
                    }
                    className="p-1.5 hover:bg-stone-200 rounded-r-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.menuItemId, item.customizations)}
                  className="p-1.5 text-stone-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
                <span className="ml-auto font-semibold text-stone-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>VAT (15%)</span>
          <span>{formatCurrency(totals.tax)}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Service Charge (5%)</span>
          <span>{formatCurrency(totals.serviceFee)}</span>
        </div>
        <div className="border-t border-stone-100 pt-3 flex justify-between text-lg font-bold text-stone-900">
          <span>Total</span>
          <span>{formatCurrency(totals.total)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition"
        >
          Proceed to Checkout <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
