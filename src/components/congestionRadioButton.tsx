"use client";

import React from "react";

type CongestionStatus = "free" | "slightly_crowded" | "crowded" | "offtime";

type Props = {
  value: CongestionStatus; // 現在選択されている値
  onChange: (value: CongestionStatus) => void; // 値変更時に呼ばれる
};

/**
 * CongestionRadioButton
 * - 4段階のラジオボタンから1つ選択できる
 */
export default function CongestionRadioButton({ value, onChange }: Props) {
  const options: { key: CongestionStatus; label: string }[] = [
    { key: "free", label: "空いています" },
    { key: "slightly_crowded", label: "やや混雑" },
    { key: "crowded", label: "混雑" },
    { key: "offtime", label: "企画時間外" },
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
            name="congestion"
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
