"use client";

import React, { ReactNode } from "react";
import Image from "next/image";

// --- 各カードの型定義 ---
export type EventCardProps = {
  imageSrc: string;
  title: string;
  topTagComponent?: ReactNode;     // 上のタグ
  bottomTagComponent?: ReactNode;  // 下のタグ
  onClick?: () => void;
};

// --- イベントリスト全体の型定義 ---
type EventListProps = {
  events: EventCardProps[];
  className?: string;
};

export default function EventList({ events, className = "" }: EventListProps) {
  // イベントがない場合は何も表示しない
  if (!events || events.length === 0) return null;

  return (
    <div
      className={`
        w-full max-w-2xl 
        bg-[#fffdfa]
        rounded-2xl 
        p-4 
        ${className}
        relative
        border-[2px] border-[#434d6e]
      `}
      style={{
        boxShadow: "4px 4px 0 0 #434d6e", // 右下にだけ影
        position: "relative",
      }}
    >
      <div className="flex flex-col">
        {events.map((event, index) => (
          <React.Fragment key={index}>
            {index !== 0 && (
              <div className="w-full border-t-2 border-gray-400 my-2" />
            )}
            <button
              type="button"
              onClick={event.onClick}
              className={`
                w-full flex items-center justify-between px-0 py-2
                bg-transparent
                shadow-none
                rounded-none
                focus:outline-none
                focus:ring-0
                hover:bg-transparent
                transition-none
              `}
              style={{ minHeight: "64px" }}
            >
              {/* 左側：画像とイベント名 */}
              <div className="flex items-center gap-2">
                <div className="relative w-14 h-14 bg-gray-300 rounded-sm overflow-hidden border border-gray-400">
                  <Image
                    src={event.imageSrc}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xl font-medium text-[#111827]">
                  {event.title}
                </span>
              </div>

              {/* 右側：タグ2つ */}
              <div className="flex flex-col items-end gap-2">
                {event.topTagComponent && <div>{event.topTagComponent}</div>}
                {event.bottomTagComponent && <div>{event.bottomTagComponent}</div>}
              </div>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}