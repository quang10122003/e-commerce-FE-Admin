"use client";

import { FormEvent, useEffect, useRef } from "react";
import { MessageCircleMore } from "lucide-react";
import type { ChatMessage, ChatRoom } from "@/types/chat";

type ChatRoomMessagesPanelProps = {
  draft: string;
  messages: ChatMessage[];
  onDraftChange: (value: string) => void;
  onSendMessage: () => void;
  room: ChatRoom;
  socketConnected: boolean;
};

export function ChatRoomMessagesPanel({
  draft,
  messages,
  onDraftChange,
  onSendMessage,
  room,
  socketConnected,
}: ChatRoomMessagesPanelProps) {
  // Mốc cuối cuộc trò chuyện, dùng để auto scroll khi mở room hoặc có message mới.
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }, [messages.length, room.id]);

  // Chặn submit mặc định của form và chuyển quyền gửi message cho container cha.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSendMessage();
  }

  return (
    <>
      <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <MessageCircleMore aria-hidden="true" className="size-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Chua co tin nhan nao
            </p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Room nay hien chua co lich su trao doi.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            if (message.messageType === "SYSTEM") {
              return (
                <div
                  className="mx-auto max-w-[90%] rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-center text-xs font-medium text-blue-700"
                  key={message.id}
                >
                  {message.content}
                </div>
              );
            }

            // Khi room đã assigned thì admin owner nằm bên phải; trước đó mọi message không phải customer được xem là admin.
            const isAdminMessage =
              room.assignmentStatus === "ASSIGNED" && room.adminId !== null
                ? message.senderId === room.adminId
                : message.senderId !== room.userId;

            // Tin TEXT chưa đọc từ customer được highlight để admin dễ nhận ra.
            const isUnreadCustomerMessage =
              !isAdminMessage && message.messageType === "TEXT" && !message.read;

            return (
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  isAdminMessage
                    ? "ml-auto bg-blue-600 text-white"
                    : isUnreadCustomerMessage
                      ? "bg-amber-50 text-slate-900 ring-1 ring-amber-200"
                      : "bg-slate-100 text-slate-800"
                }`}
                key={message.id}
              >
                <p
                  className={
                    isAdminMessage ? "text-xs text-blue-100" : "text-xs text-slate-500"
                  }
                >
                  {message.senderName ?? "System"} - {message.createdAt}
                </p>
                <p className="mt-1">{message.content}</p>
                {message.messageType === "TEXT" ? (
                  <p
                    className={`mt-1 text-right text-[11px] ${
                      isAdminMessage ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {message.read ? "Da doc" : "Chua doc"}
                  </p>
                ) : null}
              </div>
            );
          })
        )}

        <div ref={conversationEndRef} />
      </div>

      <form className="mt-4 flex items-center gap-3" onSubmit={handleSubmit}>
        <input
          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-400"
          disabled={!socketConnected}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder={socketConnected ? "Nhap tin nhan..." : "Dang ket noi..."}
          type="text"
          value={draft}
        />

        <button
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!socketConnected || !draft.trim()}
          type="submit"
        >
          <MessageCircleMore className="size-4" />
          Gui
        </button>
      </form>
    </>
  );
}
