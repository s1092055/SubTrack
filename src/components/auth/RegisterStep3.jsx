import { RegisterShell } from "./AuthShells";
import StepIndicator from "./StepIndicator";
import { BudgetAnalysisCompact } from "./BudgetAnalysis";
import { formatMoney } from "../../utils/format";

export default function RegisterStep3({ name, email, monthlyIncome, monthlyBudget, isLoading, onSubmit, onBack, onEditStep1, onEditStep2 }) {
  return (
    <RegisterShell
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button type="button" onClick={onBack} disabled={isLoading}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            上一步
          </button>
          <button type="submit" form="step3" disabled={isLoading}
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-strong)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50">
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                開始使用
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-1">確認資料</h2>
        <p className="text-slate-500 text-sm">請確認您填寫的資訊是否正確。</p>
      </div>
      <StepIndicator current={3} />
      <form id="step3" onSubmit={onSubmit}>
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <div className="border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">帳號資訊</p>
              <button type="button" onClick={onEditStep1} className="text-xs text-[var(--color-primary-strong)] hover:underline font-medium">修改</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">姓名</span>
                <span className="text-sm font-medium text-slate-800">{name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">電子郵件</span>
                <span className="text-sm font-medium text-slate-800">{email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">密碼</span>
                <span className="text-sm font-medium text-slate-400 tracking-widest">••••••••</span>
              </div>
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">財務設定</p>
              <button type="button" onClick={onEditStep2} className="text-xs text-[var(--color-primary-strong)] hover:underline font-medium">修改</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">每月預計收入</span>
                <span className={`text-sm font-medium ${monthlyIncome ? "text-slate-800" : "text-slate-400"}`}>{formatMoney(monthlyIncome)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">每月訂閱預算</span>
                <span className={`text-sm font-medium ${monthlyBudget ? "text-slate-800" : "text-slate-400"}`}>{formatMoney(monthlyBudget)}</span>
              </div>
            </div>
            {(monthlyIncome || monthlyBudget) && (
              <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                <BudgetAnalysisCompact monthlyIncome={monthlyIncome} monthlyBudget={monthlyBudget} />
              </div>
            )}
          </div>
        </div>
      </form>
    </RegisterShell>
  );
}
