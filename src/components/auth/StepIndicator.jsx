export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2 mb-8 max-w-xs mx-auto">
      {[1, 2, 3].map((step, i) => {
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              done ? "bg-slate-300 text-slate-500" : active ? "bg-[var(--color-primary)] text-white" : "bg-slate-100 text-slate-400"
            }`}>
              {done ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="text-xs font-bold">{step}</span>
              )}
            </div>
            {i < 2 && <div className={`flex-1 h-px transition-colors ${done ? "bg-[var(--color-primary)]" : "bg-slate-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}
