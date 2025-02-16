'use client';
import { GameBoard } from '../../../components/GameBoard';
import { motion } from 'framer-motion';

export default function NewGame() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900"
    >
      <div className="particle-background">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              y: [0, -100],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      <GameBoard savedGame={null} />
    </motion.div>
  );
}