import type { LucideIcon } from "lucide-react";
import { LogOut, Settings, UserRound } from "lucide-react";

type AccountMenuProps = {
  onAccountInfoClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
};

type MenuItem = {
  key: "account-info" | "settings" | "logout";
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  tone?: "default" | "danger";
};

export function AdminAccountMenu({
  onAccountInfoClick,
  onSettingsClick,
  onLogoutClick,
}: AccountMenuProps) {
  const handleAccountInfoClick = () => {
    onAccountInfoClick();
  };

  const handleSettingsClick = () => {
    onSettingsClick();
  };

  const handleLogoutClick = () => {
    onLogoutClick();
  };

  const menuItems: MenuItem[] = [
    {
      key: "account-info",
      label: "Thong tin tai khoan",
      icon: UserRound,
      onClick: handleAccountInfoClick,
    },
    { key: "settings", label: "Cai dat", icon: Settings, onClick: handleSettingsClick },
    {
      key: "logout",
      label: "Dang xuat",
      icon: LogOut,
      onClick: handleLogoutClick,
      tone: "danger",
    },
  ];

  return (
    <div
      className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
      role="menu"
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        const className =
          item.tone === "danger"
            ? "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
            : "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100";

        return (
          <button className={className} key={item.key} onClick={item.onClick} role="menuitem" type="button">
            <Icon className="size-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
