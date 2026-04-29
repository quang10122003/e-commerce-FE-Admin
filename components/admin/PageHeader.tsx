import Link from "next/link";
import { Plus } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function PageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-base text-slate-600">{description}</p>
      </div>

      {actionHref && actionLabel ? (
        <Link className="btn-primary" href={actionHref}>
          <Plus className="size-4" />
          {actionLabel}
        </Link>
      ) : null}
    </header>
  );
}
