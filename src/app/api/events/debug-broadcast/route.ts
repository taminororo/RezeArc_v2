// src/app/api/events/debug-broadcast/route.ts
import { NextResponse } from "next/server";
import { bus } from "@/lib/bus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  bus.emitUpdate({ type: "bulkInvalidate" });
  return NextResponse.json({ ok: true });
}
