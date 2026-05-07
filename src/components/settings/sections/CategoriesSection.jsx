import { useState } from "react";

import AddCatModal from "@/components/subscription/category/AddCatModal";
import CatManagerModal from "@/components/subscription/category/CatManagerModal";
import { SectionBlock } from "@/components/settings/shared/SectionBlock";

export default function CategoriesSection({
  categories,
  onAddCategory,
  onRemoveCategory,
  onRenameCategory,
}) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [highlightedCategory, setHighlightedCategory] = useState(null);

  return (
    <>
      <SectionBlock>
        <div className="py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-700">分類列表</p>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="text-xs font-semibold text-[var(--color-primary-strong)] underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              管理分類
            </button>
          </div>
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">尚無自訂分類</p>
          )}
        </div>
        <div className="py-4">
          <p className="text-xs text-slate-400">共 {categories.length} 個分類</p>
        </div>
      </SectionBlock>

      {showCategoryModal && (
        <CatManagerModal
          categories={categories}
          onRemoveCategory={onRemoveCategory}
          onRenameCategory={onRenameCategory}
          highlightedCategory={highlightedCategory}
          onRequestAddCategory={() => {
            setShowCategoryModal(false);
            setShowAddCatModal(true);
          }}
          onClose={() => {
            setShowCategoryModal(false);
            setHighlightedCategory(null);
          }}
        />
      )}

      {showAddCatModal && (
        <AddCatModal
          existingNames={categories.map((c) => c.name)}
          onCreate={(newCat, applyImmediately) => {
            onAddCategory(newCat);
            setShowAddCatModal(false);
            if (applyImmediately) {
              setHighlightedCategory(null);
            } else {
              setHighlightedCategory(newCat.name);
              setShowCategoryModal(true);
            }
          }}
          onClose={() => {
            setShowAddCatModal(false);
            setShowCategoryModal(true);
          }}
        />
      )}
    </>
  );
}
