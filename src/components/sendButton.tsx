// src/components/sendButton.tsx
"use client";
import { useState } from "react";

type Props = {
  eventId: string; // 文字列で来るので数値化してパスに使う
  congestionStatus: "free" | "slightly_crowded" | "crowded" | "offtime";
  ticketStatus: "distributing" | "limited" | "ended";
  eventText: string;
};

export default function SendButton({
  eventId,
  congestionStatus,
  ticketStatus,
  eventText,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setMsg(null);
    try {
      // ① 企画IDの正規化
      const idNum = Number(String(eventId).trim());
      if (!Number.isInteger(idNum) || idNum < 0) {
        throw new Error("企画IDが不正です（半角の非負整数）");
      }

      // ② 値の正規化（trim + 小文字化。必要ならここにマッピングを追加）
      const normCong = String(congestionStatus).trim().toLowerCase();
      const normTicket = ticketStatus ? String(ticketStatus).trim().toLowerCase() : undefined;

      // ③ ボディは API 仕様に合わせて「スネークケース」で作る
      //    event_text は空なら送らない（nullは送らない！）
      const body: Record<string, unknown> = {
        congestion_status: normCong, // ← 必須
        // ticket_status は不要なら省略してOK（isDistributingTicket=falseだとサーバでnullに矯正）
        ...(normTicket ? { ticket_status: normTicket } : {}),
        ...(eventText.trim() ? { event_text: eventText } : {}), // 空文字は送らない
      };

      const res = await fetch(`/api/events/${idNum}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // サーバの詳細メッセージを画面に出してデバッグしやすく
        throw new Error(
          `APIエラー ${res.status}: ${data?.error ?? "Unknown"} ${data?.detail ?? ""}`
        );
      }

      setMsg("送信に成功しました ✅");
      // 必要なら data を使ってUI反映
      // console.log("updated:", data);
    } catch (err: unknown) {
      setMsg(
        `送信に失敗しました ❌ ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
    >
      {loading ? "送信中..." : "送信"}
      {msg && <span className="ml-2 text-sm">{msg}</span>}
    </button>
  );
}
