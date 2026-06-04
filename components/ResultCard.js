'use client';

export default function ResultCard({ winner, author }) {
  return (
    <div className="glass-card p-8 text-center animate-scale-in">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-4xl shadow-2xl shadow-brand-500/30">
        ✍️
      </div>

      <h2 className="text-3xl sm:text-4xl font-black mb-2">
        <span className="gradient-text">{winner.name}</span>
      </h2>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 rounded-full border border-brand-500/20 mb-6">
        <span className="text-sm text-brand-300">Benzerlik</span>
        <span className="text-sm font-bold text-brand-400">
          %{Math.round(winner.confidence * 100)}
        </span>
      </div>

      <p className="text-white/70 text-lg leading-relaxed max-w-md mx-auto">
        {author?.shortBio_tr}
      </p>
    </div>
  );
}
