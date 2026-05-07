import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarClock, Filter, WalletCards } from "lucide-react";

import SubStatusBadge from "@/components/subscription/shared/SubStatusBadge";
import SubServiceMark from "@/components/subscription/shared/SubServiceMark";

import SubCard from "@/components/subscription/list/SubCard";
import SubRow from "@/components/subscription/list/SubRow";
import SubSummaryCard from "@/components/subscription/list/SubSummaryCard";
import SubSearchDialog from "@/components/subscription/list/SubSearchDialog";
import SubToolbar from "@/components/subscription/list/SubToolbar";
import SubEmptyState from "@/components/subscription/list/SubEmptyState";
import SubPagination from "@/components/subscription/list/SubPagination";

import SubDetailModal from "@/components/subscription/detail/SubDetailModal";
import UsageConfirmDialog from "@/components/subscription/detail/UsageConfirmDialog";

import SubEditModal from "@/components/subscription/form/SubEditModal";

import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";

import {
  getSubscriptionDisplayProps,
  isAttention,
  isCanceled,
  planName,
  sortSubs,
} from "@/utils/subDisplay";

import {
  calcMonthlyPersonal,
  formatAmount as formatCurrency,
  getDaysUntil,
  needsUsageConfirm,
} from "@/utils/sub";

const PAGE_SIZE = 6;

const SORT_OPTIONS = [
  { value: "date-asc", label: "即將扣款日" },
  { value: "amount-desc", label: "金額高→低" },
  { value: "amount-asc", label: "金額低→高" },
  { value: "name-asc", label: "名稱 A→Z" },
];

const STATUS_TABS = [
  { value: "all", label: "全部" },
  { value: "active", label: "使用中" },
  { value: "upcoming", label: "即將扣款" },
  { value: "attention", label: "需要留意" },
  { value: "canceled", label: "已取消" },
];

export default function SubList({
  subscriptions,
  onDelete,
  onEdit,
  onUpdateUsage,
  onMarkPaid,
  currency,
  exchangeRate,
  categories,
  onOpenAdd,
  authUser,
  searchQuery = "",
  showSearch: showSearchProp,
  onSearchChange,
}) {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [statusTab, setStatusTab] = useState(
    STATUS_TABS.some((t) => t.value === initialTab) ? initialTab : "all"
  );
  const [sortBy, setSortBy] = useState("date-asc");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1280);
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1280);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  const [page, setPage] = useState(1);
  const [actionSubId, setActionSubId] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmSub, setConfirmSub] = useState(null);
  const [showSearchInternal, setShowSearchInternal] = useState(false);
  const showSearch = showSearchProp !== undefined ? showSearchProp : showSearchInternal;
  const setShowSearch = onSearchChange ?? setShowSearchInternal;
  const triggerRef = useRef(null);

  const activeSubs = subscriptions.filter((sub) => !isCanceled(sub));
  const upcomingSubs = activeSubs.filter((sub) => {
    const days = getDaysUntil(sub.nextBillingDate);
    return days >= 0 && days <= 7;
  });
  const attentionSubs = activeSubs.filter(isAttention);
  const canceledNotExpired = subscriptions.filter(
    (sub) => isCanceled(sub) && getDaysUntil(sub.nextBillingDate) >= 0
  );
  const monthlyTotal = activeSubs.reduce(
    (sum, sub) => sum + calcMonthlyPersonal(sub),
    0
  );

  const filtered = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();
    return sortSubs(
      subscriptions.filter((sub) => {
        const matchSearch =
          !search ||
          sub.name.toLowerCase().includes(search) ||
          planName(sub).toLowerCase().includes(search) ||
          (sub.category ?? "").toLowerCase().includes(search) ||
          (sub.notes ?? "").toLowerCase().includes(search) ||
          (sub.paymentMethod ?? "").toLowerCase().includes(search);
        const matchStatus =
          statusTab === "all" ||
          (statusTab === "active" && !isCanceled(sub)) ||
          (statusTab === "upcoming" &&
            getDaysUntil(sub.nextBillingDate) >= 0 &&
            getDaysUntil(sub.nextBillingDate) <= 7) ||
          (statusTab === "attention" && isAttention(sub)) ||
          (statusTab === "canceled" && isCanceled(sub));
        return matchSearch && matchStatus;
      }),
      sortBy
    );
  }, [searchQuery, sortBy, statusTab, subscriptions]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleSubs = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const currentSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortBy)?.label ??
    "即將扣款日";

  const getDisplayProps = (sub) => ({
    serviceMark: <SubServiceMark sub={sub} />,
    statusBadge: <SubStatusBadge sub={sub} />,
    ...getSubscriptionDisplayProps(sub, currency, exchangeRate),
  });

  const handleOpenDetail = (sub, event) => {
    triggerRef.current = event?.currentTarget ?? null;
    setActionSubId(null);
    if (needsUsageConfirm(sub)) {
      setConfirmSub(sub);
      return;
    }
    setSelectedSub(sub);
    setConfirmDelete(false);
    setShowDetail(true);
  };

  const handleUsageConfirm = (status) => {
    const today = new Date().toISOString().slice(0, 10);
    onUpdateUsage(confirmSub.id, status, today);
    const updated = {
      ...confirmSub,
      usageStatus: status,
      lastCheckedAt: today,
    };
    setConfirmSub(null);
    setSelectedSub(updated);
    setConfirmDelete(false);
    setShowDetail(true);
  };

  const handleUsageDismiss = () => {
    const sub = confirmSub;
    setConfirmSub(null);
    setSelectedSub(sub);
    setConfirmDelete(false);
    setShowDetail(true);
  };

  const handleOpenEdit = (sub = selectedSub) => {
    setActionSubId(null);
    setSelectedSub(sub);
    setShowDetail(false);
    setShowEdit(true);
  };

  const handleSaveEdit = (updated) => {
    onEdit(updated);
    setSelectedSub(updated);
    setShowEdit(false);
  };

  const handleDeleteClick = (sub = selectedSub) => {
    setActionSubId(null);
    setSelectedSub(sub);
    setConfirmDelete(true);
    setShowDetail(false);
  };

  const handleMarkPaidClick = (sub) => {
    setActionSubId(null);
    setShowDetail(false);
    onMarkPaid(sub.id);
  };

  const handleDeleteConfirm = () => {
    onDelete(selectedSub.id, selectedSub.name);
    setShowDetail(false);
    setSelectedSub(null);
    setConfirmDelete(false);
  };

  const handleCloseAll = () => {
    setShowDetail(false);
    setShowEdit(false);
    setSelectedSub(null);
    setConfirmDelete(false);
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  return (
    <div className="w-full text-subtrack-text">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-subtrack-text">
              所有訂閱
            </h1>
            <p className="mt-2 text-base text-subtrack-muted">
              管理你所有的訂閱服務與使用狀況。
            </p>
          </div>
          {onOpenAdd && (
            <button
              type="button"
              onClick={onOpenAdd}
              className="hidden lg:inline-flex items-center gap-2 rounded-full bg-[var(--subtrack-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--subtrack-primary-strong)] flex-shrink-0"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              新增訂閱
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SubSummaryCard
            label="使用中訂閱"
            value={`${activeSubs.length} 個`}
            description={`每月總費用 ${formatCurrency(monthlyTotal, currency, exchangeRate)}`}
            icon={<WalletCards className="h-5 w-5" />}
          />
          <SubSummaryCard
            label="即將扣款"
            value={`${upcomingSubs.length} 個`}
            description="7 天內到期"
            icon={<CalendarClock className="h-5 w-5" />}
          />
          <SubSummaryCard
            label="需要留意"
            value={`${attentionSubs.length} 個`}
            description="使用頻率較低"
            icon={<Filter className="h-5 w-5" />}
          />
          <SubSummaryCard
            label="已取消但未到期"
            value={`${canceledNotExpired.length} 個`}
            description="仍有剩餘天數"
            icon={<CalendarClock className="h-5 w-5" />}
          />
        </div>

        <SubToolbar
          statusTabs={STATUS_TABS}
          statusTab={statusTab}
          onStatusTabChange={(value) => {
            setStatusTab(value);
            setPage(1);
          }}
          sortOptions={SORT_OPTIONS}
          sortBy={sortBy}
          currentSortLabel={currentSortLabel}
          onSortChange={(value) => {
            setSortBy(value);
            setPage(1);
          }}
          viewMode={isMobile ? "grid" : viewMode}
          onViewModeChange={setViewMode}
          showViewToggle={!isMobile}
          onOpenSearch={() => setShowSearch(true)}
        />

        {subscriptions.length === 0 ? (
          <SubEmptyState type="empty" onOpenAdd={onOpenAdd} />
        ) : filtered.length === 0 ? (
          <SubEmptyState
            type="no-results"
            onClearFilter={statusTab !== "all" ? () => { setStatusTab("all"); setPage(1); } : null}
          />
        ) : isMobile || viewMode === "grid" ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {visibleSubs.map((sub) => (
              <SubCard
                key={sub.id}
                sub={sub}
                {...getDisplayProps(sub)}
                onOpen={(event) => handleOpenDetail(sub, event)}
                actionOpen={actionSubId === sub.id}
                onActionToggle={() =>
                  setActionSubId((current) =>
                    current === sub.id ? null : sub.id
                  )
                }
                onEdit={() => handleOpenEdit(sub)}
                onDelete={() => handleDeleteClick(sub)}
                onMarkPaid={getDaysUntil(sub.nextBillingDate) <= 0 ? () => handleMarkPaidClick(sub) : null}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {visibleSubs.map((sub) => (
              <SubRow
                key={sub.id}
                sub={sub}
                {...getDisplayProps(sub)}
                onOpen={(event) => handleOpenDetail(sub, event)}
                actionOpen={actionSubId === sub.id}
                onActionToggle={() =>
                  setActionSubId((current) =>
                    current === sub.id ? null : sub.id
                  )
                }
                onEdit={() => handleOpenEdit(sub)}
                onDelete={() => handleDeleteClick(sub)}
                onMarkPaid={getDaysUntil(sub.nextBillingDate) <= 0 ? () => handleMarkPaidClick(sub) : null}
              />
            ))}
          </div>
        )}

        <SubPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {showDetail && selectedSub && !confirmDelete && (
        <SubDetailModal
          sub={selectedSub}
          currency={currency}
          exchangeRate={exchangeRate}
          onEdit={() => handleOpenEdit(selectedSub)}
          onDelete={() => handleDeleteClick(selectedSub)}
          onMarkPaid={getDaysUntil(selectedSub.nextBillingDate) <= 0 ? () => handleMarkPaidClick(selectedSub) : null}
          onUpdateUsage={(id, status, date) => {
            onUpdateUsage(id, status, date);
            setSelectedSub((prev) => ({
              ...prev,
              usageStatus: status,
              lastCheckedAt: date,
            }));
          }}
          onClose={handleCloseAll}
        />
      )}

      {selectedSub && confirmDelete && (
        <DeleteConfirmModal
          name={selectedSub.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {showEdit && selectedSub && (
        <SubEditModal
          sub={selectedSub}
          onSave={handleSaveEdit}
          onClose={() => setShowEdit(false)}
          categories={categories}
          subscriptions={subscriptions}
          authUser={authUser}
        />
      )}

      {confirmSub && (
        <UsageConfirmDialog
          sub={confirmSub}
          onConfirm={handleUsageConfirm}
          onDismiss={handleUsageDismiss}
        />
      )}

      <SubSearchDialog
        open={showSearch}
        onOpenChange={setShowSearch}
        subscriptions={subscriptions}
        currency={currency}
        exchangeRate={exchangeRate}
        onOpenSubscription={(sub) => handleOpenDetail(sub, null)}
      />
    </div>
  );
}
