import { Clock3, MessageSquare, UserRoundCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { buildChatPageHref } from "@/lib/admin/chat-url";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { serverPrivateFetch } from "@/server/backend-fetch";
import { ChatMessage, ChatRoom } from "@/types/chat";
import type { NextSearchParams } from "@/types/next";
import { ChatPageContent } from "./ChatPageContent";

const ADMIN_CHAT_ROOMS_API = "/admin/chat/rooms";

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseSelectedRoomId(params: Awaited<NextSearchParams>) {
  const rawRoomId = Number(getParamValue(params.room));

  return Number.isFinite(rawRoomId) && rawRoomId > 0 ? rawRoomId : null;
}

async function getChatInitialData(selectedRoomId: number | null) {
  const [roomsResult, messagesResult] = await Promise.allSettled([
    serverPrivateFetch<ChatRoom[]>(ADMIN_CHAT_ROOMS_API),
    selectedRoomId
      ? serverPrivateFetch<ChatMessage[]>(`/chat/rooms/${selectedRoomId}/messages`)
      : Promise.resolve(null),
  ]);

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

export default async function ChatPage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const selectedRoomId = parseSelectedRoomId(params);
  const { data, error } = await getChatInitialData(selectedRoomId);

  const selectedRoomExists = selectedRoomId
    ? data.rooms.some((room) => room.id === selectedRoomId)
    : true;

  if (selectedRoomId && data.rooms.length > 0 && !selectedRoomExists) {
    redirect(buildChatPageHref());
  }

  // Backend đã scope danh sách này thành room chưa gán và room thuộc admin hiện tại.
  // Các chỉ số dashboard nên bám theo server payload thay vì tự suy luận thêm ở client.
  const assignedRoomCount = data.rooms.filter(
    (room) => room.assignmentStatus === "ASSIGNED",
  ).length;
  const unassignedRoomCount = data.rooms.length - assignedRoomCount;

  return (
    <section>
      <PageHeader
        description="Theo doi room chua gan va room dang do admin hien tai phu trach."
        title="Chat Management"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<MessageSquare className="size-5" />}
          note="Room admin nay co the xu ly"
          title="Visible rooms"
          value={String(data.rooms.length)}
        />
        <StatCard
          icon={<UserRoundCheck className="size-5" />}
          note="Room da gan cho admin hien tai"
          title="Assigned to me"
          tone="emerald"
          value={String(assignedRoomCount)}
        />
        <StatCard
          icon={<Clock3 className="size-5" />}
          note="Room chua co admin phu trach"
          title="Unassigned"
          tone="amber"
          value={String(unassignedRoomCount)}
        />
      </div>

      <ChatPageContent
        error={error}
        messages={data.messages}
        rooms={data.rooms}
        selectedRoomId={selectedRoomId}
      />
    </section>
  );
}
