'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AuraBotProps {
  onActivate: () => void;
}

export function AuraBot({ onActivate }: AuraBotProps) {
  return (
    <motion.button
      onClick={onActivate}
      className="group relative flex items-center justify-center rounded-full bg-gradient-to-tr from-primary to-accent p-1 text-white shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="z-10 flex items-center gap-3 rounded-full bg-background/80 px-8 py-4 backdrop-blur-sm transition-colors group-hover:bg-background/70">
        <Sparkles className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">Talk to Aura Bot</span>
      </div>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent opacity-50 blur-lg"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
}
