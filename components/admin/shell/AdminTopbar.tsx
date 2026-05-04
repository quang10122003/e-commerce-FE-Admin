"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BellRing, ChevronDown } from "lucide-react";
import { useLogoutMutation } from "@/client/api/backend-api";
import { AdminAccountMenu } from "./AdminAccountMenu";
import { resolvePageTitle } from "./nav-items";

export function AdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [logout] = useLogoutMutation();
  const [accountMenuPath, setAccountMenuPath] = useState<string | null>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const pageTitle = useMemo(() => resolvePageTitle(pathname), [pathname]);
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

  const closeAccountMenu = () => {
    setAccountMenuPath(null);
  };

  const handleAccountInfoClick = () => {
    // TODO: Add account info logic here.
    closeAccountMenu();
  };

  const handleSettingsClick = () => {
    // TODO: Add settings logic here.
    closeAccountMenu();
  };

  const handleLogoutClick = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Best-effort logout.
    }

    closeAccountMenu();
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className="panel sticky top-4 z-10 mb-5 flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Ecommerce Admin</p>
        <h1 className="text-lg font-bold text-slate-900">{pageTitle}</h1>
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
            onClick={() => setAccountMenuPath((prev) => (prev === pathname ? null : pathname))}
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
            <AdminAccountMenu
              onAccountInfoClick={handleAccountInfoClick}
              onSettingsClick={handleSettingsClick}
              onLogoutClick={handleLogoutClick}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
