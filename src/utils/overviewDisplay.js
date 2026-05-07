import { calcMonthlyPersonal, getDaysUntil } from "./sub";

const ATTENTION_STATUSES = new Set(["rarely", "unused", "low"]);
const LOW_FREQUENCIES = new Set(["", "rarely", "low"]);
const INACTIVE_STATUSES = new Set(["inactive", "canceled", "cancelled"]);

export const DONUT_COLORS = [
  "#6f8f72",
  "#aebda8",
  "#d7bf8f",
  "#9ab6b0",
  "#c9c1b5",
];

export function isInactive(sub) {
  return INACTIVE_STATUSES.has(sub.status);
}

export function getLastSeenDate(sub) {
  return sub.lastUsedAt || sub.lastCheckedAt || null;
}

export function getDaysSince(dateStr) {
  if (!dateStr) return Infinity;

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.floor((today - date) / (1000 * 60 * 60 * 24));
}

export function isAttentionSub(sub) {
  const daysUntil = getDaysUntil(sub.nextBillingDate);
  const daysSinceSeen = getDaysSince(getLastSeenDate(sub));
  const statusNeedsAttention = ATTENTION_STATUSES.has(sub.usageStatus);
  const lowFrequency = LOW_FREQUENCIES.has(sub.frequency ?? "");
  const nearChargeAndLowUse = daysUntil >= 0 && daysUntil <= 7 && lowFrequency;

  return (
    Boolean(sub.needsAttention) ||
    statusNeedsAttention ||
    daysSinceSeen > 21 ||
    nearChargeAndLowUse
  );
}

export function formatDate(dateStr) {
  if (!dateStr) return "未設定";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return "未設定";

  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function formatDaysLeft(dateStr) {
  const days = getDaysUntil(dateStr);

  if (!Number.isFinite(days)) return "尚未設定";
  if (days === 0) return "今天扣款";
  if (days > 0) return `剩下 ${days} 天`;

  return `已過 ${Math.abs(days)} 天`;
}

export function getPlanLabel(sub) {
  if (sub.plan) return sub.plan;
  if (sub.name?.toLowerCase().includes("icloud")) return "200GB 方案";
  if (sub.sharedWith > 1) return "共享方案";

  return "個人方案";
}

export function getUsageLabel(sub) {
  if (sub.usageStatus === "unused") return "未使用";
  if (sub.usageStatus === "rarely" || sub.usageStatus === "low") return "低";
  if (
    sub.frequency === "daily" ||
    sub.frequency === "weekly" ||
    sub.usageStatus === "active"
  ) {
    return "高";
  }
  if (sub.frequency === "monthly") return "中";

  return "低";
}

function normalizeCategoryName(category) {
  const map = {
    娛樂: "影音串流",
    工作: "軟體工具",
    生活: "生活服務",
    健康: "生活服務",
    其他: "其他",
  };

  return map[category] || category || "其他";
}

export function buildCategoryBreakdown(activeSubscriptions) {
  const totals = activeSubscriptions.reduce((acc, sub) => {
    const name = normalizeCategoryName(sub.category);
    acc[name] = (acc[name] || 0) + calcMonthlyPersonal(sub);
    return acc;
  }, {});

  const total = Object.values(totals).reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return [
      { name: "影音串流", percent: 45, amount: 0 },
      { name: "軟體工具", percent: 25, amount: 0 },
      { name: "雲端儲存", percent: 15, amount: 0 },
      { name: "學習教育", percent: 10, amount: 0 },
      { name: "其他", percent: 5, amount: 0 },
    ];
  }

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, amount]) => ({
      name,
      amount,
      percent: Math.round((amount / total) * 100),
    }));
}