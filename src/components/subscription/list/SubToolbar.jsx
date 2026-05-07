import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function SubToolbar({
  statusTabs,
  statusTab,
  onStatusTabChange,
  sortOptions,
  sortBy,
  currentSortLabel,
  onSortChange,
  viewMode,
  onViewModeChange,
  showViewToggle = true,
  onOpenSearch,
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-subtrack-line">
      <div className="flex min-w-0 items-center gap-[clamp(1rem,2vw,1.25rem)] overflow-x-auto no-scrollbar">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onStatusTabChange(tab.value)}
            className={`shrink-0 border-b-2 px-1 pb-3 pt-1 text-sm font-semibold transition-colors ${
              statusTab === tab.value
                ? "border-[var(--subtrack-primary)] text-[var(--subtrack-primary-strong)]"
                : "border-transparent text-subtrack-muted hover:text-subtrack-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2 pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-subtrack-line bg-subtrack-card text-subtrack-muted transition-colors hover:bg-subtrack-surface hover:text-[var(--subtrack-primary-strong)]"
              aria-label={`排序：${currentSortLabel}`}
              title={`排序：${currentSortLabel}`}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={
                  sortBy === option.value
                    ? "bg-subtrack-primary-soft text-[var(--subtrack-primary-strong)]"
                    : ""
                }
                onClick={() => onSortChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-subtrack-line bg-subtrack-card text-subtrack-muted transition-colors hover:bg-subtrack-surface hover:text-[var(--subtrack-primary-strong)]"
          aria-label="搜尋訂閱"
          title="搜尋訂閱"
        >
          <Search className="h-4 w-4" />
        </button>

        {showViewToggle && (
          <div className="inline-flex rounded-full border border-subtrack-line bg-subtrack-card p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                viewMode === "list"
                  ? "bg-subtrack-primary-soft text-[var(--subtrack-primary-strong)]"
                  : "text-subtrack-muted"
              }`}
              aria-label="列表檢視"
            >
              <List className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                viewMode === "grid"
                  ? "bg-subtrack-primary-soft text-[var(--subtrack-primary-strong)]"
                  : "text-subtrack-muted"
              }`}
              aria-label="網格檢視"
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
