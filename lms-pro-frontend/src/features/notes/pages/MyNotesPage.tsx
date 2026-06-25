import { FileText, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MyNotesPage() {
  const notes = [
    {
      id: 'note-1',
      courseTitle: 'Lập trình React & TypeScript thực chiến',
      courseId: 'course-1',
      lessonId: 'lesson-1',
      lessonTitle: 'Bài 1: Giới thiệu khóa học & Setup dự án',
      content: 'Cài đặt node modules và cấu hình vite.config.ts để sử dụng alias @ cho các import path.',
      timestamp: '02:15',
      createdAt: '24/06/2026'
    },
    {
      id: 'note-2',
      courseTitle: 'Lập trình React & TypeScript thực chiến',
      courseId: 'course-1',
      lessonId: 'lesson-2',
      lessonTitle: 'Bài 2: TypeScript cơ bản cho lập trình React',
      content: 'Nhớ khai báo kiểu dữ liệu Strict cho Component Props và Event Handler. Tránh sử dụng kiểu any.',
      timestamp: '05:40',
      createdAt: '24/06/2026'
    }
  ];

  return (
    <div className="mx-auto max-w-4xl w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
        
        {/* Header Block */}
        <div style={{
          background: 'var(--color-paper-raised)',
          border: '1px solid var(--color-border)',
          borderRadius: 16,
          padding: '1.5rem 2rem',
          boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 6 }}>
            Sổ tay ghi chú học tập
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>
            Danh sách tất cả các ghi chú cá nhân bạn đã ghi lại trong các bài giảng video.
          </p>
        </div>

        {/* Timeline Notes Grid */}
        <div style={{ position: 'relative', paddingLeft: '2.5rem', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Vertical timeline spine */}
          <div style={{
            position: 'absolute', left: 8, top: 8, bottom: 8, width: 2,
            backgroundColor: 'var(--color-border)', borderRadius: 99
          }} />

          {notes.length > 0 ? (
            notes.map((note, idx) => (
              <div key={note.id} style={{
                position: 'relative',
                background: 'var(--color-paper-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: 16,
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(27,42,74,0.02)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                animation: `fade-up 0.4s ease-out ${idx * 0.1}s both`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 12px 30px rgba(27,42,74,0.08)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 4px 20px rgba(27,42,74,0.02)';
              }}>
                {/* Timeline connector dot */}
                <div style={{
                  position: 'absolute', left: '-2.5rem', top: 28, width: 10, height: 10,
                  borderRadius: '50%', backgroundColor: 'var(--color-accent)',
                  border: '3px solid var(--color-paper)', transform: 'translateX(-4px)',
                  boxShadow: '0 0 0 3px var(--color-border)'
                }} />

                {/* Card Header */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  borderBottom: '1px solid var(--color-border)', paddingBottom: '10px',
                  marginBottom: '12px', flexWrap: 'wrap', gap: 10
                }}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {note.courseTitle}
                    </span>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)', marginTop: 2 }}>{note.lessonTitle}</h3>
                  </div>
                  
                  <Link
                    to={`/app/learn/${note.courseId}/${note.lessonId}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 12, fontWeight: 700, color: 'var(--color-accent)',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Vào bài học
                    <ExternalLink size={12} />
                  </Link>
                </div>

                {/* Card Body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                      color: 'var(--color-accent)', backgroundColor: 'rgba(224,115,74,0.12)',
                      padding: '2px 8px', borderRadius: 4, flexShrink: 0, marginTop: 2
                    }}>
                      {note.timestamp}
                    </span>
                    <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>{note.content}</p>
                  </div>
                  
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-muted)',
                    justifyContent: 'flex-end'
                  }}>
                    <Clock size={12} />
                    <span>Ghi lại ngày {note.createdAt}</span>
                  </div>
                </div>
              </div>
            ))
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
              margin: '2rem auto',
              boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
            }}>
              <FileText style={{ color: 'var(--color-muted)', marginBottom: 14 }} size={36} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 6 }}>
                Chưa có ghi chú nào
              </h3>
              <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>
                Trong lúc xem video bài giảng, bạn có thể nhấn nút "Ghi chú cá nhân" để lưu lại các khoảnh khắc quan trọng.
              </p>
            </div>
          )}
        </div>
    </div>
  );
}
