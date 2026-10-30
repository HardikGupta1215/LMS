// src/components/common/ProgressBar.jsx

export default function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'primary',
  className = '',
}) {
  const percent = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  const colorStyles = {
    primary: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    purple: 'bg-purple-600',
  };

  const effectiveColor =
    percent >= 100 ? colorStyles.emerald : colorStyles[color] || colorStyles.primary;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-slate-900">{percent}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeStyles[size] || sizeStyles.md}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${effectiveColor}`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
}
