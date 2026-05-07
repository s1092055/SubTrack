import { getAvatarColor } from "@/constants/brandColors";
import { getCategoryColor } from "@/constants/categories";
import {
  calcMonthlyPersonal,
  getDaysUntil,
  formatAmount as fmt,
  isLikelyWasted,
  getWasteReason,
} from "@/utils/sub";
import { getContrastTextColor } from "@/utils/format";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MEMBER_COLORS = ["#e07b54", "#6366f1", "#0ea5e9", "#10b981", "#f59e0b"];

export default function SubDetailModal({
  sub,
  currency,
  exchangeRate,
  onEdit,
  onDelete,
  onClose,
  onUpdateUsage,
  onMarkPaid,
}) {
  const daysLeft = getDaysUntil(sub.nextBillingDate);
  const formatAmount = (twd) => fmt(twd, currency, exchangeRate);
  const wasted = isLikelyWasted(sub);
  const today = new Date().toISOString().slice(0, 10);
  const dateFormatted = new Date(sub.nextBillingDate).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const catColor = getCategoryColor(sub.category);
  const avatarColor = sub.avatarColor || getAvatarColor(sub.name);
  const billingStatusText =
    daysLeft < 0 ? "已扣款" : daysLeft === 0 ? "今日扣款" : `剩餘 ${daysLeft} 天`;
  const billingStatusClass =
    daysLeft <= 7 && daysLeft >= 0 ? "text-xs text-red-500 font-medium mt-0.5" : "text-xs text-slate-400 mt-0.5";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        size="md"
        showClose={false}
        title={`${sub.name} 訂閱詳情`}
        description="查看此訂閱的費用、扣款日期、分類、分帳與使用狀態。"
      >
        <div
          className="w-full flex flex-col overflow-hidden"
          style={{ maxHeight: "var(--modal-max-height)" }}
        >
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--color-border)] flex-shrink-0">
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">訂閱詳情</p>
            <button
              onClick={onClose}
              aria-label="關閉"
              className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 min-h-0">
            <div className="
              flex flex-row items-center gap-4 p-5 flex-shrink-0
              bg-[var(--color-panel)] border-b border-[var(--color-border)]
              lg:w-56 lg:flex-shrink-0 lg:flex-col lg:items-center lg:justify-center
              lg:py-10 lg:px-6 lg:border-b-0 lg:border-r lg:border-[var(--color-border)]
            ">
              <div
                className="w-14 h-14 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-white text-2xl lg:text-3xl font-bold flex-shrink-0 lg:mb-4"
                style={{ backgroundColor: avatarColor }}
              >
                {sub.name.charAt(0).toUpperCase()}
              </div>

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
                  <p className="hidden lg:block text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                    {sub.cycle === "yearly" ? "月均費用" : "每月費用"}
                  </p>
                  <p className="text-lg lg:text-2xl font-bold text-slate-900 tabular-nums">
                    {formatAmount(calcMonthlyPersonal(sub))}
                    <span className="text-sm font-normal text-slate-400 ml-1">/ 月</span>
                  </p>
                  {sub.cycle === "yearly" && (
                    <p className="hidden lg:block text-[11px] text-slate-400 mt-1 tabular-nums">
                      實際扣款 {formatAmount(sub.price / sub.sharedWith)} / 年
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex-1 min-h-0 px-6 py-5 space-y-5 overflow-y-auto">

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
                    <p className={billingStatusClass}>{billingStatusText}</p>
                    {sub.lastPaidAt && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        上次付款：{new Date(sub.lastPaidAt).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>

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
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-[var(--color-primary)] flex items-center justify-center text-white text-[9px] font-bold">
                            you
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-slate-800">個人使用</p>
                    )}
                  </div>
                </div>

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
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">備註</p>
                      <p className="text-sm text-slate-700 leading-relaxed break-words max-h-28 overflow-y-auto">{sub.notes}</p>
                    </div>
                  </div>
                ) : null}

                {wasted && onUpdateUsage && (
                  <div className="rounded-xl p-4 bg-amber-50 border border-amber-100">
                    <p className="text-xs font-semibold text-slate-700 mb-1">⚠️ {getWasteReason(sub)}</p>
                    <p className="text-[11px] text-slate-500 mb-3">最近有在使用這個訂閱嗎？</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateUsage(sub.id, "active", today)}
                        className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                      >
                        ✔ 有在用
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateUsage(sub.id, "unused", today)}
                        className="flex-1 py-2 rounded-lg border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors"
                      >
                        ✕ 沒在用
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 px-6 pb-6 pt-4 flex flex-col gap-2 border-t border-[var(--color-border)]">
                {onMarkPaid && (
                  <Button variant="default" className="w-full" onClick={onMarkPaid}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    標註已付款
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <Button variant={onMarkPaid ? "outline" : "default"} className="flex-1" onClick={onEdit}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    編輯
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                    onClick={onDelete}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" />
                      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
                    </svg>
                    刪除
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
