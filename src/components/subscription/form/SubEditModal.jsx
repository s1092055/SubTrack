import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CustomPaymentDialog from "@/components/ui/CustomPaymentDialog";

import AddCatModal from "@/components/subscription/category/AddCatModal";
import AddSubFormStep from "@/components/subscription/form/AddSubFormStep";
import CatManagerModal from "@/components/subscription/category/CatManagerModal";
import SplitMembersModal from "@/components/subscription/split/SplitMembersModal";

import { getAvatarColor } from "@/constants/brandColors";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";

import {
  buildUpdatedSubscriptionPayload,
  createFormFromSubscription,
  validateSubscriptionForm,
} from "@/utils/subForm";

export default function SubEditModal({
  sub,
  onSave,
  onClose,
  categories = [],
  onAddCategory,
  onRemoveCategory,
  onRenameCategory,
  authUser,
}) {
  const [form, setForm] = useState(() => createFormFromSubscription(sub));
  const [errors, setErrors] = useState({});
  const [showCustomPayment, setShowCustomPayment] = useState(false);
  const [customPaymentInput, setCustomPaymentInput] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [highlightedCategory, setHighlightedCategory] = useState(null);
  const [showSplitModal, setShowSplitModal] = useState(false);

  const isCustomPayment =
    form.paymentMethod && !PAYMENT_METHODS.some((pm) => pm.value === form.paymentMethod);

  const displayName = form.name.trim() || sub.name || "編輯訂閱";
  const avatarColor = form.avatarColor || getAvatarColor(displayName);

  function handleCustomPaymentConfirm() {
    const trimmed = customPaymentInput.trim();
    if (trimmed) setForm((p) => ({ ...p, paymentMethod: trimmed }));
    setShowCustomPayment(false);
    setCustomPaymentInput("");
  }

  function handleSave(e) {
    e?.preventDefault();

    const next = validateSubscriptionForm(form);
    setErrors(next);

    if (Object.keys(next).length > 0) return;

    onSave(buildUpdatedSubscriptionPayload(sub, form));
  }

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent
          size="lg"
          showClose={false}
          title={`編輯 ${sub.name}`}
          description="修改此訂閱的金額、扣款日期、分類、付款方式與分帳設定。"
        >
          <div
            className="w-full flex flex-col overflow-hidden"
            style={{ maxHeight: "var(--modal-max-height)" }}
          >
            <div className="flex items-center gap-4 px-6 pt-6 pb-5 md:px-8 flex-shrink-0">
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-sm"
                  style={{ backgroundColor: avatarColor }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <label
                  className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white shadow-sm cursor-pointer overflow-hidden"
                  style={{ backgroundColor: avatarColor }}
                  aria-label="選擇圖示背景顏色"
                  title="選擇圖示背景顏色"
                >
                  <input
                    type="color"
                    value={avatarColor}
                    onChange={(e) => setForm((p) => ({ ...p, avatarColor: e.target.value }))}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </label>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-bold text-slate-900 leading-tight truncate">{displayName}</p>
                <p className="text-xs font-semibold text-[var(--color-text-secondary)]/60 mt-1">訂閱付費服務</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="關閉"
                className="w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="px-6 pb-6 md:px-8">
                <AddSubFormStep
                  formId="edit-sub-form"
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  setErrors={setErrors}
                  categories={categories}
                  onOpenCategoryModal={() => setShowCategoryModal(true)}
                  isCustomPayment={isCustomPayment}
                  onOpenCustomPayment={() => {
                    setCustomPaymentInput(isCustomPayment ? form.paymentMethod : "");
                    setShowCustomPayment(true);
                  }}
                  onSubmit={handleSave}
                />
              </div>
            </div>

            <div className="flex-shrink-0 px-6 py-5 md:px-8 border-t border-[var(--color-border)] bg-[var(--color-card)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setShowSplitModal(true)}
                  className="inline-flex items-center justify-center sm:justify-start gap-2 px-2 py-2 text-sm font-bold text-[var(--color-primary-strong)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  管理分帳成員
                </button>

                <div className="w-full sm:w-44">
                  <Button
                    type="submit"
                    form="edit-sub-form"
                    variant="default"
                    className="w-full rounded-2xl shadow-[0_12px_28px_rgba(29,53,87,0.28)]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    儲存變更
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showSplitModal && (
        <SplitMembersModal
          sub={{ ...form, price: Number(form.price) || 0 }}
          splitMembers={form.splitMembers}
          authUser={authUser}
          onSave={(members) => {
            setForm((p) => ({ ...p, splitMembers: members }));
            setShowSplitModal(false);
          }}
          onClose={() => setShowSplitModal(false)}
        />
      )}

      {showCategoryModal && (
        <CatManagerModal
          mode="select"
          categories={categories}
          onRemoveCategory={onRemoveCategory}
          onRenameCategory={(oldName, newName) => {
            onRenameCategory?.(oldName, newName);
            setForm((prev) =>
              prev.category === oldName ? { ...prev, category: newName } : prev
            );
          }}
          highlightedCategory={highlightedCategory}
          onRequestAddCategory={() => {
            setShowCategoryModal(false);
            setShowAddCatModal(true);
          }}
          onClose={(catName) => {
            setShowCategoryModal(false);
            if (catName) setForm((p) => ({ ...p, category: catName }));
          }}
        />
      )}

      {showAddCatModal && (
        <AddCatModal
          mode="select"
          existingNames={categories.map((c) => c.name)}
          onCreate={(newCat, applyImmediately) => {
            onAddCategory(newCat);
            setShowAddCatModal(false);
            if (applyImmediately) {
              setHighlightedCategory(null);
              setForm((p) => ({ ...p, category: newCat.name }));
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

      {showCustomPayment && (
        <CustomPaymentDialog
          value={customPaymentInput}
          onChange={setCustomPaymentInput}
          onConfirm={handleCustomPaymentConfirm}
          onClose={() => setShowCustomPayment(false)}
        />
      )}
    </>
  );
}
