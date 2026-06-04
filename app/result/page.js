'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, RefreshCw, Home, Sparkles } from 'lucide-react';
import ResultCard from '@/components/ResultCard';
import ScoreChart from '@/components/ScoreChart';
import Confetti from 'react-confetti';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showReveal, setShowReveal] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const stored = localStorage.getItem('quizResult');
    if (!stored) {
      router.push('/');
      return;
    }
    setResult(JSON.parse(stored));

    const timer = setTimeout(() => {
      setShowReveal(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  const handleShare = async () => {
    const url = window.location.origin;
    const text = `Benim yazar vibe'ım ${result?.winner?.name}! Sen hangi yazarsın? 📚`;

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

  if (!result) return null;

  const winnerAuthor = result.authors?.find(a => a.id === result.winner.id);

  return (
    <main className="min-h-screen bg-surface-950 px-4 py-12 relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {showReveal ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center absolute inset-0 z-50 bg-surface-950"
          >
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
              <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin" />
              <Sparkles className="absolute w-8 h-8 text-brand-400 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Ruhun Analiz Ediliyor...</h2>
            <p className="text-white/50 mt-2 font-medium">Edebi eşleşmen bulunmak üzere</p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-lg mx-auto space-y-6 relative z-10"
          >
            <Confetti 
              width={windowSize.width} 
              height={windowSize.height} 
              recycle={false} 
              numberOfPieces={400}
              colors={['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9', '#fde047', '#38bdf8']}
            />
            
            <div className="text-center">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
              >
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span className="text-sm font-medium text-white/80">Senin Edebi Ruhun</span>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
            >
              <ResultCard winner={result.winner} author={winnerAuthor} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                Edebi Profilin
              </h3>
              <ScoreChart
                scores={result.scores}
                authors={result.authors || []}
                winnerId={result.winner.id}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex gap-4"
            >
              <button
                onClick={() => {
                  localStorage.removeItem('quizResult');
                  router.push('/quiz');
                }}
                className="flex-1 flex justify-center items-center gap-2 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all active:scale-95"
              >
                <RefreshCw className="w-5 h-5 text-white/60" /> Tekrar Dene
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex justify-center items-center gap-2 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all active:scale-95"
              >
                {copied ? '✅ Kopyalandı' : <><Share2 className="w-5 h-5" /> Paylaş</>}
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-center pt-4 pb-10"
            >
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors"
              >
                <Home className="w-4 h-4" /> Ana Sayfaya Dön
              </button>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
