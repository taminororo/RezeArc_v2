// src/hooks/useLiveInvalidate.ts
"use client";

import { useLastUpdatedWatcher } from "@/hooks/useLastUpdatedWatcher";

/**
 * SSE を廃止して /api/events/lastupdated をポーリングするラッパーに置き換えました。
 * useLastUpdatedWatcher が変更検知時に mutate を呼ぶ実装になっているため、
 * 本フックは単にキーを解決してポーリングフックを呼び出すだけです。
 *
 * keys: string[] | () => string[]
 */
export function useLiveInvalidate(keys: string[] | (() => string[])) {
  const resolvedKeys = typeof keys === "function" ? keys() : keys;

  // useLastUpdatedWatcher はクライアントサイドフックで、内部で mutate を呼びます。
  useLastUpdatedWatcher({
    keys: resolvedKeys,
    intervalMs: 10000,
    endpoint: "/api/events/lastupdated",
  });
}
