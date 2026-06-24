import { Clock3, MessageSquare, UserRoundCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { ChatPageContent } from "./ChatPageContent";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { createAdminChatViewModel } from "@/features/chat/mappers/admin-chat-view-model";
import { getAdminChatInitialData } from "@/features/chat/services/admin-chat-service";
import { buildChatPageHref } from "@/lib/admin/chat-url";
import { readSearchParam } from "@/lib/util/readSearchParam";
import type { NextSearchParams } from "@/types/next";

// Đọc room được chọn từ URL và bỏ qua giá trị không hợp lệ.
function parseSelectedRoomId(params: Awaited<NextSearchParams>) {
  const rawRoomId = Number(readSearchParam(params.room));

  return Number.isFinite(rawRoomId) && rawRoomId > 0 ? rawRoomId : null;
}

export default async function ChatPage({
  searchParams,
}: {
  searchParams: NextSearchParams;
}) {
  const params = await searchParams;
  const selectedRoomId = parseSelectedRoomId(params);
  const { data, error } = await getAdminChatInitialData(selectedRoomId);
  const { selectedRoomExists, stats } = createAdminChatViewModel(
    data,
    selectedRoomId,
  );

  if (selectedRoomId && data.rooms.length > 0 && !selectedRoomExists) {
    redirect(buildChatPageHref());
  }

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
          value={String(stats.visibleRoomCount)}
        />
        <StatCard
          icon={<UserRoundCheck className="size-5" />}
          note="Room da gan cho admin hien tai"
          title="Assigned to me"
          tone="emerald"
          value={String(stats.assignedRoomCount)}
        />
        <StatCard
          icon={<Clock3 className="size-5" />}
          note="Room chua co admin phu trach"
          title="Unassigned"
          tone="amber"
          value={String(stats.unassignedRoomCount)}
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
