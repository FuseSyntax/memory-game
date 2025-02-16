'use client';
import { motion } from 'framer-motion';

export const GameOverModal = ({ 
  moves,
  time,
  onRestart 
}: { 
  moves: number;
  time: number;
  onRestart: () => void;
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-2xl shadow-2xl border-2 border-purple-400 max-w-md w-full"
      >
        <div className="text-center space-y-6">
          <div className="animate-bounce">
            <span className="text-6xl">🎉</span>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-4">
              Victory!
            </h2>
          </div>

          <div className="space-y-4 text-purple-100">
            <div className="flex justify-between items-center py-2 border-b border-purple-400">
              <span className="text-xl">Moves:</span>
              <span className="text-2xl font-bold text-purple-300">{moves}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-purple-400">
              <span className="text-xl">Time:</span>
              <span className="text-2xl font-bold text-purple-300">{formatTime(time)}</span>
            </div>
          </div>

          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(192, 132, 252, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold text-xl transition-all duration-300"
          >
            🔄 Play Again
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};