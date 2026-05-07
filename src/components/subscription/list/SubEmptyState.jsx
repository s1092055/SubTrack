export default function SubEmptyState({ type = "empty", onOpenAdd, onClearFilter }) {
  if (type === "empty") {
    return (
      <div className="rounded-card border border-subtrack-line bg-subtrack-card px-6 py-16 text-center shadow-card">
        <p className="text-base font-semibold text-subtrack-text">
          還沒有任何訂閱
        </p>
        <p className="mt-2 text-sm text-subtrack-muted">
          開始記錄你的第一筆訂閱。
        </p>
        <button
          type="button"
          onClick={onOpenAdd}
          className="mt-6 rounded-full bg-[var(--subtrack-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--subtrack-primary-strong)]"
        >
          新增第一筆訂閱
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-subtrack-line bg-subtrack-card px-6 py-16 text-center shadow-card">
      <p className="text-sm text-subtrack-muted">找不到符合的訂閱</p>
      {onClearFilter && (
        <button
          type="button"
          onClick={onClearFilter}
          className="mt-4 rounded-full border border-subtrack-line bg-subtrack-card px-4 py-2 text-sm font-semibold text-subtrack-text transition-colors hover:bg-subtrack-surface"
        >
          回到全部
        </button>
      )}
    </div>
  );
}
