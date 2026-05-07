import { hashPassword } from "../../utils/auth";
import { DEV_SUBSCRIPTIONS } from "../../data/devSubs";

const DEV_EMAIL = "test@subtrack.dev";

export default function DevLoginButton({ onLogin }) {
  const handleClick = async () => {
    const hashed = await hashPassword("test123");
    const stored = localStorage.getItem("authUser");
    const existing = stored ? JSON.parse(stored) : null;
    const createdAt = existing?.createdAt ?? new Date().toISOString().slice(0, 10);
    const u = {
      name: "測試用戶",
      email: DEV_EMAIL,
      password: hashed,
      createdAt,
      monthlyIncome: 60000,
      monthlyBudget: 3000,
    };
    localStorage.setItem("authUser", JSON.stringify(u));

    const subsKey = `subscriptions:${DEV_EMAIL}`;
    if (!localStorage.getItem(subsKey)) {
      localStorage.setItem(subsKey, JSON.stringify(DEV_SUBSCRIPTIONS));
    }

    onLogin(u);
  };
  return (
    <button type="button" onClick={handleClick}
      className="border border-dashed border-slate-300 text-slate-400 px-4 py-2 rounded-xl text-xs hover:border-slate-400 hover:text-slate-500 transition-colors">
      開發模式快速登入
    </button>
  );
}
