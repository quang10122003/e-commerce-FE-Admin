"use client";

import { useCallback, useRef, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { useMarkChatRoomAsReadMutation } from "@/client/api/backend-api";
import { useAdminChatRoomSocket } from "@/client/chat/useAdminChatRoomSocket";
import { ChatMessage, ChatRoom } from "@/types/chat";

type AdminChatRealtimePanelProps = {
  initialMessages: ChatMessage[];
  room: ChatRoom;
};

// Lọc ra id của các tin nhắn customer còn unread để gọi API mark-read đúng phạm vi.
function getUnreadCustomerMessageIds(messages: ChatMessage[], customerId: number) {
  return messages
    .filter(
      (message) =>
        message.messageType === "TEXT" &&
        message.senderId === customerId &&
        !message.read,
    )
    .map((message) => message.id);
}

export function AdminChatRealtimePanel({
  initialMessages,
  room,
}: AdminChatRealtimePanelProps) {
  // Client boundary này chỉ giữ socket state, draft input và optimistic state trong lúc drawer mở.
  // Data chuẩn từ Server Component được reset bằng key ở ChatRoomDetailDrawer.
  const [activeRoom, setActiveRoom] = useState<ChatRoom>(room);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [content, setContent] = useState("");
  const [markChatRoomAsRead] = useMarkChatRoomAsReadMutation();
  const lastMarkReadKeyRef = useRef<string | null>(null);

  // Đánh dấu room là đã đọc và cập nhật UI lạc quan để admin thấy trạng thái read ngay.
  const markRoomAsRead = useCallback(
    (targetRoom: ChatRoom, unreadMessageIds: number[]) => {
      if (targetRoom.unreadCount <= 0 && unreadMessageIds.length === 0) return;

      const markReadKey = [
        targetRoom.id,
        targetRoom.unreadCount,
        unreadMessageIds.join(","),
      ].join(":");

      if (lastMarkReadKeyRef.current === markReadKey) return;
      lastMarkReadKeyRef.current = markReadKey;

      // Optimistic update để drawer đang mở hết trạng thái unread ngay, không cần router.refresh ở đây.
      setActiveRoom((currentRoom) =>
        currentRoom.id === targetRoom.id
          ? { ...currentRoom, unreadCount: 0 }
          : currentRoom,
      );
      setMessages((current) =>
        current.map((message) =>
          message.messageType === "TEXT" && message.senderId === targetRoom.userId
            ? { ...message, read: true }
            : message,
        ),
      );

      markChatRoomAsRead(targetRoom.id)
        .unwrap()
        .catch(() => {
          lastMarkReadKeyRef.current = null;
        });
    },
    [markChatRoomAsRead],
  );

  // Callback ref chạy khi khung message được mount, dùng để mark-read các tin nhắn ban đầu.
  const markInitialMessagesAsRead = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      markRoomAsRead(
        activeRoom,
        getUnreadCustomerMessageIds(messages, activeRoom.userId),
      );
    },
    [activeRoom, markRoomAsRead, messages],
  );

  // Khi admin gửi tin đầu tiên vào room chưa assigned, đồng bộ owner local để canh bubble đúng phía.
  const assignRoomFromAdminMessage = useCallback((message: ChatMessage) => {
    if (message.messageType !== "TEXT") return;

    setActiveRoom((currentRoom) => {
      const messageFromCustomer = message.senderId === currentRoom.userId;

      if (currentRoom.assignmentStatus === "ASSIGNED" || messageFromCustomer) {
        return currentRoom;
      }

      // Backend lưu admin_id ở message admin đầu tiên; mirror local để canh bubble ngay.
      if (message.senderId === null) return currentRoom;

      return {
        ...currentRoom,
        adminId: message.senderId,
        adminName: message.senderName,
        assignmentStatus: "ASSIGNED",
      };
    });
  }, []);

  // Xử lý message realtime từ socket: gán room nếu cần, merge duplicate frame và mark-read tin customer mới.
  const handleMessage = useCallback(
    (message: ChatMessage) => {
      assignRoomFromAdminMessage(message);

      // STOMP reconnect có thể replay frame; duplicate id thì merge read-state thay vì bỏ qua.
      setMessages((current) => {
        const existingMessageIndex = current.findIndex((item) => item.id === message.id);

        if (existingMessageIndex >= 0) {
          return current.map((item, index) =>
            index === existingMessageIndex
              ? { ...item, ...message, read: item.read || message.read }
              : item,
          );
        }

        return [...current, message];
      });

      if (
        message.messageType === "TEXT" &&
        message.senderId === activeRoom.userId &&
        !message.read
      ) {
        markRoomAsRead(activeRoom, [message.id]);
      }
    },
    [activeRoom, assignRoomFromAdminMessage, markRoomAsRead],
  );

  const { sendMessage, status } = useAdminChatRoomSocket({
    roomId: activeRoom.id,
    onMessage: handleMessage,
  });

  // Gửi nội dung đang nhập qua socket; chỉ clear input khi socket xác nhận đã gửi được.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) return;

    const sent = sendMessage(trimmed);
    if (sent) setContent("");
  }

  return (
    <>
      <div
        className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3"
        ref={markInitialMessagesAsRead}
      >
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

            // Room đã assigned thì chỉ admin sở hữu room nằm bên phải; trước đó mọi non-customer message là admin reply.
            const isAdminMessage =
              activeRoom.assignmentStatus === "ASSIGNED" && activeRoom.adminId !== null
                ? message.senderId === activeRoom.adminId
                : message.senderId !== activeRoom.userId;
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
                {isAdminMessage && message.messageType === "TEXT" ? (
                  <p className="mt-1 text-right text-[11px] text-blue-100">
                    {message.read ? "Da doc" : "Chua doc"}
                  </p>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      <form className="mt-4 flex items-center gap-3" onSubmit={handleSubmit}>
        <input
          className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-400"
          disabled={status !== "connected"}
          onChange={(event) => setContent(event.target.value)}
          placeholder={status === "connected" ? "Nhap tin nhan..." : "Dang ket noi..."}
          type="text"
          value={content}
        />

        <button
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={status !== "connected" || !content.trim()}
          type="submit"
        >
          <MessageCircleMore className="size-4" />
          Gui
        </button>
      </form>
    </>
  );
}
