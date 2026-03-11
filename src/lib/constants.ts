import { TasbihTarget } from "@/types/tasbih";

/**
 * Tasbih Counter Constants
 */
export const TASBIH_TARGETS: readonly TasbihTarget[] = [33, 100, 0] as const;

export const VIBRATION_PATTERNS = {
    LIGHT: 9, // 10 -> 9ms
    MEDIUM: 18, // 20 -> 18ms (1+8=9)
    HEAVY: 27, // 30 -> 27ms (2+7=9)
    SUCCESS: [36, 63, 90] as number[], // Rhythmic progression of 9s
    LONG_PRESS: [0, 108, 54, 108] as number[], // Sacred harmonic 108
} as const;

/**
 * Numerical Harmony Haptic Patterns
 * Patterns follow [vibrate, pause, vibrate, pause, ...] in ms
 */
export const HAPTIC_PATTERNS = {
    // Fibonacci: 1, 1, 2, 3, 5, 8, 13 (approx in ms, scaled for feel)
    FIBONACCI: [10, 50, 10, 50, 20, 50, 30, 50, 50, 50, 80, 50, 130],
    // 3-6-9 Pulse Patterns
    RECOGNITION_3: [30, 100, 30, 100, 30],           // 3 short taps
    ALIGNMENT_6: [60, 150, 60, 150, 60, 150, 60, 150, 60, 150, 60], // 6 medium taps
    COMPLETION_9: [100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100], // 9 long deep pulses
} as const;

/**
 * Animation Duration Constants (in ms)
 */
export const ANIMATION_DURATIONS = {
    INSTANT: 0,
    FAST: 333,
    MEDIUM: 666,
    SLOW: 999,
    VERY_SLOW: 1618, // Golden Ratio Phi
} as const;

/**
 * Theme Colors (HSL format)
 */
export const THEME_COLORS = {
    EMERALD_DEEP: 'hsl(162 76% 15%)',
    EMERALD_LIGHT: 'hsl(158 55% 22%)',
    GOLD_MATTE: 'hsl(40 48% 56%)',
    GOLD_LIGHT: 'hsl(42 63% 66%)',
    CREAM_BG: 'hsl(40 20% 97%)',
    WARM_PAPER: 'hsl(45 35% 92%)',
} as const;

/**
 * Z-Index Layers
 */
export const Z_INDEX = {
    BACKGROUND: 0,
    CONTENT: 10,
    HEADER: 20,
    NAVIGATION: 50,
    DIALOG: 100,
    TOAST: 200,
} as const;

/**
 * Developer Mode
 */
export const DEV_MODE = {
    PASSWORD: 'Allahakbar99',
    TAP_COUNT_TRIGGER: 7,
    STORAGE_KEY: 'devMode',
    DATE_STORAGE_KEY: 'devModeDate',
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
    DEV_MODE: 'devMode',
    DEV_MODE_DATE: 'devModeDate',
    BATTERY_OPTIMIZATION_REQUESTED: 'hasRequestedBatteryOptimizations',
    FONT_SIZE: 'fontSize',
    LANGUAGE: 'language',
    PRAYER_SETTINGS: 'prayerSettings',
} as const;

/**
 * Prayer Calculation Methods
 */
export const CALCULATION_METHODS = [
    { id: 0, name: "Shia Ithna-Ansari" },
    { id: 1, name: "University of Islamic Sciences, Karachi" },
    { id: 2, name: "Islamic Society of North America (ISNA)" },
    { id: 3, name: "Muslim World League" },
    { id: 4, name: "Umm al-Qura University, Makkah" },
    { id: 5, name: "Egyptian General Authority of Survey" },
    { id: 7, name: "Institute of Geophysics, University of Tehran" },
    { id: 8, name: "Gulf Region" },
    { id: 9, name: "Kuwait" },
    { id: 10, name: "Qatar" },
    { id: 11, name: "Majlis Ugama Islam Singapura, Singapore" },
    { id: 12, name: "Union Organization islamic de France" },
    { id: 13, name: "Diyanet Isleri Baskanligi, Turkey" },
    { id: 14, name: "Spiritual Administration of Muslims of Russia" },
];
