// src/app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { bus } from "@/lib/bus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  ticket_status: z.enum(["distributing", "limited", "ended"]).nullable().optional(),
  congestion_status: z.enum(["free", "slightly_crowded", "crowded", "offtime"]),
  event_text: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ← このままでもOK、気になるなら Promise を外してもOK
) {
  const { id } = await context.params;
  const urlEventId = Number(id);

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid body", detail: String(e) }, { status: 400 });
  }

  const existing = await prisma.event.findUnique({ where: { eventId: urlEventId } });
  if (!existing) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  const nextTicketStatus =
    existing.isDistributingTicket ? body.ticket_status ?? existing.ticketStatus ?? "distributing" : null;

  const updated = await prisma.event.update({
    where: { eventId: urlEventId },
    data: {
      ticketStatus: nextTicketStatus,
      congestionStatus: body.congestion_status,
      eventText: body.event_text?.trim() ? body.event_text : null,
    },
  });

  // ←←← ここで “同じ bus” に対して emit
  try {
    console.log("[events:update] emit", updated.eventId);
    bus.emitUpdate({ type: "eventUpdated", eventId: updated.eventId });
    console.log("[events:update] emitted");
  } catch (e) {
    console.warn("[events:update] emit failed", e);
  }

  return NextResponse.json(
    {
      event_id: updated.eventId,
      isDistributingTicket: updated.isDistributingTicket,
      ticket_status: updated.ticketStatus,
      congestion_status: updated.congestionStatus,
      event_text: updated.eventText,
      updated_at: updated.updatedAt,
    },
    { status: 200 }
  );
}
