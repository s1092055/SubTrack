import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CustomPaymentDialog({ value, onChange, onConfirm, onClose }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        size="sm"
        showClose={false}
        title="自訂付款方式"
        description="輸入信用卡、電子支付或其他付款方式的名稱。"
      >
        <div className="p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">自訂付款方式</h3>
          <p className="text-xs text-slate-400 mb-4">輸入信用卡、電子支付或其他方式的名稱</p>
          <Input
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onConfirm(); }}
            placeholder="例：玉山信用卡、PayPal..."
            className="bg-slate-100 border-0"
          />
          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant="default"
              className="flex-1"
              onClick={onConfirm}
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
