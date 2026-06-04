'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Feather, Sparkles, BookMarked, Star } from 'lucide-react';

const AUTHORS = [
  { name: 'Namık Kemal',    tag: 'Vatan Şairi',        color: '#a78bfa' },
  { name: 'Orhan Veli',     tag: 'Hayatın Şairi',      color: '#60a5fa' },
  { name: 'Tanpınar',       tag: 'Zamanın Ustası',     color: '#f472b6' },
  { name: 'Sait Faik',      tag: 'Sokağın Gözü',       color: '#34d399' },
  { name: 'Halide Edip',    tag: 'Milletin Kalemi',    color: '#fb923c' },
  { name: 'Cemal Süreya',   tag: 'Aşkın Sesi',         color: '#f43f5e' },
  { name: 'Sabahattin Ali', tag: 'Romantiğin Ustası',  color: '#c084fc' },
  { name: 'Yaşar Kemal',    tag: 'Destanın Sözcüsü',   color: '#4ade80' },
  { name: 'Nazım Hikmet',   tag: 'Devrim Ozanı',       color: '#38bdf8' },
  { name: 'Oğuz Atay',      tag: 'Modernin Aynası',    color: '#facc15' },
  { name: 'Reşat Nuri',     tag: "Anadolu'nun Sesi",   color: '#a3e635' },
  { name: 'Tevfik Fikret',  tag: 'Vicdanın Şairi',    color: '#fb7185' },
  { name: 'Attila İlhan',   tag: 'Serüvenin Kalemi',   color: '#818cf8' },
  { name: 'Yahya Kemal',    tag: "İstanbul'un Ruhu",   color: '#e879f9' },
  { name: 'Peyami Safa',    tag: 'Ruhun Dedektifi',    color: '#2dd4bf' },
];

const QUOTES = [
  { text: '"Vatan bir şiirdir, biz onu yaşarız."',           author: 'Namık Kemal' },
  { text: '"Anlatamadığım duygu kaldı içimde..."',           author: 'Orhan Veli' },
  { text: '"Zaman içinde kaybolmak, kendini bulmaktır."',    author: 'A. H. Tanpınar' },
  { text: '"İnsanı sevmek her şeyden önce gelir."',          author: 'Sait Faik' },
  { text: '"Aşk sözcüklere sığmaz, yine de yazarız."',      author: 'Cemal Süreya' },
];

// Fixed particle positions — no Math.random() to avoid hydration mismatch
const PARTICLES = [
  { left: '8%',  top: '15%', size: 2, dur: 6,  delay: 0   },
  { left: '20%', top: '72%', size: 1, dur: 7,  delay: 1   },
  { left: '35%', top: '40%', size: 3, dur: 5,  delay: 0.5 },
  { left: '50%', top: '85%', size: 2, dur: 8,  delay: 2   },
  { left: '65%', top: '25%', size: 1, dur: 6,  delay: 1.5 },
  { left: '78%', top: '60%', size: 2, dur: 7,  delay: 0.8 },
  { left: '90%', top: '10%', size: 3, dur: 5,  delay: 2.5 },
  { left: '15%', top: '90%', size: 1, dur: 9,  delay: 0.3 },
  { left: '55%', top: '50%', size: 2, dur: 6,  delay: 1.2 },
  { left: '42%', top: '8%',  size: 1, dur: 8,  delay: 3   },
  { left: '88%', top: '80%', size: 3, dur: 5,  delay: 0.7 },
  { left: '30%', top: '55%', size: 2, dur: 7,  delay: 1.8 },
];

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-400/40"
          style={{ width: p.size, height: p.size, left: p.left, top: p.top }}
          animate={{ y: [0, -24, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
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
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-2"
      >
        <span
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
          style={{ color: author.color, textShadow: `0 0 40px ${author.color}66` }}
        >
          {author.name}
        </span>
        <span
          className="text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border"
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
        <p className="text-white/35 text-sm italic leading-relaxed">{QUOTES[idx].text}</p>
        <p className="text-white/20 text-xs mt-1 tracking-wide">— {QUOTES[idx].author}</p>
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
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

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

  const currentColor = AUTHORS[currentAuthor].color;

  return (
    <main
      ref={mainRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-surface-950"
    >
      {/* Ambient glow that follows mouse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: springX, y: springY }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-1000"
          style={{ background: `radial-gradient(circle, ${currentColor}18 0%, transparent 70%)` }}
        />
      </motion.div>

      {/* Static soft glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-700/15 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-800/15 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Particles - only render client-side */}
      {mounted && <ParticleField />}

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center gap-8">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] backdrop-blur-xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-white/60">Türk Edebiyatı Kişilik Testi</span>
          <Star className="w-3 h-3 text-yellow-400/70 fill-yellow-400/40" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <h1 className="text-[clamp(3.5rem,11vw,7rem)] font-black leading-none tracking-tight">
            <span className="block text-white/10" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}>
              Hangi
            </span>
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, #ffffff 0%, ${currentColor} 55%, #a78bfa 100%)`, transition: 'background-image 1s ease' }}
            >
              Yazarsın?
            </span>
          </h1>
        </motion.div>

        {/* Author carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="min-h-[90px] flex flex-col items-center justify-center gap-2"
        >
          <p className="text-white/25 text-xs uppercase tracking-[0.22em] font-semibold">belki sen...</p>
          {mounted && <AuthorCarousel current={currentAuthor} />}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col items-center gap-5"
        >
          <button onClick={() => router.push('/quiz')} className="group relative">
            {/* Glow behind */}
            <div
              className="absolute inset-0 rounded-2xl blur-xl scale-110 opacity-40 group-hover:opacity-70 transition-opacity duration-500"
              style={{ background: `linear-gradient(135deg, ${currentColor}, #7c3aed)`, transition: 'background 1s ease, opacity 0.5s' }}
            />
            <div
              className="relative flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-white overflow-hidden transition-transform duration-300 group-hover:scale-[1.04] active:scale-[0.97]"
              style={{ background: `linear-gradient(135deg, ${currentColor}cc, #6d28d9)`, transition: 'background 1s ease' }}
            >
              {/* Shimmer sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/12 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <BookMarked className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Kendi Hikayeni Keşfet</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </button>

          {/* Stats */}
          <div className="flex items-center gap-3 text-white/25 text-xs font-semibold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Feather className="w-3 h-3" />15 Yazar</span>
            <div className="w-px h-3 bg-white/15" />
            <span>15 Soru</span>
            <div className="w-px h-3 bg-white/15" />
            <span>~3 Dakika</span>
          </div>
        </motion.div>

        {/* Rotating quotes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {mounted && <QuoteRotator />}
        </motion.div>

      </div>
    </main>
  );
}
