// src/pages/AssignmentsPage.jsx
import { useState } from 'react';
import {
  FileText,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Upload,
  Send,
} from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

export default function AssignmentsPage() {
  const { assignments, submitAssignment } = useLMS();
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'Pending' | 'Submitted' | 'Graded'
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredAssignments = assignments.filter((a) => {
    if (filterTab === 'all') return true;
    return a.status === filterTab;
  });

  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionUrl(assignment.submissionUrl || '');
    setSubmissionNotes(assignment.submissionNotes || '');
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(selectedAssignment.id, {
        url: submissionUrl,
        notes: submissionNotes,
      });
      setIsSubmitting(false);
      setSelectedAssignment(null);
      setToastMessage(`Assignment submitted successfully!`);
      setTimeout(() => setToastMessage(''), 4000);
    }, 400);
  };

  const statusVariant = {
    Pending: 'warning',
    Submitted: 'primary',
    Graded: 'success',
  };

  return (
    <div className="space-y-6 pb-12">
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
          Coursework & Assignments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review problem sets, project deliverables, grading rubrics, and instructor feedback.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { key: 'all', label: 'All Assignments', count: assignments.length },
          {
            key: 'Pending',
            label: 'Pending Due',
            count: assignments.filter((a) => a.status === 'Pending').length,
          },
          {
            key: 'Submitted',
            label: 'Awaiting Grading',
            count: assignments.filter((a) => a.status === 'Submitted').length,
          },
          {
            key: 'Graded',
            label: 'Graded & Reviewed',
            count: assignments.filter((a) => a.status === 'Graded').length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterTab(tab.key)}
            className={`pb-3 px-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterTab === tab.key
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Assignments List */}
      {filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((asg) => (
            <div
              key={asg.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 hover:border-slate-300 hover:shadow-2xs transition-all space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {asg.courseName}
                    </span>
                    <Badge variant={statusVariant[asg.status]} size="xs">
                      {asg.status}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {asg.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: {asg.dueDate} ({asg.dueTime})</span>
                  </div>
                </div>
              </div>

              {/* Description & Requirements */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {asg.description}
              </p>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 space-y-1.5 text-xs">
                <p className="font-semibold text-slate-800">Submission Requirements:</p>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {asg.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Graded Feedback if available */}
              {asg.status === 'Graded' && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      Score: {asg.earnedScore} / {asg.points} Points
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700">
                      Graded on {asg.submittedDate}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    <strong>Instructor Feedback:</strong> {asg.feedback}
                  </p>
                </div>
              )}

              {/* Submitted Info */}
              {asg.status === 'Submitted' && (
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Work Submitted on {asg.submittedDate}</p>
                    <p className="text-[11px] text-blue-700 truncate max-w-md">
                      Repository: {asg.submissionUrl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openSubmitModal(asg)}
                    className="text-xs font-semibold text-blue-700 hover:underline"
                  >
                    Update Submission
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">{asg.points} Total Points</span>

                {asg.status === 'Pending' ? (
                  <button
                    type="button"
                    onClick={() => openSubmitModal(asg)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit Assignment</span>
                  </button>
                ) : (
                  <a
                    href={asg.submissionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                  >
                    <span>View Submitted Repository</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No assignments in this category"
          description="All coursework deliverables for this tab have been accounted for."
        />
      )}

      {/* Submission Modal Dialog */}
      <Modal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        title={selectedAssignment ? `Submit: ${selectedAssignment.title}` : 'Submit Assignment'}
      >
        {selectedAssignment && (
          <form onSubmit={handleConfirmSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                GitHub / Repository / Cloud Project URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://github.com/username/project-repo"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Submission Notes & Architecture Remarks (Optional)
              </label>
              <textarea
                rows="4"
                placeholder="Include setup instructions, API keys for test runner, or notes on specific algorithms implemented..."
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 leading-relaxed text-[11px]">
              By clicking submit, you verify that this submission represents your own academic work adhering to the Learnova University Honor Code.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs transition-colors disabled:opacity-70"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Confirm Submission'}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
