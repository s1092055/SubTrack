export function SectionBlock({ title, children }) {
  return (
    <div
      className="px-6 py-2"
      style={{
        backgroundColor: "var(--color-card)",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {title && (
        <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 pt-5 pb-1">
          {title}
        </p>
      )}
      {children}
      <div className="h-2" />
    </div>
  );
}
