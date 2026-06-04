'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, ChevronLeft, ArrowRight } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import QuizQuestion from '@/components/QuizQuestion';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/v1/quiz')
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
        setAuthors(data.authors || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Sorular yüklenirken bir hata oluştu.');
        setLoading(false);
      });
  }, []);

  const handleSelect = (optionKey) => {
    const qId = questions[currentIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: optionKey }));

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowEmail(true);
      }
    }, 600);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email || undefined, answers }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Bir hata oluştu');
      }

      localStorage.setItem('quizResult', JSON.stringify({
        ...result,
        authors,
      }));

      router.push('/result');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface-950">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
          <p className="text-white/50 tracking-widest uppercase text-sm font-medium">Sorular Hazırlanıyor</p>
        </motion.div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-surface-950">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <p className="text-red-400 mb-6 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary w-full">
            Tekrar Dene
          </button>
        </div>
      </main>
    );
  }

  if (showEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-950">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            
            <div className="w-16 h-16 bg-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-400 border border-brand-500/30">
              <Mail className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-black text-center mb-3 text-white">
              Sonuçlar Hazır!
            </h2>
            <p className="text-white/50 text-center mb-8">
              Sonucunu e-posta adresine de göndermemizi ister misin? (İsteğe bağlı)
            </p>

            <div className="space-y-6 relative z-10">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-lg"
              />

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-surface-950 font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-2">
                  {submitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Hesaplanıyor...</>
                  ) : (
                    <>Sonucu Gör <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-950 relative overflow-hidden">
      <div className="w-full max-w-2xl relative z-10">
        <ProgressBar current={currentIndex} total={questions.length} />

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <QuizQuestion
              key={questions[currentIndex].id}
              question={questions[currentIndex]}
              selectedOption={answers[questions[currentIndex].id]}
              onSelect={handleSelect}
            />
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between items-center px-4">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${currentIndex > 0 ? 'text-white/50 hover:text-white' : 'text-transparent pointer-events-none'}`}
          >
            <ChevronLeft className="w-4 h-4" /> Önceki Soru
          </button>
          
          <span className="text-xs font-medium text-white/20 uppercase tracking-widest">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>
    </main>
  );
}
