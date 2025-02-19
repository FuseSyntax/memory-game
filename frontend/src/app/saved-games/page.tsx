'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GameState } from '../types';
import { AlertModal } from '../../../components/AlertModal';

export default function SavedGamesPage() {
  const [savedGames, setSavedGames] = useState<GameState[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('memoryGames');
    if (saved) {
      setSavedGames(JSON.parse(saved));
    }
  }, []);

  const deleteGame = (gameId: string) => {
    const updatedGames = savedGames.filter(game => game.id !== gameId);
    localStorage.setItem('memoryGames', JSON.stringify(updatedGames));
    setSavedGames(updatedGames);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
      <div className="max-w-4xl mx-auto max-h-screen">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Saved Games
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            🏠 Back to Home
          </motion.button>
        </div>

        {savedGames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 rounded-xl bg-white/10 backdrop-blur-sm"
          >
            <p className="text-xl text-purple-200">No saved games found</p>
            <p className="text-purple-300 mt-2">Play a game and save your progress!</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {savedGames.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-purple-200">
                      🕹️ {new Date(game.timestamp).toLocaleString()}
                    </h3>
                    <div className="text-purple-300 mt-2">
                      <p>⭐ Moves: {game.moves}</p>
                      <p>⏱️ Time: {Math.floor(game.time / 60)}:{(game.time % 60).toString().padStart(2, '0')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => router.push(`/game/${game.id}`)}
                      className="px-4 py-2 bg-green-500 rounded-lg text-white shadow-lg hover:bg-green-600 transition-colors"
                    >
                      🎮 Play
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowDeleteConfirm(game.id)}
                      className="px-4 py-2 bg-red-500 rounded-lg text-white shadow-lg hover:bg-red-600 transition-colors"
                    >
                      🗑️ Delete
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
          title="Delete Game?"
          message="Are you sure you want to delete this saved game?"
          actions={[
            {
              text: 'Cancel',
              action: () => setShowDeleteConfirm(null),
              style: 'bg-gray-500 hover:bg-gray-600 z-10',
            },
            {
              text: 'Delete',
              action: () => deleteGame(showDeleteConfirm!),
              style: 'bg-red-600 hover:bg-red-700 z-10',
            },
          ]}
        />
      </div>
    </div>
  );
}
