"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`).then(r => r.json()).then(setOrder);
  }, [id]);

  if (!order) return <div className="p-8 text-center">Loading order...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Order {order.id}</h1>
      <p className="text-stone-500 mb-6">Status: <span className="font-semibold text-amber-700">{order.status}</span></p>
      <div className="bg-white border rounded-2xl p-4 space-y-2">
        {order.items?.map((item: any, i: number) => (
          <div key={i} className="flex justify-between">
            <span>{item.quantity}x {item.name}</span>
            <span>{formatCurrency((item.unitPrice || item.price) * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t pt-2 font-bold flex justify-between">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
      <Link href="/" className="mt-6 block text-center text-amber-700 font-medium">Back to Menu</Link>
    </div>
  );
}
