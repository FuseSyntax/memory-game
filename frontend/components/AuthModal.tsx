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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </form>
          </motion.div>
          <AlertModal
            isOpen={alertOpen}
            onClose={() => setAlertOpen(false)}
            title="Error"
            message={error || 'Something went wrong'}
            actions={[{ text: 'OK', action: () => setAlertOpen(false) }]}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
