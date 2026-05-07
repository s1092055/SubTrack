import { MoreVertical } from "lucide-react";

export default function SubRow({
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
    <div className="relative rounded-card border border-subtrack-line bg-subtrack-card px-5 py-4 shadow-card transition-colors hover:bg-subtrack-surface">
      <button
        type="button"
        onClick={onOpen}
        className="grid w-full min-w-0 grid-cols-1 gap-4 text-left xl:grid-cols-[minmax(180px,1.3fr)_minmax(100px,0.6fr)_minmax(120px,0.8fr)_minmax(135px,0.85fr)_minmax(120px,0.8fr)_44px] xl:items-center"
      >
        <div className="flex min-w-0 items-center gap-4">
          {serviceMark}
          <div className="min-w-0">
            <p className="truncate text-[clamp(0.95rem,1.15vw,1rem)] font-semibold text-subtrack-text">{sub.name}</p>
            <p className="mt-1 truncate text-[clamp(0.78rem,0.95vw,0.875rem)] text-subtrack-muted">{planLabel}</p>
          </div>
        </div>

        <div className="min-w-0">
          {statusBadge}
        </div>

        <div className="min-w-0">
          <p className="text-[clamp(0.78rem,0.95vw,0.875rem)] text-subtrack-muted">使用頻率</p>
          <p className="mt-1 inline-flex items-center gap-2 text-[clamp(0.84rem,1vw,0.95rem)] text-subtrack-text">
            <span className={`h-2 w-2 rounded-full ${frequency.tone}`} />
            {frequency.label}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[clamp(0.78rem,0.95vw,0.875rem)] text-subtrack-muted">下次扣款日</p>
          <p className="mt-1 truncate text-[clamp(0.95rem,1.2vw,1rem)] font-medium text-subtrack-text tabular-nums">{billingDate}</p>
          <p className="mt-0.5 truncate text-[clamp(0.78rem,0.95vw,0.875rem)] text-[var(--subtrack-primary-strong)]">
            {billingText}
          </p>
        </div>

        <div className="min-w-0 pr-12 xl:pr-0">
          <p className="text-[clamp(0.78rem,0.95vw,0.875rem)] text-subtrack-muted">金額</p>
          <p className="mt-1 truncate text-[clamp(0.95rem,1.2vw,1rem)] font-semibold text-subtrack-text tabular-nums">
            {sub.cycle === "yearly" ? `月均 ${amountText}` : `${amountText} / 月`}
          </p>
        </div>

        <div className="hidden justify-end xl:flex">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-subtrack-line text-subtrack-muted">
            <MoreVertical className="h-4 w-4" />
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onActionToggle();
        }}
        className="absolute right-5 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-subtrack-line bg-white text-subtrack-muted transition-colors hover:bg-subtrack-primary-soft hover:text-[var(--subtrack-primary-strong)] xl:right-5 xl:top-1/2 xl:-translate-y-1/2"
        aria-label={`${sub.name} 更多操作`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {actionOpen && (
        <div className="absolute right-5 top-16 z-20 w-36 overflow-hidden rounded-2xl border border-subtrack-line bg-white p-1 shadow-card xl:top-[calc(50%+1.75rem)]">
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
