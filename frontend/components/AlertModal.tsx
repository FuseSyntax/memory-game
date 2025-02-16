'use client';
import { motion, AnimatePresence } from 'framer-motion';

export const AlertModal = ({
  isOpen,
  title,
  message,
  actions,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actions: { text: string; action: () => void; style?: string }[];
}) => (
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
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            {actions.map(({ text, action, style }, index) => (
              <motion.button
                key={index}
                onClick={action}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg transition-colors ${style || 'bg-purple-600 text-white hover:bg-purple-700'}`}
              >
                {text}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);