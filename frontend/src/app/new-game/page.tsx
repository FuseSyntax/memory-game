'use client';
import React, { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";
import HelpModal from "../../../components/HelpModal";

// Lazy load GameBoard to avoid SSR issues
const GameBoard = dynamic(() => import("../../../components/GameBoard"), { ssr: false });

export default function NewGame() {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Automatically show the help modal on first load if not already seen
      if (localStorage.getItem("helpSeen") !== "true") {
        setHelpModalOpen(true);
      }
    }
  }, []);
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 pt-20 relative"
    >
      {/* Help Icon (always available in top-right corner) */}
      <button 
        onClick={() => setHelpModalOpen(true)}
        className="absolute top-4 right-4 text-white text-3xl z-50 hover:text-cyan-400"
      >
        <FaQuestionCircle />
      </button>

      {/* Particle Background */}
      <div className="particle-background">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              y: [0, -100],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Game Board */}
      <Suspense fallback={<div className="text-white text-center">Loading game...</div>}>
        <GameBoard savedGame={null} />
      </Suspense>

      {/* Help Modal */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </motion.div>
  );
}
