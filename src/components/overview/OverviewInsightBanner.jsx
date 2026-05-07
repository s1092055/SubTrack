import { ChevronRight, Leaf } from "lucide-react";

export default function OverviewInsightBanner({
  count,
  saving,
  formatAmount,
  onViewInsight,
}) {
  if (count === 0) {
    return (
      <section className="flex items-center gap-4 rounded-card border border-subtrack-line bg-subtrack-primary-soft/50 px-6 py-5 shadow-card">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-subtrack-surface text-[var(--subtrack-primary-strong)]">
          <Leaf size={18} strokeWidth={1.8} />
        </span>
        <p className="text-sm font-medium text-[var(--subtrack-primary-strong)]">
          目前所有訂閱都在使用中，沒有明顯浪費的項目。
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5 rounded-card border border-subtrack-line bg-subtrack-primary-soft/80 p-6 shadow-card md:flex-row md:items-center md:justify-between">
      <div className="flex gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-subtrack-surface text-[var(--subtrack-primary-strong)]">
          <Leaf size={22} strokeWidth={1.8} />
        </span>

        <div>
          <h2 className="text-sm font-semibold text-[var(--subtrack-primary-strong)]">
            洞察建議
          </h2>
          <p className="mt-2 text-lg text-subtrack-text">
            有 {count} 個訂閱超過 30 天未確認使用，每月合計{" "}
            {formatAmount(saving)}，建議重新評估。
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewInsight}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-subtrack-line bg-subtrack-surface px-6 text-sm font-semibold text-[var(--subtrack-primary-strong)] transition-colors hover:bg-subtrack-card"
      >
        查看洞察
        <ChevronRight size={17} strokeWidth={1.8} />
      </button>
    </section>
  );
}