'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ResultCard from '@/components/ResultCard';
import ScoreChart from '@/components/ScoreChart';

function Confetti() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9', '#f59e0b', '#10b981'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      size: `${Math.random() * 8 + 6}px`,
      duration: `${Math.random() * 2 + 2}s`,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('quizResult');
    if (!stored) {
      router.push('/');
      return;
    }
    setResult(JSON.parse(stored));
  }, [router]);

  const handleShare = async () => {
    const url = window.location.origin;
    const text = `Benim yazar vibe'ım ${result.winner.name}! Sen hangi yazarsın? 📚`;

    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Hangi Yazarsın?', text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </main>
    );
  }

  const winnerAuthor = result.authors?.find(a => a.id === result.winner.id);

  return (
    <main className="min-h-screen px-4 py-12 relative overflow-hidden">
      <Confetti />

      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center animate-fade-in">
          <p className="text-white/40 text-sm mb-2">Senin yazar vibe'ın...</p>
        </div>

        <ResultCard winner={result.winner} author={winnerAuthor} />

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white/80 mb-4">Tüm Skorlar</h3>
          <ScoreChart
            scores={result.scores}
            authors={result.authors || []}
            winnerId={result.winner.id}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              localStorage.removeItem('quizResult');
              router.push('/quiz');
            }}
            className="btn-secondary flex-1"
          >
            🔄 Tekrar Dene
          </button>
          <button
            onClick={handleShare}
            className="btn-primary flex-1"
          >
            {copied ? '✅ Kopyalandı!' : '📤 Paylaş'}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-white/30 hover:text-white/50 transition-colors"
          >
            Ana Sayfa
          </button>
        </div>
      </div>
    </main>
  );
}
