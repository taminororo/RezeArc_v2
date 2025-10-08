// src/app/Top/page.tsx
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import useSWR from "swr";

import Header from "@/components/header";
import Footer from "@/components/footer";
import CongestionTag from "@/components/congestionTag";
import TicketTag from "@/components/ticketTag";
import TicketEventList from "@/components/ticketEventTopCard";
import DetailCard from "@/components/detailCard";
import AllMap from "@/components/mapAll";
import { useLastUpdatedWatcher } from "@/hooks/useLastUpdatedWatcher";

// /api/events のレスポンス型
type ApiEvent = {
  event_id: number;
  event_name: string;
  isDistributingTicket: boolean;
  ticket_status: "distributing" | "limited" | "ended" | null;
  congestion_status: "free" | "slightly_crowded" | "crowded" | "offtime";
  event_text: string | null;
  image_path: string | null;
  created_at?: string;
  updated_at?: string;
};

// fetcher（常に最新取得）
const fetcher = async (url: string): Promise<ApiEvent[]> => {
  const r = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
  if (!r.ok) throw new Error(`GET ${url} failed: ${r.status}`);
  return (await r.json()) as ApiEvent[];
};

export default function TicketDistributionPage() {
  // SWRで一覧を取得（フォーカス時の再検証は不要。ロングポーリングで更新）
  const { data, isLoading, error } = useSWR<ApiEvent[]>("/api/events", fetcher, {
    revalidateOnFocus: false,
  });

  // DBの last-updated を監視して差分があれば mutate("/api/events")
  useLastUpdatedWatcher({ keys: ["/api/events"], intervalMs: 2000 });

  // 整理券を配布中かつ「残りわずか(limited)」のみ抽出
  const limitedEvents = useMemo<ApiEvent[]>(() => {
    const list = data ?? [];
    return list.filter(
      (e) => e.isDistributingTicket === true && e.ticket_status === "limited"
    );
  }, [data]);

  return (
    <div className="relative flex-1 w-full flex flex-col items-center">
      {/* 背景画像 */}
      <div className="absolute inset-0 w-full -z-10">
        <Image
          src="/backgroundTop.svg"
          alt="背景"
          fill
          className="object-cover opacity-80"
        />
      </div>

      {/* ヘッダー */}
      <div className="w-full mt-auto">
        <Header />
      </div>

      {/* メインコンテンツ */}
      <main className="flex-1 w-full flex flex-col items-center min-h-[1428px]">
        {/* タイトル */}
        <div className="flex flex-col items-center mt-24 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-black drop-shadow-sm mb-2">
            45th技大祭
          </h1>
          <p className="text-lg md:text-xl text-black tracking-wide">
            9/12sat　9/14sun
          </p>
        </div>

        <h2 className="text-center text-2xl font-bold mt-4 text-black flex items-center justify-center gap-2">
          整理券 残りわずか
          <Image
            src="/attention_logo.svg"
            alt="注意アイコン"
            width={36}
            height={36}
            className="inline-block align-middle"
          />
        </h2>

        <div className="px-8 mt-3 mb-8 w-full max-w-2xl">
          {isLoading ? (
            <p className="text-gray-600">読み込み中...</p>
          ) : error ? (
            <p className="text-red-600">
              読み込みに失敗しました：{error instanceof Error ? error.message : String(error)}
            </p>
          ) : (
            <TicketEventList
              events={limitedEvents.map((e) => ({
                imageSrc: e.image_path ?? "/event_photo1.svg",
                title: e.event_name,
                topTagComponent: <TicketTag status="limited" />,
                bottomTagComponent: <CongestionTag status={e.congestion_status} />,
                onClick: () => {
                  console.log("clicked:", e.event_id);
                },
              }))}
            />
          )}
        </div>

        <h2 className="text-center text-2xl font-bold mt-4 text-black flex items-center justify-center gap-2">
          企画情報をCheck
        </h2>

        <div className="px-8 mt-3 mb-3 w-full max-w-2xl">
          <DetailCard
            title={
              <h3 className="px-2 text-lg sm:text-lg font-semibold mt-6 mb-4">
                <span className="text-[#d72660]">企画</span>
                <span className="text-black">を見る</span>
              </h3>
            }
            description="全ての企画の詳細情報と混雑状況をチェック"
            onClick={() => {}}
          />
        </div>

        <div className="px-8 mt-3 mb-8 w-full max-w-2xl">
          <DetailCard
            title={
              <h3 className="px-2 text-lg sm:text-lg font-semibold mt-6 mb-4">
                <span className="text-[#d72660]">整理券配布企画</span>
                <span className="text-black">を見る</span>
              </h3>
            }
            description="整理券配布企画の残り状況をチェック"
            onClick={() => {}}
          />
        </div>

        <h2 className="text-center text-2xl font-bold mt-4 text-black flex items-center justify-center gap-2">
          全体MAP
        </h2>
        <AllMap />
      </main>

      {/* フッター */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}
