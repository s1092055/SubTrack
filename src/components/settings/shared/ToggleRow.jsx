import Toggle from "@/components/ui/Toggle";

export function ToggleRow({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[var(--color-border)] last:border-0">
      <div className="mr-4">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}
