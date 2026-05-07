export default function SubPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).slice(0, 3);

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-2xl border border-subtrack-line bg-subtrack-card px-5 py-2.5 text-sm font-medium text-subtrack-muted transition-colors hover:bg-subtrack-surface disabled:cursor-default disabled:opacity-45"
      >
        上一頁
      </button>

      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={`h-10 w-10 rounded-2xl text-sm font-semibold transition-colors ${
            currentPage === pageNumber
              ? "bg-[var(--subtrack-primary)] text-white"
              : "border border-subtrack-line bg-subtrack-card text-subtrack-muted hover:bg-subtrack-surface"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-2xl border border-subtrack-line bg-subtrack-card px-5 py-2.5 text-sm font-medium text-subtrack-muted transition-colors hover:bg-subtrack-surface disabled:cursor-default disabled:opacity-45"
      >
        下一頁
      </button>
    </div>
  );
}
