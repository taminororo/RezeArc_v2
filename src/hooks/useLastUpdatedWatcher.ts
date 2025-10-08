// src/hooks/useLastUpdatedWatcher.ts
"use client";

import { useEffect, useRef } from "react";
import { mutate } from "swr";

type Opts = {
  keys: string[];            // 例: ["/api/events"]
  intervalMs?: number;       // 例: 2000
  endpoint?: string;         // 例: "/api/events/last-updated"
};

export function useLastUpdatedWatcher(opts: Opts) {
  const { keys, intervalMs = 2000, endpoint = "/api/events/lastupdated" } = opts;
  const last = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let aborted = false;

    async function tick() {
      if (aborted) return;
      try {
        const res = await fetch(endpoint, { cache: "no-store", next: { revalidate: 0 } });
        if (!res.ok) return;
        const json = (await res.json()) as { last_updated: string | null };
        const cur = json.last_updated ?? null;
        if (cur && last.current && cur !== last.current) {
          // 変化を検知 → 参照中のキーを再検証
          for (const k of keys) mutate(k);
        }
        if (cur) last.current = cur;
      } catch {
        // ネットワークエラー等はスキップ（次回また試行）
      }
    }

    // 即時1回 + 定期
    tick();
    timer.current = setInterval(tick, intervalMs);

    return () => {
      aborted = true;
      if (timer.current) clearInterval(timer.current);
    };
  }, [keys, intervalMs, endpoint]);
}
