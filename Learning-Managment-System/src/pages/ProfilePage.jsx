// src/pages/ProfilePage.jsx
import { useState } from 'react';
import {
  CheckCircle2,
  Edit2,
  Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import { COURSES_DATA } from '../data/courses';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { enrolledCourseIds, getCourseProgress, getOverallStats } = useLMS();
  const stats = getOverallStats();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || 'Computer Science & Engineering',
    bio: user?.bio || '',
    semester: user?.semester || '5th Semester (Fall 2026)',
  });
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setToastMessage('Profile updated successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const userCourses = COURSES_DATA.filter((c) => enrolledCourseIds.includes(c.id));

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal details, academic affiliations, and university credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            isEditing
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
          }`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={user?.name || 'Student'}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-slate-200 shadow-xs shrink-0"
          />

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {user?.name}
              </h2>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {user?.role || 'Student'}
              </span>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                ID: {user?.studentId || 'LN-2024-8842'}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              {user?.department} • {user?.university || 'Learnova University of Technology'}
            </p>

            <p className="text-xs text-slate-600 pt-1 leading-relaxed max-w-2xl">
              {user?.bio}
            </p>
          </div>
        </div>

        {/* Edit Form OR View Details */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-100 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  University Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Current Term / Semester
                </label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Student Biography
              </label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        ) : (
          /* Academic Info Grid */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Cumulative GPA</span>
              <p className="font-bold text-slate-900 text-sm">{user?.gpa || '3.88 / 4.0'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Enrolled Term</span>
              <p className="font-bold text-slate-900 text-sm">{user?.semester || 'Fall 2026'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Enrolled Courses</span>
              <p className="font-bold text-slate-900 text-sm">{stats.enrolledCount} Active</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Certificates</span>
              <p className="font-bold text-slate-900 text-sm">{stats.certificatesCount} Verified</p>
            </div>
          </div>
        )}
      </div>

      {/* Enrolled Courses Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 space-y-4 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900">
          Academic Course Registration ({userCourses.length})
        </h3>

        <div className="divide-y divide-slate-100">
          {userCourses.map((course) => {
            const progress = getCourseProgress(course.id);
            return (
              <div
                key={course.id}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 block truncate">
                    {course.code}: {course.title}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {course.instructor.name} • {course.duration}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold text-blue-700">{progress}%</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      progress >= 100
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {progress >= 100 ? 'Completed' : 'Enrolled'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
