// src/hooks/useLastUpdatedWatcher.ts
"use client";

import { useEffect, useRef } from "react";
import { mutate } from "swr";

type Opts = {
  keys: string[];            // 例: ["/api/events"]
  intervalMs?: number;       // 最小ポーリング間隔（ms）
  endpoint?: string;         // 例: "/api/events/lastupdated"
};

/**
 * 改善点:
 * - デフォルト間隔を長めに（10000ms）に変更して負荷を下げる
 * - タブが非表示のときはポーリングを停止（visibility API）
 * - 同時リクエストが重複しないよう in-flight ガードを追加
 * - 連続失敗時は指数バックオフ（最大 60s）でリトライ間隔を伸ばす
 */
export function useLastUpdatedWatcher(opts: Opts) {
  const { keys, intervalMs = 10000, endpoint = "/api/events/lastupdated" } = opts;
  const last = useRef<string | null>(null);
  const timer = useRef<number | null>(null);
  const inFlight = useRef(false);
  const failures = useRef(0);
  const aborted = useRef(false);

  useEffect(() => {
    aborted.current = false;

    async function tick() {
      if (aborted.current) return;
      if (typeof document !== "undefined" && document.hidden) return; // タブ非表示時はスキップ
      if (inFlight.current) return; // 重複リクエスト防止a
      inFlight.current = true;

      try {
        const controller = new AbortController();
        const signal = controller.signal;
        // fetch が長時間かかる場合に備え、一定時間で abort する（例: 10s）
        const timeout = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(endpoint, {
          cache: "no-store",
          next: { revalidate: 0 },
          signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          failures.current++;
          return;
        }

        const json = (await res.json()) as { last_updated: string | null };
        const cur = json.last_updated ?? null;

        if (cur && last.current && cur !== last.current) {
          // 変化を検知 → 参照中のキーを再検証
          for (const k of keys) mutate(k);
        }
        if (cur) last.current = cur;

        // 成功したら失敗カウントをリセット
        failures.current = 0;
      } catch (err) {
        // ネットワークエラーや abort などは失敗として扱う（バックオフに寄与）
        failures.current++;
      } finally {
        inFlight.current = false;
      }
    }

    function scheduleInterval() {
      // 連続失敗に応じて指数バックオフ（最大 60s）
      const backoff = Math.min(intervalMs * Math.pow(2, Math.max(0, failures.current - 1)), 60000);
      // clear してから再設定
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
      timer.current = window.setInterval(tick, backoff);
    }

    // 即時実行 + スケジュール開始
    tick();
    scheduleInterval();

    // visibilitychange でタブの表示状態を監視（非表示なら停止、再表示で再開）
    function handleVisibility() {
      if (document.hidden) {
        if (timer.current) {
          clearInterval(timer.current);
          timer.current = null;
        }
      } else {
        scheduleInterval();
        // 再表示時は即時チェック
        tick();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      aborted.current = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [keys, intervalMs, endpoint]);
}
