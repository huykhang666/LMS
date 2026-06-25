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
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-extrabold text-ink tracking-tight">Quản lý khóa học</h1>
          <p className="text-xs text-muted">Xem danh sách, quản lý cấu trúc bài giảng và xuất bản các khóa học của hệ thống.</p>
        </div>
        <Link
          to="/admin/courses/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent hover:bg-accent-deep text-white font-extrabold px-5 py-3 text-xs shadow-md shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
          Thêm khóa học mới
        </Link>
      </div>

      {/* Table Container */}
      <div 
        className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300"
      >
        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-border text-ink-soft uppercase font-extrabold tracking-wider text-xs">
                  <th className="p-5 pl-6">Khóa học</th>
                  <th className="p-5">Chuyên mục</th>
                  <th className="p-5">Trạng thái</th>
                  <th className="p-5">Cấu trúc bài học</th>
                  <th className="p-5 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/40 transition-colors text-ink-soft">
                    
                    {/* Title and slug */}
                    <td className="p-5 pl-6">
                      <p className="font-extrabold text-ink text-sm sm:text-base leading-tight">{course.title}</p>
                      <span className="text-[10px] text-muted font-mono block mt-1">{course.slug}</span>
                    </td>

                    {/* Category */}
                    <td className="p-5 font-bold text-ink/85">
                      <span className="inline-flex px-3 py-1 rounded-xl bg-slate-100 border border-slate-200/50 font-bold text-[10px] text-slate-700">
                        {categoryLabels[course.category] || course.category}
                      </span>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="p-5">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        title="Bấm để đổi trạng thái"
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase transition-all duration-200 cursor-pointer text-white shadow-xs ${
                          course.status === 'published' 
                            ? 'bg-success hover:bg-success/90' 
                            : 'bg-slate-400 hover:bg-slate-500'
                        }`}
                      >
                        {course.status === 'published' ? (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            Đã đăng
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            Bản nháp
                          </>
                        )}
                      </button>
                    </td>

                    {/* Course Metrics */}
                    <td className="p-5 font-mono text-ink-soft">
                      <strong className="text-ink font-extrabold text-sm">{course.chapters?.length || 0}</strong> chương / <strong className="text-ink font-extrabold text-sm">{getLessonsCount(course)}</strong> bài học
                    </td>

                    {/* Actions buttons */}
                    <td className="p-5 pr-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/admin/courses/${course.id}/edit`} 
                          className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-deep transition-all bg-accent/5 px-2.5 py-1.5 rounded-lg border border-accent/15"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Sửa
                        </Link>
                        <Link 
                          to={`/admin/courses/${course.id}/content`} 
                          className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft hover:text-ink transition-all bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-muted" />
                          Bài giảng
                        </Link>
                        <button 
                          onClick={() => handleDelete(course.id, course.title)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-danger hover:bg-danger/5 px-2.5 py-1.5 rounded-lg border border-danger/10 cursor-pointer"
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
            <div className="p-4 rounded-full bg-slate-50 border border-border mb-4">
              <BookOpen className="h-10 w-10 text-muted" />
            </div>
            <p className="font-extrabold text-base text-ink">Chưa có khóa học nào được tải lên</p>
            <p className="text-xs text-muted mt-1 mb-6">Bạn chưa soạn thảo khóa học nào trong hệ thống.</p>
            <Link
              to="/admin/courses/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-accent/95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <FilePlus className="h-4.5 w-4.5" />
              Thêm khóa học đầu tiên
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
