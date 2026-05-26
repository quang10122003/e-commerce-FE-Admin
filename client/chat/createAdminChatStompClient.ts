"use client";

import { Client } from "@stomp/stompjs";

type CreateAdminChatClientOptions = {
  ticket: string;
  onConnect: () => void;
  onError: (message: string) => void;
};

export function createAdminChatStompClient({
  ticket,
  onConnect,
  onError,
}: CreateAdminChatClientOptions) {
  // Cấu hình STOMP dùng chung cho chat admin, xác thực bằng ticket ngắn hạn.
  return new Client({
    brokerURL: process.env.NEXT_PUBLIC_WS_CHAT_URL ?? "ws://localhost:8080/ws/chat",
    connectHeaders: {
      Authorization: `Bearer ${ticket}`,
    },
    debug: process.env.NODE_ENV === "development" ? console.log : undefined,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect,
    onStompError: (frame) => {
      onError(frame.headers.message ?? "WebSocket error");
    },
    reconnectDelay: 3000,
  });
}
