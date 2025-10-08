"use client";

import React from "react";
import clsx from "clsx";

type Props = {
  /** 値（半角数字のみ） */
  value: string;
  /** 値が変わったら半角数字に正規化して返す */
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

/** 全角数字 → 半角数字へ変換し、数字以外を除去 */
function normalizeDigits(input: string): string {
  // 全角0-9を半角へ
  const half = input.replace(/[０-９]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0)
  );
  // 数字以外を除去
  return half.replace(/[^0-9]/g, "");
}

export default function IdTextbox({
  value,
  onChange,
  id,
  name,
  placeholder,
  maxLength,
  required,
  disabled,
  className,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = normalizeDigits(e.target.value);
    onChange(next);
  };

  // 修正: nativeEvent を InputEvent として扱い data を取り出す
  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const native = e.nativeEvent as InputEvent | undefined;
    const data =
      native && typeof (native as InputEvent).data === "string"
        ? (native as InputEvent).data
        : undefined;

    if (data && normalizeDigits(data) === "") {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (normalizeDigits(text) === "") {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"         // モバイルで数字キーボードを出す
      pattern="[0-9]*"            // ブラウザ側のバリデーションヒント
      value={value}
      onChange={handleChange}
      onBeforeInput={handleBeforeInput}
      onPaste={handlePaste}
      id={id}
      name={name}
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
      disabled={disabled}
      className={clsx(
        "w-full rounded-md border-2 bg-white px-3 py-2",
        "border-blue-900 text-slate-900 placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-blue-300",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      aria-label={name || id || "id text box"}
    />
  );
}
