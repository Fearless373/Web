"use client";

import { useEffect, useState } from "react";
import { Order } from "@/lib/types";

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    const load = () => fetch("/api/orders?status=PENDING,PREPARING,READY").then(r => r.json()).then(setOrders);
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as any } : o));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Kitchen Display</h1>
      <div className="grid gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white border rounded-2xl p-4">
            <div className="flex justify-between">
              <span className="font-bold">{order.id}</span>
              <span className="text-sm">{order.status}</span>
            </div>
            <ul className="mt-2 text-sm">
              {order.items?.map((i: any, idx: number) => (
                <li key={idx}>{i.quantity}x {i.name}</li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              {order.status === "PENDING" && <button onClick={() => updateStatus(order.id, "PREPARING")} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">Start</button>}
              {order.status === "PREPARING" && <button onClick={() => updateStatus(order.id, "READY")} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm">Ready</button>}
              {order.status === "READY" && <button onClick={() => updateStatus(order.id, "COMPLETED")} className="px-3 py-1 bg-stone-600 text-white rounded-lg text-sm">Complete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
