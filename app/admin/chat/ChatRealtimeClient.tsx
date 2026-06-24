"use client";

import { ChatRoomDetailDrawer } from "@/components/admin/chat/ChatRoomDetailDrawer";
import { ChatRoomList } from "@/components/admin/chat/ChatRoomList";
import { useAdminChatRealtime } from "@/features/chat/hooks/use-admin-chat-realtime";
import { buildChatPageHref } from "@/lib/admin/chat-url";
import type { ChatMessage, ChatRoom } from "@/types/chat";

type ChatRealtimeClientProps = {
  error: {
    messages: string | null;
    rooms: string | null;
  };
  initialMessages: ChatMessage[];
  initialRooms: ChatRoom[];
  selectedRoomId: number | null;
};

export function ChatRealtimeClient({
  error,
  initialMessages,
  initialRooms,
  selectedRoomId,
}: ChatRealtimeClientProps) {
  const {
    draft,
    handleSendMessage,
    messages,
    rooms,
    selectedRoom,
    setDraft,
    socketConnected,
  } = useAdminChatRealtime({
    initialMessages,
    initialRooms,
    selectedRoomId,
  });

  return (
    <>
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
        draft={draft}
        messages={messages}
        onDraftChange={setDraft}
        onSendMessage={handleSendMessage}
        room={selectedRoom}
        socketConnected={socketConnected}
      />
    </>
  );
}
