export type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export type Role = "CUSTOMER" | "KITCHEN" | "ADMIN";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  customerName?: string;
  tableNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
