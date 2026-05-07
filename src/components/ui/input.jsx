import { cn } from "@/lib/utils";

export function Input({ className, type, icon, containerClassName, ...props }) {
  const input = (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm text-[var(--color-text-primary)] shadow-sm transition-colors",
        "placeholder:text-[var(--color-text-muted)]/60",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus:outline-none focus:border-[var(--color-primary)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        icon && "pl-11",
        className
      )}
      {...props}
    />
  );

  if (!icon) return input;

  return (
    <div className={cn("relative", containerClassName)}>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
        {icon}
      </span>
      {input}
    </div>
  );
}
