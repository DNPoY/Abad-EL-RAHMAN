import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface AuraEffectProps {
  harmonyLevel: number; // 0-100
  activeTriggers?: {
    morningAzkar?: boolean;
    eveningAzkar?: boolean;
  };
  className?: string;
}

export const AuraEffect = ({ harmonyLevel, activeTriggers, className }: AuraEffectProps) => {
  // Calculate aura color based on activity
  const auraColors = useMemo(() => {
    const colors = [];
    
    // Base Emerald
    colors.push("rgba(16, 185, 129, 0.4)"); 
    
    // Morning Azkar completed: Add cyan/teal
    if (activeTriggers?.morningAzkar) {
      colors.push("rgba(6, 182, 212, 0.5)");
    }
    
    // Evening Azkar completed: Add warm/gold
    if (activeTriggers?.eveningAzkar) {
      colors.push("rgba(217, 119, 6, 0.5)");
    }

    // 100% Harmony: Solid Golden Glow
    if (harmonyLevel === 100) {
      return ["rgba(180, 142, 70, 0.8)", "rgba(16, 185, 129, 0.6)"];
    }

    return colors;
  }, [harmonyLevel, activeTriggers]);

  // Intensity based on harmony level (safety check for NaN/undefined)
  const safeHarmonyLevel = typeof harmonyLevel === 'number' && !isNaN(harmonyLevel) ? harmonyLevel : 0;
  
  const scale = 1 + (safeHarmonyLevel / 100) * 0.5;
  const opacity = 0.3 + (safeHarmonyLevel / 100) * 0.4;
  const blur = 20 + (safeHarmonyLevel / 100) * 40;

  return (
    <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none z-0", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={auraColors.join("-")}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: opacity, 
            scale: [scale * 0.95, scale * 1.05, scale * 0.95],
            boxShadow: `0 0 ${blur}px ${blur/2}px ${auraColors[0]}`
          }}
          transition={{
            opacity: { duration: 1.5 },
            scale: { 
              duration: 6.666, // 3-6-9 harmonic
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="rounded-full blur-3xl w-2/3 h-2/3 absolute"
          style={{
            background: auraColors.length > 1 
              ? `radial-gradient(circle, ${auraColors.join(", ")})`
              : auraColors[0]
          }}
        />
      </AnimatePresence>
      
      {/* Secondary Pulse layer for depth */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 9.999, // 3-6-9 harmonic
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="rounded-full blur-3xl w-full h-full absolute bg-emerald-light/10"
      />
    </div>
  );
};
