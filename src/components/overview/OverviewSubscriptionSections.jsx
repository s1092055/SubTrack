import { calcMonthlyPersonal } from "../../utils/sub";
import { getAvatarColor } from "../../constants/brandColors";
import {
  formatDate,
  formatDaysLeft,
  getDaysSince,
  getLastSeenDate,
  getPlanLabel,
  getUsageLabel,
} from "../../utils/overviewDisplay";

const CARD_BASE =
  "rounded-card border border-subtrack-line bg-subtrack-card shadow-[0_6px_20px_rgba(0,0,0,0.04)]";

function cardClass(extra = "") {
  return `${CARD_BASE} ${extra}`;
}

function ServiceLogo({ name }) {
  const color = getAvatarColor(name);
  const firstLetter = name?.charAt(0)?.toUpperCase() || "S";

  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base font-bold text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      {firstLetter}
    </span>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-normal text-subtrack-text">
        {title}
      </h2>
      <p className="mt-1 text-sm text-subtrack-muted">{subtitle}</p>
    </div>
  );
}

function UpcomingRow({ sub, formatAmount, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(sub)}
      className="grid w-full gap-4 rounded-2xl px-4 py-5 text-left transition-colors hover:bg-subtrack-panel/70 sm:grid-cols-[minmax(0,1fr)_150px_120px] sm:items-center"
    >
      <div className="flex min-w-0 items-center gap-4">
        <ServiceLogo name={sub.name} />

        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-subtrack-text">
            {sub.name}
          </p>
          <p className="mt-1 text-sm text-subtrack-muted">
            {getPlanLabel(sub)}
          </p>
        </div>
      </div>

      <div className="group/billing relative text-sm">
        <p className="font-medium text-subtrack-text">
          {formatDate(sub.nextBillingDate)}
        </p>
        <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 whitespace-nowrap rounded-full border border-subtrack-line bg-subtrack-card px-3 py-1 text-xs font-medium text-[var(--subtrack-primary-strong)] opacity-0 shadow-card transition-opacity duration-150 group-hover/billing:opacity-100 group-focus-within/billing:opacity-100">
          {formatDaysLeft(sub.nextBillingDate)}
        </span>
      </div>

      <p className="text-sm font-semibold text-subtrack-text tabular-nums sm:text-right">
        {formatAmount(calcMonthlyPersonal(sub))} / 月
      </p>
    </button>
  );
}

function AttentionRow({ sub, formatAmount, onOpen }) {
  const lastSeenDays = getDaysSince(getLastSeenDate(sub));
  const lastSeenText = Number.isFinite(lastSeenDays)
    ? `上次使用 ${lastSeenDays} 天前`
    : "尚未確認使用";

  return (
    <button
      type="button"
      onClick={() => onOpen(sub)}
      className="grid w-full gap-4 rounded-2xl px-4 py-5 text-left transition-colors hover:bg-subtrack-panel/70 sm:grid-cols-[minmax(0,1fr)_130px_120px] sm:items-center"
    >
      <div className="flex min-w-0 items-center gap-4">
        <ServiceLogo name={sub.name} />

        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-subtrack-text">
            {sub.name}
          </p>
          <p className="mt-1 text-sm text-subtrack-muted">
            {getPlanLabel(sub)}
          </p>
        </div>
      </div>

      <div className="text-sm">
        <p className="flex items-center gap-2 font-medium text-subtrack-text">
          <span className="h-2 w-2 rounded-full bg-[#d96058]" />
          {getUsageLabel(sub)}
        </p>
        <p className="mt-1 text-subtrack-muted">{lastSeenText}</p>
      </div>

      <div className="group/billing relative text-sm sm:text-right">
        <p className="font-medium text-subtrack-text">
          {formatDate(sub.nextBillingDate)}
        </p>
        <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 whitespace-nowrap rounded-full border border-subtrack-line bg-subtrack-card px-3 py-1 text-xs font-medium text-[var(--subtrack-primary-strong)] opacity-0 shadow-card transition-opacity duration-150 group-hover/billing:opacity-100 group-focus-within/billing:opacity-100 sm:left-auto sm:right-0">
          {formatDaysLeft(sub.nextBillingDate)}
        </span>
        <p className="mt-2 font-semibold text-subtrack-text tabular-nums">
          {formatAmount(calcMonthlyPersonal(sub))} / 月
        </p>
      </div>
    </button>
  );
}

export function UpcomingPaymentsSection({ items, formatAmount, onOpen, onViewAll }) {
  return (
    <section className={cardClass("p-6")}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <SectionHeader title="即將扣款" subtitle="7 天內即將扣款的訂閱" />

        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 text-sm font-medium text-[var(--subtrack-primary-strong)] hover:opacity-70 transition-opacity"
        >
          查看全部
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-card bg-subtrack-panel px-5 py-8 text-sm text-subtrack-muted">
          目前沒有即將扣款的訂閱。
        </div>
      ) : (
        <div className="divide-y divide-subtrack-line">
          {items.map((sub) => (
            <UpcomingRow
              key={sub.id}
              sub={sub}
              formatAmount={formatAmount}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function NeedsAttentionSection({ items, formatAmount, onOpen, onViewAll }) {
  return (
    <section className={cardClass("p-6")}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <SectionHeader
          title="需要留意"
          subtitle="使用頻率低或很久沒使用的訂閱"
        />

        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 text-sm font-medium text-[var(--subtrack-primary-strong)] hover:opacity-70 transition-opacity"
        >
          查看全部
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-card bg-subtrack-panel px-5 py-8 text-sm text-subtrack-muted">
          目前沒有明顯需要留意的訂閱。
        </div>
      ) : (
        <div className="divide-y divide-subtrack-line">
          {items.map((sub) => (
            <AttentionRow
              key={sub.id}
              sub={sub}
              formatAmount={formatAmount}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </section>
  );
}