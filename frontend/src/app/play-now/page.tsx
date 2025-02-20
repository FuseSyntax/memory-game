'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DifficultyModal from '../../../components/DifficultyModal';
import Link from 'next/link';

export default function PlayNow() {
  const router = useRouter();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    router.push(`/new-game?difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"></div>

      <div className="container mx-auto px-4 py-16 text-center relative z-10 mt-[15vh]">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent neon-glow"
        >
          <Link href="/">NEON MATRIX</Link>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-2xl opacity-30 -z-10"></div>
        </motion.h1>

        <div className="space-y-6 max-w-2xl mx-auto relative z-10">
          <motion.button
            whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDifficultyModal(true)}
            className="w-full px-8 py-4 bg-gray-800 hover:bg-gray-700 border-2 border-cyan-400/50 text-white rounded-xl text-2xl font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span className="text-3xl transition-transform group-hover:scale-125">🕹️</span>
            <span>New Game</span>
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/saved-games')}
            className="w-full px-8 py-4 bg-gray-800 hover:bg-gray-700 border-2 border-cyan-400/50 text-white rounded-xl text-2xl font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span className="text-3xl transition-transform group-hover:scale-125">💾</span>
            <span>Load Saved Games</span>
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          </motion.button>
        </div>

        <AnimatePresence>
          {showDifficultyModal && (
            <DifficultyModal
              isOpen={showDifficultyModal}
              onClose={() => setShowDifficultyModal(false)}
              onDifficultySelect={handleDifficultySelect}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
