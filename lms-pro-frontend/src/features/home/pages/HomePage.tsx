import { Link } from 'react-router-dom';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import {
  ArrowRight, BookOpen, Clock, Award, Sparkles,
  Code2, Brain, Globe, Briefcase, Trophy, Zap,
  PlayCircle, Star, Users
} from 'lucide-react';
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

const levelColors: Record<string, string> = {
  beginner: '#3E7C59',
  intermediate: '#C25A32',
  advanced: '#B3402C',
};


const CATEGORIES = [
  { label: 'Lập trình',   icon: Code2,     slug: 'programming', count: 12 },
  { label: 'Trí tuệ AI',  icon: Brain,     slug: 'ai',          count: 8  },
  { label: 'Ngoại ngữ',   icon: Globe,     slug: 'english',     count: 6  },
  { label: 'Kỹ năng mềm', icon: Briefcase, slug: 'softskill',   count: 5  },
];

/* ─── Heroic floating course card (shown on right side) ──────── */
function HeroMiniCard({
  title, category, progress, top, right, delay = '0s', rotate = '0deg'
}: {
  title: string; category: string; progress: number;
  top?: string; right?: string; delay?: string; rotate?: string;
}) {
  return (
    <div style={{
      position: 'absolute', top, right,
      background: 'rgba(255,255,255,0.09)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: 16,
      padding: '14px 18px',
      minWidth: 220,
      animation: `float 4s ease-in-out ${delay} infinite`,
      transform: `rotate(${rotate})`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'var(--color-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <BookOpen size={16} style={{ color: '#fff' }} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{title}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)' }}>{category}</div>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 99 }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: 'var(--color-accent)',
          borderRadius: 99,
        }} />
      </div>
      <div style={{
        fontSize: 10, color: 'rgba(255,255,255,0.5)',
        marginTop: 6, fontFamily: 'var(--font-mono)',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Đang học</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export function HomePage() {
  const { user } = useAuthStore();
  const courses = useCourseStore((s) => s.courses).filter((c) => c.status === 'published');

  const getLessonsCount = (c: StoredCourse) => {
    return c.chapters?.reduce((total, ch) => total + (ch.lessons?.length || 0), 0) || 0;
  };

  const getDurationText = (c: StoredCourse) => {
    const totalLessons = getLessonsCount(c);
    if (totalLessons === 0) return '0 bài học';
    return `${totalLessons * 15} phút`;
  };


  return (
    <div style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--color-paper)', minHeight: '100vh' }}>
      <Header />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0d1a30 0%, #1B2A4A 55%, #243659 100%)',
      }}>
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }} />

        {/* Orb top-right */}
        <div style={{
          position: 'absolute', width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,115,74,0.22) 0%, transparent 65%)',
          top: -200, right: -100,
          filter: 'blur(32px)',
          pointerEvents: 'none',
        }} />
        {/* Orb bottom-left */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(62,124,89,0.15) 0%, transparent 70%)',
          bottom: -150, left: '5%',
          filter: 'blur(32px)',
          pointerEvents: 'none',
        }} />

        {/* Content grid */}
        <div style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: 1300, margin: '0 auto',
          padding: '7rem 2rem 5rem',
          alignItems: 'center',
        }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* LEFT: text */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(224,115,74,0.15)',
              border: '1px solid rgba(224,115,74,0.4)',
              borderRadius: 99, padding: '6px 16px',
              marginBottom: '1.75rem',
              animation: 'fade-up 0.4s ease-out',
            }}>
              <Sparkles size={13} style={{ color: 'var(--color-accent)' }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                color: 'var(--color-accent)', textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}>
                Nền tảng học tập thế hệ mới
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
              fontWeight: 700, lineHeight: 1.05,
              color: '#FFFFFF',
              marginBottom: '1.5rem',
              animation: 'fade-up 0.45s ease-out 0.08s both',
            }}>
              Kiến tạo tương lai{' '}
              <em style={{ color: 'var(--color-accent)', fontStyle: 'italic', display: 'block' }}>
                bằng tri thức
              </em>
            </h1>

            <p style={{
              fontSize: '1.05rem', color: 'rgba(255,255,255,0.62)',
              lineHeight: 1.75, maxWidth: 480,
              marginBottom: '2.5rem',
              animation: 'fade-up 0.45s ease-out 0.16s both',
            }}>
              Trải nghiệm học lập trình, AI và kỹ năng nghề với lộ trình bài bản, giao diện tập trung vào hiệu quả thực sự.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 14,
              animation: 'fade-up 0.45s ease-out 0.24s both',
            }}>
              <Link to="/courses" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--color-accent)',
                color: '#fff', fontWeight: 700, fontSize: 15,
                padding: '13px 28px', borderRadius: 10,
                boxShadow: '0 6px 28px rgba(224,115,74,0.45)',
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}>
                Bắt đầu học ngay <ArrowRight size={16} />
              </Link>
              {!user && (
                <Link to="/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  color: '#fff', fontWeight: 600, fontSize: 15,
                  padding: '13px 28px', borderRadius: 10,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}>
                  Đăng ký miễn phí
                </Link>
              )}
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '2rem',
              marginTop: '2.5rem', paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              animation: 'fade-up 0.45s ease-out 0.32s both',
            }}>
              {[
                { n: '1,200+', l: 'Học viên' },
                { n: '48',     l: 'Khóa học' },
                { n: '96%',    l: 'Hài lòng' },
                { n: '24/7',   l: 'Hỗ trợ'   },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-accent)' }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: floating mini-cards */}
          <div style={{ position: 'relative', height: 460, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Glow circle */}
            <div style={{
              position: 'absolute',
              width: 340, height: 340, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(224,115,74,0.12) 0%, transparent 70%)',
              left: '50%', top: '50%',
              transform: 'translate(-50%,-50%)',
            }} />

            {/* Central badge */}
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              border: '2px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4,
              animation: 'float 5s ease-in-out infinite',
            }}>
              <Trophy size={32} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>Level 12</span>
            </div>

            {/* Floating cards */}
            <HeroMiniCard title="React TypeScript" category="Frontend" progress={72} top="30px" right="20px" delay="0s" rotate="-2deg" />
            <HeroMiniCard title="Machine Learning" category="AI / ML" progress={45} top="160px" right="220px" delay="1.2s" rotate="1.5deg" />
            <HeroMiniCard title="Backend Node.js" category="Backend" progress={88} top="300px" right="30px" delay="0.7s" rotate="-1deg" />
          </div>
        </div>

        {/* Bottom fade to paper */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 100,
          background: 'linear-gradient(to bottom, transparent, var(--color-paper))',
          pointerEvents: 'none',
        }} />
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-paper)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 700, color: 'var(--color-ink)',
              marginBottom: 10,
            }}>
              Khám phá theo lĩnh vực
            </h2>
            <p style={{ color: 'var(--color-ink-soft)', fontSize: 15 }}>
              Chọn đúng hướng đi, học đúng điều bạn cần
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.slug} to={`/courses?category=${cat.slug}`} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 14,
                  padding: '2rem 1rem',
                  background: 'var(--color-paper-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 16,
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  animation: `fade-up 0.4s ease-out ${i * 0.07}s both`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--color-accent)';
                  el.style.transform = 'translateY(-6px) scale(1.02)';
                  el.style.boxShadow = '0 16px 40px rgba(224,115,74,0.14)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--color-border)';
                  el.style.transform = 'translateY(0) scale(1)';
                  el.style.boxShadow = 'none';
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(224,115,74,0.15) 0%, rgba(224,115,74,0.05) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-accent)',
                    border: '1px solid rgba(224,115,74,0.2)',
                  }}>
                    <Icon size={26} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-ink)', marginBottom: 4 }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                      {cat.count} khóa học
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED COURSES
      ══════════════════════════════════════ */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(180deg, var(--color-paper-dim) 0%, var(--color-paper) 100%)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 700, color: 'var(--color-ink)',
                marginBottom: 8,
              }}>
                Khóa học nổi bật
              </h2>
              <p style={{ color: 'var(--color-ink-soft)', fontSize: 15 }}>
                Được tuyển chọn từ các chuyên gia có kinh nghiệm thực chiến
              </p>
            </div>
            <Link to="/courses" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--color-accent)', fontWeight: 700, fontSize: 14,
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Xem tất cả <ArrowRight size={15} />
            </Link>
          </div>

          {/* Cards grid */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <Link key={course.id} to={`/courses/${course.slug}`} style={{
                  display: 'flex', flexDirection: 'column',
                  background: 'var(--color-paper-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
                  animation: `fade-up 0.5s ease-out ${i * 0.1}s both`,
                  boxShadow: '0 1px 4px rgba(27,42,74,0.06)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-8px)';
                  el.style.boxShadow = '0 24px 56px rgba(27,42,74,0.16)';
                  el.style.borderColor = 'rgba(224,115,74,0.3)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 1px 4px rgba(27,42,74,0.06)';
                  el.style.borderColor = 'var(--color-border)';
                }}>
                  {/* Thumbnail */}
                  <div style={{
                    position: 'relative',
                    width: '100%', aspectRatio: '16 / 9',
                    overflow: 'hidden',
                    backgroundColor: '#1e2b45',
                    flexShrink: 0,
                  }}>
                    <img
                      src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop'}
                      alt={course.title}
                      loading="lazy"
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.07)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                    />
                    {/* Play overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0)',
                      transition: 'background 0.2s',
                    }}>
                      <PlayCircle size={44} style={{
                        color: 'rgba(255,255,255,0)',
                        transition: 'all 0.25s',
                        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
                      }} />
                    </div>
                    {/* Category chip */}
                    <div style={{
                      position: 'absolute', top: 12, left: 12,
                      background: 'rgba(13,26,48,0.82)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.06em', fontFamily: 'var(--font-mono)',
                      padding: '4px 11px', borderRadius: 99,
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}>
                      {categoryLabels[course.category] || course.category}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: 'var(--color-ink)',
                      lineHeight: 1.35,
                    }}>
                      {course.title}
                    </h3>

                    <p style={{
                      fontSize: 13, color: 'var(--color-ink-soft)',
                      lineHeight: 1.6, flex: 1,
                    }}>
                      {course.shortDescription}
                    </p>

                    {/* Students */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={12} style={{ color: 'var(--color-muted)' }} />
                      <span style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        0 học viên
                      </span>
                      <Star size={12} style={{ color: '#F59E0B', fill: '#F59E0B', marginLeft: 6 }} />
                      <span style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        5.0
                      </span>
                    </div>

                    {/* Meta footer */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 12,
                      borderTop: '1px solid var(--color-border)',
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: 12, fontFamily: 'var(--font-mono)',
                        fontWeight: 600, color: 'var(--color-muted)',
                      }}>
                        <Clock size={12} /> {getDurationText(course)}
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: '0.07em',
                        padding: '3px 10px', borderRadius: 99,
                        color: levelColors[course.level] || '#C25A32',
                        background: `${levelColors[course.level] || '#C25A32'}18`,
                        border: `1px solid ${levelColors[course.level] || '#C25A32'}30`,
                      }}>
                        {levelLabels[course.level] || course.level}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'var(--color-paper-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: 16,
              padding: '3rem 2rem',
              textAlign: 'center',
              width: '100%',
              boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
            }}>
              <BookOpen style={{ color: 'var(--color-muted)', marginBottom: 14 }} size={36} className="mx-auto" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 6 }}>
                Chưa có khóa học nào được phát hành
              </h3>
              <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>
                Hiện tại chưa có khóa học nào hoạt động trên hệ thống. Học viên có thể quay lại sau khi admin đăng tải bài giảng.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES (2-col)
      ══════════════════════════════════════ */}
      <section style={{
        padding: '6rem 0',
        backgroundColor: 'var(--color-paper)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* bg glow */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,115,74,0.06) 0%, transparent 70%)',
          right: -100, top: '30%',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(62,124,89,0.1)',
                border: '1px solid rgba(62,124,89,0.3)',
                borderRadius: 99, padding: '5px 14px',
                marginBottom: '1.5rem',
              }}>
                <Zap size={12} style={{ color: 'var(--color-success)' }} />
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: 'var(--color-success)',
                  textTransform: 'uppercase', letterSpacing: '0.09em',
                  fontFamily: 'var(--font-mono)',
                }}>
                  Tại sao chọn LMS Pro?
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
                fontWeight: 700, color: 'var(--color-ink)',
                lineHeight: 1.15, marginBottom: '1.25rem',
              }}>
                Học theo lộ trình.{' '}
                <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>
                  Hiểu đến nơi.
                </span>
              </h2>

              <p style={{
                color: 'var(--color-ink-soft)', lineHeight: 1.8,
                fontSize: 15, marginBottom: '2rem',
              }}>
                Không học tràn lan — mỗi khóa học theo cấu trúc Chương → Bài học rõ ràng, giúp bạn nắm chắc kiến thức từng bước.
              </p>

              <Link to="/courses" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--color-ink)',
                color: '#fff', fontWeight: 700, fontSize: 14,
                padding: '12px 24px', borderRadius: 10,
                textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-accent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-ink)'; }}>
                Xem khóa học <ArrowRight size={15} />
              </Link>
            </div>

            {/* Right: feature cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: BookOpen, title: 'Giáo trình bài bản theo chương', desc: 'Cấu trúc Chương → Phần → Bài học, theo sát dự án thực tế của doanh nghiệp.' },
                { icon: Clock,    title: 'Học linh hoạt — Ghi nhớ vị trí',  desc: 'Hệ thống tự lưu điểm video bạn đang xem, tiếp tục đúng chỗ khi quay lại.' },
                { icon: Award,   title: 'Đánh giá thực chất qua Quiz',       desc: 'Mỗi chương kết thúc bằng bài kiểm tra củng cố và đo lường kiến thức.' },
                { icon: Trophy,  title: 'Gamification: XP, Streak, Level',   desc: 'Tích lũy điểm, duy trì chuỗi ngày học liên tiếp và nâng cấp bậc học viên.' },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} style={{
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    background: 'var(--color-paper-raised)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 14,
                    padding: '1.25rem 1.5rem',
                    transition: 'all 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(224,115,74,0.35)';
                    el.style.boxShadow = '0 4px 20px rgba(224,115,74,0.08)';
                    el.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'var(--color-border)';
                    el.style.boxShadow = 'none';
                    el.style.transform = 'translateX(0)';
                  }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: 'linear-gradient(135deg, rgba(224,115,74,0.18) 0%, rgba(224,115,74,0.06) 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-accent)', flexShrink: 0,
                      border: '1px solid rgba(224,115,74,0.2)',
                    }}>
                      <Icon size={19} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-ink)', marginBottom: 4 }}>
                        {f.title}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>
                        {f.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      {!user && (
        <section style={{ padding: '3rem 2rem 5rem' }}>
          <div style={{
            maxWidth: 1000, margin: '0 auto',
            background: 'linear-gradient(135deg, #0d1a30 0%, #1B2A4A 60%, #2a3f6a 100%)',
            borderRadius: 24,
            padding: 'clamp(2.5rem, 6vw, 4rem) 3rem',
            position: 'relative', overflow: 'hidden',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(27,42,74,0.22)',
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse at 75% 50%, rgba(224,115,74,0.2) 0%, transparent 65%)',
            }} />
            {/* Grid texture */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.7rem, 4vw, 2.6rem)',
                fontWeight: 700, color: '#fff',
                marginBottom: '1rem',
              }}>
                Sẵn sàng bắt đầu hành trình học tập?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 15, marginBottom: '2rem' }}>
                Đăng ký ngay hôm nay — hoàn toàn miễn phí, không cần thẻ tín dụng.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16 }}>
                <Link to="/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'var(--color-accent)',
                  color: '#fff', fontWeight: 700, fontSize: 15,
                  padding: '14px 32px', borderRadius: 10,
                  boxShadow: '0 6px 28px rgba(224,115,74,0.45)',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}>
                  Tạo tài khoản học viên →
                </Link>
                <Link to="/courses" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  color: '#fff', fontWeight: 600, fontSize: 15,
                  padding: '14px 32px', borderRadius: 10,
                  backdropFilter: 'blur(8px)',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}>
                  Khám phá miễn phí
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
