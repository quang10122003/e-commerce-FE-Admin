"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Lock, ShieldCheck } from "lucide-react";
import { ADMIN_ROLE } from "@/lib/auth/constants";
import { getApiErrorMessage, getAxiosErrorMessage } from "@/lib/axios/error";
import { login } from "@/services/auth.service";

type LoginFormValues = {
  email: string;
  password: string;
};

const ADMIN_DASHBOARD_PATH = "/admin/dashboard";
const DEFAULT_LOGIN_ERROR_MESSAGE = "Dang nhap that bai. Vui long thu lai.";

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const reasonError =
    searchParams.get("reason") === "forbidden"
      ? "Tai khoan khong co quyen ADMIN."
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
    setIsLoginLoading(true);

    try {
      const payload = await login({
        email: data.email,
        password: data.password,
      });

      if (!payload?.success) {
        throw new Error(getApiErrorMessage(payload));
      }

      if (!payload?.data) {
        throw new Error("Auth response is missing data.");
      }

      if (payload.data.role !== ADMIN_ROLE) {
        throw new Error("Tai khoan khong co quyen ADMIN.");
      }

      const nextPath = searchParams.get("next");
      const redirectPath = nextPath && nextPath.startsWith("/admin")
        ? nextPath
        : ADMIN_DASHBOARD_PATH;

      router.replace(redirectPath);
    } catch (error) {
      setSubmitError(getAxiosErrorMessage(error, DEFAULT_LOGIN_ERROR_MESSAGE));
    } finally {
      setIsLoginLoading(false);
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
              Dang nhap de truy cap trang quan tri users, products, orders,
              payments va chat.
            </p>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="panel-muted flex items-center gap-3">
              <ShieldCheck className="size-5 text-emerald-600" />
              <span>Chi user co role `ADMIN` moi duoc truy cap.</span>
            </div>
            <div className="panel-muted flex items-center gap-3">
              <Lock className="size-5 text-indigo-600" />
              <span>Session duoc backend cap sau khi dang nhap thanh cong.</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2 className="text-xl font-semibold text-slate-900">Dang nhap admin</h2>

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
                  required: "Vui long dien email",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email khong dung dinh dang",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-error">{errors.email.message}</p>
              )}
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>Mat khau</span>
              <input
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-blue-400"
                {...register("password", {
                  required: "Vui long dien mat khau",
                  minLength: {
                    value: 6,
                    message: "Mat khau toi thieu 6 ky tu",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-error">{errors.password.message}</p>
              )}
            </label>

            {(submitError || reasonError) && (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {submitError || reasonError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLoginLoading}
              className="w-full rounded-xl bg-(--primary) px-4 py-2.5 font-semibold text-white hover:brightness-110 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting || isLoginLoading ? "Dang xu ly..." : "Dang nhap"}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
