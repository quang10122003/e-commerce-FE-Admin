import "server-only";

import { getApiErrorMessage } from "@/lib/util/apiError";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { rethrowSettledNextFrameworkErrors } from "@/server/next-framework-error";
import type { ChatMessage, ChatRoom } from "@/types/chat";

const ADMIN_CHAT_ROOMS_API = "/admin/chat/rooms";

export type AdminChatInitialData = {
  messages: ChatMessage[];
  rooms: ChatRoom[];
};

export type AdminChatInitialError = {
  messages: string | null;
  rooms: string | null;
};

type AdminChatInitialResult = {
  data: AdminChatInitialData;
  error: AdminChatInitialError;
};

// Gọi API lấy danh sách room và tin nhắn của room đang chọn nếu có.
export async function getAdminChatInitialData(
  selectedRoomId: number | null,
  refreshRedirectPath?: string,
): Promise<AdminChatInitialResult> {
  const [roomsResult, messagesResult] = await Promise.allSettled([
    serverPrivateFetch<ChatRoom[]>(ADMIN_CHAT_ROOMS_API, { refreshRedirectPath }),
    selectedRoomId
      ? serverPrivateFetch<ChatMessage[]>(
          `/chat/rooms/${selectedRoomId}/messages`,
          { refreshRedirectPath },
        )
      : Promise.resolve(null),
  ]);

  rethrowSettledNextFrameworkErrors([roomsResult, messagesResult]);

  return {
    data: {
      messages:
        messagesResult.status === "fulfilled" && messagesResult.value?.success
          ? messagesResult.value.data ?? []
          : [],
      rooms:
        roomsResult.status === "fulfilled" && roomsResult.value.success
          ? roomsResult.value.data ?? []
          : [],
    },
    error: {
      messages:
        messagesResult.status === "rejected"
          ? getApiErrorMessage(messagesResult.reason, "Khong the tai tin nhan.")
          : messagesResult.value && !messagesResult.value.success
            ? getApiErrorMessage(messagesResult.value, "Khong the tai tin nhan.")
            : null,
      rooms:
        roomsResult.status === "rejected"
          ? getApiErrorMessage(roomsResult.reason, "Khong the tai danh sach room.")
          : roomsResult.value.success
            ? null
            : getApiErrorMessage(
                roomsResult.value,
                "Khong the tai danh sach room.",
              ),
    },
  };
}
