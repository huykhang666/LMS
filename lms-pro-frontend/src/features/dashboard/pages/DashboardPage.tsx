import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { BookOpen, Award, Clock, Flame, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { user } = useAuthStore();
  const courses = useCourseStore((s) => s.courses).filter((c) => c.status === 'published');

  // Count total completed and in progress courses
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Profile Header Block */}
      <div style={{
        background: 'var(--color-paper-raised)',
        border: '1px solid var(--color-border)',
        borderRadius: 20,
        padding: '1.75rem 2rem',
        boxShadow: '0 8px 30px rgba(27,42,74,0.04)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.uid || 'guest'}`}
            alt="Avatar"
            style={{
              height: 72, width: 72, borderRadius: '50%',
              border: '2px solid var(--color-border)',
              backgroundColor: 'var(--color-paper-dim)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-ink)' }}>
              Chào mừng quay lại, {user?.displayName || 'Học viên'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                color: 'var(--color-accent)', backgroundColor: 'rgba(224,115,74,0.12)',
                border: '1px solid rgba(224,115,74,0.25)', padding: '2px 8px', borderRadius: 4
              }}>
                Cấp độ {stats.level}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                {stats.xp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Streak Stamp */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          backgroundColor: 'rgba(224,115,74,0.06)',
          border: '1px solid rgba(224,115,74,0.18)',
          borderRadius: 14, padding: '12px 18px',
        }}>
          <Flame size={22} style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.1 }}>
              {stats.streakDays} ngày
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-ink-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
              Học tập liên tiếp
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: BookOpen, label: 'Khóa đang học', value: stats.inProgressCount, color: 'var(--color-accent)' },
          { icon: Award, label: 'Khóa hoàn thành', value: stats.completedCount, color: 'var(--color-success)' },
          { icon: Clock, label: 'Thời gian học tập', value: stats.totalLearningHours, color: 'var(--color-ink)' },
        ].map((item, idx) => (
          <div key={idx} style={{
            background: 'var(--color-paper-raised)',
            border: '1px solid var(--color-border)',
            borderRadius: 16,
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: '0 4px 16px rgba(27,42,74,0.02)'
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: `${item.color}12`,
              border: `1px solid ${item.color}25`,
              color: item.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <item.icon size={20} />
            </div>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.label}
              </span>
              <p style={{
                fontFamily: typeof item.value === 'number' ? 'var(--font-mono)' : 'inherit',
                fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)', marginTop: 2
              }}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Continue learning rail */}
      <div className="space-y-4">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-ink)', paddingLeft: 4 }}>
          Tiếp tục hành trình học tập
        </h2>

        {inProgressEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressEnrollments.map((item) => (
              <div key={item.id} style={{
                background: 'var(--color-paper-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: 16,
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
              }}>
                <img
                  src={item.thumbnailUrl}
                  alt={item.courseTitle}
                  style={{
                    width: 100, aspectRatio: '16 / 9', objectFit: 'cover',
                    borderRadius: 10, border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-paper-dim)', flexShrink: 0
                  }}
                />
                
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h3 style={{
                    fontSize: 14, fontWeight: 700, color: 'var(--color-ink)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    <Link to={`/courses/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
                    >
                      {item.courseTitle}
                    </Link>
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-ink-soft)' }}>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                        Bài: {item.lastLessonTitle}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{item.completionPercent}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: 6, backgroundColor: 'var(--color-paper-dim)', borderRadius: 99, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                      <div style={{ height: '100%', width: `${item.completionPercent}%`, backgroundColor: 'var(--color-accent)', borderRadius: 99 }} />
                    </div>
                  </div>
                </div>

                <Link
                  to={`/app/learn/${item.courseId}/${item.firstLessonId}`}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    backgroundColor: 'var(--color-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', boxShadow: '0 4px 10px rgba(224,115,74,0.25)',
                    textDecoration: 'none', flexShrink: 0, transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Play size={14} fill="currentColor" style={{ marginLeft: 2 }} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--color-paper-raised)',
            border: '1px solid var(--color-border)',
            borderRadius: 16,
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: 440,
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
          }}>
            <BookOpen style={{ color: 'var(--color-muted)', marginBottom: 14 }} size={36} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 6 }}>
              Chưa có khóa học hoạt động
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.6, marginBottom: 18 }}>
              Chọn khóa học phù hợp tại thư viện để bắt đầu hành trình tích lũy XP.
            </p>
            <Link
              to="/courses"
              style={{
                display: 'inline-block', borderRadius: 8, backgroundColor: 'var(--color-accent)',
                color: '#fff', fontSize: 12, fontWeight: 700, border: 'none',
                padding: '10px 20px', textDecoration: 'none', transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
            >
              Tìm khóa học ngay →
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
