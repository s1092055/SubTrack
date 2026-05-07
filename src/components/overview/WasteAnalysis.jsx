import { calcMonthlyPersonal, getWasteReason } from "../../utils/sub";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WasteAnalysis({ wastedSubs, wasteMonthly, wasteYearly, onNavigateToList, onClose }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="sm" showClose={false}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
                <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-secondary)]">浪費分析</p>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {wastedSubs.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-1">訂閱狀態良好</p>
              <p className="text-xs text-slate-400">所有訂閱均已確認使用中，沒有疑似浪費的項目。</p>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div>
                  <p className="text-sm font-bold text-amber-900">
                    有 {wastedSubs.length} 個訂閱可能在浪費
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">超過 30 天未確認，或已標記為未使用</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 border border-[var(--color-border)] bg-[var(--color-panel)]">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">每月浪費</p>
                  <p className="text-lg font-bold text-slate-800 tabular-nums">
                    NT$ {Math.round(wasteMonthly).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl p-3 border border-[var(--color-border)] bg-[var(--color-panel)]">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">每年浪費</p>
                  <p className="text-lg font-bold text-slate-800 tabular-nums">
                    NT$ {Math.round(wasteYearly).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {wastedSubs.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 border border-[var(--color-border)] bg-[var(--color-panel)]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 text-[10px] font-bold flex-shrink-0">
                        {sub.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{sub.name}</p>
                        <p className="text-[10px] text-amber-600">{getWasteReason(sub)}</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-700 tabular-nums flex-shrink-0 ml-2">
                      NT$ {Math.round(calcMonthlyPersonal(sub)).toLocaleString()}／月
                    </p>
                  </div>
                ))}
              </div>

              <Button
                variant="default"
                className="w-full"
                onClick={() => { onNavigateToList(); onClose(); }}
              >
                前往訂閱清單確認
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
