import { useState, useEffect } from 'react';
import { BookOpen, Users, PlaySquare, FilePlus, ArrowRight, Plus, Eye, EyeOff, Info, GraduationCap, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '@/store/courseStore';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

const isMockMode = !import.meta.env.VITE_FIREBASE_API_KEY || 
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('Dummy') ||
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('dummy');

export function AdminDashboardPage() {
  const courses = useCourseStore((s) => s.courses);
  const [totalUsers, setTotalUsers] = useState<number>(3); // Fallback to 3 in mock mode
  const [showDevBanner, setShowDevBanner] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const publishedCourses = courses.filter(c => c.status === 'published');
  const draftCourses = courses.filter(c => c.status === 'draft');

  // Load real registered user count from Firestore
  useEffect(() => {
    if (isMockMode) return;
    const fetchUserCount = async () => {
      try {
        setLoadingUsers(true);
        const querySnapshot = await getDocs(collection(db, 'users'));
        setTotalUsers(querySnapshot.size);
      } catch (err) {
        console.error('Error fetching users collection size:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUserCount();
  }, []);

  const stats = [
    {
      label: 'Tổng số khóa học',
      value: courses.length.toString(),
      icon: BookOpen,
      gradient: 'bg-violet-50 text-violet-600 border-violet-100',
      iconColor: 'text-violet-600',
      borderColor: 'border-l-4 border-l-violet-600',
    },
    {
      label: 'Đã xuất bản',
      value: publishedCourses.length.toString(),
      icon: Eye,
      gradient: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconColor: 'text-emerald-600',
      borderColor: 'border-l-4 border-l-emerald-500',
    },
    {
      label: 'Khóa học nháp',
      value: draftCourses.length.toString(),
      icon: EyeOff,
      gradient: 'bg-slate-100 text-slate-600 border-slate-200',
      iconColor: 'text-slate-500',
      borderColor: 'border-l-4 border-l-slate-400',
    },
    {
      label: 'Học viên đăng ký',
      value: loadingUsers ? '...' : totalUsers.toString(),
      icon: Users,
      gradient: 'bg-amber-50 text-amber-600 border-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'border-l-4 border-l-amber-500',
    },
  ];

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* Dev Banner for Mock Mode */}
      {isMockMode && showDevBanner && (
        <div 
          className="flex items-start justify-between p-5 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-ink-soft gap-4 shadow-sm border-l-4 border-l-amber-500"
        >
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold text-amber-900 text-base">Chế độ Demo (Mock Mode) đang bật</span>
              <p className="leading-relaxed text-xs text-amber-800">
                Bạn đang xem dữ liệu demo lưu cục bộ trên trình duyệt này. Đăng nhập tài khoản quản trị bằng Email: <strong className="font-mono text-amber-950 font-bold">admin@lms.pro</strong> / Mật khẩu: <strong className="font-mono text-amber-950 font-bold">admin123</strong>. 
                Khi bạn deploy lên Vercel kèm theo các biến cấu hình Firebase thật, hệ thống sẽ tự động chuyển sang chế độ dữ liệu thật kết nối với Firestore.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowDevBanner(false)}
            className="p-1 rounded-full hover:bg-amber-200/50 text-amber-700/60 hover:text-amber-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Welcome Banner Card */}
      <div 
        className="relative overflow-hidden p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-violet-700 via-purple-800 to-indigo-900 rounded-2xl shadow-lg border border-violet-800/10"
      >
        {/* Subtle decorative glow overlay */}
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 65%)',
          top: -100, right: -100, filter: 'blur(50px)', pointerEvents: 'none'
        }} />
        
        <div className="space-y-3.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white font-extrabold uppercase tracking-wider">
            <GraduationCap className="h-4 w-4 text-amber-400" />
            Hệ thống quản trị LMS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">Chào mừng trở lại, Quản trị viên!</h2>
          <p className="text-sm text-white/80 max-w-xl leading-relaxed">
            Chào mừng bạn đến với khu vực tổng quan quản lý. Tại đây bạn có thể kiểm soát các khóa học học tập, cấu trúc bài giảng và quản lý phân quyền học viên nhanh chóng.
          </p>
        </div>

        <Link
          to="/admin/courses/new"
          className="z-10 inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold px-6 py-4 text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-amber-500/20"
        >
          <Plus className="h-5 w-5" strokeWidth={3} />
          Tạo khóa học mới
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-6 bg-white border border-border rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md hover:scale-[1.02] transition-all duration-300 group ${stat.borderColor}`}
            >
              <div className="space-y-2">
                <span className="text-xs text-muted uppercase font-bold tracking-wider">{stat.label}</span>
                <p className="font-mono text-4xl font-black text-ink leading-none">{stat.value}</p>
              </div>
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${stat.gradient} border`}
              >
                <Icon size={26} strokeWidth={2.5} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Recent courses table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-ink uppercase tracking-wider">Khóa học cập nhật gần đây</h3>
              <p className="text-xs text-muted">Danh sách các bài giảng mới được sửa đổi</p>
            </div>
            <Link to="/admin/courses" className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-extrabold transition-all bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10 hover:bg-accent/10">
              Quản lý tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            {courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-border text-ink-soft uppercase font-extrabold tracking-wider text-xs">
                      <th className="p-5 pl-6">Khóa học</th>
                      <th className="p-5">Trạng thái</th>
                      <th className="p-5">Bài học</th>
                      <th className="p-5 pr-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {recentCourses.map((course) => {
                      const lessonCount = course.chapters.reduce(
                        (acc, ch) => acc + (ch.lessons?.length || 0), 0
                      );
                      return (
                        <tr key={course.id} className="hover:bg-slate-50/50 transition-colors text-ink-soft">
                          <td className="p-5 pl-6 font-extrabold text-ink max-w-xs">
                            <Link to={`/admin/courses/${course.id}/content`} className="hover:text-accent transition-colors block">
                              <span className="line-clamp-1 text-sm sm:text-base">{course.title}</span>
                            </Link>
                            <span className="block text-[10px] text-muted font-mono font-normal mt-1">{course.slug}</span>
                          </td>
                          <td className="p-5">
                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-xs ${
                              course.status === 'published'
                                ? 'bg-success text-white'
                                : 'bg-slate-400 text-white'
                            }`}>
                              {course.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                            </span>
                          </td>
                          <td className="p-5 font-mono font-bold text-ink">{lessonCount} bài học</td>
                          <td className="p-5 pr-6 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <Link to={`/admin/courses/${course.id}/edit`} className="text-xs font-bold text-accent hover:text-accent-deep transition-colors bg-accent/5 px-2.5 py-1.5 rounded-lg border border-accent/15">
                                Sửa
                              </Link>
                              <Link to={`/admin/courses/${course.id}/content`} className="text-xs font-bold text-ink-soft hover:text-ink transition-colors bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                                Nội dung
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 flex flex-col items-center justify-center text-center text-ink-soft">
                <div className="p-4 rounded-full bg-slate-50 border border-border mb-4">
                  <BookOpen className="h-10 w-10 text-muted" />
                </div>
                <p className="font-extrabold text-base text-ink">Chưa có khóa học nào</p>
                <p className="text-xs text-muted mt-1 mb-6 max-w-sm">Bắt đầu bằng cách tạo khóa học đầu tiên của bạn để chia sẻ tri thức.</p>
                <Link
                  to="/admin/courses/new"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-accent/95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <FilePlus className="h-4.5 w-4.5" />
                  Tạo khóa học đầu tiên
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Editorial Process Guide */}
        <div className="lg:col-span-4 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-ink uppercase tracking-wider">Quy trình biên soạn</h3>
            <p className="text-xs text-muted">Các bước xuất bản khóa học tiêu chuẩn</p>
          </div>
          
          <div className="p-6 space-y-6 text-sm text-ink-soft bg-white border border-border rounded-2xl shadow-sm">
            <div className="relative pl-7 space-y-7">
              {/* Stepper vertical line */}
              <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-slate-200" />

              <div className="relative flex gap-3">
                <span className="absolute -left-7.5 w-7 h-7 rounded-full bg-accent border-2 border-white text-xs font-bold text-white flex items-center justify-center shadow-sm">1</span>
                <div>
                  <p className="font-extrabold text-ink text-sm leading-tight">Tạo mới thông tin khóa học</p>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">Đặt tiêu đề, mô tả ngắn, mô tả chi tiết, hình ảnh banner và thumbnail.</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-7.5 w-7 h-7 rounded-full bg-accent border-2 border-white text-xs font-bold text-white flex items-center justify-center shadow-sm">2</span>
                <div>
                  <p className="font-extrabold text-ink text-sm leading-tight">Thiết kế cấu trúc chương</p>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">Bấm vào mục "Nội dung" trên khóa học, tiến hành thêm các chương học chính.</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-7.5 w-7 h-7 rounded-full bg-accent border-2 border-white text-xs font-bold text-white flex items-center justify-center shadow-sm">3</span>
                <div>
                  <p className="font-extrabold text-ink text-sm leading-tight">Đăng bài giảng & tài liệu</p>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">Upload bài học video lên Storage, gắn kèm PDF, tài liệu và tạo các câu hỏi trắc nghiệm kiểm tra.</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-7.5 w-7 h-7 rounded-full bg-accent border-2 border-white text-xs font-bold text-white flex items-center justify-center shadow-sm">4</span>
                <div>
                  <p className="font-extrabold text-ink text-sm leading-tight">Thay đổi trạng thái xuất bản</p>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">Chuyển trạng thái khóa học sang "Đã đăng" để bắt đầu cho học viên học tập.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Link 
                to="/admin/courses" 
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-slate-50 p-3 text-xs font-bold text-ink hover:bg-slate-100 hover:text-accent transition-all cursor-pointer shadow-xs"
              >
                Đi tới danh sách khóa học
                <ChevronRight className="h-4 w-4 text-muted" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
