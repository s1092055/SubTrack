import { useState } from "react";

import CustomDropdown from "@/components/ui/CustomDropdown";
import AddPaymentDialog from "@/components/settings/AddPaymentDialog";
import { SectionBlock } from "@/components/settings/shared/SectionBlock";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";

const CURRENCY_OPTIONS = [
  { value: "TWD", label: "TWD - 新台幣" },
  { value: "USD", label: "USD - 美元" },
];

export default function DisplaySection({ currency, onCurrencyChange }) {
  const [defaultPayment, setDefaultPayment] = useLocalStorage("defaultPayment", "");
  const [customPayments, setCustomPayments] = useLocalStorage("customPaymentMethods", []);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  const paymentOptions = [
    { value: "", label: "未設定" },
    ...PAYMENT_METHODS.map((pm) => ({ value: pm.value, label: pm.value })),
    ...customPayments.map((pm) => ({ value: pm, label: pm })),
  ];

  return (
    <>
      <SectionBlock>
        <div className="flex items-center justify-between py-4 border-b border-[var(--color-border)]">
          <div className="mr-4">
            <p className="text-sm font-medium text-slate-700">顯示貨幣</p>
            <p className="text-xs text-slate-400 mt-0.5">所有金額將以此貨幣顯示</p>
          </div>
          <CustomDropdown
            value={currency}
            onChange={onCurrencyChange}
            options={CURRENCY_OPTIONS}
            variant="white"
            className="w-44"
          />
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="mr-4">
            <p className="text-sm font-medium text-slate-700">預設付款方式</p>
            <p className="text-xs text-slate-400 mt-0.5">新增訂閱時的預設付款方式</p>
          </div>
          <CustomDropdown
            value={defaultPayment}
            onChange={setDefaultPayment}
            options={paymentOptions}
            variant="white"
            className="w-44"
            footerAction={{ label: "新增付款", onClick: () => setShowAddPaymentDialog(true) }}
          />
        </div>
      </SectionBlock>

      {showAddPaymentDialog && (
        <AddPaymentDialog
          onSave={(v) => {
            const trimmed = v.trim();
            if (
              trimmed &&
              !PAYMENT_METHODS.some((pm) => pm.value === trimmed) &&
              !customPayments.includes(trimmed)
            ) {
              setCustomPayments((p) => [...p, trimmed]);
              setDefaultPayment(trimmed);
            }
          }}
          onClose={() => setShowAddPaymentDialog(false)}
        />
      )}
    </>
  );
}
