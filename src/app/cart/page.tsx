"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotals, clearCart } = useCartStore();
  const totals = getTotals();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto text-stone-300 mb-4" size={64} />
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Your cart is empty</h1>
        <p className="text-stone-500 mb-6">Add some delicious dishes from the menu</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={`${item.menuItemId}-${JSON.stringify(item.customizations || {})}`}
            className="flex gap-4 bg-white rounded-xl border border-stone-100 p-4"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-stone-900">{item.name}</h3>
              <p className="text-amber-700 font-medium">
                {formatCurrency(item.price)}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1, item.customizations)}
                  className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50"
                >
                  <Minus size={14} />
                </button>
                <span className="font-medium w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1, item.customizations)}
                  className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => removeItem(item.menuItemId, item.customizations)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="text-right font-semibold text-stone-900">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-2">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Tax</span>
          <span>{formatCurrency(totals.tax)}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Service fee</span>
          <span>{formatCurrency(totals.serviceFee)}</span>
        </div>
        <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-amber-700">{formatCurrency(totals.total)}</span>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={clearCart}
            className="flex-1 py-3 border border-stone-200 rounded-xl font-medium text-stone-600 hover:bg-stone-50"
          >
            Clear Cart
          </button>
          <Link
            href="/checkout"
            className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-medium text-center hover:bg-amber-700"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
