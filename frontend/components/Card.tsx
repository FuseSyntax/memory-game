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
  timestamp: number;
  cards: CardType[];
  moves: number;
  time: number;
  flipped: number[];
  gameOver: boolean;
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
      scale: card.isMatched ? 0.95 : 1
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
    <div className="absolute inset-0 w-full h-full flex items-center justify-center rounded-xl bg-purple-600 shadow-2xl backface-hidden border-4 border-purple-400">
      <span className="text-white text-4xl animate-pulse">?</span>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-50" />
    </div>
    
    {/* Back side */}
    <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden backface-hidden border-4 border-purple-400"
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
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-transparent" />
      <div className="absolute inset-0 border-4 border-purple-400 rounded-xl pointer-events-none" />
    </div>
  </motion.div>
);