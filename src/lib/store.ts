import { MenuItem, Order, OrderStatus, DailyReport } from "./types";
import { INITIAL_MENU } from "@/data/menu";

// Simple in-memory store for demo / single-instance deployment.
// For multi-instance production, replace with PostgreSQL + Redis.

class Store {
  private menu: MenuItem[] = [...INITIAL_MENU];
  private orders: Order[] = [];
  private listeners: Set<() => void> = new Set();

  // Menu
  getMenu(includeHidden = false): MenuItem[] {
    return this.menu.filter((m) => includeHidden || m.isVisible);
  }

  getMenuItem(id: string): MenuItem | undefined {
    return this.menu.find((m) => m.id === id);
  }

  updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const idx = this.menu.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.menu[idx] = { ...this.menu[idx], ...updates };
    this.notify();
    return this.menu[idx];
  }

  addMenuItem(item: Omit<MenuItem, "id">): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    this.menu.push(newItem);
    this.notify();
    return newItem;
  }

  deleteMenuItem(id: string): boolean {
    const idx = this.menu.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    this.menu.splice(idx, 1);
    this.notify();
    return true;
  }

  // Orders
  getOrders(statusFilter?: OrderStatus[]): Order[] {
    let result = [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (statusFilter && statusFilter.length > 0) {
      result = result.filter((o) => statusFilter.includes(o.status));
    }
    return result;
  }

  getOrder(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  createOrder(
    data: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">
  ): Order {
    const now = new Date().toISOString();
    const order: Order = {
      ...data,
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };
    this.orders.unshift(order);
    this.notify();
    return order;
  }

  updateOrderStatus(id: string, status: OrderStatus): Order | null {
    const order = this.orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.notify();
    return order;
  }

  // Analytics
  getDailyReport(dateStr?: string): DailyReport {
    const target = dateStr || new Date().toISOString().slice(0, 10);
    const dayOrders = this.orders.filter((o) =>
      o.createdAt.startsWith(target)
    );

    const totalRevenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
    const itemMap = new Map<string, { quantity: number; revenue: number }>();

    dayOrders.forEach((o) => {
      o.items.forEach((item) => {
        const existing = itemMap.get(item.name) || { quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.quantity * item.unitPrice;
        itemMap.set(item.name, existing);
      });
    });

    const popularItems = Array.from(itemMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const hourMap = new Map<number, number>();
    dayOrders.forEach((o) => {
      const hour = new Date(o.createdAt).getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });
    const peakHours = Array.from(hourMap.entries())
      .map(([hour, orders]) => ({ hour, orders }))
      .sort((a, b) => a.hour - b.hour);

    const statusBreakdown: Record<OrderStatus, number> = {
      PENDING: 0,
      PREPARING: 0,
      READY: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    dayOrders.forEach((o) => {
      statusBreakdown[o.status]++;
    });

    return {
      date: target,
      totalOrders: dayOrders.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageOrderValue:
        dayOrders.length > 0
          ? Math.round((totalRevenue / dayOrders.length) * 100) / 100
          : 0,
      popularItems,
      peakHours,
      statusBreakdown,
    };
  }

  // Subscription for simple reactivity (polling fallback)
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

// Singleton
const globalForStore = globalThis as unknown as { store: Store };
export const store = globalForStore.store || new Store();
globalForStore.store = store;
