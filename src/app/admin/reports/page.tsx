"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminReportsPage() {
  const [report, setReport] = useState<any>(null);
  useEffect(() => {
    fetch("/api/reports").then(r => r.json()).then(setReport);
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/admin" className="flex items-center gap-2 text-stone-500 mb-6"><ArrowLeft size={18} /> Back</Link>
      <h1 className="text-2xl font-bold mb-6">Daily Reports</h1>
      {report ? (
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <p>Date: {report.date}</p>
          <p>Total Orders: {report.totalOrders}</p>
          <p>Total Revenue: ${report.totalRevenue}</p>
          <p>Average Order: ${report.averageOrderValue}</p>
        </div>
      ) : <p>Loading...</p>}
    </div>
  );
}
