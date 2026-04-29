import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  note: string;
  icon: ReactNode;
  tone?: "blue" | "amber" | "emerald" | "violet";
};

const toneMap: Record<NonNullable<StatCardProps["tone"]>, string> = {
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
  violet: "bg-violet-50 text-violet-700",
};

export function StatCard({
  title,
  value,
  note,
  icon,
  tone = "blue",
}: StatCardProps) {
  return (
    <article className="panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-2 ${toneMap[tone]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-sm text-slate-600">{note}</p>
    </article>
  );
}
