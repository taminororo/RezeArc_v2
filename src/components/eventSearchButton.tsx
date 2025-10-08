"use client";

import React from "react";

/** 企画アイテムの最小型（id と title があればOK） */
export type Event = {
  id: number | string;
  title: string;
  [k: string]: unknown;
};

type Props<T extends Event = Event> = {
  /** 検索キーワード（企画名） */
  query: string;
  /** ページロード時に取得済みの全件 */
  allEvents: T[];
  /** 成功: フィルタ結果を返す（空文字列なら全件を返す） */
  onSuccess?: (results: T[]) => void;
  /** エラー時 */
  onError?: (err: unknown) => void;
  /** UX用の開始/終了フック（任意） */
  onStart?: () => void;
  onFinally?: () => void;
};

/**
 * EventSearchButton（自動確定版）
 * - ボタンは描画せず、query/allEvents が変わるたびに同期フィルタして onSuccess を呼ぶ
 */
export default function EventSearchButton<T extends Event = Event>({
  query,
  allEvents,
  onSuccess,
  onError,
  onStart,
  onFinally,
}: Props<T>) {
  React.useEffect(() => {
    try {
      onStart?.();

      const q = (query ?? "").trim().toLowerCase();
      const filtered = q
        ? allEvents.filter((ev) =>
            String(ev.title ?? "").toLowerCase().includes(q)
          )
        : allEvents;

      onSuccess?.(filtered);
    } catch (err) {
      console.error(err);
      onError?.(err);
    } finally {
      onFinally?.();
    }
    // 注意: onSuccess など関数は毎レンダーで参照が変わる可能性があるため依存に入れない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, allEvents]);

  // UIは描画しない（副作用のみ）
  return null;
}