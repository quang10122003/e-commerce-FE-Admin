import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  CreditCard,
  LayoutDashboard,
  MessageSquareText,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Tong quan", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Boxes },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/chat", label: "Chat", icon: MessageSquareText },
];

export function resolvePageTitle(pathname: string) {
  const target = navItems.find((item) => item.href === pathname);
  return target?.label ?? "Dashboard";
}

export function isRouteActive(pathname: string, href: string) {
  // Dashboard la route goc nen can so khop tuyet doi, route con thi cho phep route detail.
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
