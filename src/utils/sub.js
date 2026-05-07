export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const calcMonthlyPersonal = (sub) => {
  const personal = sub.price / sub.sharedWith;
  return sub.cycle === "yearly" ? personal / 12 : personal;
};

export const formatAmount = (twd, currency, exchangeRate) => {
  if (currency === "USD" && exchangeRate)
    return `$${(twd * exchangeRate).toFixed(0)} USD`;
  return `$${Math.round(twd).toLocaleString()} TWD`;
};

export const advanceBillingDate = (sub) => {
  const [year, month, day] = sub.nextBillingDate.split("-").map(Number);
  const d =
    sub.cycle === "yearly"
      ? new Date(year + 1, month - 1, day)
      : new Date(year, month, day); // month is 0-indexed; passing month (not month-1) advances by 1
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const getDaysUntil = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d - getToday()) / (1000 * 60 * 60 * 24));
};

export const needsUsageConfirm = (sub) => {
  const reminderDays = sub.reminderDays ?? 3;
  const daysUntil = getDaysUntil(sub.nextBillingDate);
  if (daysUntil < 0 || daysUntil > reminderDays) return false;
  if (!sub.lastCheckedAt) return true;
  return -getDaysUntil(sub.lastCheckedAt) >= reminderDays;
};

export const isLikelyWasted = (sub) => {
  if (sub.usageStatus === "unused") return true;
  const daysSinceCheck = sub.lastCheckedAt ? -getDaysUntil(sub.lastCheckedAt) : Infinity;
  return daysSinceCheck > 30;
};

export const getWasteReason = (sub) => {
  if (sub.usageStatus === "unused") return "已標記為未使用";
  if (!sub.lastCheckedAt) return "從未確認使用狀態";
  return `${-getDaysUntil(sub.lastCheckedAt)} 天未確認`;
};
