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
      label: 'Tổng khoá học',
      value: courses.length,
      icon: BookOpen,
      highlighted: courses.length > 0,
    },
    {
      label: 'Đã xuất bản',
      value: publishedCourses.length,
      icon: Eye,
      highlighted: publishedCourses.length > 0,
    },
    {
      label: 'Khoá học nháp',
      value: draftCourses.length,
      icon: EyeOff,
      highlighted: draftCourses.length > 0,
    },
    {
      label: 'Học viên đăng ký',
      value: loadingUsers ? '...' : totalUsers,
      icon: Users,
      highlighted: totalUsers > 0,
    },
  ];

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      
      {/* Dev Banner for Mock Mode */}
      {isMockMode && showDevBanner && (
        <div 
          className="flex items-start justify-between p-4 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-slate-700 gap-4"
        >
          <div className="flex gap-2.5">
            <Info className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-amber-900 text-xs uppercase tracking-wider">Chế độ Demo (Mock Mode) đang bật</span>
              <p className="leading-relaxed text-[11px] text-amber-800">
                Bạn đang xem dữ liệu demo lưu cục bộ trên trình duyệt này. Đăng nhập tài khoản quản trị bằng Email: <strong className="font-mono text-amber-950 font-bold">admin@lms.pro</strong> / Mật khẩu: <strong className="font-mono text-amber-950 font-bold">admin123</strong>. 
                Khi bạn deploy lên Vercel kèm theo các biến cấu hình Firebase thật, hệ thống sẽ tự động chuyển sang chế độ dữ liệu thật kết nối với Firestore.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowDevBanner(false)}
            className="p-1 rounded-full hover:bg-amber-150 text-amber-600 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Welcome Banner Card */}
      <div 
        className="relative overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#F4F4F0] border border-slate-205 border-slate-200 rounded-xl"
      >
        <div className="space-y-1.5 z-10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            Khu vực quản trị · LMS Pro
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-tight">Chào mừng trở lại, Quản trị viên</h2>
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
            Khoá học của bạn chưa có nội dung công khai. Bắt đầu bằng việc tạo khoá học đầu tiên.
          </p>
        </div>

        <Link
          to="/admin/courses/new"
          className="z-10 inline-flex items-center gap-1.5 rounded-lg bg-[#191919] hover:bg-black text-white font-semibold px-4 py-2.5 text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
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
              className={`p-6 border rounded-xl flex flex-col justify-between h-36 transition-all duration-200 ${
                stat.highlighted
                  ? 'bg-indigo-50/50 border-[#4F46E5]/30'
                  : 'bg-[#F8F9FB] border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4.5 w-4.5 ${stat.highlighted ? 'text-accent' : 'text-slate-400'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${stat.highlighted ? 'text-accent' : 'text-slate-400'}`}>
                  {stat.label}
                </span>
              </div>
              <p className={`font-mono text-4xl font-semibold leading-none mt-4 ${stat.highlighted ? 'text-accent' : 'text-slate-900'}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Recent courses table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold text-slate-900 leading-tight">Khóa học cập nhật gần đây</h2>
              <p className="text-xs text-slate-505 text-slate-500">Danh sách các bài giảng mới được sửa đổi</p>
            </div>
            <Link to="/admin/courses" className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-semibold transition-all">
              Quản lý tất cả
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-550 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                      <th className="p-4 pl-6">Khóa học</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4">Bài học</th>
                      <th className="p-4 pr-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                    {recentCourses.map((course) => {
                      const lessonCount = course.chapters.reduce(
                        (acc, ch) => acc + (ch.lessons?.length || 0), 0
                      );
                      return (
                        <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 pl-6 font-semibold text-slate-900 max-w-xs">
                            <Link to={`/admin/courses/${course.id}/content`} className="hover:text-accent transition-colors block truncate">
                              {course.title}
                            </Link>
                            <span className="block text-[9px] text-slate-400 font-mono font-normal mt-0.5">{course.slug}</span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              course.status === 'published'
                                ? 'bg-indigo-50 border border-indigo-100 text-accent'
                                : 'bg-slate-100 border border-slate-200 text-slate-500'
                            }`}>
                              {course.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-800">{lessonCount} bài học</td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <Link to={`/admin/courses/${course.id}/edit`} className="text-xs font-semibold text-accent hover:underline">
                                Sửa
                              </Link>
                              <Link to={`/admin/courses/${course.id}/content`} className="text-xs font-semibold text-slate-600 hover:text-slate-955 hover:text-slate-900">
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
              <div className="border-dashed border-2 border-slate-200 bg-white rounded-xl p-8 sm:p-10 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-full mb-4">
                  <BookOpen className="h-6 w-6 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-900 text-sm">Chưa có khoá học nào</p>
                <p className="text-xs text-slate-500 mt-1 mb-5">Tạo khoá học đầu tiên để chia sẻ tri thức của bạn.</p>
                <Link
                  to="/admin/courses/new"
                  className="inline-flex items-center gap-1.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  Tạo khoá học đầu tiên ↗
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Editorial Process Guide */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-0.5">
            <h2 className="text-lg font-semibold text-slate-900 leading-tight">Quy trình biên soạn</h2>
            <p className="text-xs text-slate-500">Các bước xuất bản khoá học tiêu chuẩn</p>
          </div>
          
          <div className="p-6 space-y-6 text-xs text-slate-600 bg-white border border-slate-205 border-slate-200 rounded-xl">
            <div className="relative pl-6 space-y-6">
              {/* Stepper vertical line */}
              <div className="absolute left-2.5 top-2.5 bottom-2.5 w-px bg-slate-100" />

              <div className="relative flex gap-3">
                <span className="absolute -left-6 w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 flex items-center justify-center shadow-xs shrink-0 mt-0.5">1</span>
                <div>
                  <p className="font-semibold text-slate-800 text-xs">Tạo thông tin khoá học</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Tiêu đề, mô tả, banner, thumbnail</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-6 w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 flex items-center justify-center shadow-xs shrink-0 mt-0.5">2</span>
                <div>
                  <p className="font-semibold text-slate-800 text-xs">Thiết kế cấu trúc chương</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Thêm chương học chính</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-6 w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 flex items-center justify-center shadow-xs shrink-0 mt-0.5">3</span>
                <div>
                  <p className="font-semibold text-slate-800 text-xs">Đăng bài giảng & tài liệu</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Video, PDF, câu hỏi kiểm tra</p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <span className="absolute -left-6 w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 flex items-center justify-center shadow-xs shrink-0 mt-0.5">4</span>
                <div>
                  <p className="font-semibold text-slate-800 text-xs">Thay đổi trạng thái xuất bản</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Chuyển sang "Đã đăng"</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Link 
                to="/admin/courses" 
                className="w-full inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Đi tới danh sách khóa học
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
