"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Lock, ShieldCheck } from "lucide-react";
import { useLoginMutation } from "@/client/api/backend-api";
import { getApiErrorMessage } from "@/lib/util/apiError";
import { ADMIN_ROLE } from "@/types/auth";

type LoginFormValues = {
  email: string;
  password: string;
};

const ADMIN_DASHBOARD_PATH = "/admin/dashboard";
const DEFAULT_LOGIN_ERROR_MESSAGE = "Đăng nhập thất bại. Vui lòng thử lại.";

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [submitError, setSubmitError] = useState<string>("");
  const reasonError =
    searchParams.get("reason") === "forbidden"
      ? "Tài khoản không có quyền ADMIN."
      : "";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: LoginFormValues) {
    setSubmitError("");

    try {
      // Client chỉ gọi Next API proxy; proxy sẽ gọi backend và tự set cookie httpOnly.
      const payload = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      if (!payload?.success) {
        throw new Error(getApiErrorMessage(payload));
      }

      if (!payload?.data) {
        throw new Error("Auth response is missing data.");
      }

      if (payload.data.role !== ADMIN_ROLE) {
        throw new Error("Tài khoản không có quyền ADMIN.");
      }

      const nextPath = searchParams.get("next");
      const redirectPath =
        nextPath && nextPath.startsWith("/admin")
          ? nextPath
          : ADMIN_DASHBOARD_PATH;
          
      router.replace(redirectPath);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, DEFAULT_LOGIN_ERROR_MESSAGE));
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full min-w-245 max-w-6xl items-center justify-center px-6 py-8">
      <section className="grid w-full grid-cols-[1.1fr_0.9fr] gap-6">
        <article className="panel flex flex-col justify-between gap-7 bg-[linear-gradient(145deg,#ffffff_0%,#edf4ff_100%)]">
          <div>
            <span className="chip chip-primary">Admin portal</span>
            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              MyShop Dashboard
            </h1>
            <p className="mt-3 text-slate-600">
              Đăng nhập để truy cập trang quản trị users, products, orders,
              payments và chat.
            </p>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="panel-muted flex items-center gap-3">
              <ShieldCheck className="size-5 text-emerald-600" />
              <span>Chỉ user có role `ADMIN` mới được truy cập.</span>
            </div>
            <div className="panel-muted flex items-center gap-3">
              <Lock className="size-5 text-indigo-600" />
              <span>Session được backend cấp sau khi đăng nhập thành công.</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2 className="text-xl font-semibold text-slate-900">Đăng nhập admin</h2>

          <form
            className="mt-6 space-y-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="block space-y-2 text-sm font-medium">
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-blue-400"
                {...register("email", {
                  pattern: {
                    message: "Email không đúng định dạng",
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  },
                  required: "Vui lòng điền email",
                })}
              />
              {errors.email && (
                <p className="text-sm text-error">{errors.email.message}</p>
              )}
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>Mật khẩu</span>
              <input
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-blue-400"
                {...register("password", {
                  minLength: {
                    message: "Mật khẩu tối thiểu 6 ký tự",
                    value: 6,
                  },
                  required: "Vui lòng điền mật khẩu",
                })}
              />
              {errors.password && (
                <p className="text-sm text-error">{errors.password.message}</p>
              )}
            </label>

            {(submitError || reasonError) && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-error">
                {submitError || reasonError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLoginLoading}
              className="w-full rounded-xl bg-(--primary) px-4 py-2.5 font-semibold text-white hover:brightness-110 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting || isLoginLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
