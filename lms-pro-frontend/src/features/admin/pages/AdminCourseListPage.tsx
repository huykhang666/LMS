import { Plus, Edit, BookOpen, Trash2, Eye, EyeOff } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Quản lý khóa học</h1>
          <p className="text-xs text-ink-soft">Danh sách tất cả các khóa học do quản trị viên tải lên.</p>
        </div>
        <Link
          to="/admin/courses/new"
          className="inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent/90 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Thêm khóa học mới
        </Link>
      </div>

      <div className="card overflow-hidden">
        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paper-dim border-b border-border text-ink-soft uppercase font-bold tracking-wider">
                  <th className="p-4">Khóa học</th>
                  <th className="p-4">Chuyên mục</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Cấu trúc</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-paper-dim/30 transition-colors text-ink-soft">
                    <td className="p-4">
                      <p className="font-bold text-ink text-sm">{course.title}</p>
                      <span className="text-[10px] text-muted font-mono">{course.slug}</span>
                    </td>
                    <td className="p-4 font-medium">{categoryLabels[course.category] || course.category}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        title="Click để đổi trạng thái"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase transition-all ${
                          course.status === 'published' 
                            ? 'bg-success-soft text-success border border-success/20' 
                            : 'bg-paper-dim text-muted border border-border'
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
                    <td className="p-4 font-mono text-muted">
                      {course.chapters?.length || 0} chương / {getLessonsCount(course)} bài
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link 
                          to={`/admin/courses/${course.id}/edit`} 
                          className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Sửa
                        </Link>
                        <Link 
                          to={`/admin/courses/${course.id}/content`} 
                          className="flex items-center gap-1 text-xs font-semibold text-ink-soft hover:underline"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          Bài giảng
                        </Link>
                        <button 
                          onClick={() => handleDelete(course.id, course.title)}
                          className="flex items-center gap-1 text-xs font-semibold text-danger hover:underline"
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
          <div className="p-12 flex flex-col items-center justify-center text-center text-ink-soft">
            <BookOpen className="h-8 w-8 text-muted mb-3" />
            <p className="font-semibold text-sm">Chưa có khóa học nào</p>
            <p className="text-xs text-muted mt-1">Hãy bấm nút "Thêm khóa học mới" để tải lên bài giảng đầu tiên.</p>
          </div>
        )}
      </div>
    </div>
  );
}
