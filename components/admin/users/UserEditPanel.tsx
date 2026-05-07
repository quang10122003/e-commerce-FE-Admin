import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { RoleState } from "@/types/roles";
import type { UpdateUserRequest, UserItem } from "@/types/users";
import { UserRoleOptions } from "./UserRoleOptions";

type UserEditFormValues = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

type UserEditPanelProps = {
  editingUser: UserItem | null;
  isSaving?: boolean;
  onClose: () => void;
  onSaveUser: (userId: number, data: UpdateUserRequest) => Promise<void>;
  roleState: RoleState;
};

export function UserEditPanel({
  editingUser,
  isSaving = false,
  onClose,
  onSaveUser,
  roleState,
}: UserEditPanelProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserEditFormValues>({
    defaultValues: {
      email: editingUser?.email ?? "",
      fullName: editingUser?.fullName ?? "",
      id: editingUser?.id ?? undefined,
      role: editingUser?.role ?? "",
    },
    mode: "onBlur",
  });

  async function onSubmit(data: UserEditFormValues) {
    if (!editingUser) {
      return;
    }

    await onSaveUser(editingUser.id, {
      email: data.email.trim(),
      fullName: data.fullName.trim(),
      role: data.role,
    });
  }

  if (!editingUser) {
    return null;
  }

  return (
    <article className="panel animate-user-edit-panel-in self-start">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="section-title">Chỉnh sửa user</h2>
          <p className="mt-1 text-sm text-slate-600">
            Cập nhật email, họ tên và role của tài khoản.
          </p>
        </div>

        <button
          aria-label="Đóng form edit user"
          className="btn-outline"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Form được remount theo user ở component cha, nên useForm nhận đúng defaultValues mà không cần reset bằng effect. */}
      <form className="mt-4 space-y-3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <label className="block space-y-1 text-sm">
          <span className="pl-2 font-bold text-slate-700">Id</span>
          <input
            className="field-input bg-[#f1f5f9] text-[#94a3b8]"
            placeholder="ID user"
            type="number"
            {...register("id", {
              required: "ID user là bắt buộc",
            })}
            disabled
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="pl-2 font-bold text-slate-700">Email</span>
          <input
            className="field-input"
            placeholder="user@email.com"
            type="email"
            {...register("email", {
              pattern: {
                message: "Email không đúng định dạng",
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              },
              required: "Vui lòng nhập email",
            })}
          />
          {errors.email ? (
            <p className="text-sm text-error">{errors.email.message}</p>
          ) : null}
        </label>

        <label className="block space-y-1 text-sm">
          <span className="pl-2 font-bold text-slate-700">Full name</span>
          <input
            className="field-input"
            placeholder="Nguyen Van B"
            type="text"
            {...register("fullName", {
              minLength: {
                message: "Full name phải có ít nhất 2 ký tự",
                value: 2,
              },
              required: "Vui lòng nhập full name",
            })}
          />
          {errors.fullName ? (
            <p className="text-sm text-error">{errors.fullName.message}</p>
          ) : null}
        </label>

        <label className="block space-y-1 text-sm">
          <span className="pl-2 font-bold text-slate-700">Role</span>
          <select
            className="field-select w-full"
            {...register("role", {
              required: "Vui lòng chọn role",
            })}
          >
            <UserRoleOptions roleState={roleState} />
          </select>
          {errors.role ? (
            <p className="text-sm text-error">{errors.role.message}</p>
          ) : null}
        </label>

        <div className="flex gap-2">
          <button
            className="btn-primary w-full"
            disabled={isSubmitting || isSaving}
            type="submit"
          >
            <Save className="size-4" />
            {isSubmitting || isSaving ? "Đang lưu..." : "Lưu user"}
          </button>

          <button className="btn-primary w-full" onClick={onClose} type="button">
            <X className="size-4" />
            Hủy
          </button>
        </div>
      </form>
    </article>
  );
}
