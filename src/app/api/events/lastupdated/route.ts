// src/app/api/events/last-updated/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const { _max } = await prisma.event.aggregate({ _max: { updatedAt: true } });
    const ts = _max.updatedAt ? _max.updatedAt.toISOString() : null;

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
  } catch (err) {
    // 詳細は Vercel の Function ログに出力（本番では機密情報を返さない）
    console.error("/api/events/lastupdated GET error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
