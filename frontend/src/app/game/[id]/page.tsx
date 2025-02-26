'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameBoard from '../../../../components/GameBoard';
// import { GameState } from '../../types';
import { motion } from 'framer-motion';
import { GameState } from '../../../../components/Card';

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the promise using React.use()
  const { id } = use(params);
  const [savedGame, setSavedGame] = useState<GameState | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem('memoryGames') || '[]');
    // Find the game by id (using any for safety if the structure is incomplete)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const game = savedGames.find((g: any) => g.id === id);
    
    if (game) {
      // Provide a fallback for difficulty if it's missing
      const completeGame: GameState = {
        ...game,
        difficulty: game.difficulty || 'easy',
      };
      setSavedGame(completeGame);
    } else {
      alert('Game not found');
      router.push('/');
    }
  }, [id, router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 pt-20"
    >
      {savedGame ? (
        <GameBoard savedGame={savedGame} />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl text-white"
          >
            🎴
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
