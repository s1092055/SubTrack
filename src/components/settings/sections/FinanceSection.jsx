import { useState } from "react";

import FinanceModal from "@/components/settings/FinanceModal";
import { FieldRow } from "@/components/settings/shared/FieldRow";
import { SectionBlock } from "@/components/settings/shared/SectionBlock";

export default function FinanceSection({ authUser, onUpdateUser, showToast }) {
  const [monthlyIncome, setMonthlyIncome] = useState(authUser?.monthlyIncome ?? "");
  const [monthlyBudget, setMonthlyBudget] = useState(authUser?.monthlyBudget ?? "");
  const [showFinanceDialog, setShowFinanceDialog] = useState(false);

  return (
    <>
      <SectionBlock>
        <FieldRow
          label="每月預計收入"
          value={monthlyIncome ? `NT$ ${Number(monthlyIncome).toLocaleString()}` : ""}
          onEdit={() => setShowFinanceDialog(true)}
        />
        <FieldRow
          label="每月訂閱預算"
          value={monthlyBudget ? `NT$ ${Number(monthlyBudget).toLocaleString()}` : ""}
          onEdit={() => setShowFinanceDialog(true)}
        />
      </SectionBlock>

      {showFinanceDialog && (
        <FinanceModal
          income={monthlyIncome}
          budget={monthlyBudget}
          onSave={(income, budget) => {
            setMonthlyIncome(income);
            setMonthlyBudget(budget);
            onUpdateUser({ monthlyIncome: income, monthlyBudget: budget });
            showToast("財務設定已更新");
          }}
          onClose={() => setShowFinanceDialog(false)}
        />
      )}
    </>
  );
}
