'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertModal } from '../components/AlertModal';
import { useRouter } from 'next/navigation';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isSignUp 
      ? 'http://localhost:3001/api/signup' 
      : 'http://localhost:3001/api/login';
    const body = isSignUp ? { email, password, username } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // When login is successful, save token and redirect to profile page
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('authChange'));
        onClose();
        router.push('/profile');
      } else if (isSignUp) {
        // Optionally, you can handle sign up success here (e.g. redirect to login page)
        onClose();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      setAlertOpen(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gray-900/95 border-2 border-purple-400/30 rounded-xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/hexagon-pattern.svg')] opacity-10" />
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {isSignUp ? 'JOIN THE QUEST' : 'CONTINUE ADVENTURE'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5 z-10 relative">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-400">Agent Name</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-400/30 rounded-lg text-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all"
                    placeholder="Enter your codename"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Cybermail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-400/30 rounded-lg text-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all"
                  placeholder="user@neonnet.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-400">Cipher Code</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-400/30 rounded-lg text-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                  {isSignUp ? 'Already initiated? ' : 'New agent? '}
                  <span className="underline">{isSignUp ? 'Access Terminal' : 'Request Clearance'}</span>
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white shadow-lg shadow-purple-500/20 transition-all"
                >
                  {isSignUp ? 'Activate Protocol' : 'Authenticate'}
                </motion.button>
              </div>
            </form>
            <AlertModal
              isOpen={alertOpen}
              onClose={() => setAlertOpen(false)}
              title="System Alert"
              message={error || 'Authentication sequence failed'}
              actions={[{ text: 'Acknowledge', action: () => setAlertOpen(false) }]}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
