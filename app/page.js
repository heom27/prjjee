'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const AUTHORS = [
  'Namık Kemal', 'Orhan Veli', 'Tanpınar',
  'Sait Faik', 'Halide Edip', 'Cemal Süreya'
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating background author names */}
      {mounted && AUTHORS.map((name, i) => (
        <div
          key={name}
          className="absolute text-white/[0.03] font-bold select-none pointer-events-none"
          style={{
            fontSize: `${Math.random() * 40 + 30}px`,
            left: `${(i * 17 + 5) % 90}%`,
            top: `${(i * 23 + 10) % 80}%`,
            transform: `rotate(${i * 15 - 30}deg)`,
            animation: `float ${6 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          {name}
        </div>
      ))}

      {/* Decorative glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      {/* Hero content */}
      <div className={`relative z-10 text-center max-w-2xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Icon */}
        <div className="text-6xl mb-6">📚</div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
          <span className="gradient-text">Hangi Yazarsın?</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/60 mb-4 max-w-lg mx-auto">
          15 soruda sana en yakın Türk yazarını keşfet.
          Namık Kemal gibi mi mücadele edersin, Orhan Veli gibi mi hayatı yaşarsın?
        </p>

        {/* Author chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {AUTHORS.map((name) => (
            <span
              key={name}
              className="px-3 py-1 text-xs font-medium text-brand-300 bg-brand-500/10 rounded-full border border-brand-500/20"
            >
              {name}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/quiz')}
          className="btn-primary text-lg px-12 py-4 rounded-2xl"
        >
          Teste Başla →
        </button>

        {/* Stats hint */}
        <p className="mt-6 text-sm text-white/30">
          🎯 6 yazar • 15 soru • ~3 dakika
        </p>
      </div>
    </main>
  );
}
