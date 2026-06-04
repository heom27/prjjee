'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Feather, Sparkles, BookMarked, Star } from 'lucide-react';

const AUTHORS = [
  { name: 'Namık Kemal',    tag: 'Vatan Şairi',       color: '#a78bfa' },
  { name: 'Orhan Veli',     tag: 'Hayatın Şairi',     color: '#60a5fa' },
  { name: 'Tanpınar',       tag: 'Zamanın Ustası',    color: '#f472b6' },
  { name: 'Sait Faik',      tag: 'Sokağın Gözü',      color: '#34d399' },
  { name: 'Halide Edip',    tag: 'Milletin Kalemi',   color: '#fb923c' },
  { name: 'Cemal Süreya',   tag: 'Aşkın Sesi',        color: '#f43f5e' },
  { name: 'Sabahattin Ali', tag: 'Romantiğin Ustası', color: '#c084fc' },
  { name: 'Yaşar Kemal',    tag: 'Destanın Sözcüsü',  color: '#4ade80' },
  { name: 'Nazım Hikmet',   tag: 'Devrim Ozanı',      color: '#38bdf8' },
  { name: 'Oğuz Atay',      tag: 'Modernin Aynası',   color: '#facc15' },
  { name: 'Reşat Nuri',     tag: 'Anadolu\'nun Sesi', color: '#a3e635' },
  { name: 'Tevfik Fikret',  tag: 'Vicdanın Şairi',   color: '#fb7185' },
  { name: 'Attila İlhan',   tag: 'Serüvenin Kalemı',  color: '#818cf8' },
  { name: 'Yahya Kemal',    tag: 'İstanbul\'un Ruhu', color: '#e879f9' },
  { name: 'Peyami Safa',    tag: 'Ruhun Dedektifi',   color: '#2dd4bf' },
];

const QUOTES = [
  { text: '"Vatan bir şiirdir, biz onu yaşarız."', author: 'Namık Kemal' },
  { text: '"Anlatamadığım duygu kaldı içimde..."', author: 'Orhan Veli' },
  { text: '"Zaman içinde kaybolmak, kendini bulmaktır."', author: 'A. H. Tanpınar' },
  { text: '"İnsanı sevmek her şeyden önce gelir."', author: 'Sait Faik' },
  { text: '"Aşk sözcüklere sığmaz, yine de yazarız."', author: 'Cemal Süreya' },
];

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: `hsl(${260 + Math.random() * 60}, 70%, 70%)`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function AuthorCarousel({ current }) {
  const author = AUTHORS[current];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-1"
      >
        <span
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
          style={{ color: author.color, textShadow: `0 0 40px ${author.color}55` }}
        >
          {author.name}
        </span>
        <span
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] px-3 py-1 rounded-full border"
          style={{ color: author.color, borderColor: `${author.color}44`, background: `${author.color}11` }}
        >
          {author.tag}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

function QuoteRotator() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % QUOTES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-md"
      >
        <p className="text-white/40 text-sm italic leading-relaxed">{QUOTES[idx].text}</p>
        <p className="text-white/25 text-xs mt-1">— {QUOTES[idx].author}</p>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState(0);
  const mainRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentAuthor(prev => (prev + 1) % AUTHORS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = mainRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 40);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 40);
  };

  if (!mounted) return null;

  const currentColor = AUTHORS[currentAuthor].color;

  return (
    <main
      ref={mainRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-surface-950"
    >
      {/* Ambient background — follows mouse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: springX, y: springY }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] transition-colors duration-1000"
          style={{ background: `radial-gradient(circle, ${currentColor}18 0%, transparent 70%)` }}
        />
      </motion.div>

      {/* Fixed soft glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-700/15 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-800/15 blur-[120px]" />
      </div>

      {/* Floating particles */}
      <ParticleField />

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center gap-8">

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-white/60">Türk Edebiyatı Kişilik Testi</span>
          <Star className="w-3 h-3 text-yellow-400/70 fill-yellow-400/40" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex flex-col items-center gap-2"
        >
          <h1 className="text-[clamp(3rem,12vw,7rem)] font-black leading-none tracking-tight">
            <span className="text-white/10 [-webkit-text-stroke:1px_rgba(255,255,255,0.15)] block">Hangi</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, #fff 0%, ${currentColor} 60%, #a78bfa 100%)`, transition: 'background-image 1s ease' }}
            >
              Yazarsın?
            </span>
          </h1>
        </motion.div>

        {/* Author Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center gap-3 min-h-[90px] justify-center"
        >
          <p className="text-white/30 text-sm uppercase tracking-[0.2em] font-medium">belki sen...</p>
          <AuthorCarousel current={currentAuthor} />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col items-center gap-5"
        >
          {/* Main button */}
          <button
            onClick={() => router.push('/quiz')}
            className="group relative"
          >
            {/* Glow behind button */}
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 scale-110"
              style={{ background: `linear-gradient(135deg, ${currentColor}, #7c3aed)`, transition: 'background 1s ease, opacity 0.5s ease' }}
            />
            <div
              className="relative flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all duration-300 group-hover:scale-[1.03] active:scale-[0.97]"
              style={{ background: `linear-gradient(135deg, ${currentColor}cc, #7c3aed)`, transition: 'background 1s ease, transform 0.3s ease' }}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <BookMarked className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Kendi Hikayeni Keşfet</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </button>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-white/30 text-xs font-semibold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Feather className="w-3 h-3" />15 Yazar</span>
            <div className="w-px h-3 bg-white/20" />
            <span>15 Soru</span>
            <div className="w-px h-3 bg-white/20" />
            <span>~3 Dakika</span>
          </div>
        </motion.div>

        {/* Quote rotator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-4"
        >
          <QuoteRotator />
        </motion.div>

      </div>
    </main>
  );
}
