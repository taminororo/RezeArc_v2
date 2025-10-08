// src/app/detailMap/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import Accordion from "@/components/floorSelectAccordion";
import Image from "next/image";

/**
 * ポイント:
 * - ページ全体に Header / Footer を配置
 * - タイトル＋フロア選択アコーディオン（floorSelectAccordion）を上部に配置
 * - マップ本体は既存の MapDetail をそのまま利用（画像上に CongestionPoint を絶対配置）
 * - 画像は拡大不可（MapDetail 側で静的表示）
 *
 * ※ 企画MAP.svg を使う場合は、下の「画像差し替え手順」を参照
 */
export default function Page() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center">
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
      <main className="flex-1 w-full flex flex-col items-center gap-6 py-6 px-4">
        {/* タイトル */}
        <h1 className="text-2xl font-bold text-black">企画マップ</h1>

        {/* フロア選択（必要に応じて項目を追加してください） */}
        <div className="w-full max-w-3xl">
            <Accordion title="講義棟 1F" />
            <Accordion title="講義棟 2F" />
            <Accordion title="講義棟 3F" />

        </div>

      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}
