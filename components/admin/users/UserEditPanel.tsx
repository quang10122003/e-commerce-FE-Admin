import { UserPlus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { roleState } from "@/types/role/role";
import type { UserItem } from "@/types/user/User";
import { UserRoleOptions } from "./UserRoleOptions";

type UserEditFormValues = {
  id:number
  email: string;
  fullName: string;
  role: string;
};

type UserEditPanelProps = {
  editingUser: UserItem | null;
  onClose: () => void;
  roleState: roleState;
};

export function UserEditPanel({
  editingUser,
  onClose,
  roleState,
}: UserEditPanelProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserEditFormValues>({
    defaultValues: {
      id:editingUser?.id ?? undefined,
      email: editingUser?.email ?? "",
      fullName: editingUser?.fullName ?? "",
      role: editingUser?.role ?? "",
    },
    mode: "onBlur",
  });

  function onSubmit(data: UserEditFormValues) {
    void data;
  }

  if (!editingUser) {
    return null;
  }

  return (
    <article className="panel animate-user-edit-panel-in self-start">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="section-title">Chinh sua user</h2>
          <p className="mt-1 text-sm text-slate-600">
            Form UI de chinh sua thong tin user
          </p>
        </div>

        <button
          aria-label="Dong form edit user"
          className="btn-outline"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Form duoc remount theo user o component cha, nen useForm nhan dung defaultValues ma khong can reset bang effect. */}
      <form className="mt-4 space-y-3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <label className="block space-y-1 text-sm">
          <span className="pl-2 font-bold text-slate-700">Id</span>
          <input
            className="field-input  bg-[#f1f5f9] text-[#94a3b8]"
            placeholder="user@email.com"
            type="number"
            {...register("id", {
              required: "id",
            })}
            disabled
          />
          <span className="pl-2 font-bold text-slate-700">Email</span>
          <input
            className="field-input"
            placeholder="user@email.com"
            type="email"
            {...register("email", {
              required: "Vui long nhap email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email khong dung dinh dang",
              },
            })}
          />
          {errors.email ? (
            <p className="text-sm text-rose-600">{errors.email.message}</p>
          ) : null}
        </label>

        <label className="block space-y-1 text-sm">
          <span className="pl-2 font-blod text-slate-700">Full name</span>
          <input
            className="field-input"
            placeholder="Nguyen Van B"
            type="text"
            {...register("fullName", {
              required: "Vui long nhap full name",
              minLength: {
                value: 2,
                message: "Full name phai co it nhat 2 ky tu",
              },
            })}
          />
          {errors.fullName ? (
            <p className="text-sm text-rose-600">{errors.fullName.message}</p>
          ) : null}
        </label>

        <label className="block space-y-1 text-sm">
          <span className="pl-2 font-bold text-slate-700">Role</span>
          <select
            className="field-select w-full"
            {...register("role", {
              required: "Vui long chon role",
            })}
          >
            <UserRoleOptions roleState={roleState} />
          </select>
          {errors.role ? (
            <p className="text-sm text-rose-600">{errors.role.message}</p>
          ) : null}
        </label>

        <div className="flex gap-2">
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            <X className="size-4" />
            {isSubmitting ? "Dang luu..." : "Luu user"}
          </button>

          <button className="btn-primary w-full" onClick={onClose} type="button">
            <UserPlus className="size-4" />
            Huy
          </button>
        </div>
      </form>
    </article>
  );
}
