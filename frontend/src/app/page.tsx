'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DifficultyModal from '../../components/DifficultyModal';

export default function Home() {
  const router = useRouter();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    // Redirect to the new game route with the selected difficulty as a query parameter.
    router.push(`/new-game?difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 animate-gradient-x flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl"
        >
          Memory Quest
        </motion.h1>

        <div className="space-y-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDifficultyModal(true)}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-2xl font-bold shadow-lg shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <span className="text-3xl">🎮</span>
            Start New Game
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/saved-games')}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-2xl font-bold shadow-lg shadow-indigo-500/30 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <span className="text-3xl">💾</span>
            Load Saved Games
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
