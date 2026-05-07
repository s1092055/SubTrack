import { BarChart3, CalendarClock, MoreVertical, WalletCards } from "lucide-react";

import SubStatBlock from "@/components/subscription/shared/SubStatBlock";

export default function SubCard({
  sub,
  serviceMark,
  statusBadge,
  planLabel,
  frequency,
  billingDate,
  billingText,
  amountText,
  onOpen,
  onActionToggle,
  actionOpen,
  onEdit,
  onDelete,
  onMarkPaid,
}) {
  return (
    <div className="relative rounded-card border border-subtrack-line bg-subtrack-card p-4 shadow-card transition-all hover:border-[var(--subtrack-primary)]/30 hover:shadow-panel sm:p-5">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="flex items-center justify-between gap-4 pr-12 sm:pr-14">
          <div className="flex min-w-0 items-center gap-3">
            {serviceMark}
            <div className="min-w-0">
              <p className="truncate text-[clamp(1rem,1.45vw,1.2rem)] font-bold tracking-tight text-subtrack-text">{sub.name}</p>
              <p className="mt-1 truncate text-[clamp(0.8rem,1vw,0.9rem)] text-subtrack-muted">{planLabel}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {statusBadge}
          </div>
        </div>

        <div className="my-4 border-t border-subtrack-line" />

        <div className="grid gap-4 lg:grid-cols-3">
          <SubStatBlock icon={<BarChart3 className="h-5 w-5" />} label="使用頻率">
            <span className="inline-flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${frequency.tone}`} />
              {frequency.label}
            </span>
          </SubStatBlock>

          <SubStatBlock
            icon={<CalendarClock className="h-6 w-6" />}
            label="下次扣款日"
            subText={billingText}
          >
            <span className="block max-w-full truncate tabular-nums">
              {billingDate}
            </span>
          </SubStatBlock>

          <SubStatBlock icon={<WalletCards className="h-5 w-5" />} label="金額">
            <span className="block max-w-full truncate tabular-nums">
              {sub.cycle === "yearly" ? `月均 ${amountText}` : `${amountText} / 月`}
            </span>
          </SubStatBlock>
        </div>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onActionToggle();
        }}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-subtrack-line bg-white text-subtrack-muted transition-colors hover:bg-subtrack-primary-soft hover:text-[var(--subtrack-primary-strong)] sm:right-5 sm:top-5"
        aria-label={`${sub.name} 更多操作`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {actionOpen && (
        <div className="absolute right-4 top-16 z-20 w-36 overflow-hidden rounded-2xl border border-subtrack-line bg-white p-1 shadow-card sm:right-5">
          {onMarkPaid && (
            <button type="button" onClick={onMarkPaid} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[var(--color-primary-strong)] hover:bg-[var(--color-primary-soft)]">
              標註已付款
            </button>
          )}
          <button type="button" onClick={onOpen} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-subtrack-muted hover:bg-subtrack-panel">
            詳情
          </button>
          <button type="button" onClick={onEdit} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-subtrack-muted hover:bg-subtrack-panel">
            編輯
          </button>
          <button type="button" onClick={onDelete} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-subtrack-muted hover:bg-subtrack-panel">
            刪除
          </button>
        </div>
      )}
    </div>
  );
}
