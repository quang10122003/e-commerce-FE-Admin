import type { AdminChatInitialData } from "@/features/chat/services/admin-chat-service";

type AdminChatStats = {
  assignedRoomCount: number;
  unassignedRoomCount: number;
  visibleRoomCount: number;
};

export type AdminChatViewModel = {
  selectedRoomExists: boolean;
  stats: AdminChatStats;
};

// Tạo dữ liệu thống kê và trạng thái room đang chọn cho trang chat.
export function createAdminChatViewModel(
  data: AdminChatInitialData,
  selectedRoomId: number | null,
): AdminChatViewModel {
  const selectedRoomExists = selectedRoomId
    ? data.rooms.some((room) => room.id === selectedRoomId)
    : true;
  const assignedRoomCount = data.rooms.filter(
    (room) => room.assignmentStatus === "ASSIGNED",
  ).length;

  return {
    selectedRoomExists,
    stats: {
      assignedRoomCount,
      unassignedRoomCount: data.rooms.length - assignedRoomCount,
      visibleRoomCount: data.rooms.length,
    },
  };
}
