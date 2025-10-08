// src/hooks/useLiveInvalidate.ts
"use client";
import { useEffect, useRef } from "react";
import { mutate } from "swr";

export function useLiveInvalidate(keys: string[] | (() => string[])) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const targetKeys = typeof keys === "function" ? keys() : keys;
    const es = new EventSource("/api/events/stream");

    const revalidateAll = () => {
      for (const k of targetKeys) mutate(k);
    };

    es.addEventListener("hello", () => {
      // 接続直後に全面再検証（初回同期を保証）
      revalidateAll();
    });

    es.addEventListener("update", (ev) => {
      try {
        const payload = JSON.parse((ev as MessageEvent).data) as
          | { type: "eventUpdated"; eventId: number }
          | { type: "bulkInvalidate" };

        if (payload.type === "bulkInvalidate") {
          revalidateAll();
        } else if (payload.type === "eventUpdated") {
          for (const k of targetKeys) {
            if (k === "/api/events" || k === `/api/events/${payload.eventId}`) {
              mutate(k);
            }
          }
        }
      } catch (e) {
        // 何もしない（破損データは無視）
      }
    });

    es.onerror = () => {
      // EventSourceは自動再接続するので何もしない
      // デバッグが必要なら console.log("SSE error") など
    };

    return () => es.close();
  }, [keys]);
}
