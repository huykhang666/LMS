# LMS PRO — KHẮC PHỤC GIAO DIỆN ADMIN (UI Audit & Fix)
### Tài liệu bổ sung cho `SetupCourse.md` — chỉ sửa Styling, không đổi cấu trúc/logic

> Phạm vi: file này **không** định nghĩa lại Design System (đã có ở mục 3 của
> `SetupCourse.md`). File này chỉ liệt kê **chính xác** những nơi code hiện tại
> đang lệch khỏi Design System đã chốt, và cách sửa từng nơi. Agent đọc file này
> CÙNG VỚI `SetupCourse.md` — không tự sáng tạo màu/font mới ngoài 2 file này.

---

## 0. TẠI SAO GIAO DIỆN HIỆN TẠI "XẤU" — CHẨN ĐOÁN GỐC RỄ

Đối chiếu 5 màn hình hiện tại (`/admin`, `/admin/courses`, `/admin/users`,
`/admin/analytics`, `/app/dashboard`) với mục 3.2–3.4 của `SetupCourse.md`,
đây là danh sách lệch chuẩn — **agent phải tự kiểm tra từng dòng này có đúng
hay không trước khi báo đã làm xong**:

| # | Lệch chuẩn quan sát được trên UI hiện tại | Đúng theo Design System phải là |
|---|---|---|
| 1 | Nền trang màu trắng tinh `#FFFFFF`, không có `--color-paper` | Nền trang phải là `#F6F5F0` (giấy ngả xanh mực) |
| 2 | Banner "Chào mừng trở lại" dùng gradient tím-tím (`from-purple-600 to-purple-800` hoặc tương tự) | Không dùng gradient tím. Banner phải dùng `--color-ink` làm nền hoặc `--color-paper-raised` + viền trái `--color-accent` |
| 3 | 4 stat card (Tổng số khóa học, Đã xuất bản, Khóa học nháp, Học viên đăng ký) đồng dạng 100%, border tím nhạt giống nhau | Theo mục 3.2, card phải dùng `--color-paper-raised` nền trắng, border `--color-border` (xám ngả vàng, KHÔNG phải tím), số liệu dùng `--font-mono` |
| 4 | Sidebar trái dùng active state nền tím phẳng (`bg-purple-600`), icon mặc định Lucide không có chủ đích | Active state sidebar phải dùng `--color-ink` chữ + viền trái 3px `--color-accent`, không nền phẳng tím |
| 5 | Toàn bộ text dùng 1 font hệ thống duy nhất (system-ui/sans mặc định trình duyệt) — không thấy font serif nào ở heading | Heading lớn ("Khu vực quản trị hệ thống", "Quản lý khóa học"...) PHẢI dùng `--font-display` (Fraunces). Hiện tại 100% đang là `--font-body` hoặc font mặc định |
| 6 | Badge "QUẢN TRỊ VIÊN", "HỌC VIÊN", "HOẠT ĐỘNG" dùng nền tím/xanh lá tươi, bo tròn pill quá mức | Badge trạng thái dùng `--color-success-soft`/`--color-accent-soft` làm nền, chữ màu đậm tương ứng (`--color-success`/`--color-ink`), bo `--radius-sm`, KHÔNG bo pill toàn phần |
| 7 | Empty state ("Chưa có khóa học nào", "Chưa có khóa học hoạt động") — icon outline xám nhạt + text mô tả thụ động | Theo mục 3.5 (Copy voice): phải là lời mời hành động, không phải mô tả tình trạng. Cách trình bày: khung viền `--color-border` nét đứt, copy đổi giọng văn (xem mục 3 bên dưới) |
| 8 | Banner "Chế độ Demo (Mock Mode)" và "Lưu ý chi phí vận hành" dùng icon tròn vàng + nền vàng nhạt mặc định kiểu "alert box" Bootstrap | Phải dùng style nhất quán với hệ thống: nền `--color-warning-soft` (cần thêm token, xem mục 1.3), border trái 3px `--color-warning`, KHÔNG bo tròn icon trong vòng tròn |
| 9 | Số liệu lớn (`0`, `3`, `1.482 giờ`, `64.5%`, `924 lượt`) đang dùng font-weight bold của font body mặc định | Phải dùng `--font-mono` (IBM Plex Mono) weight 500 theo mục 3.3 — đây là điểm dễ thấy nhất để phân biệt "giống Udemy mặc định" với "đúng bản sắc LMS Pro" |
| 10 | Card "Quy trình biên soạn" dùng số thứ tự (1,2,3,4) trong vòng tròn tím đặc — đúng kiểu "AI-generated numbered list" | Giữ số thứ tự (ở đây hợp lý vì là quy trình tuần tự thật), nhưng đổi vòng tròn từ tím đặc sang viền `--color-ink`, nền trong, chữ số `--font-mono` |
| 11 | Toàn bộ border-radius lớn, bo tròn nhiều (card, button, badge) — giống mặc định Tailwind `rounded-xl`/`rounded-full` | Theo mục 3.2: `--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 14px` — KHÔNG dùng `rounded-full` trừ avatar |
| 12 | Trang `/app/dashboard` (học viên) hiện đang dùng layout giống hệt trang admin, cùng 1 bộ màu | Learner app và Admin app phải dùng layout riêng theo mục 4 (`features/dashboard` khác `features/admin`), nhưng **chia sẻ chung 1 design token** — hiện tại đang đúng phần "chung token" nhưng token đó lại sai (xem #1–11) |

**Kết luận chẩn đoán**: agent KHÔNG cần thiết kế lại từ đầu. Token đã được định
nghĩa đầy đủ ở `SetupCourse.md` mục 3.2–3.4 nhưng **chưa được áp dụng vào code**
— file `styles/tokens.css` có thể đang trống/chưa import, hoặc component đang
hardcode class Tailwind màu tím (`purple-600`, `indigo-500`...) thay vì dùng
CSS variable. Việc sửa là **tìm và thay thế**, không phải sáng tạo mới.

---

## 1. VIỆC ĐẦU TIÊN — KIỂM TRA TRƯỚC KHI SỬA BẤT KỲ COMPONENT NÀO

### 1.1 Kiểm tra file `src/styles/tokens.css` đã tồn tại và được import chưa

```bash
# Agent chạy lệnh này trước, báo cáo kết quả trước khi sửa gì khác
cat src/styles/tokens.css 2>/dev/null || echo "CHƯA TỒN TẠI"
grep -r "tokens.css" src/main.tsx src/app/*.tsx 2>/dev/null || echo "CHƯA ĐƯỢC IMPORT"
```

Nếu "CHƯA TỒN TẠI" hoặc "CHƯA ĐƯỢC IMPORT" — đây chính là nguyên nhân gốc rễ.
Tạo file theo đúng mục 3.2 của `SetupCourse.md`, copy nguyên văn:

```css
/* src/styles/tokens.css */
:root {
  /* Nền & bề mặt */
  --color-paper:        #F6F5F0;
  --color-paper-raised: #FFFFFF;
  --color-paper-dim:    #ECEAE2;

  /* Mực */
  --color-ink:          #1B2A4A;
  --color-ink-soft:     #44557A;

  /* Accent */
  --color-accent:       #E0734A;
  --color-accent-soft:  #F3C5A8;

  /* Trạng thái học tập */
  --color-success:      #3E7C59;
  --color-success-soft: #D9E8DD;
  --color-warning:      #C98A2C;
  --color-warning-soft: #F3E4C9;   /* THÊM MỚI — file gốc thiếu biến -soft cho warning */
  --color-danger:       #B3402C;
  --color-danger-soft:  #F0D7D1;   /* THÊM MỚI — cần cho badge lỗi, nút xóa hover */

  /* Trung tính */
  --color-muted:        #8A8170;
  --color-border:        #DCD8CC;

  /* Typography */
  --font-display: 'Fraunces', 'Source Serif 4', serif;
  --font-body:    'Public Sans', 'Inter', sans-serif;
  --font-mono:    'IBM Plex Mono', monospace;

  /* Bán kính */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;

  /* Khoảng cách */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px; --space-12: 48px;
}
```

> Hai biến `--color-warning-soft` và `--color-danger-soft` được thêm mới ở đây
> vì file gốc `SetupCourse.md` định nghĩa `--color-warning`/`--color-danger`
> nhưng quên định nghĩa bản "-soft" (nền nhạt) như đã làm với success/accent.
> Badge và alert box cần bản nền nhạt này — không tự chọn màu khác ngoài quy
> tắc phối màu đã có (lấy cùng hue, tăng độ sáng ~70%).

### 1.2 Khai báo font qua Google Fonts (hoặc self-host nếu cần tối ưu)

Trong `index.html`, thêm vào `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
```

> Lý do dùng đúng 3 family, đúng các weight được liệt kê ở mục 3.3 của
> `SetupCourse.md` (không tải thêm weight không dùng tới — tốn băng thông tải
> trang, đặc biệt quan trọng vì frontend này đã ưu tiên tối ưu tải video, không
> nên lãng phí băng thông cho font không cần thiết).

### 1.3 Cập nhật `tailwind.config.js` — map token vào Tailwind, KHÔNG hardcode hex trong component

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper:        'var(--color-paper)',
        'paper-raised': 'var(--color-paper-raised)',
        'paper-dim':  'var(--color-paper-dim)',
        ink:          'var(--color-ink)',
        'ink-soft':   'var(--color-ink-soft)',
        accent:       'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        success:      'var(--color-success)',
        'success-soft': 'var(--color-success-soft)',
        warning:      'var(--color-warning)',
        'warning-soft': 'var(--color-warning-soft)',
        danger:       'var(--color-danger)',
        'danger-soft': 'var(--color-danger-soft)',
        muted:        'var(--color-muted)',
        border:       'var(--color-border)',
      },
      fontFamily: {
        display: ['Fraunces', 'Source Serif 4', 'serif'],
        body:    ['Public Sans', 'Inter', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
    },
  },
  plugins: [],
};
```

Sau bước này, mọi component dùng `bg-purple-600` / `text-indigo-500` / bất kỳ
màu Tailwind mặc định nào liên quan tới giao diện chính (không phải icon
semantic tạm thời) đều phải được thay bằng `bg-ink`, `bg-accent`, `text-ink`,
`border-border`, v.v. **Việc tìm-và-thay này là trọng tâm của toàn bộ task.**

### 1.4 Lệnh tìm nhanh các chỗ đang hardcode sai màu (agent chạy để khoanh vùng việc cần sửa)

```bash
grep -rn "purple-" src/features src/shared --include="*.tsx" | wc -l
grep -rn "indigo-" src/features src/shared --include="*.tsx" | wc -l
grep -rn "rounded-full" src/features/admin src/features/dashboard --include="*.tsx"
grep -rn "rounded-xl\|rounded-2xl" src/features/admin src/features/dashboard --include="*.tsx"
```

Báo cáo số lượng match trước khi sửa, để biết phạm vi thật của việc cần làm.

---

## 2. SỬA CỤ THỂ TỪNG MÀN HÌNH (theo đúng route đã chạy trên localhost:5173)

### 2.1 `/admin` — Trang Tổng quan (`AdminOverviewPage`)

**Vị trí component dự kiến**: `src/features/admin/components/AdminOverviewPage.tsx`
(hoặc tên tương đương agent đã đặt — agent tự định vị file đúng theo cấu trúc
mục 4 của `SetupCourse.md`, không tạo file trùng lặp).

**2.1.1 — Banner "Chế độ Demo (Mock Mode) đang bật"**

Hiện tại: nền vàng nhạt mặc định kiểu cảnh báo Bootstrap, icon tròn.
Sửa thành:

```tsx
<div className="bg-warning-soft border-l-[3px] border-warning rounded-sm px-4 py-3 flex items-start gap-3">
  <InfoIcon className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
  <p className="font-body text-sm text-ink-soft">
    Bạn đang xem dữ liệu demo lưu cục bộ trên trình duyệt này. Đăng nhập tài
    khoản quản trị bằng Email:{' '}
    <code className="font-mono text-xs bg-paper-dim px-1 py-0.5 rounded-sm">admin@lms.pro</code>
    {' '}/ Mật khẩu:{' '}
    <code className="font-mono text-xs bg-paper-dim px-1 py-0.5 rounded-sm">admin123</code>.
    Khi bạn deploy lên Vercel kèm các biến cấu hình Firebase thật, hệ thống sẽ
    tự động chuyển sang chế độ dữ liệu thật kết nối với Firestore.
  </p>
</div>
```

Bỏ icon tròn nền vàng đặc — chỉ dùng icon outline đơn sắc `text-warning`,
không có khung tròn bọc icon (khung tròn là nguyên nhân gây cảm giác "alert
box mặc định").

**2.1.2 — Banner "Chào mừng trở lại, Quản trị viên"**

Hiện tại: gradient tím-tím toàn banner, nút "Tạo khóa học mới" màu cam nổi
trên nền tím (2 màu nóng cạnh nhau gây chói).

Sửa thành — bỏ gradient hoàn toàn, dùng `--color-ink` làm nền đặc (không
gradient), accent chỉ xuất hiện ở nút CTA:

```tsx
<div className="bg-ink rounded-lg px-6 py-6 flex items-center justify-between">
  <div>
    <p className="font-mono text-xs text-accent-soft uppercase tracking-wide mb-1">
      Hệ thống quản trị LMS
    </p>
    <h1 className="font-display text-2xl text-paper-raised mb-2">
      Chào mừng trở lại, Quản trị viên
    </h1>
    <p className="font-body text-sm text-paper-dim max-w-lg">
      Chào mừng bạn đến khu vực tổng quan quản lý. Tại đây bạn có thể kiểm
      soát các khóa học, cấu trúc bài giảng và quản lý phân quyền học viên.
    </p>
  </div>
  <button className="bg-accent hover:bg-accent/90 text-paper-raised font-body font-medium text-sm px-4 py-2.5 rounded-md flex items-center gap-2 flex-shrink-0">
    <PlusIcon className="w-4 h-4" />
    Tạo khóa học mới
  </button>
</div>
```

Lý do bỏ gradient: mục 3.2 không định nghĩa bất kỳ gradient nào trong design
token — toàn bộ hệ thống màu là **flat color**. Banner gradient tím hiện tại
không nằm trong bất kỳ token nào, là chỗ agent code trước đã tự thêm ngoài
spec.

**2.1.3 — 4 Stat card ("Tổng số khóa học", "Đã xuất bản", "Khóa học nháp",
"Học viên đăng ký")**

Hiện tại: 4 card giống nhau 100%, border tím nhạt đồng dạng, số liệu dùng font
body bold thay vì mono.

Sửa thành — card nền trắng `--color-paper-raised`, border `--color-border`
(không phải tím), số liệu dùng `font-mono`. Card "Học viên đăng ký" có số
liệu khác 0 nên được nhấn nhẹ viền `accent` để mắt biết đây là số liệu đang
hoạt động:

```tsx
function StatCard({ label, value, icon: Icon, accented = false }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-paper-raised rounded-md p-4 border',
        accented ? 'border-accent' : 'border-border'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-muted" />
        <span className="font-body text-xs text-muted uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-mono text-2xl font-medium text-ink">{value}</p>
    </div>
  );
}

// Cách dùng trong AdminOverviewPage:
<div className="grid grid-cols-4 gap-3">
  <StatCard label="Tổng số khóa học" value={totalCourses} icon={BookIcon} />
  <StatCard label="Đã xuất bản" value={publishedCourses} icon={EyeIcon} />
  <StatCard label="Khóa học nháp" value={draftCourses} icon={EyeOffIcon} />
  <StatCard
    label="Học viên đăng ký"
    value={enrolledUsers}
    icon={UsersIcon}
    accented={enrolledUsers > 0}
  />
</div>
```

**2.1.4 — Khối "Khóa học cập nhật gần đây" (Empty state)**

Hiện tại: icon sách outline xám + 2 dòng text mô tả thụ động + nút tím.

Theo mục 3.5 (Copy voice) — đổi giọng văn từ "mô tả tình trạng" sang "lời mời
hành động", và đổi style khung từ card phẳng sang khung viền nét đứt (phân
biệt rõ đây là vùng trống chờ hành động, không phải dữ liệu thật):

```tsx
<div className="border-2 border-dashed border-border rounded-md py-12 px-6 text-center">
  <BookIcon className="w-7 h-7 text-muted mx-auto mb-3" />
  <p className="font-body font-medium text-ink mb-1">
    Chưa có khóa học nào trong danh sách
  </p>
  <p className="font-body text-sm text-muted mb-4">
    Bắt đầu bằng cách tạo khóa học đầu tiên để chia sẻ tri thức của bạn.
  </p>
  <button className="bg-ink hover:bg-ink-soft text-paper-raised font-body text-sm font-medium px-4 py-2 rounded-md">
    Tạo khóa học đầu tiên →
  </button>
</div>
```

> Chú ý copy: "Tạo khóa học đầu tiên" — giữ đúng tên hành động xuyên suốt, để
> sau này khi vào form thật, nút submit cũng nên gọi đúng tên này (theo mục
> 3.5: "giữ nguyên tên xuyên suốt flow").

**2.1.5 — Khối "Quy trình biên soạn" (4 bước đánh số)**

Hiện tại: vòng tròn số thứ tự nền tím đặc, chữ trắng.

Giữ nguyên cấu trúc (đánh số ở đây HỢP LÝ vì là quy trình tuần tự thật — đúng
tinh thần mục `frontend-design`: "chỉ dùng numbered marker khi nội dung thật
sự là một trình tự"), nhưng đổi style vòng tròn từ đặc sang viền:

```tsx
<div className="flex gap-3">
  <div className="w-6 h-6 rounded-full border border-ink flex items-center justify-center flex-shrink-0">
    <span className="font-mono text-xs text-ink">{stepNumber}</span>
  </div>
  <div>
    <p className="font-body font-medium text-sm text-ink mb-0.5">{stepTitle}</p>
    <p className="font-body text-xs text-muted">{stepDescription}</p>
  </div>
</div>
```

`rounded-full` ở ĐÂY là ngoại lệ hợp lệ — vì đây là một "chip số thứ tự" nhỏ
(giống avatar), không phải card hay button lớn. Quy tắc ở mục 1.1 hàng #11
("không dùng rounded-full") áp dụng cho card/button/badge lớn, không áp dụng
cho các chip tròn nhỏ kiểu số thứ tự hoặc avatar.

### 2.2 `/admin/courses` — Quản lý khóa học

Trang này gần như chỉ có empty state lớn. Áp dụng đúng pattern empty-state ở
mục 2.1.4 bên trên (khung viền nét đứt, copy hành động):

```tsx
<div className="border-2 border-dashed border-border rounded-md py-16 px-6 text-center max-w-md mx-auto">
  <BookIcon className="w-8 h-8 text-muted mx-auto mb-4" />
  <p className="font-display text-lg text-ink mb-1">
    Chưa có khóa học nào được tạo
  </p>
  <p className="font-body text-sm text-muted mb-5">
    Soạn khóa học đầu tiên để bắt đầu xây dựng nội dung cho hệ thống.
  </p>
  <button className="bg-ink hover:bg-ink-soft text-paper-raised font-body text-sm font-medium px-5 py-2.5 rounded-md">
    Thêm khóa học đầu tiên
  </button>
</div>
```

Đồng thời đổi nút "Thêm khóa học mới" ở góc trên-phải trang (hiện đang nền
tím) sang `bg-ink` để đồng bộ với toàn hệ thống — KHÔNG để 2 nút cùng chức
năng (nút trong empty-state và nút trên header) có 2 màu khác nhau.

### 2.3 `/admin/users` — Quản lý học viên

**2.3.1 — Bảng danh sách học viên**

Hiện tại bảng dùng border ngầm của trình duyệt/UI mặc định không rõ token.
Header bảng style theo mục 3.3 (Caption — Public Sans 600, 13px):

```tsx
<table className="w-full">
  <thead>
    <tr className="border-b border-border">
      <th className="font-body font-semibold text-xs text-muted uppercase tracking-wide text-left py-3">
        Học viên
      </th>
      {/* ...các cột khác giữ cùng style */}
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-border last:border-0">
      <td className="py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-ink-soft flex items-center justify-center font-mono text-xs text-paper-raised">
          QT
        </div>
        <div>
          <p className="font-body font-medium text-sm text-ink">Quản trị viên</p>
          <p className="font-body text-xs text-muted">admin@lms.pro</p>
        </div>
      </td>
      {/* ... */}
    </tr>
  </tbody>
</table>
```

**2.3.2 — Badge "VAI TRÒ" và "TRẠNG THÁI"**

Hiện tại: badge "QUẢN TRỊ VIÊN" nền tím pill, "HỌC VIÊN" nền xanh dương pill,
"HOẠT ĐỘNG" nền xanh lá pill — 3 hue khác nhau không có quy tắc rõ ràng, bo
tròn pill hoàn toàn.

Sửa theo đúng mục 1.1 — quy tắc semantic màu (không bo pill, dùng `radius-sm`):

```tsx
function RoleBadge({ role }: { role: 'admin' | 'user' }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={cn(
        'font-body font-medium text-xs px-2 py-1 rounded-sm inline-flex items-center gap-1',
        isAdmin ? 'bg-accent-soft text-ink' : 'bg-paper-dim text-ink-soft'
      )}
    >
      {isAdmin ? 'Quản trị viên' : 'Học viên'}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'font-body font-medium text-xs px-2 py-1 rounded-sm inline-flex items-center gap-1',
        active ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', active ? 'bg-success' : 'bg-danger')} />
      {active ? 'Hoạt động' : 'Đã khóa'}
    </span>
  );
}
```

> Quy tắc semantic: **vai trò** (admin/user) dùng cặp accent/neutral — đây là
> phân loại, không phải trạng thái tốt/xấu. **Trạng thái hoạt động** dùng
> success/danger — đây mới là nơi semantic màu xanh/đỏ thật sự có ý nghĩa.
> Việc hiện tại dùng 3 màu (tím/xanh dương/xanh lá) cho 3 badge khác nhau mà
> không phân biệt "đây là phân loại" hay "đây là trạng thái" chính là lý do
> giao diện trông lộn xộn — quy tắc trên giải quyết đúng gốc vấn đề này, không
> chỉ đổi màu.

**2.3.3 — Ô tìm kiếm "Tìm theo tên hoặc email..."**

```tsx
<div className="relative">
  <SearchIcon className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
  <input
    type="text"
    placeholder="Tìm theo tên hoặc email..."
    className="font-body text-sm bg-paper-dim border border-border rounded-md pl-9 pr-3 py-2 w-64 placeholder:text-muted focus:outline-none focus:border-ink-soft"
  />
</div>
```

### 2.4 `/admin/analytics` — Báo cáo thống kê

**2.4.1 — Banner "Lưu ý chi phí vận hành (Aggregate Analytics)"**

Cùng pattern với 2.1.1 (banner cảnh báo) — nền `warning-soft`, viền trái
`warning`, KHÔNG bọc icon trong vòng tròn.

**2.4.2 — 3 Stat card lớn ("Tổng giờ xem video", "Tỷ lệ hoàn thành trung
bình", "Số lượt thi quiz thành công")**

Đây là 3 số liệu **đang có giá trị thật** (khác card rỗng ở trang Tổng quan)
— nên thiết kế phải truyền tải "đây là dữ liệu sống", không phải card tĩnh:

```tsx
function AnalyticsCard({ label, value, unit, deltaLabel, deltaPositive, icon: Icon }: AnalyticsCardProps) {
  return (
    <div className="bg-paper-raised rounded-md p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="font-body text-xs text-muted uppercase tracking-wide">{label}</span>
        <Icon className="w-4 h-4 text-muted" />
      </div>
      <p className="font-mono text-2xl font-medium text-ink mb-1">
        {value}
        {unit && <span className="font-body text-sm text-muted ml-1">{unit}</span>}
      </p>
      <p className={cn(
        'font-body text-xs flex items-center gap-1',
        deltaPositive ? 'text-success' : 'text-danger'
      )}>
        {deltaPositive ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
        {deltaLabel}
      </p>
    </div>
  );
}
```

**2.4.3 — Biểu đồ cột "Lượt truy cập hoạt động theo tuần"**

Hiện tại: cột gradient tím sáng-tối, không có nhãn giá trị trên cột, nền chart
trắng trơn không khớp `--color-paper`.

Sửa: bỏ gradient trên cột (flat fill `--color-accent` hoặc `--color-ink-soft`
tùy độ nhấn), thêm nhãn giá trị nhỏ phía trên mỗi cột bằng `font-mono`, nền
khu vực chart dùng `--color-paper-dim` để tách biệt nhẹ với card nền trắng:

```tsx
<div className="bg-paper-dim rounded-md p-4">
  <div className="flex items-end justify-between gap-2 h-48">
    {weekData.map((day) => (
      <div key={day.label} className="flex flex-col items-center gap-2 flex-1">
        <span className="font-mono text-xs text-ink-soft">{day.value}</span>
        <div
          className="w-full bg-ink-soft rounded-sm"
          style={{ height: `${(day.value / maxValue) * 100}%` }}
        />
        <span className="font-body text-xs text-muted">{day.label}</span>
      </div>
    ))}
  </div>
</div>
```

> Không dùng `--color-accent` (cam) cho toàn bộ cột chart — vì accent đã được
> dùng riêng cho hành động/CTA (mục 3.2: "dùng cho điểm nhấn hành động"). Dùng
> `--color-ink-soft` cho dữ liệu trung lập, chỉ chuyển sang `--color-accent`
> nếu có 1 cột cụ thể cần highlight (ví dụ hôm nay).

### 2.5 `/app/dashboard` — Dashboard học viên

Trang này đang dùng layout admin lặp lại (cùng kiểu card, cùng vị trí), nhưng
theo mục 4 của `SetupCourse.md`, đây phải thuộc `features/dashboard` riêng,
dùng component `StatsCard`/`ContinueLearningList` riêng — KHÔNG tái sử dụng
component admin.

**2.5.1 — 3 Stat card ("Khóa đang học", "Khóa hoàn thành", "Thời gian học
tập")**

Cùng pattern `StatCard` ở mục 2.1.3, nhưng đổi icon phù hợp ngữ cảnh học
viên (không phải quản trị):

```tsx
<div className="grid grid-cols-3 gap-3">
  <StatCard label="Khóa đang học" value={activeCourses} icon={BookOpenIcon} />
  <StatCard label="Khóa hoàn thành" value={completedCourses} icon={AwardIcon} />
  <StatCard label="Thời gian học tập" value={`${studyMinutes} phút`} icon={ClockIcon} />
</div>
```

**2.5.2 — Empty state "Chưa có khóa học hoạt động"**

Cùng pattern empty-state đã chuẩn hóa, đổi copy theo giọng học viên (mời
khám phá, không phải mời quản trị):

```tsx
<div className="border-2 border-dashed border-border rounded-md py-12 px-6 text-center">
  <BookOpenIcon className="w-7 h-7 text-muted mx-auto mb-3" />
  <p className="font-body font-medium text-ink mb-1">
    Bạn chưa tham gia khóa học nào
  </p>
  <p className="font-body text-sm text-muted mb-4">
    Chọn khóa học phù hợp tại thư viện để bắt đầu hành trình tích lũy điểm
    kinh nghiệm và duy trì chuỗi học tập.
  </p>
  <button className="bg-accent hover:bg-accent/90 text-paper-raised font-body text-sm font-medium px-4 py-2 rounded-md">
    Khám phá khóa học ngay →
  </button>
</div>
```

> Lưu ý: nút hành động ở trang học viên dùng `bg-accent` (cam — màu hành động
> "Học ngay" theo mục 3.2), khác với nút "Tạo khóa học đầu tiên" ở trang admin
> dùng `bg-ink`. Đây là chủ đích: **accent luôn gắn với hành động học tập của
> User**, **ink luôn gắn với hành động quản trị của Admin** — quy tắc phân
> vai trò bằng màu này áp dụng xuyên suốt toàn hệ thống, không chỉ ở 2 nút
> này. Khi sửa các nút khác trong hệ thống, agent áp dụng đúng quy tắc này.

**2.5.3 — Header điều hướng ("Khám phá khóa học", "Dashboard", "Ghi chú",
"Admin")**

Hiện tại tab active ("Dashboard") không có chỉ báo rõ ràng (chỉ đậm hơn chút).
Sửa theo mục 3.4 tinh thần "tiết chế, điểm nhấn rõ ràng nhưng không lạm dụng
trang trí":

```tsx
<nav className="flex items-center gap-6">
  {navItems.map((item) => (
    <a
      key={item.path}
      href={item.path}
      className={cn(
        'font-body text-sm pb-1 border-b-2',
        item.active
          ? 'text-ink border-accent font-medium'
          : 'text-muted border-transparent hover:text-ink-soft'
      )}
    >
      {item.label}
    </a>
  ))}
</nav>
```

---

## 3. COPY VOICE — ĐỐI CHIẾU CỤ THỂ TỪNG EMPTY STATE TRONG ẢNH

Theo mục 3.5 của `SetupCourse.md`, liệt kê đúng từng câu cần đổi:

| Vị trí | Copy hiện tại (ảnh) | Copy đúng giọng (sửa thành) |
|---|---|---|
| `/admin` empty state | "Chưa có khóa học nào" + "Bắt đầu bằng cách tạo khóa học đầu tiên của bạn để chia sẻ tri thức." | Giữ nguyên — copy này ĐÃ đúng giọng hành động, chỉ cần sửa style khung, không cần đổi chữ |
| `/admin/courses` empty state | "Chưa có khóa học nào được tải lên" + "Bạn chưa soạn thảo khóa học nào trong hệ thống." | Đổi thành: "Chưa có khóa học nào được tạo" + "Soạn khóa học đầu tiên để bắt đầu xây dựng nội dung cho hệ thống." — lý do: "được tải lên" gây hiểu nhầm là upload file, trong khi hành động thật là "tạo" (structured data trước, video sau) |
| `/app/dashboard` empty state | "Chưa có khóa học hoạt động" + "Bạn chưa tham gia khóa học nào. Hãy chọn khóa học phù hợp tại thư viện để bắt đầu hành trình tích lũy điểm kinh nghiệm và duy trì chuỗi học tập." | Giữ nguyên — copy này đã đúng giọng, không cần đổi |

> Đa số copy hiện tại đã ổn — vấn đề chính của UI nằm ở **style/màu/font**,
> không phải nội dung chữ. Agent không cần viết lại toàn bộ copy, chỉ sửa 1
> chỗ nêu trên.

---

## 4. THỨ TỰ THỰC HIỆN (để agent không sửa lung tung mất kiểm soát)

1. Tạo/sửa `src/styles/tokens.css` theo mục 1.1 — xác nhận import vào
   `main.tsx` hoặc `App.tsx`.
2. Thêm font Google Fonts theo mục 1.2.
3. Sửa `tailwind.config.js` theo mục 1.3.
4. Chạy lệnh grep ở mục 1.4, liệt kê danh sách file cần sửa — **dán danh sách
   này ra trước khi sửa**, không sửa âm thầm.
5. Tạo 2 component dùng chung trước tiên (vì dùng lại ở nhiều trang):
   - `src/shared/components/ui/StatCard.tsx` (mục 2.1.3)
   - `src/shared/components/ui/EmptyState.tsx` (mục 2.1.4 — tổng quát hóa
     props `icon`, `title`, `description`, `actionLabel`, `onAction` để dùng
     lại ở cả 2.2 và 2.5.2)
6. Sửa từng trang theo thứ tự: `/admin` (2.1) → `/admin/courses` (2.2) →
   `/admin/users` (2.3) → `/admin/analytics` (2.4) → `/app/dashboard` (2.5).
7. Sau khi sửa xong 1 trang, chụp lại để tự kiểm tra (nếu môi trường agent hỗ
   trợ chụp ảnh trình duyệt) — so khớp với bảng lệch chuẩn ở mục 0, đánh dấu
   từng dòng đã sửa.
8. KHÔNG sửa logic, route, hay cấu trúc dữ liệu Firestore trong lúc làm task
   này — nếu phát hiện bug logic trong lúc sửa UI (ví dụ số liệu sai), ghi
   chú lại và báo riêng, không tự sửa luôn trong cùng 1 lần commit để dễ review.

---

## 5. KIỂM TRA CUỐI — CHECKLIST AGENT TỰ XÁC NHẬN TRƯỚC KHI BÁO HOÀN THÀNH

- [ ] Không còn bất kỳ class `purple-*`, `indigo-*` nào trong `src/features`
      (trừ trường hợp đã cố ý map qua tên token mới như `bg-ink`)
- [ ] Không còn gradient nào trên banner/card (`bg-gradient-to-*` đã bị xóa
      hết khỏi `features/admin` và `features/dashboard`)
- [ ] Mọi heading cấp trang (`h1`) dùng `font-display`, không dùng font mặc
      định của trình duyệt
- [ ] Mọi số liệu thống kê (stat card, analytics) dùng `font-mono`
- [ ] Không còn `rounded-full` trên card/button/badge cỡ lớn (chỉ còn ở
      avatar và chip số thứ tự nhỏ)
- [ ] 3 banner cảnh báo (Mock Mode, Lưu ý chi phí) dùng cùng 1 pattern
      `warning-soft` + viền trái, không còn icon bọc vòng tròn
- [ ] Badge vai trò (accent/neutral) và badge trạng thái (success/danger)
      tuân đúng quy tắc semantic ở mục 2.3.2 — không lẫn 2 nhóm màu
- [ ] Nút hành động phía Admin dùng `bg-ink`, nút hành động phía Học viên
      dùng `bg-accent` — không lẫn ngược
- [ ] Tất cả 5 route đã kiểm tra (`/admin`, `/admin/courses`, `/admin/users`,
      `/admin/analytics`, `/app/dashboard`) đều dùng chung 1 bộ token, không
      route nào còn sót màu/font cũ
