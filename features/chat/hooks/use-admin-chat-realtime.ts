"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useLazyGetChatRoomMessagesQuery,
  useMarkChatRoomAsReadMutation,
} from "@/client/api/backend-api";
import { useAdminChatSocket } from "@/client/chat/useAdminChatSocket";
import {
  applyReadReceiptToMessages,
  mergeChatRoomUpdate,
  upsertChatMessage,
} from "@/lib/admin/chat-state";
import type { ChatMessage, ChatReadReceipt, ChatRoom } from "@/types/chat";

type UseAdminChatRealtimeOptions = {
  initialMessages: ChatMessage[];
  initialRooms: ChatRoom[];
  selectedRoomId: number | null;
};

// Quản lý state realtime của chat admin: rooms, messages, draft và socket events.
export function useAdminChatRealtime({
  initialMessages,
  initialRooms,
  selectedRoomId,
}: UseAdminChatRealtimeOptions) {
  // Nội dung admin đang nhập trong drawer.
  const [draft, setDraft] = useState("");

  // Cache message theo room để giữ lịch sử đã tải khi đổi qua lại room.
  const [messagesByRoomId, setMessagesByRoomId] = useState<
    Record<number, ChatMessage[]>
  >(selectedRoomId ? { [selectedRoomId]: initialMessages } : {});

  // Danh sách room hiển thị trên inbox và được cập nhật bởi realtime preview.
  const [rooms, setRooms] = useState(initialRooms);
  const [getChatRoomMessages] = useLazyGetChatRoomMessagesQuery();
  const [markChatRoomAsRead] = useMarkChatRoomAsReadMutation();

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId],
  );
  const messages = selectedRoomId ? messagesByRoomId[selectedRoomId] ?? [] : [];

  useEffect(() => {
    if (!selectedRoomId) return;

    // Mở room hoặc preview báo message mới thì tải lại lịch sử để tránh cache cũ.
    getChatRoomMessages(selectedRoomId)
      .unwrap()
      .then((response) => {
        setMessagesByRoomId((current) => ({
          ...current,
          [selectedRoomId]: response.data ?? [],
        }));
      })
      .catch(() => undefined);
  }, [getChatRoomMessages, selectedRoom?.lastMessageAt, selectedRoomId]);

  // Nhận room summary từ inbox topic và merge vào list hiện tại.
  const handleRoomUpdate = useCallback((room: ChatRoom) => {
    setRooms((current) => mergeChatRoomUpdate(current, room));
  }, []);

  // Nhận message realtime cho drawer và đánh dấu đã đọc nếu message đến từ customer đang mở.
  const handleMessage = useCallback(
    (message: ChatMessage) => {
      setMessagesByRoomId((current) => ({
        ...current,
        [message.roomId]: upsertChatMessage(current[message.roomId] ?? [], message),
      }));

      const messageComesFromCustomer =
        selectedRoom?.id === message.roomId && message.senderId === selectedRoom.userId;

      if (messageComesFromCustomer && !message.read) {
        markChatRoomAsRead(message.roomId)
          .unwrap()
          .then(() => {
            setMessagesByRoomId((current) => ({
              ...current,
              [message.roomId]: (current[message.roomId] ?? []).map((item) =>
                item.messageType === "TEXT" && item.senderId === selectedRoom.userId
                  ? { ...item, read: true }
                  : item,
              ),
            }));
          })
          .catch(() => undefined);
      }
    },
    [markChatRoomAsRead, selectedRoom],
  );

  // Cập nhật trạng thái read cho message khi backend gửi read receipt.
  const handleReadReceipt = useCallback((receipt: ChatReadReceipt) => {
    setMessagesByRoomId((current) => ({
      ...current,
      [receipt.roomId]: applyReadReceiptToMessages(
        current[receipt.roomId] ?? [],
        receipt,
      ),
    }));
  }, []);

  const { sendMessage, status } = useAdminChatSocket({
    onMessage: handleMessage,
    onReadReceipt: handleReadReceipt,
    onRoomUpdate: handleRoomUpdate,
    selectedRoomId,
  });

  // Gửi message qua STOMP và chỉ clear input khi publish thành công.
  const handleSendMessage = useCallback(() => {
    if (!selectedRoom || !draft.trim()) return;

    const sent = sendMessage(selectedRoom.id, draft.trim());
    if (sent) setDraft("");
  }, [draft, selectedRoom, sendMessage]);

  useEffect(() => {
    if (!selectedRoom || selectedRoom.unreadCount <= 0) return;

    // Drawer đang mở nghĩa là admin đã xem room, nên báo backend đánh dấu đã đọc.
    markChatRoomAsRead(selectedRoom.id)
      .unwrap()
      .then(() => {
        setRooms((current) =>
          current.map((room) =>
            room.id === selectedRoom.id ? { ...room, unreadCount: 0 } : room,
          ),
        );
        setMessagesByRoomId((current) => ({
          ...current,
          [selectedRoom.id]: (current[selectedRoom.id] ?? []).map((message) =>
            message.messageType === "TEXT" && message.senderId === selectedRoom.userId
              ? { ...message, read: true }
              : message,
          ),
        }));
      })
      .catch(() => undefined);
  }, [markChatRoomAsRead, selectedRoom]);

  return {
    draft,
    handleSendMessage,
    messages,
    rooms,
    selectedRoom,
    setDraft,
    socketConnected: status === "connected",
  };
}
