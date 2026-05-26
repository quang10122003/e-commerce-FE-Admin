import Link from "next/link";
import { MessageCircle, Package, UserRound } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/util/cn";
import { formatLocalDateTime } from "@/lib/util/formatDateTime";
import type { ChatRoom } from "@/types/chat";

type ChatRoomCardProps = {
  href: string;
  isActive: boolean;
  room: ChatRoom;
};

export function ChatRoomCard({ href, isActive, room }: ChatRoomCardProps) {
  // Các trạng thái này quyết định badge, font weight và viền active/unread.
  const isAssigned = room.assignmentStatus === "ASSIGNED";
  const hasUnread = room.unreadCount > 0;
  const lastMessageContent = room.lastMessageContent?.trim();
  const lastMessageText = lastMessageContent || "Chua co tin nhan nao";
  const lastMessageSenderName = room.lastMessageSenderName?.trim();
  const displayTime = formatLocalDateTime(room.lastMessageAt ?? room.createdAt);

  return (
    <Link
      className={cn(
        "group rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
        isActive && "border-blue-300 bg-blue-50 ring-2 ring-blue-100",
        !isActive && hasUnread && "border-blue-200 bg-white",
        !isActive && !hasUnread && "border-slate-200 bg-white",
      )}
      href={href}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Room #{room.id}
          </p>

          <p
            className={cn(
              "mt-1 truncate text-base",
              hasUnread ? "font-bold text-slate-950" : "font-semibold text-slate-900",
            )}
          >
            {room.userName}
          </p>
        </div>

        {isAssigned ? (
          <StatusBadge tone="success">Assigned</StatusBadge>
        ) : (
          <StatusBadge tone="warning">Unassigned</StatusBadge>
        )}
      </div>

      <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Package className="size-4 shrink-0 text-blue-500" />
          <span className="line-clamp-1 font-medium">{room.productName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <UserRound className="size-4 shrink-0 text-slate-400" />
          <span className="truncate">Admin: {room.adminName ?? "Chua gan"}</span>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <MessageCircle className="mt-1 size-4 shrink-0 text-slate-400" />

              <p
                className={cn(
                  "line-clamp-2 text-sm leading-6",
                  hasUnread ? "font-semibold text-slate-950" : "text-slate-600",
                )}
              >
                {lastMessageContent && lastMessageSenderName ? (
                  <>
                    <span className="font-semibold">{lastMessageSenderName}: </span>
                    {lastMessageText}
                  </>
                ) : (
                  lastMessageText
                )}
              </p>
            </div>

            <p className="mt-2 text-xs font-medium text-slate-400">{displayTime}</p>
          </div>

          {hasUnread ? (
            <span className="inline-flex min-w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">
              {room.unreadCount > 99 ? "99+" : room.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
