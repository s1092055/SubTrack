import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hashPassword } from "../../utils/auth";
import LoginForm from "./LoginForm";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import RegisterStep3 from "./RegisterStep3";

export default function AuthPage({ onLogin, onRegister, initialMode = "login" }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (next) => {
    setMode(next); setStep(1); setError("");
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    setMonthlyIncome(""); setMonthlyBudget("");
    navigate(next === "login" ? "/login" : "/signup");
  };

  const goBack = () => { setStep((s) => s - 1); setError(""); };

  const handleLogin = async (e) => {
    e.preventDefault(); setError("");
    if (!email || !password) { setError("請填寫電子郵件與密碼。"); return; }
    const saved = localStorage.getItem("authUser");
    if (!saved) { setError("此帳號不存在，請先註冊。"); return; }
    const user = JSON.parse(saved);
    setIsLoading(true);
    const hashed = await hashPassword(password);
    setIsLoading(false);
    if (user.email !== email || user.password !== hashed) { setError("電子郵件或密碼錯誤。"); return; }
    onLogin(user);
  };

  const handleStep1Next = (e) => {
    e.preventDefault(); setError("");
    if (!name || !email || !password || !confirmPassword) { setError("請填寫所有欄位。"); return; }
    if (password !== confirmPassword) { setError("兩次密碼輸入不一致。"); return; }
    if (password.length < 6) { setError("密碼至少需要 6 個字元。"); return; }
    setStep(2);
  };

  const handleStep2Next = (e) => { e.preventDefault(); setStep(3); };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const hashed = await hashPassword(password);
    setIsLoading(false);
    const today = new Date().toISOString().slice(0, 10);
    const user = { name, email, password: hashed, monthlyIncome, monthlyBudget, createdAt: today };
    localStorage.setItem("authUser", JSON.stringify(user));
    onRegister(user);
  };

  if (mode === "login") {
    return (
      <LoginForm
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        showPassword={showPassword} setShowPassword={setShowPassword}
        error={error}
        isLoading={isLoading}
        onSubmit={handleLogin}
        onSwitchToRegister={() => switchMode("register")}
        onLogin={onLogin}
      />
    );
  }

  if (step === 1) {
    return (
      <RegisterStep1
        name={name} setName={setName}
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
        showPassword={showPassword} setShowPassword={setShowPassword}
        error={error}
        onSubmit={handleStep1Next}
        onSwitchToLogin={() => switchMode("login")}
        onQuickLogin={onRegister}
      />
    );
  }

  if (step === 2) {
    return (
      <RegisterStep2
        monthlyIncome={monthlyIncome} setMonthlyIncome={setMonthlyIncome}
        monthlyBudget={monthlyBudget} setMonthlyBudget={setMonthlyBudget}
        onSubmit={handleStep2Next}
        onBack={goBack}
      />
    );
  }

  return (
    <RegisterStep3
      name={name}
      email={email}
      monthlyIncome={monthlyIncome}
      monthlyBudget={monthlyBudget}
      isLoading={isLoading}
      onSubmit={handleFinalSubmit}
      onBack={goBack}
      onEditStep1={() => setStep(1)}
      onEditStep2={() => setStep(2)}
    />
  );
}
