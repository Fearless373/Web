"use client";

import { useEffect, useState, useMemo } from "react";
import { MenuItem } from "@/lib/types";
import { CATEGORIES, INITIAL_MENU } from "@/data/menu";
import MenuItemCard from "@/components/MenuItemCard";
import { Search } from "lucide-react";

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/menu")
      .then(async (r) => {
        if (!r.ok) throw new Error(`API ${r.status}`);
        const data = await r.json();
        if (!Array.isArray(data)) throw new Error("Invalid response");
        return data as MenuItem[];
      })
      .then((data) => {
        if (!cancelled) {
          setMenu(data.length > 0 ? data : INITIAL_MENU);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Menu fetch failed, using fallback:", err);
        if (!cancelled) {
          // Fallback to static menu so the site always shows dishes
          setMenu(INITIAL_MENU);
          setError("Using offline menu data");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return menu.filter((item) => {
      if (!item || !item.isVisible) return false;
      const matchCat = category === "All" || item.category === category;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.ingredients &&
          item.ingredients.some((i) => i.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    });
  }, [menu, category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Our Menu</h1>
        <p className="text-stone-500 mt-1">Fresh ingredients, carefully prepared</p>
        {error && (
          <p className="text-xs text-amber-600 mt-1">{error}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            size={18}
          />
          <input
            type="search"
            placeholder="Search dishes, ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                category === cat
                  ? "bg-amber-600 text-white"
                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl h-80 animate-pulse border border-stone-100"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          <p className="text-lg">No dishes found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
