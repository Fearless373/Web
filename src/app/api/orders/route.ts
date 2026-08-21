import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { OrderStatus } from "@/lib/types";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const statuses = status ? (status.split(",") as OrderStatus[]) : undefined;
  const orders = store.getOrders(statuses);
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Order must have items" }, { status: 400 });
    }

    // Simple rate limiting simulation (in real app use Redis)
    const recent = store.getOrders().filter(
      (o) => Date.now() - new Date(o.createdAt).getTime() < 5000
    );
    if (recent.length > 10) {
      return NextResponse.json({ error: "Too many orders. Please wait." }, { status: 429 });
    }

    const order = store.createOrder({
      tableNumber: body.tableNumber,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      orderType: body.orderType || "TABLE",
      items: body.items,
      subtotal: body.subtotal,
      tax: body.tax,
      serviceFee: body.serviceFee,
      total: body.total,
      specialInstructions: body.specialInstructions,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
