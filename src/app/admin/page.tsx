// src/app/admin/page.tsx
"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import QuestionTitle from "@/components/questionTitle";
import IdTextbox from "@/components/idTextbox";
import CongestionRadioButton from "@/components/congestionRadioButton";
import TicketRadioButton from "@/components/ticketRadioButton";
import TextField from "@/components/textField";
import SendButton from "@/components/sendButton";

type CongestionStatus = "free" | "slightly_crowded" | "crowded" | "offtime";
type TicketStatus = "distributing" | "limited" | "ended";

export default function AdminSettingsPage() {
  const [eventId, setEventId] = useState("");
  const [congestionStatus, setCongestion] = useState<CongestionStatus>("free");
  const [ticketStatus, setTicket] = useState<TicketStatus>("distributing");
  const [eventText, setEventText] = useState("");

  return (
    <div className="min-h-dvh w-full bg-[#e2e2e2] text-black">
      <Header />
      <main className="mx-auto w-full max-w-[390px] bg-white">
        <div className="px-6 pt-10 pb-20">
          <h1 className="text-center text-2xl font-bold mb-8">管理者設定</h1>

          {/* 企画情報 */}
          <section className="space-y-3 mb-8">
            <QuestionTitle text="企画情報" />
            <div className="mt-3">
              <label className="block text-sm mb-2">企画ID</label>
              <IdTextbox
                value={eventId}
                onChange={setEventId}
                placeholder="半角数字で入力"
                maxLength={6}
                required
                className="w-full"
              />
            </div>
          </section>

          {/* 混雑状況 */}
          <section className="space-y-3 mb-8">
            <QuestionTitle text="混雑状況" />
            <div className="mt-3">
              <CongestionRadioButton
                value={congestionStatus}
                onChange={setCongestion}
              />
            </div>
          </section>

          {/* 整理券配布状況 */}
          <section className="space-y-3 mb-8">
            <QuestionTitle text="整理券配布状況" />
            <div className="mt-3">
              <TicketRadioButton value={ticketStatus} onChange={setTicket} />
            </div>
          </section>

          {/* 企画説明（任意） */}
          <section className="space-y-3 mb-10">
            <QuestionTitle text="企画説明" />
            <div className="mt-3">
              <div className="rounded-md border border-black p-3">
                <TextField value={eventText} onChange={setEventText} />
                <div className="h-24" />
              </div>
            </div>
          </section>

          {/* 送信ボタン（props を渡す） */}
          <div className="flex justify-center">
            <SendButton
              eventId={eventId}
              congestionStatus={congestionStatus}
              ticketStatus={ticketStatus}
              eventText={eventText}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
