import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause,
  Maximize, 
  FileText, 
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ListVideo,
  Clock,
  Download,
  Plus,
  Trash2,
  Volume2
} from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';

export function LearningPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const course = useCourseStore((s) => s.courses.find((c) => c.id === courseId));

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'notes'>('overview');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState<any[]>([
    { id: 1, time: '01:15', content: 'Cần ghi nhớ cấu trúc thư mục của dự án và các alias path.' },
    { id: 2, time: '03:40', content: 'Phần kết nối Firestore rules rất quan trọng cho việc phân quyền.' }
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
      <div className="flex flex-col h-screen bg-paper items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-ink">Không tìm thấy khóa học</h2>
        <Link to="/app/dashboard" className="text-xs text-accent hover:underline font-semibold">Quay lại bảng điều khiển</Link>
      </div>
    );
  }

  const allLessons = course.chapters ? course.chapters.flatMap(c => c.lessons || []) : [];
  const activeLesson = allLessons.find(l => l.id === lessonId) || allLessons[0];

  if (!activeLesson) {
    return (
      <div className="flex flex-col h-screen bg-paper items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-ink">Chưa có bài học nào được tải lên</h2>
        <Link to={`/courses/${course.slug}`} className="text-xs text-accent hover:underline font-semibold">Quay lại chi tiết khóa học</Link>
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

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const seekToTime = (timeStr: string) => {
    const parts = timeStr.split(':').map(Number);
    let totalSecs = 0;
    if (parts.length === 2) {
      totalSecs = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      totalSecs = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (videoRef.current) {
      videoRef.current.currentTime = totalSecs;
      setVideoTime(totalSecs);
      if (!isPlaying) {
        videoRef.current.play().catch(err => console.log(err));
        setIsPlaying(true);
      }
    }
  };

  const handleToggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Safe percentage calculator
  const completedLessonsCount = allLessons.filter((_, idx) => idx < allLessons.indexOf(activeLesson)).length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedLessonsCount / allLessons.length) * 100) : 0;

  return (
    <div className="flex flex-col h-screen bg-paper font-body overflow-hidden">
      
      {/* Top Navbar */}
      <header className="h-14 border-b border-border bg-paper-raised flex items-center justify-between px-4 z-10 shrink-0 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <Link 
            to="/app/dashboard" 
            className="p-2 rounded-full bg-paper border border-border text-ink-soft hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="line-clamp-1 min-w-0">
            <h1 className="text-xs sm:text-sm font-extrabold text-ink leading-tight truncate">
              {course.title}
            </h1>
            <span className="text-[10px] text-muted font-mono leading-none block mt-0.5">
              {activeChapter?.title || 'Chương học'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-soft/10 border border-success/20 text-[10px] font-bold text-success font-mono">
            <Sparkles className="h-3 w-3" />
            Đã hoàn thành {completedLessonsCount}/{allLessons.length} bài ({progressPercent}%)
          </div>
          
          {/* Sidebar Toggle button on desktop */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-border rounded-xl text-xs font-bold text-ink-soft bg-paper hover:bg-paper-dim hover:text-ink transition-colors cursor-pointer"
          >
            <ListVideo className="h-4 w-4 text-muted" />
            {sidebarOpen ? 'Ẩn giáo trình' : 'Hiện giáo trình'}
          </button>

          {/* Mobile curriculum trigger */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden flex items-center justify-center gap-1.5 bg-accent text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-accent/95 cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Bài giảng
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT WORKSPACE: Video Player and Tabs Info */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-paper">
          
          {/* Custom Video Player wrapper */}
          <div className="relative w-full aspect-video bg-black overflow-hidden group shadow-md shrink-0">
            <video
              ref={videoRef}
              src={activeLesson.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"}
              className="w-full h-full object-contain cursor-pointer"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
            />

            {/* Custom Control Overlay (Udemy Style - fades on hover) */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 z-10">
              
              {/* Timeline seek range */}
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max={videoDuration}
                  step="0.1"
                  value={videoTime}
                  onChange={handleSeek}
                  className="w-full h-1 rounded-full cursor-pointer outline-none accent-accent bg-white/30 hover:h-1.5 transition-all duration-150"
                />
              </div>

              {/* Action buttons bar */}
              <div className="flex items-center justify-between text-white text-xs font-mono">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={togglePlay} 
                    className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer flex items-center justify-center"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <Volume2 className="h-4 w-4 text-white/80" />
                    <span>{formatVideoTime(videoTime)} / {formatVideoTime(videoDuration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={changeRate} 
                    className="border border-white/20 rounded-md px-2 py-0.5 text-[10px] font-bold text-white bg-white/5 hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    {playbackRate}x
                  </button>
                  <button 
                    onClick={handleToggleFullscreen}
                    className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab information details workspace */}
          <div className="p-6 space-y-6 flex-grow flex flex-col">
            
            {/* Active lesson title & format */}
            <div className="border-b border-border pb-4 space-y-1">
              <h2 className="text-base sm:text-lg font-extrabold text-ink leading-snug">
                {activeLesson.title}
              </h2>
              <span className="inline-flex px-2 py-0.5 rounded bg-paper border border-border text-[9px] font-bold text-muted uppercase font-mono tracking-wider">
                Định dạng: {activeLesson.type === 'video' ? 'Video học tập' : 'Tài liệu hướng dẫn'}
              </span>
            </div>

            {/* Udemy style Workspace tabs */}
            <div className="space-y-6 flex-grow flex flex-col">
              
              {/* Tab headers */}
              <div className="flex gap-6 border-b border-border text-xs font-bold uppercase tracking-wider text-ink-soft shrink-0">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'overview' ? 'border-accent text-accent' : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  Tổng quan khóa học
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`pb-3 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'documents' ? 'border-accent text-accent' : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  Tài liệu đính kèm
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-3 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'notes' ? 'border-accent text-accent' : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  Ghi chú bài giảng ({notes.length})
                </button>
              </div>

              {/* Tab components content */}
              <div className="flex-grow">
                
                {/* 1. Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-4 max-w-3xl animate-in fade-in duration-200 text-xs sm:text-sm text-ink-soft leading-relaxed">
                    <div className="space-y-2">
                      <h4 className="font-bold text-ink text-sm uppercase tracking-wide">Mô tả chi tiết bài học</h4>
                      <p>{course.shortDescription}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-paper border border-border space-y-3 mt-4">
                      <h5 className="font-bold text-ink text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-accent" />
                        Thông tin chương trình giảng dạy
                      </h5>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-soft">
                        <li>• Tổng số chương: <strong>{course.chapters?.length || 0} chương</strong></li>
                        <li>• Cấp độ: <strong className="uppercase">{course.level}</strong></li>
                        <li>• Chuyên mục: <strong className="capitalize">{course.category}</strong></li>
                        <li>• Đồng bộ tự động: <strong>Đã kết nối với Database</strong></li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-3 max-w-xl animate-in fade-in duration-200">
                    <div className="flex items-center justify-between p-4 bg-paper-raised border border-border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-accent/10 border border-accent/20 rounded-lg text-accent">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-ink text-xs sm:text-sm">Slide bài giảng & Mã nguồn mẫu.pdf</p>
                          <span className="text-[10px] text-muted font-mono">PDF • 2.4 MB</span>
                        </div>
                      </div>
                      <a 
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert('Tải xuống tài liệu học tập demo thành công.'); }}
                        className="inline-flex items-center gap-1 border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-ink hover:bg-paper transition-colors"
                      >
                        <Download className="h-3.5 w-3.5 text-muted" />
                        Tải về
                      </a>
                    </div>
                  </div>
                )}

                {/* 3. Notes Tab */}
                {activeTab === 'notes' && (
                  <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
                    {/* Add note input box */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Thêm ghi chú cá nhân tại ${formatVideoTime(videoTime)}...`}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="flex-1 bg-paper-raised border border-border rounded-xl px-3 py-2 text-xs text-ink placeholder-muted focus:outline-none focus:border-accent transition-colors"
                      />
                      <button
                        onClick={handleAddNote}
                        className="bg-accent text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-accent/95 transition-colors cursor-pointer shrink-0"
                      >
                        Ghi lại
                      </button>
                    </div>

                    {/* Notes listing */}
                    <div className="space-y-3">
                      {notes.length > 0 ? (
                        notes.map((note) => (
                          <div 
                            key={note.id} 
                            className="flex justify-between items-start p-4 bg-paper border border-border rounded-xl hover:border-accent/20 transition-all duration-200"
                          >
                            <div className="space-y-2">
                              {/* Clickable timestamp tag */}
                              <button
                                onClick={() => seekToTime(note.time)}
                                className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-accent bg-accent/10 hover:bg-accent/20 border border-accent/20 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                                title="Click để tua video đến mốc này"
                              >
                                <Play className="h-2.5 w-2.5 fill-accent" />
                                {note.time}
                              </button>
                              <p className="text-xs text-ink-soft leading-relaxed">{note.content}</p>
                            </div>
                            
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 rounded hover:bg-paper-dim text-muted hover:text-danger transition-colors cursor-pointer"
                              title="Xóa ghi chú"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-ink-soft/60">
                          <p className="text-xs">Chưa có ghi chú nào trong bài học này.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </main>

        {/* RIGHT WORKSPACE: Collapsible Curriculum Sidebar (Desktop only) */}
        <aside 
          style={{
            width: sidebarOpen ? '320px' : '0px',
            borderLeftWidth: sidebarOpen ? '1px' : '0px',
          }}
          className="hidden md:flex flex-col border-border bg-paper-raised shrink-0 overflow-y-auto transition-all duration-300 z-10"
        >
          {sidebarOpen && (
            <div className="p-4 flex flex-col gap-4 h-full animate-in fade-in duration-200">
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-muted select-none">
                Danh mục bài học
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {course.chapters
                  .sort((a, b) => a.order - b.order)
                  .map((chapter) => {
                    const isExpanded = expandedChapter === chapter.id;
                    return (
                      <div key={chapter.id} className="space-y-1">
                        <button
                          onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                          className="w-full flex items-center justify-between py-2 text-left font-bold text-ink text-xs hover:text-accent transition-colors cursor-pointer"
                        >
                          <span className="truncate max-w-[85%]">{chapter.title}</span>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>

                        {isExpanded && (
                          <div className="pl-3 border-l border-border mt-1 space-y-1.5 animate-in slide-in-from-left-1 duration-150">
                            {chapter.lessons && chapter.lessons
                              .sort((a, b) => a.order - b.order)
                              .map((lesson) => {
                                const isActive = lesson.id === lessonId;
                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => navigate(`/app/learn/${course.id}/${lesson.id}`)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all border ${
                                      isActive 
                                        ? 'bg-accent/10 border-accent/20 text-accent font-bold' 
                                        : 'bg-transparent border-transparent text-ink-soft hover:bg-paper hover:text-ink'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <Play className={`h-3 w-3 shrink-0 ${isActive ? 'text-accent fill-accent' : 'text-muted'}`} />
                                      <span className="truncate">{lesson.title}</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-muted pl-2 shrink-0">{lesson.durationLabel}</span>
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
          )}
        </aside>

      </div>

      {/* Mobile Drawer ( Curriculum sidebar on small screens ) */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Drawer content */}
          <div className="relative w-72 h-full bg-paper-raised border-r border-border shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                Danh sách bài giảng
              </span>
              <button 
                onClick={() => setMobileNavOpen(false)}
                className="text-xs font-bold text-accent px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {course.chapters
                .sort((a, b) => a.order - b.order)
                .map((chapter) => {
                  const isExpanded = expandedChapter === chapter.id;
                  return (
                    <div key={chapter.id} className="space-y-1">
                      <button
                        onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                        className="w-full flex items-center justify-between py-1.5 text-left font-bold text-ink text-xs hover:text-accent transition-colors cursor-pointer"
                      >
                        <span className="truncate max-w-[85%]">{chapter.title}</span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="pl-3 border-l border-border mt-1 space-y-1.5">
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
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all border ${
                                    isActive 
                                      ? 'bg-accent/10 border-accent/20 text-accent font-bold' 
                                      : 'bg-transparent border-transparent text-ink-soft hover:bg-paper hover:text-ink'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <Play className={`h-3 w-3 shrink-0 ${isActive ? 'text-accent fill-accent' : 'text-muted'}`} />
                                    <span className="truncate">{lesson.title}</span>
                                  </div>
                                  <span className="text-[9px] font-mono text-muted pl-2 shrink-0">{lesson.durationLabel}</span>
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
      )}

    </div>
  );
}
