import { SectionBlock } from "@/components/settings/shared/SectionBlock";

function ComingSoonBadge() {
  return (
    <span className="inline-block rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
      即將推出
    </span>
  );
}

function NotificationRow({ label, description }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[var(--color-border)] last:border-0 opacity-60">
      <div className="mr-4">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <ComingSoonBadge />
        </div>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
      <div className="w-10 h-6 rounded-full bg-slate-200 flex-shrink-0 cursor-not-allowed" aria-disabled="true" />
    </div>
  );
}

export default function NotificationsSection() {
  return (
    <>
      <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        通知功能正在開發中，設定後將於功能上線時生效。
      </div>
      <SectionBlock>
        <NotificationRow
          label="續訂提醒"
          description="在訂閱到期前提前獲得通知"
        />
        <NotificationRow
          label="匯率變動"
          description="當匯率波動超過 3% 時通知"
        />
      </SectionBlock>
    </>
  );
}
