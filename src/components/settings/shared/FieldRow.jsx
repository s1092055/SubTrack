export function FieldRow({ label, value, onEdit }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[var(--color-border)] last:border-0">
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value || "未設定"}</p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-semibold text-[var(--color-primary-strong)] underline underline-offset-2 hover:opacity-70 transition-opacity flex-shrink-0"
        >
          編輯
        </button>
      )}
    </div>
  );
}
