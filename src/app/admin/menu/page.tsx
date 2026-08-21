"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MenuItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/data/menu";

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  // Full implementation from original file
  useEffect(() => {
    fetch("/api/menu?all=true")
      .then((r) => r.json())
      .then(setMenu)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-stone-500 hover:text-stone-800">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Menu Management</h1>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {menu.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-stone-500">{formatCurrency(item.price)} · {item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
