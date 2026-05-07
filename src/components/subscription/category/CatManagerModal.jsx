import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CatManagerModal({
  mode = "manage",
  categories,
  onRemoveCategory,
  onRenameCategory,
  onRequestAddCategory,
  onClose,
  highlightedCategory,
}) {
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [draftNames, setDraftNames] = useState(() =>
    Object.fromEntries(categories.map((category) => [category.name, category.name]))
  );
  const [nameErrors, setNameErrors] = useState({});
  const listRef = useRef(null);

  const filtered = search
    ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories;

  useEffect(() => {
    if (highlightedCategory && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [highlightedCategory]);

  const handleSelect = (catName) => onClose(catName);
  const handleRename = (catName) => {
    const nextName = (draftNames[catName] ?? catName).trim();
    if (!nextName) {
      setDraftNames((prev) => ({ ...prev, [catName]: catName }));
      return;
    }
    if (nextName === catName) return;
    if (categories.some((category) => category.name === nextName)) {
      setNameErrors((prev) => ({ ...prev, [catName]: "分類名稱已存在" }));
      return;
    }

    setNameErrors((prev) => ({ ...prev, [catName]: "" }));
    onRenameCategory?.(catName, nextName);
  };

  return (
    <>
      <Dialog open={true} onOpenChange={() => onClose(null)}>
        <DialogContent size="sm" showClose={false}>
          <div className="relative w-full flex flex-col h-[480px]">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0">
              <h2 className="text-base font-bold text-slate-900">分類管理</h2>
              <button
                type="button"
                onClick={() => onClose(null)}
                aria-label="關閉"
                className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="pl-8 pr-11 pb-3 flex items-center gap-3 flex-shrink-0">
              <div className="relative flex-1 min-w-0">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜尋分類名稱"
                  className="w-full bg-slate-50 border-0 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-700 focus:outline-none placeholder-slate-300"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsEditing((v) => !v)}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors flex-shrink-0 ${
                  isEditing
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]"
                    : "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)] hover:bg-[var(--color-primary-soft)]/80"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                  <path d="M12 20h9" strokeLinecap="round" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isEditing ? "完成" : "編輯"}
              </button>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto no-scrollbar min-h-0 px-8 pb-20">
              <div className="space-y-0.5">
                {filtered.length === 0 ? (
                  <p className="text-xs text-slate-300 py-6 text-center">找不到符合的分類</p>
                ) : filtered.map((cat) => {
                  const draftName = draftNames[cat.name] ?? cat.name;
                  const nameError = nameErrors[cat.name];
                  return (
                    <div
                      key={cat.name}
                      className={`relative rounded-xl transition-colors duration-700 ${highlightedCategory === cat.name ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex min-h-10 items-center gap-2.5 px-3 py-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        {isEditing && !cat.isDefault ? (
                          <input
                            value={draftName}
                            onChange={(e) => {
                              setDraftNames((prev) => ({ ...prev, [cat.name]: e.target.value }));
                              if (nameError) setNameErrors((prev) => ({ ...prev, [cat.name]: "" }));
                            }}
                            onBlur={() => handleRename(cat.name)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur();
                              }
                              if (e.key === "Escape") {
                                setDraftNames((prev) => ({ ...prev, [cat.name]: cat.name }));
                                setNameErrors((prev) => ({ ...prev, [cat.name]: "" }));
                                e.currentTarget.blur();
                              }
                            }}
                            title={nameError || "重新命名分類"}
                            className={`min-w-0 flex-1 rounded-lg bg-transparent px-0 py-0 text-sm font-medium text-slate-700 outline-none ${
                              nameError ? "ring-2 ring-red-300" : "focus:ring-2 focus:ring-[var(--color-primary)]/20"
                            }`}
                          />
                        ) : (
                          <span className="flex-1 text-sm font-medium text-slate-700 truncate">{cat.name}</span>
                        )}
                        {isEditing && !cat.isDefault ? (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(cat.name)}
                            title={cat.isDefault ? "系統預設分類不可移除" : `移除 ${cat.name}`}
                            className="px-3 py-1 rounded-lg border border-red-100 bg-red-50 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors flex-shrink-0 disabled:border-[var(--color-border)] disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                          >
                            移除
                          </button>
                        ) : mode === "select" ? (
                          <button
                            type="button"
                            onClick={() => handleSelect(cat.name)}
                            className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors flex-shrink-0"
                          >
                            選擇
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={onRequestAddCategory}
              className="absolute bottom-5 right-8 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-strong)] transition-colors shadow-[0_10px_24px_rgba(111,143,114,0.35)]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              新增分類
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {deleteTarget && (
        <Dialog open={true} onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent size="sm" showClose={false}>
            <div className="p-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">刪除分類</h3>
              <p className="text-xs text-slate-400 mb-5">
                確定要永久刪除「<span className="font-medium text-slate-600">{deleteTarget}</span>」嗎？此操作無法復原。
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => { onRemoveCategory(deleteTarget); setDeleteTarget(null); }}
                >
                  刪除
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteTarget(null)}
                >
                  取消
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
