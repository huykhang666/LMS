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
          <h1 className="font-display text-2xl font-semibold text-slate-900 tracking-tight">Quản lý khóa học</h1>
          <p className="text-xs text-slate-500">Xem danh sách, quản lý cấu trúc bài giảng và xuất bản các khóa học của hệ thống.</p>
        </div>
        <Link
          to="/admin/courses/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#191919] hover:bg-black text-white font-semibold px-4 py-2.5 text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
          Thêm khóa học mới
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-550 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                  <th className="p-4 pl-6">Khóa học</th>
                  <th className="p-4">Chuyên mục</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Cấu trúc bài học</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Title and slug */}
                    <td className="p-4 pl-6">
                      <p className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">{course.title}</p>
                      <span className="text-[9px] text-slate-450 text-slate-400 font-mono block mt-0.5">{course.slug}</span>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-medium text-slate-700">
                      <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600">
                        {categoryLabels[course.category] || course.category}
                      </span>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        title="Bấm để đổi trạng thái"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                          course.status === 'published' 
                            ? 'bg-indigo-50 border border-indigo-100 text-accent hover:bg-indigo-100/70' 
                            : 'bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200/70'
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
                    <td className="p-4 font-mono text-slate-600">
                      <strong className="text-slate-900 font-semibold">{course.chapters?.length || 0}</strong> chương / <strong className="text-slate-900 font-semibold">{getLessonsCount(course)}</strong> bài học
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
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                        >
                          Bài giảng
                        </Link>
                        <button 
                          onClick={() => handleDelete(course.id, course.title)}
                          className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
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
          <div className="border-dashed border-2 border-slate-200 bg-white rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-900 text-sm">Chưa có khoá học nào được tải lên</p>
            <p className="text-xs text-slate-500 mt-1 mb-5">Bạn chưa soạn thảo khóa học nào trong hệ thống.</p>
            <Link
              to="/admin/courses/new"
              className="inline-flex items-center gap-1.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs"
            >
              Thêm khóa học đầu tiên ↗
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
