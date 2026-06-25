import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { BookOpen, Clock, Award, ChevronDown, ChevronUp, PlayCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
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

const levelLabels: Record<string, string> = {
  beginner: 'Cơ bản',
  intermediate: 'Trung bình',
  advanced: 'Nâng cao',
};

export function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const course = useCourseStore((s) => s.courses.find((c) => c.slug === slug));

  // Set first chapter as expanded if not set
  useEffect(() => {
    if (course && course.chapters && course.chapters.length > 0 && expandedChapter === null) {
      setExpandedChapter(course.chapters[0].id);
    }
  }, [course, expandedChapter]);

  if (!course) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-paper)' }}>
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center py-24">
          <BookOpen className="h-12 w-12 text-muted mb-4" />
          <h2 className="text-xl font-bold text-ink">Không tìm thấy khóa học</h2>
          <p className="text-xs text-ink-soft mt-2">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
          <Link to="/courses" className="mt-4 text-xs text-accent font-semibold hover:underline">Quay lại trang khám phá</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const getLessonsCount = (c: StoredCourse) => {
    return c.chapters?.reduce((total, ch) => total + (ch.lessons?.length || 0), 0) || 0;
  };

  const getDurationText = (c: StoredCourse) => {
    const totalLessons = getLessonsCount(c);
    if (totalLessons === 0) return '0 bài học';
    return `${totalLessons * 15} phút`;
  };

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to learning environment with the first lesson of the first chapter
    const firstChapter = course.chapters?.[0];
    const firstLesson = firstChapter?.lessons?.[0];
    if (firstLesson) {
      navigate(`/app/learn/${course.id}/${firstLesson.id}`);
    } else {
      alert('Khóa học này hiện chưa có bài giảng nào được tải lên.');
    }
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  const totalLessons = getLessonsCount(course);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-paper)', fontFamily: 'var(--font-body)' }}>
      <Header />

      {/* Banner Banner */}
      <div style={{
        position: 'relative',
        height: 380,
        background: 'linear-gradient(135deg, #0d1a30 0%, #1B2A4A 65%, #243659 100%)',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)'
      }}>
        {/* Banner image with overlay */}
        <img
          src={course.bannerUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1280&auto=format&fit=crop'}
          alt={course.title}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.25, pointerEvents: 'none'
          }}
        />
        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--color-paper) 0%, rgba(27,42,74,0.4) 60%, rgba(13,26,48,0.8) 100%)',
          pointerEvents: 'none'
        }} />

        <div className="mx-auto max-w-7xl w-full px-4 pb-10 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
            <span style={{
              background: 'rgba(224,115,74,0.18)',
              border: '1px solid rgba(224,115,74,0.4)',
              color: 'var(--color-accent)',
              fontSize: 11, fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              padding: '4px 12px', borderRadius: 99
            }}>
              {categoryLabels[course.category] || course.category}
            </span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(255,255,255,0.15)'
            }}>
              {course.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Layout - Left (8 cols) & Right (4 cols) */}
      <div className="mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Course details & chapters list */}
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
            <div style={{
              background: 'var(--color-paper-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: 16,
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
            }} className="space-y-4">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                Giới thiệu khóa học
              </h2>
              <p style={{
                fontSize: 14, fontStyle: 'italic', color: 'var(--color-ink-soft)',
                lineHeight: 1.6, background: 'var(--color-paper-dim)',
                padding: '1.25rem', borderLeft: '3px solid var(--color-accent)',
                borderRadius: '0 8px 8px 0', margin: '1rem 0'
              }}>
                "{course.shortDescription}"
              </p>
              <p style={{ fontSize: 14, color: 'var(--color-ink-soft)', lineHeight: 1.7 }}>
                {course.fullDescription}
              </p>
            </div>

            {/* Curriculum Accordion */}
            <div className="space-y-4">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-ink)', paddingLeft: 4 }}>
                Nội dung học tập
              </h2>
              
              {course.chapters && course.chapters.length > 0 ? (
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 16,
                  backgroundColor: 'var(--color-paper-raised)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
                }}>
                  {course.chapters
                    .sort((a, b) => a.order - b.order)
                    .map((chapter) => {
                      const isExpanded = expandedChapter === chapter.id;
                      return (
                        <div key={chapter.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <button
                            onClick={() => toggleChapter(chapter.id)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '1.25rem 1.5rem',
                              backgroundColor: isExpanded ? 'var(--color-paper-dim)' : 'transparent',
                              transition: 'background-color 0.2s',
                              textAlign: 'left'
                            }}
                          >
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{chapter.title}</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>

                          {isExpanded && (
                            <div style={{
                              backgroundColor: 'rgba(236,234,224,0.25)',
                              padding: '1rem 1.5rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 12
                            }}>
                              {chapter.lessons && chapter.lessons.length > 0 ? (
                                chapter.lessons
                                  .sort((a, b) => a.order - b.order)
                                  .map((lesson) => (
                                    <div key={lesson.id} style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '10px 12px',
                                      borderRadius: 8,
                                      backgroundColor: 'var(--color-paper-raised)',
                                      border: '1px solid var(--color-border)',
                                      transition: 'all 0.2s'
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <PlayCircle size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                                        <span style={{
                                          fontSize: 13,
                                          fontWeight: 500,
                                          color: 'var(--color-ink)'
                                        }}>
                                          {lesson.title}
                                        </span>
                                      </div>
                                      <span style={{
                                        display: 'flex', alignItems: 'center', gap: 4,
                                        fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-muted)'
                                      }}>
                                        <Clock size={12} />
                                        {lesson.durationLabel}
                                      </span>
                                    </div>
                                  ))
                              ) : (
                                <p className="text-xs text-muted italic pl-4">Chưa có bài học nào trong chương này.</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 16,
                  backgroundColor: 'var(--color-paper-raised)',
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'var(--color-muted)',
                  fontSize: 13
                }}>
                  Giáo trình hiện đang được cập nhật. Vui lòng quay lại sau!
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Enrollment Sidebar (Sticky card) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 order-1 lg:order-2">
            <div style={{
              background: 'var(--color-paper-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(27,42,74,0.06)'
            }}>
              <div style={{ position: 'relative', aspectRatio: '16 / 9', backgroundColor: '#1e2b45' }}>
                <img
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop'}
                  alt="Thumbnail"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Stats grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 16, borderBottom: '1px solid var(--color-border)',
                  paddingBottom: '1.25rem', textAlign: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>Thời lượng</span>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginTop: 2 }}>
                      {getDurationText(course)}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>Cấp độ</span>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginTop: 2 }}>
                      {levelLabels[course.level] || course.level}
                    </p>
                  </div>
                </div>

                {/* Bullet points highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--color-ink-soft)' }}>
                    <BookOpen size={15} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    <span>Tổng số: {course.chapters?.length || 0} chương ({totalLessons} bài học)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--color-ink-soft)' }}>
                    <Award size={15} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    <span>Học viên chủ động học theo tiến độ</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--color-ink-soft)' }}>
                    <FileText size={15} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                    <span>Đính kèm tài liệu PDF thực hành</span>
                  </div>
                </div>

                <button
                  onClick={handleEnroll}
                  style={{
                    width: '100%', borderRadius: 10, backgroundColor: 'var(--color-accent)',
                    color: '#fff', fontSize: 14, fontWeight: 700, border: 'none',
                    padding: '12px', cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(224,115,74,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {user ? 'Bắt đầu học ngay' : 'Đăng nhập để học miễn phí'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
