import type { ChatMessage, ChatReadReceipt, ChatRoom } from "@/types/chat";

function getRoomSortTime(room: ChatRoom) {
  return new Date(room.lastMessageAt ?? room.createdAt).getTime();
}

// Room có hoạt động mới nhất sẽ nổi lên đầu danh sách inbox.
function sortRoomsByLatestActivity(rooms: ChatRoom[]) {
  return [...rooms].sort((left, right) => getRoomSortTime(right) - getRoomSortTime(left));
}

// Merge room summary từ backend vào danh sách hiện tại, sau đó sắp xếp lại inbox.
export function mergeChatRoomUpdate(rooms: ChatRoom[], incomingRoom: ChatRoom) {
  const found = rooms.some((room) => room.id === incomingRoom.id);
  const mergedRooms = found
    ? rooms.map((room) => (room.id === incomingRoom.id ? { ...room, ...incomingRoom } : room))
    : [incomingRoom, ...rooms];

  return sortRoomsByLatestActivity(mergedRooms);
}

export function upsertChatMessage(messages: ChatMessage[], incomingMessage: ChatMessage) {
  const existingMessage = messages.find((message) => message.id === incomingMessage.id);

  // Message mới thì append; message trùng id thì merge để giữ trạng thái read đã có.
  if (!existingMessage) {
    return [...messages, incomingMessage];
  }

  return messages.map((message) =>
    message.id === incomingMessage.id
      ? { ...message, ...incomingMessage, read: message.read || incomingMessage.read }
      : message,
  );
}

export function applyReadReceiptToMessages(
  messages: ChatMessage[],
  receipt: ChatReadReceipt,
) {
  // Backend gửi danh sách id đã đọc, client chỉ cần bật read cho các id đó.
  const readMessageIds = new Set(receipt.messageIds);

  return messages.map((message) =>
    readMessageIds.has(message.id) ? { ...message, read: true } : message,
  );
}
