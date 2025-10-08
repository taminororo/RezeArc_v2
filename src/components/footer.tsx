"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bg-[#394366] text-white py-6 px-6">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between max-w-6xl mx-auto">
        {/* 左側：ロゴ */}
        <div className="mb-4 md:mb-0">
        <div
          role="button"
          aria-label="logo"
          onClick={() => router.push("/Top")} // ✅ ページ遷移処理
          className="cursor-pointer" // ✅ カーソルをポインターに変更
        >
          <Image
            src="/44th_logo.svg"
            alt="大学ロゴ"
            width={50}
            height={50}
            className="md:ml-0"
          />
        </div>

        </div>

        {/* 右側：SNSアイコンと住所 */}
        <div className="flex flex-col items-center text-center space-y-4 w-full">
          {/* SNSアイコン */}
          <div className="flex space-x-6 items-center justify-center">
            <a href="https://x.com/nut_fes" aria-label="X">
              <Image src="/Vector.svg" alt="X" width={26} height={26} />
            </a>
            <a href="https://www.instagram.com/nutfes?igsh=cWVpZ2R6bGg0b3gw" aria-label="Instagram">
              <Image src="/Instagram.svg" alt="Instagram" width={26} height={26} />
            </a>
            <a href="https://www.facebook.com/p/%E9%95%B7%E5%B2%A1%E6%8A%80%E8%A1%93%E7%A7%91%E5%AD%A6%E5%A4%A7%E5%AD%A6%E6%8A%80%E5%A4%A7%E7%A5%AD%E5%AE%9F%E8%A1%8C%E5%A7%94%E5%93%A1%E4%BC%9A-61570063509591/" aria-label="Facebook">
              <Image src="/facebookIcon.svg" alt="Facebook" width={26} height={26} />
            </a>
          </div>

          {/* 住所 */}
          <div className="text-sm leading-relaxed">
            <p>〒940-2188</p>
            <p>新潟県長岡市上富岡町1603-1　長岡技術科学大学</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
