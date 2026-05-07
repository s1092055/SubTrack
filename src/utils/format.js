export function getContrastTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.85 ? "#1d3557" : "#ffffff";
}

export function getStatusInfo(days) {
  if (days <= 0) return { label: "已付", dot: "bg-green-400", text: "text-green-600" };
  if (days <= 7) return { label: "即將扣款", dot: "bg-amber-400", text: "text-amber-600" };
  return { label: "待扣款", dot: "bg-slate-300", text: "text-slate-500" };
}

export function formatMoney(val) {
  return val ? `NT$ ${Number(val).toLocaleString()}` : "未填寫";
}
