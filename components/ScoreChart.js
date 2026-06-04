'use client';

export default function ScoreChart({ scores, authors, winnerId }) {
  const maxScore = Math.max(...Object.values(scores), 1);
  
  const sortedEntries = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      {sortedEntries.map(([authorId, score], index) => {
        const author = authors.find(a => a.id === authorId);
        const percentage = (score / maxScore) * 100;
        const isWinner = authorId === winnerId;

        return (
          <div
            key={authorId}
            className={`animate-slide-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm font-medium ${
                isWinner ? 'text-brand-300' : 'text-white/60'
              }`}>
                {author?.name || authorId}
                {isWinner && ' ⭐'}
              </span>
              <span className={`text-sm ${
                isWinner ? 'text-brand-400 font-bold' : 'text-white/40'
              }`}>
                {score} puan
              </span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isWinner
                    ? 'bg-gradient-to-r from-brand-600 to-brand-400'
                    : 'bg-white/20'
                }`}
                style={{ width: `${percentage}%`, transitionDelay: `${index * 0.1}s` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
