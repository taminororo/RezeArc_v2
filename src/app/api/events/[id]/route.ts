// src/app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Client } from "pg";
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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const urlEventId = Number(id);

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "Invalid body", detail: String(e) }, { status: 400 });
  }

  const client = new Client({
    host: "db.prisma.io",
    port: 5432,
    user: "3a0c9eb3fda497ca0b32cc2c58720554b7ec072faff9b39c89cc11f0aaa26485",
    password: "sk_pb4NiyY8jcRqDERPiEdrz",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // 既存イベントの取得
    const resExist = await client.query(
      'SELECT "eventId", "isDistributingTicket", "ticketStatus", "eventText" FROM "Event" WHERE "eventId" = $1 LIMIT 1',
      [urlEventId]
    );

    if (!resExist.rows || resExist.rows.length === 0) {
      await client.end();
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const existing = resExist.rows[0];

    // nextTicketStatus を決定（Prisma 実装と同等のロジック）
    const nextTicketStatus =
      existing.isDistributingTicket ? (body.ticket_status ?? existing.ticketStatus ?? "distributing") : null;

    // 更新クエリ (updatedAt は DB 側のトリガ/DEFAULTで更新される想定だが、RETURNING で最新の行を取る)
    const updateQuery = `
      UPDATE "Event"
      SET
        "ticketStatus" = $1,
        "congestionStatus" = $2,
        "eventText" = $3,
        "updatedAt" = now()
      WHERE "eventId" = $4
      RETURNING
        "eventId", "isDistributingTicket", "ticketStatus", "congestionStatus", "eventText", "updatedAt"
    `;
    const updateValues = [nextTicketStatus, body.congestion_status, body.event_text?.trim() ? body.event_text : null, urlEventId];

    const resUpdate = await client.query(updateQuery, updateValues);
    const updated = resUpdate.rows[0];

    try {
      console.log("[events:update] emit", updated.eventId);
      bus.emitUpdate({ type: "eventUpdated", eventId: updated.eventId });
      console.log("[events:update] emitted");
    } catch (e) {
      console.warn("[events:update] emit failed", e);
    }

    await client.end();

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
  } catch (err: any) {
    console.error("/api/events/[id] POST error (pg):", err);
    try {
      await client.end().catch(() => {});
    } catch {}
    return new NextResponse(
      JSON.stringify({ ok: false, error: String(err?.message ?? err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
