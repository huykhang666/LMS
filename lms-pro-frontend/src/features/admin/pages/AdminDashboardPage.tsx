import { useState, useEffect } from 'react';
import { BookOpen, Users, ArrowRight, Plus, Eye, EyeOff, Info, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '@/store/courseStore';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { StatCard } from '@/shared/components/ui/StatCard';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { cn } from '@/shared/utils/cn';

const isMockMode = !import.meta.env.VITE_FIREBASE_API_KEY || 
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('Dummy') ||
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('dummy');

export function AdminDashboardPage() {
  const courses = useCourseStore((s) => s.courses);
  const [totalUsers, setTotalUsers] = useState<number>(3); // Fallback to 3 in mock mode
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

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      
      {/* Dev Banner for Mock Mode */}
      {isMockMode && (
        <div className="bg-warning-soft border-l-[3px] border-warning rounded-sm px-4 py-3 flex items-start gap-3">
          <Info className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
          <p className="font-body text-sm text-ink-soft leading-relaxed">
            Bạn đang xem dữ liệu demo lưu cục bộ trên trình duyệt này. Đăng nhập tài khoản quản trị bằng Email:{' '}
            <code className="font-mono text-xs bg-paper-dim px-1 py-0.5 rounded-sm text-ink font-semibold">admin@lms.pro</code>
            {' '}/ Mật khẩu:{' '}
            <code className="font-mono text-xs bg-paper-dim px-1 py-0.5 rounded-sm text-ink font-semibold">admin123</code>. 
            Khi bạn deploy lên Vercel kèm các biến cấu hình Firebase thật, hệ thống sẽ tự động chuyển sang chế độ dữ liệu thật kết nối với Firestore.
          </p>
        </div>
      )}

      {/* Welcome Banner Card */}
      <div className="bg-ink rounded-lg px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-mono text-xs text-accent-soft uppercase tracking-wide mb-1">
            Hệ thống quản trị LMS
          </p>
          <h1 className="font-display text-2xl text-paper-raised mb-2">
            Chào mừng trở lại, Quản trị viên
          </h1>
          <p className="font-body text-sm text-paper-dim max-w-lg leading-relaxed">
            Chào mừng bạn đến khu vực tổng quan quản lý. Tại đây bạn có thể kiểm soát các khóa học, cấu trúc bài giảng và quản lý phân quyền học viên.
          </p>
        </div>
        <Link 
          to="/admin/courses/new"
          className="bg-accent hover:bg-accent/90 text-paper-raised font-body font-medium text-sm px-4 py-2.5 rounded-md flex items-center gap-2 flex-shrink-0 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tạo khóa học mới
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tổng số khóa học" value={courses.length} icon={BookOpen} />
        <StatCard label="Đã xuất bản" value={publishedCourses.length} icon={Eye} />
        <StatCard label="Khóa học nháp" value={draftCourses.length} icon={EyeOff} />
        <StatCard
          label="Học viên đăng ký"
          value={loadingUsers ? '...' : totalUsers}
          icon={Users}
          accented={totalUsers > 0}
        />
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Recent courses table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold text-slate-900 leading-tight">Khóa học cập nhật gần đây</h2>
              <p className="text-xs text-slate-500">Danh sách các bài giảng mới được sửa đổi</p>
            </div>
            <Link to="/admin/courses" className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-semibold transition-all">
              Quản lý tất cả
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-paper-raised border border-border rounded-md overflow-hidden">
            {courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-paper border-b border-border text-muted uppercase font-semibold tracking-wide text-xs">
                      <th className="p-4 pl-6">Khóa học</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4">Bài học</th>
                      <th className="p-4 pr-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm text-ink-soft">
                    {recentCourses.map((course) => {
                      const lessonCount = course.chapters.reduce(
                        (acc, ch) => acc + (ch.lessons?.length || 0), 0
                      );
                      return (
                        <tr key={course.id} className="hover:bg-paper/50 transition-colors">
                          <td className="p-4 pl-6 font-semibold text-ink max-w-xs">
                            <Link to={`/admin/courses/${course.id}/content`} className="hover:text-accent transition-colors block truncate">
                              {course.title}
                            </Link>
                            <span className="block text-[9px] text-muted font-mono font-normal mt-0.5">{course.slug}</span>
                          </td>
                          <td className="p-4">
                            <span className={cn(
                              'font-body font-medium text-[10px] px-2 py-0.5 rounded-sm inline-flex items-center gap-1 uppercase tracking-wider',
                              course.status === 'published' ? 'bg-success-soft text-success' : 'bg-paper-dim text-ink-soft'
                            )}>
                              {course.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-ink-soft">{lessonCount} bài học</td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <Link to={`/admin/courses/${course.id}/edit`} className="text-xs font-semibold text-accent hover:underline">
                                Sửa
                              </Link>
                              <Link to={`/admin/courses/${course.id}/content`} className="text-xs font-semibold text-ink hover:text-ink-soft">
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
              <EmptyState
                icon={BookOpen}
                title="Chưa có khóa học nào trong danh sách"
                description="Bắt đầu bằng cách tạo khóa học đầu tiên để chia sẻ tri thức của bạn."
                actionLabel="Tạo khóa học đầu tiên →"
                actionLink="/admin/courses/new"
                variant="admin"
              />
            )}
          </div>
        </div>

        {/* Right: Editorial Process Guide */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-0.5">
            <h2 className="text-lg font-semibold text-slate-900 leading-tight">Quy trình biên soạn</h2>
            <p className="text-xs text-slate-500">Các bước xuất bản khoá học tiêu chuẩn</p>
          </div>
          
          <div className="p-6 space-y-6 text-xs text-ink-soft bg-paper-raised border border-border rounded-md">
            <div className="relative pl-6 space-y-6">
              {/* Stepper vertical line */}
              <div className="absolute left-2.5 top-2.5 bottom-2.5 w-px bg-border" />

              <div className="relative flex gap-3">
                <span className="absolute -left-6 w-6 h-6 rounded-full border border-ink flex items-center justify-center bg-paper-raised shrink-0 mt-0.5 font-mono text-xs text-ink">1</span>
                <div>
                  <p className="font-body font-medium text-sm text-ink mb-0.5">Tạo thông tin khoá học</p>
                  <p className="font-body text-xs text-muted leading-relaxed">Tiêu đề, mô tả, banner, thumbnail</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-6 w-6 h-6 rounded-full border border-ink flex items-center justify-center bg-paper-raised shrink-0 mt-0.5 font-mono text-xs text-ink">2</span>
                <div>
                  <p className="font-body font-medium text-sm text-ink mb-0.5">Thiết kế cấu trúc chương</p>
                  <p className="font-body text-xs text-muted leading-relaxed">Thêm chương học chính</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-6 w-6 h-6 rounded-full border border-ink flex items-center justify-center bg-paper-raised shrink-0 mt-0.5 font-mono text-xs text-ink">3</span>
                <div>
                  <p className="font-body font-medium text-sm text-ink mb-0.5">Đăng bài giảng & tài liệu</p>
                  <p className="font-body text-xs text-muted leading-relaxed">Video, PDF, câu hỏi kiểm tra</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-6 w-6 h-6 rounded-full border border-ink flex items-center justify-center bg-paper-raised shrink-0 mt-0.5 font-mono text-xs text-ink">4</span>
                <div>
                  <p className="font-body font-medium text-sm text-ink mb-0.5">Thay đổi trạng thái xuất bản</p>
                  <p className="font-body text-xs text-muted leading-relaxed">Chuyển sang "Đã đăng"</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Link 
                to="/admin/courses" 
                className="w-full inline-flex items-center justify-center gap-1 rounded-md border border-border bg-paper-raised p-2.5 text-xs font-semibold text-ink-soft hover:bg-paper-dim transition-colors cursor-pointer"
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
