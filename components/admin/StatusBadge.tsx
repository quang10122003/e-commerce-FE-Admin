import type { ReactNode } from "react";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: Tone;
};

const toneStyles: Record<Tone, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-slate-100 text-slate-700",
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (

    <span className={`chip ${toneStyles[tone]}`}>
      {children}
    </span>
  );
}
