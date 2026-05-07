import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/constants/navConfig";
import logo from "@/assets/logo_v1.png";

function OutlineIcon({ type, className = "w-4 h-4" }) {
  if (type === "analysis") {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <path d="M5 19V9M12 19V5M19 19v-7" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "subscriptions") {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <rect x="4" y="5" width="16" height="14" rx="3" />
        <path d="M8 10h8M8 14h6" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "category") {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <rect x="5" y="6" width="14" height="12" rx="3" />
        <path d="M9 10h.01M12 10h3M9 14h6" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "add") {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "settings") {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.04.04a2 2 0 0 1-2.82 2.82l-.04-.04a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.34a1.7 1.7 0 0 0-1.86.34l-.04.04a2 2 0 0 1-2.82-2.82l.04-.04A1.7 1.7 0 0 0 4.66 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.66 9a1.7 1.7 0 0 0-.34-1.86l-.04-.04A2 2 0 0 1 7.1 4.28l.04.04A1.7 1.7 0 0 0 9 4.66a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 0 1 4 0v.1A1.7 1.7 0 0 0 15.06 4.66a1.7 1.7 0 0 0 1.86-.34l.04-.04a2 2 0 0 1 2.82 2.82l-.04.04A1.7 1.7 0 0 0 19.4 9c.17.55.68.97 1.26.97H21a2 2 0 0 1 0 4h-.34A1.7 1.7 0 0 0 19.4 15Z" />
      </svg>
    );
  }
  if (type === "user") {
    return (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open, isExpanded }) {
  return (
    <svg
      className={`h-4 shrink-0 transition-all duration-200 ${
        open ? "rotate-180" : ""
      } ${isExpanded ? "w-4 opacity-100" : "w-0 opacity-0"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SidebarLabel({ children, isExpanded, className = "" }) {
  return (
    <span
      className={`min-w-0 overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
        isExpanded ? "opacity-100" : "pointer-events-none w-0 max-w-0 opacity-0"
      } ${className}`}
    >
      {children}
    </span>
  );
}

function itemClass({ active, isExpanded, compact = false }) {
  return `group flex w-full items-center rounded-2xl text-sm transition-colors ${
    isExpanded ? "gap-3 px-3.5 py-3 text-left" : "justify-center px-0 py-3.5"
  } ${compact ? "mb-1" : "mb-1.5"} ${
    active
      ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]"
      : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)]/70 hover:text-[var(--color-primary-strong)]"
  }`;
}

function SidebarItem({ to, end = false, iconType, label, isExpanded, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => itemClass({ active: isActive, isExpanded })}
      title={!isExpanded ? label : undefined}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        <OutlineIcon type={iconType} className="h-4.5 w-4.5" />
      </span>
      <SidebarLabel isExpanded={isExpanded} className={isExpanded ? "flex-1" : ""}>
        {label}
      </SidebarLabel>
    </NavLink>
  );
}

function BrandBlock({ isExpanded }) {
  return (
    <div className={`flex min-h-24 items-center px-4 ${isExpanded ? "gap-3" : "justify-center"}`}>
      <img src={logo} alt="SubTrack" className="h-8 w-8 shrink-0 object-contain" />
      <SidebarLabel isExpanded={isExpanded}>
        <span className="block text-base font-bold leading-none text-[var(--color-text-primary)]">SubTrack</span>
        <span className="mt-1 block text-[10px] font-medium tracking-wide text-[var(--color-text-muted)]">
          訂閱決策助手
        </span>
      </SidebarLabel>
    </div>
  );
}

function AccountMenu({ isExpanded, userName, onLogout, onItemClick, userMenuOpen, setUserMenuOpen }) {
  return (
    <div className="relative">
      {userMenuOpen && (
        <div
          className={`absolute bottom-full mb-3 rounded-2xl border border-[var(--color-border)] bg-white p-2 shadow-card ${
            isExpanded ? "left-0 right-0" : "left-0 w-52"
          }`}
        >
          <NavLink
            to="/settings"
            onClick={() => {
              setUserMenuOpen(false);
              onItemClick();
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
          >
            <OutlineIcon type="user" />
            個人資料
          </NavLink>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
          >
            <OutlineIcon type="logout" />
            登出
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setUserMenuOpen((open) => !open)}
        aria-label="帳戶選單"
        aria-expanded={userMenuOpen}
        className={`flex w-full items-center rounded-2xl py-3 text-left transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)] ${
          userMenuOpen ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]" : "text-[var(--color-text-muted)]"
        } ${isExpanded ? "gap-2.5 px-3" : "justify-center px-0"
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-sm font-semibold text-[var(--color-primary-strong)]">
          {(userName || "U").charAt(0).toUpperCase()}
        </span>
        <SidebarLabel isExpanded={isExpanded} className={isExpanded ? "flex-1" : ""}>
          <span className="block truncate text-xs font-semibold text-[var(--color-text-primary)]">{userName || "使用者"}</span>
          <span className="block truncate text-[11px] text-[var(--color-text-muted)]">帳戶選單</span>
        </SidebarLabel>
        <ChevronIcon open={userMenuOpen} isExpanded={isExpanded} />
      </button>
    </div>
  );
}

function SidebarContent({
  onItemClick,
  userName,
  onLogout,
  onOpenAdd,
  isExpanded = true,
  onDropdownStateChange = () => {},
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const overviewItem = NAV_ITEMS.find((item) => item.id === "overview");
  const subscriptionsItem = NAV_ITEMS.find((item) => item.id === "list");
  const settingsItem = NAV_ITEMS.find((item) => item.id === "settings");

  useEffect(() => {
    onDropdownStateChange(userMenuOpen);
  }, [onDropdownStateChange, userMenuOpen]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[var(--color-panel)] text-[var(--color-text-primary)]">
      <BrandBlock isExpanded={isExpanded} />

      <nav className={`flex flex-1 flex-col justify-center no-scrollbar ${isExpanded ? "px-4" : "px-3"}`}>
        <div className="space-y-1.5">
          {subscriptionsItem && (
            <SidebarItem
              to={subscriptionsItem.path}
              end
              iconType="subscriptions"
              label={subscriptionsItem.label}
              isExpanded={isExpanded}
              onClick={onItemClick}
            />
          )}

          {overviewItem && (
            <SidebarItem
              to={overviewItem.path}
              end
              iconType="analysis"
              label={overviewItem.label}
              isExpanded={isExpanded}
              onClick={onItemClick}
            />
          )}

          <button
            type="button"
            onClick={() => {
              onOpenAdd();
              onItemClick();
            }}
            className={`group flex w-full items-center rounded-2xl text-sm font-semibold transition-colors ${
              isExpanded
                ? "gap-3 px-3.5 py-3 text-left text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
                : "justify-center px-0 py-3.5 text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-strong)]"
            }`}
            title={!isExpanded ? "新增訂閱" : undefined}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center">
              <OutlineIcon type="add" className="h-5 w-5" />
            </span>
            <SidebarLabel isExpanded={isExpanded}>新增訂閱</SidebarLabel>
          </button>
        </div>
      </nav>

      <div className={`space-y-1.5 pb-4 ${isExpanded ? "px-4" : "px-3"}`}>
        {settingsItem && (
          <SidebarItem
            to={settingsItem.path}
            end
            iconType="settings"
            label={settingsItem.label}
            isExpanded={isExpanded}
            onClick={onItemClick}
          />
        )}

        <AccountMenu
          isExpanded={isExpanded}
          userName={userName}
          onLogout={onLogout}
          onItemClick={onItemClick}
          userMenuOpen={userMenuOpen}
          setUserMenuOpen={setUserMenuOpen}
        />
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose, userName, onLogout, onOpenAdd }) {
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
  const [hasOpenDropdown, setHasOpenDropdown] = useState(false);
  const [closeToken, setCloseToken] = useState(0);
  const desktopSidebarRef = useRef(null);
  const isDesktopHoveredRef = useRef(false);
  const overlayClass = `fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`;

  const closeDesktopSidebar = useCallback(() => {
    isDesktopHoveredRef.current = false;
    setIsDesktopExpanded(false);
    setHasOpenDropdown(false);
    setCloseToken((token) => token + 1);
  }, []);

  const handleDropdownStateChange = useCallback((open) => {
    setHasOpenDropdown(open);
    if (!open && !isDesktopHoveredRef.current) {
      setIsDesktopExpanded(false);
    }
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (!isDesktop || (!isDesktopExpanded && !hasOpenDropdown)) return;
      if (desktopSidebarRef.current?.contains(event.target)) return;

      closeDesktopSidebar();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeDesktopSidebar, hasOpenDropdown, isDesktopExpanded]);

  return (
    <>
      <aside
        ref={desktopSidebarRef}
        className="fixed inset-y-0 left-0 z-40 hidden border-r border-[var(--color-border)] bg-[var(--color-panel)] shadow-card transition-[width] duration-300 ease-out lg:block"
        style={{ width: isDesktopExpanded ? "var(--sidebar-width-expanded)" : "var(--sidebar-width-collapsed)" }}
        onMouseEnter={() => {
          isDesktopHoveredRef.current = true;
          setIsDesktopExpanded(true);
        }}
        onMouseLeave={() => {
          isDesktopHoveredRef.current = false;
          if (!hasOpenDropdown) {
            setIsDesktopExpanded(false);
          }
        }}
      >
        <SidebarContent
          key={`desktop-${closeToken}`}
          onItemClick={() => {}}
          userName={userName}
          onLogout={onLogout}
          onOpenAdd={onOpenAdd}
          isExpanded={isDesktopExpanded}
          onDropdownStateChange={handleDropdownStateChange}
        />
      </aside>

      <div
        className={`lg:hidden ${overlayClass}`}
        onClick={() => {
          setCloseToken((token) => token + 1);
          onClose();
        }}
      />
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ boxShadow: "var(--shadow-sidebar)" }}
      >
        <SidebarContent
          key={`mobile-${closeToken}`}
          onItemClick={onClose}
          userName={userName}
          onLogout={onLogout}
          onOpenAdd={onOpenAdd}
          isExpanded
        />
      </div>
    </>
  );
}
