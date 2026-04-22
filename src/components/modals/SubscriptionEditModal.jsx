import { useState } from "react";
import { useScrollLock } from "../../hooks/useScrollLock";
import { getAvatarColor } from "../../constants/brandColors";
import CustomDropdown from "../ui/CustomDropdown";
import CategoryManagerModal from "../modals/CategoryManagerModal";
import { PAYMENT_METHODS } from "../../constants/paymentMethods";
import { REMINDER_OPTIONS } from "../../constants/formOptions";

const inputClass =
  "w-full bg-slate-100 border-0 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none";

export default function SubscriptionEditModal({ sub, onSave, onClose, categories = [], subscriptions = [], onAddCategory, onRemoveCategory }) {
  useScrollLock();
  const [form, setForm] = useState({
    name: sub.name,
    category: sub.category,
    price: sub.price,
    cycle: sub.cycle,
    nextBillingDate: sub.nextBillingDate,
    reminderDays: sub.reminderDays ?? 3,
    paymentMethod: sub.paymentMethod ?? "",
    splitMembers: sub.splitMembers ?? [],
    notes: sub.notes ?? "",
  });

  const [showCustomPayment, setShowCustomPayment] = useState(false);
  const [customPaymentInput, setCustomPaymentInput] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const isCustomPayment = form.paymentMethod && !PAYMENT_METHODS.some((pm) => pm.value === form.paymentMethod);

  const handleCustomPaymentConfirm = () => {
    const trimmed = customPaymentInput.trim();
    if (trimmed) set("paymentMethod", trimmed);
    setShowCustomPayment(false);
    setCustomPaymentInput("");
  };

  const validMembers = form.splitMembers.filter((m) => m.trim() !== "");
  const sharedWith = validMembers.length + 1;

  const handleSave = () => {
    onSave({ ...sub, ...form, price: Number(form.price), splitMembers: validMembers, sharedWith });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden"
        style={{ boxShadow: "0 24px 64px oklch(0% 0 0 / 0.18)" }}
      >
        {/* ── 標頭 ── */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
            style={{ backgroundColor: getAvatarColor(sub.name) }}
          >
            {sub.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-slate-900 leading-tight truncate">
              {form.name || sub.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* 服務名稱 + 分類 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">服務名稱</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="服務名稱"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">分類</label>
              <CustomDropdown
                value={form.category}
                onChange={(val) => set("category", val)}
                options={categories.map((c) => ({ value: c.name, label: c.name, color: c.color }))}
                footerAction={{ label: "分類管理", onClick: () => setShowCategoryModal(true) }}
              />
            </div>
          </div>

          {/* 計費週期 + 金額 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">計費週期</label>
              <CustomDropdown
                value={form.cycle}
                onChange={(val) => set("cycle", val)}
                options={[
                  { value: "monthly", label: "每月" },
                  { value: "yearly", label: "每年" },
                ]}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">金額</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                  TWD
                </span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="w-full bg-slate-100 border-0 rounded-xl pl-14 pr-4 py-3 text-sm text-slate-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 下次扣款日 + 提前提醒天數 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">下次扣款日</label>
              <input
                type="date"
                value={form.nextBillingDate}
                onChange={(e) => set("nextBillingDate", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">提前提醒天數</label>
              <CustomDropdown
                value={form.reminderDays}
                onChange={(val) => set("reminderDays", Number(val))}
                options={REMINDER_OPTIONS}
              />
            </div>
          </div>

          {/* 付款方式 */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">付款方式</label>
            <div className="flex items-center gap-2">
              <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.value}
                    type="button"
                    onClick={() => set("paymentMethod", form.paymentMethod === pm.value ? "" : pm.value)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      form.paymentMethod === pm.value
                        ? "bg-[#1d3557] text-white border-[#1d3557]"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {pm.value}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setCustomPaymentInput(isCustomPayment ? form.paymentMethod : "");
                  setShowCustomPayment(true);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isCustomPayment
                    ? "bg-[#1d3557] text-white border-[#1d3557]"
                    : "border-dashed border-slate-300 text-slate-400 bg-white hover:border-slate-400 hover:text-slate-500"
                }`}
              >
                {isCustomPayment ? form.paymentMethod : "+ 其他"}
              </button>
            </div>
          </div>

          {/* 分帳資訊 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-500">分帳資訊</label>
              <button
                type="button"
                onClick={() => set("splitMembers", [...form.splitMembers, ""])}
                className="flex items-center gap-1 text-xs font-medium text-[#1d3557] hover:opacity-70 transition-opacity"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                  <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                </svg>
                新增成員
              </button>
            </div>
            {form.splitMembers.length === 0 ? (
              <div className="flex items-center justify-center h-[42px] rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                個人訂閱，點擊新增分帳成員
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                {form.splitMembers.map((name, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2.5 ${i > 0 ? "border-t border-slate-100" : ""}`}>
                    <span className="text-xs text-slate-400 w-4 flex-shrink-0">{i + 1}</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        const next = [...form.splitMembers];
                        next[i] = e.target.value;
                        set("splitMembers", next);
                      }}
                      placeholder="輸入姓名"
                      className="flex-1 text-sm text-slate-700 bg-transparent focus:outline-none placeholder-slate-300 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => set("splitMembers", form.splitMembers.filter((_, j) => j !== i))}
                      className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 備註說明 */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">備註說明 <span className="text-slate-300">（選填）</span></label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="例：家庭共享方案、公司報銷項目..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* ── 儲存按鈕 ── */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#1d3557] text-white text-sm font-semibold hover:bg-[#162843] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            儲存變更
          </button>
          <p className="text-center text-[11px] text-slate-400">
            更新訂閱詳情將即時反映在您的預算摘要與財務報表中。
          </p>
        </div>
      </div>

      {showCategoryModal && (
        <CategoryManagerModal
          categories={categories}
          subscriptions={subscriptions}
          onAddCategory={onAddCategory}
          onRemoveCategory={onRemoveCategory}
          onClose={(catName) => {
            setShowCategoryModal(false);
            if (catName) set("category", catName);
          }}
        />
      )}

      {showCustomPayment && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCustomPayment(false); }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs" style={{ boxShadow: "0 24px 64px oklch(0% 0 0 / 0.18)" }}>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">自訂付款方式</h3>
            <p className="text-xs text-slate-400 mb-4">輸入信用卡、電子支付或其他方式的名稱</p>
            <input
              autoFocus
              value={customPaymentInput}
              onChange={(e) => setCustomPaymentInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCustomPaymentConfirm(); }}
              placeholder="例：玉山信用卡、PayPal..."
              className={inputClass}
            />
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleCustomPaymentConfirm}
                className="flex-[2] py-2.5 rounded-xl bg-[#1d3557] text-white text-sm font-semibold hover:bg-[#162843] transition-colors"
              >
                確認
              </button>
              <button
                type="button"
                onClick={() => setShowCustomPayment(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
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
