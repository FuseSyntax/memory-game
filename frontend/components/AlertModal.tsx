'use client';
import { motion, AnimatePresence } from 'framer-motion';

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actions: { text: string; action: () => void; style?: string }[];
  className?: string;
  customStyles?: {
    content: React.CSSProperties;
  };
};

export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  actions,
  className,
  customStyles
}: AlertModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-40"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          className={`bg-gray-900/95 border-2 border-cyan-400/30 rounded-xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden ${className || ''}`}
          style={customStyles?.content}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute inset-0 opacity-10" />
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            {actions.map(({ text, action, style }, index) => (
              <motion.button
                key={index}
                onClick={action}
                whileHover={{ scale: 1.05, filter: 'brightness(1.2)' }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all relative z-40 ${
                  style || 'bg-cyan-600/80 hover:bg-cyan-500 text-white'
                } border border-cyan-400/30 shadow-lg shadow-cyan-500/10`}
              >
                {text}
              </motion.button>
            ))}
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400/50 to-transparent" />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);