//src/components/congestionPoint.tsx
"use client";

import React from "react";

export type CongestionStatus = "free" | "slightly_crowded" | "crowded" | "offtime";

type Props = {
  status: CongestionStatus;
  /** 任意: 識別用ID（DOMのdata属性やテスト用） */
  id?: number | string;
  /** 任意: 大きさを調整したい場合 */
  size?: number; // px
};

export default function CongestionPoint({ status, id, size = 14 }: Props) {
  const colorMap: Record<CongestionStatus, string> = {
    free: "bg-green-500",
    slightly_crowded: "bg-yellow-400",
    crowded: "bg-red-500",
    offtime: "bg-gray-400",
  };

  return (
    <span
      data-point-id={id ?? undefined}
      className={`inline-block rounded-full ${colorMap[status]} shadow`}
      style={{ width: size, height: size }}
      aria-label={`${id ?? "point"}:${status}`}
      title={String(id ?? "")}
    />
  );
}
