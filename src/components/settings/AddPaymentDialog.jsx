import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddPaymentDialog({ onSave, onClose }) {
  const [draft, setDraft] = useState("");

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="sm" showClose={false}>
        <div className="p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">新增付款方式</h3>
          <p className="text-xs text-slate-400 mb-4">輸入信用卡、電子支付或其他方式的名稱</p>
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { onSave(draft); onClose(); } }}
            placeholder="例：玉山信用卡、PayPal..."
            className="bg-slate-100 border-0"
          />
          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant="default"
              className="flex-1"
              onClick={() => { if (draft.trim()) { onSave(draft); onClose(); } }}
            >
              確認
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
