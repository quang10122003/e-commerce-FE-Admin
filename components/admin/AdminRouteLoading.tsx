import { PageHeader } from "@/components/admin/PageHeader";
import { Loading } from "@/components/ui/Loading";

type AdminRouteLoadingProps = {
  description: string;
  label: string;
  title: string;
};

export function AdminRouteLoading({
  description,
  label,
  title,
}: AdminRouteLoadingProps) {
  return (
    <section>
      <PageHeader description={description} title={title} />

      <article className="panel mt-6 flex min-h-96 flex-col items-center justify-center gap-3 text-blue-600">
        <Loading
          className="flex-col"
          label={label}
          labelClassName="text-slate-600"
          showLabel
          size="lg"
        />
      </article>
    </section>
  );
}
