import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { MenuItem } from "@/lib/types";

export async function GET(req: NextRequest) {
  const includeHidden = req.nextUrl.searchParams.get("all") === "true";
  const menu = store.getMenu(includeHidden);
  return NextResponse.json(menu);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Basic validation
    if (!body.name || typeof body.price !== "number") {
      return NextResponse.json({ error: "Invalid menu item data" }, { status: 400 });
    }
    const item = store.addMenuItem({
      name: body.name,
      description: body.description || "",
      price: body.price,
      category: body.category || "Mains",
      imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      isAvailable: body.isAvailable ?? true,
      isVisible: body.isVisible ?? true,
      allergens: body.allergens || [],
      ingredients: body.ingredients || [],
      options: body.options,
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const updated = store.updateMenuItem(body.id, body as Partial<MenuItem>);
    if (!updated) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const ok = store.deleteMenuItem(id);
  if (!ok) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
