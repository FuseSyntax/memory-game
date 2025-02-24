'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FaGamepad, FaToolbox, FaHome } from 'react-icons/fa';

export default function NotFound() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
      {/* Animated Background */}
      <motion.div 
        style={{ opacity, scale }}
        className="absolute inset-0 bg-grid-white/[0.03]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/20" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">
        {/* Glowing 404 Display */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
          <h1 className="text-[180px] md:text-[240px] font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Construction Warning */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-red-500/20 px-6 py-3 rounded-full border border-red-400/30 mb-4">
            <FaToolbox className="text-red-400 text-xl" />
            <span className="text-red-400 text-lg">Under Construction</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Galactic Overload in Progress!
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Our cyborg hamsters are working overtime to build this sector of the metaverse!
            Check back after the next system reboot.
          </p>
        </motion.div>

        {/* Interactive Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/"
            className="bg-cyan-500/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
          >
            <FaHome className="text-lg" />
            Return to Base
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/play-now"
            className="bg-purple-500/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-purple-400/30 text-purple-400 hover:bg-purple-500/30 transition-colors flex items-center gap-2"
          >
            <FaGamepad className="text-lg" />
            Active Game Zones
          </motion.a>
        </motion.div>

        {/* Construction Progress */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2 }}
          className="mt-12 w-full max-w-md bg-gray-800/50 h-3 rounded-full overflow-hidden"
        >
          <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-purple-500 origin-left scale-x-0 animate-pulse" />
        </motion.div>

        {/* Animated Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
              }}
              animate={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}