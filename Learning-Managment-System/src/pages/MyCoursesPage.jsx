// src/pages/MyCoursesPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookMarked,
  PlayCircle,
  Award,
  Clock,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import { COURSES_DATA } from '../data/courses';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

export default function MyCoursesPage() {
  const { enrolledCourseIds, getCourseProgress, getLastAccessedLesson } = useLMS();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in_progress' | 'completed'

  const enrolledCourses = COURSES_DATA.filter((c) =>
    enrolledCourseIds.includes(c.id)
  ).map((course) => {
    const progress = getCourseProgress(course.id);
    const lastLessonId = getLastAccessedLesson(course.id);
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const lastLesson = allLessons.find((l) => l.id === lastLessonId) || allLessons[0];
    return {
      ...course,
      progress,
      lastLesson,
      isCompleted: progress >= 100,
    };
  });

  const inProgressCourses = enrolledCourses.filter((c) => !c.isCompleted);
  const completedCourses = enrolledCourses.filter((c) => c.isCompleted);

  const displayedCourses =
    activeTab === 'in_progress'
      ? inProgressCourses
      : activeTab === 'completed'
      ? completedCourses
      : enrolledCourses;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your registered coursework, track lesson milestones, and access study materials.
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors self-start sm:self-auto"
        >
          <span>Explore More Courses</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>All Registered</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold">
            {enrolledCourses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('in_progress')}
          className={`pb-3 px-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'in_progress'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>In Progress</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
            {inProgressCourses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'completed'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Completed</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
            {completedCourses.length}
          </span>
        </button>
      </div>

      {/* Courses List */}
      {displayedCourses.length > 0 ? (
        <div className="space-y-4">
          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Column: Image + Info */}
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-20 h-20 sm:w-28 sm:h-20 rounded-lg object-cover shrink-0 border border-slate-100"
                />
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <Badge variant={course.level === 'Beginner' ? 'success' : course.level === 'Intermediate' ? 'primary' : 'purple'} size="xs">
                      {course.level}
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 truncate">{course.instructor.name}</span>
                  </div>

                  <Link
                    to={`/courses/${course.id}`}
                    className="font-bold text-base text-slate-900 hover:text-blue-600 transition-colors block truncate"
                  >
                    {course.title}
                  </Link>

                  <p className="text-xs text-slate-500 truncate">
                    Last active lesson: <strong className="text-slate-700 font-medium">{course.lastLesson?.title}</strong>
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{course.totalLessons} lessons total</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Progress & CTA */}
              <div className="w-full lg:w-64 space-y-2.5 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Completion</span>
                  <span className="font-bold text-slate-900">{course.progress}%</span>
                </div>

                <ProgressBar
                  value={course.progress}
                  size="sm"
                  color={course.progress >= 100 ? 'emerald' : 'primary'}
                />

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Link
                    to={`/courses/${course.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Syllabus
                  </Link>

                  {course.isCompleted ? (
                    <Link
                      to="/certificates"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificate</span>
                    </Link>
                  ) : (
                    <Link
                      to={`/courses/${course.id}/lesson/${course.lastLesson?.id || 'les-101'}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-2xs"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Continue</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookMarked}
          title={
            activeTab === 'completed'
              ? 'No completed courses yet'
              : 'No courses in this category'
          }
          description="Complete all lessons in your enrolled courses to earn verified academic certificates."
          action={
            <Link
              to="/courses"
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <span>Explore Course Catalog</span>
            </Link>
          }
        />
      )}
    </div>
  );
}
