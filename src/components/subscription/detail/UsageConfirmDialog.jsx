import { calcMonthlyPersonal } from "@/utils/sub";
import { getAvatarColor } from "@/constants/brandColors";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function UsageConfirmDialog({ sub, onConfirm, onDismiss }) {
  const daysLeft = Math.ceil(
    (new Date(sub.nextBillingDate).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  const monthly = calcMonthlyPersonal(sub);
  const avatarColor = sub.avatarColor || getAvatarColor(sub.name);

  return (
    <Dialog open={true} onOpenChange={onDismiss}>
      <DialogContent
        size="sm"
        showClose={false}
        title={`確認 ${sub.name} 使用狀態`}
        description="確認你最近是否仍有使用此訂閱服務。"
      >
        <div className="px-6 pt-7 pb-5 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4"
            style={{ backgroundColor: avatarColor }}
          >
            {sub.name.charAt(0).toUpperCase()}
          </div>

          <p className="text-base font-bold text-slate-900 mb-1">{sub.name}</p>
          <p className="text-sm text-orange-500 font-semibold mb-1">
            {daysLeft === 0 ? "今日扣款" : `${daysLeft} 天後扣款`}
          </p>
          <p className="text-xs text-slate-400 mb-1">
            NT$ {Math.round(monthly).toLocaleString()} / 月
          </p>
          <p className="text-xs text-slate-400 mb-5">
            超過 30 天未確認使用，扣款前先確認一下還有在用嗎？
          </p>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => onConfirm("active")}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
            >
              ✔ 有在用
            </button>
            <button
              type="button"
              onClick={() => onConfirm("unused")}
              className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              ✕ 沒在用
            </button>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors py-1"
          >
            稍後再說
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
