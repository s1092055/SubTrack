import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  calcMonthlyPersonal,
  formatAmount,
  getDaysUntil,
} from "@/utils/sub";
import { getAvatarColor } from "@/constants/brandColors";

export default function SubSearchDialog({
  open,
  onOpenChange,
  subscriptions,
  onOpenSubscription,
  currency,
  exchangeRate,
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) return [];

    return subscriptions.filter(
      (sub) =>
        sub.name.toLowerCase().includes(q) ||
        (sub.category ?? "").toLowerCase().includes(q) ||
        (sub.paymentMethod ?? "").toLowerCase().includes(q) ||
        (sub.notes ?? "").toLowerCase().includes(q)
    );
  }, [query, subscriptions]);

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      setQuery("");
    }

    onOpenChange(nextOpen);
  };

  const handleSelect = (sub) => {
    setQuery("");
    onOpenChange(false);
    onOpenSubscription(sub);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        size="md"
        showClose={false}
        title="搜尋訂閱"
        description="搜尋訂閱名稱、分類或付款方式。"
      >
        <div className="flex flex-col" style={{ maxHeight: "70vh" }}>
          <div className="flex flex-shrink-0 items-center gap-3 border-b border-subtrack-line px-5 py-4">
            <Search className="h-5 w-5 flex-shrink-0 text-subtrack-muted" />

            <input
              autoFocus
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  handleOpenChange(false);
                }
              }}
              placeholder="搜尋名稱、分類、付款方式、備註…"
              className="flex-1 bg-transparent text-base text-subtrack-text outline-none placeholder:text-subtrack-muted/60"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="flex-shrink-0 text-xs text-subtrack-muted transition-colors hover:text-subtrack-text"
              >
                清除
              </button>
            )}

            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-primary-soft)]"
              aria-label="關閉搜尋"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!query && (
              <p className="px-5 py-8 text-center text-sm text-subtrack-muted">
                輸入關鍵字開始搜尋
              </p>
            )}

            {query && results.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-subtrack-muted">
                找不到符合「{query}」的訂閱
              </p>
            )}

            {results.length > 0 && (
              <ul className="p-2">
                {results.map((sub) => {
                  const days = getDaysUntil(sub.nextBillingDate);
                  const monthly = calcMonthlyPersonal(sub);
                  const avatarColor =
                    sub.avatarColor || getAvatarColor(sub.name);

                  return (
                    <li key={sub.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-subtrack-panel"
                        onClick={() => handleSelect(sub)}
                      >
                        <div
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                          style={{ backgroundColor: avatarColor }}
                        >
                          {sub.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-subtrack-text">
                            {sub.name}
                          </p>
                          <p className="text-xs text-subtrack-muted">
                            {sub.category}
                          </p>
                        </div>

                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm font-bold tabular-nums text-subtrack-text">
                            {formatAmount(monthly, currency, exchangeRate)}
                          </p>
                          <p
                            className={`text-xs ${days <= 7 && days >= 0 ? "text-orange-500" : "text-subtrack-muted"}`}
                          >
                            {days < 0
                              ? "已過期"
                              : days === 0
                                ? "今日扣款"
                                : `${days} 天後`}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {results.length > 0 && (
              <p className="px-5 pb-3 text-center text-xs text-subtrack-muted">
                共 {results.length} 筆結果
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
