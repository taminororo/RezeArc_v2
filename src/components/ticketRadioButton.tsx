"use client";

import React from "react";
import type { TicketStatus } from "./ticketTag";


type Props = {
  value: TicketStatus; // 現在選択されている値
  onChange: (value: TicketStatus) => void; // 値変更時に呼ばれる
};

/**
 * CongestionRadioButton
 * - 4段階のラジオボタンから1つ選択できる
 */
export default function TicketRadioButton({ value, onChange }: Props) {
  const options: { key: TicketStatus; label: string }[] = [
    { key: "distributing", label: "配布中" },
    { key: "limited", label: "残りわずか" },
    { key: "ended", label: "配布終了" },
  ];

  return (
    <div className="space-y-4 bg-amber-200 p-4 rounded text-black">
      {options.map((opt) => (
        <label
          key={opt.key}
          className="flex items-center gap-3 cursor-pointer"
        >
          <input
            type="radio"
            name="ticket"
            value={opt.key}
            checked={value === opt.key}
            onChange={() => onChange(opt.key)}
            className="h-5 w-5 cursor-pointer accent-black"
          />
          <span className="text-lg">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
