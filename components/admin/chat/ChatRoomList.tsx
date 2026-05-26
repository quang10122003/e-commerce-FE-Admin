import { ChatRoomCard } from "@/components/admin/chat/ChatRoomCard";
import type { ChatRoom } from "@/types/chat";

type ChatRoomListProps = {
  getRoomHref: (roomId: number) => string;
  rooms: ChatRoom[];
  selectedRoomId: number | null;
};

export function ChatRoomList({
  getRoomHref,
  rooms,
  selectedRoomId,
}: ChatRoomListProps) {
  // List chỉ render dữ liệu đã được container chuẩn bị; click card đổi room qua URL.
  return (
    <article className="panel mt-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Danh sach chat room</h2>
          <p className="text-sm text-slate-500">
            Chon mot room de mo chi tiet tu ben phai man hinh.
          </p>
        </div>
        <span className="chip chip-primary self-start sm:self-auto">
          {rooms.length} room dang hien thi
        </span>
      </div>

      <div className="mt-4 grid max-h-125 gap-4 overflow-y-scroll lg:grid-cols-2 2xl:grid-cols-3">
        {rooms.map((room) => (
          <ChatRoomCard
            href={getRoomHref(room.id)}
            isActive={selectedRoomId === room.id}
            key={room.id}
            room={room}
          />
        ))}
      </div>
    </article>
  );
}
