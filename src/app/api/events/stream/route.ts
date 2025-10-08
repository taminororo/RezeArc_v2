// src/app/api/events/stream/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 変化検知のポーリング間隔（ms）
const POLL_MS = Number(process.env.SSE_POLL_MS ?? 2000);

export async function GET(req: NextRequest) {
  let closed = false;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let pingTimer: ReturnType<typeof setInterval> | null = null;
      let pollTimer: ReturnType<typeof setInterval> | null = null;
      let lastMaxUpdatedAt = new Date(0);

      function cleanup() {
        if (closed) return;
        closed = true;
        try { if (pingTimer) clearInterval(pingTimer); } catch {}
        try { if (pollTimer) clearInterval(pollTimer); } catch {}
        try { controller.close(); } catch {}
      }

      function send(event: string, data: unknown) {
        if (closed) return;
        try {
          const payload =
            typeof data === "string" ? data : JSON.stringify(data ?? {});
          controller.enqueue(
            encoder.encode(`event: ${event}\n` + `data: ${payload}\n\n`)
          );
        } catch {
          // enqueue 失敗＝ほぼクローズ済み
          cleanup();
        }
      }

      // 初回ハンドシェイク
      send("hello", {});

      // keep-alive（プロキシ対策）
      pingTimer = setInterval(() => send("ping", {}), 15000);

      // 直近の最大 updatedAt を初期化
      // 初回で全件を update 扱いにしたくないなら now-1s にしてもOK
      lastMaxUpdatedAt = new Date(0);

      // DB の最大 updatedAt を監視（軽量）
      async function pollOnce() {
        if (closed) return;
        try {
          const { _max } = await prisma.event.aggregate({
            _max: { updatedAt: true },
          });
          const latest = _max.updatedAt ?? new Date(0);
          if (latest > lastMaxUpdatedAt) {
            lastMaxUpdatedAt = latest;
            // 変化を検知 → クライアント側で mutate('/api/events')
            send("update", { type: "bulkInvalidate" });
          }
        } catch {
          // 失敗時は黙って次周期
        }
      }

      // 定期ポーリング開始
      pollTimer = setInterval(pollOnce, POLL_MS);
      // 接続直後にも一回だけ覗いておく（最新へ同期）
      pollOnce();

      // クライアント切断時の掃除
      req.signal.addEventListener("abort", cleanup);

      // controller に存在するかもしれないランタイム専用ハンドラを安全に設定
      const streamController = controller as ReadableStreamDefaultController<Uint8Array> & {
        oncancel?: () => void;
        onerror?: (err: unknown) => void;
      };
      streamController.oncancel = cleanup;
      streamController.onerror = cleanup;
      
    },

    cancel() {
      // ReadableStream がキャンセルされたときの最終保険
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
