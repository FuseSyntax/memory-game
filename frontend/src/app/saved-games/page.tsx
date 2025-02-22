'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GameState } from '../types';
import { AlertModal } from '../../../components/AlertModal';
import { FaHome, FaTrash, FaGamepad } from 'react-icons/fa';

export default function SavedGamesPage() {
  const [savedGames, setSavedGames] = useState<GameState[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Parallax effects
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('memoryGames');
      if (saved) {
        setSavedGames(JSON.parse(saved));
      }
    }
  }, []);

  const deleteGame = (gameId: string) => {
    const updatedGames = savedGames.filter(game => game.id !== gameId);
    localStorage.setItem('memoryGames', JSON.stringify(updatedGames));
    setSavedGames(updatedGames);
    setShowDeleteConfirm(null);
  };

  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-32 pb-12">
        <div className="flex justify-between items-center mb-12">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Saved Sessions
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="bg-cyan-500/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
          >
            <FaHome className="text-lg" />
            Dashboard
          </motion.button>
        </div>

        {savedGames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-cyan-400/20"
          >
            <p className="text-xl text-cyan-200 mb-4">No active sessions found</p>
            <p className="text-gray-400">Start a new game to see your progress here</p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {savedGames.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                whileHover={{ scale: 1.02 }}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                      <FaGamepad className="text-cyan-400" />
                      Session {new Date(game.timestamp).toLocaleDateString()}
                    </h3>
                    <div className="flex gap-6 text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">⏱️</span>
                        <span>{Math.floor(game.time / 60)}:{(game.time % 60).toString().padStart(2, '0')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">♟️</span>
                        <span>{game.moves} moves</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => router.push(`/game/${game.id}`)}
                      className="px-6 py-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-400/30 hover:bg-cyan-500/30 flex items-center gap-2"
                    >
                      <FaGamepad />
                      Continue
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowDeleteConfirm(game.id)}
                      className="px-6 py-3 bg-red-500/20 rounded-xl text-red-400 border border-red-400/30 hover:bg-red-500/30 flex items-center gap-2"
                    >
                      <FaTrash />
                      Remove
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AlertModal
          isOpen={!!showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          title="Delete Session?"
          message="This action cannot be undone. All progress will be permanently removed."
          actions={[
            {
              text: 'Cancel',
              action: () => setShowDeleteConfirm(null),
              style: 'bg-gray-600 hover:bg-gray-500',
            },
            {
              text: 'Delete Forever',
              action: () => deleteGame(showDeleteConfirm!),
              style: 'bg-red-600 hover:bg-red-500',
            },
          ]}
        />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
    </div>
  );
}