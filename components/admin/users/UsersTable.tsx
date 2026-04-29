import { StatusBadge } from "@/components/admin/StatusBadge";
import type { UserItem } from "@/types/user/User";
import { formatUserDate } from "./utils";

type UsersTableProps = {
  deletingUserId: number | null;
  isLoading: boolean;
  onDeleteUser: (userId: number) => void;
  onEditUser: (user: UserItem) => void;
  onToggleLock: (user: UserItem) => void;
  submittingUserId: number | null;
  users: UserItem[];
};

export function UsersTable({
  deletingUserId,
  isLoading,
  onDeleteUser,
  onEditUser,
  onToggleLock,
  submittingUserId,
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
          {isLoading ? (
            <tr>
              <td className="py-4 text-slate-500" colSpan={7}>
                Dang tai danh sach users...
              </td>
            </tr>
          ) : users.length === 0 ? (
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
                <td className="py-3">{formatUserDate(user.createdAt)}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="btn-outline"
                      onClick={() => onEditUser(user)}
                      type="button"
                    >
                      Edit
                    </button>

                    <button
                      className="btn-outline"
                      disabled={submittingUserId === user.id}
                      onClick={() => {
                        onToggleLock(user);
                      }}
                      type="button"
                    >
                      {submittingUserId === user.id
                        ? "Dang xu ly..."
                        : user.locked
                          ? "Unlock"
                          : "Lock"}
                    </button>

                    <button
                      disabled={deletingUserId === user.id}
                      className="btn-outline"
                      onClick={() => onDeleteUser(user.id)}
                      type="button"
                    >
                      {deletingUserId === user.id ? "Dang xoa..." : "Xoa"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
