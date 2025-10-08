// src/app/api/events/lastupdated/route.ts
import { NextResponse } from "next/server";
import { Client } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Prisma -> pg に置き換えた実装。
 * 注意: 指示により接続情報はハードコードしています（セキュリティ無視）。
 */
export async function GET() {
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

    const result = await client.query('SELECT MAX("updatedAt") AS max_updated_at FROM "Event";');
    const raw = result.rows?.[0]?.max_updated_at ?? null;
    const ts = raw ? new Date(raw).toISOString() : null;

    await client.end();

    return NextResponse.json(
      { last_updated: ts },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err: any) {
    console.error("/api/events/lastupdated GET error (pg):", err);
    try {
      await client.end().catch(() => {});
    } catch {}
    return new NextResponse(
      JSON.stringify({ ok: false, error: String(err?.message ?? err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
