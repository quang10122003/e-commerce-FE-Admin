"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAdminChatInboxSocket } from "@/client/chat/useAdminChatInboxSocket";

export function ChatRoomInboxRealtimeBridge() {
    const router = useRouter();
    // Timer debounce refresh để nhiều event room liên tiếp không gọi router.refresh quá dày.
    const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scheduleRefresh = useCallback(() => {
        // Nếu đã có refresh được lên lịch thì giữ nguyên, chỉ cần một refresh gom nhiều event.
        if (refreshTimerRef.current) return;

        refreshTimerRef.current = setTimeout(() => {
            router.refresh();
            refreshTimerRef.current = null;
        }, 300);
    }, [router]);

    useAdminChatInboxSocket({
        onRoomUpdate: scheduleRefresh,
    });

    return null;
}
