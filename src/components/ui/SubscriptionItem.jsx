import { calcMonthlyPersonal, formatAmount as fmt, getDaysUntil } from "../../utils/subscription";
import { getCategoryColor } from "../../constants/categories";
import { getAvatarColor } from "../../constants/brandColors";
import { getContrastTextColor } from "../../utils/format";

export default function SubscriptionItem({ sub, currency, exchangeRate, onClick }) {
  const daysLeft = getDaysUntil(sub.nextBillingDate);
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;

  const personalCost = calcMonthlyPersonal(sub);
  const formatAmount = (twd) => fmt(twd, currency, exchangeRate);
  const dateLabel = sub.nextBillingDate.replace(/-/g, "/");
  const catColor = getCategoryColor(sub.category);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-white rounded-2xl flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors border border-slate-100"
      style={{ boxShadow: "0 1px 6px oklch(0% 0 0 / 0.07)" }}
    >
      {/* 服務圖示 */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
        style={{ backgroundColor: getAvatarColor(sub.name) }}
      >
        {sub.name.charAt(0).toUpperCase()}
      </div>

      {/* 名稱 + 類別 */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-base leading-tight">{sub.name}</p>
        <span
          className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-0.5"
          style={{ backgroundColor: catColor, color: getContrastTextColor(catColor) }}
        >
          {sub.category}
        </span>
      </div>

      {/* 金額 + 日期 */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-slate-900 text-base tabular-nums">
          {formatAmount(personalCost)}
        </p>
        <p className={`text-xs mt-0.5 ${isUrgent ? "text-orange-500 font-medium" : "text-slate-400"}`}>
          下次扣款 {dateLabel}
        </p>
      </div>

      {/* 箭頭 */}
      <svg
        className={`w-5 h-5 flex-shrink-0 ${isUrgent ? "text-orange-400" : "text-slate-300"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
