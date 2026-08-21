"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DailyReport, Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, Utensils, FileText, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/reports").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ])
      .then(([rep, orders]) => {
        setReport(rep);
        setRecentOrders(orders.slice(0, 8));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-sm"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-stone-400">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border p-5">
              <div className="text-sm text-stone-500">Today's Orders</div>
              <div className="text-3xl font-bold mt-1">{report?.totalOrders ?? 0}</div>
            </div>
            <div className="bg-white rounded-2xl border p-5">
              <div className="text-sm text-stone-500">Revenue</div>
              <div className="text-3xl font-bold mt-1">{formatCurrency(report?.totalRevenue ?? 0)}</div>
            </div>
            <div className="bg-white rounded-2xl border p-5">
              <div className="text-sm text-stone-500">Avg Order</div>
              <div className="text-3xl font-bold mt-1">{formatCurrency(report?.averageOrderValue ?? 0)}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/admin/menu" className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium">
              <Utensils size={16} /> Manage Menu
            </Link>
            <Link href="/admin/reports" className="flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-sm font-medium">
              <BarChart3 size={16} /> Reports
            </Link>
            <Link href="/kitchen" className="flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-sm font-medium">
              <FileText size={16} /> Kitchen View
            </Link>
          </div>

          <h2 className="font-semibold text-lg mb-3">Recent Orders</h2>
          <div className="bg-white rounded-2xl border overflow-hidden">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-stone-400">No orders yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-left">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="px-4 py-3 font-mono text-xs">{o.id.slice(-8)}</td>
                      <td className="px-4 py-3">{o.status}</td>
                      <td className="px-4 py-3">{formatCurrency(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
