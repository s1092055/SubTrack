import { LoginShell } from "./AuthShells";
import PasswordToggle from "./PasswordToggle";
import DevLoginButton from "./DevLoginButton";
import { Input } from "@/components/ui/input";

const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

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

export default function LoginForm({ email, setEmail, password, setPassword, showPassword, setShowPassword, error, isLoading, onSubmit, onSwitchToRegister, onLogin }) {
  return (
    <LoginShell>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-1">歡迎回來</h2>
        <p className="text-slate-500 text-sm">很高興再次見到您！</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className={labelCls}>電子郵件</label>
          <Input id="login-email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="login-password" className={labelCls}>密碼</label>
          <div className="relative">
            <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" autoComplete="current-password" />
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button type="button" className="text-sm text-[var(--color-primary-strong)] hover:underline font-medium">忘記密碼？</button>
        </div>
        {error && <p role="alert" className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-center">{error}</p>}
        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[var(--color-primary-strong)] active:bg-[var(--color-primary-strong)] transition-colors mt-2 disabled:opacity-60">
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : "登入"}
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
        <button onClick={onSwitchToRegister} className="text-[var(--color-primary-strong)] font-semibold hover:underline">立即註冊</button>
      </p>
    </LoginShell>
  );
}
