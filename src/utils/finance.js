export function calcBudgetAnalysis(monthlyIncome, monthlyBudget) {
  const income = parseFloat(monthlyIncome) || 0;
  const budget = parseFloat(monthlyBudget) || 0;
  const percentage = income > 0 ? Math.min(Math.round((budget / income) * 100), 999) : 0;
  const color =
    income === 0 ? "#1d3557"
    : percentage > 30 ? "#ef4444"
    : percentage > 15 ? "#f59e0b"
    : "#1d3557";
  const analysisText =
    income === 0 || budget === 0 ? "輸入資料後顯示分析結果。"
    : percentage <= 15 ? "這是一個非常健康的理財配置比例。"
    : percentage <= 30 ? "訂閱支出偏高，建議定期檢視。"
    : "訂閱支出過高，建議重新評估。";
  return { income, budget, percentage, color, analysisText };
}
