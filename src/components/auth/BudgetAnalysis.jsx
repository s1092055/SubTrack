import { calcBudgetAnalysis } from "../../utils/finance";

export function BudgetAnalysis({ monthlyIncome, monthlyBudget }) {
  const { income, percentage, color, analysisText } = calcBudgetAnalysis(monthlyIncome, monthlyBudget);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = income === 0 ? circumference : circumference - (Math.min(percentage, 100) / 100) * circumference;
  return (
    <div className="h-full flex flex-col">
      <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-4 uppercase tracking-wide">預算分析</p>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <svg width="120" height="120" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={dashoffset}
            strokeLinecap="round" transform="rotate(-90 48 48)"
            style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.3s ease" }} />
          <text x="48" y="53" textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>
            {income === 0 ? "—" : `${percentage}%`}
          </text>
        </svg>
        <div className="text-center">
          <p className="text-base font-bold text-slate-800 mb-1">
            {income === 0 ? "尚未輸入收入" : `預算佔收入的 ${percentage}%`}
          </p>
          <p className="text-sm text-slate-500">{analysisText}</p>
        </div>
      </div>
    </div>
  );
}

export function BudgetAnalysisCompact({ monthlyIncome, monthlyBudget }) {
  const { income, percentage, color, analysisText } = calcBudgetAnalysis(monthlyIncome, monthlyBudget);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = income === 0 ? circumference : circumference - (Math.min(percentage, 100) / 100) * circumference;
  return (
    <div className="flex items-center justify-center gap-4">
      <svg width="56" height="56" viewBox="0 0 48 48" className="flex-shrink-0">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle cx="24" cy="24" r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={dashoffset}
          strokeLinecap="round" transform="rotate(-90 24 24)"
          style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.3s ease" }} />
        <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>
          {income === 0 ? "—" : `${percentage}%`}
        </text>
      </svg>
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {income === 0 ? "尚未輸入收入" : `預算佔收入的 ${percentage}%`}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{analysisText}</p>
      </div>
    </div>
  );
}
