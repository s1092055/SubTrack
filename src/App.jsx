import { useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileTabBar from "@/components/layout/MobileTabBar";
import Overview from "@/pages/Overview";
import SubList from "@/pages/SubList";
import AddSubModal from "@/components/subscription/form/AddSubModal";
import Settings from "@/pages/Settings";
import Toast from "@/components/ui/Toast";
import AuthPage from "@/components/auth/AuthPage";

import { DEFAULT_CATEGORY_LIST } from "@/constants/categories";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/useToast";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { advanceBillingDate } from "@/utils/sub";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useLocalStorage("authUser", null);
  const userKey = authUser?.email ?? "";

  const [subscriptions, setSubscriptions] = useLocalStorage(`subscriptions:${userKey}`, []);
  const [customCategories, setCustomCategories] = useLocalStorage(`customCategories:${userKey}`, []);
  const { toasts, showToast } = useToast();
  const [currency, setCurrency] = useState("TWD");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubSearch, setShowSubSearch] = useState(false);
  const exchangeRate = useExchangeRate(currency, () => setCurrency("TWD"));

  const allCategories = [
    ...DEFAULT_CATEGORY_LIST.map((category) => ({
      ...category,
      defaultName: category.name,
      isDefault: true,
    })),
    ...customCategories.map((category) => ({
      ...category,
      isDefault: false,
    })),
  ];

  const handleAdd = (newSub) => {
    setSubscriptions((prev) => [...prev, newSub]);
    setShowAddModal(false);
    showToast(`「${newSub.name}」已成功新增`);
  };

  const handleDelete = (id, name) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    showToast(`「${name}」已刪除`, "success");
  };

  const handleEdit = (updatedSub) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === updatedSub.id ? updatedSub : sub))
    );
    showToast(`「${updatedSub.name}」已更新`);
  };

  const handleAddCategory = (newCat) => setCustomCategories((prev) => [...prev, newCat]);
  const handleRemoveCategory = (catName) => {
    const isDefaultCategory = DEFAULT_CATEGORY_LIST.some(
      (category) => category.name === catName
    );

    if (isDefaultCategory) {
      showToast("系統預設分類無法移除", "error");
      return;
    }

    setCustomCategories((prev) => prev.filter((c) => c.name !== catName));
  };
  const handleRenameCategory = (oldName, newName) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;

    const isDefaultCategory = DEFAULT_CATEGORY_LIST.some(
      (category) => category.name === oldName
    );

    if (isDefaultCategory) {
      showToast("系統預設分類無法重新命名", "error");
      return;
    }

    setCustomCategories((prev) =>
      prev.map((category) =>
        category.name === oldName ? { ...category, name: trimmed } : category
      )
    );

    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.category === oldName ? { ...sub, category: trimmed } : sub
      )
    );
  };
  const handleClearAll = () => setSubscriptions([]);
  const handleImport = (data) => {
    setSubscriptions(data);
    showToast(`已匯入 ${data.length} 筆訂閱資料`);
  };
  const handleUpdateUser = (updated) => setAuthUser((prev) => ({ ...prev, ...updated }));
  const handleUpdateUsage = (id, usageStatus, lastCheckedAt) =>
    setSubscriptions((prev) =>
      prev.map((s) => s.id === id ? { ...s, usageStatus, lastCheckedAt } : s)
    );

  const handleMarkPaid = (id) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return;
    const today = new Date().toISOString().slice(0, 10);
    const newBillingDate = advanceBillingDate(sub);
    setSubscriptions((prev) =>
      prev.map((s) => s.id === id ? { ...s, lastPaidAt: today, nextBillingDate: newBillingDate } : s)
    );
    showToast(`「${sub.name}」已標註付款，下次扣款日已更新`);
  };

  const handleLogin = (user) => {
    const today = new Date().toISOString().slice(0, 10);
    setAuthUser(user.createdAt ? user : { ...user, createdAt: today });
    setSidebarOpen(false);
    navigate("/subscriptions", { replace: true });
  };

  const handleLogout = () => {
    setAuthUser(null);
    setSidebarOpen(false);
    navigate("/login", { replace: true });
  };

  if (!authUser) {
    const initialMode = location.pathname === "/signup" ? "register" : "login";
    return <AuthPage onLogin={handleLogin} onRegister={handleLogin} initialMode={initialMode} />;
  }

  return (
    <div className="flex h-screen w-screen bg-[var(--color-bg)]">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="lg:hidden">
          <TopBar
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            onOpenSearch={location.pathname === "/subscriptions" ? () => setShowSubSearch(true) : undefined}
          />
        </div>

        <main className="stable-scrollbar-gutter flex-1 overflow-auto p-4 pb-24 lg:py-8 lg:pr-10 lg-sidebar-offset">
          <div key={location.pathname} className="page-enter">
            <Routes>
              <Route path="/login"  element={<Navigate to="/subscriptions" replace />} />
              <Route path="/signup" element={<Navigate to="/subscriptions" replace />} />
              <Route path="/"       element={<Navigate to="/subscriptions" replace />} />

              <Route
                path="/overview"
                element={
                  <Overview
                    subscriptions={subscriptions}
                    currency={currency}
                    exchangeRate={exchangeRate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onUpdateUsage={handleUpdateUsage}
                    categories={allCategories}
                    onAddCategory={handleAddCategory}
                    onRemoveCategory={handleRemoveCategory}
                    onRenameCategory={handleRenameCategory}
                    authUser={authUser}
                    accountCreatedAt={authUser?.createdAt ?? new Date().toISOString().slice(0, 10)}
                  />
                }
              />
              <Route
                path="/subscriptions"
                element={
                  <SubList
                    subscriptions={subscriptions}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onUpdateUsage={handleUpdateUsage}
                    onMarkPaid={handleMarkPaid}
                    currency={currency}
                    exchangeRate={exchangeRate}
                    categories={allCategories}
                    onAddCategory={handleAddCategory}
                    onRemoveCategory={handleRemoveCategory}
                    onRenameCategory={handleRenameCategory}
                    onOpenAdd={() => setShowAddModal(true)}
                    authUser={authUser}
                    showSearch={showSubSearch}
                    onSearchChange={setShowSubSearch}
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <Settings
                    currency={currency}
                    onCurrencyChange={setCurrency}
                    onClearAll={handleClearAll}
                    onImport={handleImport}
                    showToast={showToast}
                    authUser={authUser}
                    onUpdateUser={handleUpdateUser}
                    categories={allCategories}
                    subscriptions={subscriptions}
                    onAddCategory={handleAddCategory}
                    onRemoveCategory={handleRemoveCategory}
                    onRenameCategory={handleRenameCategory}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/subscriptions" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={authUser?.name ?? ""}
        onLogout={handleLogout}
        onOpenAdd={() => { setSidebarOpen(false); setShowAddModal(true); }}
      />

      <MobileTabBar onOpenAdd={() => setShowAddModal(true)} />

      {showAddModal && (
        <AddSubModal
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
          subscriptions={subscriptions}
          categories={allCategories}
          onAddCategory={handleAddCategory}
          onRemoveCategory={handleRemoveCategory}
          onRenameCategory={handleRenameCategory}
          authUser={authUser}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
