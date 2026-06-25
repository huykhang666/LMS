import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { BookOpen, Award, Clock, Flame, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/shared/components/ui/StatCard';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { cn } from '@/shared/utils/cn';

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* Profile Header Block */}
      <div 
        className="border border-border bg-paper-raised rounded-md p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-200"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid || 'guest'}`}
            alt="Avatar"
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-border bg-paper object-cover flex-shrink-0"
          />
          <div className="space-y-2">
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-ink leading-tight">
              Chào mừng quay lại, {user?.displayName || 'Học viên'}
            </h1>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] font-bold text-ink bg-accent-soft border border-accent/20 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Cấp độ {stats.level}
              </span>
              <span className="text-xs font-bold text-muted font-mono">
                {stats.xp} XP tích lũy
              </span>
            </div>
          </div>
        </div>

        {/* Streak Stamp */}
        <div className={`flex items-center gap-3 border rounded-md px-5 py-3 shrink-0 transition-all duration-200 ${
          stats.streakDays > 0 
            ? 'bg-accent-soft/30 border-accent text-accent' 
            : 'bg-paper-dim border-border text-muted'
        }`}>
          <Flame className={cn("h-6 w-6", stats.streakDays > 0 ? 'text-accent fill-accent' : 'text-muted')} />
          <div className="space-y-0.5">
            <div className="font-mono text-xl font-semibold leading-none">
              {stats.streakDays} ngày
            </div>
            <div className="text-[10px] text-muted font-bold uppercase tracking-wider">
              Học liên tục
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          label="Khóa đang học" 
          value={stats.inProgressCount} 
          icon={BookOpen} 
          accented={stats.inProgressCount > 0} 
        />
        <StatCard 
          label="Khóa hoàn thành" 
          value={stats.completedCount} 
          icon={Award} 
          accented={stats.completedCount > 0} 
        />
        <StatCard 
          label="Thời gian học tập" 
          value={stats.totalLearningHours} 
          icon={Clock} 
          accented={totalCourses > 0} 
        />
      </div>

      {/* Continue learning rail */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink leading-tight">
          Tiếp tục hành trình học tập
        </h2>

        {inProgressEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressEnrollments.map((item) => (
              <div 
                key={item.id} 
                className="border border-border bg-paper-raised rounded-md p-4 flex items-center gap-4 transition-all group duration-200"
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.courseTitle}
                  className="w-24 sm:w-28 aspect-video object-cover rounded-lg border border-border bg-paper-dim flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0 flex flex-col gap-3 justify-center">
                  <h3 className="text-sm font-semibold text-ink truncate leading-tight group-hover:text-accent transition-colors">
                    <Link to={`/courses/${item.slug}`} className="hover:underline">
                      {item.courseTitle}
                    </Link>
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-muted">
                      <span className="truncate max-w-[70%] font-medium">
                        Đang học: {item.lastLessonTitle}
                      </span>
                      <span className="font-mono font-bold text-ink">{item.completionPercent}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-paper rounded-full overflow-hidden border border-border">
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
                  className="w-10 h-10 rounded-full bg-accent hover:bg-accent/90 flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-white pl-0.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Bạn chưa tham gia khóa học nào"
            description="Chọn khóa học phù hợp tại thư viện để bắt đầu hành trình tích lũy điểm kinh nghiệm và duy trì chuỗi học tập."
            actionLabel="Khám phá khóa học ngay →"
            actionLink="/courses"
            variant="learner"
          />
        )}
      </div>

    </div>
  );
}
