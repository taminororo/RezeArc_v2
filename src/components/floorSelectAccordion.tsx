"use client";

import { useState } from "react";
import MapDetail from "@/components/mapDetail";
import CongestionPoint from "./congestionPoint";

// props の型を追加
type AccordionProps = {
  title: string;
};

export default function Accordion({ title }: AccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-xl border border-orange-50 rounded">
      {/* タイトルバー */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center gap-2 px-4 py-3 text-lg font-medium
          ${open ? "bg-orange-50" : "bg-orange-50"} 
          hover:bg-orange-50 transition-colors`}
      >
        <span className="text-black">
          <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
            ▼
          </span>
          {/* ここを props から受け取る */}
          <span>{title}</span>
        </span>
      </button>

      {/* コンテンツ部分 */}
      {open && (
        <div className="p-4 bg-amber-200">
            <div className="mb-6">
              <MapDetail />
            </div>
            <p className="text-xl font-bold text-black mb-3">混雑状況</p>
          <div className="grid grid-cols-2 gap-4"> 
                  <div className="flex items-center space-x-2"> 
                      <CongestionPoint status="free" />
                      <p className="text-sm text-black font-bold">空いています</p>
                  </div>
                  
                  <div className="flex items-center space-x-2"> 
                      <CongestionPoint status="crowded" />
                      <p className="text-sm text-black font-bold">混雑</p>
                  </div>
                  
                  <div className="flex items-center space-x-2"> 
                      <CongestionPoint status="slightly_crowded" />
                      <p className="text-sm text-black font-bold">やや混雑</p>
                  </div>
                  
                  <div className="flex items-center space-x-2"> 
                      <CongestionPoint status="offtime" />  <p className="text-sm text-black font-bold">企画時間外</p>
                  </div>
            </div>
        </div>

      )}
    </div>
  );
}
