'use client';

export default function QuizQuestion({ question, selectedOption, onSelect }) {
  const optionLabels = { A: 'A', B: 'B', C: 'C', D: 'D' };

  return (
    <div className="animate-slide-in-right">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-relaxed">
        {question.text.tr}
      </h2>

      <div className="space-y-3" role="radiogroup" aria-label={question.text.tr}>
        {question.options.map((option) => (
          <button
            key={option.key}
            onClick={() => onSelect(option.key)}
            className={`option-card w-full text-left flex items-center gap-4 ${
              selectedOption === option.key ? 'selected' : ''
            }`}
            role="radio"
            aria-checked={selectedOption === option.key}
          >
            <span
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                selectedOption === option.key
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              {optionLabels[option.key]}
            </span>
            <span className={`text-base transition-colors duration-300 ${
              selectedOption === option.key ? 'text-white font-medium' : 'text-white/70'
            }`}>
              {option.text.tr}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
