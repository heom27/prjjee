'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function QuizQuestion({ question, selectedOption, onSelect }) {
  const optionLabels = { A: 'A', B: 'B', C: 'C', D: 'D' };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 leading-relaxed tracking-tight">
        {question.text.tr}
      </h2>

      <div className="space-y-4" role="radiogroup" aria-label={question.text.tr}>
        {question.options.map((option, i) => (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            key={option.key}
            onClick={() => onSelect(option.key)}
            className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${
              selectedOption === option.key 
                ? 'bg-brand-500/20 border-brand-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-[1.02]' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'
            }`}
            role="radio"
            aria-checked={selectedOption === option.key}
          >
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                selectedOption === option.key
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40'
                  : 'bg-white/10 text-white/50'
              }`}
            >
              {selectedOption === option.key ? <Check className="w-6 h-6" /> : optionLabels[option.key]}
            </div>
            <span className={`text-lg transition-colors duration-300 ${
              selectedOption === option.key ? 'text-white font-semibold' : 'text-white/80'
            }`}>
              {option.text.tr}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
