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
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleAdd = () => {
    const extras = Object.values(selectedOptions).reduce((sum, label) => {
      // simple extra price lookup would go here
      return sum;
    }, 0);
    addItem({
      ...item,
      menuItemId: item.id,
      quantity: 1,
      unitPrice: item.price + extras,
      customizations: selectedOptions,
    } as any);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition flex flex-col">
      <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">
            Unavailable
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-stone-900">{item.name}</h3>
          <span className="font-bold text-amber-700 whitespace-nowrap">
            {formatCurrency(item.price)}
          </span>
        </div>
        <p className="text-sm text-stone-500 mt-1 line-clamp-2 flex-1">
          {item.description}
        </p>
        {item.allergens && item.allergens.length > 0 && (
          <p className="text-xs text-stone-400 mt-2">
            Allergens: {item.allergens.join(", ")}
          </p>
        )}
        <button
          onClick={handleAdd}
          disabled={!item.isAvailable}
          className={`mt-4 w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
            added
              ? "bg-green-600 text-white"
              : item.isAvailable
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          {added ? (
            <>
              <Check size={18} /> Added
            </>
          ) : (
            <>
              <Plus size={18} /> Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
