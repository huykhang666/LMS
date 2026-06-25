import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { BookOpen, Award, Clock, Flame, Play } from 'lucide-react';
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

  const statsList = [
    { 
      icon: BookOpen, 
      label: 'Khóa đang học', 
      value: stats.inProgressCount, 
      highlighted: stats.inProgressCount > 0 
    },
    { 
      icon: Award, 
      label: 'Khóa hoàn thành', 
      value: stats.completedCount, 
      highlighted: stats.completedCount > 0 
    },
    { 
      icon: Clock, 
      label: 'Thời gian học tập', 
      value: stats.totalLearningHours, 
      highlighted: totalCourses > 0 
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* Profile Header Block */}
      <div 
        className="border border-slate-200 bg-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-200"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid || 'guest'}`}
            alt="Avatar"
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-slate-200 bg-slate-50 object-cover flex-shrink-0"
          />
          <div className="space-y-2">
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 leading-tight">
              Chào mừng quay lại, {user?.displayName || 'Học viên'}
            </h1>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-200/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Cấp độ {stats.level}
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {stats.xp} XP tích lũy
              </span>
            </div>
          </div>
        </div>

        {/* Streak Stamp */}
        <div className={`flex items-center gap-3 border rounded-xl px-5 py-3 shrink-0 transition-all duration-200 ${
          stats.streakDays > 0 
            ? 'bg-indigo-50/50 border-indigo-200 text-indigo-650' 
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <Flame className={`h-6 w-6 ${stats.streakDays > 0 ? 'text-indigo-600 fill-indigo-600' : 'text-slate-400'}`} />
          <div className="space-y-0.5">
            <div className={`font-mono text-xl font-semibold leading-none ${stats.streakDays > 0 ? 'text-indigo-650' : 'text-slate-700'}`}>
              {stats.streakDays} ngày
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Học liên tục
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statsList.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-6 border rounded-xl flex flex-col justify-between h-36 transition-all duration-200 ${
                stat.highlighted
                  ? 'bg-indigo-50/50 border-[#4F46E5]/30'
                  : 'bg-[#F8F9FB] border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4.5 w-4.5 ${stat.highlighted ? 'text-indigo-650' : 'text-slate-400'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${stat.highlighted ? 'text-indigo-650' : 'text-slate-400'}`}>
                  {stat.label}
                </span>
              </div>
              <p className={`font-mono text-3xl font-semibold leading-none mt-4 ${stat.highlighted ? 'text-indigo-650' : 'text-slate-900'}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Continue learning rail */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold text-slate-900 leading-tight">
          Tiếp tục hành trình học tập
        </h2>

        {inProgressEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressEnrollments.map((item) => (
              <div 
                key={item.id} 
                className="border border-slate-200 bg-white rounded-xl p-4 flex items-center gap-4 transition-all group duration-200"
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.courseTitle}
                  className="w-24 sm:w-28 aspect-video object-cover rounded-lg border border-slate-200 bg-slate-50 flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0 flex flex-col gap-3 justify-center">
                  <h3 className="text-sm font-semibold text-slate-900 truncate leading-tight group-hover:text-indigo-650 transition-colors">
                    <Link to={`/courses/${item.slug}`} className="hover:underline">
                      {item.courseTitle}
                    </Link>
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span className="truncate max-w-[70%] font-medium">
                        Đang học: {item.lastLessonTitle}
                      </span>
                      <span className="font-mono font-bold">{item.completionPercent}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div 
                        style={{ width: `${item.completionPercent}%` }} 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300" 
                      />
                    </div>
                  </div>
                </div>

                {/* Play Button */}
                <Link
                  to={`/app/learn/${item.courseId}/${item.firstLessonId}`}
                  className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-755 flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-white pl-0.5" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-dashed border-2 border-slate-200 bg-white rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-900 mb-1">
              Chưa có khóa học hoạt động
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Bạn chưa tham gia khóa học nào. Hãy chọn khóa học phù hợp tại thư viện để bắt đầu hành trình học tập.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#191919] hover:bg-black text-white font-semibold px-4 py-2.5 text-xs transition-colors cursor-pointer"
            >
              Khám phá khóa học ngay ↗
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
