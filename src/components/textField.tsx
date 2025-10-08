"use client";

import React from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

/**
 * TextField
 * - 200文字制限付きのテキスト入力欄
 */
export default function TextField({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        maxLength={200}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full rounded-md border border-black px-3 py-2 text-sm text-black shadow-sm
          focus:outline-none
          focus:border-orange-300
          focus:ring-2 focus:ring-orange-300 focus:ring-opacity-50
        "
        placeholder="テキストを入力（最大200文字）"
      />
      <p className="mt-1 text-xs text-black text-right">
        {value.length}/200
      </p>
    </div>
  );
}
