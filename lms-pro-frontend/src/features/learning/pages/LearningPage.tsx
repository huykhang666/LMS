import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  FileText, 
  Sparkles,
  Maximize
} from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';

export function LearningPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const course = useCourseStore((s) => s.courses.find((c) => c.id === courseId));

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeTab, setActiveTab] = useState<'documents' | 'notes'>('documents');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState<any[]>([
    { id: 1, time: '02:15', content: 'Ghi chú về việc khởi tạo dự án học tập' },
    { id: 2, time: '05:40', content: 'Cách tổ chức bài học hiệu quả' }
  ]);

  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Set default expanded chapter
  useEffect(() => {
    if (course && course.chapters && course.chapters.length > 0 && !expandedChapter) {
      setExpandedChapter(course.chapters[0].id);
    }
  }, [course, expandedChapter]);

  if (!course) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-paper)', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="text-xl font-bold text-ink">Không tìm thấy khóa học</h2>
        <Link to="/app/dashboard" className="text-xs text-accent mt-4 hover:underline">Quay lại bảng điều khiển</Link>
      </div>
    );
  }

  const allLessons = course.chapters ? course.chapters.flatMap(c => c.lessons || []) : [];
  const activeLesson = allLessons.find(l => l.id === lessonId) || allLessons[0];

  if (!activeLesson) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-paper)', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="text-xl font-bold text-ink">Chưa có bài học nào được tải lên</h2>
        <Link to={`/courses/${course.slug}`} className="text-xs text-accent mt-4 hover:underline">Quay lại chi tiết khóa học</Link>
      </div>
    );
  }

  const activeChapter = course.chapters.find(c => c.lessons?.some(l => l.id === activeLesson.id)) || course.chapters[0];

  // Video duration tracking
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(1);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 1);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setVideoTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log('Autoplay blocked:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeRate = () => {
    const rates = [0.5, 1, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const formatVideoTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    const currentFormatted = formatVideoTime(videoTime);
    setNotes([
      ...notes,
      {
        id: Date.now(),
        time: currentFormatted,
        content: noteContent
      }
    ]);
    setNoteContent('');
  };

  // Safe percentage calculator
  const completedLessonsCount = allLessons.filter((_, idx) => idx < allLessons.indexOf(activeLesson)).length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedLessonsCount / allLessons.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-paper)', fontFamily: 'var(--font-body)', overflow: 'hidden' }}>
      
      {/* Top Navbar */}
      <header style={{
        height: 56, borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-paper-raised)', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, zIndex: 10, flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/app/dashboard" style={{
            padding: 6, borderRadius: '50%', backgroundColor: 'var(--color-paper-dim)',
            color: 'var(--color-ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none'
          }}>
            <ArrowLeft size={16} />
          </Link>
          <div style={{ lineHeight: 1.25 }}>
            <h1 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {course.title}
            </h1>
            <span style={{ fontSize: 10, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
              {activeChapter?.title || 'Chương học'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            backgroundColor: 'rgba(62,124,89,0.1)', border: '1px solid rgba(62,124,89,0.25)',
            borderRadius: 99, padding: '4px 12px', fontSize: 10, fontWeight: 700,
            color: 'var(--color-success)', fontFamily: 'var(--font-mono)'
          }} className="hidden sm:inline-flex">
            <Sparkles size={11} />
            Đã học xong {completedLessonsCount}/{allLessons.length} bài
          </div>
          
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden flex items-center justify-center gap-1.5"
            style={{
              backgroundColor: 'var(--color-accent)', color: '#fff',
              padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              boxShadow: '0 2px 6px rgba(224,115,74,0.3)', cursor: 'pointer'
            }}
          >
            <BookOpen size={13} />
            Bài học
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* LEFT: Sidebar with BookSpineProgress & Curriculum */}
        <aside style={{
          width: 320, borderRight: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-paper-raised)', display: 'flex',
          flexShrink: 0, overflowY: 'auto'
        }} className="hidden md:flex">
          
          {/* Signature Book-Spine Progress Column */}
          <div style={{
            width: 44, borderRight: '1px solid var(--color-border)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: 24, paddingBottom: 24, gap: 16,
            backgroundColor: 'rgba(236,234,224,0.3)', flexShrink: 0
          }}>
            <div style={{
              fontSize: 9, fontWeight: 800, color: 'var(--color-muted)',
              textTransform: 'uppercase', letterSpacing: '0.15em',
              writingMode: 'vertical-lr', transform: 'rotate(180deg)',
              userSelect: 'none'
            }}>
              Tiến độ học tập
            </div>
            
            {/* Book spine line representation */}
            <div style={{
              flexGrow: 1, width: 6, backgroundColor: 'var(--color-paper)',
              borderRadius: 99, border: '1px solid var(--color-border)',
              position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ width: '100%', height: `${progressPercent}%`, backgroundColor: 'var(--color-success)' }} />
            </div>
          </div>

          {/* Chapters and lessons */}
          <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-muted)' }}>
              Nội dung khóa học
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {course.chapters
                .sort((a, b) => a.order - b.order)
                .map((chapter) => {
                  const isExpanded = expandedChapter === chapter.id;
                  return (
                    <div key={chapter.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <button
                        onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between', padding: '6px 0', textAlign: 'left',
                          fontSize: 12, fontWeight: 700, color: 'var(--color-ink)',
                          cursor: 'pointer', background: 'transparent', border: 'none'
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '85%' }}>
                          {chapter.title}
                        </span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {isExpanded && (
                        <div style={{
                          display: 'flex', flexDirection: 'column', gap: 6,
                          paddingLeft: 8, borderLeft: '1px solid var(--color-border)',
                          marginTop: 4
                        }}>
                          {chapter.lessons && chapter.lessons
                            .sort((a, b) => a.order - b.order)
                            .map((lesson) => {
                              const isActive = lesson.id === lessonId;
                              const isCompleted = allLessons.indexOf(lesson) < allLessons.indexOf(activeLesson);
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => navigate(`/app/learn/${course.id}/${lesson.id}`)}
                                  style={{
                                    width: '100%', display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between', padding: '8px 10px',
                                    borderRadius: 6, fontSize: 12, textAlign: 'left',
                                    backgroundColor: isActive ? 'rgba(224,115,74,0.08)' : 'transparent',
                                    border: isActive ? '1px solid rgba(224,115,74,0.2)' : '1px solid transparent',
                                    color: isActive ? 'var(--color-accent)' : 'var(--color-ink-soft)',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={e => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-paper-dim)';
                                  }}
                                  onMouseLeave={e => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                                    <Play size={10} style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-muted)', flexShrink: 0 }} />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isActive ? 700 : 500 }}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', marginLeft: 4 }}>
                                    {lesson.durationLabel}
                                  </span>
                                </button>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </aside>

        {/* RIGHT: Video Screen and Tabs Workspace */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
          
          {/* Custom Video Player area */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', backgroundColor: '#000', overflow: 'hidden' }}>
            <video
              ref={videoRef}
              src={activeLesson.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
            />

            {/* Custom Control Overlay */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
              padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
              zIndex: 10
            }}>
              {/* Progress track bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="range"
                  min="0"
                  max={videoDuration}
                  step="0.1"
                  value={videoTime}
                  onChange={handleSeek}
                  style={{
                    width: '100%', height: 4, borderRadius: 99,
                    cursor: 'pointer', outline: 'none', accentColor: 'var(--color-accent)'
                  }}
                />
              </div>

              {/* Control Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button onClick={togglePlay} style={{ color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none' }}>
                    {isPlaying ? <span style={{ fontWeight: 700, fontSize: 11, fontFamily: 'var(--font-mono)' }}>TẠM DỪNG</span> : <Play size={14} fill="#fff" />}
                  </button>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {formatVideoTime(videoTime)} / {formatVideoTime(videoDuration)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button 
                    onClick={changeRate} 
                    style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff',
                      border: '1px solid rgba(255,255,255,0.25)', borderRadius: 4,
                      padding: '2px 6px', fontSize: 10, cursor: 'pointer', backgroundColor: 'transparent'
                    }}
                  >
                    {playbackRate}x
                  </button>
                  <button style={{ color: '#fff', cursor: 'pointer', backgroundColor: 'transparent', border: 'none' }}>
                    <Maximize size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info & Workspace Section */}
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 24, flexGrow: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                {activeLesson.title}
              </h2>
              <p style={{ fontSize: 11, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                Định dạng bài học: {activeLesson.type.toUpperCase()}
              </p>
            </div>

            {/* Workspace tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Tab Header Selector */}
              <div style={{ borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 24 }}>
                <button
                  onClick={() => setActiveTab('documents')}
                  style={{
                    paddingBottom: 10, fontSize: 12, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: activeTab === 'documents' ? 'var(--color-accent)' : 'var(--color-ink-soft)',
                    borderBottom: activeTab === 'documents' ? '2px solid var(--color-accent)' : '2px solid transparent',
                    cursor: 'pointer', backgroundColor: 'transparent', borderLeft: 'none', borderRight: 'none', borderTop: 'none'
                  }}
                >
                  Tài liệu đính kèm
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  style={{
                    paddingBottom: 10, fontSize: 12, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: activeTab === 'notes' ? 'var(--color-accent)' : 'var(--color-ink-soft)',
                    borderBottom: activeTab === 'notes' ? '2px solid var(--color-accent)' : '2px solid transparent',
                    cursor: 'pointer', backgroundColor: 'transparent', borderLeft: 'none', borderRight: 'none', borderTop: 'none'
                  }}
                >
                  Ghi chú cá nhân
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'documents' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', border: '1px solid var(--color-border)',
                    borderRadius: 12, backgroundColor: 'var(--color-paper-raised)',
                    boxShadow: '0 2px 8px rgba(27,42,74,0.01)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FileText size={18} style={{ color: 'var(--color-accent)' }} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>Slide bài học & Tài nguyên.pdf</p>
                        <span style={{ fontSize: 10, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>PDF • 1.5 MB</span>
                      </div>
                    </div>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert('Tài liệu giả lập đã được tải xuống.'); }}
                      style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      Tải về
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Note Creator Input */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder={`Ghi chú tại ${formatVideoTime(videoTime)}...`}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      style={{
                        flexGrow: 1, borderRadius: 8, border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-paper-raised)', padding: '10px 12px',
                        fontSize: 12, color: 'var(--color-ink)', outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    />
                    <button
                      onClick={handleAddNote}
                      style={{
                        borderRadius: 8, backgroundColor: 'var(--color-accent)',
                        color: '#fff', fontSize: 12, fontWeight: 700, border: 'none',
                        padding: '10px 20px', cursor: 'pointer', transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-deep)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                    >
                      Ghi lại
                    </button>
                  </div>

                  {/* Notes List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {notes.map((note) => (
                      <div key={note.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        padding: '12px 14px', backgroundColor: 'rgba(236,234,224,0.3)',
                        border: '1px solid var(--color-border)', borderRadius: 10
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                            color: 'var(--color-accent)', backgroundColor: 'rgba(224,115,74,0.12)',
                            padding: '2px 8px', borderRadius: 4, alignSelf: 'flex-start'
                          }}>
                            {note.time}
                          </span>
                          <p style={{ fontSize: 12, color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>{note.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

      {/* Mobile navigation drawer */}
      {mobileNavOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150, display: 'flex' }}>
          {/* Backdrop */}
          <div
            onClick={() => setMobileNavOpen(false)}
            style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(27,42,74,0.45)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              animation: 'fade-in 0.2s ease-out'
            }}
          />
          {/* Drawer content */}
          <div style={{
            position: 'relative', width: 290, height: '100%',
            backgroundColor: 'var(--color-paper-raised)', borderRight: '1px solid var(--color-border)',
            boxShadow: '8px 0 32px rgba(27,42,74,0.15)', display: 'flex', flexDirection: 'column',
            animation: 'fade-up 0.25s ease-out', zIndex: 151, overflowY: 'auto'
          }}>
            {/* Drawer Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--color-border)', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-ink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Nội dung học tập
              </span>
              <button
                onClick={() => setMobileNavOpen(false)}
                style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--color-accent)',
                  padding: '4px 10px', borderRadius: 6, backgroundColor: 'rgba(224,115,74,0.12)',
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
            </div>
            
            {/* Drawer Curriculum */}
            <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {course.chapters
                  .sort((a, b) => a.order - b.order)
                  .map((chapter) => {
                    const isExpanded = expandedChapter === chapter.id;
                    return (
                      <div key={chapter.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button
                          onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', padding: '6px 0', textAlign: 'left',
                            fontSize: 12, fontWeight: 700, color: 'var(--color-ink)',
                            cursor: 'pointer', background: 'transparent', border: 'none'
                          }}
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '85%' }}>
                            {chapter.title}
                          </span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        {isExpanded && (
                          <div style={{
                            display: 'flex', flexDirection: 'column', gap: 6,
                            paddingLeft: 8, borderLeft: '1px solid var(--color-border)',
                            marginTop: 4
                          }}>
                            {chapter.lessons && chapter.lessons
                              .sort((a, b) => a.order - b.order)
                              .map((lesson) => {
                                const isActive = lesson.id === lessonId;
                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => {
                                      navigate(`/app/learn/${course.id}/${lesson.id}`);
                                      setMobileNavOpen(false);
                                    }}
                                    style={{
                                      width: '100%', display: 'flex', alignItems: 'center',
                                      justifyContent: 'space-between', padding: '8px 10px',
                                      borderRadius: 6, fontSize: 12, textAlign: 'left',
                                      backgroundColor: isActive ? 'rgba(224,115,74,0.08)' : 'transparent',
                                      border: isActive ? '1px solid rgba(224,115,74,0.2)' : '1px solid transparent',
                                      color: isActive ? 'var(--color-accent)' : 'var(--color-ink-soft)',
                                      cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                                      <Play size={10} style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-muted)', flexShrink: 0 }} />
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isActive ? 700 : 500 }}>
                                        {lesson.title}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', marginLeft: 4 }}>
                                      {lesson.durationLabel}
                                    </span>
                                  </button>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styled vertical layout stylesheet */}
      <style>{`
        .vertical-text {
          writing-mode: vertical-lr;
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}
