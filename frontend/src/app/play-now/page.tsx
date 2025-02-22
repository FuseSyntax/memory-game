'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import DifficultyModal from '../../../components/DifficultyModal';
import Link from 'next/link';
import { FaSave, FaRocket } from 'react-icons/fa';
import { SiMatrix } from 'react-icons/si';

export default function PlayNow() {
  const router = useRouter();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  // Parallax effects
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    router.push(`/new-game?difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
      {/* Animated Background */}
      <motion.div 
        style={{ opacity, scale }}
        className="absolute inset-0 bg-grid-white/[0.03]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/20" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-24">
        {/* Animated Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
              }}
              animate={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          {/* Glowing Title */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-16"
          >
            <Link href="/" className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 blur-3xl opacity-30 -z-10" />
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-4 justify-center">
                <SiMatrix className="text-purple-400 text-7xl md:text-9xl" />
                NEON MATRIX
              </h1>
            </Link>
            <p className="mt-4 text-xl text-cyan-300 font-mono"></p>
          </motion.div>

          {/* Action Buttons Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDifficultyModal(true)}
              className="relative p-8 bg-gray-800/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-2xl hover:border-cyan-400/60 transition-all group"
            >
              <div className="space-y-4">
                <div className="inline-block p-4 bg-cyan-500/20 rounded-full">
                  <FaRocket className="text-4xl text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">New Mission</h2>
                <p className="text-gray-400">Initiate new neural network sequence</p>
              </div>
              <div className="absolute inset-0 border-2 border-cyan-400/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/saved-games')}
              className="relative p-8 bg-gray-800/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl hover:border-purple-400/60 transition-all group"
            >
              <div className="space-y-4">
                <div className="inline-block p-4 bg-purple-500/20 rounded-full">
                  <FaSave className="text-4xl text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Load Profile</h2>
                <p className="text-gray-400">Access archived neural patterns</p>
              </div>
              <div className="absolute inset-0 border-2 border-purple-400/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
            </motion.button>
          </div>
        </motion.div>

        {/* Difficulty Selection Modal */}
        <AnimatePresence>
          {showDifficultyModal && (
            <DifficultyModal
              isOpen={showDifficultyModal}
              onClose={() => setShowDifficultyModal(false)}
              onDifficultySelect={handleDifficultySelect}
            />
          )}
        </AnimatePresence>

        {/* Animated Circuit Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/images/circuit-pattern.svg')] bg-repeat animate-pan" />
        </div>
      </div>
    </div>
  );
}