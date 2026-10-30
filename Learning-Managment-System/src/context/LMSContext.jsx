// src/context/LMSContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { COURSES_DATA } from '../data/courses';
import { ASSIGNMENTS_DATA } from '../data/assignments';
import { QUIZZES_DATA } from '../data/quizzes';

const LMSContext = createContext(null);

const INITIAL_STATE = {
  enrolledCourseIds: [
    'cs101-web-development',
    'cs201-data-structures-algorithms',
    'cs301-database-systems',
    'cs102-python-programming', // fully completed demo course
  ],
  completedLessons: {
    'cs101-web-development': ['les-101', 'les-102'],
    'cs201-data-structures-algorithms': ['les-201', 'les-202', 'les-203'],
    'cs301-database-systems': ['les-301'],
    'cs102-python-programming': ['les-601', 'les-602'], // 100% completed
  },
  lastAccessedLessons: {
    'cs101-web-development': 'les-103',
    'cs201-data-structures-algorithms': 'les-204',
    'cs301-database-systems': 'les-302',
    'cs102-python-programming': 'les-602',
  },
  quizResults: {
    'quiz-react-state': {
      quizId: 'quiz-react-state',
      score: 90,
      passed: true,
      totalQuestions: 5,
      correctCount: 4,
      submittedAt: '2026-09-17T16:30:00Z',
    },
    'quiz-dsa-complexity': {
      quizId: 'quiz-dsa-complexity',
      score: 80,
      passed: true,
      totalQuestions: 5,
      correctCount: 4,
      submittedAt: '2026-09-15T14:15:00Z',
    },
  },
  assignments: ASSIGNMENTS_DATA,
};

export function LMSProvider({ children }) {
  const [lmsData, setLmsData] = useState(() => {
    try {
      const saved = localStorage.getItem('learnova_lms_state');
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('learnova_lms_state', JSON.stringify(lmsData));
    } catch (e) {
      console.error('Failed saving LMS state to localStorage', e);
    }
  }, [lmsData]);

  // Check if student is enrolled in a course
  const isEnrolled = (courseId) => {
    return lmsData.enrolledCourseIds.includes(courseId);
  };

  // Enroll in a course
  const enrollCourse = (courseId) => {
    if (isEnrolled(courseId)) return;
    const course = COURSES_DATA.find((c) => c.id === courseId);
    const firstLessonId = course?.modules?.[0]?.lessons?.[0]?.id || null;

    setLmsData((prev) => ({
      ...prev,
      enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
      completedLessons: {
        ...prev.completedLessons,
        [courseId]: prev.completedLessons[courseId] || [],
      },
      lastAccessedLessons: {
        ...prev.lastAccessedLessons,
        [courseId]: firstLessonId,
      },
    }));
  };

  // Check if a specific lesson is completed
  const isLessonCompleted = (courseId, lessonId) => {
    const list = lmsData.completedLessons[courseId] || [];
    return list.includes(lessonId);
  };

  // Toggle or mark lesson as complete
  const markLessonComplete = (courseId, lessonId) => {
    setLmsData((prev) => {
      const currentList = prev.completedLessons[courseId] || [];
      const alreadyCompleted = currentList.includes(lessonId);

      const updatedList = alreadyCompleted
        ? currentList.filter((id) => id !== lessonId)
        : [...currentList, lessonId];

      return {
        ...prev,
        completedLessons: {
          ...prev.completedLessons,
          [courseId]: updatedList,
        },
        lastAccessedLessons: {
          ...prev.lastAccessedLessons,
          [courseId]: lessonId,
        },
      };
    });
  };

  // Set the last accessed lesson for a course
  const setLastAccessedLesson = (courseId, lessonId) => {
    setLmsData((prev) => ({
      ...prev,
      lastAccessedLessons: {
        ...prev.lastAccessedLessons,
        [courseId]: lessonId,
      },
    }));
  };

  // Get last accessed lesson ID for a course
  const getLastAccessedLesson = (courseId) => {
    const course = COURSES_DATA.find((c) => c.id === courseId);
    const saved = lmsData.lastAccessedLessons[courseId];
    if (saved) return saved;
    return course?.modules?.[0]?.lessons?.[0]?.id || null;
  };

  // Calculate course completion percentage
  const getCourseProgress = (courseId) => {
    const course = COURSES_DATA.find((c) => c.id === courseId);
    if (!course) return 0;

    const allLessons = course.modules?.flatMap((m) => m.lessons) || [];
    if (allLessons.length === 0) return 0;

    const completed = lmsData.completedLessons[courseId] || [];
    const percent = Math.round((completed.length / allLessons.length) * 100);
    return Math.min(percent, 100);
  };

  // Submit an assignment
  const submitAssignment = (assignmentId, submissionData) => {
    setLmsData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((asg) => {
        if (asg.id === assignmentId) {
          return {
            ...asg,
            status: 'Submitted',
            submittedDate: new Date().toISOString().split('T')[0],
            submissionUrl: submissionData.url || asg.submissionUrl,
            submissionNotes: submissionData.notes || asg.submissionNotes,
          };
        }
        return asg;
      }),
    }));
    return { success: true };
  };

  // Record a quiz result
  const submitQuizResult = (quizId, resultData) => {
    setLmsData((prev) => ({
      ...prev,
      quizResults: {
        ...prev.quizResults,
        [quizId]: {
          ...resultData,
          submittedAt: new Date().toISOString(),
        },
      },
    }));
    return { success: true };
  };

  // Get quiz result if already taken
  const getQuizResult = (quizId) => {
    return lmsData.quizResults[quizId] || null;
  };

  // Calculate overall learning statistics for the dashboard/progress pages
  const getOverallStats = () => {
    const enrolledCount = lmsData.enrolledCourseIds.length;
    let completedCoursesCount = 0;
    let totalCompletedLessonsCount = 0;

    lmsData.enrolledCourseIds.forEach((courseId) => {
      const progress = getCourseProgress(courseId);
      if (progress >= 100) {
        completedCoursesCount += 1;
      }
      const completed = lmsData.completedLessons[courseId] || [];
      totalCompletedLessonsCount += completed.length;
    });

    // Approximate total study hours based on completed lessons (~30m average)
    const learningHours = Math.round(28.4 + totalCompletedLessonsCount * 0.5);

    const quizScores = Object.values(lmsData.quizResults).map((q) => q.score);
    const avgQuizScore =
      quizScores.length > 0
        ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
        : 85;

    return {
      enrolledCount,
      completedCoursesCount,
      totalCompletedLessonsCount,
      learningHours,
      currentStreak: 6, // 6 consecutive days
      avgQuizScore,
      certificatesCount: completedCoursesCount,
    };
  };

  // Get list of completed courses for certificates
  const getCompletedCourses = () => {
    return COURSES_DATA.filter((c) => {
      return isEnrolled(c.id) && getCourseProgress(c.id) >= 100;
    });
  };

  return (
    <LMSContext.Provider
      value={{
        courses: COURSES_DATA,
        quizzes: QUIZZES_DATA,
        assignments: lmsData.assignments,
        enrolledCourseIds: lmsData.enrolledCourseIds,
        completedLessons: lmsData.completedLessons,
        isEnrolled,
        enrollCourse,
        isLessonCompleted,
        markLessonComplete,
        getCourseProgress,
        getLastAccessedLesson,
        setLastAccessedLesson,
        submitAssignment,
        submitQuizResult,
        getQuizResult,
        getOverallStats,
        getCompletedCourses,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
}

export function useLMS() {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
}
