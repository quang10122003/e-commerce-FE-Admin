"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  Boxes,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Package,
  Settings,
  ShoppingBag,
  UserRound,
  Users,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Tong quan", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/categories", label: "Categories", icon: Boxes },
  { href: "/products", label: "Products", icon: Package },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/chat", label: "Chat", icon: MessageSquareText },
];

function toTitle(pathname: string) {
  const target = navItems.find((item) => item.href === pathname);
  return target?.label ?? "Dashboard";
}

function isRouteActive(pathname: string, href: string) {
  // Dashboard la route goc nen can so khop tuyet doi, route con thi cho phep route detail.
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({
  pathname,
}: {
  pathname: string;
}) {
  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
          MyShop
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Admin Panel</h2>
      </div>

      <nav className="mt-7 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(pathname, item.href);

          return (
            <Link
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              href={item.href}
              key={item.href}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [accountMenuPath, setAccountMenuPath] = useState<string | null>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const pageTitle = useMemo(() => toTitle(pathname), [pathname]);
  const accountMenuOpen = useMemo(
    () => accountMenuPath === pathname,
    [accountMenuPath, pathname],
  );
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuPath(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountMenuPath(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full min-w-245 max-w-420 gap-5 px-6 py-4">
        <aside className="panel sticky top-4 flex h-[calc(100vh-2rem)] w-72 shrink-0 flex-col">
          <SidebarContent pathname={pathname} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="panel sticky top-4 z-10 mb-5 flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  Ecommerce Admin
                </p>
                <h1 className="text-lg font-bold text-slate-900">{pageTitle}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="relative inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
                type="button"
              >
                <BellRing className="size-4" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
              </button>

              <div className="relative" ref={accountMenuRef}>
                <button
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left"
                  onClick={() =>
                    setAccountMenuPath((prev) => (prev === pathname ? null : pathname))
                  }
                  type="button"
                >
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">Admin MyShop</p>
                    <p className="text-xs text-slate-500">admin@myshop.vn</p>
                  </div>
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    AD
                  </span>
                  <ChevronDown
                    className={`size-4 text-slate-500 transition ${accountMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {accountMenuOpen ? (
                  <div
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                    role="menu"
                  >
                    <button
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setAccountMenuPath(null)}
                      role="menuitem"
                      type="button"
                    >
                      <UserRound className="size-4" />
                      Thong tin tai khoan
                    </button>
                    <button
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setAccountMenuPath(null)}
                      role="menuitem"
                      type="button"
                    >
                      <Settings className="size-4" />
                      Cai dat
                    </button>
                    <button
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
                      onClick={() => setAccountMenuPath(null)}
                      role="menuitem"
                      type="button"
                    >
                      <LogOut className="size-4" />
                      Dang xuat
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <main className="pb-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
