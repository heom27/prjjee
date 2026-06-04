'use client';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="w-full mb-10">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-white/50 tracking-wider uppercase">
          Soru {current + 1} / {total}
        </span>
        <span className="text-sm font-bold text-brand-400">
          %{Math.round(percentage)}
        </span>
      </div>
      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-brand-600 via-brand-400 to-purple-400 rounded-full relative"
        >
          <div className="absolute inset-0 bg-white/20 progress-shimmer rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
