// src/data/activity.js

export const RECENT_ACTIVITIES_DATA = [
  {
    id: 'act-1',
    type: 'lesson_completed',
    title: 'Completed Lesson',
    detail: 'Mastering Hooks: useEffect, useMemo, and Custom Hooks in Full-Stack Modern Web Engineering',
    timestamp: '2 hours ago',
    date: '2026-09-18',
  },
  {
    id: 'act-2',
    type: 'quiz_submitted',
    title: 'Submitted Assessment',
    detail: 'Scored 90% in React 19 State & Hooks Midterm Assessment',
    timestamp: 'Yesterday at 4:30 PM',
    date: '2026-09-17',
  },
  {
    id: 'act-3',
    type: 'assignment_submitted',
    title: 'Submitted Assignment',
    detail: 'Assignment 2: AVL Tree Balancing & Performance Benchmarking',
    timestamp: '2 days ago',
    date: '2026-09-16',
  },
  {
    id: 'act-4',
    type: 'certificate_earned',
    title: 'Earned Certificate of Completion',
    detail: 'Object-Oriented Programming with Python (CS-102)',
    timestamp: '5 days ago',
    date: '2026-09-13',
  },
  {
    id: 'act-5',
    type: 'course_enrolled',
    title: 'Enrolled in Course',
    detail: 'Machine Learning & Neural Foundations (CS-401)',
    timestamp: '1 week ago',
    date: '2026-09-11',
  },
];

export const WEEKLY_STUDY_DATA = [
  { day: 'Mon', hours: 3.5, label: '3.5h' },
  { day: 'Tue', hours: 4.2, label: '4.2h' },
  { day: 'Wed', hours: 2.8, label: '2.8h' },
  { day: 'Thu', hours: 5.0, label: '5.0h' },
  { day: 'Fri', hours: 4.6, label: '4.6h' },
  { day: 'Sat', hours: 6.2, label: '6.2h' },
  { day: 'Sun', hours: 3.8, label: '3.8h' },
];

export const NOTIFICATIONS_DATA = [
  {
    id: 'notif-1',
    title: 'Assignment Graded',
    message: 'Dr. Michael Chang graded your Database Normalization assignment (96/100).',
    time: '3 hours ago',
    read: false,
    link: '/assignments',
  },
  {
    id: 'notif-2',
    title: 'Upcoming Deadline',
    message: 'Assignment 1: RESTful API with Authentication is due in 10 days.',
    time: '1 day ago',
    read: false,
    link: '/assignments',
  },
  {
    id: 'notif-3',
    title: 'New Discussion Reply',
    message: 'Prof. David R. Miller answered your query on AVL rotation invariants.',
    time: '2 days ago',
    read: true,
    link: '/courses/cs201-data-structures-algorithms',
  },
  {
    id: 'notif-4',
    title: 'Certificate Issued',
    message: 'Your official certificate for Python OOP is now ready to download.',
    time: '5 days ago',
    read: true,
    link: '/certificates',
  },
];
