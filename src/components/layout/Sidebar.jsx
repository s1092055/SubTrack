import { NAV_ITEMS, NAV_ICONS } from "../../constants/navConfig";

function SidebarContent({ currentPage, onNavigate, currency, onCurrencyChange, userName, onLogout }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-5 py-6">
        <h1 className="font-extrabold text-slate-900 text-base tracking-widest">SUBTRACK</h1>
        <p className="text-[10px] font-medium tracking-wide uppercase text-slate-400 mt-0.5">訂閱管理</p>
      </div>

      <nav className="flex-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors text-left ${
                isActive ? "bg-[#1d3557] text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className={isActive ? "text-white" : "text-slate-400"}>
                {NAV_ICONS[item.id]}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 pb-3">
        <div className="flex bg-slate-100 rounded-xl p-0.5">
          {["TWD", "USD"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCurrencyChange(c)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currency === c ? "bg-[#1d3557] text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-[#1d3557] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-slate-700 truncate">{userName || "使用者"}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
        >
          登出
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ currentPage, onNavigate, isOpen, onClose, currency, onCurrencyChange, userName, onLogout }) {
  const handleNavigateMobile = (id) => { onNavigate(id); onClose(); };

  const overlayClass = `fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`;

  return (
    <>
      <div className="hidden lg:block">
        <div className={overlayClass} onClick={onClose} />
        <div
          className={`fixed inset-y-0 right-0 z-50 w-56 transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ boxShadow: "-4px 0 24px oklch(0% 0 0 / 0.12)" }}
        >
          <SidebarContent
            currentPage={currentPage}
            onNavigate={(id) => { onNavigate(id); onClose(); }}
            currency={currency}
            onCurrencyChange={onCurrencyChange}
            userName={userName}
            onLogout={onLogout}
          />
        </div>
      </div>

      <div className="lg:hidden">
        <div className={overlayClass} onClick={onClose} />
        <div
          className={`fixed inset-y-0 left-0 z-50 w-52 transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ boxShadow: "4px 0 16px oklch(0% 0 0 / 0.08)" }}
        >
          <SidebarContent
            currentPage={currentPage}
            onNavigate={handleNavigateMobile}
            currency={currency}
            onCurrencyChange={onCurrencyChange}
            userName={userName}
            onLogout={onLogout}
          />
        </div>
      </div>
    </>
  );
}
