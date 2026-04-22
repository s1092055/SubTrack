/**
 * 取得今天日期（時間歸零）
 */
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * 計算單筆訂閱的每月個人費用
 */
export const calcMonthlyPersonal = (sub) => {
  const personal = sub.price / sub.sharedWith;
  return sub.cycle === "yearly" ? personal / 12 : personal;
};

/**
 * 格式化金額（依幣別顯示 TWD 或 USD）
 */
export const formatAmount = (twd, currency, exchangeRate) => {
  if (currency === "USD" && exchangeRate)
    return `$${(twd * exchangeRate).toFixed(0)} USD`;
  return `$${Math.round(twd).toLocaleString()} TWD`;
};

/**
 * 格式化日期為「M月D日」
 */
export const formatBillingDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
};

/**
 * 計算從今天到指定日期的天數（負數表示已過）
 */
export const getDaysUntil = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d - getToday()) / (1000 * 60 * 60 * 24));
};
