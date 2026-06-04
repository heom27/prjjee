'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

    // Auto-advance after brief delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowEmail(true);
      }
    }, 500);
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

      // Store result in localStorage for the result page
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
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50">Sorular yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-red-400 mb-4">❌ {error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Tekrar Dene
          </button>
        </div>
      </main>
    );
  }

  if (showEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg animate-fade-in">
          <div className="glass-card p-8">
            <div className="text-4xl text-center mb-4">📧</div>
            <h2 className="text-2xl font-bold text-center mb-2 gradient-text">
              Sonuçları E-posta ile Al
            </h2>
            <p className="text-white/50 text-center mb-6 text-sm">
              İsteğe bağlı — sonuçlarını e-posta ile almak istersen adresini gir.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com (isteğe bağlı)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all mb-6"
              aria-label="E-posta adresi"
            />

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary w-full text-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Hesaplanıyor...
                </span>
              ) : (
                'Sonuçları Gör 🎉'
              )}
            </button>

            {!email && (
              <p className="text-center text-white/30 text-xs mt-3">
                E-posta girmeden de devam edebilirsin.
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <ProgressBar current={currentIndex} total={questions.length} />

        <div className="glass-card p-6 sm:p-8">
          <QuizQuestion
            key={questions[currentIndex].id}
            question={questions[currentIndex]}
            selectedOption={answers[questions[currentIndex].id]}
            onSelect={handleSelect}
          />
        </div>

        {/* Navigation hint */}
        <div className="mt-4 flex justify-between items-center">
          {currentIndex > 0 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              ← Önceki
            </button>
          ) : <div />}
          <span className="text-xs text-white/20">
            Seçtiğinde otomatik ilerler
          </span>
        </div>
      </div>
    </main>
  );
}
