import { useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/navConfig";
import logo from "../../assets/logo_v1.png";

const HamburgerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
    <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
    <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
  </svg>
);

export default function TopBar({
  onMenuToggle,
  onOpenSearch,
}) {
  const { pathname } = useLocation();
  const isSubscriptions = pathname === "/subscriptions";

  return (
    <div
      className="bg-white flex-shrink-0 lg:pl-64"
      style={{ boxShadow: "0 1px 12px oklch(0% 0 0 / 0.08)" }}
    >
      <div className="relative flex items-center justify-between px-4 lg:px-6 h-14">
        <div className="hidden lg:flex items-center gap-2">
          <img src={logo} alt="SubTrack" className="w-9 h-9 object-contain flex-shrink-0" />
          <h1 className="font-extrabold text-slate-900 text-sm tracking-widest leading-none">SUBTRACK</h1>
        </div>

        {/* Mobile: centered logo + SUBTRACK */}
        <div key={pathname} className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none page-enter">
          <img src={logo} alt="SubTrack" className="w-8 h-8 object-contain flex-shrink-0" />
          <span className="font-extrabold text-slate-900 text-sm tracking-widest leading-none">SUBTRACK</span>
        </div>

        {/* Left placeholder to keep buttons on the right */}
        <div className="lg:hidden" />

        <div className="flex items-center gap-2">
        {isSubscriptions && (
            <button
              type="button"
              aria-label="搜尋訂閱"
              onClick={onOpenSearch}
              className="lg:hidden p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <button
            onClick={onMenuToggle}
            aria-label="開啟選單"
            className="hidden lg:flex p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <HamburgerIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
