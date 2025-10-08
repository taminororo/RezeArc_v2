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
    "bg-emerald-100 text-emerald-900 border-emerald-300",
  limited:
    "bg-amber-200 text-slate-900 border-slate-600", // 黄色 + 濃いめの縁取り
  ended:
    "bg-slate-200 text-slate-700 border-slate-300",
};

export default function TicketTag({
  status,
  className = "",
  ariaLabelSuffix,
}: TicketTagProps) {
  const label = LABELS[status];
  const base =
    "inline-flex items-center rounded-full px-4 py-1.5 text-base font-semibold tracking-wide " +
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
