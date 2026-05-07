import { useState } from "react";

import AccountSection from "@/components/settings/sections/AccountSection";
import CategoriesSection from "@/components/settings/sections/CategoriesSection";
import DisplaySection from "@/components/settings/sections/DisplaySection";
import FinanceSection from "@/components/settings/sections/FinanceSection";
import NotificationsSection from "@/components/settings/sections/NotificationsSection";
import SecuritySection from "@/components/settings/sections/SecuritySection";

const NAV_SECTIONS = [
  {
    id: "account",
    label: "個人資料",
    description: "提供個人資訊，方便我們為您提供個人化的使用體驗",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "finance",
    label: "財務設定",
    description: "設定每月收入與訂閱預算，掌握支出狀況",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20M6 15h2M10 15h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "categories",
    label: "分類管理",
    description: "管理訂閱分類與自訂顏色，讓帳單一目了然",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "通知設定",
    description: "選擇何時以及如何接收訂閱提醒與匯率通知",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "display",
    label: "顯示設定",
    description: "自訂貨幣、預設付款方式與介面語言",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "隱私與安全",
    description: "管理密碼安全以及帳戶資料的刪除",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const SECTION_COMPONENTS = {
  account: AccountSection,
  finance: FinanceSection,
  categories: CategoriesSection,
  notifications: NotificationsSection,
  display: DisplaySection,
  security: SecuritySection,
};

function getActiveMeta(id, authUser, categories) {
  switch (id) {
    case "account": return authUser?.name || authUser?.email || null;
    case "finance": return authUser?.monthlyBudget ? `預算 NT$ ${Number(authUser.monthlyBudget).toLocaleString()}` : null;
    case "categories": return `${categories.length} 個分類`;
    case "display": return null;
    case "security": return null;
    default: return null;
  }
}

export default function Settings({
  currency,
  onCurrencyChange,
  onClearAll,
  onImport,
  showToast,
  authUser,
  onUpdateUser,
  subscriptions = [],
  categories = [],
  onAddCategory,
  onRemoveCategory,
  onRenameCategory,
}) {
  const [activeSection, setActiveSection] = useState(null);

  const ActiveComponent = activeSection ? SECTION_COMPONENTS[activeSection] : null;
  const activeMeta = NAV_SECTIONS.find((s) => s.id === activeSection);

  const sectionProps = {
    account: { authUser, onUpdateUser, showToast },
    finance: { authUser, onUpdateUser, showToast },
    categories: { categories, onAddCategory, onRemoveCategory, onRenameCategory },
    notifications: {},
    display: { currency, onCurrencyChange },
    security: { authUser, onUpdateUser, onClearAll, onImport, subscriptions, showToast },
  };

  return (
    <div className="mx-auto w-full max-w-7xl pb-16 text-subtrack-text">

      {!activeSection && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-subtrack-text">偏好設定</h1>
          <p className="mt-2 text-base text-subtrack-muted">
            {authUser?.name ?? ""} · {authUser?.email ?? ""}
          </p>
        </div>
      )}

      {ActiveComponent ? (
        <div>
          <button
            type="button"
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            偏好設定
          </button>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-subtrack-text">
            {activeMeta?.label}
          </h2>
          <ActiveComponent {...sectionProps[activeSection]} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_SECTIONS.map((section) => {
            const meta = getActiveMeta(section.id, authUser, categories);
            const isComingSoon = section.id === "notifications";
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className="p-6 text-left flex flex-col gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md group"
                style={{
                  backgroundColor: "var(--color-card)",
                  borderRadius: "var(--radius-card)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-slate-100 text-slate-500">
                    {section.icon}
                  </span>
                  {isComingSoon && (
                    <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
                      即將推出
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{section.label}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{section.description}</p>
                  {meta && (
                    <p className="text-xs font-semibold text-slate-500 mt-2">{meta}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <svg
                    className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors"
                    fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"
                  >
                    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
