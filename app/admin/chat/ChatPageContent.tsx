import { ChatRealtimeClient } from "@/app/admin/chat/ChatRealtimeClient";
import type { ChatMessage, ChatRoom } from "@/types/chat";

type ChatPageContentProps = {
  error: {
    messages: string | null;
    rooms: string | null;
  };
  messages: ChatMessage[];
  rooms: ChatRoom[];
  selectedRoomId: number | null;
};

export function ChatPageContent({
  error,
  messages,
  rooms,
  selectedRoomId,
}: ChatPageContentProps) {
  return (
    <ChatRealtimeClient
      error={error}
      initialMessages={messages}
      initialRooms={rooms}
      selectedRoomId={selectedRoomId}
    />
  );
}
