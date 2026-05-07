export const EMPTY_SUBSCRIPTION_FORM = {
  name: "",
  category: "娛樂",
  price: "",
  cycle: "monthly",
  splitMembers: [],
  nextBillingDate: "",
  reminderDays: 7,
  notes: "",
  paymentMethod: "",
  frequency: "",
  avatarColor: "",
  usageStatus: null,
  lastCheckedAt: null,
};

export function getMemberName(member) {
  return typeof member === "string" ? member : member.name;
}

export function getValidMembers(form) {
  return form.splitMembers.filter(
    (member) => getMemberName(member).trim() !== ""
  );
}

export function getSharedWith(form) {
  return getValidMembers(form).length + 1;
}

export function validateSubscriptionForm(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "請輸入服務名稱";
  }

  if (!form.price || Number(form.price) <= 0) {
    errors.price = "請輸入有效金額";
  }

  if (!form.nextBillingDate) {
    errors.nextBillingDate = "請選擇扣款日期";
  }

  if (
    form.splitMembers.some(
      (member) => getMemberName(member).trim() === ""
    )
  ) {
    errors.splitMembers = "請填寫所有分帳成員姓名";
  }

  return errors;
}

export function createFormFromSubscription(sub) {
  return {
    name: sub.name ?? "",
    category: sub.category ?? "娛樂",
    price: sub.price ?? "",
    cycle: sub.cycle ?? "monthly",
    nextBillingDate: sub.nextBillingDate ?? "",
    reminderDays: sub.reminderDays ?? 7,
    paymentMethod: sub.paymentMethod ?? "",
    splitMembers: sub.splitMembers ?? [],
    notes: sub.notes ?? "",
    frequency: sub.frequency ?? "",
    avatarColor: sub.avatarColor ?? "",
    usageStatus: sub.usageStatus ?? null,
    lastCheckedAt: sub.lastCheckedAt ?? null,
  };
}

export function buildNewSubscriptionPayload(form) {
  const today = new Date().toISOString().slice(0, 10);
  const validMembers = getValidMembers(form);

  return {
    ...form,
    id: crypto.randomUUID(),
    price: Number(form.price),
    splitMembers: validMembers,
    sharedWith: validMembers.length + 1,
    createdAt: today,
  };
}

export function buildUpdatedSubscriptionPayload(sub, form) {
  const validMembers = getValidMembers(form);

  return {
    ...sub,
    ...form,
    price: Number(form.price),
    splitMembers: validMembers,
    sharedWith: validMembers.length + 1,
  };
}