// src/components/congestionTag.tsx
import React from "react";

export type CongestionStatus =
  | "free"              // 空いてる
  | "slightly_crowded"  // やや混雑
  | "crowded"           // 混雑
  | "offtime";          // 企画時間外

type CongestionTagProps = {
  /** 混雑状況（4択のいずれか） */
  status: CongestionStatus;
  /** 余白・配置を上書きしたい場合に使用 */
  className?: string;
  /** スクリーンリーダー向けの説明を追加したい場合 */
  ariaLabelSuffix?: string;
};

const LABELS: Record<CongestionStatus, string> = {
  free: "空いてる",
  slightly_crowded: "やや混雑",
  crowded: "混雑",
  offtime: "企画時間外",
};

const STYLE: Record<CongestionStatus, string> = {
  free: "bg-emerald-100 text-emerald-900 border-emerald-300",
  slightly_crowded: "bg-amber-200 text-slate-900 border-amber-300",
  crowded: "bg-rose-200 text-rose-900 border-rose-300",
  offtime: "bg-slate-200 text-slate-700 border-slate-300",
};

export default function CongestionTag({
  status,
  className = "",
  ariaLabelSuffix,
}: CongestionTagProps) {
  const label = LABELS[status];
  const base =
    "inline-flex items-center rounded-full px-4 py-1.5 text-base font-semibold tracking-wide " +
    "border shadow-sm transition-colors";
  const classes = `${base} ${STYLE[status]} ${className}`;

  // 状態更新時の読み上げ反映を促す
  const ariaLabel = ariaLabelSuffix ? `${label}、${ariaLabelSuffix}` : label;

  return (
    <span className={classes} aria-live="polite" aria-label={ariaLabel}>
      {label}
    </span>
  );
}
