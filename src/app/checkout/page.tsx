"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotals, clearCart } = useCartStore();
  const totals = getTotals();
  const [name, setName] = useState("");
  const [table, setTable] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          tableNumber: table,
          items: items.map(i => ({ name: i.name, quantity: i.quantity, unitPrice: i.price, menuItemId: i.menuItemId })),
          ...totals,
        }),
      });
      const order = await res.json();
      clearCart();
      router.push(`/order/${order.id}`);
    } catch {
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return <div className="p-8 text-center">Cart is empty</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="w-full p-3 border rounded-xl" />
        <input value={table} onChange={e => setTable(e.target.value)} placeholder="Table number" className="w-full p-3 border rounded-xl" />
        <div className="bg-stone-50 p-4 rounded-xl">
          <p>Total: {formatCurrency(totals.total)}</p>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold">
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
