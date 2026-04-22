import { getAvatarColor } from "../../constants/brandColors";
import { getCategoryColor } from "../../constants/categories";
import { getDaysUntil, formatAmount as fmt } from "../../utils/subscription";
import { useScrollLock } from "../../hooks/useScrollLock";
import { getContrastTextColor } from "../../utils/format";

const MEMBER_COLORS = ["#e07b54", "#6366f1", "#0ea5e9", "#10b981", "#f59e0b"];

export default function SubscriptionDetailModal({
  sub,
  currency,
  exchangeRate,
  onEdit,
  onDelete,
  onClose,
}) {
  useScrollLock();
  const daysLeft = getDaysUntil(sub.nextBillingDate);
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;

  const formatAmount = (twd) => fmt(twd, currency, exchangeRate);

  const dateFormatted = new Date(sub.nextBillingDate).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const catColor = getCategoryColor(sub.category);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden modal-enter"
        style={{ boxShadow: "0 24px 64px oklch(0% 0 0 / 0.18)" }}
      >
        {/* 標題列 */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <p className="text-sm font-semibold text-[#1d3557]">訂閱詳情</p>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 手機版：上下排列；桌機版：左右並排 */}
        <div className="flex flex-col lg:flex-row">

          {/* ── 上方（手機）/ 左側（桌機）：服務資訊 ── */}
          <div className="
            flex flex-row items-center gap-4 p-5
            bg-slate-50 border-b border-slate-100
            lg:w-56 lg:flex-shrink-0 lg:flex-col lg:items-center lg:justify-center
            lg:py-10 lg:px-6 lg:border-b-0 lg:border-r lg:border-slate-100
          ">
            {/* 圖示 */}
            <div
              className="w-14 h-14 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-white text-2xl lg:text-3xl font-bold flex-shrink-0 lg:mb-4"
              style={{ backgroundColor: getAvatarColor(sub.name) }}
            >
              {sub.name.charAt(0).toUpperCase()}
            </div>

            {/* 名稱 + badge + 費用 */}
            <div className="min-w-0 lg:text-center">
              <p className="font-bold text-slate-900 text-base lg:text-lg leading-tight mb-1 lg:mb-2 truncate">
                {sub.name}
              </p>
              <span
                className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: catColor, color: getContrastTextColor(catColor) }}
              >
                {sub.category}
              </span>
              <div className="mt-2 lg:mt-5">
                <p className="hidden lg:block text-[10px] text-slate-400 uppercase tracking-widest mb-1">總費用</p>
                <p className="text-lg lg:text-2xl font-bold text-slate-900 tabular-nums">
                  {formatAmount(sub.price)}
                </p>
              </div>
            </div>
          </div>

          {/* ── 下方（手機）/ 右側（桌機）：詳細資訊 ── */}
          <div className="flex-1 flex flex-col">
            {/* 詳情內容 */}
            <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">

              {/* 下次扣款日期 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
                    <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">下次扣款日期</p>
                  <p className="text-sm font-semibold text-slate-800">{dateFormatted}</p>
                  {isUrgent && (
                    <p className="text-xs text-red-500 font-medium mt-0.5">剩餘 {daysLeft} 天</p>
                  )}
                  {!isUrgent && daysLeft > 0 && (
                    <p className="text-xs text-slate-400 mt-0.5">剩餘 {daysLeft} 天</p>
                  )}
                  {daysLeft <= 0 && (
                    <p className="text-xs text-slate-400 mt-0.5">已扣款</p>
                  )}
                </div>
              </div>

              {/* 分帳資訊 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">分帳資訊</p>
                  {sub.sharedWith > 1 ? (
                    <>
                      <p className="text-sm font-semibold text-slate-800 mb-2">
                        與 {sub.sharedWith - 1} 位成員共用
                      </p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(sub.sharedWith - 1, 4) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold"
                            style={{ backgroundColor: MEMBER_COLORS[i % MEMBER_COLORS.length] }}
                          />
                        ))}
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-[#1d3557] flex items-center justify-center text-white text-[9px] font-bold">
                          you
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-slate-800">個人使用</p>
                  )}
                </div>
              </div>

              {/* 付款方式 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">付款方式</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {sub.paymentMethod || "未設定"}
                  </p>
                </div>
              </div>

              {/* 備註 */}
              {sub.notes ? (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="8" y1="13" x2="16" y2="13" strokeLinecap="round" />
                      <line x1="8" y1="17" x2="12" y2="17" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">備註</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{sub.notes}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* 操作按鈕 */}
            <div className="px-6 pb-6 pt-2 flex items-center gap-2 border-t border-slate-100">
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1d3557] text-white text-sm font-semibold hover:bg-[#162843] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                編輯
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-2.5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" />
                  <path d="M10 11v6M14 11v6" strokeLinecap="round" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
                </svg>
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
