'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameBoard } from '../../../../components/GameBoard';
import { GameState } from '../../types';
import { motion } from 'framer-motion';


export default function GamePage({ params }: { params: { id: string } }) {
  const [savedGame, setSavedGame] = useState<GameState | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem('memoryGames') || '[]');
    const game = savedGames.find((g: GameState) => g.id === params.id);
    
    if (game) {
      setSavedGame(game);
    } else {
      alert('Game not found');
      router.push('/');
    }
  }, [params.id, router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900"
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