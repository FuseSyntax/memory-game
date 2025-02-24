/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaWallet, FaBars, FaTimes, FaEthereum } from 'react-icons/fa';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertModal } from '../components/AlertModal';
import AuthModal from '../components/AuthModal'; // Import your Auth modal

const NETWORK_CONFIG = {
  chainId: '0xaa36a7',
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'SepoliaETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // New state for AuthModal
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Derived state
  const walletConnected = !!walletAddress;

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

const detectWallets = useCallback(() => {
  if (typeof window === 'undefined') return []; // Guard clause for SSR
  const { ethereum, phantom } = window as any;
  const providers = [
    { name: 'MetaMask', check: ethereum?.isMetaMask },
    { name: 'Coinbase', check: ethereum?.isCoinbaseWallet },
    { name: 'Trust Wallet', check: ethereum?.isTrust },
    { name: 'Phantom', check: ethereum?.isPhantom || !!phantom?.ethereum },
    { name: 'Brave Wallet', check: ethereum?.isBraveWallet },
    { name: 'Browser Wallet', check: !!ethereum && !ethereum.isMetaMask },
    { name: 'Phantom (Solana)', check: !!phantom?.solana }
  ];
  const detected = providers.filter(p => p.check).map(p => p.name);
  return [...new Set(detected)].filter(Boolean);
}, []);


  const checkExistingWallet = useCallback(async () => {
    const { ethereum } = window as any;
    if (!ethereum) return;

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(ethereum);
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(accounts[0]);

        setWalletAddress(accounts[0]);
        setNetworkName(network.name);
        setWalletBalance(ethers.formatEther(balance).slice(0, 6));
      }
    } catch (error) {
      console.error('Wallet check error:', error);
    }
  }, []);

  const handleNetworkSwitch = useCallback(async () => {
    const { ethereum } = window as any;
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            ...NETWORK_CONFIG,
            iconUrls: ['https://your-logo-url.com/network-logo.png']
          }],
        });
      }
    }
  }, []);

  const handleWalletConnection = useCallback(
    async (walletType: string) => {
      setLoading(true);
      try {
        const { ethereum } = window as any;
        if (!ethereum) throw new Error('Wallet not detected');

        // First switch to the correct network
        await handleNetworkSwitch();

        // Then request accounts
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
          ...(walletType === 'Coinbase' && { params: [{ appName: 'Neon Matrix' }] }),
        });

        // Update wallet state
        const provider = new ethers.BrowserProvider(ethereum);
        const [network, balance] = await Promise.all([
          provider.getNetwork(),
          provider.getBalance(accounts[0]),
        ]);

        setWalletAddress(accounts[0]);
        setNetworkName(network.name);
        setWalletBalance(ethers.formatEther(balance).slice(0, 6));
      } catch (error) {
        console.error('Connection error:', error);
        alert(error instanceof Error ? error.message : 'Connection failed');
      } finally {
        setLoading(false);
        setShowWalletModal(false);
      }
    },
    [handleNetworkSwitch]
  );

  const disconnectWallet = useCallback(() => {
    setWalletAddress('');
    setWalletBalance('');
    setNetworkName('');
  }, []);

  useEffect(() => {
    checkExistingWallet();

    // Check authentication status based on the token in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, [checkExistingWallet]);

  useEffect(() => {
    const { ethereum } = window as any;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        checkExistingWallet();
      } else {
        disconnectWallet();
      }
    };

    const handleChainChanged = () => checkExistingWallet();

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [checkExistingWallet, disconnectWallet]);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };
  
  useEffect(() => {
    checkAuthStatus();
  }, []);

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
                      setShowAuthModal(true); // Open Auth Modal when "Sign" is clicked
                    }}
                    className="group relative px-3 py-2 hover:text-cyan-400 transition-colors"
                  >
                    Sign
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
                      {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
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
      
      {/* Existing Wallet Modal */}
      <AlertModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        className="neon-modal"
        title="CONNECT WALLET"
        message="Choose your web3 gateway:"
        actions={detectWallets().map((wallet) => ({
          text: wallet,
          action: () => handleWalletConnection(wallet),
          style: `z-10 relative bg-gray-800 hover:bg-cyan-400/10 border border-cyan-400/20 ${
            wallet.includes('MetaMask')
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

      {/* Auth Modal for signing in */}
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
