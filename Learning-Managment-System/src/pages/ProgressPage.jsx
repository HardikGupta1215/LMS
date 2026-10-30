// src/pages/ProgressPage.jsx
import { Link } from 'react-router-dom';
import {
  Award,
  Clock,
  CheckCircle2,
  Target,
} from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import { COURSES_DATA } from '../data/courses';
import ProgressBar from '../components/common/ProgressBar';

export default function ProgressPage() {
  const { enrolledCourseIds, getCourseProgress, getOverallStats, completedLessons } = useLMS();
  const stats = getOverallStats();

  const enrolledCourses = COURSES_DATA.filter((c) =>
    enrolledCourseIds.includes(c.id)
  ).map((course) => {
    const progress = getCourseProgress(course.id);
    const completedCount = completedLessons[course.id]?.length || 0;
    return {
      ...course,
      progress,
      completedCount,
    };
  });

  const skills = [
    { name: 'React 19 & Component Architecture', level: 'Advanced', percent: 85 },
    { name: 'Relational Database SQL & Normalization', level: 'Advanced', percent: 90 },
    { name: 'Data Structures & Big-O Complexity', level: 'Intermediate', percent: 75 },
    { name: 'Python Object-Oriented Programming', level: 'Mastered', percent: 100 },
    { name: 'Machine Learning Gradient Descent', level: 'Beginner', percent: 35 },
    { name: 'TCP/IP & Transport Networking', level: 'Beginner', percent: 25 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Academic Progress & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed metrics evaluating your module completions, study hours, and subject proficiencies.
        </p>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Degree Progress</span>
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">68%</p>
          <p className="text-[11px] text-slate-500">Semester target: 80%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Study Time</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.learningHours} Hours</p>
          <p className="text-[11px] text-slate-500">Across 4 courses</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Lectures Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.totalCompletedLessonsCount} Lectures</p>
          <p className="text-[11px] text-slate-500">Verified video milestones</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500 uppercase">Assessment Avg</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.avgQuizScore}%</p>
          <p className="text-[11px] text-slate-500">Above department average</p>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Course-wise Completion Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Course-wise Milestone Breakdown
            </h2>

            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                        {course.code}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {course.instructor.name} • {course.totalLessons} Total Lessons
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-blue-700">
                        {course.progress}%
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {course.completedCount} / {course.totalLessons} Done
                      </p>
                    </div>
                  </div>

                  <ProgressBar
                    value={course.progress}
                    size="sm"
                    color={course.progress >= 100 ? 'emerald' : 'primary'}
                  />

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">
                      Status:{' '}
                      <strong className={course.progress >= 100 ? 'text-emerald-700' : 'text-blue-700'}>
                        {course.progress >= 100 ? 'Completed' : 'In Progress'}
                      </strong>
                    </span>
                    <Link
                      to={`/courses/${course.id}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      View Lectures →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Skill Competencies */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">
              Technical Skill Competencies
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated based on completed lessons, quiz scores, and submitted assignments.
            </p>

            <div className="space-y-3.5 pt-2">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{skill.name}</span>
                    <span className="font-semibold text-slate-500">{skill.level}</span>
                  </div>
                  <ProgressBar
                    value={skill.percent}
                    size="sm"
                    color={skill.percent >= 90 ? 'emerald' : 'primary'}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
            <p className="font-bold text-blue-400">Academic Advising Note</p>
            <p className="text-slate-300 leading-relaxed">
              Your weekly study trajectory meets the honors program threshold. Maintain your 6-day streak to qualify for the Dean's Academic List.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
