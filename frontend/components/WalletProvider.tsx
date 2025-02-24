// components/WalletProvider.tsx
'use client';
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Add type declarations for Ethereum providers
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      isTrust?: boolean;
      isPhantom?: boolean;
      isBraveWallet?: boolean;
      request: <T = unknown>(args: { 
        method: string; 
        params?: unknown[] 
      }) => Promise<T>;
      on: (event: string, callback: () => void) => void;
      removeListener: (event: string, callback: () => void) => void;
    };
    phantom?: {
      ethereum?: unknown;
      solana?: unknown;
    };
  }
}
interface WalletContextType {
  walletAddress: string;
  walletBalance: string;
  networkName: string;
  walletConnected: boolean;
  loading: boolean;
  showWalletModal: boolean;
  setShowWalletModal: (value: boolean) => void;
  handleWalletConnection: (walletType: string) => Promise<void>;
  disconnectWallet: () => void;
  detectWallets: () => string[];
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

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

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const detectWallets = useCallback(() => {
    // Guard clause for SSR
    if (typeof window === 'undefined') return [];

    const { ethereum, phantom } = window;
    const providers = [
      { name: 'MetaMask', check: ethereum?.isMetaMask },
      { name: 'Coinbase', check: ethereum?.isCoinbaseWallet },
      { name: 'Trust Wallet', check: ethereum?.isTrust },
      { name: 'Phantom', check: ethereum?.isPhantom || !!phantom?.ethereum },
      { name: 'Brave Wallet', check: ethereum?.isBraveWallet },
      { name: 'Browser Wallet', check: !!ethereum && !ethereum.isMetaMask },
      { name: 'Phantom (Solana)', check: !!phantom?.solana }
    ];

    return providers.filter(p => p.check).map(p => p.name);
  }, []);

  const checkExistingWallet = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const { ethereum } = window;
    if (!ethereum) return;
  
    try {
      const accounts = await ethereum.request({ 
        method: 'eth_accounts' 
      }) as string[]; // Type assertion here
      
      if (accounts && accounts.length > 0) {
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
    if (typeof window === 'undefined') return;
    const { ethereum } = window;
  
    try {
      await ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 4902) {
        await ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [NETWORK_CONFIG],
        });
      }
    }
  }, []);
  

  const handleWalletConnection = useCallback(async (walletType: string) => {
    setLoading(true);
    try {
      if (typeof window === 'undefined') throw new Error('Client-side only');
      const { ethereum } = window;
      if (!ethereum) throw new Error('Wallet not detected');
  
      await handleNetworkSwitch();
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
        ...(walletType === 'Coinbase' && { 
          params: [{ appName: 'Neon Matrix' }] 
        }),
      }) as string[]; // Type assertion here
  
      if (!accounts?.[0]) throw new Error('No accounts found');
      
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
  }, [handleNetworkSwitch]);

  const disconnectWallet = useCallback(() => {
    setWalletAddress('');
    setWalletBalance('');
    setNetworkName('');
  }, []);

  useEffect(() => {
    checkExistingWallet();
  }, [checkExistingWallet]);

  return (
    <WalletContext.Provider value={{
      walletAddress,
      walletBalance,
      networkName,
      walletConnected: !!walletAddress,
      loading,
      showWalletModal,
      setShowWalletModal,
      handleWalletConnection,
      disconnectWallet,
      detectWallets
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};