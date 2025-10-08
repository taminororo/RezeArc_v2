// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // ← NextResponse.json を使って no-store/ no-cache を明示
  return NextResponse.json(
    events.map(e => ({
      event_id: e.eventId,
      event_name: e.eventName,
      isDistributingTicket: e.isDistributingTicket,
      ticket_status: e.ticketStatus,
      congestion_status: e.congestionStatus,
      event_text: e.eventText,
      image_path: e.imagePath ?? null,
      created_at: e.createdAt,
      updated_at: e.updatedAt,
    })),
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
