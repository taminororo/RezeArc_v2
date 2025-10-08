// src/app/api/events/stream/route.ts
import { NextResponse } from "next/server";
import { Client } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * 旧 SSE エンドポイントの代替：
 * - DB は pg を使って直接問い合わせ、最新の updatedAt を返します（last_updated）。
 * - サーバー側で簡易キャッシュを行い、DB クエリは最大 1 回 / 60 秒に制限します（過度なポーリング対策）。
 * - クライアント側にもキャッシュ指示を返します (Cache-Control: public, max-age=60)。
 *
 * 注意（指示どおりの危険な実装点）:
 * - 接続情報はハードコードされています（本番では環境変数を使用してください）。
 * - サーバーレス環境ではインメモリキャッシュはインスタンス単位で有効であり、複数インスタンスでは完全な一貫性を保証しません。
 */

const CACHE_TTL_MS = 60 * 1000; // 60秒

// モジュールスコープの簡易キャッシュ（インメモリ）
let cached: { last_updated: string | null; fetchedAt: number } | null = null;

export async function GET() {
  const now = Date.now();

  // キャッシュが有効であればキャッシュを返す
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json(
      { last_updated: cached.last_updated, cached: true },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }

  // キャッシュが切れていれば DB を問い合わせてキャッシュを更新する
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

    const res = await client.query('SELECT MAX("updatedAt") AS max_updated_at FROM "Event";');
    const raw = res.rows?.[0]?.max_updated_at ?? null;
    const ts = raw ? new Date(raw).toISOString() : null;

    await client.end();

    // キャッシュを更新
    cached = { last_updated: ts, fetchedAt: now };

    return NextResponse.json(
      { last_updated: ts, cached: false },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err: any) {
    console.error("/api/events/stream GET error (pg):", err);
    try {
      await client.end().catch(() => {});
    } catch {}

    // エラー時は詳細を返す（指示どおりセキュリティ無視で返す）
    return new NextResponse(
      JSON.stringify({ ok: false, error: String(err?.message ?? err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
