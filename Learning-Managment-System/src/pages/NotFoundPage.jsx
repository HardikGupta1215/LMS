// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { GraduationCap, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-xs">
        <GraduationCap className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        404 - Academic Record Not Found
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md">
        The course syllabus, lecture video, or resource page you requested does not exist or has been relocated.
      </p>
      <div className="pt-2 flex gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
        >
          <span>Explore Catalog</span>
        </Link>
      </div>
    </div>
  );
}
