import { Lock, ShieldCheck, UserPlus, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

const users = [
  {
    id: 1,
    fullName: "Admin MyShop",
    email: "admin@myshop.vn",
    role: "ADMIN",
    locked: false,
    createdAt: "2026-03-12",
  },
  {
    id: 2,
    fullName: "Nguyen Van An",
    email: "an.nguyen@gmail.com",
    role: "CUSTOMER",
    locked: false,
    createdAt: "2026-03-14",
  },
  {
    id: 3,
    fullName: "Tran Thi Bao",
    email: "bao.tran@gmail.com",
    role: "CUSTOMER",
    locked: true,
    createdAt: "2026-03-16",
  },
  {
    id: 4,
    fullName: "Pham Van Cuong",
    email: "cuong.pham@gmail.com",
    role: "CUSTOMER",
    locked: false,
    createdAt: "2026-03-20",
  },
];

export default function UsersPage() {
  return (
    <section>
      <PageHeader
        actionHref="#"
        actionLabel="Them user"
        description="Quan ly users, role va trang thai lock theo bang users/roles."
        title="Users Management"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<Users className="size-5" />}
          note="Tong so tai khoan trong he thong"
          title="Tong users"
          value="1,284"
        />
        <StatCard
          icon={<ShieldCheck className="size-5" />}
          note="Tai khoan co role ADMIN"
          title="Admin accounts"
          tone="emerald"
          value="3"
        />
        <StatCard
          icon={<Lock className="size-5" />}
          note="Tai khoan bi khoa tam thoi"
          title="Locked users"
          tone="amber"
          value="17"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
        <article className="panel">
          <div className="flex flex-wrap items-center gap-3">
            <input
              className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-400"
              defaultValue="an"
              type="text"
            />
            <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none">
              <option>All roles</option>
              <option>ADMIN</option>
              <option>CUSTOMER</option>
            </select>
            <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none">
              <option>All status</option>
              <option>Locked</option>
              <option>Active</option>
            </select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 font-medium">ID</th>
                  <th className="py-3 font-medium">Full name</th>
                  <th className="py-3 font-medium">Email</th>
                  <th className="py-3 font-medium">Role</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Created</th>
                  <th className="py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr className="border-b border-slate-100" key={user.id}>
                    <td className="py-3 font-semibold text-slate-800">#{user.id}</td>
                    <td className="py-3">{user.fullName}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">
                      <StatusBadge tone={user.role === "ADMIN" ? "info" : "neutral"}>
                        {user.role}
                      </StatusBadge>
                    </td>
                    <td className="py-3">
                      <StatusBadge tone={user.locked ? "danger" : "success"}>
                        {user.locked ? "LOCKED" : "ACTIVE"}
                      </StatusBadge>
                    </td>
                    <td className="py-3">{user.createdAt}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                          type="button"
                        >
                          {user.locked ? "Unlock" : "Lock"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <h2 className="text-lg font-semibold text-slate-900">Tao user moi</h2>
          <p className="mt-1 text-sm text-slate-600">Form UI de mapping API tao user sau.</p>

          <form className="mt-4 space-y-3">
            <label className="block space-y-1 text-sm">
              <span className="font-medium text-slate-700">Email</span>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                placeholder="user@email.com"
                type="email"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium text-slate-700">Full name</span>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400"
                placeholder="Nguyen Van B"
                type="text"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium text-slate-700">Role</span>
              <select className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-400">
                <option>CUSTOMER</option>
                <option>ADMIN</option>
              </select>
            </label>
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              type="button"
            >
              <UserPlus className="size-4" />
              Luu user
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
