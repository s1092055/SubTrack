import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const MEMBER_STYLES = [
  { bg: "#eaf1f8", text: "var(--color-text-secondary)" },
  { bg: "#edf3fb", text: "#27456f" },
  { bg: "#e7eff8", text: "var(--color-text-secondary)" },
  { bg: "#eef2f7", text: "#334155" },
  { bg: "#e8f0fa", text: "#233f67" },
  { bg: "#f1f5fa", text: "#2b466e" },
  { bg: "#e9f0f7", text: "var(--color-text-secondary)" },
];
const ACCENT = "var(--color-text-secondary)";

export default function SplitMembersModal({ sub, splitMembers: initialMembers, authUser, onSave, onClose }) {
  const [members, setMembers] = useState(
    (initialMembers ?? []).map((m) =>
      typeof m === "string" ? { name: m, email: "" } : m
    )
  );

  const totalPeople = members.length + 1;
  const price = Number(sub.price);
  const perPerson = totalPeople > 0 ? price / totalPeople : price;
  const subscriptionName = sub.name?.trim() || "目前訂閱";
  const cycleLabel = sub.cycle === "yearly" ? "每年" : "每月";
  const billingDay = sub.nextBillingDate
    ? `${cycleLabel} ${new Date(sub.nextBillingDate).getDate()} 日`
    : cycleLabel;
  const formatMoney = (value) => `$ ${Math.round(Number(value) || 0).toLocaleString()}`;
  const ownerName = authUser?.name?.trim() || "我";
  const ownerEmail = authUser?.email?.trim();

  const addMember = () => setMembers((prev) => [...prev, { name: "", email: "" }]);
  const removeMember = (i) => setMembers((prev) => prev.filter((_, j) => j !== i));
  const updateMember = (i, field, val) =>
    setMembers((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="md" showClose={false}>
        <div
          className="w-full flex flex-col overflow-hidden"
          style={{ maxHeight: "var(--modal-max-height)" }}
        >
          <div className="flex items-center justify-between px-7 pt-6 pb-4 flex-shrink-0">
            <p className="text-lg font-bold" style={{ color: ACCENT }}>管理成員</p>
            <button
              onClick={onClose}
              aria-label="關閉"
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="px-4 pb-4">
            <div className="rounded-[26px] bg-[#f8f8fc] px-5 py-5">
              <div className="rounded-2xl bg-white/70 px-5 py-4 flex items-center gap-4 flex-shrink-0">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: ACCENT }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4.2a2 2 0 0 1 1.4.57l1.32 1.29a2 2 0 0 0 1.4.57H19.5A1.5 1.5 0 0 1 21 9.93V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.5 12h7" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 leading-none mb-1">正在管理</p>
                  <p className="text-xl font-bold truncate" style={{ color: ACCENT }}>{subscriptionName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-slate-400 leading-none mb-1">結帳週期</p>
                  <p className="text-xs font-semibold text-slate-700">{billingDay}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 mb-2 px-1">
                <p className="text-[11px] font-semibold text-slate-500">成員名單</p>
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center gap-1 text-[11px] font-semibold transition-opacity hover:opacity-80"
                  style={{ color: ACCENT }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                  </svg>
                  新增成員
                </button>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 no-scrollbar">
                <div className="rounded-2xl bg-white px-3.5 py-3 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ backgroundColor: MEMBER_STYLES[0].bg, color: MEMBER_STYLES[0].text }}
                  >
                    我
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{ownerName}（管理員）</p>
                    {ownerEmail && <p className="text-[11px] text-slate-400 truncate">{ownerEmail}</p>}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[10px] text-slate-400 leading-none mb-1">應付金額</p>
                    <p className="text-sm font-bold tabular-nums" style={{ color: ACCENT }}>{formatMoney(perPerson)}</p>
                  </div>
                </div>

                {members.length === 0 ? (
                  <div className="rounded-2xl bg-white px-4 py-6 text-center text-xs text-slate-400">
                    尚無其他成員，點擊右上角新增成員開始分帳
                  </div>
                ) : (
                  members.map((member, i) => {
                    const style = MEMBER_STYLES[(i + 1) % MEMBER_STYLES.length];
                    return (
                      <div key={i} className="group rounded-2xl bg-white px-3.5 py-3 flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                          style={{ backgroundColor: style.bg, color: style.text }}
                        >
                          {member.name.trim() ? member.name.trim().charAt(0).toUpperCase() : String(i + 1)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateMember(i, "name", e.target.value)}
                            placeholder="輸入姓名"
                            className="w-full text-sm font-semibold text-slate-800 bg-transparent focus:outline-none placeholder-slate-300 leading-tight"
                          />
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) => updateMember(i, "email", e.target.value)}
                            placeholder="輸入電子郵件"
                            className="w-full text-[11px] text-slate-400 bg-transparent focus:outline-none placeholder-slate-200 mt-0.5 leading-tight"
                          />
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-[10px] text-slate-400 leading-none mb-1">應付金額</p>
                          <p className="text-sm font-bold tabular-nums" style={{ color: ACCENT }}>{formatMoney(perPerson)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMember(i)}
                          className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                          aria-label="移除此成員"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-2xl bg-white/80 px-5 py-4">
                  <p className="text-[10px] text-slate-400 mb-1">總金額</p>
                  <p className="text-[2rem] leading-none font-bold text-slate-900 tabular-nums">{formatMoney(price)}</p>
                </div>
                <div className="rounded-2xl px-5 py-4 shadow-sm" style={{ backgroundColor: ACCENT }}>
                  <p className="text-[10px] text-white/70 mb-1">每人費用</p>
                  <p className="text-[2rem] leading-none font-bold text-white tabular-nums">{formatMoney(perPerson)}</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => onSave(members)}
                  className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-colors hover:opacity-90"
                  style={{ backgroundColor: ACCENT }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  儲存變更
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
