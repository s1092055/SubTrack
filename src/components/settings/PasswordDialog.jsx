import { useState } from "react";
import { hashPassword } from "../../utils/auth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="sm" showClose={false}>
        <div className="p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-5">變更密碼</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">目前密碼</label>
              <div className="relative">
                <Input autoFocus type={showC ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="輸入目前密碼" className="pr-10" />
                <button type="button" onClick={() => setShowC((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-slate-600 transition-colors">
                  {showC ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">新密碼</label>
              <div className="relative">
                <Input type={showN ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="至少 6 個字元" className="pr-10" />
                <button type="button" onClick={() => setShowN((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-slate-600 transition-colors">
                  {showN ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">確認新密碼</label>
              <div className="relative">
                <Input type={showF ? "text" : "password"} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="再次輸入新密碼" className="pr-10" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
                <button type="button" onClick={() => setShowF((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-slate-600 transition-colors">
                  {showF ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button type="button" variant="default" className="flex-1" onClick={handleSubmit}>儲存</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>取消</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
