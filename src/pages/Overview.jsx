import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CalendarClock,
  WalletCards,
} from "lucide-react";

import { calcMonthlyPersonal, getDaysUntil } from "@/utils/sub";
import {
  buildCategoryBreakdown,
  isInactive,
} from "@/utils/overviewDisplay";
import { isAttention } from "@/utils/subDisplay";
import { getPast6MonthsData } from "@/utils/analytics";
import useOverviewData from "@/hooks/useOverviewData";

import SubDetailModal from "@/components/subscription/detail/SubDetailModal";
import SubEditModal from "@/components/subscription/form/SubEditModal";

import SummaryCard from "@/components/overview/OverviewSummaryCard";
import {
  NeedsAttentionSection,
  UpcomingPaymentsSection,
} from "@/components/overview/OverviewSubscriptionSections";
import InsightBanner from "@/components/overview/OverviewInsightBanner";
import SpendingChart from "@/components/overview/SpendingChart";
import CategoryBreakdownCard from "@/components/overview/CategoryBreakdownCard";
import WasteAnalysis from "@/components/overview/WasteAnalysis";

function PageHeader() {
  return (
    <header>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-subtrack-text">分析</h1>
        <p className="mt-2 text-base text-subtrack-muted">掌握支出趨勢、即將扣款與需要留意的訂閱。</p>
      </div>
    </header>
  );
}

function BudgetBar({ monthlyTotal, monthlyBudget, formatAmount }) {
  const pct = Math.round((monthlyTotal / monthlyBudget) * 100);
  const capped = Math.min(pct, 100);
  const over = pct > 100;
  const warn = pct >= 80;

  const barColor = over
    ? "bg-[#d96058]"
    : warn
      ? "bg-[var(--subtrack-alert)]"
      : "bg-[var(--subtrack-primary)]";

  const textColor = over
    ? "text-[#d96058]"
    : warn
      ? "text-[#8a6331]"
      : "text-[var(--subtrack-primary-strong)]";

  const note = over
    ? `已超出預算 ${formatAmount(monthlyTotal - monthlyBudget)}`
    : `還有 ${formatAmount(monthlyBudget - monthlyTotal)} 可用`;

  return (
    <section className="rounded-card border border-subtrack-line bg-subtrack-card px-6 py-5 shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-4 mb-3">
        <p className="text-sm font-medium text-subtrack-muted">本月預算使用狀況</p>
        <p className={`text-sm font-semibold tabular-nums ${textColor}`}>
          {pct}%
        </p>
      </div>
      <div className="h-2 w-full rounded-full bg-subtrack-line overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${capped}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-subtrack-muted tabular-nums">
          已使用 {formatAmount(monthlyTotal)}
        </p>
        <p className={`text-xs font-medium tabular-nums ${textColor}`}>{note}</p>
      </div>
      <p className="text-xs text-subtrack-muted mt-0.5 tabular-nums text-right">
        預算上限 {formatAmount(monthlyBudget)}
      </p>
    </section>
  );
}


export default function Overview({
  subscriptions,
  currency,
  exchangeRate,
  onEdit,
  onDelete,
  onUpdateUsage,
  categories = [],
  onAddCategory,
  onRemoveCategory,
  onRenameCategory,
  authUser,
  accountCreatedAt,
}) {
  const navigate = useNavigate();
  const [detailSub, setDetailSub] = useState(null);
  const [editSub, setEditSub] = useState(null);
  const [showWasteAnalysis, setShowWasteAnalysis] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const formatAmount = (twd) => {
    if (currency === "USD") return `$${Math.round(twd * exchangeRate).toLocaleString()} USD`;
    return `NT$${Math.round(twd).toLocaleString()}`;
  };

  const { today, trendDiff, trendPct, wastedSubs, wasteMonthly, wasteYearly } =
    useOverviewData(subscriptions, accountCreatedAt);

  const activeSubscriptions = useMemo(
    () => subscriptions.filter((sub) => !isInactive(sub)),
    [subscriptions]
  );
  const monthlyTotal = activeSubscriptions.reduce(
    (total, sub) => total + calcMonthlyPersonal(sub),
    0
  );

  const past6Months = getPast6MonthsData(
    subscriptions,
    today.getFullYear(),
    today.getMonth(),
    accountCreatedAt
  );
  const maxBarVal = Math.max(
    ...past6Months.map((m) => Object.values(m.byCat).reduce((a, b) => a + b, 0)),
    1
  );

  const upcomingSubscriptions = activeSubscriptions
    .filter((sub) => {
      const days = getDaysUntil(sub.nextBillingDate);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => getDaysUntil(a.nextBillingDate) - getDaysUntil(b.nextBillingDate))
    .slice(0, 3);

  const attentionSubscriptions = activeSubscriptions
    .filter(isAttention)
    .slice(0, 3);

  const categoryBreakdown = buildCategoryBreakdown(activeSubscriptions);

  const monthlyCount = activeSubscriptions.filter((s) => s.cycle === "monthly").length;
  const yearlyCount = activeSubscriptions.filter((s) => s.cycle === "yearly").length;

  const spendingNote =
    trendPct === null
      ? "首月訂閱紀錄"
      : trendDiff > 0
        ? `較上月增加 ${formatAmount(trendDiff)}`
        : trendDiff < 0
          ? `較上月減少 ${formatAmount(Math.abs(trendDiff))}`
          : "與上月持平";

  if (subscriptions.length === 0) {
    return (
      <div className="min-h-full bg-subtrack-bg text-subtrack-text">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          <PageHeader />
          <div className="rounded-card border border-subtrack-line bg-subtrack-card px-6 py-16 text-center shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
            <p className="text-base font-semibold text-subtrack-text">還沒有任何訂閱資料</p>
            <p className="mt-2 text-sm text-subtrack-muted">新增幾筆訂閱後，這裡會顯示支出趨勢與使用分析。</p>
            <button
              type="button"
              onClick={() => navigate("/subscriptions")}
              className="mt-6 rounded-full bg-[var(--subtrack-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--subtrack-primary-strong)]"
            >
              前往新增訂閱
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full bg-subtrack-bg text-subtrack-text">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          <PageHeader />

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="本月訂閱支出"
              value={formatAmount(monthlyTotal)}
              note={spendingNote}
              icon={WalletCards}
            />
            <SummaryCard
              title="使用中訂閱"
              value={`${activeSubscriptions.length} 個`}
              note={`月繳 ${monthlyCount} · 年繳 ${yearlyCount} 個`}
              icon={CalendarClock}
            />
            <SummaryCard
              title="即將扣款"
              value={`${upcomingSubscriptions.length} 個`}
              note="7 天內到期"
              icon={CalendarClock}
              tone="warning"
            />
            <SummaryCard
              title="需要留意"
              value={`${attentionSubscriptions.length} 個`}
              note="建議重新確認"
              icon={AlertCircle}
              tone="danger"
            />
          </section>

          {authUser?.monthlyBudget > 0 && (
            <BudgetBar
              monthlyTotal={monthlyTotal}
              monthlyBudget={Number(authUser.monthlyBudget)}
              formatAmount={formatAmount}
            />
          )}

          <section className="grid gap-6 xl:grid-cols-2">
            <UpcomingPaymentsSection
              items={upcomingSubscriptions}
              formatAmount={formatAmount}
              onOpen={setDetailSub}
              onViewAll={() => navigate("/subscriptions?tab=upcoming")}
            />
            <NeedsAttentionSection
              items={attentionSubscriptions}
              formatAmount={formatAmount}
              onOpen={setDetailSub}
              onViewAll={() => navigate("/subscriptions?tab=attention")}
            />
          </section>

          <InsightBanner
            count={wastedSubs.length}
            saving={wasteMonthly}
            formatAmount={formatAmount}
            onViewInsight={() => setShowWasteAnalysis(true)}
          />

          <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
            <SpendingChart
              past6Months={past6Months}
              maxBarVal={maxBarVal}
              formatAmount={formatAmount}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onSelectMonth={(year, month) => {
                setSelectedYear(year);
                setSelectedMonth(month);
              }}
            />
            <CategoryBreakdownCard items={categoryBreakdown} formatAmount={formatAmount} />
          </section>
        </div>
      </div>

      {showWasteAnalysis && (
        <WasteAnalysis
          wastedSubs={wastedSubs}
          wasteMonthly={wasteMonthly}
          wasteYearly={wasteYearly}
          onNavigateToList={() => navigate("/subscriptions")}
          onClose={() => setShowWasteAnalysis(false)}
        />
      )}

      {detailSub && (
        <SubDetailModal
          sub={detailSub}
          currency={currency}
          exchangeRate={exchangeRate}
          onEdit={() => {
            setEditSub(detailSub);
            setDetailSub(null);
          }}
          onDelete={() => {
            onDelete(detailSub.id, detailSub.name);
            setDetailSub(null);
          }}
          onUpdateUsage={(id, status, date) => {
            onUpdateUsage(id, status, date);
            setDetailSub((prev) => ({ ...prev, usageStatus: status, lastCheckedAt: date }));
          }}
          onClose={() => setDetailSub(null)}
        />
      )}

      {editSub && (
        <SubEditModal
          sub={editSub}
          onSave={(updated) => {
            onEdit(updated);
            setEditSub(null);
          }}
          onClose={() => setEditSub(null)}
          categories={categories}
          subscriptions={subscriptions}
          onAddCategory={onAddCategory}
          onRemoveCategory={onRemoveCategory}
          onRenameCategory={onRenameCategory}
          authUser={authUser}
        />
      )}

    </>
  );
}
