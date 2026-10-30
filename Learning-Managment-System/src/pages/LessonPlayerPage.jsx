import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileText,
  Download,
  Check,
} from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import { COURSES_DATA } from '../data/courses';

export default function LessonPlayerPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const {
    isEnrolled,
    enrollCourse,
    isLessonCompleted,
    markLessonComplete,
    setLastAccessedLesson,
    getCourseProgress,
  } = useLMS();

  const course = COURSES_DATA.find((c) => c.id === courseId);

  // Flatten all lessons across modules
  const allLessons = course?.modules?.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title }))
  ) || [];

  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];

  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  // Video player custom controls state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'transcript' | 'resources'
  const [showCompletionNotice, setShowCompletionNotice] = useState(false);

  // Ensure enrolled and track last accessed
  useEffect(() => {
    if (course && !isEnrolled(course.id)) {
      enrollCourse(course.id);
    }
    if (course && lessonId) {
      setLastAccessedLesson(course.id, lessonId);
    }
  }, [course, lessonId, isEnrolled, enrollCourse, setLastAccessedLesson]);

  if (!course || !currentLesson) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Lesson Not Found</h2>
        <Link
          to={`/courses/${courseId || ''}`}
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Return to Course Details
        </Link>
      </div>
    );
  }

  const isCompleted = isLessonCompleted(course.id, currentLesson.id);
  const progressPercent = getCourseProgress(course.id);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e) => {
    const target = parseFloat(e.target.value);
    setCurrentTime(target);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleToggleComplete = () => {
    markLessonComplete(course.id, currentLesson.id);
    if (!isCompleted) {
      setShowCompletionNotice(true);
      setTimeout(() => setShowCompletionNotice(false), 3000);
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/courses/${course.id}/lesson/${nextLesson.id}`);
    }
  };

  const handlePrevLesson = () => {
    if (prevLesson) {
      navigate(`/courses/${course.id}/lesson/${prevLesson.id}`);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Course Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{course.code}: {course.title}</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {currentLesson.title}
          </h1>
        </div>

        {/* Course completion badge */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <p className="text-slate-500">Course Progress</p>
            <p className="font-bold text-slate-900">{progressPercent}% Completed</p>
          </div>
        </div>
      </div>

      {/* Main Learning Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video Player & Tabs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Custom Video Player Container */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-md border border-slate-900 relative group">
            <video
              ref={videoRef}
              src={currentLesson.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                if (!isCompleted) markLessonComplete(course.id, currentLesson.id);
                setIsPlaying(false);
              }}
              className="w-full aspect-video object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {/* Floating Play Button Overlay when paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 ml-1 fill-white" />
                </div>
              </div>
            )}

            {/* Video Controls Bar */}
            <div className="p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white space-y-2">
              {/* Progress Scrubber */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-1 hover:text-blue-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1 hover:text-blue-400 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-[11px] text-slate-300 font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speed options */}
                  {[1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        playbackSpeed === spd
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Player Action Buttons Bar */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevLesson}
              disabled={!prevLesson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Mark as Completed Button */}
            <button
              type="button"
              onClick={handleToggleComplete}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextLesson}
              disabled={!nextLesson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span>Next Lesson</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Completion Toast Banner */}
          {showCompletionNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Lesson marked as completed! Course progress updated.</span>
              </div>
              {nextLesson && (
                <button
                  type="button"
                  onClick={handleNextLesson}
                  className="font-bold text-emerald-900 underline hover:no-underline"
                >
                  Go to next lesson →
                </button>
              )}
            </div>
          )}

          {/* Lesson Content Tabs */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="flex items-center border-b border-slate-200 px-4">
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'notes'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Lecture Notes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('transcript')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'transcript'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Summary & Transcript
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('resources')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'resources'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Attachments ({currentLesson.resources?.length || 0})
              </button>
            </div>

            <div className="p-5 text-xs text-slate-700 leading-relaxed">
              {activeTab === 'notes' && (
                <div className="space-y-3 whitespace-pre-line font-mono bg-slate-50 p-4 rounded-lg border border-slate-200/70 text-slate-800">
                  {currentLesson.notes || 'No lecture notes uploaded for this module.'}
                </div>
              )}

              {activeTab === 'transcript' && (
                <div className="space-y-3">
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {currentLesson.summary}
                  </p>
                  <p className="text-slate-500 text-[11px] italic">
                    Automated transcript synchronized with video timestamps.
                  </p>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-2">
                  {currentLesson.resources && currentLesson.resources.length > 0 ? (
                    currentLesson.resources.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-slate-800">{file}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert(`Downloaded ${file} (Demo)`)}
                          className="p-1 text-slate-500 hover:text-blue-600"
                          title="Download Resource"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">No supplementary files attached.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Course Curriculum Playlist */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Course Playlist
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {allLessons.length} lessons • Click to jump to lecture
              </p>
            </div>

            <div className="max-h-[580px] overflow-y-auto divide-y divide-slate-100">
              {allLessons.map((les, index) => {
                const isCurrent = les.id === currentLesson.id;
                const completed = isLessonCompleted(course.id, les.id);
                return (
                  <Link
                    key={les.id}
                    to={`/courses/${course.id}/lesson/${les.id}`}
                    className={`flex items-start gap-3 p-3.5 transition-colors block text-left ${
                      isCurrent
                        ? 'bg-blue-50/80 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-medium leading-snug line-clamp-2 ${
                          isCurrent ? 'text-blue-900 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {les.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        {les.duration}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
