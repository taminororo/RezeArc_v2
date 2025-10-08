// src/app/page.tsx（または該当のパス）
"use client";

import React from "react";
import Image from "next/image";
import useSWR from "swr";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EventCard from "@/components/eventCard";
import CongestionTag from "@/components/congestionTag";
import { useLastUpdatedWatcher } from "@/hooks/useLastUpdatedWatcher";

type ApiEvent = {
  event_id: number;
  event_name: string;
  isDistributingTicket: boolean;
  congestion_status: "free" | "slightly_crowded" | "crowded" | "offtime";
  event_text: string | null;
  image_path: string | null;
  updated_at: string;
};

// 常に最新取得する fetcher
const fetcher = async (url: string): Promise<ApiEvent[]> => {
  const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return (await res.json()) as ApiEvent[];
};

export default function Home() {
  const { data, isLoading, error } = useSWR<ApiEvent[]>("/api/events", fetcher, {
    revalidateOnFocus: false,
  });

  // DBの last-updated を監視して差分があれば mutate("/api/events")
  useLastUpdatedWatcher({ keys: ["/api/events"], intervalMs: 2000 });

  // isDistributingTicket === false のみ抽出
  const events = React.useMemo<ApiEvent[]>(
    () => (data ?? []).filter((e) => e.isDistributingTicket === false),
    [data]
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center">
      {/* 背景画像 */}
      <div className="absolute inset-0 w-full -z-10">
        <Image
          src="/backgroundNormal.svg"
          alt="背景"
          fill
          className="object-cover opacity-80"
        />
      </div>

      {/* ヘッダー */}
      <Header />

      {/* メイン */}
      <main className="flex-1 w-full flex flex-col items-center min-h-[800px]">
        <h1 className="text-center text-2xl font-bold mt-14 text-black font-title">
          企画一覧
        </h1>

        {isLoading && <p className="mt-4 text-gray-600">読み込み中...</p>}
        {error && (
          <p className="mt-4 text-red-600">
            読み込みに失敗しました：{error instanceof Error ? error.message : String(error)}
          </p>
        )}

        <div className="w-full max-w-sm flex flex-col gap-4 mt-6 px-2">
          {!isLoading &&
            events.map((e) => (
              <EventCard
                key={e.event_id}
                imageSrc={e.image_path ?? "/event_photo1.svg"}
                title={e.event_name}
                statusComponent={<CongestionTag status={e.congestion_status} />}
                onClick={() => {
                  console.log("clicked:", e.event_id);
                }}
              />
            ))}

          {!isLoading && !error && events.length === 0 && (
            <div className="text-sm text-slate-700 bg-white/70 rounded-lg p-4">
              表示できる企画がありません。
            </div>
          )}
        </div>
      </main>

      {/* フッター */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}
