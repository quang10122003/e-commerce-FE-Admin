"use client";

import { useEffect, useRef, useState } from "react";
import type { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { useCreateWsTicketMutation } from "@/client/api/backend-api";
import { createAdminChatStompClient } from "./createAdminChatStompClien";
import type { ChatRoom } from "@/types/chat";

type Options = {
    onRoomUpdate: (room: ChatRoom) => void;
};

export function useAdminChatInboxSocket({ onRoomUpdate }: Options) {
    // Client/subscription để cleanup đúng kết nối inbox khi component unmount.
    const clientRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<StompSubscription | null>(null);
    const [createWsTicket] = useCreateWsTicketMutation();
    // Status kết nối dành cho các UI muốn hiển thị tình trạng realtime inbox.
    const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");

    useEffect(() => {
        // Chặn callback trễ sau khi component đã unmount hoặc effect đã cleanup.
        let disposed = false;

        async function connect() {
            try {
                setStatus("connecting");

                // Inbox cũng dùng ticket ngắn hạn để không đưa access token vào WebSocket CONNECT.
                const ticketResponse = await createWsTicket().unwrap();
                if (disposed) return;

                const client = createAdminChatStompClient({
                    ticket: ticketResponse.ticket,
                    onConnect: () => {
                        if (disposed) return;

                        setStatus("connected");

                        // Topic inbox báo mọi thay đổi room; caller quyết định refresh hoặc merge dữ liệu.
                        subscriptionRef.current = client.subscribe(
                            "/topic/admin/chat/rooms",
                            (frame: IMessage) => {
                                const room = JSON.parse(frame.body) as ChatRoom;
                                onRoomUpdate(room);
                            },
                        );
                    },
                    onError: () => {
                        // Broker error hoặc lỗi kết nối đều đưa UI về trạng thái lỗi.
                        setStatus("error");
                    },
                });

                // Lưu instance để cleanup đóng đúng client vừa activate.
                clientRef.current = client;
                client.activate();
            } catch {
                if (!disposed) setStatus("error");
            }
        }

        connect();

        return () => {
            disposed = true;
            // Hủy subscription trước rồi mới deactivate client để tránh nhận thêm frame trong lúc đóng.
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [createWsTicket, onRoomUpdate]);

    return { status };
}
