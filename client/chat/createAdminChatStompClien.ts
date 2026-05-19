"use client";

import { Client } from "@stomp/stompjs";

type CreateAdminChatClientOptions = {
    ticket: string;
    onConnect: () => void;
    onError: (mes: string) => void;
};

export function createAdminChatStompClient({
    ticket,
    onConnect,
    onError,
}: CreateAdminChatClientOptions) {
    // Cấu hình STOMP client dùng chung cho inbox và từng room chat.
    return new Client({
        // URL WebSocket của backend, cho phép override bằng biến môi trường khi deploy.
        brokerURL: process.env.NEXT_PUBLIC_WS_CHAT_URL ?? "ws://localhost:8080/ws/chat",
        // Backend xác thực CONNECT bằng ticket ngắn hạn thay vì access token dài hạn.
        connectHeaders: {
            Authorization: `Bearer ${ticket}`,
        },
        // Tự reconnect sau 3 giây nếu kết nối bị rớt.
        reconnectDelay: 3000,
        // Frontend kỳ vọng server gửi heartbeat mỗi 10 giây; quá lâu thì STOMP coi connection đã chết.
        heartbeatIncoming: 10000,
        // Frontend gửi heartbeat mỗi 10 giây để giữ connection sống.
        heartbeatOutgoing: 10000,
        // Callback chạy khi STOMP connect thành công.
        onConnect,
        onStompError: (frame) => {
            onError(frame.headers.message ?? "WebSocket error");
        },
        debug: process.env.NODE_ENV === "development" ? console.log : undefined,
    });
}
