// app/not-found.tsx
'use client';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white"
    >
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-4 text-xl">Oops! The page {`you're`} looking for does not exist.</p>
    </motion.div>
  );
}
