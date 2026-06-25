import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';
import { useEffect } from 'react';

const courseFormSchema = z.object({
  title: z.string().min(5, 'Tên khóa học cần tối thiểu 5 ký tự'),
  shortDescription: z.string().min(20, 'Mô tả ngắn cần tối thiểu 20 ký tự').max(160, 'Mô tả ngắn không được vượt quá 160 ký tự'),
  fullDescription: z.string().min(50, 'Mô tả chi tiết cần tối thiểu 50 ký tự'),
  category: z.enum(['math', 'english', 'programming', 'it', 'softskill', 'certificate', 'ai', 'backend', 'frontend', 'devops']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  thumbnailUrl: z.string().url('URL không hợp lệ').or(z.literal('')),
  bannerUrl: z.string().url('URL không hợp lệ').or(z.literal('')),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export function AdminCourseEditPage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  
  const course = useCourseStore((s) => s.courses.find((c) => c.id === courseId));
  const updateCourse = useCourseStore((s) => s.updateCourse);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      fullDescription: '',
      category: 'programming',
      level: 'beginner',
      thumbnailUrl: '',
      bannerUrl: '',
    }
  });

  // Populate data when loaded
  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        shortDescription: course.shortDescription,
        fullDescription: course.fullDescription,
        category: course.category,
        level: course.level,
        thumbnailUrl: course.thumbnailUrl || '',
        bannerUrl: course.bannerUrl || '',
      });
    }
  }, [course, reset]);

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-ink">Không tìm thấy khóa học</h2>
        <p className="text-xs text-ink-soft mt-2">Khóa học có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/admin/courses" className="mt-4 inline-block text-xs text-accent hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  const onSubmit = async (data: CourseFormValues) => {
    try {
      updateCourse(course.id, {
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        category: data.category,
        level: data.level,
        thumbnailUrl: data.thumbnailUrl,
        bannerUrl: data.bannerUrl,
      });
      navigate('/admin/courses');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/courses" className="p-1.5 rounded-full hover:bg-paper-dim text-ink-soft transition-colors border border-border bg-paper-raised">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Chỉnh sửa thông tin khóa học</h1>
          <p className="text-xs text-ink-soft">Cập nhật hồ sơ thông tin và ảnh đại diện/banner cho khóa học.</p>
        </div>
      </div>

      <div className="card p-6 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Tên khóa học *
              </label>
              <input
                id="title"
                type="text"
                {...register('title')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
              {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
            </div>

            {/* Short Description */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="shortDescription" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Mô tả ngắn *
              </label>
              <input
                id="shortDescription"
                type="text"
                {...register('shortDescription')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
              {errors.shortDescription && <p className="text-xs text-danger">{errors.shortDescription.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Chuyên mục
              </label>
              <select
                id="category"
                {...register('category')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink-soft focus:outline-none cursor-pointer"
              >
                <option value="programming">Lập trình</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="devops">DevOps</option>
                <option value="ai">Trí tuệ nhân tạo (AI)</option>
                <option value="english">Tiếng Anh thương mại</option>
                <option value="it">Công nghệ thông tin</option>
                <option value="softskill">Kỹ năng mềm</option>
                <option value="certificate">Chứng chỉ</option>
                <option value="math">Toán học</option>
              </select>
              {errors.category && <p className="text-xs text-danger">{errors.category.message}</p>}
            </div>

            {/* Level */}
            <div className="space-y-1">
              <label htmlFor="level" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Cấp độ giảng dạy
              </label>
              <select
                id="level"
                {...register('level')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink-soft focus:outline-none cursor-pointer"
              >
                <option value="beginner">Cơ bản (Beginner)</option>
                <option value="intermediate">Trung bình (Intermediate)</option>
                <option value="advanced">Nâng cao (Advanced)</option>
              </select>
              {errors.level && <p className="text-xs text-danger">{errors.level.message}</p>}
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-1">
              <label htmlFor="thumbnailUrl" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                URL ảnh thumbnail (tùy chọn)
              </label>
              <input
                id="thumbnailUrl"
                type="url"
                {...register('thumbnailUrl')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                placeholder="https://..."
              />
              {errors.thumbnailUrl && <p className="text-xs text-danger">{errors.thumbnailUrl.message}</p>}
            </div>

            {/* Banner URL */}
            <div className="space-y-1">
              <label htmlFor="bannerUrl" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                URL ảnh banner (tùy chọn)
              </label>
              <input
                id="bannerUrl"
                type="url"
                {...register('bannerUrl')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                placeholder="https://..."
              />
              {errors.bannerUrl && <p className="text-xs text-danger">{errors.bannerUrl.message}</p>}
            </div>

            {/* Full description */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="fullDescription" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Mô tả chi tiết khóa học *
              </label>
              <textarea
                id="fullDescription"
                rows={6}
                {...register('fullDescription')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
              />
              {errors.fullDescription && <p className="text-xs text-danger">{errors.fullDescription.message}</p>}
            </div>

          </div>

          <div className="border-t border-border pt-6 flex justify-end gap-3">
            <Link
              to="/admin/courses"
              className="rounded border border-border bg-paper-raised px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-paper-dim transition-colors"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent/90 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
