# LMS PRO — KIẾN TRÚC FRONTEND & FIREBASE
### Tài liệu kỹ thuật chuẩn nghiệp vụ doanh nghiệp — Hệ thống học tập trực tuyến

> Phạm vi tài liệu: Frontend (React + TypeScript + Vite) và luồng dữ liệu với Firebase
> (Auth, Firestore, Storage). Video do Admin upload được lưu trực tiếp trên Firebase Storage.

---

## MỤC LỤC

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Stack công nghệ Frontend](#2-stack-công-nghệ-frontend)
3. [Thiết kế hệ thống (Design System)](#3-thiết-kế-hệ-thống-design-system)
4. [Cấu trúc thư mục dự án](#4-cấu-trúc-thư-mục-dự-án)
5. [Mô hình dữ liệu Firestore](#5-mô-hình-dữ-liệu-firestore)
6. [Firebase Authentication & Phân quyền](#6-firebase-authentication--phân-quyền)
7. [Firebase Storage — Luồng Upload Video của Admin](#7-firebase-storage--luồng-upload-video-của-admin)
8. [Firebase Security Rules](#8-firebase-security-rules)
9. [Kiến trúc State Management (Frontend)](#9-kiến-trúc-state-management-frontend)
10. [Routing & Bảo vệ Route theo Role](#10-routing--bảo-vệ-route-theo-role)
11. [Chi tiết Component theo từng màn hình](#11-chi-tiết-component-theo-từng-màn-hình)
12. [Video Player & Tracking tiến độ](#12-video-player--tracking-tiến-độ)
13. [Quiz Engine](#13-quiz-engine)
14. [Admin Panel — Quản trị nội dung](#14-admin-panel--quản-trị-nội-dung)
15. [Hiệu năng & Tối ưu tải Video](#15-hiệu-năng--tối-ưu-tải-video)
16. [Giới hạn của Firebase Storage trực tiếp & Lộ trình nâng cấp](#16-giới-hạn-của-firebase-storage-trực-tiếp--lộ-trình-nâng-cấp)
17. [Checklist triển khai](#17-checklist-triển-khai)

---

## 1. TỔNG QUAN KIẾN TRÚC

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │   React 18 + TypeScript + Vite                            │    │
│  │   ┌───────────────┐  ┌───────────────┐  ┌─────────────┐  │    │
│  │   │  Public App    │  │  Learner App   │  │  Admin App  │  │    │
│  │   │  (Landing,      │  │  (Học tập,     │  │  (CRUD nội  │  │    │
│  │   │   Khám phá KH)  │  │   Quiz, Note)  │  │   dung)     │  │    │
│  │   └───────────────┘  └───────────────┘  └─────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────┬───────────────────────────────────────┘
                            │ Firebase SDK (modular v9+)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                          FIREBASE BACKEND                         │
│                                                                     │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Firebase Auth   │  │   Firestore DB    │  │ Firebase Storage │ │
│  │  - Email/Pass    │  │  - courses        │  │  - videos/       │ │
│  │  - Google OAuth   │  │  - chapters       │  │  - documents/    │ │
│  │  - Custom Claims  │  │  - lessons         │  │  - thumbnails/   │ │
│  │    (role: admin/  │  │  - enrollments     │  │  - banners/      │ │
│  │     user)         │  │  - progress         │  │                  │ │
│  └─────────────────┘  │  - quizzes          │  └──────────────────┘ │
│                         │  - notes            │                       │
│                         └──────────────────┘                       │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Cloud Functions (tối thiểu, dùng cho việc bắt buộc        │    │
│  │  phải chạy phía server):                                   │    │
│  │  - onUserCreate → gán custom claim role: "user"             │    │
│  │  - onVideoUpload → cập nhật duration/size vào Firestore     │    │
│  │  - aggregateAnalytics → tổng hợp số liệu cho Admin Dashboard │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

**Nguyên tắc thiết kế cốt lõi:**

| Nguyên tắc | Áp dụng |
|---|---|
| **Single source of truth** | Mọi trạng thái tiến độ học (video đã xem, quiz đã làm) đều ghi vào Firestore, không lưu local-only |
| **Optimistic UI** | Tick "hoàn thành bài học", lưu note → cập nhật UI ngay, đồng bộ Firestore nền sau |
| **Role tách biệt ở tầng route** | `/admin/*` và `/app/*` là 2 cây route hoàn toàn riêng, không share layout |
| **Security ở tầng rules, không ở tầng UI** | Ẩn nút Sửa/Xóa trên UI chỉ là UX — quyền thật sự được Firestore Security Rules + Custom Claims kiểm soát |
| **Video là tài nguyên nặng, tách biệt lifecycle** | Upload video là tiến trình async độc lập, có trạng thái riêng (`uploading → processing → ready → failed`), không block form tạo bài học |

---

## 2. STACK CÔNG NGHỆ FRONTEND

| Nhóm | Lựa chọn | Lý do |
|---|---|---|
| Framework | **React 18** + **TypeScript** (strict mode) | Tách biệt khỏi project AI-Learning-Dashboard hiện tại (đỡ trộn context), type-safety cho domain phức tạp (Course → Chapter → Section → Lesson) |
| Build tool | **Vite 5** | Dev server nhanh, hỗ trợ tốt cho code-splitting theo route |
| Routing | **React Router v6** (data router) | `loader`/`action` phù hợp với việc fetch dữ liệu Firestore trước khi render |
| State quản lý server data | **TanStack Query (React Query) v5** | Cache, refetch, optimistic update cho dữ liệu Firestore — tránh tự viết loading/error state thủ công |
| State quản lý UI/global | **Zustand** | Nhẹ, dùng cho auth state, sidebar toggle, video player state — không cần Redux cho quy mô này |
| Form | **React Hook Form** + **Zod** | Validate form tạo khóa học/chương/bài học, schema dùng chung giữa form và kiểu dữ liệu Firestore |
| Styling | **Tailwind CSS** + CSS Variables (design tokens) | Tốc độ phát triển nhanh, vẫn giữ được hệ thống token riêng (xem mục 3) |
| Component cơ sở | **Radix UI primitives** (Dialog, Accordion, Tabs, Dropdown) | Accessibility có sẵn (focus trap, keyboard nav) — quan trọng cho Accordion nội dung khóa học |
| Animation | **Framer Motion** | Page transition, accordion expand, skeleton loading (đúng yêu cầu mục 29 file gốc) |
| Video Player | **Video.js** hoặc **Plyr** (custom skin) | Hỗ trợ tốc độ phát (0.5x–2x), fullscreen, custom controls, theo dõi `timeupdate` để lưu tiến độ |
| Firebase SDK | **firebase v10+ (modular)** | `getFirestore`, `getAuth`, `getStorage` — chỉ import phần dùng để giảm bundle size |
| Upload tiến trình lớn | **firebase/storage `uploadBytesResumable`** | Hỗ trợ pause/resume, progress callback — cần thiết vì video Admin upload thường vài trăm MB |
| Testing | **Vitest** + **React Testing Library** | Cùng hệ sinh thái Vite |
| Lint/Format | **ESLint** (typescript-eslint) + **Prettier** | Chuẩn hóa code style cho team nhiều người |

---

## 3. THIẾT KẾ HỆ THỐNG (DESIGN SYSTEM)

### 3.1 Định hướng thẩm mỹ

Thay vì sao chép giao diện Udemy/Coursera (card bo tròn, shadow nhẹ, font sans mặc định —
đây là "default look" mà mọi sản phẩm LMS AI-generated đều giống nhau), hệ thống này lấy
cảm hứng từ **sổ tay học tập / mục lục sách giáo khoa Việt Nam**: cấu trúc Khóa học → Chương
→ Phần → Bài học vốn đã giống mục lục sách, nên giao diện khai thác đúng ẩn dụ đó — bài học
được trình bày như "trang sách đã gấp đánh dấu", tiến độ học như "gáy sách được tô màu dần".

### 3.2 Bảng màu (Design Tokens)

```css
:root {
  /* Nền & bề mặt — giấy ngả xanh mực, không phải cream mặc định */
  --color-paper:        #F6F5F0;   /* nền chính */
  --color-paper-raised:  #FFFFFF;   /* card, surface nổi */
  --color-paper-dim:     #ECEAE2;   /* vùng phụ, input bg */

  /* Mực — primary, dùng cho text chính, header, nút chính */
  --color-ink:           #1B2A4A;   /* xanh mực đậm */
  --color-ink-soft:      #44557A;   /* mực nhạt hơn, hover state */

  /* Accent — cam đất, dùng cho điểm nhấn hành động (Học ngay, đang học) */
  --color-accent:        #E0734A;
  --color-accent-soft:   #F3C5A8;

  /* Trạng thái học tập */
  --color-success:       #3E7C59;   /* đã hoàn thành */
  --color-success-soft:  #D9E8DD;
  --color-warning:       #C98A2C;   /* cảnh báo, sắp hết hạn */
  --color-danger:        #B3402C;   /* lỗi, xóa */

  /* Trung tính / chữ phụ */
  --color-muted:         #8A8170;   /* text phụ, ánh giấy cũ */
  --color-border:        #DCD8CC;

  /* Typography */
  --font-display: 'Fraunces', 'Source Serif 4', serif;   /* tên khóa học, hero */
  --font-body:    'Public Sans', 'Inter', sans-serif;     /* nội dung, UI */
  --font-mono:    'IBM Plex Mono', monospace;              /* số chương, % tiến độ, mã */

  /* Bán kính — bo nhẹ, không bo tròn quá mức như card Udemy */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;

  /* Khoảng cách (8px baseline grid) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px; --space-12: 48px;
}
```

### 3.3 Typography Scale

| Cấp | Font | Size / Weight | Dùng cho |
|---|---|---|---|
| Display XL | Fraunces, weight 600, italic-optional | 48px / 1.1 | Hero section trang chủ |
| Display | Fraunces, weight 500 | 32px / 1.2 | Tên khóa học (trang chi tiết) |
| Heading | Public Sans, weight 600 | 22px / 1.3 | Tên chương, section title |
| Body | Public Sans, weight 400 | 16px / 1.6 | Nội dung mô tả, bài học |
| Caption | Public Sans, weight 500 | 13px / 1.4 | Label, badge danh mục |
| Mono Data | IBM Plex Mono, weight 500 | 13px | "Chương 1/8", "65%", thời lượng video |

### 3.4 Signature Element — "Gáy sách tiến độ" (Book-Spine Progress)

Thay cho progress bar nằm ngang/tròn mặc định, thanh tiến độ tổng của khóa học được trình
bày như **gáy sách dọc** ở sidebar trái màn hình học tập: mỗi Chương là một "đoạn gáy" với
độ dài tỉ lệ theo số bài học; đoạn đã hoàn thành tô màu `--color-success`, đoạn đang học tô
`--color-accent` với animation pulse nhẹ, đoạn chưa học giữ màu `--color-border`. Đây là điểm
nhấn trực quan duy nhất (signature) của hệ thống — phần còn lại của UI giữ tiết chế, ít trang trí.

```
┌─┐
│█│ Chương 1 — hoàn thành (success)
│█│
│▓│ Chương 2 — đang học (accent, pulse)
│░│ Chương 3 — chưa học (border)
│░│
└─┘
```

### 3.5 Component tông giọng nội dung (Copy voice)

- Hành động luôn ở thể chủ động, giữ nguyên tên xuyên suốt flow: nút "Học ngay" → khi đang
  học hiển thị "Đang học" (không đổi thành "Tiếp tục" rồi lại đổi tên khác).
- Trạng thái rỗng là lời mời hành động, không phải lời xin lỗi:
  - Sai: "Bạn chưa có khóa học nào, xin lỗi vì sự bất tiện."
  - Đúng: "Chưa có khóa học nào trong danh sách. Khám phá khóa học mới →"
- Lỗi nêu rõ nguyên nhân + cách khắc phục, không đổ lỗi người dùng:
  - "Video chưa tải xong. Kiểm tra kết nối mạng và thử lại." (không dùng "Đã có lỗi xảy ra")

---

## 4. CẤU TRÚC THƯ MỤC DỰ ÁN

```
lms-pro-frontend/
├── src/
│   ├── app/
│   │   ├── routes/                  # Định nghĩa route theo data router
│   │   │   ├── public.routes.tsx
│   │   │   ├── learner.routes.tsx
│   │   │   └── admin.routes.tsx
│   │   ├── App.tsx
│   │   └── providers.tsx            # QueryClientProvider, AuthProvider, ThemeProvider
│   │
│   ├── features/                    # Tổ chức theo domain, không theo loại file
│   │   ├── auth/
│   │   │   ├── components/ (LoginForm, RegisterForm, GoogleButton)
│   │   │   ├── hooks/ (useAuth, useRequireRole)
│   │   │   └── api/ (auth.api.ts)
│   │   │
│   │   ├── courses/
│   │   │   ├── components/
│   │   │   │   ├── CourseCard.tsx
│   │   │   │   ├── CourseFilterBar.tsx
│   │   │   │   ├── CourseAccordionContent.tsx
│   │   │   │   └── CourseGrid.tsx
│   │   │   ├── hooks/ (useCourses, useCourseDetail)
│   │   │   └── api/ (courses.api.ts)
│   │   │
│   │   ├── learning/                # Giao diện học tập (mục 12-18 file gốc)
│   │   │   ├── components/
│   │   │   │   ├── LessonSidebar.tsx
│   │   │   │   ├── BookSpineProgress.tsx   # Signature element
│   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   ├── LessonDocuments.tsx
│   │   │   │   ├── NotePanel.tsx
│   │   │   │   └── BookmarkButton.tsx
│   │   │   ├── hooks/ (useLessonProgress, useVideoTracking)
│   │   │   └── api/ (progress.api.ts)
│   │   │
│   │   ├── quiz/
│   │   │   ├── components/ (QuizRunner, QuizResult, QuizQuestionCard)
│   │   │   ├── hooks/ (useQuiz)
│   │   │   └── api/ (quiz.api.ts)
│   │   │
│   │   ├── dashboard/                # Dashboard người học (mục 19)
│   │   │   └── components/ (StatsCard, StreakCalendar, ContinueLearningList)
│   │   │
│   │   └── admin/
│   │       ├── components/
│   │       │   ├── CourseForm.tsx
│   │       │   ├── ChapterManager.tsx        # Kéo-thả đổi thứ tự (mục 23)
│   │       │   ├── SectionManager.tsx
│   │       │   ├── LessonForm.tsx
│   │       │   ├── VideoUploader.tsx         # Trọng tâm: upload resumable
│   │       │   ├── DocumentUploader.tsx
│   │       │   ├── UserManagementTable.tsx
│   │       │   └── AnalyticsPanel.tsx
│   │       ├── hooks/ (useVideoUpload, useReorderChapters)
│   │       └── api/ (admin.api.ts)
│   │
│   ├── shared/
│   │   ├── components/ui/            # Radix-wrapped: Button, Dialog, Accordion, Tabs...
│   │   ├── components/layout/        # Header, Footer, Sidebar, AdminShell
│   │   ├── hooks/ (useDebounce, useMediaQuery)
│   │   └── utils/ (formatDuration, slugify, cn.ts)
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts             # initializeApp
│   │   │   ├── auth.ts               # wrapper getAuth + onAuthStateChanged
│   │   │   ├── firestore.ts          # wrapper getFirestore + converter helpers
│   │   │   └── storage.ts            # wrapper getStorage + uploadResumable helper
│   │   └── queryClient.ts
│   │
│   ├── types/
│   │   ├── course.types.ts
│   │   ├── lesson.types.ts
│   │   ├── user.types.ts
│   │   └── progress.types.ts
│   │
│   ├── styles/
│   │   ├── tokens.css                # CSS variables ở mục 3.2
│   │   └── globals.css
│   │
│   └── main.tsx
│
├── functions/                        # Cloud Functions (TypeScript)
│   ├── src/
│   │   ├── onUserCreate.ts
│   │   ├── onVideoFinalize.ts
│   │   └── aggregateAnalytics.ts
│   └── package.json
│
├── firestore.rules
├── storage.rules
├── firestore.indexes.json
├── firebase.json
└── vite.config.ts
```

---

## 5. MÔ HÌNH DỮ LIỆU FIRESTORE

Thiết kế theo dạng **denormalize có kiểm soát** — đúng tinh thần Firestore (không join được),
nhưng vẫn giữ collection con để truy vấn hiệu quả theo từng cấp.

### 5.1 Collection: `courses`

```ts
// types/course.types.ts
interface Course {
  id: string;
  title: string;
  slug: string;                     // dùng cho URL /courses/java-core
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;             // 1280x720, từ Storage
  bannerUrl: string;                // 1920x500
  category: CourseCategory;         // 'programming' | 'math' | 'english' | ...
  level: 'beginner' | 'intermediate' | 'advanced';
  totalChapters: number;            // denormalized, cập nhật qua Cloud Function
  totalLessons: number;
  totalDurationSeconds: number;
  status: 'draft' | 'published' | 'archived';
  createdBy: string;                // uid Admin
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 5.2 Sub-collection: `courses/{courseId}/chapters`

```ts
interface Chapter {
  id: string;
  title: string;
  order: number;                    // dùng để sắp xếp, đổi qua drag-drop (mục 23)
  totalLessons: number;
  totalDurationSeconds: number;
  isVisible: boolean;               // Ẩn/hiện (mục 24)
}
```

### 5.3 Sub-collection: `courses/{courseId}/chapters/{chapterId}/sections`

```ts
interface Section {
  id: string;
  title: string;
  order: number;
  isVisible: boolean;
}
```

### 5.4 Sub-collection: `.../sections/{sectionId}/lessons`

```ts
interface Lesson {
  id: string;
  title: string;
  order: number;
  durationSeconds: number;
  video: {
    storagePath: string;            // videos/{courseId}/{lessonId}/source.mp4
    downloadUrl: string;            // URL tải về từ Storage (cache lại, tránh gọi lại getDownloadURL)
    status: 'uploading' | 'processing' | 'ready' | 'failed';
    sizeBytes: number;
    uploadedAt: Timestamp;
  } | null;
  documents: LessonDocument[];      // xem 5.5
  quizId: string | null;            // tham chiếu tới quizzes/{quizId} nếu có quiz cuối bài
}

interface LessonDocument {
  id: string;
  type: 'pdf' | 'word' | 'pptx' | 'link' | 'exercise';
  title: string;
  url: string;                      // Storage download URL hoặc link ngoài
  sizeBytes?: number;
}
```

> **Quyết định thiết kế quan trọng**: Quiz được đặt ở **cuối Chương**, không ở cuối Lesson
> (đúng mục 17 tài liệu gốc: "Cuối mỗi chương"). `quizId` ở Lesson chỉ dùng cho trường hợp
> đặc biệt cần quiz nhỏ giữa bài — mặc định Quiz chính nằm ở `chapters/{chapterId}.quizId`.

### 5.5 Cập nhật lại Chapter — thêm `quizId`

```ts
interface Chapter {
  // ...như 5.2
  quizId: string | null;
}
```

### 5.6 Collection: `quizzes`

```ts
interface Quiz {
  id: string;
  courseId: string;
  chapterId: string;
  title: string;
  questions: QuizQuestion[];        // nhúng trực tiếp — quiz hiếm khi > 30 câu, không cần sub-collection
  passScore: number;                // % điểm cần để coi là "đạt"
}

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}
```

### 5.7 Collection: `enrollments` (root-level, không lồng trong course)

```ts
// document id = `${userId}_${courseId}` để tránh trùng và query nhanh bằng getDoc
interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: Timestamp;
  lastAccessedAt: Timestamp;
  completionPercent: number;        // denormalized, cập nhật mỗi khi progress thay đổi
}
```

### 5.8 Collection: `progress` (root-level)

```ts
// document id = `${userId}_${courseId}_${lessonId}`
interface LessonProgress {
  userId: string;
  courseId: string;
  chapterId: string;
  lessonId: string;
  videoWatchedSeconds: number;      // dùng để "tiếp tục từ giây thứ X"
  videoDurationSeconds: number;
  isCompleted: boolean;             // true khi watchedSeconds >= 90% duration
  completedAt: Timestamp | null;
  updatedAt: Timestamp;
}
```

### 5.9 Collection: `quizAttempts` (root-level)

```ts
interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  courseId: string;
  chapterId: string;
  score: number;                    // %
  correctCount: number;
  totalCount: number;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
  attemptedAt: Timestamp;
}
```

### 5.10 Collection: `notes` (root-level)

```ts
interface Note {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  content: string;
  timestampInVideo: number | null;  // ghi note tại giây thứ X của video, click để nhảy tới
  createdAt: Timestamp;
}
```

### 5.11 Collection: `users`

```ts
interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  role: 'admin' | 'user';           // mirror của custom claim, dùng để query/hiển thị (không dùng để authorize)
  level: number;                    // mục 19 — Level, XP
  xp: number;
  streakDays: number;
  lastActiveDate: string;           // 'YYYY-MM-DD', dùng để tính streak liên tiếp
  createdAt: Timestamp;
}
```

### 5.12 Sơ đồ quan hệ tổng quát

```
users (root)
courses (root)
 └── chapters (sub)
      ├── quizId ──────────────► quizzes (root)
      └── sections (sub)
           └── lessons (sub)
                └── video.storagePath ──► Firebase Storage

enrollments (root)   { userId, courseId }
progress (root)      { userId, courseId, chapterId, lessonId }
quizAttempts (root)  { userId, quizId }
notes (root)         { userId, lessonId }
```

**Vì sao `enrollments`, `progress`, `quizAttempts`, `notes` đặt ở root thay vì lồng trong
`courses` hoặc `users`?** Vì Firestore không hỗ trợ query xuyên collection group hiệu quả
khi cần lọc theo `userId` *và* sort theo `updatedAt` cùng lúc trên nhiều khóa học (ví dụ:
"Tiếp tục học" ở Dashboard cần lấy progress mới nhất của user trên *mọi* khóa học). Đặt ở
root với field `userId` được index sẵn giúp 1 query duy nhất giải quyết được việc này.

---

## 6. FIREBASE AUTHENTICATION & PHÂN QUYỀN

### 6.1 Phương thức đăng nhập

- Email/Password (cho học sinh/sinh viên đăng ký trực tiếp)
- Google OAuth2 (đăng nhập nhanh, đúng với hệ sinh thái Firebase)

### 6.2 Phân quyền bằng Custom Claims (không dùng field `role` trong Firestore để authorize)

**Vấn đề nếu chỉ lưu `role` trong document `users/{uid}`:** Security Rules đọc field này
qua `get()` mỗi lần kiểm tra quyền → tốn 1 lượt đọc Firestore cho *mỗi* request, và quan
trọng hơn — field này có thể bị User tự sửa nếu rules không chặt. Custom Claims được ký
trong JWT token, không thể tự sửa từ client, và Security Rules đọc trực tiếp từ token
(`request.auth.token.role`) — không tốn lượt đọc Firestore nào.

**Luồng gán quyền Admin:**

```ts
// functions/src/onUserCreate.ts — Cloud Function, trigger khi tạo user mới
import { auth } from 'firebase-functions/v1';
import { getAuth } from 'firebase-admin/auth';

export const onUserCreate = auth.user().onCreate(async (user) => {
  // Mặc định mọi user đăng ký là 'user'.
  // Gán quyền 'admin' chỉ thực hiện thủ công qua Firebase CLI hoặc Admin Function riêng,
  // KHÔNG có endpoint nào để client tự nâng quyền.
  await getAuth().setCustomUserClaims(user.uid, { role: 'user' });
});
```

```bash
# Gán quyền admin — chỉ chạy bởi người vận hành hệ thống, không lộ ra frontend
firebase functions:shell
> admin.auth().setCustomUserClaims('<uid-admin>', { role: 'admin' })
```

### 6.3 Hook `useAuth` (Frontend)

```tsx
// features/auth/hooks/useAuth.ts
import { useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { useAuthStore } from '@/store/authStore';

export function useAuthListener() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    // onIdTokenChanged (không phải onAuthStateChanged) để bắt được khi
    // custom claims thay đổi và token được refresh.
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }
      const tokenResult = await firebaseUser.getIdTokenResult();
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: (tokenResult.claims.role as 'admin' | 'user') ?? 'user',
      });
    });
    return unsubscribe;
  }, [setUser]);
}
```

```ts
// store/authStore.ts (Zustand)
import { create } from 'zustand';

interface AuthState {
  user: { uid: string; email: string | null; displayName: string | null; role: 'admin' | 'user' } | null;
  isLoading: boolean;
  setUser: (u: AuthState['user']) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (u) => set({ user: u, isLoading: false }),
}));
```

---

## 7. FIREBASE STORAGE — LUỒNG UPLOAD VIDEO CỦA ADMIN

### 7.1 Cấu trúc đường dẫn Storage

```
videos/{courseId}/{lessonId}/source.mp4
documents/{courseId}/{lessonId}/{documentId}_{filename}
thumbnails/{courseId}/thumbnail.jpg
banners/{courseId}/banner.jpg
avatars/{userId}/avatar.jpg
```

### 7.2 Component `VideoUploader` — Upload resumable có theo dõi tiến trình

```tsx
// features/admin/components/VideoUploader.tsx
import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/storage';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

type UploadState =
  | { status: 'idle' }
  | { status: 'uploading'; progress: number }
  | { status: 'processing' }
  | { status: 'ready'; url: string }
  | { status: 'failed'; error: string };

interface VideoUploaderProps {
  courseId: string;
  chapterId: string;
  sectionId: string;
  lessonId: string;
}

export function VideoUploader({ courseId, chapterId, sectionId, lessonId }: VideoUploaderProps) {
  const [state, setState] = useState<UploadState>({ status: 'idle' });

  const handleFile = useCallback(async (file: File) => {
    // Validate trước khi upload — tránh tốn băng thông cho file sai định dạng
    const allowedTypes = ['video/mp4', 'video/webm'];
    const maxSizeBytes = 2 * 1024 * 1024 * 1024; // 2GB

    if (!allowedTypes.includes(file.type)) {
      setState({ status: 'failed', error: 'Chỉ hỗ trợ định dạng MP4 hoặc WebM.' });
      return;
    }
    if (file.size > maxSizeBytes) {
      setState({ status: 'failed', error: 'Video vượt quá 2GB. Hãy giảm dung lượng trước khi tải lên.' });
      return;
    }

    const lessonRef = doc(
      db, 'courses', courseId, 'chapters', chapterId,
      'sections', sectionId, 'lessons', lessonId
    );
    const storagePath = `videos/${courseId}/${lessonId}/source.mp4`;
    const storageRef = ref(storage, storagePath);

    // Đánh dấu trạng thái 'uploading' trong Firestore ngay từ đầu,
    // để nếu Admin rời trang giữa lúc upload, lần sau quay lại vẫn biết bài học này đang dở.
    await updateDoc(lessonRef, {
      video: {
        storagePath,
        downloadUrl: '',
        status: 'uploading',
        sizeBytes: file.size,
        uploadedAt: serverTimestamp(),
      },
    });

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: { courseId, lessonId },
    });

    setState({ status: 'uploading', progress: 0 });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setState({ status: 'uploading', progress });
      },
      (error) => {
        // Lỗi mạng, lỗi quyền (Storage Rules từ chối), v.v.
        setState({ status: 'failed', error: mapStorageError(error.code) });
        updateDoc(lessonRef, { 'video.status': 'failed' });
      },
      async () => {
        setState({ status: 'processing' });
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

        // Cloud Function onVideoFinalize sẽ tính duration thật từ file (xem 7.3),
        // ở đây Frontend chỉ đánh dấu 'ready' với URL đã có, duration sẽ được
        // Cloud Function cập nhật ngay sau đó (UI tự refetch qua React Query).
        await updateDoc(lessonRef, {
          'video.downloadUrl': downloadUrl,
          'video.status': 'ready',
        });
        setState({ status: 'ready', url: downloadUrl });
      }
    );

    // Cho phép Admin pause/resume nếu cần (lưu uploadTask vào ref nếu muốn expose nút Tạm dừng)
  }, [courseId, chapterId, sectionId, lessonId]);

  return (
    <div className="video-uploader">
      {state.status === 'idle' && (
        <label className="video-uploader__dropzone">
          <input
            type="file"
            accept="video/mp4,video/webm"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="sr-only"
          />
          <span>Kéo thả video vào đây hoặc bấm để chọn file (MP4/WebM, tối đa 2GB)</span>
        </label>
      )}

      {state.status === 'uploading' && (
        <div className="video-uploader__progress">
          <div className="progress-bar" style={{ width: `${state.progress}%` }} />
          <span className="font-mono">{state.progress}% — đang tải lên</span>
        </div>
      )}

      {state.status === 'processing' && <span>Đang xử lý video, vui lòng đợi…</span>}

      {state.status === 'ready' && (
        <div className="video-uploader__success">
          <video src={state.url} controls className="w-full rounded-md" />
          <span className="text-success">Video đã sẵn sàng.</span>
        </div>
      )}

      {state.status === 'failed' && (
        <div className="video-uploader__error">
          <span className="text-danger">{state.error}</span>
          <button onClick={() => setState({ status: 'idle' })}>Thử lại</button>
        </div>
      )}
    </div>
  );
}

function mapStorageError(code: string): string {
  const map: Record<string, string> = {
    'storage/unauthorized': 'Bạn không có quyền tải video lên mục này.',
    'storage/canceled': 'Quá trình tải lên đã bị hủy.',
    'storage/quota-exceeded': 'Dung lượng lưu trữ đã đạt giới hạn. Liên hệ quản trị hệ thống.',
    'storage/retry-limit-exceeded': 'Kết nối mạng không ổn định. Kiểm tra mạng và thử lại.',
  };
  return map[code] ?? 'Tải video lên thất bại. Vui lòng thử lại.';
}
```

### 7.3 Cloud Function: lấy `duration` thật của video sau khi upload

Trình duyệt không thể lấy chính xác `duration` của video trước khi toàn bộ file decode —
việc này nên giao cho server. Dùng Cloud Function trigger trên Storage:

```ts
// functions/src/onVideoFinalize.ts
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { getFirestore } from 'firebase-admin/firestore';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegPath as string);

export const onVideoFinalize = onObjectFinalized(
  { bucket: undefined, region: 'asia-southeast1' },
  async (event) => {
    const filePath = event.data.name; // videos/{courseId}/{lessonId}/source.mp4
    if (!filePath?.startsWith('videos/')) return;

    const [, courseId, lessonId] = filePath.split('/');
    const tempFilePath = `/tmp/${lessonId}.mp4`;

    // Tải file tạm về môi trường Cloud Function để đọc metadata bằng ffprobe
    // (chi tiết bucket.file().download() lược bớt cho ngắn gọn)

    ffmpeg.ffprobe(tempFilePath, async (err, metadata) => {
      if (err) {
        console.error('ffprobe lỗi:', err);
        return;
      }
      const durationSeconds = Math.round(metadata.format.duration ?? 0);

      // Cập nhật duration vào đúng Lesson — cần biết chapterId/sectionId,
      // nên thực tế nên lưu thêm các id này vào customMetadata khi upload (7.2)
      // để Cloud Function truy ra đúng path document mà không phải query ngược.
      const db = getFirestore();
      // ... updateDoc tới đúng lessons/{lessonId} bằng customMetadata đã lưu
    });
  }
);
```

> **Lưu ý chi phí**: Cloud Functions Gen 2 + ffmpeg cho video dài sẽ tốn thời gian chạy và
> bộ nhớ. Với quy mô nhỏ (đồ án, gia đình/lớp học), có thể bỏ qua bước ffprobe và để Admin
> **nhập tay** trường `durationSeconds` trong form — đơn giản hơn, không cần Cloud Function,
> đúng tinh thần "chi phí gần như 0 đồng" của tài liệu gốc. Cloud Function chỉ nên làm khi
> hệ thống lớn tới mức không thể tin tưởng Admin nhập tay chính xác.

### 7.4 Tải lên Thumbnail / Banner / Tài liệu — cùng pattern, dùng hook chung

```ts
// lib/firebase/storage.ts
import { ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from 'firebase/storage';
import { storage } from './config';

export function uploadFile(
  path: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(ref(storage, path), file, { contentType: file.type });
    task.on(
      'state_changed',
      (snap: UploadTaskSnapshot) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    );
  });
}
```

```ts
// features/admin/hooks/useVideoUpload.ts — dùng React Query mutation để tích hợp với form
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile } from '@/lib/firebase/storage';

export function useThumbnailUpload(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadFile(`thumbnails/${courseId}/thumbnail.jpg`, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['course', courseId] }),
  });
}
```

---

## 8. FIREBASE SECURITY RULES

### 8.1 Firestore Rules — phân quyền bằng Custom Claims

```js
// firestore.rules
rules_version = '2';

function isSignedIn() {
  return request.auth != null;
}
function isAdmin() {
  return isSignedIn() && request.auth.token.role == 'admin';
}
function isOwner(userId) {
  return isSignedIn() && request.auth.uid == userId;
}

service cloud.firestore {
  match /databases/{database}/documents {

    // ---- COURSES & nội dung lồng bên trong ----
    match /courses/{courseId} {
      allow read: if resource.data.status == 'published' || isAdmin();
      allow create, update, delete: if isAdmin();

      match /chapters/{chapterId} {
        allow read: if isAdmin() || (get(/databases/$(database)/documents/courses/$(courseId)).data.status == 'published');
        allow write: if isAdmin();

        match /sections/{sectionId} {
          allow read: if isAdmin() || (get(/databases/$(database)/documents/courses/$(courseId)).data.status == 'published');
          allow write: if isAdmin();

          match /lessons/{lessonId} {
            allow read: if isAdmin() || (get(/databases/$(database)/documents/courses/$(courseId)).data.status == 'published');
            allow write: if isAdmin();
          }
        }
      }
    }

    // ---- QUIZ — User chỉ đọc câu hỏi, không đọc đáp án đúng qua client trực tiếp ----
    // Ghi chú quan trọng ở mục 8.3 bên dưới về rủi ro lộ đáp án.
    match /quizzes/{quizId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    // ---- ENROLLMENTS — User chỉ thấy/ghi enrollment của chính mình ----
    match /enrollments/{enrollmentId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update: if isOwner(resource.data.userId);
      allow delete: if isAdmin();
    }

    // ---- PROGRESS — User chỉ ghi tiến độ của chính mình, không sửa của người khác ----
    match /progress/{progressId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create, update: if isSignedIn()
        && request.resource.data.userId == request.auth.uid
        // Chặn User tự ý đặt isCompleted=true mà không có watchedSeconds hợp lý
        && request.resource.data.videoWatchedSeconds is number
        && request.resource.data.videoWatchedSeconds >= 0;
      allow delete: if false; // không cho xóa progress, chỉ Admin can thiệp qua Console nếu cần
    }

    // ---- QUIZ ATTEMPTS — ghi 1 lần, không cho sửa kết quả sau khi nộp ----
    match /quizAttempts/{attemptId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false; // immutable — kết quả quiz không thể sửa lại
    }

    // ---- NOTES — riêng tư hoàn toàn theo từng user ----
    match /notes/{noteId} {
      allow read, update, delete: if isOwner(resource.data.userId);
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }

    // ---- USERS ----
    match /users/{userId} {
      allow read: if isSignedIn(); // public profile cơ bản (tên, avatar, level) hiển thị leaderboard
      allow update: if isOwner(userId)
        && !('role' in request.resource.data.diff(resource.data).affectedKeys());
        // User được sửa profile của mình nhưng KHÔNG được tự đổi field 'role'
      allow create: if isOwner(userId);
      allow delete: if isAdmin();
    }
  }
}
```

### 8.2 Storage Rules

```js
// storage.rules
rules_version = '2';

function isSignedIn() {
  return request.auth != null;
}
function isAdmin() {
  return isSignedIn() && request.auth.token.role == 'admin';
}

service firebase.storage {
  match /b/{bucket}/o {

    // Video — chỉ Admin upload/sửa/xóa, User đã đăng nhập được đọc
    // (đọc thật ra qua downloadUrl public-read-able token, rule này chặn truy cập trực tiếp path)
    match /videos/{courseId}/{lessonId}/{fileName} {
      allow read: if isSignedIn();
      allow write: if isAdmin()
        && request.resource.size < 2 * 1024 * 1024 * 1024  // 2GB
        && request.resource.contentType.matches('video/.*');
    }

    match /documents/{courseId}/{lessonId}/{fileName} {
      allow read: if isSignedIn();
      allow write: if isAdmin()
        && request.resource.size < 50 * 1024 * 1024; // 50MB cho tài liệu
    }

    match /thumbnails/{courseId}/{fileName} {
      allow read: if true; // thumbnail cần hiển thị công khai ở trang chủ chưa đăng nhập
      allow write: if isAdmin()
        && request.resource.contentType.matches('image/.*')
        && request.resource.size < 5 * 1024 * 1024;
    }

    match /banners/{courseId}/{fileName} {
      allow read: if true;
      allow write: if isAdmin() && request.resource.contentType.matches('image/.*');
    }

    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if isSignedIn() && request.auth.uid == userId
        && request.resource.size < 2 * 1024 * 1024;
    }
  }
}
```

### 8.3 Lưu ý bảo mật quan trọng — Đáp án Quiz

Rules ở mục 8.1 cho phép User `read` toàn bộ document `quizzes/{quizId}` — **bao gồm cả
`correctOptionIndex`**. Điều này có nghĩa người dùng có thể mở DevTools, đọc thẳng response
Firestore và thấy đáp án đúng trước khi làm bài.

Hai hướng giải quyết, chọn theo mức độ nghiêm túc của quiz:

| Mức độ | Giải pháp |
|---|---|
| Quiz ôn tập, không chấm điểm chính thức | Giữ nguyên thiết kế — đơn giản, đúng tinh thần "chi phí thấp" |
| Quiz tính điểm, ảnh hưởng kết quả học tập | Tách `correctOptionIndex` ra một collection riêng **chỉ Cloud Function đọc được** (`quizAnswers/{quizId}`, không có rule `allow read` nào cho client). Client gửi `answers` thô lên một **Callable Cloud Function** `submitQuizAttempt`, function so sánh với đáp án đúng ở phía server rồi mới ghi `quizAttempts` |

> Khuyến nghị: với quy mô đồ án/gia đình, dùng phương án 1. Nếu sau này dùng cho tổ chức
> giáo dục thật (chấm điểm có giá trị), bắt buộc chuyển sang phương án 2.

---

## 9. KIẾN TRÚC STATE MANAGEMENT (FRONTEND)

### 9.1 Phân loại state — quy tắc chọn công cụ

| Loại state | Công cụ | Ví dụ |
|---|---|---|
| **Server state** (dữ liệu từ Firestore/Storage) | TanStack Query | Danh sách khóa học, chi tiết bài học, tiến độ |
| **Global UI state** (không phụ thuộc server) | Zustand | User đã đăng nhập (từ `useAuthListener`), sidebar mở/đóng, video player đang phát/dừng |
| **Local component state** | `useState`/`useReducer` | Form input, trạng thái accordion mở/đóng từng item |
| **URL state** | React Router `useSearchParams` | Bộ lọc khóa học (category, level), trang phân trang |

### 9.2 Custom hooks bọc Firestore qua React Query

```ts
// features/courses/api/courses.api.ts
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import type { Course } from '@/types/course.types';

export async function fetchPublishedCourses(filters: { category?: string; level?: string }) {
  const constraints = [where('status', '==', 'published')];
  if (filters.category) constraints.push(where('category', '==', filters.category));
  if (filters.level) constraints.push(where('level', '==', filters.level));

  const q = query(collection(db, 'courses'), ...constraints, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Course[];
}

export async function fetchCourseBySlug(slug: string) {
  const q = query(collection(db, 'courses'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error('COURSE_NOT_FOUND');
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Course;
}
```

```ts
// features/courses/hooks/useCourses.ts
import { useQuery } from '@tanstack/react-query';
import { fetchPublishedCourses } from '../api/courses.api';

export function useCourses(filters: { category?: string; level?: string }) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => fetchPublishedCourses(filters),
    staleTime: 5 * 60 * 1000, // danh sách khóa học không cần realtime tuyệt đối
  });
}
```

### 9.3 Khi nào dùng Firestore real-time listener (`onSnapshot`) thay vì React Query

Dùng `onSnapshot` (qua hook riêng, không qua React Query) cho các trường hợp **cần cập nhật
ngay không cần refresh trang**:

- Trạng thái `video.status` khi Admin đang upload (để Admin thấy "uploading → ready" tự động)
- Tiến độ học hiển thị trên Sidebar trong lúc đang xem video (đa thiết bị đồng bộ)

```ts
// features/admin/hooks/useLessonVideoStatus.ts
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

export function useLessonVideoStatus(lessonPath: string) {
  const [status, setStatus] = useState<string>('idle');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, lessonPath), (snap) => {
      setStatus(snap.data()?.video?.status ?? 'idle');
    });
    return unsub;
  }, [lessonPath]);

  return status;
}
```

Mọi dữ liệu **không cần real-time** (danh sách khóa học, nội dung chương, tài liệu) nên dùng
React Query thông thường — tránh mở quá nhiều listener đồng thời (tốn quota đọc Firestore,
vì mỗi listener tính phí theo số lần thay đổi nhận được, không chỉ 1 lần đọc).

---

## 10. ROUTING & BẢO VỆ ROUTE THEO ROLE

```tsx
// app/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { RequireRole } from '@/features/auth/components/RequireRole';

export const router = createBrowserRouter([
  // ---- Public ----
  { path: '/', element: <HomePage /> },
  { path: '/courses', element: <CourseExplorePage /> },
  { path: '/courses/:slug', element: <CourseDetailPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // ---- Learner (cần đăng nhập) ----
  {
    path: '/app',
    element: <RequireAuth><LearnerShell /></RequireAuth>,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'learn/:courseId/:lessonId', element: <LearningPage /> },
      { path: 'notes', element: <MyNotesPage /> },
    ],
  },

  // ---- Admin (cần role admin) ----
  {
    path: '/admin',
    element: <RequireAuth><RequireRole role="admin"><AdminShell /></RequireRole></RequireAuth>,
    children: [
      { path: '', element: <AdminDashboardPage /> },
      { path: 'courses', element: <AdminCourseListPage /> },
      { path: 'courses/new', element: <AdminCourseFormPage /> },
      { path: 'courses/:courseId/edit', element: <AdminCourseEditPage /> },
      { path: 'courses/:courseId/content', element: <AdminCourseContentPage /> }, // quản lý chương/phần/bài
      { path: 'users', element: <AdminUserListPage /> },
      { path: 'analytics', element: <AdminAnalyticsPage /> },
    ],
  },
]);
```

```tsx
// features/auth/components/RequireRole.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function RequireRole({ role, children }: { role: 'admin' | 'user'; children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);

  // Quan trọng: đây CHỈ là UX (ẩn route khỏi điều hướng).
  // Quyền thật được Firestore/Storage Security Rules thực thi ở mục 8 —
  // kể cả nếu ai đó bypass route này, mọi request ghi dữ liệu vẫn bị chặn ở backend.
  if (user?.role !== role) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}
```

---

## 11. CHI TIẾT COMPONENT THEO TỪNG MÀN HÌNH

### 11.1 Trang chủ (`HomePage`) — tương ứng mục 8 tài liệu gốc

```
<HomePage>
  <Header />                          # Logo, Search, Menu, Avatar
  <HeroSection />                     # Banner lớn, khóa học nổi bật, CTA "Học ngay"
  <ContinueLearningRail />            # "Tiếp tục học" — chỉ hiện nếu user đã đăng nhập + có enrollment
  <CategoryGrid />                    # Card danh mục
  <CourseGrid title="Khóa học mới" columns={4} sort="newest" />
  <CourseCarousel title="Khóa học phổ biến" sort="popular" />
  <Footer />
</HomePage>
```

`ContinueLearningRail` dùng React Query với key `['continue-learning', userId]`, query
`enrollments` where `userId == current` orderBy `lastAccessedAt desc` limit 5.

### 11.2 Trang khám phá khóa học (`CourseExplorePage`) — mục 9, 10

```tsx
<CourseExplorePage>
  <SearchBar debounceMs={300} placeholder="Tìm khóa học, chương, bài học, tác giả…" />
  <CourseFilterBar>
    {/* Mỗi filter là 1 search param riêng, để có thể share link kết quả lọc */}
    <FilterSelect param="category" options={CATEGORIES} />
    <FilterSelect param="level" options={['beginner','intermediate','advanced']} />
    <FilterSelect param="sort" options={['newest','az','popular']} />
    <FilterToggle param="enrolled" label="Đã học / Chưa học" />
  </CourseFilterBar>
  <CourseGrid courses={filteredCourses} emptyState={
    <EmptyState
      title="Không tìm thấy khóa học phù hợp"
      action="Xóa bộ lọc"
      // Đúng tông giọng mục 3.5: mời hành động, không xin lỗi
    />
  } />
</CourseExplorePage>
```

> Search realtime (mục 9) triển khai bằng debounce 300ms gọi lại query Firestore với
> `where('title', '>=', term)` + `where('title', '<=', term + '\uf8ff')` cho tìm theo tiêu đề
> (Firestore không hỗ trợ full-text search thật). Nếu cần tìm xuyên cả tên chương/bài/tag,
> nên dùng **Algolia** (có extension Firebase chính thức `firestore-algolia-search`) —
> ghi rõ đây là nâng cấp tùy chọn, không bắt buộc ở giai đoạn đầu.

### 11.3 Trang chi tiết khóa học (`CourseDetailPage`) — mục 11

```
┌─────────────────────────────┬───────────────────────┐
│  LEFT (8 cols)                │  RIGHT (4 cols, sticky) │
│  - Banner                      │  - Tiến độ học (nếu đã  │
│  - Tiêu đề + mô tả ngắn        │    enroll)               │
│  - Badge: danh mục, cấp độ,     │  - Nút "Học ngay" /      │
│    tổng giờ học                 │    "Tiếp tục học"        │
│                                  │  - Danh sách tài liệu    │
│  CourseAccordion                │    tổng quan             │
│  ▾ Chương 1                     │                          │
│     ▸ Phần 1.1                  │                          │
│        ✓ Bài 1 (đã học)         │                          │
│        ▶ Bài 2 (đang học)       │                          │
│        ○ Bài 3                  │                          │
│     ▸ Phần 1.2                  │                          │
│  ▸ Chương 2                      │                          │
└─────────────────────────────┴───────────────────────┘
```

Accordion dùng Radix `Accordion` (type `multiple`) — mỗi Chương là 1 `AccordionItem`, icon
trạng thái bài học (✓/▶/○) lấy từ `progress` collection, join ở client bằng map theo `lessonId`.

### 11.4 Giao diện học tập (`LearningPage`) — mục 12-16, trọng tâm hệ thống

```tsx
<LearningPage>
  <div className="learning-layout">
    <aside className="learning-layout__sidebar">
      <BookSpineProgress chapters={course.chapters} />   {/* Signature element, mục 3.4 */}
      <LessonSidebar
        chapters={course.chapters}
        currentLessonId={lessonId}
        progressMap={progressMap}
      />
    </aside>

    <main className="learning-layout__main">
      <VideoPlayer
        src={lesson.video.downloadUrl}
        onProgress={handleVideoProgress}      // mục 12, lưu tiến độ
        playbackRates={[0.5, 1, 1.5, 2]}
      />
      <LessonHeader title={lesson.title} duration={lesson.durationSeconds} />
      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          <TabsTrigger value="notes">Ghi chú</TabsTrigger>
        </TabsList>
        <TabsContent value="documents"><LessonDocuments documents={lesson.documents} /></TabsContent>
        <TabsContent value="notes"><NotePanel lessonId={lessonId} /></TabsContent>
      </Tabs>

      {isLastLessonInChapter && <QuizCTA chapterId={chapterId} quizId={chapter.quizId} />}
    </main>
  </div>
</LearningPage>
```

### 11.5 Dashboard người học (`DashboardPage`) — mục 19

```tsx
<DashboardPage>
  <ProfileHeader avatar={user.avatarUrl} name={user.displayName} level={user.level} xp={user.xp} />
  <StatsRow>
    <StatsCard label="Khóa đang học" value={inProgressCount} />
    <StatsCard label="Khóa hoàn thành" value={completedCount} />
    <StatsCard label="Thời gian học" value={formatDuration(totalLearningSeconds)} />
    <StreakCard label="Ngày học liên tiếp" value={user.streakDays} />
  </StatsRow>
  <ContinueLearningList enrollments={inProgressEnrollments} />
</DashboardPage>
```

---

## 12. VIDEO PLAYER & TRACKING TIẾN ĐỘ

### 12.1 Yêu cầu chức năng (đúng mục 13 tài liệu gốc)

- Hiển thị tên bài, thời lượng
- Fullscreen
- Tốc độ phát: 0.5x / 1x / 1.5x / 2x
- **Bổ sung bắt buộc cho nghiệp vụ E-Learning**: tự động lưu vị trí xem (resume), đánh dấu
  hoàn thành khi xem ≥ 90%, chặn việc tua nhanh tới cuối để "gian lận" hoàn thành bài (tùy
  chọn, xem 12.3)

### 12.2 Hook theo dõi tiến độ video

```tsx
// features/learning/hooks/useVideoTracking.ts
import { useRef, useCallback } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { useDebouncedCallback } from '@/shared/hooks/useDebouncedCallback';

interface Params {
  userId: string;
  courseId: string;
  chapterId: string;
  lessonId: string;
  durationSeconds: number;
}

export function useVideoTracking({ userId, courseId, chapterId, lessonId, durationSeconds }: Params) {
  const hasMarkedComplete = useRef(false);

  const persistProgress = useCallback(async (watchedSeconds: number) => {
    const progressId = `${userId}_${courseId}_${lessonId}`;
    const isCompleted = watchedSeconds / durationSeconds >= 0.9;

    if (isCompleted) hasMarkedComplete.current = true;

    await setDoc(
      doc(db, 'progress', progressId),
      {
        userId, courseId, chapterId, lessonId,
        videoWatchedSeconds: watchedSeconds,
        videoDurationSeconds: durationSeconds,
        isCompleted,
        completedAt: isCompleted ? serverTimestamp() : null,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }, [userId, courseId, chapterId, lessonId, durationSeconds]);

  // Không ghi Firestore mỗi frame `timeupdate` (chạy ~4 lần/giây) — debounce 5 giây,
  // và luôn ghi lần cuối khi rời trang (xem onBeforeUnload bên dưới).
  const debouncedPersist = useDebouncedCallback(persistProgress, 5000);

  const handleTimeUpdate = useCallback((currentTime: number) => {
    debouncedPersist(currentTime);
  }, [debouncedPersist]);

  const handleVideoEnded = useCallback(() => {
    persistProgress(durationSeconds); // ghi ngay, không debounce, khi video kết thúc tự nhiên
  }, [persistProgress, durationSeconds]);

  return { handleTimeUpdate, handleVideoEnded };
}
```

### 12.3 Resume từ vị trí đã xem

```tsx
// Khi load lesson, query progress hiện có để set currentTime ban đầu cho player
const { data: existingProgress } = useLessonProgress(userId, courseId, lessonId);

<VideoPlayer
  src={lesson.video.downloadUrl}
  startAt={existingProgress?.videoWatchedSeconds ?? 0}
  onTimeUpdate={handleTimeUpdate}
  onEnded={handleVideoEnded}
/>
```

> **Về việc chặn tua nhanh để "hoàn thành giả"**: có thể chặn bằng cách chỉ tăng
> `videoWatchedSeconds` khi `currentTime` mới lớn hơn `maxWatchedSeconds` đã ghi nhận **liên
> tục** (không cho nhảy cóc quá X giây). Khuyến nghị **không** áp dụng quá khắt khe cho hệ
> thống gia đình/tự học — người học có quyền tua lại xem phần khó hiểu hoặc bỏ qua phần đã
> biết. Đây nên là tùy chọn cấu hình ở cấp Khóa học (`course.strictProgressTracking: boolean`),
> không phải mặc định toàn hệ thống.

---

## 13. QUIZ ENGINE

```tsx
// features/quiz/components/QuizRunner.tsx
export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const submitMutation = useSubmitQuizAttempt();

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  function handleSelectOption(optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  }

  function handleNext() {
    if (isLastQuestion) {
      submitMutation.mutate({ quizId: quiz.id, answers });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  return (
    <div className="quiz-runner">
      <QuizProgressBar current={currentIndex + 1} total={quiz.questions.length} />
      <QuizQuestionCard
        question={currentQuestion}
        selectedIndex={answers[currentQuestion.id]}
        onSelect={handleSelectOption}
      />
      <button onClick={handleNext} disabled={answers[currentQuestion.id] === undefined}>
        {isLastQuestion ? 'Nộp bài' : 'Câu tiếp theo'}
      </button>
    </div>
  );
}
```

Kết quả (mục 17: Điểm, Đúng, Sai) hiển thị ở `QuizResult` ngay sau khi `submitMutation`
thành công, đọc từ `QuizAttempt` vừa tạo — không cần fetch lại, dùng kết quả trả về của
mutation (`onSuccess` trả `data` chính là `QuizAttempt` mới).

---

## 14. ADMIN PANEL — QUẢN TRỊ NỘI DUNG

### 14.1 Quản lý thứ tự Chương/Phần bằng kéo-thả (mục 23, 24)

```tsx
// features/admin/components/ChapterManager.tsx
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export function ChapterManager({ courseId, chapters }: { courseId: string; chapters: Chapter[] }) {
  const reorderMutation = useReorderChapters(courseId);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = chapters.findIndex((c) => c.id === active.id);
    const newIndex = chapters.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(chapters, oldIndex, newIndex)
      .map((chapter, index) => ({ ...chapter, order: index }));

    reorderMutation.mutate(reordered); // batch update field `order` cho toàn bộ chapters
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={chapters.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        {chapters.map((chapter) => (
          <SortableChapterRow key={chapter.id} chapter={chapter} courseId={courseId} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

```ts
// features/admin/hooks/useReorderChapters.ts — dùng writeBatch để cập nhật nhiều doc 1 lượt
import { writeBatch, doc } from 'firebase/firestore';

export function useReorderChapters(courseId: string) {
  return useMutation({
    mutationFn: async (chapters: Chapter[]) => {
      const batch = writeBatch(db);
      chapters.forEach((chapter) => {
        batch.update(doc(db, 'courses', courseId, 'chapters', chapter.id), { order: chapter.order });
      });
      await batch.commit();
    },
  });
}
```

### 14.2 Form tạo khóa học — React Hook Form + Zod (mục 22)

```ts
// features/admin/schemas/course.schema.ts
import { z } from 'zod';

export const courseFormSchema = z.object({
  title: z.string().min(5, 'Tên khóa học cần tối thiểu 5 ký tự'),
  shortDescription: z.string().min(20).max(160),
  fullDescription: z.string().min(50),
  category: z.enum(['math', 'english', 'programming', 'it', 'softskill', 'certificate', 'ai', 'backend', 'frontend', 'devops']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
```

Schema này dùng chung cho cả validate form **và** làm kiểu base cho `Course` (tránh lệch
kiểu giữa form và Firestore document).

### 14.3 Bảng quản lý người dùng (mục 20 — Admin Dashboard / User)

```tsx
<AdminUserListPage>
  <DataTable
    columns={['Avatar', 'Tên', 'Email', 'Vai trò', 'Khóa đang học', 'Ngày tham gia', 'Hành động']}
    data={users}
    actions={(user) => (
      <DropdownMenu>
        <DropdownMenuItem onClick={() => promoteToAdmin(user.uid)}>Nâng quyền Admin</DropdownMenuItem>
        <DropdownMenuItem onClick={() => disableUser(user.uid)} className="text-danger">Khóa tài khoản</DropdownMenuItem>
      </DropdownMenu>
    )}
  />
</AdminUserListPage>
```

> `promoteToAdmin` **không** được gọi `setCustomUserClaims` trực tiếp từ client (client
> không có quyền Admin SDK). Phải gọi qua **Callable Cloud Function** `promoteUserToAdmin`,
> function này tự kiểm tra `context.auth.token.role === 'admin'` trước khi thực hiện —
> tức là chỉ Admin hiện tại mới có thể nâng quyền cho người khác.

### 14.4 Analytics (mục 26)

Số liệu tổng (`totalUsers`, `totalCourses`, `totalVideos`, `totalViews`) **không nên** tính
bằng cách query `getDocs` toàn bộ collection mỗi lần Admin mở trang (tốn lượt đọc, chậm khi
dữ liệu lớn). Dùng Cloud Function `aggregateAnalytics` chạy theo lịch (Cloud Scheduler, mỗi
giờ) hoặc trigger trên write, ghi kết quả vào 1 document duy nhất `analytics/summary`:

```ts
// functions/src/aggregateAnalytics.ts
export const aggregateAnalytics = onSchedule('every 1 hours', async () => {
  const db = getFirestore();
  const [usersSnap, coursesSnap] = await Promise.all([
    db.collection('users').count().get(),
    db.collection('courses').count().get(),
  ]);
  await db.doc('analytics/summary').set({
    totalUsers: usersSnap.data().count,
    totalCourses: coursesSnap.data().count,
    updatedAt: FieldValue.serverTimestamp(),
  });
});
```

Frontend chỉ cần đọc 1 document duy nhất `analytics/summary` — nhanh và rẻ.

---

## 15. HIỆU NĂNG & TỐI ƯU TẢI VIDEO

Vì chọn phương án Firebase Storage trực tiếp (không transcode HLS), một số tối ưu **bắt
buộc** ở tầng Frontend để trải nghiệm không bị giật/tải lâu:

1. **Lazy load video player**: Component `VideoPlayer` chỉ mount khi user thực sự vào trang
   học (route-based code splitting qua `React.lazy`), không bao giờ preload video ở trang
   danh sách khóa học.
2. **Thumbnail trước, video sau**: Trang chi tiết bài học hiển thị `poster` (ảnh đại diện
   video, có thể lấy frame đầu hoặc Admin upload riêng) trước, video chỉ bắt đầu buffer khi
   user bấm Play (`preload="none"` trên thẻ `<video>`).
3. **Giới hạn dung lượng video lúc upload**: validate ở `VideoUploader` (mục 7.2) — khuyến
   nghị Admin nén video trước khi upload (720p, bitrate ~2-3 Mbps đủ cho bài giảng) vì
   Firebase Storage tính phí theo cả lưu trữ **và** băng thông tải xuống (mỗi lượt user xem
   lại tải toàn bộ file từ Storage, không có CDN cache lớp giữa như HLS qua Cloud CDN).
4. **Giới hạn số video tải đồng thời**: chỉ 1 `<video>` element active trong DOM tại 1 thời
   điểm trong `LearningPage` — không render trước video của bài tiếp theo.
5. **Cache `downloadUrl`** trong Firestore (đã thiết kế ở mục 5.4) — tránh gọi lại
   `getDownloadURL()` mỗi lần load trang, vì URL của Firebase Storage có token cố định, gọi
   lại không cần thiết, chỉ tốn round-trip.

---

## 16. GIỚI HẠN CỦA FIREBASE STORAGE TRỰC TIẾP & LỘ TRÌNH NÂNG CẤP

Phương án đã chọn (Firebase Storage trực tiếp, không transcode) phù hợp cho **giai đoạn đồ
án / quy mô gia đình / lớp học nhỏ**, nhưng có những giới hạn cần biết trước để không bị
bất ngờ khi hệ thống phát triển lớn hơn:

| Giới hạn | Ảnh hưởng | Khi nào cần xử lý |
|---|---|---|
| Không có adaptive bitrate (không tự đổi chất lượng theo mạng yếu) | User mạng chậm phải tải nguyên file chất lượng cao, video giật/loading lâu | Khi có người dùng ở vùng mạng yếu phản hồi nhiều |
| Không có CDN edge cache theo khu vực | Mọi lượt xem đều tải trực tiếp từ Storage bucket (1 region cố định) | Khi user ở nhiều quốc gia/vùng xa nhau |
| Chi phí băng thông tăng theo số lượt xem (không phải số video) | 1 video 500MB được 1000 lượt xem = ~500GB egress, tính phí theo GB | Khi tổng lượt xem/tháng vượt free tier Firebase (hiện ~1GB/ngày egress free, tham khảo Firebase Pricing để có số chính xác) |
| Không transcode nhiều độ phân giải | Không thể cho user chọn 360p/720p/1080p | Khi cần hỗ trợ đa thiết bị/đa chất lượng mạng |

**Lộ trình nâng cấp khi cần** (không bắt buộc làm ngay, ghi nhận để biết hướng đi):

1. Bước 1 — vẫn dùng Firebase Storage, thêm Cloud CDN trước bucket (Cloud Storage hỗ trợ
   gắn Cloud CDN của Google Cloud) → giảm phí egress, tăng tốc độ tải lặp lại.
2. Bước 2 — chuyển sang transcode HLS bằng Cloud Functions + ffmpeg (hoặc dùng dịch vụ
   chuyên dụng như Mux, Cloudflare Stream, Google Cloud Transcoder API) khi cần adaptive
   bitrate thật sự.
3. Bước 3 — nếu quy mô đủ lớn, tách hẳn video pipeline ra khỏi Firebase Storage, dùng dịch
   vụ video chuyên dụng (Mux/Cloudflare Stream) chỉ giữ Firestore cho metadata — đúng mô
   hình các LMS doanh nghiệp lớn (Udemy, Coursera) đang dùng.

> Tài liệu gốc ở mục 31 đề xuất YouTube Unlisted cho phần video — đây thực ra **là** một
> dạng của Bước 3 (giao video cho hạ tầng chuyên dụng, miễn phí, có adaptive bitrate sẵn).
> Nếu chi phí và độ ổn định là ưu tiên hàng đầu hơn việc "tự kiểm soát hoàn toàn video trên
> Firebase", phương án YouTube Unlisted vẫn là lựa chọn rất hợp lý cho quy mô đồ án — ghi
> chú này để cân nhắc nếu phương án Storage trực tiếp gặp vấn đề chi phí khi demo/triển khai.

---

## 17. CHECKLIST TRIỂN KHAI

### 17.1 Khởi tạo Firebase

- [ ] Tạo Firebase Project, bật Authentication (Email/Password + Google)
- [ ] Tạo Firestore Database (chế độ Production, chọn region `asia-southeast1` gần VN)
- [ ] Tạo Storage bucket (cùng region với Firestore để giảm latency)
- [ ] Deploy `firestore.rules` và `storage.rules` (mục 8)
- [ ] Deploy Cloud Functions `onUserCreate` (mục 6.2)
- [ ] Gán custom claim `role: admin` cho tài khoản Admin đầu tiên qua CLI

### 17.2 Frontend khởi tạo

- [ ] `npm create vite@latest lms-pro-frontend -- --template react-ts`
- [ ] Cài đặt: `firebase`, `@tanstack/react-query`, `zustand`, `react-router-dom`,
      `react-hook-form`, `zod`, `@hookform/resolvers`, `framer-motion`, `@radix-ui/react-*`,
      `@dnd-kit/core`, `@dnd-kit/sortable`, `tailwindcss`
- [ ] Thiết lập `tokens.css` theo mục 3.2
- [ ] Thiết lập `lib/firebase/config.ts` với biến môi trường (`.env.local`, không commit)
- [ ] Thiết lập route tree (mục 10), `RequireAuth`, `RequireRole`

### 17.3 Theo từng nhóm chức năng

- [ ] Auth: Login/Register UI + Google button + `useAuthListener`
- [ ] Public: HomePage, CourseExplorePage, CourseDetailPage
- [ ] Learner: LearningPage (Video Player + Sidebar + BookSpineProgress), Quiz, Notes, Dashboard
- [ ] Admin: CourseForm, ChapterManager (drag-drop), LessonForm, VideoUploader, UserList, Analytics
- [ ] Kiểm thử Security Rules bằng Firebase Emulator Suite trước khi deploy production

---

*Tài liệu này tập trung vào Frontend + luồng dữ liệu Firebase cơ bản theo yêu cầu. Phần
Cloud Functions chỉ trình bày ở mức cần thiết để Frontend hoạt động đúng (gán quyền, xử lý
video metadata, analytics) — không đi sâu vào CI/CD, monitoring hay chi tiết chi phí vận
hành ở quy mô lớn.*
