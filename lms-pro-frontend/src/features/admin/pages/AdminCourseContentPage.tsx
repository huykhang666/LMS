import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  MoveUp, 
  MoveDown, 
  Video, 
  FileText, 
  Eye, 
  EyeOff, 
  Trash2,
  Upload,
  BookOpen
} from 'lucide-react';
import { useCourseStore, StoredChapter, StoredLesson } from '@/store/courseStore';

export function AdminCourseContentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = useCourseStore((s) => s.courses.find((c) => c.id === courseId));
  
  const addChapter = useCourseStore((s) => s.addChapter);
  const updateChapter = useCourseStore((s) => s.updateChapter);
  const deleteChapter = useCourseStore((s) => s.deleteChapter);
  const reorderChapters = useCourseStore((s) => s.reorderChapters);

  const addLesson = useCourseStore((s) => s.addLesson);
  const deleteLesson = useCourseStore((s) => s.deleteLesson);

  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<'video' | 'pdf' | 'doc'>('video');

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-ink">Không tìm thấy khóa học</h2>
        <p className="text-xs text-ink-soft mt-2">Khóa học có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/admin/courses" className="mt-4 inline-block text-xs text-accent hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  const chapters = course.chapters || [];

  // Default target chapter for uploads
  const targetChapterId = selectedChapterId || chapters[0]?.id || '';

  const handleAddChapter = () => {
    const title = prompt('Nhập tên chương học mới:');
    if (!title) return;

    const nextId = 'chapter-' + Date.now();
    const newChapter: StoredChapter = {
      id: nextId,
      title,
      order: chapters.length,
      isVisible: true,
      lessons: []
    };

    addChapter(course.id, newChapter);
    if (!selectedChapterId) {
      setSelectedChapterId(nextId);
    }
  };

  const moveChapter = (idx: number, direction: 'up' | 'down') => {
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= chapters.length) return;

    const newChapters = [...chapters];
    const temp = newChapters[idx];
    newChapters[idx] = newChapters[nextIdx];
    newChapters[nextIdx] = temp;
    
    // Recalculate orders
    const ordered = newChapters.map((c, i) => ({ ...c, order: i }));
    reorderChapters(course.id, ordered);
  };

  const toggleVisibility = (chapterId: string, isVisible: boolean) => {
    updateChapter(course.id, chapterId, { isVisible: !isVisible });
  };

  const handleDeleteChapter = (chapterId: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chương "${title}" và tất cả bài học bên trong?`)) {
      deleteChapter(course.id, chapterId);
      if (selectedChapterId === chapterId) {
        setSelectedChapterId('');
      }
    }
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChapterId) {
      alert('Vui lòng tạo ít nhất một chương học trước.');
      return;
    }

    const title = newLessonTitle.trim() || `Bài học mới tải lên ${Date.now()}`;

    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            
            const newLesson: StoredLesson = {
              id: 'lesson-' + Date.now(),
              title,
              order: (chapters.find(c => c.id === targetChapterId)?.lessons?.length || 0) + 1,
              durationLabel: lessonType === 'video' ? '15:00' : 'Tài liệu',
              type: lessonType,
              videoUrl: lessonType === 'video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : undefined,
              documentUrl: lessonType !== 'video' ? '#' : undefined
            };

            addLesson(course.id, targetChapterId, newLesson);
            setNewLessonTitle('');
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài học "${title}"?`)) {
      deleteLesson(course.id, chapterId, lessonId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/courses" className="p-1.5 rounded-full hover:bg-paper-dim text-ink-soft transition-colors border border-border bg-paper-raised">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Quản lý bài giảng: {course.title}</h1>
            <p className="text-xs text-ink-soft">Thêm chương học, tải lên video bài giảng hoặc đính kèm tài nguyên học tập.</p>
          </div>
        </div>
        
        <button
          onClick={handleAddChapter}
          className="inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-accent/90 transition-all hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Thêm chương học mới
        </button>
      </div>

      {/* Chapters list layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Chapters & Lessons manager (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {chapters.length > 0 ? (
            chapters
              .sort((a, b) => a.order - b.order)
              .map((chapter, idx) => (
                <div key={chapter.id} className="card p-6 space-y-4">
                  
                  {/* Chapter header panel */}
                  <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted font-bold">#{idx + 1}</span>
                      <h3 className="font-bold text-ink text-sm sm:text-base">{chapter.title}</h3>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => moveChapter(idx, 'up')} 
                        disabled={idx === 0}
                        title="Di chuyển lên"
                        className="p-1 rounded hover:bg-paper-dim text-ink-soft disabled:opacity-30"
                      >
                        <MoveUp className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => moveChapter(idx, 'down')} 
                        disabled={idx === chapters.length - 1}
                        title="Di chuyển xuống"
                        className="p-1 rounded hover:bg-paper-dim text-ink-soft disabled:opacity-30"
                      >
                        <MoveDown className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => toggleVisibility(chapter.id, chapter.isVisible)} 
                        title={chapter.isVisible ? "Ẩn với học viên" : "Hiển thị với học viên"}
                        className="p-1 rounded hover:bg-paper-dim text-ink-soft"
                      >
                        {chapter.isVisible ? <Eye className="h-3.5 w-3.5 text-success" /> : <EyeOff className="h-3.5 w-3.5 text-danger" />}
                      </button>
                      <button 
                        onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                        title="Xóa chương"
                        className="p-1 rounded hover:bg-paper-dim text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Chapter Lessons list */}
                  <div className="space-y-2 pl-4 border-l border-border">
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      chapter.lessons
                        .sort((a, b) => a.order - b.order)
                        .map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between text-xs sm:text-sm p-3 border border-border bg-paper-dim/30 rounded hover:bg-paper-dim/60 transition-colors">
                            <div className="flex items-center gap-3">
                              {lesson.type === 'video' ? (
                                <Video className="h-4 w-4 text-accent" />
                              ) : (
                                <FileText className="h-4 w-4 text-success" />
                              )}
                              <span className="font-medium text-ink-soft">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs text-muted font-semibold bg-paper-raised border border-border px-2 py-0.5 rounded">
                                {lesson.durationLabel}
                              </span>
                              <button 
                                onClick={() => handleDeleteLesson(chapter.id, lesson.id, lesson.title)}
                                className="p-1 rounded hover:bg-paper-dim text-danger"
                                title="Xóa bài học"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-muted italic">Chưa có bài học nào trong chương này.</p>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div className="card p-8 flex flex-col items-center justify-center text-center text-ink-soft">
              <BookOpen className="h-8 w-8 text-muted mb-3" />
              <p className="font-semibold text-sm">Chưa có chương học nào</p>
              <p className="text-xs text-muted mt-1">Hãy bấm nút "Thêm chương học mới" ở trên để bắt đầu xây dựng giáo án.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Video Resumable Uploader Mock (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="card p-6 space-y-4 bg-white shadow-sm rounded-2xl font-sans">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">Thêm nội dung bài học</h3>
            
            {chapters.length > 0 ? (
              <form onSubmit={handleSimulateUpload} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-ink-soft uppercase">Chọn chương học target</label>
                  <select
                    value={targetChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-ink-soft focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none transition-all cursor-pointer font-bold"
                  >
                    {chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>{ch.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-ink-soft uppercase">Loại bài học</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLessonType('video')}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-extrabold transition-all hover:scale-[1.01] ${
                        lessonType === 'video'
                          ? 'bg-accent text-white border-accent shadow-xs'
                          : 'bg-white text-ink-soft border-slate-350 hover:bg-slate-50'
                      }`}
                    >
                      Video bài giảng
                    </button>
                    <button
                      type="button"
                      onClick={() => setLessonType('pdf')}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-extrabold transition-all hover:scale-[1.01] ${
                        lessonType === 'pdf'
                          ? 'bg-accent text-white border-accent shadow-xs'
                          : 'bg-white text-ink-soft border-slate-350 hover:bg-slate-50'
                      }`}
                    >
                      Tài liệu PDF
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-extrabold text-ink-soft uppercase">Tiêu đề bài học</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Bài 1: Setup dự án"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-ink focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none transition-all"
                  />
                </div>

                {!isUploading ? (
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-3 text-xs font-bold text-white shadow-md shadow-accent/15 hover:bg-accent-deep hover:scale-[1.01] transition-all"
                  >
                    <Upload className="h-4.5 w-4.5" />
                    Tải lên & Lưu bài học
                  </button>
                ) : (
                  <div className="border border-border rounded-xl flex flex-col items-center justify-center text-center p-4 bg-slate-50 space-y-3 shadow-xs">
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-[10px] text-ink-soft font-mono font-bold">
                        <span>Đang xử lý tải lên...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white rounded border border-border overflow-hidden">
                        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <p className="text-xs text-muted italic">Vui lòng tạo chương học trước để mở khóa chức năng đăng tải bài giảng.</p>
            )}

            <p className="text-[10px] text-muted leading-normal">
              * Hệ thống hỗ trợ uploadBytesResumable, tự động resume tiến độ nếu mạng chập chờn.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
