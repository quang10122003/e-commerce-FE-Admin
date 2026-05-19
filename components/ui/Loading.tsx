import { cn } from "@/lib/util/cn";

type LoadingSize = "sm" | "md" | "lg";

type LoadingProps = {
  className?: string;
  label?: string;
  labelClassName?: string;
  showLabel?: boolean;
  size?: LoadingSize;
  spinnerClassName?: string;
};

const sizeClassNames: Record<LoadingSize, string> = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-10 border-4",
};

export function Loading({
  className,
  label = "Đang tải...",
  labelClassName,
  showLabel = false,
  size = "md",
  spinnerClassName,
}: LoadingProps) {
  return (
    <div
      aria-label={label}
      aria-live="polite"
      className={cn("inline-flex items-center justify-center gap-3", className)}
      role="status"
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block animate-spin rounded-full border-current border-r-transparent text-current",
          sizeClassNames[size],
          spinnerClassName,
        )}
      />
      <span
        className={cn(
          showLabel ? "text-sm font-medium text-slate-600" : "sr-only",
          labelClassName,
        )}
      >
        {label}
      </span>
    </div>
  );
}
