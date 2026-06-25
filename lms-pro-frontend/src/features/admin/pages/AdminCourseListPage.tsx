import { Plus, Edit, BookOpen, Trash2, Eye, EyeOff, FilePlus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCourseStore, StoredCourse } from '@/store/courseStore';

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
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-ink">Quản lý khóa học</h1>
          <p className="text-xs text-ink-soft">Xem danh sách, quản lý cấu trúc bài giảng và xuất bản các khóa học của hệ thống.</p>
        </div>
        <Link
          to="/admin/courses/new"
          style={{
            backgroundColor: 'var(--color-accent)',
            boxShadow: '0 4px 14px rgba(224,115,74,0.3)'
          }}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white hover:bg-accent/95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Thêm khóa học mới
        </Link>
      </div>

      {/* Table Container */}
      <div 
        style={{
          background: 'var(--color-paper-raised)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
        }}
        className="overflow-hidden animate-in slide-in-from-bottom-2 duration-300"
      >
        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paper border-b border-border text-ink-soft uppercase font-bold tracking-wider">
                  <th className="p-4 pl-6">Khóa học</th>
                  <th className="p-4">Chuyên mục</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Cấu trúc bài học</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-paper/40 transition-colors text-ink-soft">
                    
                    {/* Title and slug */}
                    <td className="p-4 pl-6">
                      <p className="font-bold text-ink text-sm leading-tight">{course.title}</p>
                      <span className="text-[10px] text-muted font-mono block mt-0.5">{course.slug}</span>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-bold text-ink/80">
                      <span className="inline-flex px-2 py-0.5 rounded-lg bg-paper border border-border font-medium text-[10px]">
                        {categoryLabels[course.category] || course.category}
                      </span>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        title="Bấm để đổi trạng thái"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all duration-200 border cursor-pointer ${
                          course.status === 'published' 
                            ? 'bg-success-soft/10 text-success border-success/20 hover:bg-success-soft/20' 
                            : 'bg-paper text-muted border-border hover:bg-paper-dim'
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
                      <strong className="text-ink">{course.chapters?.length || 0}</strong> chương / <strong className="text-ink">{getLessonsCount(course)}</strong> bài học
                    </td>

                    {/* Actions buttons */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link 
                          to={`/admin/courses/${course.id}/edit`} 
                          className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent/80 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Sửa
                        </Link>
                        <Link 
                          to={`/admin/courses/${course.id}/content`} 
                          className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft hover:text-ink transition-colors"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-muted" />
                          Bài giảng
                        </Link>
                        <button 
                          onClick={() => handleDelete(course.id, course.title)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-danger hover:text-danger/80 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
          <div className="p-16 flex flex-col items-center justify-center text-center text-ink-soft">
            <div className="p-4 rounded-full bg-paper border border-border mb-4">
              <BookOpen className="h-8 w-8 text-muted" />
            </div>
            <p className="font-bold text-sm text-ink">Chưa có khóa học nào được tải lên</p>
            <p className="text-xs text-muted mt-1 mb-4">Bạn chưa soạn thảo khóa học nào trong hệ thống.</p>
            <Link
              to="/admin/courses/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-accent/95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <FilePlus className="h-4 w-4" />
              Thêm khóa học đầu tiên
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
