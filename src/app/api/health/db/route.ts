// src/app/api/health/db/route.ts
import { NextResponse } from "next/server";
import { promisify } from "util";
import { exec as _exec } from "child_process";
const exec = promisify(_exec);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * 危険: セキュリティを無視して psql コマンドを直接実行します。
 * 指示どおり PGPASSWORD を埋め込み、psql 実行結果の count を返します。
 *
 * 注意点（ユーザー責任）:
 * - このコードは機密情報をハードコードしています。
 * - Vercel の環境ではシェル実行が制限される場合があります。
 * - 実行に失敗した場合は 500 を返します。
 */
export async function GET() {
  try {
    const command = `PGPASSWORD='sk_pb4NiyY8jcRqDERPiEdrz' /opt/homebrew/opt/libpq/bin/psql -U 3a0c9eb3fda497ca0b32cc2c58720554b7ec072faff9b39c89cc11f0aaa26485 -h db.prisma.io -p 5432 -d postgres -c "SELECT COUNT(*) FROM \"Event\";"`;
    // 実行タイムアウトと十分なバッファを設定
    const { stdout, stderr } = (await exec(command, { timeout: 15000, maxBuffer: 10 * 1024 * 1024 })) as { stdout: string; stderr: string };

    // stdout から数値を抽出する (psql のテーブル出力の中の最初の数値行を拾う)
    const match = stdout.match(/^[ \t]*(\d+)[ \t]*$/m);
    if (match) {
      const count = parseInt(match[1], 10);
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
    }

    // 解析失敗の場合、デバッグ用に stdout/stderr を返す（500）
    console.error("psql output parse error", { stdout, stderr });
    return new NextResponse(
      JSON.stringify({ ok: false, error: "psql output parse error", stdout, stderr }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("/api/health/db GET error:", err);
    return new NextResponse(String(err?.message ?? err), { status: 500 });
  }
}
