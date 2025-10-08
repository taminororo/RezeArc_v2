"use client";

import MapWithPins, { type MapPin } from "@/components/MapWithPins";

export default function MapPage() {
  // 必ず pins を定義して渡す
  const pins: MapPin[] = [
    { id: "lecture", x: 74.5, y: 50.0, href: "/events/lecture", label: "講義棟" },
    { id: "bus",     x: 94.5, y: 86.0, href: "/access/bus",      label: "バス停" },
    { id: "gym",     x: 35.0, y: 61.5, href: "/facilities/gym",  label: "体育館" },
  ];

  return (
    <main className="min-h-dvh w-full flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-black mb-4">キャンパスマップ</h1>

      <MapWithPins
        imageSrc="/map_all.svg"
        aspectRatio={1028 / 768}
        pins={pins}
        className="max-w-6xl"
      />

      <p className="mt-4 text-sm text-neutral-600">
        ホイール／ピンチで拡大、ドラッグで移動、ダブルクリックで拡大できます。
      </p>
    </main>
  );
}
