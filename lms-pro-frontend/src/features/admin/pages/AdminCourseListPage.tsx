import { Plus, BookOpen, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCourseStore, StoredCourse } from '@/store/courseStore';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { cn } from '@/shared/utils/cn';

const categoryLabels: Record<string, string> = {
  math: 'Toán học',
  english: 'Tiếng Anh',
  programming: 'Lập trình',
  it: 'Công nghệ thông tin',
  softskill: 'Kỹ năng mềm',
  certificate: 'Chứng chỉ',
  ai: 'Trí tuệ nhân tạo',
  backend: 'Backend',
  frontend: 'Frontend',
  devops: 'DevOps',
};

export function AdminCourseListPage() {
  const courses = useCourseStore((s) => s.courses);
  const deleteCourse = useCourseStore((s) => s.deleteCourse);
  const updateCourse = useCourseStore((s) => s.updateCourse);

  const getLessonsCount = (course: StoredCourse) => {
    return course.chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0);
  };

  const handleTogglePublish = (course: StoredCourse) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    updateCourse(course.id, { status: nextStatus });
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${title}"?`)) {
      deleteCourse(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-semibold text-ink tracking-tight">Quản lý khóa học</h1>
          <p className="text-xs text-muted">Xem danh sách, quản lý cấu trúc bài giảng và xuất bản các khóa học của hệ thống.</p>
        </div>
        <Link
          to="/admin/courses/new"
          className="bg-ink hover:bg-ink-soft text-paper-raised font-body font-medium text-sm px-4 py-2.5 rounded-md flex items-center gap-2 flex-shrink-0 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm khóa học mới
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-paper-raised border border-border rounded-md overflow-hidden">
        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paper border-b border-border text-muted uppercase font-semibold tracking-wide text-xs">
                  <th className="p-4 pl-6">Khóa học</th>
                  <th className="p-4">Chuyên mục</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Cấu trúc bài học</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-ink-soft">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-paper/50 transition-colors">
                    
                    {/* Title and slug */}
                    <td className="p-4 pl-6">
                      <p className="font-semibold text-ink text-sm sm:text-base leading-tight">{course.title}</p>
                      <span className="text-[9px] text-muted font-mono block mt-0.5">{course.slug}</span>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-medium text-ink-soft">
                      <span className="inline-flex px-2 py-0.5 rounded-sm bg-paper-dim border border-border text-[10px] font-semibold text-ink-soft">
                        {categoryLabels[course.category] || course.category}
                      </span>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        title="Bấm để đổi trạng thái"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer border ${
                          course.status === 'published' 
                            ? 'bg-success-soft border-success/15 text-success hover:bg-success-soft/80' 
                            : 'bg-paper-dim border-border text-ink-soft hover:bg-paper-dim/80'
                        }`}
                      >
                        {course.status === 'published' ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Đã đăng
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Bản nháp
                          </>
                        )}
                      </button>
                    </td>

                    {/* Course Metrics */}
                    <td className="p-4 font-mono text-ink-soft">
                      <strong className="text-ink font-semibold">{course.chapters?.length || 0}</strong> chương / <strong className="text-ink font-semibold">{getLessonsCount(course)}</strong> bài học
                    </td>

                    {/* Actions buttons */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link 
                          to={`/admin/courses/${course.id}/edit`} 
                          className="text-xs font-semibold text-accent hover:underline"
                        >
                          Sửa
                        </Link>
                        <Link 
                          to={`/admin/courses/${course.id}/content`} 
                          className="text-xs font-semibold text-ink-soft hover:text-ink"
                        >
                          Bài giảng
                        </Link>
                        <button 
                          onClick={() => handleDelete(course.id, course.title)}
                          className="text-xs font-semibold text-danger hover:underline cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Chưa có khóa học nào được tạo"
            description="Soạn khóa học đầu tiên để bắt đầu xây dựng nội dung cho hệ thống."
            actionLabel="Thêm khóa học đầu tiên"
            actionLink="/admin/courses/new"
            variant="admin"
          />
        )}
      </div>

    </div>
  );
}
