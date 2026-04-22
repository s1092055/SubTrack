import { useState } from "react";
import { hashPassword } from "../../utils/auth";

function EyeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
    </svg>
  );
}

export default function PasswordDialog({ authUser, onSave, onClose, showToast }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showC, setShowC] = useState(false);
  const [showN, setShowN] = useState(false);
  const [showF, setShowF] = useState(false);

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-700 focus:outline-none placeholder-slate-300";

  const handleSubmit = async () => {
    const currentHashed = await hashPassword(currentPw);
    if (currentHashed !== authUser?.password) return showToast("目前密碼不正確", "error");
    if (newPw.length < 6) return showToast("新密碼至少需要 6 個字元", "error");
    if (newPw !== confirmPw) return showToast("兩次輸入的密碼不一致", "error");
    const newHashed = await hashPassword(newPw);
    onSave(newHashed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm modal-enter" style={{ boxShadow: "0 24px 64px oklch(0% 0 0 / 0.18)" }}>
        <h3 className="text-base font-semibold text-slate-800 mb-5">變更密碼</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">目前密碼</label>
            <div className="relative">
              <input autoFocus type={showC ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="輸入目前密碼" className={inputCls} />
              <button type="button" onClick={() => setShowC((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showC ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">新密碼</label>
            <div className="relative">
              <input type={showN ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="至少 6 個字元" className={inputCls} />
              <button type="button" onClick={() => setShowN((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showN ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">確認新密碼</label>
            <div className="relative">
              <input type={showF ? "text" : "password"} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="再次輸入新密碼" className={inputCls} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
              <button type="button" onClick={() => setShowF((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showF ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-[#1d3557] text-white text-sm font-semibold hover:bg-[#162843] transition-colors">儲存</button>
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors">取消</button>
        </div>
      </div>
    </div>
  );
}
