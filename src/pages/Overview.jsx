import { useState } from "react";
import { CATEGORIES, CATEGORY_NAMES, getCategoryColor } from "../constants/categories";
import { getAvatarColor } from "../constants/brandColors";
import { getToday, calcMonthlyPersonal, formatAmount as fmt, getDaysUntil, formatBillingDate } from "../utils/subscription";
import { billingTotalForMonth, getPast6MonthsData } from "../utils/analytics";
import { getStatusInfo, getDaysTextClass, getContrastTextColor } from "../utils/format";
import SubscriptionDetailModal from "../components/modals/SubscriptionDetailModal";
import SubscriptionEditModal from "../components/modals/SubscriptionEditModal";

const CARD = { border: "1px solid #f1f5f9", boxShadow: "0 1px 4px oklch(0% 0 0 / 0.06)" };
const LABEL_CLS = "text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-400";

export default function Overview({ subscriptions, currency, exchangeRate, onEdit, onDelete, categories = [], onAddCategory, onRemoveCategory }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [detailSub, setDetailSub] = useState(null);
  const [editSub, setEditSub] = useState(null);
  const [tooltipMonth, setTooltipMonth] = useState(null);
  const today = getToday();

  const formatAmount = (twd) => fmt(twd, currency, exchangeRate);

  const monthlyTotal = subscriptions.reduce((acc, sub) => acc + calcMonthlyPersonal(sub), 0);

  const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const thisMonthBilling = billingTotalForMonth(subscriptions, today.getFullYear(), today.getMonth());
  const prevMonthBilling = billingTotalForMonth(subscriptions, prevMonthDate.getFullYear(), prevMonthDate.getMonth());
  const trendDiff = thisMonthBilling - prevMonthBilling;
  const trendPct = prevMonthBilling > 0 ? ((trendDiff / prevMonthBilling) * 100).toFixed(1) : null;

  const categoryTotals = {};
  subscriptions.forEach((sub) => {
    categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + calcMonthlyPersonal(sub);
  });
  const categoryData = CATEGORY_NAMES
    .map((cat) => ({ cat, val: categoryTotals[cat] || 0, pct: monthlyTotal > 0 ? Math.round(((categoryTotals[cat] || 0) / monthlyTotal) * 100) : 0 }))
    .filter((d) => d.val > 0);

  const past6Months = getPast6MonthsData(subscriptions, today);
  const maxBarVal = Math.max(...past6Months.flatMap((m) => Object.values(m.byCat)), 1);

  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);
  const upcomingBills = subscriptions
    .filter((sub) => { const d = new Date(sub.nextBillingDate); return d >= today && d <= in30Days; })
    .sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate));

  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const calendarDays = [...Array(firstOfMonth.getDay()).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const billsByDay = {};
  upcomingBills.forEach((sub) => {
    const d = new Date(sub.nextBillingDate);
    if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
      const day = d.getDate();
      if (!billsByDay[day]) billsByDay[day] = [];
      billsByDay[day].push(sub);
    }
  });

  const activityList = [...subscriptions]
    .sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate))
    .slice(0, 6);

  return (
    <>
      <div className="w-full space-y-5">

        {/* 編輯式頁首：月支出不在卡片內 */}
        <div className="pb-7 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

            <div>
              <p className={`${LABEL_CLS} mb-3`}>
                {today.getFullYear()} 年 {today.getMonth() + 1} 月訂閱支出
              </p>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="text-4xl lg:text-5xl font-bold text-[#1d3557] tracking-tight tabular-nums leading-none">
                  {formatAmount(monthlyTotal)}
                </p>
                {trendPct !== null && (
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                    trendDiff >= 0 ? "text-red-600 bg-red-50" : "text-emerald-700 bg-emerald-50"
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      {trendDiff >= 0
                        ? <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                        : <path d="M7 7L17 17M17 17H7M17 17V7" strokeLinecap="round" strokeLinejoin="round" />
                      }
                    </svg>
                    {Math.abs(trendPct)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                較上月{trendDiff >= 0 ? "增加了" : "節省了"}{" "}
                <span className="font-semibold text-slate-600">{formatAmount(Math.abs(trendDiff))}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {upcomingBills.length > 0 && (
                <div className="flex -space-x-1.5">
                  {upcomingBills.slice(0, 5).map((sub) => (
                    <div
                      key={sub.id}
                      className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                      style={{ backgroundColor: getAvatarColor(sub.name) }}
                      title={sub.name}
                    >
                      {sub.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {upcomingBills.length > 5 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-500 text-[9px] font-bold">
                      +{upcomingBills.length - 5}
                    </div>
                  )}
                </div>
              )}
              <div>
                <p className={`${LABEL_CLS} mb-1`}>30 天內續費</p>
                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">
                  {upcomingBills.length}
                  <span className="text-sm font-medium text-slate-400 ml-1">筆</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 月曆 + 圖表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:items-stretch">

          {/* 帳單月曆 */}
          <div className="bg-white rounded-2xl p-6" style={CARD}>
            <p className={`${LABEL_CLS} mb-5`}>帳單月曆</p>
            <div className="grid grid-cols-7 mb-1">
              {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
                <div key={d} className="text-center text-xs text-slate-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1 mb-4">
              {calendarDays.map((day, i) => {
                const bills = day ? billsByDay[day] : null;
                const isToday = day === today.getDate();
                const isSelected = day !== null && day === selectedDay;
                return (
                  <div key={i} className="flex flex-col items-center py-0.5">
                    <button
                      disabled={!day}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`text-xs w-9 h-9 flex items-center justify-center rounded-full transition-colors
                        ${!day ? "cursor-default" : ""}
                        ${isSelected ? "bg-[#1d3557] text-white font-bold" : ""}
                        ${isToday && !isSelected ? "ring-2 ring-[#1d3557] text-[#1d3557] font-bold" : ""}
                        ${!isSelected && !isToday && day ? "hover:bg-slate-100 text-slate-500" : ""}
                        ${bills && !isSelected && !isToday ? "font-semibold text-slate-800" : ""}
                      `}
                    >
                      {day ?? ""}
                    </button>
                    {bills && (
                      <div className="flex gap-0.5 mt-1.5">
                        {bills.slice(0, 3).map((sub, j) => (
                          <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getCategoryColor(sub.category) }} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-100 pt-4 h-[120px] overflow-y-auto">
              {selectedDay === null ? (
                <p className="text-xs text-slate-400 text-center py-3">點選日期查看當日帳單</p>
              ) : (billsByDay[selectedDay] || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">
                  {today.getMonth() + 1}月{selectedDay}日 無扣款紀錄
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-medium mb-2">
                    {today.getMonth() + 1}月{selectedDay}日 訂閱
                  </p>
                  {(billsByDay[selectedDay] || []).map((sub) => {
                    const days = getDaysUntil(sub.nextBillingDate);
                    const personal = sub.price / sub.sharedWith;
                    const color = getCategoryColor(sub.category);
                    return (
                      <div key={sub.id} onClick={() => setDetailSub(sub)} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700">{sub.name}</p>
                          <p className="text-xs text-slate-400">{formatBillingDate(sub.nextBillingDate)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-slate-700">{formatAmount(personal)}</p>
                          <p className={`text-xs ${getDaysTextClass(days)}`}>剩 {days} 天</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 支出趨勢 + 類別分佈 */}
          <div className="flex flex-col gap-5 h-full">

            <div className="bg-white rounded-2xl p-6 flex-1" style={CARD}>
              <p className={`${LABEL_CLS} mb-6`}>支出趨勢</p>
              <div className="flex items-end gap-3 px-1 relative" style={{ height: "140px" }}>
                {past6Months.map((monthData, barIndex) => {
                  const monthTotal = Object.values(monthData.byCat).reduce((a, b) => a + b, 0);
                  const isHovered = tooltipMonth === monthData.month;
                  const isAnyHovered = tooltipMonth !== null;
                  const isFirst = barIndex === 0;
                  const isLast = barIndex === past6Months.length - 1;
                  const tooltipPos = isFirst
                    ? "left-0"
                    : isLast
                    ? "right-0"
                    : "left-1/2 -translate-x-1/2";
                  const arrowPos = isFirst
                    ? "left-3"
                    : isLast
                    ? "right-3"
                    : "left-1/2 -translate-x-1/2";
                  return (
                    <div
                      key={monthData.month}
                      className="flex-1 flex flex-col items-center gap-2 relative group"
                      onMouseEnter={() => setTooltipMonth(monthData.month)}
                      onMouseLeave={() => setTooltipMonth(null)}
                    >
                      {isHovered && monthTotal > 0 && (
                        <div className={`absolute bottom-full mb-2 ${tooltipPos} bg-[#1d3557] text-white rounded-xl px-3 py-2 text-[10px] whitespace-nowrap z-10 pointer-events-none`}
                          style={{ boxShadow: "0 4px 16px oklch(0% 0 0 / 0.2)" }}>
                          <p className="font-semibold mb-1 text-center">{monthData.month}</p>
                          {CATEGORY_NAMES.filter((cat) => (monthData.byCat[cat] || 0) > 0).map((cat) => (
                            <p key={cat} className="flex gap-2 justify-between">
                              <span className="text-white/70">{cat}</span>
                              <span className="font-medium">{formatAmount(monthData.byCat[cat])}</span>
                            </p>
                          ))}
                          <div className="border-t border-white/20 mt-1 pt-1 flex justify-between">
                            <span className="text-white/70">合計</span>
                            <span className="font-bold">{formatAmount(monthTotal)}</span>
                          </div>
                          <div className={`absolute top-full ${arrowPos} border-4 border-transparent border-t-[#1d3557]`} />
                        </div>
                      )}
                      <div className={`w-full flex gap-0.5 transition-opacity duration-200 ${isAnyHovered && !isHovered ? "opacity-40" : "opacity-100"}`} style={{ height: "116px" }}>
                        {CATEGORY_NAMES.map((cat) => {
                          const val = monthData.byCat[cat] || 0;
                          const heightPx = val > 0 ? Math.max((val / maxBarVal) * 110, 4) : 0;
                          return (
                            <div key={cat} className="flex-1 flex flex-col justify-end">
                              <div
                                className="w-full rounded-t transition-all duration-300"
                                style={{ height: `${heightPx}px`, backgroundColor: CATEGORIES[cat].color }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <span className={`text-[10px] leading-none whitespace-nowrap transition-opacity duration-200 ${
                        monthData.isCurrent ? "text-[#1d3557] font-semibold" : "text-slate-500"
                      } ${isAnyHovered && !isHovered ? "opacity-40" : "opacity-100"}`}>
                        {monthData.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 flex-wrap">
                {CATEGORY_NAMES.map((cat) => (
                  <div key={cat} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CATEGORIES[cat].color }} />
                    <span className="text-[10px] text-slate-600">{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 flex-1" style={CARD}>
              <p className={`${LABEL_CLS} mb-6`}>類別分佈</p>
              {categoryData.length === 0 ? (
                <p className="text-xs text-slate-400">尚無資料</p>
              ) : (
                <div className="space-y-5">
                  {categoryData.map(({ cat, pct }) => {
                    const color = getCategoryColor(cat);
                    return (
                      <div key={cat}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-slate-700">{cat}</span>
                          <span className="text-xs font-bold text-slate-500">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 近期活動摘要：邊框容器取代浮動陰影卡片 */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className={LABEL_CLS}>近期活動摘要</p>
          </div>
          {activityList.length === 0 ? (
            <div className="px-6 py-8">
              <p className="text-xs text-slate-500">尚無訂閱資料</p>
            </div>
          ) : (
            <>
              {/* 桌機版表格 */}
              <div className="hidden lg:block">
                <div className="px-6 grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 py-3 bg-slate-50/70 border-b border-slate-100 min-w-[600px]">
                  {["服務名稱", "類別", "繳款日期", "狀態", "金額"].map((h) => (
                    <div key={h} className={LABEL_CLS}>{h}</div>
                  ))}
                </div>
                <div className="min-w-[600px]">
                  {activityList.map((sub, index) => {
                    const personal = sub.price / sub.sharedWith;
                    const days = getDaysUntil(sub.nextBillingDate);
                    const status = getStatusInfo(days);
                    const catColor = getCategoryColor(sub.category);
                    const dateLabel = new Date(sub.nextBillingDate).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });
                    return (
                      <div
                        key={sub.id}
                        onClick={() => setDetailSub(sub)}
                        className="row-enter px-6 grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 py-3 border-b border-slate-50 last:border-0 items-center cursor-pointer hover:bg-slate-50/70 transition-colors"
                        style={{ "--row-index": index }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: getAvatarColor(sub.name) }}>
                            {sub.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-800 truncate">{sub.name}</span>
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full w-fit" style={{ backgroundColor: catColor, color: getContrastTextColor(catColor) }}>{sub.category}</span>
                        <span className="text-xs text-slate-500">{dateLabel}</span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
                          <span className={`text-xs font-medium ${status.text}`}>{status.label}</span>
                        </div>
                        <span className="text-sm font-bold text-[#1d3557] tabular-nums whitespace-nowrap">{formatAmount(personal)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 手機版卡片列表 */}
              <div className="lg:hidden">
                {activityList.map((sub, index) => {
                  const personal = sub.price / sub.sharedWith;
                  const days = getDaysUntil(sub.nextBillingDate);
                  const status = getStatusInfo(days);
                  const catColor = getCategoryColor(sub.category);
                  const dateLabel = new Date(sub.nextBillingDate).toLocaleDateString("zh-TW", { month: "2-digit", day: "2-digit" });
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setDetailSub(sub)}
                      className="row-enter flex items-center gap-3 py-3 px-4 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50/70 transition-colors"
                      style={{ "--row-index": index }}
                    >
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: getAvatarColor(sub.name) }}>
                        {sub.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{sub.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: catColor, color: getContrastTextColor(catColor) }}>{sub.category}</span>
                          <span className="text-[10px] text-slate-400">{dateLabel}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-[#1d3557] tabular-nums whitespace-nowrap">{formatAmount(personal)}</p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
                          <span className={`text-[10px] font-medium ${status.text}`}>{status.label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </div>

      {detailSub && (
        <SubscriptionDetailModal
          sub={detailSub}
          currency={currency}
          exchangeRate={exchangeRate}
          onEdit={() => { setEditSub(detailSub); setDetailSub(null); }}
          onDelete={() => { onDelete(detailSub.id); setDetailSub(null); }}
          onClose={() => setDetailSub(null)}
        />
      )}

      {editSub && (
        <SubscriptionEditModal
          sub={editSub}
          onSave={(updated) => { onEdit(updated); setEditSub(null); }}
          onClose={() => setEditSub(null)}
          categories={categories}
          subscriptions={subscriptions}
          onAddCategory={onAddCategory}
          onRemoveCategory={onRemoveCategory}
        />
      )}
    </>
  );
}
