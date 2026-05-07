import { RegisterShell } from "./AuthShells";
import StepIndicator from "./StepIndicator";
import PasswordToggle from "./PasswordToggle";
import DevLoginButton from "./DevLoginButton";
import { Input } from "@/components/ui/input";

const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

export default function RegisterStep1({ name, setName, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, showPassword, setShowPassword, error, onSubmit, onSwitchToLogin, onQuickLogin }) {
  return (
    <RegisterShell
      maxWidth="max-w-sm"
      footer={
        <div className="flex items-center w-full">
          <div className="flex-1">
            <button type="button" onClick={onSwitchToLogin}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              返回登入
            </button>
          </div>
          <DevLoginButton onLogin={onQuickLogin} />
          <div className="flex-1 flex justify-end">
            <button type="submit" form="step1"
              className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-strong)] hover:text-[var(--color-primary)] transition-colors">
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
      <form id="step1" onSubmit={onSubmit}>
        <div className="space-y-5">
          <div>
            <label className={labelCls}>使用者名稱</label>
            <Input type="text" placeholder="請輸入使用者名稱" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>電子郵件</label>
            <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>密碼</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
              <PasswordToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>確認密碼</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pr-10" />
              <PasswordToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
            </div>
          </div>
        </div>
        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-center mt-4">{error}</p>}
      </form>
    </RegisterShell>
  );
}
