import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import Overview from "./pages/Overview";
import SubscriptionList from "./pages/SubscriptionList";
import AddSubscriptionForm from "./pages/AddSubscriptionForm";
import Settings from "./pages/Settings";
import Toast from "./components/ui/Toast";
import AuthPage from "./components/auth/AuthPage";
import initialData from "./data/initialSubscriptions";
import { DEFAULT_CATEGORY_LIST } from "./constants/categories";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useToast } from "./hooks/useToast";
import { useExchangeRate } from "./hooks/useExchangeRate";

function App() {
  const [authUser, setAuthUser] = useLocalStorage("authUser", null);
  const userKey = authUser?.email ?? "";
  const [subscriptions, setSubscriptions] = useLocalStorage(`subscriptions:${userKey}`, initialData);
  const [customCategories, setCustomCategories] = useLocalStorage(`customCategories:${userKey}`, []);
  const { toasts, showToast } = useToast();

  const [currency, setCurrency] = useState("TWD");
  const [currentPage, setCurrentPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const exchangeRate = useExchangeRate(currency, () => setCurrency("TWD"));

  const allCategories = [...DEFAULT_CATEGORY_LIST, ...customCategories];

  const handleAdd = (newSub) => {
    setSubscriptions((prev) => [...prev, newSub]);
    setCurrentPage("list");
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

  const handleAddCategory = (newCat) => {
    setCustomCategories((prev) => [...prev, newCat]);
  };

  const handleRemoveCategory = (catName) => {
    setCustomCategories((prev) => prev.filter((c) => c.name !== catName));
  };

  const handleClearAll = () => {
    setSubscriptions([]);
  };

  const renderPage = () => {
    if (currentPage === "add") {
      return (
        <AddSubscriptionForm
          onAdd={handleAdd}
          subscriptions={subscriptions}
          categories={allCategories}
          onAddCategory={handleAddCategory}
          onRemoveCategory={handleRemoveCategory}
        />
      );
    }
    if (currentPage === "overview") {
      return (
        <Overview
          subscriptions={subscriptions}
          currency={currency}
          exchangeRate={exchangeRate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          categories={allCategories}
          onAddCategory={handleAddCategory}
          onRemoveCategory={handleRemoveCategory}
        />
      );
    }
    if (currentPage === "settings") {
      return (
        <Settings
          currency={currency}
          onCurrencyChange={setCurrency}
          onClearAll={handleClearAll}
          showToast={showToast}
          authUser={authUser}
          onUpdateUser={(updated) => {
            setAuthUser((prev) => ({ ...prev, ...updated }));
          }}
          categories={allCategories}
          subscriptions={subscriptions}
          onAddCategory={handleAddCategory}
          onRemoveCategory={handleRemoveCategory}
        />
      );
    }
    return (
      <SubscriptionList
        subscriptions={subscriptions}
        onDelete={handleDelete}
        onEdit={handleEdit}
        currency={currency}
        exchangeRate={exchangeRate}
        categories={allCategories}
        onAddCategory={handleAddCategory}
        onRemoveCategory={handleRemoveCategory}
        onNavigate={setCurrentPage}
      />
    );
  };

  const handleLogin = (user) => {
    setAuthUser(user);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setSidebarOpen(false);
  };

  if (authUser === null) {
    return (
      <AuthPage
        onLogin={handleLogin}
        onRegister={handleLogin}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen bg-white">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          currentPage={currentPage}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div key={currentPage} className="page-enter">
            {renderPage()}
          </div>
        </main>
      </div>

      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currency={currency}
        onCurrencyChange={setCurrency}
        userName={authUser?.name ?? ""}
        onLogout={handleLogout}
      />

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
