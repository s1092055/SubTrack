import { useState } from "react";

export default function AddPaymentDialog({ onSave, onClose }) {
  const [draft, setDraft] = useState("");
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-xs modal-enter" style={{ boxShadow: "0 24px 64px oklch(0% 0 0 / 0.18)" }}>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">新增付款方式</h3>
        <p className="text-xs text-slate-400 mb-4">輸入信用卡、電子支付或其他方式的名稱</p>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { onSave(draft); onClose(); } }}
          placeholder="例：玉山信用卡、PayPal..."
          className="w-full bg-slate-100 border-0 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none"
        />
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => { if (draft.trim()) { onSave(draft); onClose(); } }}
            className="flex-1 py-2.5 rounded-xl bg-[#1d3557] text-white text-sm font-semibold hover:bg-[#162843] transition-colors"
          >
            確認
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
