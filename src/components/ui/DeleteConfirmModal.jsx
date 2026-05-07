import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteConfirmModal({ name, onConfirm, onCancel }) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent
        size="sm"
        showClose={false}
        title="確認刪除訂閱"
        description={`確認是否要刪除 ${name}，此操作無法復原。`}
      >
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" />
              <path d="M10 11v6M14 11v6" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-semibold text-slate-800 mb-2">確定要刪除？</p>
          <p className="text-sm text-slate-400 mb-6">
            「{name}」將被永久移除，無法復原。
          </p>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onConfirm}
            >
              確認刪除
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
