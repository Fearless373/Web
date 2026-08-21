"use client";

import { useState } from "react";
import { MenuItem } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Plus, Check } from "lucide-react";

interface Props {
  item: MenuItem;
}

export default function MenuItemCard({ item }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAdd = () => {
    if (!item.isAvailable) return;
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      allergens: item.allergens,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition group">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
            }}
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
          <button
            onClick={() => setShowDetails(true)}
            className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-xs font-medium px-2 py-1 rounded-full text-stone-700 hover:bg-white"
          >
            Details
          </button>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-semibold text-stone-900">{item.name}</h3>
              <p className="text-sm text-stone-500 line-clamp-2 mt-0.5">
                {item.description}
              </p>
            </div>
            <span className="font-bold text-amber-700 whitespace-nowrap">
              {formatCurrency(item.price)}
            </span>
          </div>
          {item.allergens && item.allergens.length > 0 && (
            <p className="text-xs text-orange-600 mt-1">Contains: {item.allergens.join(", ")}</p>
          )}
          <button
            onClick={handleAdd}
            disabled={!item.isAvailable}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition ${
              added
                ? "bg-green-600 text-white"
                : item.isAvailable
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {added ? (
              <>
                <Check size={18} /> Added
              </>
            ) : (
              <>
                <Plus size={18} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {showDetails && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-48 object-cover rounded-t-2xl"
            />
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-stone-900">{item.name}</h2>
                <span className="text-lg font-bold text-amber-700">
                  {formatCurrency(item.price)}
                </span>
              </div>
              <p className="text-stone-600 mt-2">{item.description}</p>
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-stone-800">Ingredients</h4>
                <p className="text-sm text-stone-600">{item.ingredients?.join(", ")}</p>
              </div>
              {item.allergens && item.allergens.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-orange-700">Allergens</h4>
                  <p className="text-sm text-orange-600">{item.allergens.join(", ")}</p>
                </div>
              )}
              <button
                onClick={() => {
                  handleAdd();
                  setShowDetails(false);
                }}
                disabled={!item.isAvailable}
                className="mt-5 w-full py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 disabled:opacity-50"
              >
                {item.isAvailable ? "Add to Cart" : "Out of Stock"}
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="mt-2 w-full py-2 text-stone-500 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
