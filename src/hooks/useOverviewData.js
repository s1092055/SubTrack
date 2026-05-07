import { getToday, calcMonthlyPersonal, isLikelyWasted } from "../utils/sub";
import { billingTotalForMonth } from "../utils/analytics";

export default function useOverviewData(subscriptions, accountCreatedAt) {
  const today = getToday();

  const monthlyTotal = subscriptions.reduce((acc, sub) => acc + calcMonthlyPersonal(sub), 0);

  const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const thisMonthBilling = billingTotalForMonth(subscriptions, today.getFullYear(), today.getMonth(), accountCreatedAt);
  const prevMonthBilling = billingTotalForMonth(subscriptions, prevMonthDate.getFullYear(), prevMonthDate.getMonth(), accountCreatedAt);
  const trendDiff = thisMonthBilling - prevMonthBilling;
  const trendPct = prevMonthBilling > 0 ? ((trendDiff / prevMonthBilling) * 100).toFixed(1) : null;

  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);
  const upcomingBills = subscriptions
    .filter((sub) => {
      const d = new Date(sub.nextBillingDate);
      return d >= today && d <= in30Days;
    })
    .sort((a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate));

  const wastedSubs = subscriptions.filter(isLikelyWasted);
  const wasteMonthly = wastedSubs.reduce((acc, s) => acc + calcMonthlyPersonal(s), 0);
  const wasteYearly = wasteMonthly * 12;

  return {
    today,
    monthlyTotal,
    trendDiff,
    trendPct,
    upcomingBills,
    wastedSubs,
    wasteMonthly,
    wasteYearly,
  };
}
