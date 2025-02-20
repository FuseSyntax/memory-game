"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Lazy load GameBoard to avoid SSR issues
const GameBoard = dynamic(() => import("../../../components/GameBoard"), { ssr: false });

export default function NewGame() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 pt-20"
    >
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
      <Suspense fallback={<div className="text-white text-center">Loading game...</div>}>
        <GameBoard savedGame={null} />
      </Suspense>
    </motion.div>
  );
}
