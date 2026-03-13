import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useCounter } from "@/hooks/useCounter";
import { useCelebration } from "@/components/Celebration";
import { TASBIH_TARGETS, HAPTIC_PATTERNS } from "@/lib/constants";
import { SPRING_CONFIGS, SCALE_VARIANTS } from "@/lib/animation-constants";
import { TasbihTarget } from "@/types/tasbih";
import {
    getAccessibleTasbihLabel,
    getAccessibleTargetLabel,
    getAccessibleResetLabel,
    announceTasbihCount,
    announceTasbihComplete,
} from "@/lib/accessibility";
import { GoldenRatioSpiral } from "./GoldenRatioSpiral";
import { useWidgetUpdater } from "@/hooks/useWidgetUpdater";
import { usePrayerTimes } from "@/contexts/PrayerTimesContext";
import { haptics } from "@/lib/haptics";

// Memoized counter button component for performance
const CounterButton = memo(({
    count,
    target,
    progress,
    onClick,
    ariaLabel
}: {
    count: number;
    target: TasbihTarget;
    progress: number;
    onClick: () => void;
    ariaLabel: string;
}) => {
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            transition={SPRING_CONFIGS.STIFF}
            className="relative"
        >
            <Button
                variant="outline"
                className="w-64 h-64 rounded-full border-4 border-primary/20 text-6xl font-bold hover:bg-primary/5 transition-all shadow-xl relative overflow-hidden flex items-center justify-center p-0 animate-harmonic-strobe"
                onClick={onClick}
                aria-label={ariaLabel}
                aria-live="polite"
                aria-atomic="true"
            >
                {/* Golden Ratio Spiral Visualizer */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <GoldenRatioSpiral 
                        progress={progress} 
                        isCalibrating={[33, 66, 99].includes(count)} 
                        size={220}
                    />
                </div>

                {/* Animated Counter Number */}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={count}
                        className="relative z-10 font-mono"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {count}
                    </motion.span>
                </AnimatePresence>

                {/* Target Display */}
                {target > 0 && (
                    <motion.span
                        className="absolute bottom-12 text-sm text-muted-foreground font-normal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        / {target}
                    </motion.span>
                )}
            </Button>
        </motion.div>
    );
});

CounterButton.displayName = "CounterButton";

// Memoized target selector button
const TargetButton = memo(({
    target,
    isActive,
    onClick,
    ariaLabel
}: {
    target: TasbihTarget;
    isActive: boolean;
    onClick: () => void;
    ariaLabel: string;
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={SPRING_CONFIGS.GENTLE}
        >
            <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={onClick}
                aria-label={ariaLabel}
                aria-pressed={isActive}
                className={cn(
                    "min-w-[4rem]",
                    isActive ? "bg-primary text-primary-foreground shadow-md" : ""
                )}
            >
                <span aria-hidden="true">{target === 0 ? "∞" : target}</span>
            </Button>
        </motion.div>
    );
});

TargetButton.displayName = "TargetButton";

export const TasbihCounter = memo(() => {
    const { t, language } = useLanguage();
    const { celebrate } = useCelebration();
    const [showCelebration, setShowCelebration] = useState(false);
    const { prayerTimes } = usePrayerTimes();

    const { count, target, increment, reset, setTarget, progress } = useCounter({
        initialCount: 0,
        initialTarget: 33,
        onTargetReached: () => {
            setShowCelebration(true);
            celebrate();
            announceTasbihComplete(target, language);
            // Reset celebration after animation
            setTimeout(() => setShowCelebration(false), 3300);
        },
    });

    // Sync to Widget
    useWidgetUpdater(prayerTimes ? {
        fajr: prayerTimes.fajr,
        dhuhr: prayerTimes.dhuhr,
        asr: prayerTimes.asr,
        maghrib: prayerTimes.maghrib,
        isha: prayerTimes.isha,
        city: prayerTimes.city || localStorage.getItem('last_city') || 'Cairo'
    } : null, {
        count,
        target,
        title: language === 'ar' ? 'التسبيح' : 'Tasbih'
    });

    // Announce count changes for screen readers
    const handleIncrement = () => {
        const nextCount = count + 1;
        increment();
        announceTasbihCount(nextCount, target, language);

        // Harmonic 3-6-9 System
        if (target > 0 && nextCount === target) {
            haptics.goal();
        } else if (nextCount % 9 === 0) {
            haptics.alert(); // Stronger emphasis on 9s
        } else {
            haptics.tap(); // Delicate 3ms tap for every bead
        }
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center space-y-8 py-8"
            variants={SCALE_VARIANTS}
            initial="hidden"
            animate="visible"
            transition={SPRING_CONFIGS.GENTLE}
            role="application"
            aria-label={language === "ar" ? "عداد التسبيح" : "Tasbih Counter"}
        >
            {/* Target Selector */}
            <div
                className="flex justify-center space-x-4 space-x-reverse relative z-10"
                role="radiogroup"
                aria-label={language === "ar" ? "اختر هدف التسبيح" : "Select tasbih target"}
            >
                {TASBIH_TARGETS.map((tgt) => (
                    <TargetButton
                        key={tgt}
                        target={tgt}
                        isActive={target === tgt}
                        onClick={() => setTarget(tgt)}
                        ariaLabel={getAccessibleTargetLabel(tgt, target === tgt, language)}
                    />
                ))}
            </div>

            {/* Main Counter Button */}
            <CounterButton
                count={count}
                target={target}
                progress={progress}
                onClick={handleIncrement}
                ariaLabel={getAccessibleTasbihLabel(count, target, language)}
            />

            {/* Celebration Indicator */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-gold-matte pointer-events-none"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        ✨ الله أكبر ✨
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reset Button */}
            <motion.div
                whileHover={{ scale: 1.1, rotate: -15 }}
                whileTap={{ scale: 0.9 }}
                transition={SPRING_CONFIGS.BOUNCY}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={reset}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={getAccessibleResetLabel(language)}
                >
                    <RotateCcw className="w-6 h-6" aria-hidden="true" />
                </Button>
            </motion.div>
        </motion.div>
    );
});

TasbihCounter.displayName = "TasbihCounter";
