// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import { Client } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Events list API - Prisma から pg (node-postgres) に置き換えた実装。
 * 注意: 指示により接続情報はハードコードしています（セキュリティ無視）。
 */
export async function GET() {
  const client = new Client({
    host: "db.prisma.io",
    port: 5432,
    user: "3a0c9eb3fda497ca0b32cc2c58720554b7ec072faff9b39c89cc11f0aaa26485",
    password: "sk_pb4NiyY8jcRqDERPiEdrz",
    database: "postgres",
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    // Prisma の findMany(orderBy: { updatedAt: "desc" }) 相当
    // カラム名は Prisma が生成したスキーマのフィールド名をそのままダブルクオートで指定しています。
    const q = `
      SELECT
        "eventId",
        "eventName",
        "isDistributingTicket",
        "ticketStatus",
        "congestionStatus",
        "eventText",
        "imagePath",
        "createdAt",
        "updatedAt"
      FROM "Event"
      ORDER BY "updatedAt" DESC
    `;
    const result = await client.query(q);

    // node-postgres はダブルクオートされた識別子をそのままプロパティ名として返すため
    // result.rows[i]['eventId'] のようにアクセスします。
    const mapped = result.rows.map((r: any) => ({
      event_id: r['eventId'],
      event_name: r['eventName'],
      isDistributingTicket: r['isDistributingTicket'],
      ticket_status: r['ticketStatus'],
      congestion_status: r['congestionStatus'],
      event_text: r['eventText'],
      image_path: r['imagePath'] ?? null,
      created_at: r['createdAt'],
      updated_at: r['updatedAt'],
    }));

    await client.end();

    return NextResponse.json(mapped, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err: any) {
    console.error("/api/events GET error (pg):", err);
    try {
      await client.end().catch(() => {});
    } catch {}
    return new NextResponse(
      JSON.stringify({ ok: false, error: String(err?.message ?? err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
