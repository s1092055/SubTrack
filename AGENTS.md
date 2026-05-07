# SubTrack — 訂閱管理平台

讓使用者養成紀錄的習慣，一眼看清那些「自動扣款」的錢到底去了哪裡。

## 技術堆疊

- **React 19** + **Vite 7**（含 React Compiler，自動處理 memoization，勿手動加 useMemo/useCallback）
- **Tailwind CSS v4**（透過 `@tailwindcss/vite` 整合，已安裝）
- **ESLint 9**（扁平設定）
- 無測試框架

## 指令

```bash
npm install       # 安裝相依套件
npm run dev       # 啟動開發伺服器（含 HMR）
npm run build     # 正式環境建置 → dist/
npm run preview   # 預覽正式建置結果
npm run lint      # 執行 ESLint
```

## 核心資料結構

每一筆訂閱紀錄的物件結構：

```js
{
  id: "uuid-123",               // 唯一辨識碼，用 crypto.randomUUID() 產生
  name: "Netflix",              // 服務名稱
  category: "娛樂",              // 類別（預設四種 + 使用者自訂）
  price: 390,                   // 金額（台幣）
  cycle: "monthly",             // 週期："monthly" | "yearly"
  sharedWith: 4,                // 總人數（1 = 個人訂閱，2+ = 分帳）
  nextBillingDate: "2026-04-20",// 下次扣款日，格式 YYYY-MM-DD
  reminderDays: 3,              // 提前提醒天數：1 | 3 | 7
  notes: "",                    // 備註說明（選填）
  paymentMethod: "",            // 付款方式（選填）：預設選項 or 自訂文字
}
```

> **注意**：`sharedWith` 表示「總人數」，UI 顯示的是「其他人數」= `sharedWith - 1`。  
> `calcMonthlyPersonal` 除以 `sharedWith`，語意保持一致。

## 檔案結構

```
src/
├── App.jsx
├── pages/                          ← 全頁面元件（路由等級）
│   ├── Overview.jsx                ← 總覽頁：數字摘要 + 圖表
│   ├── SubscriptionList.jsx        ← 訂閱清單頁（搜尋 + 分頁載入）
│   ├── AddSubscriptionForm.jsx     ← 新增訂閱表單（左右兩欄版面）
│   └── Settings.jsx                ← 偏好設定頁（四區塊版面）
├── components/
│   ├── auth/
│   │   └── AuthPage.jsx            ← 登入 / 註冊（三步驟）
│   ├── layout/
│   │   ├── Sidebar.jsx             ← overlay 抽屜（桌機右側 / 手機左側）
│   │   └── TopBar.jsx              ← 頂部列
│   ├── modals/
│   │   ├── CalendarModal.jsx       ← 當月扣款月曆彈窗
│   │   ├── CategoryManagerModal.jsx← 分類管理彈窗
│   │   ├── SubscriptionDetailModal.jsx
│   │   └── SubscriptionEditModal.jsx
│   └── ui/
│       ├── CustomDropdown.jsx      ← 統一風格下拉選單（footerAction 插槽、variant 樣式）
│       ├── SubscriptionItem.jsx    ← 單筆訂閱卡片
│       └── Toast.jsx               ← Toast 通知
├── hooks/                          ← 自訂 React Hooks
│   ├── useLocalStorage.js          ← 同步讀寫 localStorage 的通用 state hook
│   ├── useToast.js                 ← Toast 通知佇列管理
│   ├── useExchangeRate.js          ← 匯率 API 呼叫與快取
│   └── useScrollLock.js            ← Modal 開啟時鎖定 body 捲動
├── utils/
│   ├── subscription.js             ← calcMonthlyPersonal, formatAmount, getDaysUntil, ...
│   ├── analytics.js                ← billingTotalForMonth, getPast6MonthsData
│   ├── finance.js                  ← calcBudgetAnalysis
│   └── format.js                   ← getStatusInfo, getDaysTextClass, formatMoney
├── constants/                      ← 分類、品牌色、付款方式、導覽、表單選項
└── data/
    └── initialSubscriptions.js
```

## Component 架構

```
App                             ← 管理所有 State，向下傳遞 props
├── AuthPage                    ← 登入 / 註冊（三步驟），authUser === null 時渲染
├── TopBar                      ← 頂部列（桌機：品牌 + 右側 toggle；手機：漢堡 + 頁面標題）
├── Sidebar                     ← overlay 抽屜（桌機：右側滑入；手機：左側滑入）
│                                  含導覽、幣別切換、使用者名稱、登出
├── Overview                    ← 總覽頁：數字摘要 + 圖表
│   └── CalendarModal           ← 當月扣款月曆（彈窗）
├── SubscriptionList            ← 訂閱清單頁（搜尋 + 分頁載入）
│   ├── SubscriptionItem        ← 單筆訂閱卡片（含扣款日警示）
│   ├── SubscriptionDetailModal ← 訂閱詳情彈窗
│   └── SubscriptionEditModal   ← 編輯訂閱彈窗
├── AddSubscriptionForm         ← 新增訂閱表單（左右兩欄版面）
│   └── CategoryManagerModal    ← 分類管理彈窗
└── Settings                    ← 偏好設定頁（四區塊版面）
```

## State 設計（App.jsx）

所有 State 集中在 `App`，衍生值直接計算，不存入 State：

```js
// 核心資料（透過 useLocalStorage 同步寫入 localStorage）
// authUser 必須先載入，email 才能用於下方 namespaced key
const [authUser, setAuthUser] = useLocalStorage("authUser", null)  // { name, email, password(hashed), monthlyIncome, monthlyBudget } | null
const userKey = authUser?.email ?? ""
// 訂閱與分類以 email 為命名空間，確保不同使用者資料互不影響
const [subscriptions, setSubscriptions] = useLocalStorage(`subscriptions:${userKey}`, initialData)
const [customCategories, setCustomCategories] = useLocalStorage(`customCategories:${userKey}`, [])

// UI 狀態
const [currentPage, setCurrentPage] = useState("overview")
// 可選值："overview" | "list" | "add" | "settings"
const [sidebarOpen, setSidebarOpen] = useState(false)    // sidebar overlay 開關（桌機 + 手機共用）

// Toast（透過 useToast）
const { toasts, showToast } = useToast()

// 匯率（透過 useExchangeRate）
const [currency, setCurrency] = useState("TWD")          // "TWD" | "USD"
const exchangeRate = useExchangeRate(currency, () => setCurrency("TWD"))

// 衍生值（React Compiler 自動 memoize，勿手動包 useMemo）
const allCategories = [...DEFAULT_CATEGORY_LIST, ...customCategories]
```

## 自訂 Hooks（src/hooks/）

| Hook | 用途 |
|------|------|
| `useLocalStorage(key, defaultValue)` | 讀寫 localStorage，回傳 `[value, setValue]`；value 為 null 時自動 removeItem；key 變更時（切換使用者帳號）自動重新載入對應資料 |
| `useToast()` | 回傳 `{ toasts, showToast }`；showToast 3.5 秒後自動移除 |
| `useExchangeRate(currency, onFetchError)` | currency 切換為 USD 時呼叫 open.er-api.com，快取結果避免重複請求 |
| `useScrollLock()` | mount 時設 `body.overflow = hidden`，unmount 時還原 |

## 常數檔案（src/constants/）

| 檔案 | 內容 |
|------|------|
| `categories.js` | `CATEGORIES`、`CATEGORY_NAMES`、`DEFAULT_CATEGORY_LIST`、`getCategoryColor(name)`、`getCategoryBadge(name)` |
| `brandColors.js` | `getAvatarColor(name)`（品牌名稱對應色彩，含 fallback 調色盤） |
| `paymentMethods.js` | `PAYMENT_METHODS`（預設付款方式陣列，純文字 value） |
| `navConfig.jsx` | `NAV_ITEMS`（導覽項目）、`NAV_ICONS`（SVG 圖示物件）— Sidebar 與 TopBar 共用 |
| `formOptions.js` | `REMINDER_OPTIONS`（提前提醒天數選項）— AddSubscriptionForm 與 SubscriptionEditModal 共用 |

## 工具函式（src/utils/）

**auth.js**
```js
hashPassword(password)  // 使用 Web Crypto API（SHA-256）雜湊密碼，回傳 hex 字串（async）
```

**subscription.js**
```js
calcMonthlyPersonal(sub)                    // 計算個人每月費用（yearly 除以 12）
formatAmount(twd, currency, exchangeRate)   // 格式化金額（TWD/USD）
formatBillingDate(dateStr)                  // 格式化為「M月D日」
getToday()                                  // 取今天日期（時間歸零）
getDaysUntil(dateStr)                       // 計算距今天數（負數 = 已過期）
```

**analytics.js**
```js
billingTotalForMonth(subscriptions, year, month)  // 當月實際帳單總計（月付每月 + 年付只在扣款月）
getPast6MonthsData(subscriptions, today)           // 過去 6 個月分類帳單資料（供長條圖使用）
```

**finance.js**
```js
calcBudgetAnalysis(monthlyIncome, monthlyBudget)   // 計算預算佔比、顏色、分析文字
```

**format.js**
```js
getStatusInfo(days)    // 回傳 { label, dot, text } 狀態標籤樣式
getDaysTextClass(days) // 回傳距今天數的 Tailwind 文字顏色 class
formatMoney(val)       // 格式化為「NT$ 1,000」或「未填寫」
```

> **注意**：`price / sharedWith`（實際扣款金額）與 `calcMonthlyPersonal`（月攤提費用）語意不同。
> 帳單趨勢圖、月曆、詳情等顯示「實際扣款額」時用前者；總覽月支出用後者。

## 分類系統

四個預設分類定義於 `src/constants/categories.js`：

| 分類 | 顏色 |
|------|------|
| 娛樂 | `#a78bfa`（紫） |
| 工作 | `#60a5fa`（藍） |
| 生活 | `#34d399`（綠） |
| 其他 | `#94a3b8`（灰） |

使用者可透過 `CategoryManagerModal` 新增自訂分類（附自訂顏色），儲存於 `localStorage`。  
取得分類顏色請用 `getCategoryColor(name)`，不要直接查 `CATEGORIES` 物件（已有 fallback 處理）。

## 付款方式系統

預設選項定義於 `src/constants/paymentMethods.js`（現金、信用卡、金融卡、Apple Pay、Google Pay、LINE Pay、街口支付、銀行轉帳）。  
UI 提供 chip 選擇 + 「+ 其他」自訂輸入 dialog，選取後儲存為純文字至 `paymentMethod` 欄位。

## 已完成功能

### 認證流程（AuthPage）✅
- 登入頁：電子郵件 + 密碼，錯誤提示，開發模式快速登入
- 註冊頁：三步驟流程
  - Step 1：姓名、電子郵件、密碼、確認密碼（2×2 grid）
  - Step 2：月收入、月訂閱預算 + 即時預算分析圓形圖
  - Step 3：確認帳號資訊與財務設定，可返回修改
- 認證資料儲存於 `localStorage`（模擬後端，無真實 API）
- `authUser === null` 顯示 AuthPage；否則顯示主應用

### 基礎 CRUD ✅
- 新增 / 刪除 / 編輯訂閱紀錄（含 sharedWith、notes、paymentMethod）
- 自動計算個人應付金額（`calcMonthlyPersonal`）
- `localStorage` 資料持久化（訂閱清單 + 自訂分類）
- 初始假資料（`src/data/initialSubscriptions.js`）

### 總覽頁（Overview）✅
- 本月總支出 + 與上月趨勢比較
- 即將續費清單（30 天內）+ 月曆彈窗（CalendarModal）
- 過去 6 個月支出趨勢分類長條圖
- 類別分佈進度條
- 近期活動摘要表格（依扣款日排序，前 6 筆）

### 訂閱清單頁（SubscriptionList）✅
- 文字搜尋
- 分頁載入（每次 +5 筆）
- 點擊開啟詳情 Modal（SubscriptionDetailModal）
- 詳情頁可切換到編輯 Modal（SubscriptionEditModal）
- 刪除確認 Modal

### 新增訂閱頁（AddSubscriptionForm）✅
- 左右兩欄版面（3:2 比例）
- 服務資訊：名稱、分類（含 dropdown footer 開啟分類管理）、計費週期、分帳人數（同列三欄）
- 付費資訊：金額、下次扣款日、付款方式（chip + 自訂）
- 提醒與備註：提前提醒天數、備註
- 右側即時預覽卡（所有欄位同步顯示）
- 右側財務影響評估（雙段進度條 + 月總計）
- 手機版底部抽屜預覽（Bottom Sheet）

### 偏好設定（Settings）✅
- 四區塊版面：個人資料、應用設定、通知設定、資料管理
- 貨幣切換（TWD / USD）並串接 `open.er-api.com` 取得匯率
- JSON 匯出 / 匯入
- 重設帳戶（含確認步驟）

### 分類管理（CategoryManagerModal）✅
- 左欄：現有分類 accordion（展開顯示使用該分類的訂閱）
- 右欄：新增分類（名稱輸入 + 色票選擇 + 自訂調色盤 `<input type="color">`）
- 完成按鈕：有名稱 → 新增後關閉；無名稱 → 直接關閉
- 手機版：上下堆疊

### 進階功能 ✅
- 扣款日警示（7 天內 → 橘色，今日 → 標示已扣款）
- Toast 通知系統
- 響應式設計（桌機右側 overlay Sidebar、手機左側 overlay Sidebar、手機版 TopBar）

## Props 資料流

```
App
├── AuthPage            ← onLogin, onRegister
├── TopBar              ← currentPage, onMenuToggle
├── Sidebar             ← currentPage, onNavigate, isOpen, onClose, currency, onCurrencyChange, userName, onLogout
├── Overview            ← subscriptions, currency, exchangeRate, onEdit, onDelete, categories, onAddCategory, onRemoveCategory
├── SubscriptionList    ← subscriptions, onDelete, onEdit, currency, exchangeRate, categories, onAddCategory, onRemoveCategory, onNavigate
├── AddSubscriptionForm ← onAdd, subscriptions, categories, onAddCategory, onRemoveCategory
└── Settings            ← currency, onCurrencyChange, subscriptions, onClearAll, showToast, authUser, onUpdateUser, categories, onAddCategory, onRemoveCategory
```

## CSS 動畫（src/index.css）

```css
/* 頁面切換淡入 */
.page-enter { animation: page-in 220ms ease-out both; }

/* 清單列錯落進場（配合 --row-index CSS 變數） */
.row-enter {
  animation: row-in 250ms ease-out both;
  animation-delay: calc(var(--row-index, 0) * 45ms);
}
```

使用方式：`<div className="row-enter" style={{ "--row-index": index }}>`

## Design Context

### Users
輕度理財的一般人：訂閱越來越多，想一眼看清「錢到底流向哪裡」，但不需要複雜的記帳功能。

### Brand Personality
**精準、清晰、有秩序** — 語氣像一個有條不紊的朋友幫你整理帳單，不說廢話、一目了然、值得信賴。

### Aesthetic Direction
**Refined Editorial Minimalism（精煉編輯式極簡）**
- 純白背景 `#ffffff`，白色卡片，主色海軍藍 `#1d3557`
- 參考：Linear、Vercel dashboard、Stripe 文件站
- 反參考：glassmorphism、AI 的 cyan-on-dark、漸層文字
- 卡片：`border: 1px solid #f1f5f9`，陰影 `0 1px 4px oklch(0% 0 0 / 0.06)`
- TopBar 陰影：`0 1px 12px oklch(0% 0 0 / 0.08)`
- Sidebar 陰影：右側 `-4px 0 24px oklch(0% 0 0 / 0.12)`；左側 `4px 0 16px oklch(0% 0 0 / 0.08)`
- Modal 陰影：`0 24px 64px oklch(0% 0 0 / 0.18)`

### Design Principles
1. **數字為主角** — 財務數字是頁面最清晰的元素，字重與字體為此服務
2. **層次取代均等** — 重要資訊視覺上佔據更大份量，非所有卡片一視同仁
3. **留白是設計** — 區塊間慷慨間距；同組資訊內部保持緊湊
4. **克制的品牌色** — 海軍藍作為錨點，引導注意力，不作裝飾
5. **每個元素都要有理由** — 無純裝飾性的陰影、框線、漸層

---

## 開發邏輯與設計決策

此章節記錄每個功能的開發思路、架構選擇原因與容易踩到的陷阱，是修改任何功能前應先閱讀的參考。

---

### 認證系統（AuthPage）

#### 為什麼用 localStorage 模擬認證
專案定位為純前端 Demo，目標是展示 UI 互動與 React 能力。localStorage 足以模擬「多帳號不互干擾」的行為，不需要後端 API。密碼使用 Web Crypto API（SHA-256）雜湊後儲存，比明文儲存更嚴謹，但仍不具備真正的安全性（無 salt、資料在客戶端可被直接修改）。

#### 三步驟註冊的設計思路
Step 1（基本資料）→ Step 2（財務設定）→ Step 3（確認）。每步驟分開是為了避免一次呈現太多欄位，降低填寫壓力。Step 3 是確認摘要，可返回任一步修改，提交前讓使用者看清楚自己填了什麼。

`monthlyIncome` 和 `monthlyBudget` 儲存在 `authUser` 物件內，而不是獨立的 localStorage key，原因是兩者屬於帳號資料的一部分，跟著 authUser 自然隔離，不需要另外加 email namespace。

#### 三步驟共用同一組 state
所有步驟的欄位（name、email、password、monthlyIncome、monthlyBudget）都宣告在最外層 `AuthPage` 元件，不拆分到各步驟元件。優點：切換步驟時 state 不會消失，使用者可以「上一步」修改。缺點：state 稍多，但因為欄位總數不多，可接受。

#### 固定底部按鈕的實作
三步驟的底部按鈕區使用 `RegisterShell` 的 `footer` prop 注入，外層容器固定 `h-16`，避免不同步驟的按鈕高度不一致。submit 按鈕用 HTML `form` attribute（`<button form="step1">`）綁定到 scrollable 區域內的 `<form id="step1">`，繞過按鈕不在 form 內的 DOM 限制。

#### 登出機制
`handleLogout` 呼叫 `setAuthUser(null)`，`useLocalStorage` 偵測到 value 為 null 時執行 `localStorage.removeItem("authUser")`，`authUser === null` 觸發 App 渲染 `AuthPage`。

---

### 每位使用者的資料隔離

#### 為什麼要做 namespace
不做 namespace 的話，不同帳號登入同一個瀏覽器，會共用同一份 `subscriptions`，導致 A 的訂閱在 B 帳號也看得到。

#### 實作方式：email 作為 key 前綴
```js
const userKey = authUser?.email ?? ""
useLocalStorage(`subscriptions:${userKey}`, initialData)
```
空字串作為 fallback（authUser 為 null 時），此時 App 不渲染，所以 `subscriptions:` 這個 key 不會被實際使用。

#### authUser 必須第一個宣告
`authUser` 的 email 用於建構下方兩個 hook 的 key，因此必須先 `useLocalStorage("authUser")` 取得 email，再宣告 subscriptions 和 customCategories。React hook 不允許條件式呼叫，所以不能「先判斷有沒有 user 再決定要不要宣告 hook」。

#### useLocalStorage 的 key-change effect
切換帳號時，`subscriptions:${userKey}` 的 key 改變，但 React state 不會自動重新初始化。`useLocalStorage` 內部有一個 `useEffect` 監聽 `key` 變更，key 一變就從 localStorage 讀取新值重新 `setValue`：
```js
useEffect(() => {
  const saved = localStorage.getItem(key);
  setValue(saved !== null ? JSON.parse(saved) : defaultValue);
}, [key]);
```
沒有這個 effect，切換帳號後仍會看到上一個帳號的資料。

#### 新用戶的預設資料
`initialSubscriptions.js` 存放 3 筆範例資料（Netflix、Spotify、iCloud）。新用戶的 key 不存在時，`useLocalStorage` 的 `defaultValue` 即為這 3 筆。已有 key 的使用者完全不受影響。

---

### 金額計算：兩種語意

這是最容易搞混的地方，修改任何金額顯示前務必確認：

| 用途 | 公式 | 使用場景 |
|------|------|----------|
| 實際每次扣款金額 | `price / sharedWith` | 帳單列表、月曆、詳情 Modal、近期活動表格 |
| 個人月攤提費用 | `calcMonthlyPersonal(sub)` | 總覽月支出、財務影響評估、帳單趨勢圖 |

`calcMonthlyPersonal` 的邏輯：
- monthly：`price / sharedWith`
- yearly：`price / 12 / sharedWith`

`billingTotalForMonth`（analytics.js）計算「某月的帳單總額」：
- monthly 訂閱：每月都計入
- yearly 訂閱：只有 `nextBillingDate` 的月份才計入，且以 `price / sharedWith` 計（實際扣款）

不要用 `calcMonthlyPersonal` 計算帳單總額，語意不同。

---

### sharedWith 語意

`sharedWith` 是**總人數（含自己）**，不是「其他人數」。

- `sharedWith = 1`：個人訂閱，`price / 1 = price`
- `sharedWith = 4`：與 3 人分帳，UI 顯示「與 3 人分帳」= `sharedWith - 1`

新增 / 編輯表單的「分帳人數」欄位讓使用者輸入「其他人數」，存入前要 `+1`。讀取顯示時要 `-1`。計算金額時直接用 `sharedWith`（不要再 -1）。

---

### 分類系統

#### 兩個來源合併
```js
const allCategories = [...DEFAULT_CATEGORY_LIST, ...customCategories]
```
`DEFAULT_CATEGORY_LIST` 是固定的 4 個預設分類，`customCategories` 是使用者新增的，以 email namespace 存在 localStorage。兩者合併成 `allCategories` 傳給所有需要分類的元件。

#### 永遠用 getCategoryColor(name) 取顏色
直接查 `CATEGORIES[name]` 對自訂分類無效（key 不存在）。`getCategoryColor` 內建 fallback，自訂分類會回傳其儲存的顏色。

#### 分類標籤文字顏色
使用 `getContrastTextColor(hex)` 計算背景亮度，亮度 > 0.85 才用深色文字，其餘一律白色。預設四種分類色亮度約 0.6，全部顯示白色文字。使用者如果輸入接近白色的自訂顏色，才會切換為深色文字。

---

### CustomDropdown

`footerAction` 插槽讓 dropdown 底部可掛載一個操作按鈕（例如「+ 新增付款方式」、「+ 管理分類」），點擊後執行對應 callback 並關閉選單。使用時傳入 `{ label: "文字", onClick: fn }`。

`variant` 支援 `"white"`（白色背景）和預設（slate-50 背景），根據放置的容器背景色選擇。

---

### 圖表實作：純 CSS

過去 6 個月的分類堆疊長條圖以純 CSS 實作，無使用 Chart.js / Recharts / D3 等第三方套件。

**實作思路**：
- 每欄（月份）是一個 `flex flex-col-reverse` 容器，高度固定（如 160px）
- 每個分類的色塊高度 = `(分類金額 / 當月最高金額) * 100%`，用 inline style `height: X%` 設定
- hover 時用 Tailwind `group-hover` 降低非 hover 欄的透明度，突出當前欄
- Tooltip 內容在 hover 時顯示分類明細

**邊緣偵測**：Tooltip 最左欄靠左對齊（`left-0`），最右欄靠右對齊（`right-0`），其餘置中（`-translate-x-1/2 left-1/2`），避免超出視窗邊緣。

---

### Modal 系統

所有 Modal 元件都透過 `useScrollLock()` 防止背景捲動：
```js
// 元件 mount 時自動執行，unmount 時自動還原
useScrollLock();
```

背景遮罩統一為 `bg-black/40 backdrop-blur-sm`，點擊遮罩或按 Escape 關閉（各 Modal 自行實作 `onClose` 回呼）。

Modal 的 `z-index` 層級：backdrop → `z-50`，內容卡片 → `z-50`（在 backdrop 之上，因為是子元素）。Sidebar → `z-40`，TopBar → `z-30`，避免層疊衝突。

---

### Sidebar 響應式設計

**桌機（lg+）**：Sidebar 從畫面**右側**滑入，`translate-x-full`（收起）↔ `translate-x-0`（展開）。主內容區不需調整寬度。

**手機**：Sidebar 從畫面**左側**滑入，`-translate-x-full`（收起）↔ `translate-x-0`（展開）。同一個 Sidebar 元件，用 Tailwind 的 `lg:` 前綴切換 transform 方向和 fixed 位置。

兩者共用同一個 `sidebarOpen` state。

---

### 分頁載入（Infinite-style Load More）

```js
const [visibleCount, setVisibleCount] = useState(5);
const visible = filtered.slice(0, visibleCount);
```

搜尋篩選後重置 `visibleCount = 5`（`useEffect` 監聽 `searchQuery`），避免搜尋結果已經少於目前 visibleCount 但仍顯示「載入更多」的狀態。

**為什麼不用真正的虛擬滾動**：訂閱數量通常不超過 50 筆，Load More 的操作感足夠，不需要 windowing。

---

### 日期與扣款日警示

`getDaysUntil(dateStr)` 計算距離今天的天數：
- 正數 = 幾天後扣款
- 0 = 今天扣款
- 負數 = 已過期（下次扣款日尚未更新）

`getStatusInfo(days)` 依天數回傳狀態樣式：
- `days <= 0`：「已付」（綠色）
- `days <= 7`：「即將扣款」（橘色）
- 其他：「待扣款」（灰色）

訂閱卡片（SubscriptionItem）會在 7 天內顯示橘色文字，今日扣款顯示「今日扣款」badge。

---

### 財務影響評估（AddSubscriptionForm 右側）

右側顯示兩條進度條：
1. **新增前**：目前所有訂閱的月支出 / 月預算
2. **新增後**：加上新訂閱後的月支出 / 月預算

兩條都是即時計算，依賴表單 state（`price`、`cycle`、`sharedWith`）的即時更新。`calcBudgetAnalysis` 根據佔比回傳顏色（綠 < 50%、黃 50-80%、紅 > 80%）。

`monthlyBudget` 和 `monthlyIncome` 來自 `authUser`，因此 Settings 的財務設定更新後，AddSubscriptionForm 下次打開即反映新數值（透過 props 傳入）。

---

### Settings 的持久化設計

| 設定 | 儲存位置 | 理由 |
|------|----------|------|
| 語言 | `useLocalStorage("language")` | 跨頁面、跨 session 持久 |
| 續訂提醒 toggle | `useLocalStorage("renewalAlert")` | 同上 |
| 匯率變動 toggle | `useLocalStorage("rateAlert")` | 同上 |
| 月收入 / 月預算 | `authUser.monthlyIncome/monthlyBudget` | 屬於帳號資料，跟著 authUser namespace 自動隔離 |
| 幣別（TWD/USD） | `useState`（App.jsx） | 每次開啟 App 預設 TWD，不需持久化 |

更新財務設定呼叫 `onUpdateUser({ monthlyIncome, monthlyBudget })`，App 中的 `setAuthUser(prev => ({ ...prev, ...updated }))` 會合併更新並自動同步到 localStorage。

---

### useExchangeRate 的快取邏輯

```js
// hook 內部用 ref 快取結果
const cacheRef = useRef(null);
```

第一次切換到 USD 時呼叫 API，結果存入 ref。之後再切換幣別時直接用快取，不重複請求。

失敗時（網路錯誤或 API 回應異常）呼叫 `onFetchError`，App 中設為 `() => setCurrency("TWD")`，自動還原為台幣。

---

### Toast 系統

```js
showToast(message, type)
// type: "success"（預設）| "error"
```

每則 toast 有唯一 id（`Date.now()`），3.5 秒後自動從 `toasts` 陣列移除。多則 toast 可同時堆疊。Toast 元件放在 App 最底層，fixed 定位於右下角。

---

### 分類管理（CategoryManagerModal）邏輯

- **新增**：`onAddCategory(newCat)` → App 的 `setCustomCategories(prev => [...prev, newCat])` → 自動同步 localStorage
- **刪除**：`onRemoveCategory(catName)` → 依名稱過濾；預設分類（`DEFAULT_CATEGORY_LIST` 內的）不允許刪除，UI 隱藏刪除按鈕
- **Accordion**：展開後顯示使用該分類的訂閱清單，讓使用者在刪除前了解影響
- **完成按鈕**：若 `newCategoryName` 有值 → 新增後關閉；若無值 → 直接關閉。避免使用者誤按導致空名稱分類被建立
