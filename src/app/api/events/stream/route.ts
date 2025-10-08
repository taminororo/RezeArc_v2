// src/app/api/events/stream/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * SSE エンドポイントは廃止しました。
 * クライアントは /api/events/lastupdated をポーリングして変更を検知してください。
 */
export async function GET() {
  return NextResponse.json(
    { error: "SSE endpoint removed. Use /api/events/lastupdated polling instead." },
    {
      status: 410,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
