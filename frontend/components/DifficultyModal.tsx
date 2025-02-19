'use client';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface Difficulty {
  level: 'easy' | 'medium' | 'hard';
  label: string;
  cards: number;
  color: string;
}

interface DifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDifficultySelect: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const DifficultyModal: React.FC<DifficultyModalProps> = ({
  isOpen,
  onClose,
  onDifficultySelect
}) => {
  const difficulties: Difficulty[] = [
    { level: 'easy', label: 'Initiate', cards: 10, color: 'from-green-400 to-emerald-600' },
    { level: 'medium', label: 'Adept', cards: 20, color: 'from-yellow-400 to-amber-600' },
    { level: 'hard', label: 'Master', cards: 30, color: 'from-red-400 to-rose-600' },
  ];

  // Define the local handleSelect function which calls the prop
  const handleSelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    onDifficultySelect(difficulty);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-10"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-gray-900/95 border-2 border-cyan-400/30 rounded-xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-center">
              Select Challenge Tier
            </h3>
            <div className="space-y-4">
              {difficulties.map(({ level, label, cards, color }) => (
                <motion.button
                  key={level}
                  onClick={() => handleSelect(level)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full p-4 rounded-xl bg-gradient-to-r ${color} text-white font-bold text-left flex justify-between items-center shadow-lg transition-all`}
                >
                  <span>{label}</span>
                  <span className="text-sm opacity-80">{cards} Fragments</span>
                </motion.button>
              ))}
              <button
                onClick={onClose}
                className="w-full p-3 mt-4 bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 rounded-xl transition-all border border-cyan-400/20"
              >
                Abort Mission
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DifficultyModal;
