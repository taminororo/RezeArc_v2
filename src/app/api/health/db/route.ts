// src/app/api/health/db/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * 簡易な DB ヘルスチェック API。
 * - 成功時: { ok: true, count: <Event 件数> }
 * - 失敗時: HTTP 500 を返す
 *
 * クライアントは GET で本エンドポイントを叩き、DB 接続や簡易クエリの成否を確認できます。
 */
export async function GET() {
  try {
    const count = await prisma.event.count();
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
  } catch (err) {
    console.error("/api/health/db GET error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
