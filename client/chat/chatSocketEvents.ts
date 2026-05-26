import type { IMessage } from "@stomp/stompjs";
import type { ChatMessage, ChatReadReceipt, ChatRoom } from "@/types/chat";

function parseBody<T>(frame: IMessage) {
  return JSON.parse(frame.body) as T;
}

// Backend hiện trả datetime dạng string hợp lệ; hàm này chỉ giữ chỗ normalize nhẹ khi field null/undefined.
function normalizeDateTime(value: string | null | undefined) {
  if (!value) return value ?? null;
  return value;
}

// Parse room summary từ /topic/admin/chat/rooms theo contract backend.
export function parseChatRoomFrame(frame: IMessage) {
  const room = parseBody<ChatRoom>(frame);

  return {
    ...room,
    createdAt: normalizeDateTime(room.createdAt) ?? room.createdAt,
    lastMessageAt: normalizeDateTime(room.lastMessageAt),
  };
}

// Parse event của room đang mở. Topic này chỉ phục vụ panel chi tiết, không dùng để cập nhật preview inbox.
export function parseChatRoomEventFrame(frame: IMessage) {
  const event = parseBody<ChatMessage | ChatReadReceipt>(frame);

  if ("messageIds" in event) {
    return {
      ...event,
      readAt: normalizeDateTime(event.readAt) ?? event.readAt,
    } satisfies ChatReadReceipt;
  }

  return {
    ...event,
    createdAt: normalizeDateTime(event.createdAt) ?? event.createdAt,
  } satisfies ChatMessage;
}
