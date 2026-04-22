import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import CustomDropdown from "../components/ui/CustomDropdown";
import Toggle from "../components/ui/Toggle";
import CategoryManagerModal from "../components/modals/CategoryManagerModal";
import EditFieldDialog from "../components/modals/EditFieldDialog";
import AddPaymentDialog from "../components/modals/AddPaymentDialog";
import PasswordDialog from "../components/modals/PasswordDialog";
import FinanceModal from "../components/modals/FinanceModal";
import { PAYMENT_METHODS } from "../constants/paymentMethods";

const CURRENCY_OPTIONS = [
  { value: "TWD", label: "TWD - 新台幣" },
  { value: "USD", label: "USD - 美元" },
];

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-5">
      <div className="min-w-0 mr-6">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function Settings({
  currency,
  onCurrencyChange,
  onClearAll,
  showToast,
  authUser,
  onUpdateUser,
  categories = [],
  subscriptions = [],
  onAddCategory,
  onRemoveCategory,
}) {
  const [profileName, setProfileName] = useState(authUser?.name ?? "");
  const [profileEmail, setProfileEmail] = useState(authUser?.email ?? "");
  const [editingField, setEditingField] = useState(null); // "name" | "email"

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const [monthlyIncome, setMonthlyIncome] = useState(authUser?.monthlyIncome ?? "");
  const [monthlyBudget, setMonthlyBudget] = useState(authUser?.monthlyBudget ?? "");
  const [showFinanceDialog, setShowFinanceDialog] = useState(false);

  const [language, setLanguage] = useLocalStorage("language", "zh-TW");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [defaultPayment, setDefaultPayment] = useState("");
  const [customPayments, setCustomPayments] = useState([]);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  const [renewalAlert, setRenewalAlert] = useLocalStorage("renewalAlert", false);
  const [rateAlert, setRateAlert] = useLocalStorage("rateAlert", false);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    onClearAll();
    setShowResetConfirm(false);
    showToast("所有資料已清除");
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* 頁面標題 */}
      <div className="hidden lg:block mb-6">
        <h1 className="text-3xl font-bold text-[#1d3557] leading-tight">偏好設定</h1>
        <p className="text-sm text-slate-400 mt-1.5">個人化您的訂閱管理體驗與帳戶安全。</p>
      </div>

      <div className="divide-y divide-slate-100 [&>section]:py-10 [&>section:first-child]:pt-0 [&>section:last-child]:pb-16">

        {/* ── 帳戶設定 ── */}
        <section>
          <h2 className="text-base font-semibold text-slate-400 uppercase tracking-widest mb-6">帳戶設定</h2>
          <div className="space-y-8">

            {/* 個人資料 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">個人資料</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="py-2.5 border-b border-slate-100">
                  <p className="text-xs text-slate-400 mb-0.5">使用者名稱</p>
                  <div className="flex items-center justify-between lg:justify-start lg:gap-1">
                    <p className="text-sm font-medium text-slate-800">{profileName || "未設定"}</p>
                    <button type="button" onClick={() => setEditingField("name")} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0">
                      <EditIcon />
                    </button>
                  </div>
                </div>
                <div className="py-2.5 border-b border-slate-100">
                  <p className="text-xs text-slate-400 mb-0.5">電子郵件</p>
                  <div className="flex items-center justify-between lg:justify-start lg:gap-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{profileEmail || "未設定"}</p>
                    <button type="button" onClick={() => setEditingField("email")} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0">
                      <EditIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 帳號與密碼 */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">帳號與密碼</h3>
              <div className="py-2.5 border-b border-slate-100">
                <p className="text-xs text-slate-400 mb-0.5">密碼</p>
                <div className="flex items-center justify-between lg:justify-start lg:gap-1">
                  <p className="text-sm font-medium text-slate-400 tracking-widest">••••••••</p>
                  <button type="button" onClick={() => setShowPasswordDialog(true)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0">
                    <EditIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* 財務設定 */}
            <div>
              <div className="flex items-center justify-between lg:justify-start lg:gap-1 mb-3">
                <h3 className="text-sm font-semibold text-slate-700">財務設定</h3>
                <button type="button" onClick={() => setShowFinanceDialog(true)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0">
                  <EditIcon />
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="py-2.5 border-b border-slate-100">
                  <p className="text-xs text-slate-400 mb-0.5">每月預計收入</p>
                  <p className="text-sm font-medium text-slate-800">
                    {monthlyIncome ? `NT$ ${Number(monthlyIncome).toLocaleString()}` : "未設定"}
                  </p>
                </div>
                <div className="py-2.5 border-b border-slate-100">
                  <p className="text-xs text-slate-400 mb-0.5">每月訂閱預算</p>
                  <p className="text-sm font-medium text-slate-800">
                    {monthlyBudget ? `NT$ ${Number(monthlyBudget).toLocaleString()}` : "未設定"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 個人化設定 ── */}
        <section>
          <h2 className="text-base font-semibold text-slate-400 uppercase tracking-widest mb-2">個人化設定</h2>
          <div>
            <SettingRow label="分類管理" description="自定義您的訂閱分類及顏色">
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center gap-1 text-sm font-semibold text-[#1d3557] hover:opacity-70 transition-opacity"
              >
                管理分類
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </SettingRow>
            <SettingRow label="預設付款" description="設定新增訂閱時的預設付款方式">
              <CustomDropdown
                value={defaultPayment}
                onChange={setDefaultPayment}
                options={[
                  { value: "", label: "未設定" },
                  ...PAYMENT_METHODS.map((pm) => ({ value: pm.value, label: pm.value })),
                  ...customPayments.map((pm) => ({ value: pm, label: pm })),
                ]}
                variant="white"
                className="w-44"
                footerAction={{ label: "新增付款", onClick: () => setShowAddPaymentDialog(true) }}
              />
            </SettingRow>
            <SettingRow label="顯示貨幣" description="所有金額將以此貨幣顯示">
              <CustomDropdown
                value={currency}
                onChange={onCurrencyChange}
                options={CURRENCY_OPTIONS}
                variant="white"
                className="w-44"
              />
            </SettingRow>
            <SettingRow label="顯示語言" description="選擇您習慣的顯示語言">
              <div className="flex bg-slate-100 rounded-xl p-0.5">
                {[{ value: "zh-TW", label: "繁中" }, { value: "en", label: "EN" }].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLanguage(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      language === opt.value ? "bg-white text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </div>
        </section>

        {/* ── 通知設定 ── */}
        <section>
          <h2 className="text-base font-semibold text-slate-400 uppercase tracking-widest mb-2">通知設定</h2>
          <div>
            <SettingRow label="續訂提醒" description="在訂閱到期前提前獲得通知">
              <Toggle enabled={renewalAlert} onToggle={() => setRenewalAlert((p) => !p)} />
            </SettingRow>
            <SettingRow label="匯率變動" description="當匯率波動超過 3% 時通知">
              <Toggle enabled={rateAlert} onToggle={() => setRateAlert((p) => !p)} />
            </SettingRow>
          </div>
        </section>

        {/* ── 資料管理 ── */}
        <section>
          <h2 className="text-base font-semibold text-slate-400 uppercase tracking-widest mb-2">資料管理</h2>
          <div>
            <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-semibold text-red-600">刪除帳戶</p>
                <p className="text-xs text-red-400 mt-0.5">此操作將永久刪除所有訂閱記錄，無法復原。</p>
              </div>
              {showResetConfirm ? (
                <div className="flex gap-2 flex-shrink-0">
                  <button type="button" onClick={handleReset} className="px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">確認刪除</button>
                  <button type="button" onClick={() => setShowResetConfirm(false)} className="px-3 py-2 rounded-xl border border-red-200 text-xs text-red-500 hover:bg-red-100 transition-colors">取消</button>
                </div>
              ) : (
                <button type="button" onClick={() => setShowResetConfirm(true)} className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
                  刪除帳戶
                </button>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* ── Modals & Dialogs ── */}
      {showAddPaymentDialog && (
        <AddPaymentDialog
          onSave={(v) => {
            const trimmed = v.trim();
            if (trimmed && !PAYMENT_METHODS.some((pm) => pm.value === trimmed) && !customPayments.includes(trimmed)) {
              setCustomPayments((p) => [...p, trimmed]);
              setDefaultPayment(trimmed);
            }
          }}
          onClose={() => setShowAddPaymentDialog(false)}
        />
      )}

      {showCategoryModal && (
        <CategoryManagerModal
          categories={categories}
          subscriptions={subscriptions}
          onAddCategory={onAddCategory}
          onRemoveCategory={onRemoveCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {editingField === "name" && (
        <EditFieldDialog
          title="使用者名稱"
          value={profileName}
          onSave={(v) => {
            if (!v.trim()) return showToast("名稱不可為空", "error");
            setProfileName(v.trim());
            onUpdateUser({ name: v.trim() });
            showToast("名稱已更新");
          }}
          onClose={() => setEditingField(null)}
        />
      )}

      {editingField === "email" && (
        <EditFieldDialog
          title="電子郵件"
          value={profileEmail}
          type="email"
          onSave={(v) => {
            setProfileEmail(v.trim());
            onUpdateUser({ email: v.trim() });
            showToast("電子郵件已更新");
          }}
          onClose={() => setEditingField(null)}
        />
      )}

      {showPasswordDialog && (
        <PasswordDialog
          authUser={authUser}
          onSave={(newPw) => { onUpdateUser({ password: newPw }); showToast("密碼已更新"); }}
          onClose={() => setShowPasswordDialog(false)}
          showToast={showToast}
        />
      )}

      {showFinanceDialog && (
        <FinanceModal
          income={monthlyIncome}
          budget={monthlyBudget}
          onSave={(income, budget) => {
            setMonthlyIncome(income);
            setMonthlyBudget(budget);
            onUpdateUser({ monthlyIncome: income, monthlyBudget: budget });
            showToast("財務設定已更新");
          }}
          onClose={() => setShowFinanceDialog(false)}
        />
      )}
    </div>
  );
}
