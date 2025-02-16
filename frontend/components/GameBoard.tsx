'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardComponent, type CardType, type GameState } from '../components/Card';
import { GameOverModal } from './GameOverModal';
import { useRouter } from 'next/navigation';
import { AlertModal } from './AlertModal';

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
];

export const GameBoard = ({ savedGame }: { savedGame: GameState | null }) => {
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [cards, setCards] = useState<CardType[]>(savedGame?.cards || []);
  const [flipped, setFlipped] = useState<number[]>(savedGame?.flipped || []);
  const [moves, setMoves] = useState(savedGame?.moves || 0);
  const [gameOver, setGameOver] = useState(savedGame?.gameOver || false);
  const [time, setTime] = useState(savedGame?.time || 0);
  const [paused, setPaused] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!savedGame) initializeGame();
  }, [savedGame]);

  const initializeGame = () => {
    const shuffled = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, id) => ({
        id,
        value,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver && !paused) setTime((prev: number) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver, paused]);

  const handleCardClick = (id: number) => {
    if (flipped.length < 2 && !flipped.includes(id) && !paused) {
      const newFlipped = [...flipped, id];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m: number) => m + 1);
        const [first, second] = newFlipped;
        if (cards[first].value === cards[second].value) {
          setCards(currentCards => {
            const updatedCards = currentCards.map(card =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            );

            if (updatedCards.every(c => c.isMatched)) {
              setGameOver(true);
            }
            return updatedCards;
          });
        }
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const handleCloseGame = () => {
    setShowExitConfirm(true);
  };
  
  const saveGame = () => {
    const gameState: GameState = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      cards,
      moves,
      time,
      flipped,
      gameOver,
    };
    
    const savedGames = JSON.parse(localStorage.getItem('memoryGames') || '[]');
    const updatedGames = [...savedGames, gameState];
    localStorage.setItem('memoryGames', JSON.stringify(updatedGames));
    
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 2000);
  };

  const pauseGame = () => {
    setPaused(!paused);
    if (!paused) {
      const gameState = {
        cards,
        moves,
        time,
        flipped,
        gameOver,
      };
      localStorage.setItem('memoryGame', JSON.stringify(gameState));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-8">
      <div className="max-w-4xl mx-auto max-h-screen">
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
        <div className="flex justify-between items-center my-4">
          <div className="flex gap-2">
            <button
              onClick={pauseGame}
              className={`bg-purple-600 text-white px-4 py-2 rounded-lg ${
                paused ? 'bg-red-600' : ''
              } hover:bg-purple-700 transition-colors`}
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={saveGame}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Game
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Home
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 max-w-4xl mx-auto h-auto">
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

        {/* Modals */}
        <AlertModal
          isOpen={showSaveAlert}
          onClose={() => setShowSaveAlert(false)}
          title="Game Saved!"
          message="Your progress has been successfully saved."
          actions={[
            { 
              text: 'OK', 
              action: () => setShowSaveAlert(false),
              style: 'bg-green-600 hover:bg-green-700' 
            }
          ]}
        />

        <AlertModal
          isOpen={showExitConfirm}
          onClose={() => setShowExitConfirm(false)}
          title="Exit Game?"
          message="Are you sure you want to exit the game?"
          actions={[
            { 
              text: 'Cancel', 
              action: () => setShowExitConfirm(false),
              style: 'bg-gray-500 hover:bg-gray-600' 
            },
            { 
              text: 'Exit', 
              action: () => {
                if (typeof window !== 'undefined') {
                  window.close();
                  router.push('/');
                }
              },
              style: 'bg-red-600 hover:bg-red-700' 
            }
          ]}
        />

        {/* Game Over Modal */}
        <AnimatePresence>
          {gameOver && (
            <GameOverModal
              moves={moves}
              time={time}
              onRestart={() => {
                initializeGame();
                setGameOver(false);
                setMoves(0);
                setTime(0);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};