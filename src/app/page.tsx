"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

/**
 * 簡易 DB 接続確認ページ
 *
 * - /api/health/db に GET リクエストを送り、接続の成否と event 件数を表示します。
 * - 自動で一回チェックし、再チェックボタンで手動確認できます。
 */

type SuccessStatus = { ok: true; count: number };
type ErrorStatus = { ok: false; error: string };
type Status = SuccessStatus | ErrorStatus | null;

export default function Home() {
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    setLoading(true);
    setStatus(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s タイムアウト

    try {
      const res = await fetch("/api/health/db", { cache: "no-store", signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setStatus({ ok: false, error: `HTTP ${res.status} ${text}` });
        return;
      }

      const json = (await res.json()) as { ok: boolean; count?: number };
      if (json.ok) {
        setStatus({ ok: true, count: json.count ?? 0 });
      } else {
        setStatus({ ok: false, error: "unknown response" });
      }
    } catch (err: any) {
      const message = err?.name === "AbortError" ? "timeout" : String(err?.message ?? err);
      setStatus({ ok: false, error: message });
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  useEffect(() => {
    // ページ読み込み時に一度チェック
    check();
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[24px] row-start-2 items-center sm:items-start w-full max-w-3xl">
        <div className="flex items-center gap-4">
          <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
          <h1 className="text-lg font-medium">DB 接続確認ページ</h1>
        </div>

        <p className="text-sm text-muted-foreground">
          下のボタンで /api/health/db にアクセスし、Prisma 経由で DB に接続できるかを確認します。
          （10 秒でタイムアウトします）
        </p>

        <div className="w-full bg-white/80 dark:bg-black/60 border rounded-md p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500">接続状態</div>
              <div className="mt-1 text-sm">
                {loading && <span>接続中…</span>}
                {!loading && status === null && <span>未確認</span>}
                {!loading && status && status.ok && (
                  <span className="text-green-600">成功 — Event 件数: {status.count}</span>
                )}
                {!loading && status && !status.ok && (
                  <span className="text-red-600">失敗 — {status.error}</span>
                )}
              </div>
            </div>
            <div>
              <button
                onClick={check}
                className="rounded-full border border-solid px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200"
                disabled={loading}
              >
                再チェック
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            API: <code className="bg-black/[.04] px-1 py-0.5">/api/health/db</code>
          </div>
        </div>

        <div className="mt-4 w-full">
          <ol className="font-mono list-inside list-decimal text-sm/6 text-left">
            <li className="mb-2">このページは簡易的な DB ヘルスチェック用です。</li>
            <li className="mb-2">
              期待される成功レスポンス: <code>{"{ ok: true, count: <number> }"}</code>
            </li>
            <li className="mb-2">
              失敗時は HTTP 500 などを返します。詳細はサーバーログ（Vercel の Function
              ログ）を確認してください。
            </li>
            <li className="mb-2">seed データが入っていれば count は 8 になるはずです（prisma/seed.ts を参照）。</li>
          </ol>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Next.js
        </a>
      </footer>
    </div>
  );
}
