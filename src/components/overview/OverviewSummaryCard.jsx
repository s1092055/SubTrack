const CARD_BASE =
  "rounded-card border border-subtrack-line bg-subtrack-card shadow-[0_6px_20px_rgba(0,0,0,0.04)]";

function cardClass(extra = "") {
  return `${CARD_BASE} ${extra}`;
}

export default function OverviewSummaryCard({
  title,
  value,
  note,
  icon,
  tone = "green",
}) {
  const IconComponent = icon;

  const toneClass =
    tone === "warning"
      ? "bg-subtrack-alert-soft text-[#8a6331]"
      : tone === "danger"
        ? "bg-[#f6dddd] text-[#b94944]"
        : "bg-subtrack-primary-soft text-[var(--subtrack-primary-strong)]";

  return (
    <section
      className={cardClass(
        "grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-4 p-6 sm:p-7"
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-subtrack-muted">{title}</p>
        <p className="mt-4 max-w-full truncate text-[clamp(1.75rem,3vw,2rem)] font-semibold tracking-tight text-subtrack-text tabular-nums">
          {value}
        </p>
        <p className="mt-4 text-sm text-subtrack-muted">{note}</p>
      </div>

      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14 2xl:h-16 2xl:w-16 ${toneClass}`}
      >
        <IconComponent size={22} strokeWidth={1.8} />
      </span>
    </section>
  );
}