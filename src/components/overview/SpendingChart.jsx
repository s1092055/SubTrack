import { useState } from "react";
import { getCategoryColor } from "../../constants/categories";

const CARD_BASE =
  "rounded-card border border-subtrack-line bg-subtrack-card shadow-[0_6px_20px_rgba(0,0,0,0.04)]";

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-normal text-subtrack-text">{title}</h2>
      <p className="mt-1 text-sm text-subtrack-muted">{subtitle}</p>
    </div>
  );
}

export default function SpendingChart({
  past6Months,
  maxBarVal,
  formatAmount,
  onSelectMonth,
  selectedYear,
  selectedMonth,
}) {
  const [tooltipMonth, setTooltipMonth] = useState(null);

  const allCats = [...new Set(past6Months.flatMap((m) => Object.keys(m.byCat)))];

  return (
    <section className={`${CARD_BASE} p-6`}>
      <SectionHeader title="支出趨勢" subtitle="過去 6 個月分類支出明細" />

      <div className="mt-8">
        <div className="flex items-end gap-3 px-1 relative" style={{ height: "140px" }}>
          {past6Months.map((monthData, barIndex) => {
            const monthTotal = Object.values(monthData.byCat).reduce((a, b) => a + b, 0);
            const isHovered = tooltipMonth === monthData.month;
            const isAnyHovered = tooltipMonth !== null;
            const isSelected =
              monthData.year === selectedYear && monthData.monthNum === selectedMonth;

            const isFirst = barIndex === 0;
            const isLast = barIndex === past6Months.length - 1;
            const tooltipPos = isFirst
              ? "left-0"
              : isLast
                ? "right-0"
                : "left-1/2 -translate-x-1/2";
            const arrowPos = isFirst ? "left-3" : isLast ? "right-3" : "left-1/2 -translate-x-1/2";

            const opacity = isAnyHovered
              ? isHovered
                ? "opacity-100"
                : "opacity-30"
              : isSelected
                ? "opacity-100"
                : monthData.isCurrent
                  ? "opacity-[0.65]"
                  : "opacity-40";

            return (
              <div
                key={monthData.month}
                className="flex-1 flex flex-col items-center gap-2 relative cursor-pointer"
                onMouseEnter={() => setTooltipMonth(monthData.month)}
                onMouseLeave={() => setTooltipMonth(null)}
                onClick={() => onSelectMonth?.(monthData.year, monthData.monthNum)}
              >
                {isHovered && monthTotal > 0 && (
                  <div
                    className={`absolute bottom-full mb-2 ${tooltipPos} rounded-xl px-3 py-2 text-[10px] whitespace-nowrap z-10 pointer-events-none shadow-card text-white`}
                    style={{ backgroundColor: "var(--color-text-primary)" }}
                  >
                    <p className="font-semibold mb-1 text-center">{monthData.month}</p>
                    {allCats
                      .filter((cat) => (monthData.byCat[cat] || 0) > 0)
                      .map((cat) => (
                        <p key={cat} className="flex gap-2 justify-between">
                          <span className="text-white/70">{cat}</span>
                          <span className="font-medium">{formatAmount(monthData.byCat[cat])}</span>
                        </p>
                      ))}
                    <div
                      className="mt-1 pt-1 flex justify-between"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
                    >
                      <span className="text-white/70">合計</span>
                      <span className="font-bold">{formatAmount(monthTotal)}</span>
                    </div>
                    <div
                      className={`absolute top-full ${arrowPos} border-4 border-transparent`}
                      style={{ borderTopColor: "var(--color-text-primary)" }}
                    />
                  </div>
                )}

                <div
                  className={`w-full flex gap-0.5 transition-opacity duration-200 ${opacity}`}
                  style={{ height: "116px" }}
                >
                  {allCats.map((cat) => {
                    const val = monthData.byCat[cat] || 0;
                    const heightPx = val > 0 ? Math.max((val / maxBarVal) * 110, 4) : 0;
                    return (
                      <div key={cat} className="flex-1 flex flex-col justify-end">
                        <div
                          className="w-full rounded-t transition-all duration-300"
                          style={{
                            height: `${heightPx}px`,
                            backgroundColor: getCategoryColor(cat),
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <span
                  className={`text-[10px] leading-none whitespace-nowrap transition-opacity duration-200 ${
                    isSelected
                      ? "font-bold text-subtrack-primary"
                      : monthData.isCurrent
                        ? "font-medium text-subtrack-muted"
                        : "text-subtrack-muted"
                  } ${isAnyHovered && !isHovered ? "opacity-30" : "opacity-100"}`}
                >
                  {monthData.month}
                </span>

                {isSelected && (
                  <div className="w-3 h-0.5 rounded-full bg-subtrack-primary" />
                )}
              </div>
            );
          })}
        </div>

        {allCats.length > 0 && (
          <div className="mt-4 pt-3 border-t border-subtrack-line flex items-center gap-4 flex-wrap">
            {allCats.map((cat) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: getCategoryColor(cat) }}
                />
                <span className="text-[10px] text-subtrack-muted">{cat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
