'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardComponent, type CardType, type GameState } from '../components/Card';
import { GameOverModal } from '../components/GameOverModal';
import { AlertModal } from '../components/AlertModal'; // Ensure AlertModal is implemented

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
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | null;

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
    // Reset timer, moves, and other states.
    setTime(0);
    setMoves(0);
    setGameOver(false);
    setFlipped([]);
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

  // Instead of toggling paused state directly, show the pause modal.
  const handlePause = () => {
    setPaused(true);
    setShowPauseModal(true);
  };

  // Save game then show save modal.
  const handleSaveGame = () => {
    const gameState: GameState = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      cards,
      moves,
      time,
      flipped,
      gameOver,
    };
    const existingGames = JSON.parse(localStorage.getItem('memoryGames') || '[]');
    existingGames.push(gameState);
    localStorage.setItem('memoryGames', JSON.stringify(existingGames));
    setShowSaveModal(true);
  };

  const handleCloseGame = () => {
    router.push('/');
  };

  // Restart function: reinitialize the game using the current difficulty.
  const restartGame = () => {
    if (difficulty) {
      initializeGame(difficulty);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-white drop-shadow-md"
          >
            Memory Game
          </motion.h1>
          <div className="text-white text-xl bg-white/10 px-4 py-2 rounded-lg">
            Moves: {moves} | Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={handlePause}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Pause
            </button>
            <button
              onClick={handleSaveGame}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Game
            </button>
          </div>
          <div className="flex gap-2">
            {/* Instead of routing directly, show a confirmation modal */}
            <button
              onClick={() => setShowRestartModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Game
            </button>
            <button
              onClick={handleCloseGame}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Close Game
            </button>
          </div>
        </div>

        {/* Game Cards Grid */}
        <div className={`grid ${gridColsClass} gap-4 p-4`}>
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
            <GameOverModal
              moves={moves}
              time={time}
              onRestart={restartGame}
            />
          )}
        </AnimatePresence>

        {/* Pause Modal */}
        <AnimatePresence>
          {showPauseModal && (
            <AlertModal
              isOpen={showPauseModal}
              onClose={() => {
                setShowPauseModal(false);
                setPaused(false);
              }}
              title="Game Paused"
              message="Do you want to resume or go back to home?"
              actions={[
                {
                  text: 'Resume',
                  action: () => {
                    setShowPauseModal(false);
                    setPaused(false);
                  },
                  style: 'bg-green-600 hover:bg-green-700',
                },
                {
                  text: 'Go Home',
                  action: () => router.push('/'),
                  style: 'bg-red-600 hover:bg-red-700',
                },
              ]}
            />
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
                  style: 'bg-blue-600 hover:bg-blue-700',
                },
                {
                  text: 'Close',
                  action: () => setShowSaveModal(false),
                  style: 'bg-gray-600 hover:bg-gray-700',
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
                  style: 'bg-green-600 hover:bg-green-700',
                },
                {
                  text: 'Cancel',
                  action: () => setShowRestartModal(false),
                  style: 'bg-gray-600 hover:bg-gray-700',
                },
              ]}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
