import { NAV_ITEMS } from "../../constants/navConfig";

const HamburgerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
    <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
    <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
  </svg>
);

export default function TopBar({ currentPage, onMenuToggle }) {
  const currentTitle = NAV_ITEMS.find((i) => i.id === currentPage)?.label ?? "";

  return (
    <div
      className="bg-white flex-shrink-0"
      style={{ boxShadow: "0 1px 12px oklch(0% 0 0 / 0.08)" }}
    >
      <div className="hidden lg:flex items-center justify-between px-6 h-14">
        <h1 className="font-extrabold text-slate-900 text-sm tracking-widest leading-none">
          SUBTRACK
        </h1>
        <button
          onClick={onMenuToggle}
          aria-label="開啟選單"
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <HamburgerIcon />
        </button>
      </div>

      <div className="lg:hidden flex items-center px-4 h-14 gap-3">
        <button
          onClick={onMenuToggle}
          aria-label="開啟選單"
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <HamburgerIcon />
        </button>
        <h2 key={currentPage} className="text-base font-semibold text-slate-800 page-enter">{currentTitle}</h2>
      </div>
    </div>
  );
}
