import { motion } from "framer-motion";
import { memo } from "react";
import { TRANSITION_DURATIONS } from "@/lib/animation-constants";

interface GoldenRatioSpiralProps {
  progress: number; // 0 to 100
  isCalibrating?: boolean; // When pulse happens
  size?: number;
}

/**
 * A SVG component that renders a Golden Ratio (Fibonacci) Spiral.
 * The spiral fills up based on the progress prop.
 */
export const GoldenRatioSpiral = memo(({ 
  progress, 
  isCalibrating = false,
  size = 200 
}: GoldenRatioSpiralProps) => {
  // SVG Path for a Fibonacci spiral starting from center
  // Approximated with circular arcs for smooth drawing
  // Scaling factors to fit within the viewport
  const center = size / 2;
  const scale = size / 160;

  // Path data for a 7-segment Fibonacci spiral
  // Ratios: 1, 1, 2, 3, 5, 8, 13, 21, 34
  const path = `
    M ${center},${center}
    a 1,1 0 0 1 1,-1
    a 1,1 0 0 1 1,1
    a 2,2 0 0 1 -2,2
    a 3,3 0 0 1 -3,-3
    a 5,5 0 0 1 5,-5
    a 8,8 0 0 1 8,8
    a 13,13 0 0 1 -13,13
    a 21,21 0 0 1 -21,-21
    a 34,34 0 0 1 34,-34
  `.replace(/\n/g, ' ').trim();

  return (
    <div className="relative flex items-center justify-center pointer-events-none" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 overflow-visible"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Background Track */}
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-primary/10"
          transform={`scale(${scale}) translate(${(center/scale) - center}, ${(center/scale) - center})`}
        />

        {/* Filling Progress Path */}
        <motion.path
          d={path}
          fill="none"
          stroke="url(#spiral-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: progress / 100,
            filter: isCalibrating 
              ? ["blur(0px) brightness(1)", "blur(2px) brightness(1.5)", "blur(0px) brightness(1)"] 
              : "none"
          }}
          transition={{ 
            pathLength: { duration: TRANSITION_DURATIONS.MEDIUM, ease: "easeOut" },
            filter: { duration: TRANSITION_DURATIONS.MEDIUM, repeat: isCalibrating ? Infinity : 0 }
          }}
          transform={`scale(${scale}) translate(${(center/scale) - center}, ${(center/scale) - center})`}
        />

        {/* Pulse Effect Glow */}
        <motion.circle
          cx={center}
          cy={center}
          r={size / 2}
          fill="radial-gradient(circle, var(--primary) 0%, transparent 70%)"
          initial={{ scale: 0, opacity: 0 }}
          animate={isCalibrating ? {
            scale: [1, 1.2, 1],
            opacity: [0, 0.3, 0],
          } : { scale: 0, opacity: 0 }}
          transition={{ duration: TRANSITION_DURATIONS.MEDIUM }}
          className="text-gold-matte fill-current pointer-events-none"
        />

        <defs>
          <linearGradient id="spiral-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--gold-matte))" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
});

GoldenRatioSpiral.displayName = "GoldenRatioSpiral";
