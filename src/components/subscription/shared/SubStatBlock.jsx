export default function SubStatBlock({ icon, label, children, subText }) {
  return (
    <div className="grid min-h-[128px] grid-rows-[auto_auto_1fr] justify-items-center rounded-card border border-subtrack-line bg-subtrack-surface/70 p-4 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-subtrack-primary-soft text-[var(--subtrack-primary-strong)]">
        {icon}
      </div>
      <p className="mt-3 text-[clamp(0.78rem,0.9vw,0.86rem)] font-semibold text-subtrack-muted">{label}</p>
      <div className="mt-3 flex min-w-0 flex-col items-center justify-start">
        <div className="max-w-full text-[clamp(0.95rem,1.25vw,1.08rem)] font-semibold leading-tight text-subtrack-text">
          {children}
        </div>
        {subText && (
          <p className="mt-1.5 max-w-full truncate text-[clamp(0.75rem,0.9vw,0.84rem)] font-medium text-[var(--subtrack-primary-strong)]">
            {subText}
          </p>
        )}
      </div>
    </div>
  );
}
