import { useRef, useState } from "react";

import PasswordDialog from "@/components/settings/PasswordDialog";
import { FieldRow } from "@/components/settings/shared/FieldRow";
import { SectionBlock } from "@/components/settings/shared/SectionBlock";

export default function SecuritySection({
  authUser,
  onUpdateUser,
  onClearAll,
  onImport,
  subscriptions = [],
  showToast,
}) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const importRef = useRef(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(subscriptions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subtrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`已匯出 ${subscriptions.length} 筆訂閱資料`);
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error("格式錯誤");
        onImport(data);
      } catch {
        showToast("匯入失敗：檔案格式不正確", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleReset = () => {
    onClearAll();
    setShowResetConfirm(false);
    showToast("所有資料已清除");
  };

  return (
    <>
      <SectionBlock>
        <FieldRow label="密碼" value="••••••••" onEdit={() => setShowPasswordDialog(true)} />
      </SectionBlock>

      <SectionBlock title="資料管理" className="mt-4">
        <div className="py-4 border-b border-[var(--color-border)]">
          <p className="text-sm font-medium text-slate-700 mb-1">匯出資料</p>
          <p className="text-xs text-slate-400 mb-3">將所有訂閱記錄匯出為 JSON 檔案，可用於備份或轉移。</p>
          <button
            type="button"
            onClick={handleExport}
            disabled={subscriptions.length === 0}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            匯出 JSON（{subscriptions.length} 筆）
          </button>
        </div>

        <div className="py-4 border-b border-[var(--color-border)]">
          <p className="text-sm font-medium text-slate-700 mb-1">匯入資料</p>
          <p className="text-xs text-slate-400 mb-3">從 JSON 備份檔案還原訂閱記錄，將覆蓋現有資料。</p>
          <input
            ref={importRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportFile}
          />
          <button
            type="button"
            onClick={() => importRef.current?.click()}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            選擇 JSON 檔案
          </button>
        </div>

        <div className="py-4">
          <p className="text-sm font-medium text-slate-700 mb-1">刪除帳戶資料</p>
          <p className="text-xs text-slate-400 mb-3">此操作將永久刪除所有訂閱記錄，無法復原。</p>
          {showResetConfirm ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
              >
                確認刪除
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              刪除資料
            </button>
          )}
        </div>
      </SectionBlock>

      {showPasswordDialog && (
        <PasswordDialog
          authUser={authUser}
          onSave={(newPw) => {
            onUpdateUser({ password: newPw });
            showToast("密碼已更新");
          }}
          onClose={() => setShowPasswordDialog(false)}
          showToast={showToast}
        />
      )}
    </>
  );
}
