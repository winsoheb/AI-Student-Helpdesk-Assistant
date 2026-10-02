'use client';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const handleToggle = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-colors relative flex items-center justify-center overflow-hidden w-9 h-9"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mode === 'light' && (
          <motion.div
            key="light"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        )}
        {mode === 'dark' && (
          <motion.div
            key="dark"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        )}
        {mode === 'system' && (
          <motion.div
            key="system"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Monitor className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
