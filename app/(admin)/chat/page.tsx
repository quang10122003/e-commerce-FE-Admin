import { Clock3, MessageCircleMore, MessageSquare, UserRoundCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

const rooms = [
  {
    id: 501,
    product: "iPhone 16 Pro 256GB",
    user: "Nguyen Van An",
    admin: "Admin MyShop",
    lastMessage: "Shop oi, bao hanh may nay the nao?",
    createdAt: "2026-04-18 09:10",
    unread: 0,
  },
  {
    id: 502,
    product: "MacBook Air M4",
    user: "Tran Thi Bao",
    admin: null,
    lastMessage: "Co giam gia cho sinh vien khong?",
    createdAt: "2026-04-18 10:22",
    unread: 3,
  },
  {
    id: 503,
    product: "May loc khong khi AirHome",
    user: "Guest User",
    admin: "Admin Support",
    lastMessage: "Ship ve Hai Phong mat bao lau?",
    createdAt: "2026-04-18 11:42",
    unread: 1,
  },
];

const messages = [
  {
    id: 1,
    sender: "Nguyen Van An",
    content: "Shop oi, bao hanh may nay trong bao lau?",
    createdAt: "09:10",
    mine: false,
  },
  {
    id: 2,
    sender: "Admin MyShop",
    content: "San pham bao hanh 12 thang chinh hang anh nhe.",
    createdAt: "09:11",
    mine: true,
  },
  {
    id: 3,
    sender: "Nguyen Van An",
    content: "Co doi tra trong 7 ngay khong shop?",
    createdAt: "09:12",
    mine: false,
  },
  {
    id: 4,
    sender: "Admin MyShop",
    content: "Da, ben em ho tro doi tra trong 7 ngay neu loi NSX.",
    createdAt: "09:13",
    mine: true,
  },
];

export default function ChatPage() {
  return (
    <section>
      <PageHeader
        description="Theo doi chat_rooms va messages, gan admin phu trach cho tung room."
        title="Chat Management"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<MessageSquare className="size-5" />}
          note="Tong chat room dang hoat dong"
          title="Chat rooms"
          value="56"
        />
        <StatCard
          icon={<UserRoundCheck className="size-5" />}
          note="Room da duoc gan admin"
          title="Assigned rooms"
          tone="emerald"
          value="44"
        />
        <StatCard
          icon={<Clock3 className="size-5" />}
          note="Trung binh phan hoi dau tien"
          title="First response SLA"
          tone="amber"
          value="2m 41s"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_1.35fr]">
        <article className="panel">
          <h2 className="text-lg font-semibold text-slate-900">Danh sach chat room</h2>
          <div className="mt-4 space-y-3">
            {rooms.map((room) => (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-3"
                key={room.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Room #{room.id}</p>
                    <p className="text-xs text-slate-500">{room.createdAt}</p>
                  </div>
                  {room.unread > 0 ? (
                    <span className="chip chip-warning">{room.unread} unread</span>
                  ) : (
                    <StatusBadge tone="success">Seen</StatusBadge>
                  )}
                </div>

                <p className="mt-2 text-sm font-medium text-slate-700">{room.product}</p>
                <p className="mt-1 text-sm text-slate-500">User: {room.user}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Admin: {room.admin ?? "Chua gan"}
                </p>
                <p className="mt-2 line-clamp-1 text-sm text-slate-700">{room.lastMessage}</p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                    type="button"
                  >
                    Mo room
                  </button>
                  <button
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                    type="button"
                  >
                    Gan admin
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Room #501 - iPhone 16 Pro</h2>
              <p className="text-sm text-slate-500">Nguyen Van An vs Admin MyShop</p>
            </div>
            <StatusBadge tone="info">TEXT</StatusBadge>
          </div>

          <div className="mt-4 h-[430px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3">
            {messages.map((message) => (
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  message.mine
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
                key={message.id}
              >
                <p className={`text-xs ${message.mine ? "text-blue-100" : "text-slate-500"}`}>
                  {message.sender} - {message.createdAt}
                </p>
                <p className="mt-1">{message.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-400"
              placeholder="Nhap tin nhan..."
              type="text"
            />
            <button
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110"
              type="button"
            >
              <MessageCircleMore className="size-4" />
              Gui
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
