import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";

export default function Home() {
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
              Giao dien quan tri cho Users, Products, Orders, Payments va Chat.
              Toan bo du lieu trong project nay dang la hard-code de ban noi API
              backend sau.
            </p>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="panel-muted flex items-center gap-3">
              <ShieldCheck className="size-5 text-emerald-600" />
              <span>Phan quyen admin theo role `ADMIN`</span>
            </div>
            <div className="panel-muted flex items-center gap-3">
              <Lock className="size-5 text-indigo-600" />
              <span>Trang thai lock user duoc hien thi o module Users</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2 className="text-xl font-semibold text-slate-900">Dang nhap admin</h2>
          <p className="mt-2 text-sm text-slate-600">
            UI-only: nut dang nhap se dieu huong thang vao dashboard.
          </p>

          <form className="mt-6 space-y-4">
            <label className="block space-y-2 text-sm font-medium">
              <span>Email</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none transition focus:border-blue-400"
                defaultValue="admin@myshop.vn"
                type="email"
              />
            </label>
            <label className="block space-y-2 text-sm font-medium">
              <span>Mat khau</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none transition focus:border-blue-400"
                defaultValue="********"
                type="password"
              />
            </label>
          </form>

          <Link
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 font-semibold text-white transition hover:brightness-110"
            href="/dashboard"
          >
            Vao dashboard
          </Link>

          <div className="mt-4 panel-muted text-sm text-slate-600">
            Tai khoan demo: `admin@myshop.vn` / `123456`.
          </div>
        </article>
      </section>
    </main>
  );
}
