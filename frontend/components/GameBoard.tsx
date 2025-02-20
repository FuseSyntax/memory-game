'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardComponent, type CardType, type GameState } from '../components/Card';
import { GameOverModal } from '../components/GameOverModal';
import { AlertModal } from '../components/AlertModal';
import Link from 'next/link';

const cardValues = [
  '/images/image1.png',
  '/images/image2.png',
  '/images/image3.png',
  '/images/image4.png',
  '/images/image5.png',
  '/images/image6.png',
  '/images/image7.png',
  '/images/image8.png',
  '/images/image9.png',
  '/images/image10.png',
  '/images/image11.png',
  '/images/image12.png',
  '/images/image13.png',
  '/images/image14.png',
  '/images/image15.png',
];

export default function GameBoard({ savedGame }: { savedGame?: GameState | null }) {
  const [cards, setCards] = useState<CardType[]>(savedGame?.cards || []);
  const [flipped, setFlipped] = useState<number[]>(savedGame?.flipped || []);
  const [moves, setMoves] = useState(savedGame?.moves || 0);
  const [gameOver, setGameOver] = useState(savedGame?.gameOver || false);
  const [time, setTime] = useState(savedGame?.time || 0);
  const [paused, setPaused] = useState(false);

  // Modal states for pause, save, and restart confirmation
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);

  // New state to ensure auto-saving happens only once per session
  const [autoSaved, setAutoSaved] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null;

  // --- Declare saveGameSession before it is used elsewhere ---
  const saveGameSession = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Save to your backend API
        const response = await fetch('http://localhost:3001/api/user/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            timeTaken: time, // total game time (in seconds)
            moves: moves,    // total moves
            difficulty: difficulty || 'easy', // current difficulty
            result: gameOver ? 'win' : 'incomplete', // based on game state
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save game session');
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error saving game session:', err.message);
      }
    }

    // Save the game session locally (for /saved-game or history view)
    const gameState: GameState = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      moves,
      time,
      difficulty: difficulty || 'easy',
      cards: cards, // include any additional details if needed
      flipped: flipped,
      gameOver,
    };

    const existingGames = localStorage.getItem('memoryGames');
    const memoryGames: GameState[] = existingGames ? JSON.parse(existingGames) : [];
    memoryGames.push(gameState);
    localStorage.setItem('memoryGames', JSON.stringify(memoryGames));
  }, [time, moves, difficulty, gameOver, cards, flipped]);
  // --- End saveGameSession declaration ---

  // Initialize game if no saved game and difficulty exists.
  useEffect(() => {
    if (!savedGame && difficulty) {
      initializeGame(difficulty);
    }
  }, [savedGame, difficulty]);

  // Timer: Increment time every second when not paused or game over.
  useEffect(() => {
    if (!paused && !gameOver) {
      const timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paused, gameOver]);

  // Check if game is complete (all cards are matched)
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameOver(true);
    }
  }, [cards]);

  // Auto-save game session when gameOver becomes true (only once)
  useEffect(() => {
    if (gameOver && !autoSaved) {
      saveGameSession();
      setAutoSaved(true);
    }
  }, [gameOver, autoSaved, saveGameSession]);

  // Adjust grid layout based on the total number of cards.
  const totalCards = cards.length;
  let gridColsClass = 'grid-cols-4';
  if (totalCards === 10) gridColsClass = 'grid-cols-5';
  else if (totalCards === 20) gridColsClass = 'grid-cols-5';
  else if (totalCards === 30) gridColsClass = 'grid-cols-6';

  const initializeGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    let uniqueCount: number;
    switch (difficulty) {
      case 'easy':
        uniqueCount = 5; // 5 pairs => 10 cards
        break;
      case 'medium':
        uniqueCount = 10; // 10 pairs => 20 cards
        break;
      case 'hard':
        uniqueCount = 15; // 15 pairs => 30 cards
        break;
      default:
        uniqueCount = 5;
    }
    const selectedCards = cardValues.slice(0, uniqueCount);
    const shuffled = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((value, id) => ({
        id,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    // Reset timer, moves, gameOver, flipped and autoSaved.
    setTime(0);
    setMoves(0);
    setGameOver(false);
    setFlipped([]);
    setAutoSaved(false);
  };

  const handleCardClick = (id: number) => {
    if (flipped.length < 2 && !flipped.includes(id) && !paused) {
      const newFlipped = [...flipped, id];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves(m => m + 1);
        const [first, second] = newFlipped;
        if (cards[first].value === cards[second].value) {
          setCards(currentCards =>
            currentCards.map(card =>
              card.id === first || card.id === second ? { ...card, isMatched: true } : card
            )
          );
        }
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  // Toggle pause state
  const togglePause = () => {
    setPaused(prev => !prev);
  };

  // If user clicks SAVE manually, call the save function.
  const handleSaveGame = async () => {
    await saveGameSession();
    setShowSaveModal(true);
  };

  // Update game history on exit (save session if not already saved)
  const handleCloseGame = async () => {
    if (!autoSaved) {
      await saveGameSession();
      setAutoSaved(true);
    }
    router.push('/');
  };

  // Restart the game using the current difficulty.
  const restartGame = () => {
    if (difficulty) {
      initializeGame(difficulty);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" />

      <div className="max-w-6xl mx-auto p-8 relative z-10">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent neon-glow"
          >
            <Link href={"/"}>NEON MATRIX</Link>
          </motion.h1>
          <div className="flex items-center gap-4 bg-gray-800/50 px-6 py-3 rounded-xl border-2 border-cyan-400/20">
            <div className="text-cyan-400">
              <span className="font-bold text-xl">{moves}</span>
              <span className="text-sm ml-1">MOVES</span>
            </div>
            <div className="h-8 w-px bg-cyan-400/30" />
            <div className="text-purple-400">
              <span className="font-bold text-xl">
                {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-sm ml-1">TIME</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-3">
            <motion.button
              onClick={togglePause}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border-2 border-cyan-400/30 rounded-xl text-cyan-400 flex items-center gap-2"
            >
              <span className="text-xl">{paused ? '▶️' : '⏸️'}</span>
              {paused ? 'RESUME' : 'PAUSE'}
            </motion.button>
            <motion.button
              onClick={handleSaveGame}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border-2 border-purple-400/30 rounded-xl text-purple-400 flex items-center gap-2"
            >
              <span className="text-xl">💾</span>
              SAVE
            </motion.button>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={() => setShowRestartModal(true)}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border-2 border-blue-400/30 rounded-xl text-blue-400 flex items-center gap-2"
            >
              <span className="text-xl">🔄</span>
              NEW GAME
            </motion.button>
            <motion.button
              onClick={handleCloseGame}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border-2 border-red-400/30 rounded-xl text-red-400 flex items-center gap-2"
            >
              <span className="text-xl">🚪</span>
              EXIT
            </motion.button>
          </div>
        </div>

        {/* Game Cards Grid */}
        <div className={`grid ${gridColsClass} gap-4 p-4 bg-gray-900/50 rounded-2xl border-2 border-cyan-400/10 backdrop-blur-sm`}>
          {cards.map(card => (
            <CardComponent
              key={card.id}
              className="aspect-square"
              card={card}
              isFlipped={flipped.includes(card.id) || card.isMatched}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>

        {/* Game Over Modal */}
        <AnimatePresence>
          {gameOver && (
            <GameOverModal moves={moves} time={time} onRestart={restartGame} />
          )}
        </AnimatePresence>

        {/* Save Game Modal */}
        <AnimatePresence>
          {showSaveModal && (
            <AlertModal
              isOpen={showSaveModal}
              onClose={() => setShowSaveModal(false)}
              title="Game Saved!"
              message="Your progress has been saved."
              actions={[
                {
                  text: 'Go Home',
                  action: () => router.push('/'),
                  style: 'bg-blue-600 hover:bg-blue-700 z-10',
                },
                {
                  text: 'Close',
                  action: () => setShowSaveModal(false),
                  style: 'bg-gray-600 hover:bg-gray-700 z-10',
                },
              ]}
            />
          )}
        </AnimatePresence>

        {/* Restart Game Modal */}
        <AnimatePresence>
          {showRestartModal && (
            <AlertModal
              isOpen={showRestartModal}
              onClose={() => setShowRestartModal(false)}
              title="Restart Game?"
              message="Do you want to restart this game?"
              actions={[
                {
                  text: 'Restart',
                  action: () => {
                    restartGame();
                    setShowRestartModal(false);
                  },
                  style: 'bg-green-600 hover:bg-green-700 z-10',
                },
                {
                  text: 'Cancel',
                  action: () => setShowRestartModal(false),
                  style: 'bg-gray-600 hover:bg-gray-700 z-10',
                },
              ]}
            />
          )}
        </AnimatePresence>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 5}s infinite`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
