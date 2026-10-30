import { useState } from 'react';
import {
  Award,
  Printer,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLMS } from '../context/LMSContext';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

export default function CertificatesPage() {
  const { user } = useAuth();
  const { getCompletedCourses } = useLMS();
  const [selectedCert, setSelectedCert] = useState(null);

  const completedCourses = getCompletedCourses();

  // If none completed yet, provide the completed Python course demo certificate
  const demoCertificates = [
    {
      id: 'CERT-2026-CS102-8842',
      courseCode: 'CS-102',
      courseTitle: 'Object-Oriented Programming with Python',
      issueDate: 'September 13, 2026',
      instructor: 'Dr. Sarah Jenkins',
      department: 'Computer Science & Engineering',
      grade: 'A (94%)',
      hours: 28,
    },
    ...completedCourses.filter((c) => c.id !== 'cs102-python-programming').map((c) => ({
      id: `CERT-2026-${c.code.replace('-', '')}-8842`,
      courseCode: c.code,
      courseTitle: c.title,
      issueDate: 'September 18, 2026',
      instructor: c.instructor.name,
      department: 'Computer Science & Engineering',
      grade: 'A (95%)',
      hours: c.durationHours,
    })),
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Academic Certificates & Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official, verifiable credentials awarded upon achieving 100% completion in university courses.
        </p>
      </div>

      {/* Certificates Grid */}
      {demoCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoCertificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs hover:border-slate-300 hover:shadow-md transition-all space-y-4"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">
                    ID: {cert.id}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Verified Credential
                  </span>
                </div>
              </div>

              {/* Course Title & Details */}
              <div>
                <span className="text-xs font-semibold text-slate-500">{cert.courseCode}</span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {cert.courseTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Issued to <strong className="text-slate-800">{user?.name || 'Hardik Gupta'}</strong> on {cert.issueDate}
                </p>
              </div>

              {/* Meta stats */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <span>Instructor: {cert.instructor}</span>
                <span>{cert.hours} Hours Coursework</span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors cursor-pointer"
                >
                  <span>View Official Certificate</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="No certificates earned yet"
          description="Complete all lectures and problem sets in any enrolled course to receive your official certificate."
        />
      )}

      {/* Printable Certificate Modal */}
      <Modal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        title="Official Certificate of Completion"
        maxWidth="max-w-2xl"
      >
        {selectedCert && (
          <div className="space-y-6">
            {/* Certificate Frame */}
            <div
              id="printable-certificate"
              className="p-8 sm:p-10 bg-gradient-to-b from-white to-slate-50 border-8 border-double border-slate-300 rounded-lg text-center space-y-6 select-none relative"
            >
              {/* Seal / Emblem */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-7 h-7" />
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl tracking-wide text-slate-900 uppercase">
                  Learnova University
                </h2>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Department of Computer Science & Engineering
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500 italic">This certifies that</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 border-b-2 border-slate-200 pb-1 max-w-sm mx-auto">
                  {user?.name || 'Hardik Gupta'}
                </h3>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500">
                  has successfully completed all lecture modules, laboratory assessments, and requirements for
                </p>
                <h4 className="text-base sm:text-lg font-bold text-blue-900">
                  {selectedCert.courseCode}: {selectedCert.courseTitle}
                </h4>
                <p className="text-xs text-slate-500">
                  Equivalent to {selectedCert.hours} Hours of Rigorous Academic Study
                </p>
              </div>

              {/* Signatures & Verification ID */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-left text-xs">
                <div>
                  <p className="font-serif font-bold text-slate-800 italic text-sm">{selectedCert.instructor}</p>
                  <p className="text-[10px] text-slate-400">Lead Faculty Instructor</p>
                </div>

                <div className="text-right">
                  <p className="font-mono text-[10px] text-slate-500 font-bold">{selectedCert.id}</p>
                  <p className="text-[10px] text-slate-400">{selectedCert.issueDate}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Tip: Click Print to save as a high-resolution PDF.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
