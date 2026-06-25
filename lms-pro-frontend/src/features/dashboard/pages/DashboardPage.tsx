import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { BookOpen, Award, Clock, Flame, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { user } = useAuthStore();
  const courses = useCourseStore((s) => s.courses).filter((c) => c.status === 'published');

  const totalCourses = courses.length;

  const stats = {
    inProgressCount: totalCourses > 0 ? 1 : 0,
    completedCount: 0,
    totalLearningHours: totalCourses > 0 ? '1 giờ 15 phút' : '0 phút',
    streakDays: totalCourses > 0 ? 1 : 0,
    xp: totalCourses > 0 ? 100 : 0,
    level: totalCourses > 0 ? 1 : 0
  };

  // Safe mock enrollments derived from the actual store
  const inProgressEnrollments = courses.slice(0, 1).map((course) => {
    const firstChapter = course.chapters?.[0];
    const firstLesson = firstChapter?.lessons?.[0];
    return {
      id: `enroll-${course.id}`,
      courseId: course.id,
      courseTitle: course.title,
      slug: course.slug,
      completionPercent: 15,
      thumbnailUrl: course.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop',
      lastLessonTitle: firstLesson?.title || 'Chưa bắt đầu',
      firstLessonId: firstLesson?.id || 'lesson-1'
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Profile Header Block */}
      <div 
        style={{
          background: 'var(--color-paper-raised)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
        }}
        className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-[0_8px_30px_rgba(27,42,74,0.04)] transition-shadow"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid || 'guest'}`}
            alt="Avatar"
            style={{ border: '2px solid var(--color-border)' }}
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-paper object-cover flex-shrink-0"
          />
          <div className="space-y-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight">
              Chào mừng quay lại, {user?.displayName || 'Học viên'}
            </h1>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] font-bold text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Cấp độ {stats.level}
              </span>
              <span className="text-xs font-bold text-muted font-mono">
                {stats.xp} XP tích lũy
              </span>
            </div>
          </div>
        </div>

        {/* Streak Stamp */}
        <div className="flex items-center gap-3 bg-accent/5 border border-accent/15 rounded-2xl px-5 py-3 shrink-0">
          <Flame className="h-6 w-6 text-accent fill-accent" />
          <div className="space-y-0.5">
            <div className="font-mono text-xl font-extrabold text-ink leading-none">
              {stats.streakDays} ngày
            </div>
            <div className="text-[9px] text-ink-soft font-bold uppercase tracking-wider">
              Học liên tục
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: BookOpen, label: 'Khóa đang học', value: stats.inProgressCount, color: 'var(--color-accent)' },
          { icon: Award, label: 'Khóa hoàn thành', value: stats.completedCount, color: 'var(--color-success)' },
          { icon: Clock, label: 'Thời gian học tập', value: stats.totalLearningHours, color: 'var(--color-ink)' },
        ].map((item, idx) => (
          <div 
            key={idx} 
            style={{
              background: 'var(--color-paper-raised)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 4px 16px rgba(27,42,74,0.02)'
            }}
            className="rounded-2xl p-6 flex items-center gap-4 hover:shadow-[0_8px_30px_rgba(27,42,74,0.05)] hover:border-accent/10 transition-all group duration-300"
          >
            <div 
              style={{
                backgroundColor: `${item.color}10`,
                border: `1px solid ${item.color}25`,
                color: item.color,
              }}
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
            >
              <item.icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block leading-none">
                {item.label}
              </span>
              <p className="font-mono text-lg font-bold text-ink leading-tight">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Continue learning rail */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-ink pl-1">
          Tiếp tục hành trình học tập
        </h2>

        {inProgressEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressEnrollments.map((item) => (
              <div 
                key={item.id} 
                style={{
                  background: 'var(--color-paper-raised)',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
                }}
                className="rounded-2xl p-4 flex items-center gap-4 hover:shadow-[0_8px_30px_rgba(27,42,74,0.05)] transition-all group duration-300"
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.courseTitle}
                  style={{ border: '1px solid var(--color-border)' }}
                  className="w-24 sm:w-28 aspect-video object-cover rounded-xl bg-paper flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0 flex flex-col gap-3 justify-center">
                  <h3 className="text-sm font-bold text-ink truncate leading-tight group-hover:text-accent transition-colors">
                    <Link to={`/courses/${item.slug}`} className="hover:underline">
                      {item.courseTitle}
                    </Link>
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-ink-soft">
                      <span className="truncate max-w-[70%] font-medium">
                        Đang học: {item.lastLessonTitle}
                      </span>
                      <span className="font-mono font-bold">{item.completionPercent}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ border: '1px solid var(--color-border)' }} className="h-2.5 bg-paper rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${item.completionPercent}%` }} 
                        className="h-full bg-accent rounded-full transition-all duration-300" 
                      />
                    </div>
                  </div>
                </div>

                {/* Play Button */}
                <Link
                  to={`/app/learn/${item.courseId}/${item.firstLessonId}`}
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    boxShadow: '0 4px 10px rgba(224,115,74,0.25)'
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-white pl-0.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div 
            style={{
              background: 'var(--color-paper-raised)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
            }}
            className="rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto"
          >
            <div className="p-3 bg-paper border border-border rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-muted" />
            </div>
            <h3 className="font-display text-base font-bold text-ink mb-1">
              Chưa có khóa học hoạt động
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed mb-6">
              Bạn chưa tham gia khóa học nào. Hãy chọn khóa học phù hợp tại thư viện để bắt đầu hành trình tích lũy điểm kinh nghiệm và duy trì chuỗi học tập.
            </p>
            <Link
              to="/courses"
              style={{
                backgroundColor: 'var(--color-accent)',
                boxShadow: '0 4px 12px rgba(224,115,74,0.25)'
              }}
              className="rounded-xl text-white text-xs font-bold px-5 py-2.5 hover:bg-accent/95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Khám phá khóa học ngay →
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
