import { cn } from "@/lib/util/cn";

type LoadingSpinnerSize = "sm" | "md" | "lg";

type LoadingSpinnerProps = {
  className?: string;
  label?: string;
  size?: LoadingSpinnerSize;
};

const sizeClassNames: Record<LoadingSpinnerSize, string> = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-10 border-4",
};

export function LoadingSpinner({
  className,
  label = "Dang tai...",
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div
      aria-label={label}
      aria-live="polite"
      className={cn("inline-flex items-center justify-center", className)}
      role="status"
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block animate-spin rounded-full border-current border-r-transparent text-current",
          sizeClassNames[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
