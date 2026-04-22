import { useState } from "react";
import { calcBudgetAnalysis } from "../../utils/finance";
import { formatMoney } from "../../utils/format";
import { hashPassword } from "../../utils/auth";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022" />
      <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00" />
      <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF" />
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900" />
    </svg>
  );
}

function PasswordToggle({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
      {show ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2 mb-8 max-w-xs mx-auto">
      {[1, 2, 3].map((step, i) => {
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              done ? "bg-slate-300 text-slate-500" : active ? "bg-[#1d3557] text-white" : "bg-slate-100 text-slate-400"
            }`}>
              {done ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="text-xs font-bold">{step}</span>
              )}
            </div>
            {i < 2 && <div className={`flex-1 h-px transition-colors ${done ? "bg-[#1d3557]" : "bg-slate-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function BudgetAnalysis({ monthlyIncome, monthlyBudget }) {
  const { income, percentage, color, analysisText } = calcBudgetAnalysis(monthlyIncome, monthlyBudget);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = income === 0 ? circumference : circumference - (Math.min(percentage, 100) / 100) * circumference;
  return (
    <div className="h-full flex flex-col">
      <p className="text-xs font-semibold text-[#1d3557] mb-4 uppercase tracking-wide">預算分析</p>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <svg width="120" height="120" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={dashoffset}
            strokeLinecap="round" transform="rotate(-90 48 48)"
            style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.3s ease" }} />
          <text x="48" y="53" textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>
            {income === 0 ? "—" : `${percentage}%`}
          </text>
        </svg>
        <div className="text-center">
          <p className="text-base font-bold text-slate-800 mb-1">
            {income === 0 ? "尚未輸入收入" : `預算佔收入的 ${percentage}%`}
          </p>
          <p className="text-sm text-slate-500">{analysisText}</p>
        </div>
      </div>
    </div>
  );
}

function BudgetAnalysisCompact({ monthlyIncome, monthlyBudget }) {
  const { income, percentage, color, analysisText } = calcBudgetAnalysis(monthlyIncome, monthlyBudget);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = income === 0 ? circumference : circumference - (Math.min(percentage, 100) / 100) * circumference;
  return (
    <div className="flex items-center justify-center gap-4">
      <svg width="56" height="56" viewBox="0 0 48 48" className="flex-shrink-0">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle cx="24" cy="24" r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={dashoffset}
          strokeLinecap="round" transform="rotate(-90 24 24)"
          style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.3s ease" }} />
        <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>
          {income === 0 ? "—" : `${percentage}%`}
        </text>
      </svg>
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {income === 0 ? "尚未輸入收入" : `預算佔收入的 ${percentage}%`}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{analysisText}</p>
      </div>
    </div>
  );
}

function DevLoginButton({ onLogin }) {
  const handleClick = async () => {
    const hashed = await hashPassword("test123");
    const u = { name: "測試用戶", email: "test@subtrack.dev", password: hashed };
    localStorage.setItem("authUser", JSON.stringify(u));
    onLogin(u);
  };
  return (
    <button type="button" onClick={handleClick}
      className="border border-dashed border-slate-300 text-slate-400 px-4 py-2 rounded-xl text-xs hover:border-slate-400 hover:text-slate-500 transition-colors">
      開發模式快速登入
    </button>
  );
}

function LoginShell({ children }) {
  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="flex-shrink-0 w-full flex justify-center pt-8 pb-2">
        <p className="font-extrabold text-[#1d3557] text-sm tracking-widest">SUBTRACK</p>
      </header>
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center px-6 pt-12 pb-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

function RegisterShell({ children, footer, maxWidth = "max-w-sm" }) {
  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="flex-shrink-0 w-full flex justify-center pt-8 pb-2">
        <p className="font-extrabold text-[#1d3557] text-sm tracking-widest">SUBTRACK</p>
      </header>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className={`w-full ${maxWidth} mx-auto px-6 pt-10 pb-6`}>
          {children}
        </div>
      </div>
      <div className="flex-shrink-0 bg-white border-t border-slate-100 px-6">
        <div className="w-full max-w-2xl mx-auto h-16 flex items-center">
          {footer}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [error, setError] = useState("");

  const switchMode = (next) => {
    setMode(next); setStep(1); setError("");
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    setMonthlyIncome(""); setMonthlyBudget("");
  };

  const goBack = () => { setStep((s) => s - 1); setError(""); };

  const handleLogin = async (e) => {
    e.preventDefault(); setError("");
    if (!email || !password) { setError("請填寫電子郵件與密碼。"); return; }
    const saved = localStorage.getItem("authUser");
    if (!saved) { setError("此帳號不存在，請先註冊。"); return; }
    const user = JSON.parse(saved);
    const hashed = await hashPassword(password);
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
    const hashed = await hashPassword(password);
    const user = { name, email, password: hashed, monthlyIncome, monthlyBudget };
    localStorage.setItem("authUser", JSON.stringify(user));
    onRegister(user);
  };

  const inputCls = "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";
  const moneyInputCls = "flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#1d3557] transition-colors";

  if (mode === "login") {
    return (
      <LoginShell>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-1">歡迎回來</h2>
          <p className="text-slate-500 text-sm">很高興再次見到您！</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className={labelCls}>電子郵件</label>
            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>密碼</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} pr-10`} />
              <PasswordToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button type="button" className="text-sm text-[#1d3557] hover:underline font-medium">忘記密碼？</button>
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-center">{error}</p>}
          <button type="submit" className="w-full bg-[#1d3557] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2d4a6e] active:bg-[#162840] transition-colors mt-2">
            登入
          </button>
          <DevLoginButton onLogin={onLogin} />
        </form>
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 whitespace-nowrap">或使用以下方式登入</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <div className="flex gap-3">
          <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <GoogleIcon /> Google
          </button>
          <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <MicrosoftIcon /> Microsoft
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-6 text-center">
          還沒有帳號？{" "}
          <button onClick={() => switchMode("register")} className="text-[#1d3557] font-semibold hover:underline">立即註冊</button>
        </p>
      </LoginShell>
    );
  }

  if (step === 1) {
    return (
      <RegisterShell
        maxWidth="max-w-sm"
        footer={
          <div className="flex items-center w-full">
            <div className="flex-1">
              <button type="button" onClick={() => switchMode("login")}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                返回登入
              </button>
            </div>
            <DevLoginButton onLogin={onRegister} />
            <div className="flex-1 flex justify-end">
              <button type="submit" form="step1"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#1d3557] hover:text-[#162843] transition-colors">
                下一步
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        }
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-1">建立帳號</h2>
          <p className="text-slate-500 text-sm">加入 SubTrack，掌握每一筆訂閱支出。</p>
        </div>
        <StepIndicator current={1} />
        <form id="step1" onSubmit={handleStep1Next}>
          <div className="space-y-5">
            <div>
              <label className={labelCls}>使用者名稱</label>
              <input type="text" placeholder="請輸入使用者名稱" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>電子郵件</label>
              <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>密碼</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} pr-10`} />
                <PasswordToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>確認密碼</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputCls} pr-10`} />
                <PasswordToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
              </div>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-center mt-4">{error}</p>}
        </form>
      </RegisterShell>
    );
  }

  if (step === 2) {
    return (
      <RegisterShell
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <button type="button" onClick={goBack}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              上一步
            </button>
            <button type="submit" form="step2"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#1d3557] hover:text-[#162843] transition-colors">
              下一步
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        }
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-1">財務設定</h2>
          <p className="text-slate-500 text-sm">幫助我們了解您的預算，提供更精準的洞察。</p>
        </div>
        <StepIndicator current={2} />
        <form id="step2" onSubmit={handleStep2Next}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>您的每月預計收入 (TWD)</label>
                <div className={moneyInputCls}>
                  <span className="px-3 py-3 text-sm font-medium text-slate-500 bg-slate-50 border-r border-slate-200 whitespace-nowrap">NT$</span>
                  <input type="number" min="0" placeholder="例如: 50,000" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} className="flex-1 px-3 py-3 text-sm outline-none text-slate-800 placeholder-slate-400 bg-white" />
                </div>
              </div>
              <div>
                <label className={labelCls}>您計畫投入的每月訂閱預算 (TWD)</label>
                <div className={moneyInputCls}>
                  <span className="px-3 py-3 text-sm font-medium text-slate-500 bg-slate-50 border-r border-slate-200 whitespace-nowrap">NT$</span>
                  <input type="number" min="0" placeholder="例如: 2,500" value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)} className="flex-1 px-3 py-3 text-sm outline-none text-slate-800 placeholder-slate-400 bg-white" />
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <BudgetAnalysis monthlyIncome={monthlyIncome} monthlyBudget={monthlyBudget} />
            </div>
            <p className="text-xs text-slate-400">您可以隨時在「偏好設定」中更改這些設定</p>
          </div>
        </form>
      </RegisterShell>
    );
  }

  return (
    <RegisterShell
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button type="button" onClick={goBack}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            上一步
          </button>
          <button type="submit" form="step3"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#1d3557] hover:text-[#162843] transition-colors">
            開始使用
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      }
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-1">確認資料</h2>
        <p className="text-slate-500 text-sm">請確認您填寫的資訊是否正確。</p>
      </div>
      <StepIndicator current={3} />
      <form id="step3" onSubmit={handleFinalSubmit}>
        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <div className="border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">帳號資訊</p>
              <button type="button" onClick={() => setStep(1)} className="text-xs text-[#1d3557] hover:underline font-medium">修改</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">姓名</span>
                <span className="text-sm font-medium text-slate-800">{name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">電子郵件</span>
                <span className="text-sm font-medium text-slate-800">{email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">密碼</span>
                <span className="text-sm font-medium text-slate-400 tracking-widest">••••••••</span>
              </div>
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">財務設定</p>
              <button type="button" onClick={() => setStep(2)} className="text-xs text-[#1d3557] hover:underline font-medium">修改</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">每月預計收入</span>
                <span className={`text-sm font-medium ${monthlyIncome ? "text-slate-800" : "text-slate-400"}`}>{formatMoney(monthlyIncome)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">每月訂閱預算</span>
                <span className={`text-sm font-medium ${monthlyBudget ? "text-slate-800" : "text-slate-400"}`}>{formatMoney(monthlyBudget)}</span>
              </div>
            </div>
            {(monthlyIncome || monthlyBudget) && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <BudgetAnalysisCompact monthlyIncome={monthlyIncome} monthlyBudget={monthlyBudget} />
              </div>
            )}
          </div>
        </div>
      </form>
    </RegisterShell>
  );
}
