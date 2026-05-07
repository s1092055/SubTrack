import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]",
        secondary:   "bg-[var(--color-panel)] text-[var(--color-text-muted)]",
        destructive: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
        warning:     "bg-[var(--color-warning-soft)] text-[#8a6331]",
        outline:     "border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)]",
        navy:        "bg-[var(--color-text-secondary)]/10 text-[var(--color-text-secondary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Badge({ className, variant, ...props }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}
