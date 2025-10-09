// src/components/header.tsx
"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="w-full bg-[#394366] h-14 flex items-center py-2 px-4">
      <div className="mb-4 md:mb-0 self-start">
        <div
          role="button"
          aria-label="logo"
          onClick={() => router.push("/")} // ✅ ページ遷移処理
          className="cursor-pointer" // ✅ カーソルをポインターに変更
        >
          <Image
            src="/44th_logo.svg"
            alt="大学ロゴ"
            width={40}
            height={40}
            className="md:ml-0"
          />
        </div>
      </div>
    </header>
  );
}