# LMS Pro - Hệ Thống Quản Lý Học Tập Trực Tuyến (Learning Management System)

Chào mừng bạn đến với **LMS Pro**, một nền tảng quản lý học tập trực tuyến (E-learning) hiện đại, chuyên nghiệp và hiệu năng cao được xây dựng trên nền tảng **React + Vite + TypeScript** kết hợp với hệ sinh thái **Firebase (Authentication, Firestore, Storage, Functions)**.

Nền tảng này được thiết kế để mang lại trải nghiệm mượt mà, tối ưu nhất cho cả Học viên (User) lẫn Người quản trị (Admin).

---

## 🚀 Tính Năng Chính

### 🛡️ 1. Xác thực & Phân quyền (Authentication & Authorization)
* **Đăng nhập & Đăng ký**: Tích hợp Firebase Auth giúp đăng ký, đăng nhập nhanh chóng và bảo mật.
* **Phân quyền người dùng**: Hệ thống phân vai rõ ràng giữa **Học viên (User)** và **Quản trị viên (Admin)**.

### 👤 2. Trang Tổng Quan Học Viên (User Dashboard)
* **Hệ thống Gamification**:
  * **Hệ thống Cấp độ (Level)** & **Điểm kinh nghiệm (XP)** thúc đẩy động lực học tập.
  * **Streak Days**: Theo dõi và lưu giữ số ngày học tập liên tục hàng ngày.
* **Tiến độ học tập**: Trực quan hóa phần trăm hoàn thành của từng khóa học đã đăng ký.
* **Lịch sử hoạt động**: Ghi nhận ngày hoạt động gần nhất để duy trì thói quen học tập.

### 📚 3. Khám Phá Khóa Học (Course Explorer)
* **Bộ lọc thông minh**: Lọc khóa học theo các danh mục như *Math, English, Programming, IT, Softskills, AI, Frontend, Backend, DevOps*.
* **Phân cấp trình độ**: Phân loại theo *Beginner, Intermediate, Advanced* kèm huy hiệu (badge) trực quan.
* **Thanh tìm kiếm thời gian thực**: Sử dụng debounce tối ưu hóa hiệu năng tìm kiếm khóa học theo tiêu đề hoặc nội dung ngắn.

### 📖 4. Giao Diện Học Tập Tiêu Chuẩn (Learning Portal)
* **Trình phát video thông minh**: Phát bài học video mượt mà, tự động theo dõi và cập nhật thời lượng đã xem (video duration seconds) lên Firebase.
* **Đánh dấu hoàn thành**: Tự động đánh dấu hoàn thành bài học khi xem xong video.
* **Hệ thống Ghi chú (Notes)**: Cho phép học viên ghi chép bài học trực tiếp với tính năng gắn link mốc thời gian video (video timestamp integration) tiện lợi.
* **Bài kiểm tra (Quiz)**: Tích hợp hệ thống câu hỏi trắc nghiệm cuối mỗi chương học để đánh giá năng lực của học viên trước khi chuyển chương tiếp theo.

### ⚙️ 5. Trang Quản Trị Hệ Thống (Admin Control Center)
* **Quản lý khóa học (CRUD)**: Tạo mới, chỉnh sửa thông tin, đặt ảnh thumbnail/banner và xuất bản (published) hoặc lưu nháp (draft) khóa học.
* **Quản lý Chương (Chapter) & Bài học (Lesson)**: Thiết kế sơ đồ bài giảng linh hoạt bằng việc kéo/sắp xếp thứ tự các chương và bài học.
* **Tải lên tài nguyên trực tiếp**: Tích hợp tải lên video bài học trực tiếp lên Firebase Storage với thanh tiến trình (progress bar) trực quan, tự động xử lý URL tải về.
* **Trình tạo câu hỏi trắc nghiệm (Quiz Builder)**: Dễ dàng soạn thảo các câu hỏi trắc nghiệm, thiết lập đáp án đúng và điểm đạt tối thiểu.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
* **React 18** & **TypeScript**
* **Vite**: Công cụ build siêu nhanh thay thế cho Create React App.
* **Tailwind CSS**: Thiết kế giao diện responsive hiện đại, sử dụng Tailwind CSS linh hoạt và chuyên nghiệp.
* **Zustand**: Quản lý state toàn cục gọn nhẹ, hiệu năng cao.
* **React Query (TanStack Query)**: Quản lý cache, đồng bộ hóa và quản lý các trạng thái API, Firestore queries.
* **Lucide React**: Thư viện icon đa dạng, hiện đại và đồng bộ.

### Backend (Firebase)
* **Firebase Auth**: Xác thực người dùng và phân quyền.
* **Cloud Firestore**: Cơ sở dữ liệu NoSQL lưu trữ thông tin khóa học, bài học, tiến trình học tập, quiz và lịch sử người dùng.
* **Cloud Storage**: Lưu trữ video bài học, hình ảnh thumbnail, banner của khóa học.
* **Cloud Functions**: Viết các API background logic, phân quyền tự động và xử lý dữ liệu nâng cao.

---

## 📂 Cấu Trúc Dự Án

```text
Course Blueprint/
├── functions/                     # Firebase Cloud Functions (Node.js)
├── firestore.rules                # Quy tắc bảo mật cho Firestore DB
├── firestore.indexes.json         # Cấu hình index tối ưu truy vấn Firestore
├── storage.rules                  # Quy tắc bảo mật cho Storage uploads
├── firebase.json                  # Cấu hình chung cho Firebase CLI
└── lms-pro-frontend/              # Mã nguồn Frontend (React + Vite)
    ├── src/
    │   ├── app/                   # Providers & cấu hình App chung
    │   ├── assets/                # Hình ảnh, tài nguyên tĩnh
    │   ├── features/              # Chia modules theo tính năng (admin, auth, learning, dashboard...)
    │   ├── lib/                   # Firebase config, React Query config
    │   ├── shared/                # Hooks, Utilities, Components dùng chung
    │   ├── store/                 # Global state (Zustand stores)
    │   ├── types/                 # Định nghĩa kiểu dữ liệu TypeScript
    │   └── styles/                # CSS toàn cục
    └── index.html
```

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Thử

### 1. Yêu cầu hệ thống
* Đã cài đặt **Node.js** (Phiên bản v18 trở lên)
* Đã cài đặt **npm** hoặc **yarn**
* Đã tạo một dự án (Project) trên **Firebase Console**

### 2. Cấu hình biến môi trường
Tạo file `.env.local` tại thư mục `/lms-pro-frontend` và điền các thông tin cấu hình Firebase của bạn:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 3. Chạy ứng dụng Frontend
Mở terminal và di chuyển vào thư mục frontend:

```bash
cd lms-pro-frontend
npm install
npm run dev
```

Truy cập trình duyệt theo địa chỉ: `http://localhost:5173`.

### 4. Triển khai Firebase (Rules, Indexes & Functions)
Nếu bạn muốn cấu hình các quy tắc bảo mật và Functions lên Firebase:

```bash
# Đăng nhập vào tài khoản Firebase
firebase login

# Liên kết với dự án Firebase của bạn
firebase use --add

# Deploy toàn bộ Rules, Indexes và Functions
firebase deploy
```

---

## 📄 Giấy Phép & Đóng Góp
Dự án được xây dựng bởi **Huy Khang** và được phân phối tự do. Mọi ý kiến đóng góp hoặc báo lỗi vui lòng tạo Issue hoặc Gửi Pull Request trên GitHub.
