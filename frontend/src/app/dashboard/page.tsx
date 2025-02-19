'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface UserData {
    id: string;
    email: string;
    username: string;
    // Add more fields as needed
}

interface GameSession {
    id: string;
    createdAt: string;
    playerName: string; // May not be used if you query by userId
    timeTaken: number;
    moves: number;
    difficulty: string;
    result: string;
}

const Dashboard = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                console.log('Token:', token); // For debugging

                // Fetch user profile details
                const resProfile = await fetch('http://localhost:3001/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!resProfile.ok) {
                    const errorData = await resProfile.json();
                    throw new Error(errorData.error || 'Failed to fetch profile');
                }
                const profileData = await resProfile.json();
                setUser(profileData.user);

                // Fetch user's game sessions (history)
                const resSessions = await fetch('http://localhost:3001/api/user/sessions', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!resSessions.ok) {
                    const errorData = await resSessions.json();
                    throw new Error(errorData.error || 'Failed to fetch game sessions');
                }
                const sessionsData = await resSessions.json();
                setSessions(sessionsData.sessions);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const handleHome = () => {
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-gray-800/50 border-r border-cyan-400/20 p-4 flex flex-col">
                <div className="mb-8 px-2 py-4 border-b border-cyan-400/20">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        <Link href={"/"}>
                            NEON MATRIX
                        </Link>
                    </h2>
                </div>
                <div className="flex flex-col justify-between h-full">
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                                ? 'bg-cyan-600/20 border border-cyan-400/30'
                                : 'hover:bg-gray-700/30'
                                }`}
                        >
                            <span className="text-cyan-400">👤</span>
                            <span>Profile</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'history'
                                ? 'bg-purple-600/20 border border-purple-400/30'
                                : 'hover:bg-gray-700/30'
                                }`}
                        >
                            <span className="text-purple-400">📜</span>
                            <span>Game History</span>
                        </button>
                    </nav>
                    <div>
                        <div className="mt-auto border-t border-cyan-400/20 pt-4">
                            <button
                                onClick={handleHome}
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

            {/* Main Content */}
            <div className="flex-1 p-8 bg-[url('/circuit-board.svg')] bg-opacity-10">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {activeTab === 'profile' ? (
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
                    ) : (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-400/20 p-8 shadow-2xl">
                            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                Mission History
                            </h2>
                            {sessions.length > 0 ? (
                                <div className="space-y-4">
                                    {sessions.map((session) => (
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
                                                {/* Result Section - Keep this one */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-pink-400">🏆</span>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Result</p>
                                                        <p className={
                                                            session.result.toLowerCase() === 'win'
                                                                ? 'text-green-400'
                                                                : 'text-red-400'
                                                        }>
                                                            {session.result.charAt(0).toUpperCase() + session.result.slice(1).toLowerCase()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Moves Section - Keep this */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-purple-400">↺</span>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Moves</p>
                                                        <p className="font-mono">{session.moves}</p>
                                                    </div>
                                                </div>

                                                {/* Change this duplicate result to show time */}
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
                            ) : (
                                <p className="text-cyan-400">No game sessions found.</p>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
