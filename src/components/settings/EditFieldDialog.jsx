import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditFieldDialog({ title, value, type = "text", onSave, onClose }) {
  const [draft, setDraft] = useState(value);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="sm" showClose={false}>
        <div className="p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">編輯{title}</h3>
          <Input
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            className="mb-5"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="default"
              onClick={() => { onSave(draft); onClose(); }}
            >
              儲存
            </Button>
            <Button
              type="button"
              variant="outline"
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
