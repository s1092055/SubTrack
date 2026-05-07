const TOAST_STYLES = {
  success: "bg-[var(--color-primary)] text-white",
  error: "bg-red-500 text-white",
};

export default function Toast({ toasts }) {
  return (
    <div
      className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-lg pointer-events-auto transition-all duration-300 ${
            TOAST_STYLES[t.type] ?? "bg-slate-700 text-white"
          }`}
        >
          {t.type === "success" && (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {t.type === "error" && (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}
