import { useState } from "react";

import EditFieldDialog from "@/components/settings/EditFieldDialog";
import PasswordDialog from "@/components/settings/PasswordDialog";
import { FieldRow } from "@/components/settings/shared/FieldRow";
import { SectionBlock } from "@/components/settings/shared/SectionBlock";

export default function AccountSection({ authUser, onUpdateUser, showToast }) {
  const [editingField, setEditingField] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [profileName, setProfileName] = useState(authUser?.name ?? "");
  const [profileEmail, setProfileEmail] = useState(authUser?.email ?? "");

  return (
    <>
      <SectionBlock>
        <FieldRow label="使用者名稱" value={profileName} onEdit={() => setEditingField("name")} />
        <FieldRow label="電子郵件" value={profileEmail} onEdit={() => setEditingField("email")} />
        <FieldRow label="密碼" value="••••••••" onEdit={() => setShowPasswordDialog(true)} />
      </SectionBlock>

      {editingField === "name" && (
        <EditFieldDialog
          title="使用者名稱"
          value={profileName}
          onSave={(v) => {
            if (!v.trim()) return showToast("名稱不可為空", "error");
            setProfileName(v.trim());
            onUpdateUser({ name: v.trim() });
            showToast("名稱已更新");
          }}
          onClose={() => setEditingField(null)}
        />
      )}

      {editingField === "email" && (
        <EditFieldDialog
          title="電子郵件"
          value={profileEmail}
          type="email"
          onSave={(v) => {
            setProfileEmail(v.trim());
            onUpdateUser({ email: v.trim() });
            showToast("電子郵件已更新");
          }}
          onClose={() => setEditingField(null)}
        />
      )}

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
