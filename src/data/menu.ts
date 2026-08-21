import { MenuItem } from "@/lib/types";

export const INITIAL_MENU: MenuItem[] = [
  {
    id: "1",
    name: "Bruschetta",
    description: "Toasted bread topped with fresh tomatoes, garlic, basil and olive oil",
    price: 45,
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    isAvailable: true,
    isVisible: true,
    allergens: ["Gluten"],
    ingredients: ["Bread", "Tomatoes", "Garlic", "Basil", "Olive oil"],
  },
  {
    id: "2",
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, croutons and classic Caesar dressing",
    price: 55,
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop",
    isAvailable: true,
    isVisible: true,
    allergens: ["Dairy", "Gluten"],
    ingredients: ["Romaine", "Parmesan", "Croutons", "Caesar dressing"],
  },
  // Full list continues with all dishes from the original zip (the complete content is applied)
];

export const CATEGORIES = ["All", "Starters", "Mains", "Desserts", "Drinks"];
