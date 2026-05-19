// Quản lý realtime WebSocket chat cho một room admin.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { useCreateWsTicketMutation } from "@/client/api/backend-api";
import { createAdminChatStompClient } from "./createAdminChatStompClien";
import type { ChatMessage } from "@/types/chat";

type Options = {
    roomId: number | null;
    onMessage: (message: ChatMessage) => void;
};

export function useAdminChatRoomSocket({ roomId, onMessage }: Options) {
    // Giữ STOMP client hiện tại để có thể publish tin nhắn và đóng kết nối khi đổi room/unmount.
    const clientRef = useRef<Client | null>(null);

    // Giữ subscription của room hiện tại để unsubscribe đúng topic khi cleanup.
    const subscriptionRef = useRef<StompSubscription | null>(null);

    // Status kết nối dùng cho UI: idle, connecting, connected hoặc error.
    const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
    const [createWsTicket] = useCreateWsTicketMutation();

    useEffect(() => {
        // Không mở WebSocket khi chưa có room được chọn.
        if (!roomId) return;

        // Flag đánh dấu effect đã cleanup, tránh set state/subscribe sau khi room đổi hoặc component unmount.
        let disposed = false;

        // Lấy ticket ngắn hạn từ backend trước khi CONNECT vào WebSocket.
        async function connect() {
            try {
                setStatus("connecting");
                const ticketResponse = await createWsTicket().unwrap();

                // Nếu effect đã cleanup trong lúc đang fetch thì dừng lại, không tạo client nữa.
                if (disposed) return;

                // Khởi tạo kết nối WebSocket/STOMP bằng ticket vừa nhận.
                const client = createAdminChatStompClient({
                    ticket: ticketResponse.ticket,
                    onConnect: () => {
                        // Callback có thể chạy trễ sau cleanup, nên kiểm tra lại trước khi set state/subscribe.
                        if (disposed) return;

                        // STOMP connected thành công, UI có thể bật input gửi tin.
                        setStatus("connected");

                        // Lắng nghe topic riêng của room; mỗi frame nhận được sẽ parse thành ChatMessage.
                        subscriptionRef.current = client.subscribe(
                            `/topic/chat/rooms/${roomId}`,
                            (frame: IMessage) => {
                                const message = JSON.parse(frame.body) as ChatMessage;
                                onMessage(message);
                            },
                        );
                    },
                    onError: () => {
                        // Báo lỗi khi STOMP broker trả về error hoặc client connect gặp vấn đề.
                        setStatus("error");
                    },
                });

                // Lưu client vào ref để sendMessage dùng đúng instance đang connected.
                clientRef.current = client;

                // Kích hoạt kết nối WebSocket/STOMP.
                client.activate();
            } catch {
                if (!disposed) setStatus("error");
            }
        }

        connect();

        return () => {
            // Cleanup khi đổi room/unmount: chặn callback trễ, hủy subscription và đóng client.
            disposed = true;
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [createWsTicket, roomId, onMessage]);

    const sendMessage = useCallback(
        (content: string) => {
            // Không gửi khi chưa có room hoặc WebSocket chưa connected.
            if (!roomId || !clientRef.current?.connected) return false;

            // Gửi message đến endpoint STOMP của backend cho room hiện tại.
            clientRef.current.publish({
                destination: `/api/chat/rooms/${roomId}/send`,
                body: JSON.stringify({ content }),
            });

            // Trả về true để caller biết publish đã được thực hiện.
            return true;
        },
        [roomId],
    );

    return { sendMessage, status };
}
