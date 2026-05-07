import CustomDropdown from "@/components/ui/CustomDropdown";
import DatePicker from "@/components/ui/DatePicker";
import { REMINDER_OPTIONS } from "@/constants/formOptions";

function isLightColor(hex) {
  if (!hex || hex[0] !== "#" || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 0.7;
}

const inputClass =
  "w-full rounded-2xl border-0 bg-[#f8f9fb] px-5 py-4 text-base font-semibold text-slate-700 outline-none transition-shadow placeholder:text-slate-300 focus:ring-2 focus:ring-[var(--color-primary)]/25";
const labelClass = "mb-2 block text-xs font-bold tracking-wide text-slate-500";
const errorTextClass = "mt-1.5 text-xs text-red-500";

const PAYMENT_TILES = [
  {
    value: "信用卡",
    label: "信用卡",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="6" width="17" height="12" rx="2" />
        <path d="M3.5 10h17M7 15h5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "現金",
    label: "現金",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="7" width="17" height="10" rx="2" />
        <circle cx="12" cy="12" r="2.3" />
        <path d="M7 10.5v3M17 10.5v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "銀行轉帳",
    label: "銀行轉帳",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10h16L12 5 4 10ZM6 10v7M10 10v7M14 10v7M18 10v7M4.5 19h15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const FREQUENCY_OPTIONS = [
  { value: "", label: "不設定" },
  { value: "daily", label: "每天使用" },
  { value: "weekly", label: "每週使用" },
  { value: "monthly", label: "每月使用" },
  { value: "rarely", label: "很少使用" },
];

function PaymentTile({ active, dashed = false, disabled = false, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[5.75rem] flex-col items-center justify-center gap-2 rounded-2xl border bg-white px-3 py-4 text-center transition-all ${
        active
          ? "border-[var(--color-primary)] text-[var(--color-primary-strong)] shadow-[0_0_0_1px_var(--color-primary)]"
          : dashed
          ? "border-dashed border-slate-200 text-slate-300 hover:border-slate-300 hover:text-slate-400"
          : "border-[var(--color-border)] text-slate-600 hover:border-slate-200"
      } ${disabled ? "cursor-not-allowed opacity-75" : ""}`}
    >
      <span className="flex h-6 items-center justify-center">{icon}</span>
      <span className="text-[0.7rem] font-bold leading-tight">{label}</span>
    </button>
  );
}

export default function AddSubFormStep({
  formId = "add-sub-form",
  form,
  setForm,
  errors,
  setErrors,
  categories,
  onOpenCategoryModal,
  isCustomPayment,
  onOpenCustomPayment,
  onSubmit,
}) {
  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const clearError = (key) => {
    if (!errors[key]) return;
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const visibleCategories = categories.length > 0
    ? categories.slice(0, 4)
    : [
        { name: "娛樂", color: "#a78bfa" },
        { name: "工作", color: "#60a5fa" },
        { name: "生活", color: "#34d399" },
        { name: "其他", color: "#94a3b8" },
      ];

  return (
    <form id={formId} onSubmit={onSubmit} className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:gap-8">
      {/* 左欄：服務資訊 */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="form-name" className={labelClass}>服務名稱</label>
          <input
            id="form-name"
            name="name"
            value={form.name}
            onChange={(e) => {
              set("name", e.target.value);
              clearError("name");
            }}
            placeholder="Netflix"
            className={`${inputClass} ${errors.name ? "ring-2 ring-red-300" : ""}`}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className={errorTextClass} role="alert">{errors.name}</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span id="label-category" className="block text-xs font-bold tracking-wide text-slate-500">分類</span>
            <button
              type="button"
              onClick={onOpenCategoryModal}
              className="text-[0.7rem] font-bold text-slate-300 transition-colors hover:text-[var(--color-text-secondary)]"
            >
              管理
            </button>
          </div>
          <div role="group" aria-labelledby="label-category" className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f8f9fb] p-1.5 sm:grid-cols-4">
            {visibleCategories.map((category) => {
              const active = form.category === category.name;
              const bgColor = category.color ?? "#94a3b8";
              const isLightBg = isLightColor(bgColor);
              const fgColor = isLightBg ? "var(--color-text-primary)" : "#ffffff";
              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => set("category", category.name)}
                  className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-xs font-bold transition-all ${
                    active
                      ? "shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                      : "border-transparent text-slate-500 hover:bg-white/70"
                  }`}
                  style={active ? {
                    backgroundColor: bgColor,
                    color: fgColor,
                    borderColor: isLightBg ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.1)",
                  } : undefined}
                >
                  <span
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={active ? {
                      backgroundColor: isLightBg ? bgColor : "rgba(255,255,255,0.35)",
                      border: isLightBg ? "1px solid rgba(0,0,0,0.25)" : "1px solid rgba(255,255,255,0.55)",
                    } : {
                      backgroundColor: bgColor,
                      border: "1px solid #cbd5e1",
                    }}
                    aria-hidden="true"
                  />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="form-price" className={labelClass}>
            金額 (TWD)
            {form.cycle === "yearly" && (
              <span className="ml-2 font-normal text-[var(--color-primary-strong)] normal-case tracking-normal">
                請填年費總額
              </span>
            )}
          </label>
          <input
            id="form-price"
            name="price"
            type="number"
            min="0"
            inputMode="decimal"
            value={form.price}
            onChange={(e) => {
              set("price", e.target.value);
              clearError("price");
            }}
            placeholder={form.cycle === "yearly" ? "2880" : "390"}
            className={`${inputClass} tabular-nums ${errors.price ? "ring-2 ring-red-300" : ""}`}
            aria-invalid={!!errors.price}
          />
          {errors.price && <p className={errorTextClass} role="alert">{errors.price}</p>}
          {form.cycle === "yearly" && form.price > 0 && (
            <p className="mt-1.5 text-xs text-subtrack-muted tabular-nums">
              月均 NT$ {Math.round(Number(form.price) / 12).toLocaleString()}
            </p>
          )}
        </div>

        <div>
          <span id="label-billing-date" className={labelClass}>收費日期</span>
          <DatePicker
            value={form.nextBillingDate}
            onChange={(v) => {
              set("nextBillingDate", v);
              clearError("nextBillingDate");
            }}
            hasError={!!errors.nextBillingDate}
            placement="center"
            aria-labelledby="label-billing-date"
          />
          {errors.nextBillingDate && (
            <p className={errorTextClass} role="alert">{errors.nextBillingDate}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span id="label-cycle" className={labelClass}>計費週期</span>
            <div role="group" aria-labelledby="label-cycle" className="grid grid-cols-2 rounded-2xl bg-[#f8f9fb] p-1.5">
              {[
                { value: "monthly", label: "每月" },
                { value: "yearly", label: "每年" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => set("cycle", option.value)}
                  className={`h-12 rounded-xl text-sm font-bold transition-all ${
                    form.cycle === option.value
                      ? "bg-white text-[var(--color-primary-strong)] shadow-[0_4px_12px_rgba(79,111,84,0.12)]"
                      : "text-slate-500 hover:bg-white/70"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span id="label-frequency" className={labelClass}>使用頻率</span>
            <CustomDropdown
              value={form.frequency}
              onChange={(val) => set("frequency", val)}
              options={FREQUENCY_OPTIONS}
              triggerClassName="h-[3.75rem]"
              placement="top"
              aria-labelledby="label-frequency"
            />
          </div>
        </div>
      </div>

      {/* 右欄：付款設定 */}
      <div className="flex flex-col gap-6">
        <div>
          <span id="label-reminder" className={labelClass}>提前提醒</span>
          <CustomDropdown
            value={form.reminderDays}
            onChange={(val) => set("reminderDays", Number(val))}
            options={REMINDER_OPTIONS}
            triggerClassName="h-14"
            aria-labelledby="label-reminder"
          />
        </div>

        <div>
          <span id="label-payment" className={labelClass}>付款方式</span>
          <div role="group" aria-labelledby="label-payment" className="grid grid-cols-2 gap-3">
            {PAYMENT_TILES.map((method) => (
              <PaymentTile
                key={method.value}
                active={form.paymentMethod === method.value}
                icon={method.icon}
                label={method.label}
                onClick={() => set("paymentMethod", form.paymentMethod === method.value ? "" : method.value)}
              />
            ))}
            <PaymentTile
              active={isCustomPayment}
              dashed={!isCustomPayment}
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              }
              label={isCustomPayment ? form.paymentMethod : "新增方式"}
              onClick={onOpenCustomPayment}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="form-notes" className="block text-xs font-bold tracking-wide text-slate-500">備註</label>
            <span className="text-[0.7rem] font-semibold text-slate-300">選填</span>
          </div>
          <textarea
            id="form-notes"
            name="notes"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="例如：家庭方案與XX、XX共用..."
            className={`${inputClass} flex-1 resize-none font-medium leading-relaxed`}
          />
        </div>
      </div>
    </form>
  );
}
