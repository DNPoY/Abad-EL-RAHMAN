import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    try {
        if (Capacitor.isNativePlatform()) {
            await Haptics.impact({ style });
        } else {
            // Optional: Web Vibration API fallback
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
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
        if (Capacitor.isNativePlatform()) {
            // Capacitor Haptics doesn't directly support patterns in a single call in the same way,
            // we'd need to loop or use a plugin extension. 
            // For now, we'll use the Web Vibration API as it's well supported for patterns.
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([...pattern]);
            }
        } else {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([...pattern]);
            }
        }
    } catch (error) {
        console.error("Pattern haptic feedback error:", error);
    }
};
