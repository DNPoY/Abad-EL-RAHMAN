import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVibration } from '@/hooks/useVibration';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const QuickShield: React.FC = () => {
  const { t, language } = useLanguage();
  const { vibrate } = useVibration();
  const [isActive, setIsActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const triggerProtection = useCallback(() => {
    if (isScanning) return;

    setIsScanning(true);
    setIsActive(true);

    // 1. Haptic Pulse: 3 short (100ms) followed by 1 long (400ms)
    // pattern: [pulse, pause, pulse, pause, pulse, pause, long_pulse]
    const hapticPattern = [100, 50, 100, 50, 100, 100, 400];
    vibrate(hapticPattern);

    // 2. Text-to-Speech
    const speakDua = () => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(t.antiVirusDua);
        utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 0.9; // Slightly slower for clarity
        window.speechSynthesis.speak(utterance);
      }
    };
    speakDua();

    // 3. System Scan Animation logic
    // We'll use the isScanning state to trigger the overlay
    
    toast.success(t.quickShield, {
      description: t.antiVirusDua,
      duration: 5000,
    });

    // Cleanup after animation
    setTimeout(() => {
      setIsScanning(false);
      setTimeout(() => setIsActive(false), 1000);
    }, 4000);
  }, [isScanning, t, language, vibrate]);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={triggerProtection}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-colors duration-500",
          isScanning 
            ? "bg-red-500 text-white shadow-red-500/50" 
            : "bg-emerald-deep text-white shadow-emerald-900/40"
        )}
        aria-label={t.quickShield}
      >
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              key="alert"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <ShieldAlert className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="shield"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Shield className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* System Scan Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Darkening background */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-deep"
            />

            {/* Scanning Line */}
            <motion.div
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 2, repeat: 1, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-matte to-transparent shadow-[0_0_20px_rgba(212,175,55,0.8)] z-10"
            />

            {/* Cleansing Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: [null, Math.random() * -100],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{ duration: 2, delay: Math.random() * 2 }}
                  className="absolute"
                >
                  <Sparkles className="text-gold-light w-4 h-4" />
                </motion.div>
              ))}
            </div>

            {/* Center Dua Display */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="relative z-20 bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] border-2 border-gold-matte/30 shadow-2xl max-w-[85%] text-center"
            >
              <div className="mb-4 flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="w-12 h-12 text-emerald-deep" />
                </motion.div>
              </div>
              <p className="font-quran text-2xl leading-relaxed text-emerald-deep mb-2">
                {t.antiVirusDua}
              </p>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
                className="h-1 bg-emerald-deep/20 rounded-full overflow-hidden"
              >
                <div className="h-full bg-emerald-deep w-full origin-left" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
