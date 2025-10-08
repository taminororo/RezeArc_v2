"use client";

import RequiredTag from "./requiredTag";

type Props = {
  text: string;
};

/**
 * QuestionTitle
 * - 背景は紺色
 * - 表示テキストを props で受け取り
 * - 右側に RequiredTag を配置
 */
export default function QuestionTitle({ text }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-blue-900 rounded-md">
      <span className="text-white font-medium">{text}</span>
      <RequiredTag />
    </div>
  );
}
