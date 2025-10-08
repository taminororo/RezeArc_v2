"use client";

import React from "react";
import Image from "next/image";
import useSWR from "swr";
import CongestionPoint, { CongestionStatus } from "@/components/congestionPoint";
import { useLastUpdatedWatcher } from "@/hooks/useLastUpdatedWatcher";

// /api/events の型
type ApiEvent = {
  event_id: number;
  congestion_status: CongestionStatus;
  isDistributingTicket: boolean;
  image_path?: string | null;
  updated_at: string;
};

// Map に配置するポイント定義
export type MapPoint = {
  id: number;
  label: string;
  x: number;   // %
  y: number;   // %
  size?: number;
};

/** ここが「不変の割り当て表」: SVG 上の座標に応じて、恒久的に ID を割り当てる */
const POINTS: MapPoint[] = [
  { id: 1, x: 38.0, y: 16.0, label: "お化け屋敷" },
  { id: 2, x: 72.0, y: 83.0, label: "ゲスト企画" },
  { id: 3, x: 53.0, y: 16.0, label: "ワークショップ" },
  { id: 4, x: 66.0, y: 16.0, label: "8番出口" },
  { id: 5, x: 80.0, y: 16.0, label: "二人羽織" },
  { id: 6, x: 85.0, y: 36.0, label: "技大でバッティング" },
  { id: 7, x: 74.0, y: 55.0, label: "ビンゴ大会" },
  { id: 8, x: 59.0, y: 72.0, label: "ゲーム大会" },
  // 必要に応じて増やす
];

type Props = {
  mapImageSrc?: string;
  height?: number; // px
};

const fetcher = async (url: string): Promise<ApiEvent[]> => {
  const r = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
  if (!r.ok) throw new Error(`GET ${url} failed: ${r.status}`);
  return (await r.json()) as ApiEvent[];
};

export default function MapDetail({
  mapImageSrc = "/map_default.svg",
  height = 420,
}: Props) {
  const { data, isLoading, error } = useSWR<ApiEvent[]>("/api/events", fetcher, {
    revalidateOnFocus: false,
  });

  // last-updated を監視 → 差分があれば mutate("/api/events")
  useLastUpdatedWatcher({ keys: ["/api/events"], intervalMs: 2000 });

  // event_id → congestion_status の辞書
  const statusByEventId = React.useMemo(() => {
    const dict = new Map<number, CongestionStatus>();
    for (const ev of data ?? []) dict.set(ev.event_id, ev.congestion_status);
    return dict;
  }, [data]);

  return (
    <div className="w-full">
      <div
        className="relative w-full rounded-lg overflow-hidden shadow"
        style={{ height }}
      >
        {/* 地図背景 */}
        <Image
          src={"/map_1Fv2.svg"}
          alt="会場マップ"
          fill
          className="object-contain bg-white"
        />

        {/* ポイント配置 */}
        {POINTS.map((p) => {
          const status: CongestionStatus =
            statusByEventId.get(p.id) ?? "offtime";
          const size = p.size ?? 14;
          return (
            <div
              key={p.id}
              className="absolute flex items-center gap-1"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <CongestionPoint id={p.id} status={status} size={size} />
              <span className="text-[10px] font-semibold text-black drop-shadow-sm bg-white/70 rounded px-1 py-0.5">
                {p.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* 読み込み/エラー表示 */}
      <div className="mt-2 text-xs text-neutral-600">
        {isLoading && "混雑状況を取得中…"}
        {error && (
          <span className="text-rose-700">
            取得に失敗：{error instanceof Error ? error.message : String(error)}
          </span>
        )}
      </div>
    </div>
  );
}
