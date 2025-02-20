/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ethers } from 'ethers';
import { FaEthereum, FaGasPump } from 'react-icons/fa';

interface UserData {
  id: string;
  email: string;
  username: string;
  walletAddress?: string;
}

interface GameSession {
  id: string;
  createdAt: string;
  playerName: string;
  timeTaken: number;
  moves: number;
  difficulty: string;
  result: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 4;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'addMoney' | 'withdrawal'>('profile');

  // Deposit/withdraw variables:
  const [ethAmount, setEthAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [gasPrice, setGasPrice] = useState('0');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Fetch profile and game sessions from backend API
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    const fetchData = async () => {
      try {
        const resProfile = await fetch('http://localhost:3001/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resProfile.ok) {
          const errorData = await resProfile.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }
        const profileData = await resProfile.json();
        setUser(profileData.user);

        const resSessions = await fetch('http://localhost:3001/api/user/sessions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resSessions.ok) {
          const errorData = await resSessions.json();
          throw new Error(errorData.error || 'Failed to fetch game sessions');
        }
        const sessionsData = await resSessions.json();
        setSessions(sessionsData.sessions);
      } catch (err: any) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };
  const handlePlayNow = () => {
    router.push('/play-now');
  };

  // Pagination
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(sessions.length / sessionsPerPage);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Check wallet connection
  useEffect(() => {
    const checkWalletConnection = async () => {
      const { ethereum } = window as any;
      if (ethereum && ethereum.selectedAddress) {
        setIsWalletConnected(true);
        try {
          const provider = new ethers.BrowserProvider(ethereum);
          const balance = await provider.getBalance(ethereum.selectedAddress);
          setWalletBalance(ethers.formatEther(balance).slice(0, 6));
        } catch (error) {
          console.error('Wallet connection check error:', error);
        }
      }
    };
    checkWalletConnection();
  }, []);

  // Fetch gas price using ethers v6 via Infura (or update URL with your Alchemy RPC if needed)
  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(
          `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
        );
        const feeData = await provider.getFeeData();
        if (feeData.gasPrice) {
          setGasPrice(ethers.formatUnits(feeData.gasPrice, 'gwei').slice(0, 6));
        }
      } catch (error) {
        console.error('Gas price fetch error:', error);
      }
    };
    fetchGasPrice();
  }, []);

  const validateNetwork = async () => {
    const { ethereum } = window as any;
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0xaa36a7') {
      alert('Please connect to Sepolia testnet!');
      return false;
    }
    return true;
  };

  // Deposit funds – send ETH to the contract (assuming the contract’s receive() or deposit() handles deposits)
  const handleDeposit = async () => {
    if (!isWalletConnected) {
      alert('Please connect your wallet first!');
      return;
    }
    if (!(await validateNetwork())) return;
    try {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        value: ethers.parseEther(ethAmount),
      });
      await tx.wait();
      alert('Deposit successful!');
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed');
    }
  };

  // Update the handleWithdraw function
const handleWithdraw = async () => {
  if (!isWalletConnected) {
    alert('Please connect your wallet first!');
    return;
  }
  if (!(await validateNetwork())) return;
  
  try {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('Contract address not configured');
    }

    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = ["function withdraw(uint256 amount) external"];
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.withdraw(ethers.parseEther(withdrawAmount));
    await tx.wait();
    alert('Withdrawal successful!');
  } catch (error) {
    console.error('Withdrawal error:', error);
    alert(error instanceof Error ? error.message : 'Withdrawal failed');
  }
};

  // Sidebar Navigation with 4 tabs
  const renderSidebar = () => (
    <div className="w-64 bg-gray-800/50 border-r border-cyan-400/20 p-4 flex flex-col">
      <div className="mb-8 px-2 py-4 border-b border-cyan-400/20">
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          <Link href={"/"}>NEON MATRIX</Link>
        </h2>
      </div>
      <div className="flex flex-col justify-between h-full">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-600/20 border border-cyan-400/30'
                : 'hover:bg-gray-700/30'
            }`}
          >
            <span className="text-cyan-400">👤</span>
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-purple-600/20 border border-purple-400/30'
                : 'hover:bg-gray-700/30'
            }`}
          >
            <span className="text-purple-400">📜</span>
            <span>Game History</span>
          </button>
          <button
            onClick={() => setActiveTab('addMoney')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'addMoney'
                ? 'bg-green-600/20 border border-green-400/30'
                : 'hover:bg-gray-700/30'
            }`}
          >
            <span className="text-green-400">💵</span>
            <span>Add Funds</span>
          </button>
          <button
            onClick={() => setActiveTab('withdrawal')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'withdrawal'
                ? 'bg-red-600/20 border border-red-400/30'
                : 'hover:bg-gray-700/30'
            }`}
          >
            <span className="text-red-400">🏧</span>
            <span>Withdraw</span>
          </button>
        </nav>
        <div>
          <div className="mt-auto border-t border-cyan-400/20 pt-4">
            <button
              onClick={handlePlayNow}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-gray-700/30 text-cyan-400"
            >
              <span>🏠</span>
              <span>Play Games</span>
            </button>
          </div>
          <div className="mt-auto border-t border-cyan-400/20 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600/20 rounded-lg transition-all"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render main content based on active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-400/20 p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Agent Profile
            </h2>
            {user ? (
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="col-span-2 bg-gray-900/30 p-6 rounded-xl border border-cyan-400/20">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-cyan-400/10 border-2 border-cyan-400/30 flex items-center justify-center text-4xl">
                      👾
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{user.username}</h3>
                      <p className="text-cyan-400">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-cyan-400">No user data found.</p>
            )}
          </div>
        );
      case 'history':
        return (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-400/20 p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Mission History
            </h2>
            {sessions.length > 0 ? (
              <>
                <div className="space-y-4">
                  {currentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="group bg-gray-900/30 p-6 rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-purple-400">🎮</span>
                          <h3 className="font-bold">
                            {session.difficulty} Challenge
                          </h3>
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(session.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {/* Result Section */}
                        <div className="flex items-center gap-2">
                          <span className="text-pink-400">🏆</span>
                          <div>
                            <p className="text-sm text-gray-400">Result</p>
                            <p
                              className={
                                session.result.toLowerCase() === 'win'
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }
                            >
                              {session.result.charAt(0).toUpperCase() +
                                session.result.slice(1).toLowerCase()}
                            </p>
                          </div>
                        </div>
                        {/* Moves Section */}
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400">↺</span>
                          <div>
                            <p className="text-sm text-gray-400">Moves</p>
                            <p className="font-mono">{session.moves}</p>
                          </div>
                        </div>
                        {/* Time Section */}
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400">⏱️</span>
                          <div>
                            <p className="text-sm text-gray-400">Time</p>
                            <p className="font-mono">
                              {Math.floor(session.timeTaken / 60)}:
                              {(session.timeTaken % 60).toString().padStart(2, '0')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls */}
                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gray-700 hover:bg-gray-800'
                    }`}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gray-700 hover:bg-gray-800'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="text-cyan-400">No game sessions found.</p>
            )}
          </div>
        );
      case 'addMoney':
        return (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-green-400/20 p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
              Fuel Up Your Account
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="col-span-2 bg-gray-900/30 p-6 rounded-xl border border-green-400/20">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-green-400/10 border-2 border-green-400/30 flex items-center justify-center text-4xl">
                    <FaEthereum />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Current Balance</h3>
                    <p className="text-2xl font-mono text-green-400">
                      {walletBalance} ETH
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-yellow-400">
                    <FaGasPump />
                    <span>Gas Price: {gasPrice} Gwei</span>
                  </div>
                  <input
                    type="number"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="w-full bg-gray-900/50 border border-green-400/20 rounded-lg p-3 text-white"
                    placeholder="Enter ETH amount"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleDeposit}
                    className="w-full bg-green-500/80 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                  >
                    💰 Deposit ETH
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'withdrawal':
        return (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-red-400/20 p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              Withdraw Earnings
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="col-span-2 bg-gray-900/30 p-6 rounded-xl border border-red-400/20">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-red-400/10 border-2 border-red-400/30 flex items-center justify-center text-4xl">
                    <FaEthereum />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Available Balance</h3>
                    <p className="text-2xl font-mono text-red-400">
                      {walletBalance} ETH
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-gray-900/50 border border-red-400/20 rounded-lg p-3 text-white"
                    placeholder="Enter ETH amount"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleWithdraw}
                    className="w-full bg-red-500/80 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                  >
                    🏧 Withdraw ETH
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex pt-20">
        {renderSidebar()}
        <div className="flex-1 p-8 bg-opacity-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cyan-400 flex items-center gap-3"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            Loading agent profile...
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex pt-20">
      {renderSidebar()}
      <div className="flex-1 p-8 bg-opacity-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl mx-auto"
        >
          {renderActiveTab()}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
