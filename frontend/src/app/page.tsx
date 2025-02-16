'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 animate-gradient-x">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center min-h-[80vh] text-center"
        >
          {/* Animated Title */}
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl"
          >
            Memory Quest
          </motion.h1>

          {/* Particle Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: Math.random() * 2
                }}
                className="absolute bg-white/10 rounded-full"
                style={{
                  width: `${Math.random() * 20 + 10}px`,
                  height: `${Math.random() * 20 + 10}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Main Buttons */}
          <div className="relative z-10 space-y-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/new-game')}
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

          {/* Floating Cards Animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0 }}
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                {['🃏', '🎴', '✨', '🌟'][i % 4]}
              </motion.div>
            ))}
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}