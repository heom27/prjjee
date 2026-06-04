'use client';

export default function ProgressBar({ current, total }) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white/50">
          Soru {current + 1} / {total}
        </span>
        <span className="text-sm font-medium text-brand-400">
          %{Math.round(percentage)}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 progress-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
}
