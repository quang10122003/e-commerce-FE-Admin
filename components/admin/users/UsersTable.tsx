import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatLocalDate } from "@/lib/util/Date";
import type { UserItem } from "@/types/users";
import { UsersTableActions } from "./UsersTableActions";

type UsersTableProps = {
  activeUserId?: number | null;
  closeEditHref: string;
  getEditHref: (userId: number) => string;
  statusFilter: string;
  users: UserItem[];
};

export function UsersTable({
  activeUserId = null,
  closeEditHref,
  getEditHref,
  statusFilter,
  users,
}: UsersTableProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-190 text-left text-sm">
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
          {users.length === 0 ? (
            <tr>
              <td className="py-4 text-slate-500" colSpan={7}>
                Khong co user phu hop bo loc.
              </td>
            </tr>
          ) : (
            users.map((user) => (
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
                    {user.status || (user.locked ? "LOCKED" : "ACTIVE")}
                  </StatusBadge>
                </td>
                <td className="py-3">{formatLocalDate(user.createdAt, "-")}</td>
                <td className="py-3">
                  <UsersTableActions
                    activeUserId={activeUserId}
                    closeEditHref={closeEditHref}
                    editHref={getEditHref(user.id)}
                    statusFilter={statusFilter}
                    user={user}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
