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
  free: "bg-not_crowded text-font border-main font-main_text",
  slightly_crowded: "bg-slightly_crowded text-font border-main font-main_text",
  crowded: "bg-crowded text-font border-main font-main_text",
  offtime: "bg-after_hours text-font border-main font-main_text",
};

export default function CongestionTag({
  status,
  className = "",
  ariaLabelSuffix,
}: CongestionTagProps) {
  const label = LABELS[status];
  const base =
    "flex items-center justify-center rounded-lg w-[110px] h-[25px] text-base text-medium tracking-wide " +
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
