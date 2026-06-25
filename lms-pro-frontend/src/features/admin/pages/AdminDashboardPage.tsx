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
      gradient: 'linear-gradient(135deg, rgba(224,115,74,0.15) 0%, rgba(224,115,74,0.05) 100%)',
      iconColor: 'var(--color-accent)',
      borderColor: 'rgba(224,115,74,0.25)',
    },
    {
      label: 'Đã xuất bản',
      value: publishedCourses.length.toString(),
      icon: Eye,
      gradient: 'linear-gradient(135deg, rgba(62,124,89,0.15) 0%, rgba(62,124,89,0.05) 100%)',
      iconColor: 'var(--color-success)',
      borderColor: 'rgba(62,124,89,0.25)',
    },
    {
      label: 'Khóa học nháp',
      value: draftCourses.length.toString(),
      icon: EyeOff,
      gradient: 'linear-gradient(135deg, rgba(178,164,141,0.2) 0%, rgba(178,164,141,0.08) 100%)',
      iconColor: 'var(--color-muted)',
      borderColor: 'rgba(178,164,141,0.3)',
    },
    {
      label: 'Học viên đăng ký',
      value: loadingUsers ? '...' : totalUsers.toString(),
      icon: Users,
      gradient: 'linear-gradient(135deg, rgba(27,42,74,0.1) 0%, rgba(27,42,74,0.03) 100%)',
      iconColor: 'var(--color-ink)',
      borderColor: 'rgba(27,42,74,0.15)',
    },
  ];

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Dev Banner for Mock Mode */}
      {isMockMode && showDevBanner && (
        <div 
          style={{
            background: 'linear-gradient(90deg, #FDF7F4 0%, #FFFDF9 100%)',
            borderLeft: '4px solid var(--color-accent)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(224,115,74,0.05)'
          }}
          className="flex items-start justify-between p-4 border border-border text-xs sm:text-sm text-ink-soft gap-4"
        >
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-ink text-sm">Chế độ Demo (Mock Mode) đang bật</span>
              <p className="leading-relaxed text-xs">
                Bạn đang xem dữ liệu demo lưu cục bộ trên trình duyệt này. Đăng nhập tài khoản quản trị bằng Email: <strong className="font-mono text-ink">admin@lms.pro</strong> / Mật khẩu: <strong className="font-mono text-ink">admin123</strong>. 
                Khi bạn deploy lên Vercel kèm theo các biến cấu hình Firebase thật, hệ thống sẽ tự động chuyển sang chế độ dữ liệu thật kết nối với Firestore.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowDevBanner(false)}
            className="p-1 rounded-full hover:bg-black/5 text-ink-soft/60 hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Welcome Banner Card */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1B2A4A 0%, #0D1627 100%)',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(27,42,74,0.15)'
        }}
        className="relative overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        {/* Subtle decorative glow overlay */}
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,115,74,0.15) 0%, transparent 65%)',
          top: -50, right: -50, filter: 'blur(40px)', pointerEvents: 'none'
        }} />
        
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/30 text-[10px] text-accent font-bold uppercase tracking-wider">
            <GraduationCap className="h-3.5 w-3.5" />
            Hệ thống quản trị LMS
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">Chào mừng trở lại, Quản trị viên!</h2>
          <p className="text-xs text-white/70 max-w-xl">
            Chào mừng bạn đến với khu vực tổng quan quản lý. Tại đây bạn có thể kiểm soát các khóa học học tập, cấu trúc bài giảng và quản lý phân quyền học viên nhanh chóng.
          </p>
        </div>

        <Link
          to="/admin/courses/new"
          style={{
            backgroundColor: 'var(--color-accent)',
            boxShadow: '0 4px 14px rgba(224,115,74,0.4)'
          }}
          className="z-10 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white hover:bg-accent/95 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
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
              style={{
                background: 'var(--color-paper-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
              }}
              className="p-6 flex items-center justify-between hover:shadow-[0_8px_30px_rgba(27,42,74,0.06)] hover:border-accent/20 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider">{stat.label}</span>
                <p className="font-mono text-3xl font-extrabold text-ink leading-none">{stat.value}</p>
              </div>
              <div style={{
                width: 52, height: 52, borderRadius: '14px',
                background: stat.gradient,
                border: `1px solid ${stat.borderColor}`,
                color: stat.iconColor,
              }}
              className="flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
              >
                <Icon size={22} />
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
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Khóa học cập nhật gần đây</h3>
              <p className="text-[11px] text-muted">Danh sách các bài giảng mới được sửa đổi</p>
            </div>
            <Link to="/admin/courses" className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-bold transition-all">
              Quản lý tất cả
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div 
            style={{
              background: 'var(--color-paper-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
            }}
            className="overflow-hidden"
          >
            {courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-paper border-b border-border text-ink-soft uppercase font-bold tracking-wider">
                      <th className="p-4 pl-6">Khóa học</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4">Bài học</th>
                      <th className="p-4 pr-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentCourses.map((course) => {
                      const lessonCount = course.chapters.reduce(
                        (acc, ch) => acc + (ch.lessons?.length || 0), 0
                      );
                      return (
                        <tr key={course.id} className="hover:bg-paper/40 transition-colors text-ink-soft">
                          <td className="p-4 pl-6 font-bold text-ink max-w-xs">
                            <span className="line-clamp-1">{course.title}</span>
                            <span className="block text-[10px] text-muted font-mono font-normal mt-0.5">{course.slug}</span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                              course.status === 'published'
                                ? 'bg-success-soft/10 text-success border-success/20'
                                : 'bg-paper border-border text-muted'
                            }`}>
                              {course.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-ink">{lessonCount} bài học</td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <Link to={`/admin/courses/${course.id}/edit`} className="text-xs font-bold text-accent hover:text-accent/80 transition-colors">
                                Sửa
                              </Link>
                              <Link to={`/admin/courses/${course.id}/content`} className="text-xs font-bold text-ink-soft hover:text-ink transition-colors">
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
              <div className="p-12 flex flex-col items-center justify-center text-center text-ink-soft">
                <div className="p-4 rounded-full bg-paper border border-border mb-4">
                  <BookOpen className="h-8 w-8 text-muted" />
                </div>
                <p className="font-bold text-sm text-ink">Chưa có khóa học nào</p>
                <p className="text-xs text-muted mt-1 mb-4">Bắt đầu bằng cách tạo khóa học đầu tiên của bạn để chia sẻ tri thức.</p>
                <Link
                  to="/admin/courses/new"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-accent/95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <FilePlus className="h-4 w-4" />
                  Tạo khóa học đầu tiên
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Editorial Process Guide */}
        <div className="lg:col-span-4 space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Quy trình biên soạn</h3>
            <p className="text-[11px] text-muted">Các bước xuất bản khóa học tiêu chuẩn</p>
          </div>
          
          <div 
            style={{
              background: 'var(--color-paper-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
            }}
            className="p-6 space-y-6 text-xs text-ink-soft"
          >
            <div className="relative pl-6 space-y-6">
              {/* Stepper vertical line */}
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-border" />

              <div className="relative flex gap-3">
                <span className="absolute -left-5 w-5 h-5 rounded-full bg-accent/10 border border-accent text-[9px] font-bold text-accent flex items-center justify-center bg-paper-raised">1</span>
                <div>
                  <p className="font-bold text-ink text-xs">Tạo mới thông tin khóa học</p>
                  <p className="text-[10px] text-muted mt-0.5">Đặt tiêu đề, mô tả ngắn, mô tả chi tiết, hình ảnh banner và thumbnail.</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-5 w-5 h-5 rounded-full bg-accent/10 border border-accent text-[9px] font-bold text-accent flex items-center justify-center bg-paper-raised">2</span>
                <div>
                  <p className="font-bold text-ink text-xs">Thiết kế cấu trúc chương</p>
                  <p className="text-[10px] text-muted mt-0.5">Bấm vào mục "Nội dung" trên khóa học, tiến hành thêm các chương học chính.</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-5 w-5 h-5 rounded-full bg-accent/10 border border-accent text-[9px] font-bold text-accent flex items-center justify-center bg-paper-raised">3</span>
                <div>
                  <p className="font-bold text-ink text-xs">Đăng bài giảng & tài liệu</p>
                  <p className="text-[10px] text-muted mt-0.5">Upload bài học video lên Storage, gắn kèm PDF, tài liệu và tạo các câu hỏi trắc nghiệm kiểm tra.</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-5 w-5 h-5 rounded-full bg-accent/10 border border-accent text-[9px] font-bold text-accent flex items-center justify-center bg-paper-raised">4</span>
                <div>
                  <p className="font-bold text-ink text-xs">Thay đổi trạng thái xuất bản</p>
                  <p className="text-[10px] text-muted mt-0.5">Chuyển trạng thái khóa học sang "Đã đăng" để bắt đầu cho học viên học tập.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <Link 
                to="/admin/courses" 
                className="w-full inline-flex items-center justify-center gap-1 rounded-xl border border-border bg-paper p-2.5 text-xs font-bold text-ink hover:bg-paper-dim transition-colors cursor-pointer"
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
