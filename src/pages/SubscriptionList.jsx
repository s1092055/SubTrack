import { useState, useRef } from "react";
import SubscriptionItem from "../components/ui/SubscriptionItem";
import SubscriptionDetailModal from "../components/modals/SubscriptionDetailModal";
import SubscriptionEditModal from "../components/modals/SubscriptionEditModal";

const PAGE_SIZE = 5;

export default function SubscriptionList({
  subscriptions,
  onDelete,
  onEdit,
  currency,
  exchangeRate,
  categories,
  onAddCategory,
  onRemoveCategory,
  onNavigate,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const triggerRef = useRef(null);

  const filtered = subscriptions.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const handleOpenDetail = (sub, event) => {
    triggerRef.current = event?.currentTarget ?? null;
    setSelectedSub(sub);
    setConfirmDelete(false);
    setShowDetail(true);
  };

  const handleOpenEdit = () => {
    setShowDetail(false);
    setShowEdit(true);
  };

  const handleSaveEdit = (updated) => {
    onEdit(updated);
    setSelectedSub(updated);
    setShowEdit(false);
    setShowDetail(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setShowDetail(true);
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
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
    <div className="max-w-3xl mx-auto">

      {/* ── 頁首：標題 + 搜尋 ── */}
      <div className="flex items-start justify-between mb-8 gap-6">
        <div className="hidden lg:block">
          <h1 className="text-3xl font-bold text-[#1d3557] leading-tight">訂閱清單</h1>
          <p className="text-sm text-slate-400 mt-1.5">
            {subscriptions.length > 0 ? `共 ${subscriptions.length} 筆服務` : "尚未新增任何訂閱"}
          </p>
        </div>
        <div className="relative w-full lg:w-72 lg:flex-shrink-0">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="搜尋訂閱項目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-600 placeholder-slate-300 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-shadow"
          />
        </div>
      </div>

      {/* ── 訂閱列表 ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          {searchQuery ? (
            <p className="text-slate-500 text-sm">找不到符合的訂閱</p>
          ) : (
            <div className="py-6 border-t border-slate-100">
              <p className="text-base font-semibold text-slate-700 mb-2">還沒有任何訂閱</p>
              <p className="text-sm text-slate-400 mb-6 max-w-xs">
                開始記錄你的第一筆訂閱，一眼掌握每月的自動扣款流向。
              </p>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate("add")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1d3557] text-white text-sm font-semibold hover:bg-[#162843] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  </svg>
                  新增第一筆訂閱
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((sub) => (
            <SubscriptionItem
              key={sub.id}
              sub={sub}
              currency={currency}
              exchangeRate={exchangeRate}
              onClick={(e) => handleOpenDetail(sub, e)}
            />
          ))}
        </div>
      )}

      {/* ── 載入更多 ── */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="px-8 py-2.5 rounded-full bg-slate-200/80 text-slate-500 text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            載入更多訂閱內容
          </button>
        </div>
      )}

      {/* ── 訂閱詳情 Modal ── */}
      {showDetail && selectedSub && !confirmDelete && (
        <SubscriptionDetailModal
          sub={selectedSub}
          currency={currency}
          exchangeRate={exchangeRate}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteClick}
          onClose={handleCloseAll}
        />
      )}

      {/* ── 刪除確認 Modal ── */}
      {showDetail && selectedSub && confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(false); }}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-sm text-center modal-enter"
            style={{ boxShadow: "0 24px 64px oklch(0% 0 0 / 0.18)" }}
          >
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" />
                <path d="M10 11v6M14 11v6" strokeLinecap="round" />
              </svg>
            </div>
            <p className="font-semibold text-slate-800 mb-2">確定要刪除？</p>
            <p className="text-sm text-slate-400 mb-6">
              「{selectedSub.name}」將被永久移除，無法復原。
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                確認刪除
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 編輯 Modal ── */}
      {showEdit && selectedSub && (
        <SubscriptionEditModal
          sub={selectedSub}
          onSave={handleSaveEdit}
          onClose={handleCloseEdit}
          categories={categories}
          subscriptions={subscriptions}
          onAddCategory={onAddCategory}
          onRemoveCategory={onRemoveCategory}
        />
      )}
    </div>
  );
}
