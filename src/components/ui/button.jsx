import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:     "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]",
        secondary:   "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)] hover:bg-[var(--color-primary-soft)]/80",
        outline:     "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-panel)] hover:text-[var(--color-primary-strong)]",
        ghost:       "text-[var(--color-text-muted)] hover:bg-[var(--color-panel)] hover:text-[var(--color-text-primary)]",
        destructive: "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90",
        navy:        "bg-[var(--color-text-secondary)] text-white hover:bg-[var(--color-text-secondary-strong)]",
        link:        "text-[var(--color-primary)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-5 py-2 rounded-[var(--radius-lg)]",
        sm:      "h-8 px-3 text-xs rounded-[var(--radius-md)]",
        lg:      "h-12 px-6 text-base rounded-[var(--radius-lg)]",
        icon:    "h-9 w-9 rounded-[var(--radius-pill)]",
        "icon-sm": "h-7 w-7 rounded-[var(--radius-pill)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
