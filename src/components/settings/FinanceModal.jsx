import { useState } from "react";
import { calcBudgetAnalysis } from "../../utils/finance";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function FinanceModal({ income, budget, onSave, onClose }) {
  const [draftIncome, setDraftIncome] = useState(income);
  const [draftBudget, setDraftBudget] = useState(budget);

  const moneyInputCls = "flex items-center border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-card)] focus-within:border-[var(--color-primary)] transition-colors";

  const { percentage, color, analysisText } = calcBudgetAnalysis(draftIncome, draftBudget);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = !draftIncome
    ? circumference
    : circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="md" showClose={false}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--color-border)]">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">財務設定</p>
          <button onClick={onClose} aria-label="關閉" className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">每月預計收入 (TWD)</label>
              <div className={moneyInputCls}>
                <span className="px-3 py-2.5 text-sm font-medium text-slate-500 bg-[var(--color-panel)] border-r border-[var(--color-border)] whitespace-nowrap">NT$</span>
                <input autoFocus type="number" min="0" placeholder="例如: 50,000" value={draftIncome} onChange={(e) => setDraftIncome(e.target.value)} className="flex-1 min-w-0 px-3 py-2.5 text-sm outline-none text-slate-700 placeholder-slate-300" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">每月訂閱預算 (TWD)</label>
              <div className={moneyInputCls}>
                <span className="px-3 py-2.5 text-sm font-medium text-slate-500 bg-[var(--color-panel)] border-r border-[var(--color-border)] whitespace-nowrap">NT$</span>
                <input type="number" min="0" placeholder="例如: 2,500" value={draftBudget} onChange={(e) => setDraftBudget(e.target.value)} className="flex-1 min-w-0 px-3 py-2.5 text-sm outline-none text-slate-700 placeholder-slate-300" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-panel)] rounded-2xl p-5 flex items-center gap-6 border border-[var(--color-border)]">
            <svg width="88" height="88" viewBox="0 0 96 96" className="flex-shrink-0">
              <circle cx="48" cy="48" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={dashoffset}
                strokeLinecap="round" transform="rotate(-90 48 48)"
                style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.3s ease" }} />
              <text x="48" y="53" textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>
                {!draftIncome ? "—" : `${percentage}%`}
              </text>
            </svg>
            <div>
              <p className="text-sm font-bold text-slate-800 mb-1">
                {!draftIncome ? "尚未輸入收入" : `預算佔收入的 ${percentage}%`}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">{analysisText}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-2">
          <Button type="button" variant="default" className="flex-1" onClick={() => { onSave(draftIncome, draftBudget); onClose(); }}>儲存</Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>取消</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
