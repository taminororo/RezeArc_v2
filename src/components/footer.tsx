"use client";

import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#394366] text-white py-6 px-6">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between max-w-6xl mx-auto">
        {/* 左側：ロゴ */}
        <div className="mb-4 md:mb-0 self-start ma-auto">
          <Image
            src="/44th_logo.svg"
            alt="大学ロゴ"
            width={50}
            height={50}
            className="md:ml-0"
          />
        </div>

        {/* 右側：SNSアイコンと住所 */}
        <div className="flex flex-col items-center text-center space-y-4 w-full">
          {/* SNSアイコン */}
          <div className="flex space-x-6 items-center justify-center">
            <a href="#" aria-label="X">
              <Image src="/Vector.svg" alt="X" width={26} height={26} />
            </a>
            <a href="#" aria-label="Instagram">
              <Image src="/Instagram.svg" alt="Instagram" width={26} height={26} />
            </a>
            <a href="#" aria-label="Facebook">
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
