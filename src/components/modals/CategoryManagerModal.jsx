import { useRef, useState, useEffect } from "react";
import { CATEGORY_NAMES } from "../../constants/categories";
import { useScrollLock } from "../../hooks/useScrollLock";
import { getContrastTextColor } from "../../utils/format";

const COLOR_PRESETS = [
  "#ec4899",
  "#3b82f6",
  "#34d399",
  "#a78bfa",
  "#f59e0b",
  "#f97316",
];

export default function CategoryManagerModal({ categories, subscriptions, onAddCategory, onRemoveCategory, onClose }) {
  useScrollLock();
  const [activeTab, setActiveTab] = useState("existing");
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#a78bfa");
  const [error, setError] = useState("");
  const [openCategory, setOpenCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [lastAddedName, setLastAddedName] = useState(null);
  const colorPickerRef = useRef(null);
  const listRef = useRef(null);

  const handleAddNew = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.name === trimmed)) {
      setError("此分類名稱已存在");
      return;
    }
    onAddCategory({ name: trimmed, color: newColor });
    setNewName("");
    setNewColor("#a78bfa");
    setLastAddedName(trimmed);
    setActiveTab("existing");
  };

  useEffect(() => {
    if (activeTab === "existing" && lastAddedName && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
      const timer = setTimeout(() => setLastAddedName(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, lastAddedName]);

  const isCustomColor = !COLOR_PRESETS.includes(newColor);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(null); }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden flex flex-col h-[480px] modal-enter"
        style={{ boxShadow: "0 24px 64px oklch(0% 0 0 / 0.18)" }}
      >
        {/* 標頭 */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0">
          <h2 className="text-base font-bold text-slate-900">分類管理</h2>
          <button
            onClick={() => onClose(null)}
            aria-label="關閉"
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Tab 列 */}
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="flex bg-slate-100 rounded-xl p-0.5">
            {[
              { key: "existing", label: "目前分類" },
              { key: "new", label: "新增分類" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => { setActiveTab(tab.key); setIsEditing(false); setOpenCategory(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 內容 */}
        <div ref={listRef} className="flex-1 overflow-y-auto no-scrollbar min-h-0">

          {/* ── 目前分類 ── */}
          {activeTab === "existing" && (
            <div className="px-4 pb-2">
              <div className="space-y-0.5">
                {categories.map((cat) => {
                  const subs = subscriptions.filter((s) => s.category === cat.name);
                  const isOpen = openCategory === cat.name;
                  const isDefault = CATEGORY_NAMES.includes(cat.name);
                  return (
                    <div key={cat.name} className={`relative rounded-xl transition-colors duration-700 ${lastAddedName === cat.name ? "bg-blue-50" : ""}`}>
                      {/* 紅色減號按鈕 */}
                      <div
                        className={`absolute left-0 top-0 h-[42px] flex items-center transition-opacity duration-200 ${isEditing && !isDefault ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                      >
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(cat.name)}
                          className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 ml-0.5"
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>

                      <div className={`transition-all duration-200 ${isEditing ? "ml-7" : "ml-0"}`}>
                        <button
                          type="button"
                          onClick={() => !isEditing && setOpenCategory(isOpen ? null : cat.name)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors text-left ${isEditing ? "cursor-default" : "hover:bg-slate-50"}`}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="flex-1 text-sm font-medium text-slate-700 truncate">{cat.name}</span>
                          <span className="text-xs text-slate-400 flex-shrink-0 tabular-nums">{subs.length}</span>
                          {!isEditing && (
                            <svg
                              className={`w-3 h-3 text-slate-300 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                              fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                            >
                              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>

                        {/* 展開的訂閱列表 */}
                        <div className={`overflow-hidden transition-all duration-200 ${isOpen && !isEditing ? "max-h-48" : "max-h-0"}`}>
                          <div className="pl-4 pr-3 pb-1.5 space-y-0.5">
                            {subs.length > 0 ? subs.map((s) => (
                              <div key={s.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg">
                                <div
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-60"
                                  style={{ backgroundColor: cat.color }}
                                />
                                <span className="text-xs text-slate-500 truncate">{s.name}</span>
                              </div>
                            )) : (
                              <p className="text-xs text-slate-300 py-1.5 px-2">尚無訂閱</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 新增分類 ── */}
          {activeTab === "new" && (
            <div className="px-4 pb-4 flex flex-col gap-4">
              {/* 名稱輸入 */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">分類名稱</label>
                <input
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
                  placeholder="例：健康、交通、教育..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none placeholder-slate-300"
                />
                {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
              </div>

              {/* 顏色選擇 */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">選擇顏色</label>
                <div className="flex gap-2 items-center">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColor(color)}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {newColor === color && !isCustomColor && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                  <div className="relative flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => colorPickerRef.current?.click()}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={isCustomColor ? { backgroundColor: newColor } : { border: "2px dashed #cbd5e1" }}
                      title="自訂顏色"
                    >
                      {isCustomColor ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                          <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                    <input
                      ref={colorPickerRef}
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      tabIndex={-1}
                    />
                  </div>
                </div>
              </div>

              {/* 預覽 */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">預覽</label>
                <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-2.5">
                  <span
                    className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: newColor, color: getContrastTextColor(newColor) }}
                  >
                    {newName || "分類名稱預覽"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="border-t border-slate-100 px-4 py-4 flex items-center justify-end gap-2 flex-shrink-0">
          {activeTab === "existing" ? (
            <button
              type="button"
              onClick={() => { setIsEditing((v) => !v); setOpenCategory(null); }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {isEditing ? "取消" : "編輯"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddNew}
              disabled={!newName.trim()}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              新增
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              const validCat = lastAddedName && categories.some((c) => c.name === lastAddedName)
                ? lastAddedName
                : null;
              onClose(validCat);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#1d3557] text-white text-sm font-semibold hover:bg-[#162843] transition-colors"
          >
            完成
          </button>
        </div>
      </div>

      {/* 刪除確認 dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-xs"
            style={{ boxShadow: "0 24px 64px oklch(0% 0 0 / 0.18)" }}
          >
            <h3 className="text-sm font-semibold text-slate-800 mb-3">刪除分類</h3>
            <p className="text-xs text-slate-400 mb-5">
              確定要永久刪除「<span className="font-medium text-slate-600">{deleteTarget}</span>」嗎？此操作無法復原。
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { onRemoveCategory(deleteTarget); setDeleteTarget(null); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors text-center"
              >
                刪除
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors text-center"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
