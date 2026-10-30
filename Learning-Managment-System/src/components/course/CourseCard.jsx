// src/components/course/CourseCard.jsx
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Star, PlayCircle, ArrowRight } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';

export default function CourseCard({ course }) {
  const { isEnrolled, getCourseProgress, getLastAccessedLesson } = useLMS();

  const enrolled = isEnrolled(course.id);
  const progress = enrolled ? getCourseProgress(course.id) : 0;
  const lastLessonId = getLastAccessedLesson(course.id);

  const levelVariant = {
    Beginner: 'success',
    Intermediate: 'primary',
    Advanced: 'purple',
  }[course.level] || 'default';

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 group">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
            {course.code}
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <Badge variant={levelVariant} size="xs" className="bg-white/95 backdrop-blur-xs shadow-2xs">
            {course.level}
          </Badge>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <span className="text-slate-500 font-medium">{course.category}</span>
          <div className="flex items-center gap-1 font-semibold text-slate-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{course.rating}</span>
            <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
          </div>
        </div>

        {/* Course Title */}
        <Link
          to={`/courses/${course.id}`}
          className="font-semibold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition-colors mb-2 line-clamp-2"
        >
          {course.title}
        </Link>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-xs text-slate-600 truncate">{course.instructor.name}</span>
        </div>

        {/* Meta Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100 mt-auto mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.duration}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.totalLessons} lessons</span>
          </div>
        </div>

        {/* Enrolled Status / Progress OR CTA */}
        {enrolled ? (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Progress</span>
              <span className="font-semibold text-blue-600">{progress}%</span>
            </div>
            <ProgressBar value={progress} size="sm" color={progress >= 100 ? 'emerald' : 'primary'} />
            <div className="pt-1">
              <Link
                to={lastLessonId ? `/courses/${course.id}/lesson/${lastLessonId}` : `/courses/${course.id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>{progress >= 100 ? 'Review Course' : 'Continue Learning'}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-slate-100">
            <Link
              to={`/courses/${course.id}`}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              <span>View Course</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
