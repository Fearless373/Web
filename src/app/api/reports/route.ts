import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") || undefined;
  const report = store.getDailyReport(date);
  return NextResponse.json(report);
}
