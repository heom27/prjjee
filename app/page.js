'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const AUTHORS = [
  'Namık Kemal', 'Orhan Veli', 'Tanpınar',
  'Sait Faik', 'Halide Edip', 'Cemal Süreya'
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentAuthor((prev) => (prev + 1) % AUTHORS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-surface-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] mix-blend-screen" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {AUTHORS.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0.02, 0.06, 0.02],
              y: [-20, 20, -20],
              x: Math.sin(i) * 30
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className="absolute text-white/10 font-black whitespace-nowrap"
            style={{
              fontSize: `${Math.random() * 40 + 40}px`,
              left: `${(i * 17 + 5) % 80}%`,
              top: `${(i * 23 + 10) % 80}%`,
              transform: `rotate(${i * 15 - 30}deg)`,
            }}
          >
            {name}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-medium text-white/80">Türk Edebiyatı Kişilik Testi</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
            Hangi
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-indigo-400 drop-shadow-lg">
            Yazarsın?
          </span>
        </motion.h1>

        {/* Dynamic Subtitle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-16 flex items-center justify-center mb-10"
        >
          <p className="text-xl md:text-2xl text-white/60 font-light flex items-center gap-2 flex-wrap justify-center">
            Ruhunun derinliklerinde yatan isim
            <AnimatePresence mode="wait">
              <motion.span
                key={currentAuthor}
                initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="font-bold text-brand-300 inline-block px-1"
              >
                {AUTHORS[currentAuthor]}
              </motion.span>
            </AnimatePresence>
            mı?
          </p>
        </motion.div>

        {/* Action Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <button
            onClick={() => router.push('/quiz')}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-surface-950 font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <BookOpen className="w-6 h-6 relative z-10 text-brand-600" />
            <span className="relative z-10">Kendi Hikayeni Keşfet</span>
            <ArrowRight className="w-5 h-5 relative z-10 text-brand-600 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center gap-4 text-sm font-medium text-white/40">
            <span>15 Özel Soru</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>~3 Dakika</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>Edebi Analiz</span>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
