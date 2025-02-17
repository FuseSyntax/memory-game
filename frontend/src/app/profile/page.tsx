// src/profile/pages.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Define a type for your user data
interface UserData {
  id: string;
  email: string;
  username: string;
  // add any additional properties you expect from your API
}

const Profile = () => {
  // Type the state as UserData | null
  const [user, setUser] = useState<UserData | null>(null);
  const [, setError] = useState<string | null>(null);
  const [, setAlertOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/'); // Redirect to home if not logged in
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
        setAlertOpen(true);
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/hexagon-pattern.svg')] opacity-5"></div>
      
      <div className="container mx-auto px-4 py-16 text-center relative ">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent neon-glow"
        >
          Player Profile
        </motion.h1>

        {user ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg border-2 border-cyan-400/20 rounded-xl p-8 shadow-2xl shadow-cyan-500/10 max-w-2xl mx-auto"
          >
            <div className="mb-6 relative">
              <div className="w-32 h-32 rounded-full border-4 border-cyan-400/30 mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20"></div>
                <span className="text-6xl absolute inset-0 flex items-center justify-center">👤</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
            </div>

            <div className="space-y-4 text-left">
              <div className="bg-gray-700/30 p-4 rounded-lg border border-cyan-400/10">
                <h3 className="text-cyan-400 text-xl mb-2">Player Info</h3>
                <p className="text-gray-300">
                  <span className="inline-block w-24">Username:</span>
                  <span className="font-mono text-cyan-300">{user.username}</span>
                </p>
                <p className="text-gray-300">
                  <span className="inline-block w-24">Email:</span>
                  <span className="font-mono text-cyan-300">{user.email}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 p-4 rounded-lg border border-cyan-400/10">
                  <h4 className="text-purple-400 mb-2">Stats</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      Games Played: <span className="text-purple-300">42</span>
                    </p>
                    <p className="text-gray-300">
                      Win Rate: <span className="text-purple-300">78%</span>
                    </p>
                  </div>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-lg border border-cyan-400/10">
                  <h4 className="text-green-400 mb-2">Achievements</h4>
                  <div className="flex gap-2">
                    <span className="text-2xl" title="First Win">🏆</span>
                    <span className="text-2xl" title="Speed Runner">⚡</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <p className="text-cyan-400">Loading player data...</p>
        )}

        {/* Alert Modal can go here */}
      </div>
    </div>
  );
};

export default Profile;
