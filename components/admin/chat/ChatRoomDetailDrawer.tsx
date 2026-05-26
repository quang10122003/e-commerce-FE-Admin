import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ChatRoomMessagesPanel } from "@/components/admin/chat/ChatRoomMessagesPanel";
import { cn } from "@/lib/util/cn";
import type { ChatMessage, ChatRoom } from "@/types/chat";

type ChatRoomDetailDrawerProps = {
  closeHref: string;
  draft: string;
  messages: ChatMessage[];
  onDraftChange: (value: string) => void;
  onSendMessage: () => void;
  room: ChatRoom | null;
  socketConnected: boolean;
};

export function ChatRoomDetailDrawer({
  closeHref,
  draft,
  messages,
  onDraftChange,
  onSendMessage,
  room,
  socketConnected,
}: ChatRoomDetailDrawerProps) {
  // Overlay và drawer đều bám theo room hiện tại; không có room thì trượt khỏi màn hình.
  return (
    <>
      <Link
        aria-hidden={!room}
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/30 transition-opacity duration-300",
          room ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        href={closeHref}
        tabIndex={room ? 0 : -1}
      />

      <aside
        aria-label="Chi tiet chat room"
        aria-modal="true"
        className={cn(
          "fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-3xl transform-gpu flex-col border-l border-slate-200 bg-slate-50 p-4 shadow-2xl transition-transform duration-300 ease-out will-change-transform sm:p-5",
          room ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
      >
        {room ? (
          <RoomDetail
            closeHref={closeHref}
            draft={draft}
            messages={messages}
            onDraftChange={onDraftChange}
            onSendMessage={onSendMessage}
            room={room}
            socketConnected={socketConnected}
          />
        ) : null}
      </aside>
    </>
  );
}

type RoomDetailProps = {
  closeHref: string;
  draft: string;
  messages: ChatMessage[];
  onDraftChange: (value: string) => void;
  onSendMessage: () => void;
  room: ChatRoom;
  socketConnected: boolean;
};

function RoomDetail({
  closeHref,
  draft,
  messages,
  onDraftChange,
  onSendMessage,
  room,
  socketConnected,
}: RoomDetailProps) {
  // Trạng thái assigned lấy từ backend, UI không tự suy từ adminName.
  const isAssigned = room.assignmentStatus === "ASSIGNED";

  return (
    <article className="panel flex min-h-0 flex-1 flex-col">
      <div className="flex items-start justify-between gap-3">
        <Link
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          href={closeHref}
        >
          <ArrowLeft className="size-4" />
          Tro lai
        </Link>
        <Link
          aria-label="Dong chi tiet room"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          href={closeHref}
        >
          <X className="size-4" />
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Room #{room.id} - {room.productName}
          </h2>
          <p className="text-sm text-slate-500">{room.userName}</p>
        </div>
        {isAssigned ? (
          <StatusBadge tone="success">Assigned</StatusBadge>
        ) : (
          <StatusBadge tone="warning">Unassigned</StatusBadge>
        )}
      </div>

      <ChatRoomMessagesPanel
        draft={draft}
        messages={messages}
        onDraftChange={onDraftChange}
        onSendMessage={onSendMessage}
        room={room}
        socketConnected={socketConnected}
      />
    </article>
  );
}
