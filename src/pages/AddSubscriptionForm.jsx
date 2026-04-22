import { useState } from "react";
import { calcMonthlyPersonal, getToday } from "../utils/subscription";
import CustomDropdown from "../components/ui/CustomDropdown";
import CategoryManagerModal from "../components/modals/CategoryManagerModal";
import { PAYMENT_METHODS } from "../constants/paymentMethods";
import { REMINDER_OPTIONS } from "../constants/formOptions";

const emptyForm = {
  name: "",
  category: "娛樂",
  price: "",
  cycle: "monthly",
  splitMembers: [],
  nextBillingDate: "",
  reminderDays: 3,
  notes: "",
  paymentMethod: "",
};

const inputClass =
  "w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none transition-colors placeholder-slate-300";

const SHADOW = "0 2px 12px oklch(0% 0 0 / 0.10)";

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-5 rounded-full bg-[#1d3557]" />
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
    </div>
  );
}

export default function AddSubscriptionForm({ onAdd, subscriptions = [], categories = [], onAddCategory, onRemoveCategory }) {
  const [step, setStep] = useState("form"); // "form" | "confirm"
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCustomPayment, setShowCustomPayment] = useState(false);
  const [customPaymentInput, setCustomPaymentInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "請輸入服務名稱";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "請輸入有效金額";
    if (!form.nextBillingDate) newErrors.nextBillingDate = "請選擇扣款日期";
    if (form.splitMembers.some((m) => m.trim() === "")) newErrors.splitMembers = "請填寫所有分帳成員姓名";
    return newErrors;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setStep("form");
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep("confirm");
  };

  const validMembers = form.splitMembers.filter((m) => m.trim() !== "");
  const sharedWith = validMembers.length + 1;

  const handleSubmit = () => {
    onAdd({
      ...form,
      id: crypto.randomUUID(),
      price: Number(form.price),
      splitMembers: validMembers,
      sharedWith,
    });
    resetForm();
  };

  const isCustomPayment = form.paymentMethod && !PAYMENT_METHODS.some((pm) => pm.value === form.paymentMethod);

  const handleCustomPaymentConfirm = () => {
    const trimmed = customPaymentInput.trim();
    if (trimmed) setForm((p) => ({ ...p, paymentMethod: trimmed }));
    setShowCustomPayment(false);
    setCustomPaymentInput("");
  };

  const categoryOptions = categories.map((c) => ({ value: c.name, label: c.name, color: c.color }));
  const selectedCategory = categories.find((c) => c.name === form.category);
  const categoryColor = selectedCategory?.color ?? "#94a3b8";

  const monthlyPreview = form.price
    ? calcMonthlyPersonal({ price: Number(form.price), cycle: form.cycle, sharedWith })
    : 0;
  const yearlyPreview = monthlyPreview * 12;
  const existingMonthlyTotal = subscriptions.reduce((acc, s) => acc + calcMonthlyPersonal(s), 0);
  const combinedTotal = existingMonthlyTotal + monthlyPreview;
  const existingPct = combinedTotal > 0 ? (existingMonthlyTotal / combinedTotal) * 100 : 0;
  const newPct = combinedTotal > 0 ? (monthlyPreview / combinedTotal) * 100 : 0;

  const today = getToday();
  const daysUntil = form.nextBillingDate
    ? Math.ceil((new Date(form.nextBillingDate) - today) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="max-w-3xl mx-auto pb-24 lg:pb-0">
      <div className="hidden lg:block mb-6">
        <h1 className="text-3xl font-bold text-[#1d3557] leading-tight">新增訂閱</h1>
        <p className="text-sm text-slate-400 mt-1.5">填寫完成後可預覽對每月支出的財務影響</p>
      </div>

      {step === "form" ? (
        <form onSubmit={handleNext}>
          <div>

            {/* 服務資訊 */}
            <div className="py-6">
              <SectionHeader title="服務資訊" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">服務名稱</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="例：Netflix、Adobe Creative Cloud..."
                    className={`${inputClass} ${errors.name ? "border-red-400" : ""}`}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1.5" role="alert">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">分類</label>
                  <CustomDropdown
                    value={form.category}
                    onChange={(cat) => setForm((p) => ({ ...p, category: cat }))}
                    options={categoryOptions}
                    variant="white"
                    footerAction={{ label: "分類管理", onClick: () => setShowCategoryModal(true) }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">計費週期</label>
                  <div className="flex bg-slate-100 rounded-xl p-0.5 h-[42px]">
                    {[{ value: "monthly", label: "每月" }, { value: "yearly", label: "每年" }].map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, cycle: c.value }))}
                        className={`flex-1 rounded-lg text-sm font-medium transition-colors ${
                          form.cycle === c.value ? "bg-[#1d3557] text-white" : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">金額</label>
                  <div className="relative">
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0"
                      className={`${inputClass} pr-14 ${errors.price ? "border-red-400" : ""}`}
                      aria-invalid={!!errors.price}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
                      TWD
                    </span>
                  </div>
                  {errors.price && <p className="text-xs text-red-500 mt-1.5" role="alert">{errors.price}</p>}
                </div>
              </div>
            </div>

            {/* 付費資訊 */}
            <div className="py-6">
              <SectionHeader title="付費資訊" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">下次扣款日</label>
                  <input
                    name="nextBillingDate"
                    type="date"
                    value={form.nextBillingDate}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.nextBillingDate ? "border-red-400" : ""}`}
                    aria-invalid={!!errors.nextBillingDate}
                  />
                  {errors.nextBillingDate && <p className="text-xs text-red-500 mt-1.5" role="alert">{errors.nextBillingDate}</p>}
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">提前提醒天數</label>
                  <CustomDropdown
                    value={form.reminderDays}
                    onChange={(val) => setForm((p) => ({ ...p, reminderDays: Number(val) }))}
                    options={REMINDER_OPTIONS}
                    variant="white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-2.5 block">付款方式</label>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, paymentMethod: p.paymentMethod === pm.value ? "" : pm.value }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        form.paymentMethod === pm.value
                          ? "bg-[#1d3557] text-white border-[#1d3557]"
                          : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                      }`}
                    >
                      {pm.value}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomPaymentInput(isCustomPayment ? form.paymentMethod : "");
                      setShowCustomPayment(true);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isCustomPayment
                        ? "bg-[#1d3557] text-white border-[#1d3557]"
                        : "border-dashed border-slate-300 text-slate-400 bg-white hover:border-slate-400 hover:text-slate-500"
                    }`}
                  >
                    {isCustomPayment ? form.paymentMethod : "+ 其他"}
                  </button>
                </div>
              </div>
            </div>

            {/* 分帳資訊 */}
            <div className="py-6">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader title="分帳資訊" />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, splitMembers: [...p.splitMembers, ""] }))}
                  className="flex items-center gap-1 text-xs font-medium text-[#1d3557] hover:opacity-70 transition-opacity -mt-6"
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
                        onChange={(e) => setForm((p) => {
                          const next = [...p.splitMembers];
                          next[i] = e.target.value;
                          return { ...p, splitMembers: next };
                        })}
                        placeholder="輸入姓名"
                        className="flex-1 text-sm text-slate-700 bg-transparent focus:outline-none placeholder-slate-300 min-w-0"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, splitMembers: p.splitMembers.filter((_, j) => j !== i) }))}
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
              {errors.splitMembers && (
                <p className="text-xs text-red-500 mt-2">{errors.splitMembers}</p>
              )}
            </div>

            {/* 備註 */}
            <div className="py-6">
              <SectionHeader title="備註" />
              <div>
                <label className="text-xs text-slate-400 mb-2 block">
                  備註說明 <span className="text-slate-300">（選填）</span>
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="例：家庭共享方案、公司報銷項目..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-500 font-medium hover:bg-slate-50 transition-colors"
            >
              清除
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#1d3557] text-white text-sm font-semibold hover:bg-[#162843] transition-colors"
            >
              下一步 →
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {/* 確認預覽卡 */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: SHADOW }}>
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                  style={{ backgroundColor: categoryColor }}
                >
                  {form.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{form.name}</p>
                  <span
                    className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-0.5"
                    style={{ backgroundColor: categoryColor + "20", color: categoryColor }}
                  >
                    {form.category}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="bg-slate-50 rounded-xl py-4 text-center mb-4">
                <p className="text-2xl font-bold text-slate-800 leading-none">
                  <span className="text-sm font-semibold text-slate-400 mr-0.5">$</span>
                  {monthlyPreview.toFixed(0)}
                </p>
                <p className="text-xs text-slate-400 mt-1.5">/ 每月個人費用</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "帳單金額", value: `$${Number(form.price).toLocaleString()}` },
                  { label: "計費頻率", value: form.cycle === "monthly" ? "每月" : "每年" },
                  { label: "分帳人數", value: sharedWith <= 1 ? "個人訂閱" : `與 ${sharedWith - 1} 人共用` },
                  ...(form.paymentMethod ? [{ label: "付款方式", value: form.paymentMethod }] : []),
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">{item.label}</span>
                    <span className="text-xs font-semibold text-slate-700 text-right max-w-[55%] truncate">{item.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">提前提醒</span>
                    <span className="text-xs font-semibold text-slate-700">{form.reminderDays} 天前</span>
                  </div>
                  {daysUntil !== null && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">距下次扣款</span>
                      <span className={`text-xs font-semibold ${daysUntil <= 7 ? "text-amber-500" : "text-slate-700"}`}>
                        {daysUntil <= 0 ? "今日扣款" : `${daysUntil} 天`}
                      </span>
                    </div>
                  )}
                  {form.notes.trim() && (
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-xs text-slate-400 flex-shrink-0">備註</span>
                      <span className="text-xs font-semibold text-slate-700 text-right line-clamp-2">{form.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 財務影響評估 */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: SHADOW }}>
            <div className="p-5">
              <p className="text-xs font-semibold text-slate-500 mb-4">財務影響評估</p>
              {monthlyPreview > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-700">總預算佔比</span>
                      <span className="text-xs font-bold text-[#1d3557]">{newPct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full flex">
                        <div className="h-full bg-[#1d3557] transition-all duration-500" style={{ width: `${existingPct}%` }} />
                        <div className="h-full bg-[#1d3557]/40 transition-all duration-500" style={{ width: `${newPct}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#1d3557] flex-shrink-0" />
                        <span className="text-[11px] text-slate-400">現有: {existingPct.toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#1d3557]/40 flex-shrink-0" />
                        <span className="text-[11px] text-[#1d3557]/60 font-medium">新增: +{newPct.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">新增後每月預計</span>
                      <span className="text-base font-bold text-[#1d3557]">$ {combinedTotal.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="bg-[#1d3557]/5 rounded-xl p-3 flex gap-2.5 items-start">
                    <div className="w-4 h-4 rounded-full bg-[#1d3557]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-[#1d3557]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <line x1="12" y1="8" x2="12" y2="13" strokeLinecap="round" />
                        <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className="text-[11px] text-[#1d3557]/70 leading-relaxed">
                      此訂閱將佔您月支出的 {newPct.toFixed(0)}%，每月增加 ${monthlyPreview.toFixed(0)}，每年增加 ${yearlyPreview.toFixed(0)}。
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-400 leading-relaxed">填寫金額後，SubTrack 將分析此訂閱對您財務的影響。</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-500 font-medium hover:bg-slate-50 transition-colors"
            >
              返回修改
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-[#1d3557] text-white text-sm font-semibold hover:bg-[#162843] transition-colors"
            >
              確認建立
            </button>
          </div>
        </div>
      )}

      {/* 自訂付款方式 dialog */}
      {showCustomPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
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

      {showCategoryModal && (
        <CategoryManagerModal
          categories={categories}
          subscriptions={subscriptions}
          onAddCategory={onAddCategory}
          onRemoveCategory={onRemoveCategory}
          onClose={(catName) => {
            setShowCategoryModal(false);
            if (catName) setForm((p) => ({ ...p, category: catName }));
          }}
        />
      )}
    </div>
  );
}
