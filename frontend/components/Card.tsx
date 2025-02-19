'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface CardType {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  id: string;
  timestamp: string;
  cards: CardType[];
  moves: number;
  time: number;
  flipped: number[];
  gameOver: boolean;
  difficulty: "easy" | "medium" | "hard"; 
}

export const CardComponent = ({ 
  card, 
  isFlipped, 
  onClick,
  className 
}: {
  card: CardType;
  isFlipped: boolean;
  onClick: () => void;
  className?: string;
}) => (
  <motion.div
    className={`relative cursor-pointer ${className}`}
    onClick={!card.isMatched ? onClick : undefined}
    initial={false}
    animate={{ 
      rotateY: isFlipped ? 180 : 0,
      scale: card.isMatched ? 0.9 : 1
    }}
    transition={{ 
      duration: 0.6,
      type: 'spring',
      stiffness: 200,
      damping: 20
    }}
    style={{ 
      perspective: 1000,
      transformStyle: 'preserve-3d' 
    }}
    whileHover={{ scale: 1.05 }}
  >
    {/* Front side */}
    <div className="absolute inset-0 w-full h-full flex items-center justify-center rounded-xl bg-gray-800 shadow-2xl border-2 border-cyan-400/30">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-400/10 to-transparent" />
      <span className="text-4xl text-cyan-400 animate-pulse">⌗</span>
      <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    
    {/* Back side */}
    <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden"
      style={{ 
        transform: 'rotateY(180deg)',
        backfaceVisibility: 'hidden' 
      }}
    >
      <Image 
        src={card.value} 
        alt="card" 
        className="w-full h-full object-cover"
        width={200}
        height={200}
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/40 to-transparent" />
      <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-xl mix-blend-overlay" />
      {card.isMatched && (
        <div className="absolute inset-0 bg-cyan-400/10 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl text-cyan-400"
          >
            ✓
          </motion.div>
        </div>
      )}
    </div>
  </motion.div>
);