'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaWallet, FaBars, FaTimes, FaEthereum } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertModal } from '../components/AlertModal';
import AuthModal from '../components/AuthModal';
import { useWallet } from './WalletProvider';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Get all wallet-related state and methods from context
  const {
    walletAddress,
    walletBalance,
    networkName,
    walletConnected,
    loading,
    showWalletModal,
    setShowWalletModal,
    handleWalletConnection,
    disconnectWallet,
    detectWallets
  } = useWallet();

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const checkExistingWallet = useCallback(async () => {
    const { ethereum } = window;
    if (!ethereum) return;

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];

      if (accounts?.length > 0) {
        // const provider = new ethers.BrowserProvider(ethereum);

        // These state setters should come from your context if needed
        // Consider moving this logic to your WalletProvider
      }
    } catch (error) {
      console.error('Wallet check error:', error);
    }
  }, []);

  useEffect(() => {
    checkExistingWallet();
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, [checkExistingWallet]);



  return (
    <>
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-cyan-400/20 text-white px-4 py-3 shadow-2xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent neon-pulse">
            NEON<span className="text-purple-400">MATRIX</span>
          </Link>

          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-gray-800/50 border border-cyan-400/20 hover:bg-cyan-400/10 transition-colors"
            >
              {menuOpen ? <FaTimes className="text-cyan-400" /> : <FaBars />}
            </motion.button>
          </div>

          <div className={`items-center gap-6 ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
            <ul className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full md:w-auto">
              {['/', '/play-now', '/games', '/marketplace'].map((path) => (
                <li key={path}>
                  <Link
                    href={path}
                    onClick={() => setMenuOpen(false)}
                    className="group relative px-3 py-2 hover:text-cyan-400 transition-colors"
                  >
                    {path === '/' ? 'Home' :
                      path.slice(1)
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, c => c.toUpperCase())}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
              <li>
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="group relative px-3 py-2 hover:text-cyan-400 transition-colors"
                  >
                    Dashboard
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="group relative px-3 py-2 hover:text-cyan-400 transition-colors"
                  >
                    Login
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </button>
                )}
              </li>
            </ul>
            <li className="flex items-center gap-2">
              {walletConnected ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 bg-gray-800/50 border border-cyan-400/20 rounded-full pl-3 pr-1 py-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-sm bg-cyan-400/10 rounded-full px-2 py-1">
                      <FaEthereum className="text-cyan-400 mr-1" />
                      <span className="font-mono">{walletBalance}</span>
                    </div>
                    <span className="text-xs text-cyan-300">{networkName}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-cyan-400/10 rounded-full px-3 py-2">
                    <span className="text-sm font-mono">
                      {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
                    </span>
                    <button
                      onClick={disconnectWallet}
                      className="ml-2 p-1 rounded-full hover:bg-cyan-400/20 transition-colors"
                    >
                      <FaTimes className="w-3 h-3 text-cyan-400" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWalletModal(true)}
                  disabled={loading}
                  className="group relative px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FaWallet className="text-xl" />
                    <span>{loading ? 'CONNECTING...' : 'CONNECT WALLET'}</span>
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </motion.button>
              )}
            </li>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-cyan-400/10 p-4 space-y-4"
            >
              {['/', '/play-now', '/games', '/marketplace'].map((path) => (
                <li key={path}>
                  <Link
                    href={path}
                    onClick={() => setMenuOpen(false)}
                    className="group relative px-3 py-2 hover:text-cyan-400 transition-colors"
                  >
                    {path === '/' ? 'Home' :
                      path.slice(1)
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, c => c.toUpperCase())}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AlertModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        className="neon-modal"
        title="CONNECT WALLET"
        message="Choose your web3 gateway:"
        actions={detectWallets().map((wallet) => ({
          text: wallet,
          action: () => handleWalletConnection(wallet),
          style: `z-10 relative bg-gray-800 hover:bg-cyan-400/10 border border-cyan-400/20 ${wallet.includes('MetaMask')
              ? 'text-orange-400'
              : wallet.includes('Coinbase')
                ? 'text-blue-400'
                : wallet.includes('Phantom')
                  ? 'text-purple-400'
                  : 'text-cyan-400'
            }`
        }))}
        customStyles={{
          content: {
            background: 'linear-gradient(160deg, #1a1f2e 0%, #0d1117 100%)',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)',
          }
        }}
      />

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;