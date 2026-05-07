import { calcMonthlyPersonal, formatAmount, getDaysUntil } from "./sub";

const ATTENTION_STATUSES = new Set(["rarely", "unused", "low"]);

export function sortSubs(subs, sortBy) {
  const arr = [...subs];

  if (sortBy === "amount-desc") {
    return arr.sort((a, b) => calcMonthlyPersonal(b) - calcMonthlyPersonal(a));
  }

  if (sortBy === "amount-asc") {
    return arr.sort((a, b) => calcMonthlyPersonal(a) - calcMonthlyPersonal(b));
  }

  if (sortBy === "name-asc") {
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  }

  return arr.sort(
    (a, b) => getDaysUntil(a.nextBillingDate) - getDaysUntil(b.nextBillingDate)
  );
}

export function isCanceled(sub) {
  return ["cancelled", "canceled", "inactive"].includes(sub.status);
}

export function isAttention(sub) {
  if (isCanceled(sub)) return false;
  if (ATTENTION_STATUSES.has(sub.usageStatus)) return true;
  if (!sub.lastCheckedAt) return true;

  return -getDaysUntil(sub.lastCheckedAt) > 30;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return "未設定";

  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

function daysText(sub) {
  const days = getDaysUntil(sub.nextBillingDate);

  if (days === 0) return "今天";
  if (days > 0) return `剩下 ${days} 天`;

  return `已過 ${Math.abs(days)} 天`;
}

export function planName(sub) {
  if (sub.plan) return sub.plan;
  if (sub.tier) return sub.tier;
  if (sub.sharedWith > 1) return "共享方案";

  return "個人方案";
}

function frequencyMeta(sub) {
  if (
    sub.usageStatus === "unused" ||
    sub.frequency === "rarely" ||
    sub.frequency === "low"
  ) {
    return { label: "低", tone: "bg-red-500" };
  }

  if (
    sub.frequency === "daily" ||
    sub.frequency === "weekly" ||
    sub.usageStatus === "active"
  ) {
    return { label: "高", tone: "bg-[var(--subtrack-primary)]" };
  }

  return { label: "中", tone: "bg-[var(--subtrack-alert)]" };
}

export function getStatusMeta(sub) {
  if (isCanceled(sub)) {
    return { label: "已取消", variant: "secondary" };
  }

  if (isAttention(sub)) {
    return { label: "需要留意", variant: "warning" };
  }

  return { label: "使用中", variant: "default" };
}

export function getSubscriptionDisplayProps(sub, currency, exchangeRate) {
  return {
    planLabel: planName(sub),
    frequency: frequencyMeta(sub),
    billingDate: formatDate(sub.nextBillingDate),
    billingText: daysText(sub),
    amountText: formatAmount(calcMonthlyPersonal(sub), currency, exchangeRate),
  };
}
