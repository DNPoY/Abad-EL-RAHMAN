import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * Harmonic 3-6-9 Haptic Patterns
 */
export const HARMONIC_PATTERNS = {
    // 3ms light tap (Minimal energy, delicate feel)
    TASBIH_TAP: [3],
    
    // 3-6-9 Sequence: 3ms on, 30ms off, 6ms on, 60ms off, 9ms on
    GOAL_REACHED: [3, 30, 6, 60, 9],
    
    // Notification focus: repeating 9ms pulses
    PRAYER_ALERT: [9, 90, 9, 90, 9, 90, 18],
    
    // "Protection" pattern (used for QuickShield)
    PROTECTION: [3, 100, 3, 100, 3, 100, 36]
} as const;

export const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    try {
        if (Capacitor.isNativePlatform()) {
            await Haptics.impact({ style });
        } else {
            // Optional: Web Vibration API fallback
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                // Use harmonic durations (9 for light, 36 for heavy)
                navigator.vibrate(style === ImpactStyle.Heavy ? 36 : 9);
            }
        }
    } catch (error) {
        console.error("Haptic feedback error:", error);
    }
};

/**
 * Trigger a complex haptic pattern
 * @param pattern Array of vibration/pause durations in ms
 */
export const triggerPatternHaptic = async (pattern: number[] | readonly number[]) => {
    try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([...pattern]);
        }
    } catch (error) {
        console.error("Pattern haptic feedback error:", error);
    }
};

/**
 * Specialized triggers for the Harmonic System
 */
export const haptics = {
    tap: () => triggerPatternHaptic(HARMONIC_PATTERNS.TASBIH_TAP),
    goal: () => triggerPatternHaptic(HARMONIC_PATTERNS.GOAL_REACHED),
    alert: () => triggerPatternHaptic(HARMONIC_PATTERNS.PRAYER_ALERT),
    protect: () => triggerPatternHaptic(HARMONIC_PATTERNS.PROTECTION),
};
