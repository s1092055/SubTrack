export default function SubSummaryCard({ label, value, description, icon }) {
  return (
    <section className="rounded-card border border-subtrack-line bg-subtrack-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-subtrack-muted">{label}</p>
          <p className="mt-4 text-3xl font-bold text-subtrack-text tabular-nums">{value}</p>
          <p className="mt-3 text-sm text-subtrack-muted">{description}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-subtrack-primary-soft text-[var(--subtrack-primary-strong)]">
          {icon}
        </div>
      </div>
    </section>
  );
}
