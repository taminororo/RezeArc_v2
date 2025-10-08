"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

export type MapPin = {
  id: string;
  x: number; // 0–100 (%)
  y: number; // 0–100 (%)
  href: string;
  label: string;
};

type Props = {
  imageSrc: string;
  aspectRatio?: number;
  pins?: MapPin[]; // ← optional に修正
  className?: string;
};

export default function MapWithPins({
  imageSrc,
  pins = [], // ← デフォルト空配列
  aspectRatio = 1028 / 768,
  className = "max-w-5xl",
}: Props) {
  return (
    <div className={`w-full ${className}`}>
      <TransformWrapper
        minScale={1}
        maxScale={4}
        wheel={{ step: 0.15 }}
        pinch={{ step: 5 }}
        doubleClick={{ mode: "zoomIn", step: 0.8 }}
        limitToBounds
        centerOnInit
      >
        <Controls />

        <div className="relative w-full rounded-2xl overflow-hidden shadow">
          <div className="relative w-full bg-[#f6f4ef]" style={{ aspectRatio }}>
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ width: "100%", height: "100%" }}
            >
              <div className="relative w-full bg-[#f6f4ef]" style={{ aspectRatio }}>
                <Image
                  src={imageSrc}
                  alt="キャンパスマップ"
                  fill
                  draggable={false}
                  className="object-contain select-none pointer-events-none"
                  priority
                />
              </div>

              <div className="absolute inset-0 z-50">
                {pins.map((p) => (
                  <PinButton key={p.id} pin={p} />
                ))}
              </div>
            </TransformComponent>
          </div>
        </div>
      </TransformWrapper>
    </div>
  );
}

function Controls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="mb-3 flex gap-2">
      <button
        onClick={() => zoomIn()}
        className="rounded-md bg-slate-800 text-white px-3 py-1 text-sm"
      >
        ＋
      </button>
      <button
        onClick={() => zoomOut()}
        className="rounded-md bg-slate-800 text-white px-3 py-1 text-sm"
      >
        －
      </button>
      <button
        onClick={() => resetTransform()}
        className="rounded-md bg-slate-600 text-white px-3 py-1 text-sm"
      >
        リセット
      </button>
    </div>
  );
}

function PinButton({ pin }: { pin: MapPin }) {
  return (
    <Link
      href={pin.href}
      aria-label={pin.label}
      className="group absolute"
      style={{
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <svg viewBox="0 0 24 24" className="w-9 h-9 drop-shadow-md" aria-hidden>
        <path
          d="M12 2c-4 0-7 3-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z"
          className="fill-[#d33726]"
        />
        <circle cx="12" cy="9" r="3.5" className="fill-white" />
      </svg>
      <span className="absolute left-1/2 top-[-6px] -translate-x-1/2 -translate-y-full rounded-md bg-black/70 text-white text-xs px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {pin.label}
      </span>
    </Link>
  );
}
