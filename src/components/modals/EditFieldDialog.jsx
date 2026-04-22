import { useState } from "react";

export default function EditFieldDialog({ title, value, type = "text", onSave, onClose }) {
  const [draft, setDraft] = useState(value);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm modal-enter" style={{ boxShadow: "0 24px 64px oklch(0% 0 0 / 0.18)" }}>
        <h3 className="text-base font-semibold text-slate-800 mb-4">編輯{title}</h3>
        <input
          type={type}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none mb-5"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => { onSave(draft); onClose(); }}
            className="px-4 py-2 rounded-xl bg-[#1d3557] text-white text-sm font-semibold hover:bg-[#16304e] transition-colors"
          >
            儲存
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
