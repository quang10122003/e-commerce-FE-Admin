"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isRouteActive, navItems } from "./nav-items";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">MyShop</p>
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
