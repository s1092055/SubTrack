import { useState, useRef, useEffect } from "react";

// variant: "gray" (default, for modals) | "white" (for forms with border)
export default function CustomDropdown({ value, onChange, options, className = "", variant = "gray", footerAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const selected = normalized.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full rounded-xl px-4 text-sm text-slate-700 focus:outline-none transition-colors flex items-center justify-between ${
          variant === "white"
            ? "bg-white border border-slate-200 py-2.5"
            : "bg-slate-100 border-0 py-3"
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
        {selected?.color && (
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selected.color }} />
        )}
        <span className="truncate">{selected?.label ?? value}</span>
      </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden flex flex-col">
          <div className="overflow-y-auto max-h-[120px] no-scrollbar">
            {normalized.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                  value === o.value
                    ? "bg-[#1d3557] text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {o.color && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: value === o.value ? "rgba(255,255,255,0.7)" : o.color }}
                  />
                )}
                {o.label}
              </button>
            ))}
          </div>
          {footerAction && (
            <>
              <div className="border-t border-slate-100" />
              <button
                type="button"
                onClick={() => { footerAction.onClick(); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#1d3557] font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                  <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                </svg>
                {footerAction.label}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
