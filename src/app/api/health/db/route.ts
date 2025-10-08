// src/app/api/health/db/route.ts
import { NextResponse } from "next/server";
import { Client } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Vercel 向け: node-postgres (pg) を使って直接 Postgres に接続する実装。
 * 指示によりセキュリティ無視で接続情報をハードコードしています（ユーザー責任で使用してください）。
 *
 * 注意:
 * - ハードコードした認証情報は絶対に公開リポジトリに残さないでください。
 * - Vercel の環境では接続先ホストやネットワークの制約がある場合があります。
 */
export async function GET() {
  // ハードコードされた接続情報（指示どおり）
  const client = new Client({
    host: "db.prisma.io",
    port: 5432,
    user: "3a0c9eb3fda497ca0b32cc2c58720554b7ec072faff9b39c89cc11f0aaa26485",
    password: "sk_pb4NiyY8jcRqDERPiEdrz",
    database: "postgres",
    ssl: {
      // Vercel 環境では自己署名証明書等により検証が失敗することがあるため緩めます（危険）。
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();

    // count を整数で取得するため ::int を使用
    const result = await client.query('SELECT COUNT(*)::int AS count FROM "Event";');

    const count = result.rows?.[0]?.count ?? 0;

    await client.end();

    return NextResponse.json(
      { ok: true, count },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err: any) {
    console.error("/api/health/db GET error (pg):", err);
    try {
      await client.end().catch(() => {});
    } catch {}
    // エラーメッセージを含めてデバッグしやすい形で返す（危険だが指示どおり）
    return new NextResponse(
      JSON.stringify({ ok: false, error: String(err?.message ?? err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
