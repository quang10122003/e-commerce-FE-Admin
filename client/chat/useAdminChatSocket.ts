"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Client } from "@stomp/stompjs";
import { useCreateWsTicketMutation } from "@/client/api/backend-api";
import {
  parseChatRoomEventFrame,
  parseChatRoomFrame,
} from "@/client/chat/chatSocketEvents";
import { createAdminChatStompClient } from "@/client/chat/createAdminChatStompClient";
import type { ChatMessage, ChatReadReceipt, ChatRoom } from "@/types/chat";

type Options = {
  onMessage: (message: ChatMessage) => void;
  onReadReceipt: (receipt: ChatReadReceipt) => void;
  onRoomUpdate: (room: ChatRoom) => void;
  selectedRoomId: number | null;
};

export function useAdminChatSocket({
  onMessage,
  onReadReceipt,
  onRoomUpdate,
  selectedRoomId,
}: Options) {
  // STOMP client hiện tại, dùng để publish message và đóng kết nối khi unmount.
  const clientRef = useRef<Client | null>(null);

  // Subscription duy nhất cho preview room realtime của admin inbox.
  const inboxSubscriptionRef = useRef<ReturnType<Client["subscribe"]> | null>(null);

  // Subscription của room đang mở để panel chi tiết nhận message/read receipt realtime.
  const activeRoomSubscriptionRef = useRef<ReturnType<Client["subscribe"]> | null>(null);
  const [createWsTicket] = useCreateWsTicketMutation();

  // Trạng thái kết nối để UI bật/tắt input gửi tin.
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");

  useEffect(() => {
    let disposed = false;

    // Lấy ticket ngắn hạn rồi mở kết nối STOMP tới backend.
    async function connect() {
      try {
        setStatus("connecting");
        const ticketResponse = await createWsTicket().unwrap();
        if (disposed) return;

        const client = createAdminChatStompClient({
          ticket: ticketResponse.ticket,
          onConnect: () => {
            if (disposed) return;

            setStatus("connected");
            inboxSubscriptionRef.current = client.subscribe(
              "/topic/chat/rooms",
              (frame) => {
                // Room preview chỉ nhận từ inbox topic, không tự suy từ message topic.
                onRoomUpdate(parseChatRoomFrame(frame));
              },
            );
          },
          onError: () => {
            if (!disposed) setStatus("error");
          },
        });

        clientRef.current = client;
        client.activate();
      } catch {
        if (!disposed) setStatus("error");
      }
    }

    connect();

    return () => {
      disposed = true;
      inboxSubscriptionRef.current?.unsubscribe();
      inboxSubscriptionRef.current = null;
      activeRoomSubscriptionRef.current?.unsubscribe();
      activeRoomSubscriptionRef.current = null;
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, [createWsTicket, onRoomUpdate]);

  useEffect(() => {
    const client = clientRef.current;
    if (!client?.connected) return;

    activeRoomSubscriptionRef.current?.unsubscribe();
    activeRoomSubscriptionRef.current = null;

    if (!selectedRoomId) return;

    // Chỉ subscribe room đang mở để cập nhật panel chi tiết, không subscribe toàn bộ room preview.
    activeRoomSubscriptionRef.current = client.subscribe(
      `/topic/chat/rooms/${selectedRoomId}`,
      (frame) => {
        const event = parseChatRoomEventFrame(frame);

        if ("messageIds" in event) {
          onReadReceipt(event);
          return;
        }

        onMessage(event);
      },
    );

    return () => {
      activeRoomSubscriptionRef.current?.unsubscribe();
      activeRoomSubscriptionRef.current = null;
    };
  }, [onMessage, onReadReceipt, selectedRoomId, status]);

  // Publish message đến endpoint STOMP của room đang mở.
  const sendMessage = useCallback((roomId: number, content: string) => {
    if (!clientRef.current?.connected) return false;

    clientRef.current.publish({
      body: JSON.stringify({ content }),
      destination: `/api/chat/rooms/${roomId}/send`,
    });

    return true;
  }, []);

  return { sendMessage, status };
}
