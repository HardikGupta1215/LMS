// src/pages/QuizDetailPage.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  XCircle,
  RotateCcw,
  Award,
  Check,
} from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import { QUIZZES_DATA } from '../data/quizzes';

export default function QuizDetailPage() {
  const { quizId } = useParams();
  const { submitQuizResult } = useLMS();

  const quiz = QUIZZES_DATA.find((q) => q.id === quizId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedOptionIndex }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  if (!quiz) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Quiz Not Found</h2>
        <Link to="/quizzes" className="text-xs font-semibold text-blue-600 hover:underline">
          Return to Quizzes
        </Link>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleSelectOption = (optionIndex) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const result = {
      quizId: quiz.id,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      userAnswers,
    };

    setScoreResult(result);
    setIsSubmitted(true);
    submitQuizResult(quiz.id, result);
  };

  const handleRetake = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setScoreResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Quizzes</span>
        </Link>
      </div>

      {/* Quiz Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
            {quiz.courseName}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{quiz.durationMinutes} Minutes Allotted</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {quiz.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">{quiz.description}</p>
      </div>

      {/* Quiz Body */}
      {!isSubmitted ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
          {/* Progress Tracker Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Question <strong className="text-slate-900">{currentQuestionIndex + 1}</strong> of {quiz.questions.length}
              </span>
              <span>
                {answeredCount} of {quiz.questions.length} Answered
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
              {quiz.questions.map((q, i) => (
                <div
                  key={q.id}
                  className={`h-full flex-1 rounded-full transition-colors ${
                    i === currentQuestionIndex
                      ? 'bg-blue-600'
                      : userAnswers[q.id] !== undefined
                      ? 'bg-blue-300'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 text-slate-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={answeredCount < quiz.questions.length}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-40 disabled:pointer-events-none shadow-2xs transition-colors cursor-pointer"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(prev + 1, quiz.questions.length - 1)
                  )
                }
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Answer Explanations Review */
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Score Header Card */}
          <div
            className={`p-6 rounded-xl border text-center space-y-3 ${
              scoreResult.passed
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/70 border-rose-200 text-rose-900'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto text-white shadow-2xs ${
                scoreResult.passed ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            >
              {scoreResult.passed ? <Award className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>

            <h2 className="text-xl font-bold">
              {scoreResult.passed ? 'Assessment Passed!' : 'Assessment Incomplete'}
            </h2>

            <p className="text-xs sm:text-sm">
              You answered <strong>{scoreResult.correctCount} of {scoreResult.totalQuestions}</strong> questions correctly ({scoreResult.score}%). Passing threshold was {quiz.passingScore}%.
            </p>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
              <Link
                to="/quizzes"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <span>Back to Quizzes</span>
              </Link>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Review Question Breakdown & Explanations
            </h3>

            <div className="space-y-4">
              {quiz.questions.map((q, index) => {
                const userChoice = userAnswers[q.id];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        {index + 1}. {q.question}
                      </h4>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                          <Check className="w-3 h-3" />
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded shrink-0">
                          <XCircle className="w-3 h-3" />
                          Incorrect
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isUserSelected = userChoice === optIdx;
                        const isActualCorrect = q.correctAnswer === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                              isActualCorrect
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-medium'
                                : isUserSelected
                                ? 'bg-rose-50/80 border-rose-300 text-rose-900'
                                : 'bg-slate-50/50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>{opt}</span>
                            {isActualCorrect && (
                              <span className="text-[10px] font-bold text-emerald-700">Correct Answer</span>
                            )}
                            {isUserSelected && !isActualCorrect && (
                              <span className="text-[10px] font-bold text-rose-700">Your Selection</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
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
