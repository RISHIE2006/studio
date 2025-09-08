'use client';
import { motion } from 'framer-motion';
import { Siren } from 'lucide-react';

interface SosButtonProps {
  onActivate: () => void;
}

export function SosButton({ onActivate }: SosButtonProps) {
  return (
    <motion.button
      onClick={onActivate}
      className="group relative flex items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-red-800 p-2 text-white shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="z-10 flex h-48 w-48 flex-col items-center justify-center gap-3 rounded-full bg-background/80 backdrop-blur-sm transition-colors group-hover:bg-background/70">
        <Siren className="h-20 w-20 text-red-500" />
        <span className="text-4xl font-bold">SOS</span>
      </div>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500 to-red-700 opacity-75 blur-xl"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
}
