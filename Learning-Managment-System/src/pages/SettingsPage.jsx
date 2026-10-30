// src/pages/SettingsPage.jsx
import { useState } from 'react';
import {
  Bell,
  Sliders,
  CheckCircle2,
  Save,
  Shield,
} from 'lucide-react';

export default function SettingsPage() {

  const [notificationSettings, setNotificationSettings] = useState({
    deadlineReminders: true,
    gradeAlerts: true,
    discussionReplies: false,
    weeklyReport: true,
  });

  const [studyPreferences, setStudyPreferences] = useState({
    autoPlayNext: true,
    defaultPlaybackSpeed: '1',
    showCaptions: false,
    downloadOverWifiOnly: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [toastMessage, setToastMessage] = useState('');

  const handleToggleNotif = (key) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleStudy = (key) => {
    setStudyPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setToastMessage('Settings preferences saved successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setToastMessage('Password updated successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account & Portal Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize notification delivery, video player preferences, and security settings.
        </p>
      </div>

      {/* Notification Preferences Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 space-y-5 shadow-2xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Bell className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          {[
            {
              key: 'deadlineReminders',
              title: 'Assignment Deadline Alerts',
              desc: 'Receive reminders 48 hours and 24 hours prior to homework & project due dates.',
            },
            {
              key: 'gradeAlerts',
              title: 'Grades & Evaluation Notices',
              desc: 'Instant alert when an instructor reviews or grades an assignment submission.',
            },
            {
              key: 'discussionReplies',
              title: 'Discussion Forum Replies',
              desc: 'Notify when peers or instructors respond to your syllabus lecture queries.',
            },
            {
              key: 'weeklyReport',
              title: 'Weekly Learning Summary',
              desc: 'Receive weekly breakdown of study hours, completed lectures, and streak progress.',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70"
            >
              <div className="space-y-0.5 max-w-lg">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[item.key]}
                  onChange={() => handleToggleNotif(item.key)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Video & Study Player Preferences */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 space-y-5 shadow-2xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Lecture Player Preferences
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900">Auto-Play Next Lecture</p>
              <p className="text-[11px] text-slate-500">Automatically advance to the next lecture upon video completion.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={studyPreferences.autoPlayNext}
                onChange={() => handleToggleStudy('autoPlayNext')}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900">Default Playback Speed</p>
              <p className="text-[11px] text-slate-500">Preferred initial speed when starting new video lectures.</p>
            </div>
            <select
              value={studyPreferences.defaultPlaybackSpeed}
              onChange={(e) =>
                setStudyPreferences((prev) => ({
                  ...prev,
                  defaultPlaybackSpeed: e.target.value,
                }))
              }
              className="bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2.5 py-1.5 focus:border-blue-500 focus:outline-none cursor-pointer"
            >
              <option value="1">1.0x (Normal)</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Security & Password Form */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 space-y-5 shadow-2xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Shield className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">
            Security & Password Management
          </h2>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
