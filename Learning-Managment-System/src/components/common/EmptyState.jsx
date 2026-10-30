// src/components/common/EmptyState.jsx
import { BookOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = BookOpen,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  action = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-slate-200/80 ${className}`}>
      <div className="w-12 h-12 mb-3.5 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
