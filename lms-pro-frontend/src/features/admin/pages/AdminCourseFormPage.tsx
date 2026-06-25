import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';
import { useAuthStore } from '@/store/authStore';

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function AdminCourseFormPage() {
  const navigate = useNavigate();
  const addCourse = useCourseStore((s) => s.addCourse);
  const { user } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CourseFormValues>({
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

  const onSubmit = async (data: CourseFormValues) => {
    const id = 'course-' + Date.now();
    const slug = slugify(data.title) || id;
    addCourse({
      id,
      slug,
      title: data.title,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      category: data.category,
      level: data.level,
      status: 'draft',
      thumbnailUrl: data.thumbnailUrl || '',
      bannerUrl: data.bannerUrl || '',
      createdBy: user?.uid || 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chapters: [],
    });
    navigate('/admin/courses');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/courses" className="p-1.5 rounded-full hover:bg-paper-dim text-ink-soft transition-colors border border-border bg-paper-raised">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Thêm khóa học mới</h1>
          <p className="text-xs text-ink-soft">Tạo mới hồ sơ thông tin cho khóa học. Sau khi lưu, khóa học sẽ ở trạng thái <strong>Bản nháp</strong>.</p>
        </div>
      </div>

      <div className="card p-6 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Title */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Tên khóa học *</label>
              <input id="title" type="text" {...register('title')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                placeholder="Ví dụ: Lập trình ReactJS chuyên nghiệp..." />
              {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
            </div>

            {/* Short description */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="shortDescription" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Mô tả ngắn *</label>
              <input id="shortDescription" type="text" {...register('shortDescription')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                placeholder="Mô tả tóm tắt nội dung (20–160 ký tự)" />
              {errors.shortDescription && <p className="text-xs text-danger">{errors.shortDescription.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Chuyên mục</label>
              <select id="category" {...register('category')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink-soft focus:outline-none cursor-pointer">
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
              <label htmlFor="level" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Cấp độ giảng dạy</label>
              <select id="level" {...register('level')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink-soft focus:outline-none cursor-pointer">
                <option value="beginner">Cơ bản (Beginner)</option>
                <option value="intermediate">Trung bình (Intermediate)</option>
                <option value="advanced">Nâng cao (Advanced)</option>
              </select>
              {errors.level && <p className="text-xs text-danger">{errors.level.message}</p>}
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-1">
              <label htmlFor="thumbnailUrl" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">URL ảnh thumbnail (tùy chọn)</label>
              <input id="thumbnailUrl" type="url" {...register('thumbnailUrl')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                placeholder="https://..." />
              {errors.thumbnailUrl && <p className="text-xs text-danger">{errors.thumbnailUrl.message}</p>}
            </div>

            {/* Banner URL */}
            <div className="space-y-1">
              <label htmlFor="bannerUrl" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">URL ảnh banner (tùy chọn)</label>
              <input id="bannerUrl" type="url" {...register('bannerUrl')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                placeholder="https://..." />
              {errors.bannerUrl && <p className="text-xs text-danger">{errors.bannerUrl.message}</p>}
            </div>

            {/* Full description */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="fullDescription" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Mô tả chi tiết khóa học *</label>
              <textarea id="fullDescription" rows={6} {...register('fullDescription')}
                className="w-full rounded border border-border bg-paper-dim px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                placeholder="Trình bày chi tiết về giáo án học tập, các kết quả học viên sẽ đạt được sau khóa học..." />
              {errors.fullDescription && <p className="text-xs text-danger">{errors.fullDescription.message}</p>}
            </div>

          </div>

          <div className="border-t border-border pt-6 flex justify-end gap-3">
            <Link to="/admin/courses" className="rounded border border-border bg-paper-raised px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-paper-dim transition-colors">
              Hủy
            </Link>
            <button type="submit" disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent/90 transition-all hover:scale-[1.02] disabled:opacity-50">
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Đang lưu...' : 'Lưu khóa học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
