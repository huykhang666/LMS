import { useState } from 'react';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { Search, SlidersHorizontal, BookOpen, Clock, Star, Users } from 'lucide-react';
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

export function CourseExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const courses = useCourseStore((s) => s.courses).filter((c) => c.status === 'published');

  const getLessonsCount = (course: StoredCourse) => {
    return course.chapters?.reduce((total, ch) => total + (ch.lessons?.length || 0), 0) || 0;
  };

  const getDurationText = (course: StoredCourse) => {
    const totalLessons = getLessonsCount(course);
    if (totalLessons === 0) return '0 bài học';
    // Emulate some hours based on lessons count
    return `${totalLessons * 15} phút`;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-paper)', fontFamily: 'var(--font-body)' }} className="flex flex-col">
      <Header />

      {/* Hero Header Banner */}
      <section style={{
        position: 'relative',
        padding: '5rem 2rem 4rem',
        background: 'linear-gradient(135deg, #0d1a30 0%, #1B2A4A 60%, #243659 100%)',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,115,74,0.12) 0%, transparent 65%)',
          top: -100, right: -50, filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Khám phá các khóa học chuyên sâu
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
            Lộ trình học tập thực chiến chất lượng cao do Quản trị viên biên soạn và cung cấp.
          </p>
        </div>
      </section>

      {/* Main content grid */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8 space-y-8" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        
        {/* Filter bar */}
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--color-border)',
          borderRadius: 16,
          padding: '1.25rem 1.5rem',
          boxShadow: '0 8px 32px rgba(27,42,74,0.05)',
        }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div style={{ position: 'relative', flexGrow: 1, maxWidth: 440 }}>
            <Search style={{ position: 'absolute', left: 14, top: 12, color: 'var(--color-muted)' }} size={16} />
            <input
              type="text"
              placeholder="Tìm tên khóa học, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', borderRadius: 10, border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-paper)', paddingLeft: '2.5rem', paddingRight: '1rem',
                paddingTop: '10px', paddingBottom: '10px', fontSize: 13, color: 'var(--color-ink)',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          {/* Filters Selectors */}
          <div className="flex flex-wrap gap-3 items-center">
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 700, color: 'var(--color-ink-soft)',
              backgroundColor: 'var(--color-paper-dim)', border: '1px solid var(--color-border)',
              padding: '8px 12px', borderRadius: 8
            }}>
              <SlidersHorizontal size={13} />
              Lọc theo:
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                borderRadius: 8, border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-paper-raised)', padding: '8px 14px',
                fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)',
                outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="all">Tất cả chủ đề</option>
              <option value="programming">Lập trình</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="devops">DevOps</option>
              <option value="ai">Trí tuệ nhân tạo</option>
              <option value="english">Ngoại ngữ</option>
              <option value="it">Công nghệ thông tin</option>
              <option value="softskill">Kỹ năng mềm</option>
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                borderRadius: 8, border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-paper-raised)', padding: '8px 14px',
                fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)',
                outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung bình</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => (
              <Link key={course.id} to={`/courses/${course.slug}`} style={{
                display: 'flex', flexDirection: 'column',
                background: 'var(--color-paper-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: 20,
                overflow: 'hidden',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
                boxShadow: '0 1px 4px rgba(27,42,74,0.06)',
                animation: `fade-up 0.5s ease-out ${idx * 0.08}s both`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-6px)';
                el.style.boxShadow = '0 20px 48px rgba(27,42,74,0.14)';
                el.style.borderColor = 'rgba(224,115,74,0.35)';
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
                }}>
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop'}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Category chip */}
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    background: 'rgba(13,26,48,0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#fff', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.05em', fontFamily: 'var(--font-mono)',
                    padding: '4px 10px', borderRadius: 99,
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}>
                    {categoryLabels[course.category] || course.category}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.05rem',
                    fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.35
                  }}>
                    {course.title}
                  </h3>

                  <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.6, flex: 1 }}>
                    {course.shortDescription}
                  </p>

                  {/* Rating / Students */}
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

                  {/* Footer metadata */}
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
                      background: `${levelColors[course.level] || '#C25A32'}15`,
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
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: 440,
            margin: '4rem auto',
            boxShadow: '0 8px 30px rgba(27,42,74,0.04)',
          }}>
            <BookOpen style={{ color: 'var(--color-muted)', marginBottom: 16 }} size={40} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 8 }}>
              Chưa có khóa học nào được đăng tải
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.6, marginBottom: 20 }}>
              Hiện tại chưa có khóa học nào được đăng công khai trên hệ thống. Vui lòng đăng nhập tài khoản Quản trị viên để thêm khóa học.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
