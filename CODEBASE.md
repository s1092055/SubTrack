# SubTrack 專案程式碼全覽

讓使用者一眼看清「自動扣款的錢到底去了哪裡」的訂閱管理平台。純前端 Demo 專案，資料儲存於 localStorage。

---

## 技術堆疊

| 工具 | 版本 | 用途 |
|------|------|------|
| **React 19** | ^19.2.0 | UI 框架，啟用 React Compiler（自動 memoization） |
| **Vite 7** | ^7.3.1 | 開發伺服器 + 打包工具 |
| **React Router v7** | ^7.14.2 | Client-side routing（BrowserRouter） |
| **Tailwind CSS v4** | ^4.2.2 | Utility-first CSS，透過 `@tailwindcss/vite` plugin 整合 |
| **ESLint 9** | ^9.39.1 | 靜態分析，扁平設定（`eslint.config.js`） |
| **Radix UI** | ^1–2.x | shadcn/ui 的無障礙 headless primitive（Dialog、DropdownMenu、Popover、Slot） |
| **react-day-picker** | ^9.14.0 | Calendar 元件的日期選取引擎（DayPicker，支援 zhTW locale） |
| **class-variance-authority** | ^0.7 | cva() — Button、Badge 的 variant 系統 |
| **clsx + tailwind-merge** | ^2.x / ^3.x | `cn()` utility：合併 class 並消除 Tailwind 衝突 |

> **React Compiler 注意事項**：所有 memoization 由編譯器自動處理，請勿手動加 `useMemo` / `useCallback`。

> **Tailwind v4 注意事項**：使用 `@tailwindcss/vite` plugin（無 PostCSS）。shadcn/ui CLI 不支援此設定，所有 shadcn 元件均手動建立。

---

## 核心資料結構

每筆訂閱物件的完整欄位：

```js
{
  id: "uuid-123",                // crypto.randomUUID() 產生
  name: "Netflix",               // 服務名稱
  category: "娛樂",              // 分類名稱（預設四種 + 使用者自訂）
  price: 390,                    // 金額（台幣）
  cycle: "monthly",              // "monthly" | "yearly"
  sharedWith: 4,                 // 總人數（含自己）；1 = 個人訂閱
  splitMembers: [],              // 分帳成員陣列（{ name } 或純字串）
  nextBillingDate: "2026-04-20", // 下次扣款日，YYYY-MM-DD
  reminderDays: 3,               // 提前提醒天數：1 | 3 | 7
  frequency: "weekly",           // 使用頻率（選填）："daily"|"weekly"|"monthly"|"rarely"|""
  notes: "",                     // 備註（選填）
  paymentMethod: "",             // 付款方式（選填）
  avatarColor: "",               // 頭像背景色（選填）；空字串時由 getAvatarColor(name) 計算
  usageStatus: null,             // "active" | "unused" | null（使用狀態）
  lastCheckedAt: null,           // 最後確認使用的日期，YYYY-MM-DD | null
  createdAt: "2026-01-01",       // 建立日期（用於圖表歷史計算）
}
```

**`sharedWith` 語意**：表示「總人數（含自己）」。UI 顯示「與 N 人分帳」= `sharedWith - 1`，計算金額直接用 `sharedWith`（不要 -1）。

---

## 檔案結構

```
src/
├── main.jsx                            ← 啟動點：BrowserRouter + App
├── App.jsx                             ← 所有 state、handler、路由定義
├── index.css                           ← 全域樣式、CSS 動畫、Design Token import
│
├── lib/
│   └── utils.js                        ← cn() = clsx + tailwind-merge
│
├── pages/
│   ├── Overview.jsx                    ← 儀表板：數字摘要 + 帳單月曆 + 圖表
│   ├── SubList.jsx                     ← 訂閱清單：搜尋 + 卡片 / 格狀
│   └── Settings.jsx                    ← 偏好設定：6 區塊導覽殼層（activeSection state）
│
├── components/
│   ├── auth/
│   │   ├── AuthPage.jsx                ← 登入 / 三步驟註冊協調器
│   │   ├── LoginForm.jsx               ← 登入表單
│   │   ├── AuthShells.jsx              ← 通用卡片外殼
│   │   ├── RegisterStep1.jsx           ← 姓名、Email、密碼
│   │   ├── RegisterStep2.jsx           ← 月收入、月預算 + 圓形圖
│   │   ├── RegisterStep3.jsx           ← 確認摘要
│   │   ├── StepIndicator.jsx           ← 三步驟進度指示器
│   │   ├── BudgetAnalysis.jsx          ← 即時預算分析圖
│   │   ├── PasswordToggle.jsx          ← 密碼顯示/隱藏按鈕
│   │   └── DevLoginButton.jsx          ← 開發模式快速登入
│   │
│   ├── layout/
│   │   ├── TopBar.jsx                  ← 頂部列（漢堡 icon + 搜尋按鈕）
│   │   ├── Sidebar.jsx                 ← 右側 overlay 抽屜導覽
│   │   └── MobileTabBar.jsx            ← 手機底部 tab bar
│   │
│   ├── overview/
│   │   ├── OverviewSummaryCard.jsx     ← 數字摘要卡片（title、value、note、icon、tone）
│   │   ├── OverviewSubscriptionSections.jsx ← UpcomingPaymentsSection + NeedsAttentionSection
│   │   ├── OverviewInsightBanner.jsx   ← 浪費洞察提示 banner（可能浪費訂閱數量 + 省錢提示）
│   │   ├── SpendingChart.jsx           ← 6 個月分類堆疊長條圖（純 CSS）
│   │   ├── CategoryBreakdownCard.jsx   ← 分類支出進度條
│   │   └── WasteAnalysis.jsx           ← 可能浪費訂閱分析彈窗（Dialog）
│   │
│   ├── subscription/
│   │   ├── category/
│   │   │   ├── CatManagerModal.jsx     ← 分類管理彈窗（Dialog，搜尋 + 列表 + 編輯）
│   │   │   └── AddCatModal.jsx         ← 新增分類彈窗（z-[60]，兩層彈窗）
│   │   │
│   │   ├── detail/
│   │   │   ├── SubDetailModal.jsx      ← 訂閱詳情彈窗（Dialog，唯讀）
│   │   │   └── UsageConfirmDialog.jsx  ← 使用狀態確認彈窗（Dialog）
│   │   │
│   │   ├── form/
│   │   │   ├── AddSubModal.jsx         ← 新增訂閱主彈窗（Dialog，size="lg"）
│   │   │   ├── SubEditModal.jsx        ← 訂閱編輯彈窗（Dialog，size="lg"）
│   │   │   └── AddSubFormStep.jsx      ← 兩欄填表元件（AddSubModal + SubEditModal 共用）
│   │   │
│   │   ├── list/
│   │   │   ├── SubCard.jsx             ← 格狀卡片（grid 模式）
│   │   │   ├── SubRow.jsx              ← 列表行（list 模式）
│   │   │   ├── SubSummaryCard.jsx      ← 清單頁頂部統計卡
│   │   │   ├── SubToolbar.jsx          ← 篩選 / 排序 / 搜尋 / 切換工具列
│   │   │   ├── SubSearchDialog.jsx     ← 全文搜尋彈窗（Dialog）
│   │   │   ├── SubEmptyState.jsx       ← 空狀態提示（無訂閱 / 無搜尋結果）
│   │   │   └── SubPagination.jsx       ← 分頁元件
│   │   │
│   │   ├── shared/
│   │   │   ├── SubServiceMark.jsx      ← 服務頭像（色彩 + 首字母）
│   │   │   ├── SubStatBlock.jsx        ← 單欄統計數值區塊
│   │   │   └── SubStatusBadge.jsx      ← 狀態 Badge（使用中 / 即將扣款 / 需要留意 / 已取消）
│   │   │
│   │   └── split/
│   │       └── SplitMembersModal.jsx   ← 分帳成員管理彈窗（Dialog）
│   │
│   ├── settings/
│   │   ├── shared/
│   │   │   ├── FieldRow.jsx            ← 設定頁通用欄位列（label + value + 編輯按鈕）
│   │   │   ├── ToggleRow.jsx           ← 設定頁通用開關列
│   │   │   └── SectionBlock.jsx        ← 設定頁通用區塊容器（白底圓角卡片）
│   │   │
│   │   ├── sections/
│   │   │   ├── AccountSection.jsx      ← 個人資料（name / email / password 編輯）
│   │   │   ├── FinanceSection.jsx      ← 財務設定（月收入 / 月預算）
│   │   │   ├── CategoriesSection.jsx   ← 分類管理（類別 chip 列表 + 管理彈窗）
│   │   │   ├── NotificationsSection.jsx← 通知設定（續訂提醒 / 匯率變動 toggle）
│   │   │   ├── DisplaySection.jsx      ← 顯示設定（貨幣 / 預設付款 / 語言）
│   │   │   └── SecuritySection.jsx     ← 隱私與安全（修改密碼 / 刪除資料）
│   │   │
│   │   ├── EditFieldDialog.jsx         ← 文字欄位編輯（Dialog）
│   │   ├── AddPaymentDialog.jsx        ← 新增付款方式（Dialog）
│   │   ├── PasswordDialog.jsx          ← 修改密碼（Dialog）
│   │   └── FinanceModal.jsx            ← 財務設定（Dialog）
│   │
│   └── ui/                             ← UI 元件庫
│       │
│       ├── ── shadcn/ui base ──
│       ├── button.jsx                  ← Button（cva，7 variants × 5 sizes）
│       ├── input.jsx                   ← Input（支援 icon / containerClassName prop）
│       ├── badge.jsx                   ← Badge（cva，6 variants）
│       ├── dialog.jsx                  ← Dialog（Radix）+ DialogContent / Header / Footer / Title
│       ├── dropdown-menu.jsx           ← DropdownMenu（Radix）+ Content / Item / Label / Separator
│       ├── calendar.jsx                ← Calendar（react-day-picker + zhTW locale + 年月 dropdown）
│       ├── popover.jsx                 ← Popover（@radix-ui/react-popover）
│       │
│       ├── ── Custom ──
│       ├── CustomDropdown.jsx          ← 下拉選單（含 footerAction 插槽）
│       ├── CustomPaymentDialog.jsx     ← 自訂付款方式輸入 dialog
│       ├── DatePicker.jsx              ← 日期選擇器（Calendar + Popover 實作）
│       ├── DeleteConfirmModal.jsx      ← 通用刪除確認 Modal（Dialog）
│       ├── Toast.jsx                   ← 右下角通知堆疊
│       └── Toggle.jsx                  ← 開關切換（Settings 用）
│
├── hooks/
│   ├── useLocalStorage.js              ← localStorage 雙向同步 state hook
│   ├── useToast.js                     ← Toast 佇列管理
│   ├── useExchangeRate.js              ← 匯率 API 呼叫 + 快取
│   └── useOverviewData.js              ← Overview 頁面計算邏輯
│
├── utils/
│   ├── sub.js                          ← 訂閱計算（calcMonthlyPersonal 等）
│   ├── subDisplay.js                   ← 訂閱清單顯示邏輯（排序、狀態、格式化）
│   ├── subForm.js                      ← 表單初始值、驗證、payload 建構
│   ├── overviewDisplay.js              ← Overview 顯示邏輯（趨勢、分類、使用狀態）
│   ├── analytics.js                    ← 圖表 / 帳單總計
│   ├── finance.js                      ← 預算佔比分析
│   ├── format.js                       ← 格式化顯示
│   └── auth.js                         ← SHA-256 密碼雜湊
│
├── constants/
│   ├── categories.js                   ← 預設四分類、顏色、取色函式
│   ├── brandColors.js                  ← 服務名稱對應頭像色
│   ├── paymentMethods.js               ← 預設付款方式（8 種）
│   ├── navConfig.jsx                   ← 導覽項目（含 SVG icon）
│   └── formOptions.js                  ← 表單選項（reminderDays、frequency）
│
├── assets/
│   └── logo_v1.png                     ← 品牌 Logo
│
└── data/                               ← （資料夾已清空；initialSubs.js 已刪除，新帳號預設空陣列）
```

---

## 路由架構

```
/login          → AuthPage（initialMode="login"）
/signup         → AuthPage（initialMode="register"）
/               → redirect → /overview
/overview       → Overview
/subscriptions  → SubList
/settings       → Settings
*               → redirect → /overview
```

「新增訂閱」不是獨立路由，從 Sidebar 的「+」或 SubList / MobileTabBar 觸發 `showAddModal` state，渲染 `AddSubModal` 彈窗。

### 路由守衛

```jsx
if (!authUser) {
  const initialMode = location.pathname === "/signup" ? "register" : "login";
  return <AuthPage onLogin={handleLogin} onRegister={handleLogin} initialMode={initialMode} />;
}
```

---

## 狀態管理：App.jsx

所有全域 state 集中在 `App.jsx`，透過 props 向下傳遞。

### State 清單

```js
authUser          // { name, email, password(hashed), monthlyIncome, monthlyBudget, createdAt } | null
subscriptions     // 訂閱陣列（useLocalStorage，email namespace）
customCategories  // 自訂分類 [{ name, color }]（useLocalStorage，email namespace）
allCategories     // 衍生值：[...DEFAULT_CATEGORY_LIST, ...customCategories]
currency          // "TWD" | "USD"（不持久化）
exchangeRate      // null | number
sidebarOpen       // boolean
showAddModal      // boolean
showSubSearch     // boolean — 控制 SubList 內的 SubSearchDialog 開關（由 TopBar 搜尋按鈕觸發）
```

### Handler 清單

```js
handleAdd(newSub)
handleDelete(id, name)
handleEdit(updatedSub)
handleAddCategory(newCat)
handleRemoveCategory(name)
handleRenameCategory(oldName, newName)
handleClearAll()
handleUpdateUser(updated)        // setAuthUser(prev => ({ ...prev, ...updated }))
handleUpdateUsage(id, status, date)
handleLogin(user)
handleLogout()
```

### Props 資料流

```
App
├── AuthPage         ← onLogin, onRegister, initialMode
├── TopBar           ← onMenuToggle, onOpenSearch（只在 /subscriptions 路由傳入）
├── Sidebar          ← isOpen, onClose, userName, onLogout, onOpenAdd
├── MobileTabBar     ← onOpenAdd
├── Overview         ← subscriptions, currency, exchangeRate, onEdit, onDelete,
│                       onUpdateUsage, categories, onAddCategory, onRemoveCategory,
│                       onRenameCategory, authUser, accountCreatedAt
├── SubList          ← subscriptions, onDelete, onEdit, onUpdateUsage,
│                       currency, exchangeRate, categories, onAddCategory,
│                       onRemoveCategory, onRenameCategory, onOpenAdd,
│                       authUser, showSearch, onSearchChange
├── AddSubModal      ← onAdd, onClose, subscriptions, categories,
│                       onAddCategory, onRemoveCategory, onRenameCategory, authUser
└── Settings         ← currency, onCurrencyChange, onClearAll, showToast,
                        authUser, onUpdateUser, categories, subscriptions,
                        onAddCategory, onRemoveCategory, onRenameCategory
```

### 多帳號資料隔離

```js
const userKey = authUser?.email ?? "";
useLocalStorage(`subscriptions:${userKey}`, initialData)
useLocalStorage(`customCategories:${userKey}`, [])
```

---

## 自訂 Hooks

### `useLocalStorage(key, defaultValue)`

`key` 變更時（切換帳號）自動重新讀取，`value` 為 `null` 時執行 `removeItem`。

### `useToast()`

```js
const { toasts, showToast } = useToast();
showToast("已新增 Netflix", "success"); // 3.5 秒後自動移除
```

### `useExchangeRate(currency, onFetchError)`

切換到 USD 時向 `open.er-api.com` 取匯率，結果快取於 ref，失敗時呼叫 `onFetchError`。

### `useOverviewData(subscriptions, accountCreatedAt)`

Overview 所有計算邏輯的集中點，回傳：

```js
{
  today, monthlyTotal, trendDiff, trendPct,
  upcomingBills,  // 30 天內到期
  wastedSubs, wasteMonthly, wasteYearly,
}
```


> **已移除**：`useScrollLock` — Radix Dialog 內部已自動處理 scroll lock，此 hook 不再需要。

---

## shadcn/ui 元件系統

### 架構說明

因 Tailwind v4 與 shadcn/ui CLI 不相容，所有元件**手動建立**於 `src/components/ui/`。元件以 Radix UI primitives 為基底，所有 class 只使用 SubTrack Design Token（不使用 shadcn 預設 `bg-background` 等 utility class）。

`card.jsx`、`tabs.jsx` 已從專案移除（未使用）。`st-*` wrapper 系列（st-button、st-input、st-badge、st-dialog）已合併進各基礎元件或移除。

### shadcn token bridge（tokens.css section 3）

tokens.css 內定義了一個 bridge section，讓 shadcn 元件的預設 CSS var 名稱（`--primary`、`--background` 等）對應到 SubTrack 語意 token：

```css
:root {
  --background:   var(--color-bg);
  --foreground:   var(--color-text-primary);
  --primary:      var(--color-primary);
  --border:       var(--color-border);
  --radius:       var(--radius-md);
  /* ... 完整清單見 tokens.css */
}
```

### `cn()` utility（`src/lib/utils.js`）

```js
import { cn } from "@/lib/utils";
cn("px-4 py-2", isActive && "bg-[var(--color-primary-soft)]", className)
```

### Button（`button.jsx`）

```jsx
import { Button } from "@/components/ui/button";

<Button>確認</Button>                          // default（綠色主色，主要 CTA）
<Button variant="outline">取消</Button>
<Button variant="destructive">刪除</Button>
<Button variant="ghost">次要操作</Button>
<Button size="icon"><X /></Button>             // 圓形 icon button（h-9 w-9）
<Button size="sm" variant="secondary">篩選</Button>
```

| variant | 用途 |
|---------|------|
| `default` | 主要 CTA（綠色）— 確認、儲存、送出 |
| `secondary` | 次要 chip button |
| `outline` | 取消、返回 |
| `ghost` | 低優先工具按鈕 |
| `destructive` | 刪除、危險操作 |
| `navy` | 保留 variant，**現已停止主動使用**；舊程式碼遷移中 |
| `link` | 行內超連結樣式 |

| size | 尺寸 |
|------|------|
| `default` | h-10，`--radius-lg` |
| `sm` | h-8，`--radius-md` |
| `lg` | h-12，`--radius-lg` |
| `icon` | h-9 w-9，`--radius-pill` |
| `icon-sm` | h-7 w-7，`--radius-pill` |

### Input（`input.jsx`）

```jsx
import { Input } from "@/components/ui/input";

// 基本用法
<Input placeholder="搜尋…" value={v} onChange={...} />

// 帶 icon（左側 leading icon）
<Input icon={<Search className="h-4 w-4" />} placeholder="搜尋…" />

// 帶 icon + 自訂容器 class
<Input icon={<Search />} containerClassName="flex-1" placeholder="搜尋…" />
```

使用 `--radius-lg` 圓角，focus 時 border 變 `--color-primary`。有 icon 時自動加 `pl-11`。

### Badge（`badge.jsx`）

```jsx
import { Badge } from "@/components/ui/badge";
<Badge>使用中</Badge>               // default（綠色 soft）
<Badge variant="warning">需要留意</Badge>
<Badge variant="secondary">已取消</Badge>
<Badge variant="destructive">危險</Badge>
<Badge variant="navy">標籤</Badge>
```

全部使用 `--radius-pill`（完整圓角）。

### Dialog（`dialog.jsx`）

所有彈窗元件的基底，`DialogContent` 接受 `size` prop 對應 modal width token：

```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Modal 元件內部
export default function SomeModal({ onClose }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="md" showClose={false}>
        <DialogHeader>
          <DialogTitle>標題</DialogTitle>
        </DialogHeader>
        {/* inner content */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={onConfirm}>確認</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

| size | 對應 token | 寬度 |
|------|-----------|------|
| `sm` | `--modal-width-sm` | 384px |
| `md` | `--modal-width-md` | 672px |
| `lg` | `--modal-width-lg` | 936px |
| `xl` | `--modal-width-xl` | 1152px |

`showClose={true}`（預設）：右上角自動出現 × 按鈕；已有自訂關閉按鈕的元件請傳 `showClose={false}`。Radix Dialog 自動處理 scroll lock、Escape 關閉、focus trap。

### Calendar（`calendar.jsx`）

基於 `react-day-picker` v9 建立，整合中文 locale（`zhTW`）。`captionLayout="dropdown"` 時啟用自訂年月下拉選單（`CalendarHeader`），否則沿用 DayPicker 原生 caption。

```jsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  mode="single"
  selected={selectedDate}        // Date 物件
  onSelect={(date) => ...}
  month={month}
  onMonthChange={setMonth}
  captionLayout="dropdown"       // 顯示年月 dropdown（預設）
  startMonth={new Date(2020, 0)}
  endMonth={new Date(2030, 11)}
/>
```

通常不直接使用，由 `DatePicker.jsx` 包裝。

### Popover（`popover.jsx`）

基於 `@radix-ui/react-popover`，`PopoverContent` 預設 `z-[70]`，確保在 Dialog（z-50）上方。

```jsx
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <button>觸發</button>
  </PopoverTrigger>
  <PopoverContent align="start" side="bottom" sideOffset={8}>
    內容
  </PopoverContent>
</Popover>
```

### DropdownMenu（`dropdown-menu.jsx`）

```jsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon" variant="outline"><SlidersHorizontal /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={...}>選項一</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={...}>選項二</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 工具函式

### `src/utils/sub.js`

```js
getToday()                          // 今天 Date，時分秒歸零
calcMonthlyPersonal(sub)            // 個人月分攤（monthly: price/sharedWith；yearly: /12）
formatAmount(twd, currency, rate)   // "$1,000 TWD" | "$12 USD"
getDaysUntil(dateStr)               // 正=未來、0=今天、負=過期
needsUsageConfirm(sub)              // 是否需要彈出使用確認
isLikelyWasted(sub)                 // 是否可能浪費
getWasteReason(sub)                 // 浪費原因文字
```

### `src/utils/subDisplay.js`

訂閱清單頁的顯示邏輯，SubList 使用：

```js
sortSubs(subs, sortBy)                      // 依 date-asc / amount-desc / amount-asc / name-asc 排序
isCanceled(sub)                             // 是否已取消
isAttention(sub)                            // 是否需要留意（使用頻率低）
planName(sub)                               // 顯示名稱（月付 / 年付 + 分帳資訊）
getStatusMeta(sub)                          // 狀態 meta（label、color、icon）
getSubscriptionDisplayProps(sub, currency, rate)  // 組合顯示所需的全部 props
// （formatDate、daysText、frequencyMeta 為內部函式，由 getSubscriptionDisplayProps 呼叫）
```

### `src/utils/subForm.js`

表單狀態管理，AddSubModal / SubEditModal 使用：

```js
EMPTY_SUBSCRIPTION_FORM             // 空白表單初始值物件
getMemberName(member)               // 取成員名稱（支援字串或 { name } 物件）
getValidMembers(form)               // 過濾有效成員
getSharedWith(form)                 // 計算 sharedWith（validMembers.length + 1）
validateSubscriptionForm(form)      // → { name, price, nextBillingDate } 錯誤訊息
createFormFromSubscription(sub)     // 訂閱物件 → 表單狀態
buildNewSubscriptionPayload(form)   // 表單狀態 → 新增訂閱物件（含 id、createdAt）
buildUpdatedSubscriptionPayload(sub, form)  // 表單狀態 → 更新訂閱物件
```

### `src/utils/overviewDisplay.js`

Overview 頁面顯示邏輯：

```js
DONUT_COLORS                        // 分類圓餅圖配色陣列
isInactive(sub)                     // 是否已取消 / 停用
isAttentionSub(sub)                 // 是否需要留意（Overview 版）
getLastSeenDate(sub)                // 最後確認使用日期
getDaysSince(dateStr)               // 距今天數
formatDate(dateStr)                 // 日期格式化
formatDaysLeft(dateStr)             // 距到期天數文字
getPlanLabel(sub)                   // 週期 label
getUsageLabel(sub)                  // 使用狀態 label
buildCategoryBreakdown(activeSubs)  // 分類佔比資料（供 CategoryBreakdownCard）
```

### `src/utils/analytics.js`

```js
billingTotalForMonth(subscriptions, year, month, accountCreatedAt)
// 指定月份實際帳單總額（monthly 每月、yearly 只計扣款月）

getPast6MonthsData(subscriptions, refYear, refMonth, accountCreatedAt)
// 以 ref 月份為中心的 6 個月資料陣列，供 SpendingChart 使用
```

### `src/utils/finance.js`

```js
calcBudgetAnalysis(monthlyIncome, monthlyBudget)
// → { income, budget, percentage, color, analysisText }
```

### `src/utils/format.js`

```js
getContrastTextColor(hex)   // 背景色 → "dark" | "white"（BT.601 亮度）
getStatusInfo(days)         // → { label, dot, text }
formatMoney(val)            // → "NT$ 1,000" | "未填寫"
```

### `src/utils/auth.js`

```js
hashPassword(password)   // async SHA-256，回傳 hex
```

---

## 金額計算的兩種語意

| 語意 | 公式 | 使用場景 |
|------|------|----------|
| **實際每次扣款** | `price / sharedWith` | 帳單列表、月曆、詳情 Modal、近期活動 |
| **個人月攤提** | `calcMonthlyPersonal(sub)` | 總覽月支出、帳單趨勢圖 |

`billingTotalForMonth` 計算月帳單總額時用前者，不可用 `calcMonthlyPersonal`。

---

## Overview SpendingChart 月份選取

`selectedYear` / `selectedMonth` state 控制 SpendingChart 的當前高亮欄位：

```js
const [selectedYear, setSelectedYear] = useState(null);
const [selectedMonth, setSelectedMonth] = useState(null);

<SpendingChart
  onSelectMonth={(year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  }}
/>
```

`null` 表示未選取（各欄等權重顯示）。SpendingChart 資料固定為過去 6 個月，無法切換到更早的區間。

---

## 常數檔案

### `categories.js`

```js
getCategoryColor(name)   // 永遠用這個取色，不要直接查 CATEGORIES[name]（自訂分類不在內）
getCategoryBadge(name)   // → Tailwind badge class 字串
DEFAULT_CATEGORY_LIST    // [{ name, color }] × 4
```

### `navConfig.jsx`

```js
NAV_ITEMS = [
  { id: "overview",  label: "總覽",    path: "/overview" },
  { id: "list",      label: "訂閱清單", path: "/subscriptions" },
  { id: "settings",  label: "偏好設定", path: "/settings" },
]
```

### `formOptions.js`

```js
REMINDER_OPTIONS   // [{ value: 1|3|7, label }]
FREQUENCY_OPTIONS  // ["", "daily", "weekly", "monthly", "rarely"]
```

---

## 訂閱使用狀態系統

1. 距扣款日 ≤ `reminderDays` 且超過 `reminderDays` 天未確認 → `needsUsageConfirm` = true
2. SubList 點擊卡片時若 `needsUsageConfirm` → 先彈 `UsageConfirmDialog`
3. Overview 顯示 `OverviewInsightBanner`，點擊開啟 `WasteAnalysis`
4. `isLikelyWasted` 條件：`usageStatus === "unused"` 或超過 30 天未確認

---

## 元件說明

### Auth（`components/auth/`）

`AuthPage.jsx` 協調 `mode`（login / register）和 `step`（1/2/3），所有 state 在頂層，步驟切換不丟失。login ↔ register 切換靠 `navigate("/login")` / `navigate("/signup")`（路由切換自動清空 state）。

### Layout

**`Sidebar.jsx`**：從畫面右側滑入（`translate-x-full` ↔ `translate-x-0`）。含導覽、新增訂閱入口、帳號資訊與登出。

**`TopBar.jsx`**：漢堡 icon → `sidebarOpen`。接受 `onOpenSearch` prop（只在 `/subscriptions` 路由傳入），點擊搜尋 icon 觸發 SubSearchDialog。

**`MobileTabBar.jsx`**：手機底部固定 tab bar，使用 NavLink active state。「分析」tab 為佔位（disabled）。iOS safe area 用 `env(safe-area-inset-bottom)` 確保內容不被手勢列遮蔽。

### 通用 UI（保留 Custom 元件）

**`CustomDropdown.jsx`**：下拉選單，`footerAction` 插槽可掛底部操作按鈕（如「+ 管理分類」）。在使用 footerAction 插槽的場景保留不改為 DropdownMenu。

**`DatePicker.jsx`**：日期選擇器，以 `Calendar` + `Popover` 實作（取代原先的自建版本）。Props：`value`（YYYY-MM-DD）、`onChange`、`variant`（`"white"` | `"gray"`）、`hasError`（紅框）、`placement`（`"bottom"` | `"top"` | `"center"`）。

**`CustomPaymentDialog.jsx`**：自訂付款方式輸入（z-[60]），`AddSubModal` 與 `SubEditModal` 共用。

**`DeleteConfirmModal.jsx`**：通用刪除確認（Dialog，size="sm"）。Props：`name, onConfirm, onCancel`。

### Overview 子元件

**`OverviewSummaryCard.jsx`**：數字摘要卡片。Props：`title`、`value`、`note`、`icon`、`tone`（`"warning"` | `"danger"` | 預設）。

**`OverviewSubscriptionSections.jsx`**：導出兩個 section 元件：
- `UpcomingPaymentsSection` — 即將扣款訂閱清單（7 天內 → 顯示 7 天內，否則顯示最近 3 筆）
- `NeedsAttentionSection` — 需要留意的訂閱（按最後確認日期排序）

**`OverviewInsightBanner.jsx`**：浪費分析入口 banner，顯示可能浪費的訂閱數與省錢金額，點擊觸發 `WasteAnalysis` 彈窗。

**`SpendingChart.jsx`**：6 個月分類堆疊長條圖，**純 CSS，無第三方圖表套件**。點擊 bar 觸發 `onSelectMonth`，tooltip 有邊緣偵測（最左 `left-0`，最右 `right-0`，其餘居中）。

> **Overview.jsx 本身**也直接管理 `SubDetailModal` 和 `SubEditModal`，點擊任何訂閱卡片觸發 detail → edit 流程。`FloatingNotificationButton` 為佔位元件（桌機右下角）。

### 設定元件（`components/settings/`）

`Settings.jsx` 只管 `activeSection` state，負責渲染 6 格導覽卡片或委派給 active section component。每個 section 元件自行管理 local state 與對應的 Dialog。

- **`shared/`**：`FieldRow`、`ToggleRow`、`SectionBlock` — 三個無邏輯的排版元件，所有 section 共用。
- **`sections/AccountSection`**：`editingField`、`showPasswordDialog` state。用 `EditFieldDialog` 修改 name/email，`PasswordDialog` 修改密碼，儲存後呼叫 `onUpdateUser`。
- **`sections/FinanceSection`**：`monthlyIncome`、`monthlyBudget` local 副本 + `showFinanceDialog`。`FinanceModal` 確認後同時更新 local state 與 authUser。
- **`sections/CategoriesSection`**：顯示分類 chip 列表，管理 `CatManagerModal` ↔ `AddCatModal` 兩層彈窗流程（同 AddSubModal 的分類流程）。
- **`sections/NotificationsSection`**：自包含，使用 `useLocalStorage` 管理 `renewalAlert` / `rateAlert`，無需 props。
- **`sections/DisplaySection`**：貨幣 dropdown（接受 `currency` / `onCurrencyChange` props）+ 預設付款方式（local state）+ 語言切換（`useLocalStorage("language")`）。
- **`sections/SecuritySection`**：`showPasswordDialog` + `showResetConfirm` local state。刪除資料需二次確認後呼叫 `onClearAll`。

### 訂閱元件

**`form/AddSubModal.jsx`** / **`form/SubEditModal.jsx`**：新增 / 編輯彈窗（Dialog，size="lg"）。共用 `AddSubFormStep`（以 `formId` 區分）與 `CustomPaymentDialog`。頭像有 `<input type="color">` 色彩選擇器，空字串 fallback 到 `getAvatarColor(name)`。表單邏輯集中於 `subForm.js`。

**`category/CatManagerModal.jsx`**（Dialog，size="sm"）+ **`category/AddCatModal.jsx`**（z-[60]）：兩層分類管理。`AddCatModal` 的「直接套用」（`applyImmediately=true`）新增並立即選用，關閉所有彈窗。顏色亮度驗證：BT.601 > 0.85 禁止建立。

**`form/AddSubFormStep.jsx`**：兩欄表單，左欄（名稱、分類、金額、日期、週期、頻率）+ 右欄（提醒、付款、備註），`formId` prop 支援在不同 form 中複用。

**`list/SubSearchDialog.jsx`**：全文搜尋彈窗，由 TopBar 搜尋按鈕或 SubToolbar 觸發。`showSearch` / `onSearchChange` 為 optionally-controlled（未傳入時使用內部 state）。

---

## CSS 動畫（`index.css`）

```css
.page-enter  → page-fade-in 220ms  /* 頁面切換 */
.row-enter   → row-in 250ms        /* 列表列交錯：style={{ "--row-index": index }} */
.modal-enter → modal-in 200ms      /* Modal 縮放淡入 */
```

---

## Design Token 系統

Token 定義在 `src/styles/tokens.css`，由 `src/index.css` import。三個 section：

1. **`@theme`** → Tailwind v4 utility class 生成（`bg-subtrack-card`、`rounded-card`、`shadow-card` 等）
2. **`:root` 語意 token** → `--color-*`、`--radius-*`、`--shadow-*`、`--modal-*`、`--sidebar-*`、`--z-*`
3. **`:root` shadcn bridge** → `--primary`、`--background`、`--border`、`--radius` 等，alias 到 SubTrack token
4. **`:root` backward-compat** → `--subtrack-*` alias 到語意 token

### 顏色職責分工

| Token | 值 | 用途 |
|-------|----|------|
| `--color-primary` | sage green | 互動元素：按鈕、focus ring、開關、選取狀態 |
| `--color-primary-strong` | 深綠 | hover / emphasis |
| `--color-primary-soft` | 淺綠 | 背景、chip 次要按鈕 |
| `--color-text-secondary` | navy #1d3557 | 文字強調：財務數字、Modal 標題標籤 |
| `--color-text-secondary-strong` | 深藍 | 文字 hover state |

### Radius 使用規範

| 情境 | Token | 換算 |
|------|-------|------|
| 小 badge、tag | `--radius-xs` | 4px |
| chip、sub-element | `--radius-sm` | 8px |
| 按鈕、輸入框 | `--radius-md` | 12px |
| 導覽項目、卡片內元素 | `--radius-lg` | 16px |
| 頁面卡片 | `--radius-card` | 24px |
| Panel、Sidebar | `--radius-panel` | 28px |
| Modal 對話框 | `--radius-modal` | 24px |
| 圓形、pill 按鈕 | `--radius-pill` | 9999px |

### Modal size 對照

| size prop | Token | 寬度 | 使用場景 |
|-----------|-------|------|----------|
| `sm` | `--modal-width-sm` | 384px | DeleteConfirmModal、Settings dialogs、CatManagerModal |
| `md` | `--modal-width-md` | 672px | SubDetailModal、WasteAnalysis |
| `lg` | `--modal-width-lg` | 936px | AddSubModal、SubEditModal |
| `xl` | `--modal-width-xl` | 1152px | 保留 |

### 顏色規則

不要寫 hex，永遠用語意 token：

| 禁止 | 改用 |
|------|------|
| `#6f8f72` | `var(--color-primary)` |
| `#1d3557` | `var(--color-text-secondary)` |
| `#162843` | `var(--color-text-secondary-strong)` |
| `#f7f4ed` | `var(--color-bg)` |
| `border-slate-100` | `border-[var(--color-border)]` |
| `bg-slate-50` | `bg-[var(--color-panel)]` |
| `bg-white` (modal/card) | `bg-[var(--color-card)]` |

### Sidebar Layout Token

```css
/* index.css */
@media (min-width: 1024px) {
  .lg-sidebar-offset {
    padding-left: calc(var(--sidebar-width-collapsed) + 2rem);
  }
}
```

在 `App.jsx` 的 `<main>` 使用 `lg-sidebar-offset`，不要硬寫 `lg:pl-[6.75rem]`。

### Tailwind @theme utility classes

| Class | 對應 token |
|-------|-----------|
| `bg-subtrack-card` | `--color-card` |
| `bg-subtrack-panel` | `--color-panel` |
| `bg-subtrack-surface` | `--color-surface` |
| `text-subtrack-muted` | `--color-text-muted` |
| `border-subtrack-line` | `--color-border` |
| `rounded-card` | `--radius-card` |
| `rounded-modal` | `--radius-modal` |
| `shadow-card` | `--shadow-card` |

### 新增元件 Checklist

- [ ] 顏色用 `var(--color-*)` 語意 token，不寫 hex
- [ ] 互動元素（按鈕、focus、開關）用 `--color-primary`；文字強調用 `--color-text-secondary`
- [ ] 圓角從 `--radius-*` token 選擇，不寫 `rounded-2xl` / `rounded-3xl`
- [ ] 陰影用 `--shadow-card` / `--shadow-modal`
- [ ] Modal 用 Dialog + `size` prop（不用自建 backdrop）
- [ ] 按鈕用 `Button` variant，主要 CTA 用 `default`（綠色），不用 `navy`
- [ ] Badge / status chip 用 `Badge` variant
- [ ] 輸入框用 `Input`，需 icon 時傳 `icon` prop
- [ ] 不新增 `--subtrack-*` 舊名稱

---

## z-index 層級

| 元素 | z-index |
|------|---------|
| Toast | 100（fixed，最頂層） |
| AddCatModal（兩層彈窗） | z-[60] |
| Modal（Radix Dialog） | 50（`--z-modal`） |
| Sidebar | 40（`--z-sidebar`） |
| TopBar | z-30 |

---

## localStorage 資料結構

| Key | 內容 |
|-----|------|
| `authUser` | `{ name, email, password(hashed), monthlyIncome, monthlyBudget, createdAt }` |
| `subscriptions:{email}` | 訂閱陣列 |
| `customCategories:{email}` | 自訂分類 `[{ name, color }]` |
| `language` | 語言設定 |
| `renewalAlert` | 續訂提醒 toggle |
| `rateAlert` | 匯率變動 toggle |

幣別（TWD / USD）不持久化。

---

## 開發指令

```bash
npm install       # 安裝相依套件
npm run dev       # 啟動開發伺服器（http://localhost:5173）
npm run build     # 正式環境建置 → dist/
npm run preview   # 預覽正式建置
npm run lint      # ESLint 靜態分析
```

### path alias

`@` → `src/`（vite.config.js `resolve.alias`），可在任何檔案使用：

```js
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

---

## Edge Cases 與已知限制

### 資料完整性

| 情況 | 影響 | 處理方式 |
|------|------|----------|
| `sharedWith` 為 0 | `price / 0 = Infinity` | UI 強制 ≥ 1，JSON 匯入無驗證 |
| `nextBillingDate` 空字串 | `getDaysUntil` 回傳 NaN | 表單必填，不影響既有資料 |
| `nextBillingDate` UTC 解析 | UTC-X 時區可能顯示前一天 | 局部 `setHours(0,0,0,0)` 對齊，非完整修正 |
| `category` 已被刪除 | fallback 色 `#94a3b8` | 可接受 |

### 認證

- 密碼 hash 無 salt，為 Demo 已知限制
- 修改 email 後 `subscriptions:{oldEmail}` 不會自動遷移

### 計算

- `trendPct`：上月為 0 時設為 `null`，Overview header 不顯示箭頭
- `getPast6MonthsData`：空陣列的 `maxBarVal` 有 `, 1` fallback

### 待優化

1. JSON 匯入加結構驗證（至少驗 `id`、`name`、`price`、`sharedWith` 型別）
2. 修改 email 後資料遷移
3. 分類管理重複呼叫模式（AddSubModal、CategoriesSection 各自管理相同 3 個 state）可抽成 `useCategoryModal` hook
4. timezone-safe 日期比較（`new Date("YYYY-MM-DD")` 是 UTC，`new Date()` 是 local）
