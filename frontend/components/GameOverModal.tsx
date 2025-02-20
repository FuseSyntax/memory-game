'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const GameOverModal = ({ 
  moves,
  time,
  onRestart 
}: { 
  moves: number;
  time: number;
  onRestart: () => void;
}) => {
  const router = useRouter(); // ✅ Correct way to use routing in App Router

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.5, rotateX: 90 }}
        animate={{ scale: 1, rotateX: 0 }}
        className="bg-gray-900/95 border-2 border-cyan-400/30 rounded-2xl p-8 max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10" />
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-8xl animate-pulse">
              🏆
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent neon-glow mt-8">
              MISSION COMPLETE
            </h2>
          </div>

          <div className="space-y-4 text-gray-300">
            <div className="flex justify-between items-center py-3 border-b border-cyan-400/30">
              <span className="text-xl">Total Moves:</span>
              <span className="text-2xl font-bold text-cyan-400">{moves}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-cyan-400/30">
              <span className="text-xl">Mission Time:</span>
              <span className="text-2xl font-bold text-cyan-400">{formatTime(time)}</span>
            </div>
          </div>

          <div className="grid gap-4">
            <motion.button
              onClick={onRestart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 bg-gradient-to-r from-cyan-600/80 z-10 to-blue-600/80 rounded-xl font-bold text-xl text-white flex items-center justify-center gap-2 hover:shadow-cyan-500/20 hover:shadow-lg transition-all"
            >
              <span className="text-2xl">🔄</span>
              RETRY MISSION
            </motion.button>
            <motion.button
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 bg-gradient-to-r from-purple-600/80 to-pink-600/80 z-10 rounded-xl font-bold text-xl text-white flex items-center justify-center gap-2 hover:shadow-purple-500/20 hover:shadow-lg transition-all"
            >
              <span className="text-2xl">🏰</span>
              RETURN TO HQ
            </motion.button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30" />
      </motion.div>
    </motion.div>
  );
};
