import { NavLink } from "react-router-dom";

function TabIcon({ type }) {
  if (type === "overview") {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13h6V4H4v9ZM14 20h6V4h-6v16ZM4 20h6v-3H4v3Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "subs") {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="3" />
        <path d="M8 10h8M8 14h5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "analysis") {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19V9M12 19V5M19 19v-7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.04.04a2 2 0 0 1-2.82 2.82l-.04-.04a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.34a1.7 1.7 0 0 0-1.86.34l-.04.04a2 2 0 0 1-2.82-2.82l.04-.04A1.7 1.7 0 0 0 4.66 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.66 9a1.7 1.7 0 0 0-.34-1.86l-.04-.04A2 2 0 0 1 7.1 4.28l.04.04A1.7 1.7 0 0 0 9 4.66a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 0 1 4 0v.1A1.7 1.7 0 0 0 15.06 4.66a1.7 1.7 0 0 0 1.86-.34l.04-.04a2 2 0 0 1 2.82 2.82l-.04.04A1.7 1.7 0 0 0 19.4 9c.17.55.68.97 1.26.97H21a2 2 0 0 1 0 4h-.34A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

function TabLink({ to, label, type }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
          isActive ? "text-[var(--color-primary)]" : "text-slate-400"
        }`
      }
    >
      <TabIcon type={type} />
      {label}
    </NavLink>
  );
}

export default function MobileTabBar({ onOpenAdd }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex h-16 max-w-md items-center px-4">
        <TabLink to="/subscriptions" label="訂閱" type="subs" />
        <TabLink to="/overview" label="分析" type="analysis" />
        <button
          type="button"
          onClick={onOpenAdd}
          aria-label="新增訂閱"
          className="-mt-5 mx-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[0_10px_24px_rgba(111,143,114,0.4)] active:scale-95 transition-transform"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
        <TabLink to="/settings" label="設定" type="settings" />
      </div>
    </div>
  );
}
