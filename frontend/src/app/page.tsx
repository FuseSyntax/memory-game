// src/pages/index.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DifficultyModal from '../../components/DifficultyModal';
import AuthModal from '../../components/AuthModal';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('authChange', checkAuth);
    checkAuth();
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    router.push(`/new-game?difficulty=${difficulty}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/circuit-board.svg')] opacity-10"></div>

      <div className="container mx-auto px-4 py-16 text-center relative z-10 mt-[15vh]">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent neon-glow"
        >
          <Link href={"/"}>
            NEON MATRIX
          </Link>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-2xl opacity-30"></div>
        </motion.h1>

        <div className="space-y-6 max-w-2xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDifficultyModal(true)}
            className="w-full px-8 py-4 bg-gray-800 hover:bg-gray-700 border-2 border-cyan-400/50 text-white rounded-xl text-2xl font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span className="text-3xl transition-transform group-hover:scale-125">🕹️</span>
            <span className="">New Game</span>
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/saved-games')}
            className="w-full px-8 py-4 bg-gray-800 hover:bg-gray-700 border-2 border-cyan-400/50 text-white rounded-xl text-2xl font-bold shadow-lg shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span className="text-3xl transition-transform group-hover:scale-125">💾</span>
            <span className="">Load Saved Games</span>
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>


          </motion.button>

          {!isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="w-full px-8 py-4 bg-gray-800 hover:bg-gray-700 border-2 border-purple-400/50 text-white rounded-xl text-2xl font-bold shadow-lg shadow-purple-500/20 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <span className="text-3xl transition-transform group-hover:scale-125">🔐</span>
              <span className="">Sign In</span>
              <div className="absolute inset-0 rounded-xl border-2 border-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>
          ) : (
            <div className="grid grid-cols-2 gap-4 z-10 relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gray-800 border-2 cursor-pointer border-green-400/30 rounded-lg flex items-center gap-2 group"
                onClick={() => router.push('/dashboard')}
              >
                <span className="text-green-400">👾</span>
                <span className="text-gray-300 group-hover:text-green-400 transition-colors">Dashboard</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gray-800 border-2 border-red-400/30 rounded-lg flex items-center gap-2 group"
                onClick={handleLogout}
              >
                <span className="text-red-400">🚪</span>
                <span className="text-gray-300 group-hover:text-red-400 transition-colors">Logout</span>
              </motion.button>
            </div>
          )}
        </div>

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

        <AnimatePresence>
          {showDifficultyModal && (
            <DifficultyModal
              isOpen={showDifficultyModal}
              onClose={() => setShowDifficultyModal(false)}
              onDifficultySelect={handleDifficultySelect}
            />
          )}
          {showAuthModal && (
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}