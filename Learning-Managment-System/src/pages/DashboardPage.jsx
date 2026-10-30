// src/pages/DashboardPage.jsx
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  PlayCircle,
  FileText,
  HelpCircle,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import { COURSES_DATA } from '../data/courses';
import { RECENT_ACTIVITIES_DATA, WEEKLY_STUDY_DATA } from '../data/activity';
import ProgressBar from '../components/common/ProgressBar';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    enrolledCourseIds,
    getCourseProgress,
    getLastAccessedLesson,
    assignments,
    quizzes,
    getOverallStats,
  } = useLMS();

  const stats = getOverallStats();

  // Get enrolled courses with progress
  const enrolledCourses = COURSES_DATA.filter((c) =>
    enrolledCourseIds.includes(c.id)
  ).map((course) => {
    const progress = getCourseProgress(course.id);
    const lastLessonId = getLastAccessedLesson(course.id);
    // Find lesson details
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const lastLesson = allLessons.find((l) => l.id === lastLessonId) || allLessons[0];
    return {
      ...course,
      progress,
      lastLesson,
    };
  });

  // Filter in-progress courses (progress < 100) first, limited to 3 for clean view
  const activeCourses = enrolledCourses
    .filter((c) => c.progress < 100)
    .slice(0, 3);

  // Fallback to all if none in progress
  const displayContinueCourses = activeCourses.length > 0 ? activeCourses : enrolledCourses.slice(0, 2);

  // Upcoming items: pending assignments and upcoming quizzes
  const pendingAssignments = assignments
    .filter((a) => a.status === 'Pending')
    .slice(0, 2);

  const availableQuizzes = quizzes.slice(0, 2);

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Find maximum hours for SVG chart scaling
  const maxStudyHour = Math.max(...WEEKLY_STUDY_DATA.map((d) => d.hours), 6);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Student Workspace
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {user?.department || 'Computer Science & Engineering'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {greeting}, {user?.name?.split(' ')[0] || 'Hardik'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Continue where you left off in your semester coursework.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-slate-900 leading-none">
              {stats.enrolledCount}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1 truncate">
              Enrolled Courses
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-slate-900 leading-none">
              {stats.completedCoursesCount}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1 truncate">
              Completed Courses
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-slate-900 leading-none">
              {stats.learningHours} hrs
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1 truncate">
              Study Time Logged
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-slate-900 leading-none">
              {stats.currentStreak} Days
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1 truncate">
              Learning Streak
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Continue Learning & Weekly Analytics & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Continue Learning */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Continue Learning
                </h2>
                <p className="text-xs text-slate-500">
                  Pick up right where you paused your lectures
                </p>
              </div>
              <Link
                to="/my-courses"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all ({enrolledCourses.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Course Rows */}
            <div className="space-y-3">
              {displayContinueCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Course Info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0 border border-slate-100"
                    />
                    <div className="min-w-0 space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                          {course.code}
                        </span>
                        <span className="text-xs text-slate-500 truncate">
                          {course.instructor.name}
                        </span>
                      </div>
                      <Link
                        to={`/courses/${course.id}`}
                        className="font-semibold text-sm text-slate-900 hover:text-blue-600 transition-colors block truncate"
                      >
                        {course.title}
                      </Link>
                      <p className="text-xs text-slate-500 truncate">
                        Current Lesson:{' '}
                        <span className="text-slate-700 font-medium">
                          {course.lastLesson?.title || 'Course Introduction'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Progress bar & Action button */}
                  <div className="w-full sm:w-56 space-y-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Course Progress</span>
                      <span className="font-bold text-slate-900">
                        {course.progress}%
                      </span>
                    </div>
                    <ProgressBar
                      value={course.progress}
                      size="sm"
                      color={course.progress >= 100 ? 'emerald' : 'primary'}
                    />
                    <div className="pt-1 flex justify-end">
                      <Link
                        to={`/courses/${course.id}/lesson/${course.lastLesson?.id || 'les-101'}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Weekly Study Time Activity Chart */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Weekly Study Activity
                </h3>
                <p className="text-xs text-slate-500">
                  Total study time logged this week: <strong className="text-slate-800">30.1 hours</strong>
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                +14% vs last week
              </span>
            </div>

            {/* Custom Bar Chart Visualization */}
            <div className="pt-4">
              <div className="h-36 flex items-end gap-3 sm:gap-6 border-b border-slate-200 pb-2 px-2">
                {WEEKLY_STUDY_DATA.map((item) => {
                  const heightPercent = Math.round((item.hours / maxStudyHour) * 100);
                  const isToday = item.day === 'Fri';
                  return (
                    <div
                      key={item.day}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                    >
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-700 transition-colors font-medium">
                        {item.label}
                      </span>
                      <div
                        className={`w-full max-w-[36px] rounded-t-md transition-all duration-300 ${
                          isToday
                            ? 'bg-blue-600 shadow-2xs'
                            : 'bg-slate-200 group-hover:bg-blue-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span
                        className={`text-xs font-medium ${
                          isToday ? 'text-blue-700 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-1">
                <span>0 hrs</span>
                <span>Daily average: 4.3 hrs</span>
                <span>Goal: 4.0 hrs/day</span>
              </div>
            </div>
          </div>

          {/* Section: Recent Activity Timeline */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Academic Activity
              </h3>
              <Link
                to="/progress"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View Full Audit
              </Link>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {RECENT_ACTIVITIES_DATA.map((activity) => (
                <div key={activity.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-600 shadow-2xs" />
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900">
                      {activity.title}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {activity.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Deadlines, Quizzes & Academic Notice */}
        <div className="space-y-6">
          {/* Upcoming Assignment Deadlines */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Upcoming Deadlines
                </h3>
              </div>
              <Link
                to="/assignments"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                All ({assignments.length})
              </Link>
            </div>

            <div className="space-y-3">
              {pendingAssignments.length > 0 ? (
                pendingAssignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                        {asg.courseName.split(' ')[0]}
                      </span>
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Due {asg.dueDate}
                      </span>
                    </div>
                    <Link
                      to="/assignments"
                      className="text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 block leading-snug"
                    >
                      {asg.title}
                    </Link>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>{asg.points} Points</span>
                      <Link
                        to="/assignments"
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Submit work →
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-2">
                  No pending assignments due this week.
                </p>
              )}
            </div>
          </div>

          {/* Available Quizzes */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Course Quizzes
                </h3>
              </div>
              <Link
                to="/quizzes"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View ({quizzes.length})
              </Link>
            </div>

            <div className="space-y-3">
              {availableQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1.5"
                >
                  <p className="text-[11px] text-slate-500 truncate">
                    {quiz.courseName}
                  </p>
                  <Link
                    to={`/quizzes/${quiz.id}`}
                    className="text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 block leading-snug"
                  >
                    {quiz.title}
                  </Link>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>
                      {quiz.totalQuestions} Questions • {quiz.durationMinutes} min
                    </span>
                    <Link
                      to={`/quizzes/${quiz.id}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Start Quiz →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Integrity / Student Support Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Academic Notice
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Midterm exam schedules and project guidelines are published. Complete all module assessments to unlock course completion certificates.
            </p>
            <div className="pt-1">
              <Link
                to="/certificates"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>View My Certificates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
