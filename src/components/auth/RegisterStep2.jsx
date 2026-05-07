import { RegisterShell } from "./AuthShells";
import StepIndicator from "./StepIndicator";
import { BudgetAnalysis } from "./BudgetAnalysis";

const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";
const moneyInputCls = "flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-[var(--color-primary)] transition-colors";

export default function RegisterStep2({ monthlyIncome, setMonthlyIncome, monthlyBudget, setMonthlyBudget, onSubmit, onBack }) {
  return (
    <RegisterShell
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button type="button" onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            上一步
          </button>
          <button type="submit" form="step2"
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-strong)] hover:text-[var(--color-primary)] transition-colors">
            下一步
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      }
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-1">財務設定</h2>
        <p className="text-slate-500 text-sm">幫助我們了解您的預算，提供更精準的洞察。</p>
      </div>
      <StepIndicator current={2} />
      <form id="step2" onSubmit={onSubmit}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>您的每月預計收入 (TWD)</label>
              <div className={moneyInputCls}>
                <span className="px-3 py-3 text-sm font-medium text-slate-500 bg-slate-50 border-r border-slate-200 whitespace-nowrap">NT$</span>
                <input type="number" min="0" placeholder="例如: 50,000" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} className="flex-1 px-3 py-3 text-sm outline-none text-slate-800 placeholder-slate-400 bg-white" />
              </div>
            </div>
            <div>
              <label className={labelCls}>您計畫投入的每月訂閱預算 (TWD)</label>
              <div className={moneyInputCls}>
                <span className="px-3 py-3 text-sm font-medium text-slate-500 bg-slate-50 border-r border-slate-200 whitespace-nowrap">NT$</span>
                <input type="number" min="0" placeholder="例如: 2,500" value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)} className="flex-1 px-3 py-3 text-sm outline-none text-slate-800 placeholder-slate-400 bg-white" />
              </div>
            </div>
          </div>
          <div className="bg-[var(--color-panel)] rounded-2xl p-6 border border-[var(--color-border)]">
            <BudgetAnalysis monthlyIncome={monthlyIncome} monthlyBudget={monthlyBudget} />
          </div>
          <p className="text-xs text-slate-400">您可以隨時在「偏好設定」中更改這些設定</p>
        </div>
      </form>
    </RegisterShell>
  );
}
