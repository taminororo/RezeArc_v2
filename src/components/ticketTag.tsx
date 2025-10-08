// src/components/ticketTag.tsx
import React from "react";

export type TicketStatus = "distributing" | "limited" | "ended";

type TicketTagProps = {
  /** 配布状況 */
  status: TicketStatus;
  /** 余白・配置を上書きしたい場合に使用 */
  className?: string;
  /** スクリーンリーダー向けの説明を追加したい場合 */
  ariaLabelSuffix?: string;
};

const LABELS: Record<TicketStatus, string> = {
  distributing: "配布中",
  limited: "残りわずか",
  ended: "配布終了",
};

const STYLE: Record<TicketStatus, string> = {
  // 画像の雰囲気に寄せて、丸 pill + ボーダー + わずかは黄色系
  distributing:
    "bg-not_crowded text-font border-main font-main_text", // 緑 + 濃いめの縁取り
  limited:
    "bg-slightly_crowded text-font border-main font-main_text", // 黄色 + 濃いめの縁取り
  ended:
    "bg-crowded text-font border-main font-main_text", // 赤 + 濃いめの縁取り
};

export default function TicketTag({
  status,
  className = "",
  ariaLabelSuffix,
}: TicketTagProps) {
  const label = LABELS[status];
  const base =
    "flex items-center justify-center rounded-lg w-[110px] h-[25px] text-base text-medium tracking-wide " +
    "border shadow-sm transition-colors";
  const classes = `${base} ${STYLE[status]} ${className}`;

  // 状態変化が配信中に起きても読み上げが追従しやすいよう polite を付与
  const ariaLabel = ariaLabelSuffix
    ? `${label}、${ariaLabelSuffix}`
    : label;

  return (
    <span className={classes} aria-live="polite" aria-label={ariaLabel}>
      {label}
    </span>
  );
}
