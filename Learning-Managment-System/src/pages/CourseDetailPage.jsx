// src/pages/CourseDetailPage.jsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Clock,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import { COURSES_DATA } from '../data/courses';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    isEnrolled,
    enrollCourse,
    getCourseProgress,
    isLessonCompleted,
    getLastAccessedLesson,
  } = useLMS();

  const course = COURSES_DATA.find((c) => c.id === courseId);

  // Expand all sections by default or track open modules
  const [expandedModules, setExpandedModules] = useState({ 'mod-1': true, 'mod-dsa-1': true, 'mod-db-1': true, 'mod-ml-1': true, 'mod-net-1': true, 'mod-py-1': true });

  if (!course) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Course Not Found</h2>
        <p className="text-xs text-slate-500">The requested course could not be located in the catalog.</p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const enrolled = isEnrolled(course.id);
  const progress = enrolled ? getCourseProgress(course.id) : 0;
  const lastLessonId = getLastAccessedLesson(course.id);
  const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id || null;

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handleEnroll = () => {
    enrollCourse(course.id);
    if (firstLessonId) {
      navigate(`/courses/${course.id}/lesson/${firstLessonId}`);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb */}
      <div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Course Catalog</span>
        </Link>
      </div>

      {/* Main Course Header Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          {/* Left info column */}
          <div className="space-y-4 max-w-3xl flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {course.code}
              </span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                {course.category}
              </span>
              <Badge variant={course.level === 'Beginner' ? 'success' : course.level === 'Intermediate' ? 'primary' : 'purple'} size="xs">
                {course.level}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {course.description}
            </p>

            {/* Meta statistics */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 pt-2">
              <div className="flex items-center gap-1 font-semibold text-slate-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal">({course.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>{course.totalLessons} total lessons</span>
              </div>
            </div>

            {/* Instructor snippet */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {course.instructor.name}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {course.instructor.title} • {course.instructor.department}
                </p>
              </div>
            </div>
          </div>

          {/* Right Enrollment / Progress Widget */}
          <div className="w-full lg:w-72 bg-slate-50 rounded-xl border border-slate-200/90 p-5 space-y-4 shrink-0">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full aspect-video object-cover rounded-lg border border-slate-200"
            />

            {enrolled ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Your Progress</span>
                  <span className="font-bold text-blue-700">{progress}%</span>
                </div>
                <ProgressBar value={progress} color={progress >= 100 ? 'emerald' : 'primary'} />
                <Link
                  to={lastLessonId ? `/courses/${course.id}/lesson/${lastLessonId}` : `/courses/${course.id}/lesson/${firstLessonId}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{progress >= 100 ? 'Review Lectures' : 'Continue Course'}</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-900">Open for Enrollment</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Includes full video lectures, notes, code files, and certificate.</p>
                </div>
                <button
                  type="button"
                  onClick={handleEnroll}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Enroll in Course</span>
                </button>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200/70 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>University Certified Curriculum</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>Certificate upon 100% completion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Overview & Learning Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Syllabus Modules & Learning Outcomes */}
        <div className="lg:col-span-2 space-y-8">
          {/* What You'll Learn */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Learning Outcomes & Objectives
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              {course.learningOutcomes.map((point, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Syllabus Modules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Curriculum & Lecture Syllabus
                </h2>
                <p className="text-xs text-slate-500">
                  {course.modules.length} Modules • {course.totalLessons} Lectures • Self-paced
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-2xs">
              {course.modules.map((module) => {
                const isExpanded = !!expandedModules[module.id];
                return (
                  <div key={module.id}>
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-xs sm:text-sm font-semibold text-slate-900">
                          {module.title}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {module.lessons.length} lessons
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="bg-slate-50/60 px-4 py-2 space-y-1 divide-y divide-slate-100/80">
                        {module.lessons.map((lesson, lesIndex) => {
                          const completed = isLessonCompleted(course.id, lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              className="py-2.5 px-2 flex items-center justify-between gap-3 hover:bg-white rounded-md transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                {completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className="text-xs text-slate-800 truncate">
                                  {lesIndex + 1}. {lesson.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {lesson.duration}
                                </span>
                                {enrolled ? (
                                  <Link
                                    to={`/courses/${course.id}/lesson/${lesson.id}`}
                                    className="text-xs font-semibold text-blue-600 hover:underline"
                                  >
                                    Watch
                                  </Link>
                                ) : (
                                  <span className="text-[11px] text-slate-400">Locked</span>
                                )}
                              </div>
                            </div>
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

        {/* Right 1 Col: Prerequisites & Instructor Details */}
        <div className="space-y-6">
          {/* Prerequisites */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Prerequisites
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {course.prerequisites.map((prereq, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructor Bio */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Faculty Instructor
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{course.instructor.name}</p>
                <p className="text-[11px] text-blue-600 font-medium">{course.instructor.title}</p>
                <p className="text-[11px] text-slate-400">{course.instructor.department}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              Active researcher and lead lecturer with 12+ years of teaching distributed systems and software engineering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
