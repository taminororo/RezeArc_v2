"use client";

import MapWithPins, { type MapPin } from "@/components/MapWithPins";

export default function MapPage() {
    // 必ず pins を定義して渡す
    const pins: MapPin[] = [
        { id: "large_experiment", x: 38, y: 21, href: "/facilities/large-experiment", label: "大型実験棟" },
        { id: "nuclear_system", x: 45.5, y: 35, href: "/facilities/nuclear-system", label: "原子力安全・システム安全棟" },
        { id: "new_lecture", x: 82.5, y: 38, href: "/facilities/new-lecture", label: "新講義棟" },
        { id: "lecture", x: 76, y: 43, href: "/detailMap", label: "講義棟" },
        { id: "material", x: 67.3, y: 49, href: "/facilities/material", label: "物質材料棟" },
        { id: "mechanical_construction", x: 33.3, y: 49.5, href: "/facilities/mechanical-construction", label: "機械建設棟" },
        { id: "plaza", x: 46, y: 58, href: "/facilities/plaza", label: "広場" },
        { id: "gym_and_dojo", x: 38, y: 62, href: "/facilities/gym-and-dojo", label: "体育館・武道館" },
        { id: "festival", x: 23, y: 63, href: "/facilities/festival", label: "縁日" },
        { id: "multimedia", x: 61, y: 65.5, href: "/facilities/multimedia", label: "マルチメディア" },
        { id: "disaster_center", x: 5, y: 73, href: "/facilities/disaster-center", label: "地域防災実験研究センター" },
    ];

    return (
        <main className="min-h-dvh w-full flex flex-col items-center p-4">

            <MapWithPins
                imageSrc="/map_all.svg"
                aspectRatio={350 / 251}
                pins={pins}
                className="max-w-6xl"
            />

            <p className="mt-4 text-sm text-neutral-600">
                ホイール／ピンチで拡大、ドラッグで移動、ダブルクリックで拡大できます。
            </p>
        </main>
    );
}
