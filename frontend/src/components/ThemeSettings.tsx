'use client';
import { useTheme, DEFAULT_ACCENT } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Monitor, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const PREDEFINED_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo (Default)', value: '#4F46E5' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Teal', value: '#14B8A6' }
];

export function ThemeSettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { mode, setMode, accentColor, setAccentColor, resetTheme } = useTheme();
  const [customColor, setCustomColor] = useState(accentColor);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Appearance Settings</h2>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-8 flex-1">
            {/* Mode Selection */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Theme Mode</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setMode('light')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${mode === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/50'}`}
                >
                  <Sun className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button
                  onClick={() => setMode('dark')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${mode === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/50'}`}
                >
                  <Moon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
                <button
                  onClick={() => setMode('system')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${mode === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/50'}`}
                >
                  <Monitor className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">System</span>
                </button>
              </div>
            </div>

            {/* Accent Color Selection */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Accent Color</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setAccentColor(color.value)}
                    title={color.name}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${accentColor === color.value ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color.value }}
                  >
                    {accentColor === color.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-3 mt-4 p-3 bg-muted rounded-xl border border-border">
                <span className="text-sm font-medium text-foreground">Custom Color:</span>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setAccentColor(e.target.value);
                  }}
                  className="w-10 h-10 p-0 border-0 rounded cursor-pointer"
                />
                <span className="text-xs font-mono text-muted-foreground uppercase">{accentColor}</span>
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Live Preview</h3>
              <div className="p-4 bg-background rounded-xl border border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-foreground">Preview Element</span>
                  <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">Badge</span>
                </div>
                <div className="h-2 bg-muted rounded-full w-full overflow-hidden mb-4">
                  <div className="h-full bg-primary w-2/3"></div>
                </div>
                <button className="w-full py-2 bg-primary text-white rounded-lg font-medium shadow-md transition-opacity hover:opacity-90">
                  Primary Button
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-border flex justify-between">
            <button 
              onClick={resetTheme}
              className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
