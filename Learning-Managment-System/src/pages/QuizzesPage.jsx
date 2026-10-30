// src/pages/QuizzesPage.jsx
import { Link } from 'react-router-dom';
import {
  Clock,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import { QUIZZES_DATA } from '../data/quizzes';
import Badge from '../components/common/Badge';

export default function QuizzesPage() {
  const { getQuizResult } = useLMS();

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Course Quizzes & Assessments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Evaluate your theoretical and practical comprehension through standardized module assessments.
        </p>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUIZZES_DATA.map((quiz) => {
          const pastResult = getQuizResult(quiz.id);
          const hasTaken = !!pastResult;

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded truncate">
                    {quiz.courseName.split(' ')[0]}
                  </span>
                  {hasTaken ? (
                    <Badge variant={pastResult.passed ? 'success' : 'danger'} size="xs">
                      {pastResult.passed ? `Passed (${pastResult.score}%)` : `Failed (${pastResult.score}%)`}
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="xs">
                      Not Attempted
                    </Badge>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {quiz.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {quiz.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quiz.durationMinutes} min limit</span>
                  </span>
                  <span>{quiz.totalQuestions} Questions</span>
                  <span>Pass: {quiz.passingScore}%</span>
                </div>

                <Link
                  to={`/quizzes/${quiz.id}`}
                  className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
                    hasTaken
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                  }`}
                >
                  {hasTaken ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </>
                  ) : (
                    <>
                      <span>Start Assessment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
