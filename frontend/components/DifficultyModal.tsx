'use client';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

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
  const handleSelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    onDifficultySelect(difficulty);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-4 text-white text-center">Select Difficulty</h3>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleSelect('easy')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Easy (10 cards)
              </button>
              <button
                onClick={() => handleSelect('medium')}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Medium (20 cards)
              </button>
              <button
                onClick={() => handleSelect('hard')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Hard (30 cards)
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DifficultyModal;
