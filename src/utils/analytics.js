export function billingTotalForMonth(subscriptions, year, month) {
  return subscriptions.reduce((acc, sub) => {
    const personal = sub.price / sub.sharedWith;
    if (sub.cycle === "monthly") return acc + personal;
    const d = new Date(sub.nextBillingDate);
    return d.getMonth() === month && d.getFullYear() === year ? acc + personal : acc;
  }, 0);
}

export function getPast6MonthsData(subscriptions, today) {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
    const byCat = {};
    subscriptions.forEach((sub) => {
      const personal = sub.price / sub.sharedWith;
      const billingDate = new Date(sub.nextBillingDate);
      const isYearlyHit =
        sub.cycle === "yearly" &&
        billingDate.getMonth() === d.getMonth() &&
        billingDate.getFullYear() === d.getFullYear();
      if (sub.cycle === "monthly" || isYearlyHit) {
        byCat[sub.category] = (byCat[sub.category] || 0) + personal;
      }
    });
    return { month: `${d.getMonth() + 1}月`, isCurrent: i === 5, byCat };
  });
}
