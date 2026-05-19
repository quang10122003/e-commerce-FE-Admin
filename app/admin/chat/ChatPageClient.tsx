import { ChatRoomDetailDrawer } from "@/components/admin/chat/ChatRoomDetailDrawer";
import { ChatRoomInboxRealtimeBridge } from "@/components/admin/chat/ChatRoomInboxRealtimeBridge";
import { ChatRoomList } from "@/components/admin/chat/ChatRoomList";
import { buildChatPageHref } from "@/lib/admin/chat-url";
import { ChatMessage, ChatRoom } from "@/types/chat";

type ChatPageClientProps = {
  error: {
    messages: string | null;
    rooms: string | null;
  };
  messages: ChatMessage[];
  rooms: ChatRoom[];
  selectedRoomId: number | null;
};

export function ChatPageClient({
  error,
  messages,
  rooms,
  selectedRoomId,
}: ChatPageClientProps) {
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? null;

  return (
    <>
      <ChatRoomInboxRealtimeBridge />

      {error.rooms ? <p className="mt-4 text-sm text-error">{error.rooms}</p> : null}

      <ChatRoomList
        getRoomHref={buildChatPageHref}
        rooms={rooms}
        selectedRoomId={selectedRoomId}
      />

      {selectedRoom && error.messages ? (
        <p className="mt-4 text-sm text-error">{error.messages}</p>
      ) : null}

      <ChatRoomDetailDrawer
        closeHref={buildChatPageHref()}
        messages={messages}
        room={selectedRoom}
      />
    </>
  );
}