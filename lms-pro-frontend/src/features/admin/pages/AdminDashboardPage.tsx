import { BookOpen, Users, PlaySquare, FilePlus, ArrowRight, Plus, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '@/store/courseStore';

export function AdminDashboardPage() {
  const courses = useCourseStore((s) => s.courses);
  
  const publishedCourses = courses.filter(c => c.status === 'published');
  const draftCourses = courses.filter(c => c.status === 'draft');
  const totalLessons = courses.reduce((acc, c) =>
    acc + c.chapters.reduce((a, ch) => a + (ch.lessons?.length || 0), 0), 0
  );

  const stats = [
    {
      label: 'Tổng số khóa học',
      value: courses.length.toString(),
      icon: BookOpen,
      iconBg: 'rgba(224,115,74,0.12)',
      iconColor: 'var(--color-accent)',
      borderColor: 'rgba(224,115,74,0.2)',
    },
    {
      label: 'Đã xuất bản',
      value: publishedCourses.length.toString(),
      icon: Eye,
      iconBg: 'rgba(62,124,89,0.12)',
      iconColor: 'var(--color-success)',
      borderColor: 'rgba(62,124,89,0.2)',
    },
    {
      label: 'Bản nháp',
      value: draftCourses.length.toString(),
      icon: EyeOff,
      iconBg: 'rgba(178,164,141,0.15)',
      iconColor: 'var(--color-muted)',
      borderColor: 'rgba(178,164,141,0.25)',
    },
    {
      label: 'Tổng số bài học',
      value: totalLessons.toString(),
      icon: PlaySquare,
      iconBg: 'rgba(27,42,74,0.07)',
      iconColor: 'var(--color-ink)',
      borderColor: 'rgba(27,42,74,0.12)',
    },
  ];

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Tổng quan quản trị</h1>
          <p className="text-xs text-ink-soft">Theo dõi khóa học, bài giảng và hoạt động của hệ thống.</p>
        </div>
        <Link
          to="/admin/courses/new"
          className="inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent/90 transition-all hover:scale-[1.02]"
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
              className="card p-6"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div>
                <span className="text-[10px] text-muted uppercase font-bold tracking-wider">{stat.label}</span>
                <p className="font-mono text-2xl font-bold text-ink mt-1">{stat.value}</p>
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                backgroundColor: stat.iconBg,
                border: `1px solid ${stat.borderColor}`,
                color: stat.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Recent courses table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Khóa học gần đây</h3>
            <Link to="/admin/courses" className="flex items-center gap-1 text-xs text-accent hover:underline font-semibold">
              Quản lý tất cả
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="card overflow-hidden border border-border">
            {courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-paper-dim border-b border-border text-ink-soft uppercase font-bold tracking-wider">
                      <th className="p-4">Khóa học</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4">Bài học</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentCourses.map((course) => {
                      const lessonCount = course.chapters.reduce(
                        (acc, ch) => acc + (ch.lessons?.length || 0), 0
                      );
                      return (
                        <tr key={course.id} className="hover:bg-paper-dim/30 transition-colors text-ink-soft">
                          <td className="p-4 font-bold text-ink max-w-xs">
                            <span className="line-clamp-1">{course.title}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              course.status === 'published'
                                ? 'bg-success-soft text-success'
                                : 'bg-paper-dim text-muted border border-border'
                            }`}>
                              {course.status === 'published' ? 'Đã đăng' : 'Nháp'}
                            </span>
                          </td>
                          <td className="p-4 font-mono">{lessonCount} bài</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <Link to={`/admin/courses/${course.id}/edit`} className="text-xs font-semibold text-accent hover:underline">
                                Sửa
                              </Link>
                              <Link to={`/admin/courses/${course.id}/content`} className="text-xs font-semibold text-ink-soft hover:underline">
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
                <BookOpen className="h-10 w-10 text-muted mb-4" />
                <p className="font-semibold text-sm">Chưa có khóa học nào</p>
                <p className="text-xs text-muted mt-1 mb-4">Bắt đầu bằng cách tạo khóa học đầu tiên của bạn.</p>
                <Link
                  to="/admin/courses/new"
                  className="inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent/90 transition-all"
                >
                  <FilePlus className="h-3.5 w-3.5" />
                  Tạo khóa học đầu tiên
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Tips panel */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Hướng dẫn biên soạn</h3>
          <div className="card p-6 space-y-4 text-xs text-ink-soft leading-relaxed">
            <p className="font-semibold text-ink text-sm">Quy trình tạo khóa học:</p>
            <ol className="list-decimal pl-4 space-y-2.5">
              <li>Tạo khóa học mới (tiêu đề, mô tả, danh mục)</li>
              <li>Vào <strong>Nội dung</strong> → Thêm các chương học</li>
              <li>Tải lên video / tài liệu cho từng chương</li>
              <li>Xuất bản khóa học để học viên có thể xem</li>
            </ol>
            <div
              className="rounded-lg p-4 text-xs"
              style={{ backgroundColor: 'rgba(224,115,74,0.08)', border: '1px solid rgba(224,115,74,0.2)' }}
            >
              <p className="font-bold text-accent mb-1">Tài khoản quản trị</p>
              <p className="text-muted">Email: <strong className="text-ink font-mono">admin@lms.pro</strong></p>
              <p className="text-muted">Mật khẩu: <strong className="text-ink font-mono">admin123</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
