'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem("helpSeen", "true");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -50 }}
            className="bg-gray-900/95 border-2 border-cyan-400/30 rounded-xl p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Game Help & Rules
            </h3>
            <div className="text-gray-300 mb-6 space-y-2 text-sm leading-relaxed">
              <p>Welcome to NEON MATRIX!</p>
              <p><strong>How to Play:</strong></p>
              <ul className="list-disc list-inside">
                <li>Use strategic moves to clear the game board.</li>
                <li>Earn ETH rewards for each level cleared.</li>
                <li>Watch your moves and time to maximize bonuses.</li>
              </ul>
              <p><strong>Rules & Guidelines:</strong></p>
              <ul className="list-disc list-inside">
                <li>No cheating or exploiting bugs.</li>
                <li>Keep your wallet secure at all times.</li>
                <li>Respect fellow players and play fair.</li>
              </ul>
              <p>By playing, you agree to our terms and conditions.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
                className="h-5 w-5"
              />
              <span className="text-gray-300 text-sm">I have read and agree to all the rules</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HelpModal;
