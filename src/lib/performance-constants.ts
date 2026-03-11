/**
 * Performance and reliability constants
 */

// Audio retry configuration
export const AUDIO_RETRY_CONFIG = {
    MAX_ATTEMPTS: 3,
    BASE_DELAY: 1000, // ms
    MAX_DELAY: 5000, // ms
    TIMEOUT: 6000, // 6 seconds per request (3-6-9)
} as const;

// Cache configuration
export const CACHE_CONFIG = {
    MAX_SIZE_MB: 1152, // Multiples of 9 (1+1+5+2=9)
    AUDIO_CACHE_NAME: 'ibad-rahman-audio-cache',
    CLEANUP_THRESHOLD_MB: 1036, // Start cleanup roughly ~90% of 1152
    MAX_AGE_DAYS: 30,
} as const;

// Network configuration
export const NETWORK_CONFIG = {
    OFFLINE_CHECK_INTERVAL: 6000, // Check every 6 seconds (3-6-9)
    REQUEST_TIMEOUT: 6000, // 6 seconds
    SLOW_NETWORK_THRESHOLD: 3000, // Consider "slow" if takes > 3s
} as const;

// Error messages
export const ERROR_MESSAGES = {
    ar: {
        NETWORK_ERROR: 'لا يوجد اتصال بالإنترنت',
        AUDIO_LOAD_FAILED: 'فشل تحميل الصوت',
        RETRYING: 'جاري إعادة المحاولة...',
        MAX_RETRIES: 'فشل بعد عدة محاولات',
        OFFLINE: 'غير متصل بالإنترنت',
        SLOW_NETWORK: 'الاتصال بطيء، قد يستغرق وقتًا',
        COMPONENT_ERROR: 'حدث خطأ غير متوقع',
        TRY_AGAIN: 'حاول مرة أخرى',
    },
    en: {
        NETWORK_ERROR: 'No internet connection',
        AUDIO_LOAD_FAILED: 'Failed to load audio',
        RETRYING: 'Retrying...',
        MAX_RETRIES: 'Failed after multiple attempts',
        OFFLINE: 'You are offline',
        SLOW_NETWORK: 'Slow connection, this may take a while',
        COMPONENT_ERROR: 'An unexpected error occurred',
        TRY_AGAIN: 'Try Again',
    },
} as const;

// Exponential backoff helper
export const getRetryDelay = (attempt: number): number => {
    const delay = Math.min(
        AUDIO_RETRY_CONFIG.BASE_DELAY * Math.pow(2, attempt),
        AUDIO_RETRY_CONFIG.MAX_DELAY
    );
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 500;
};
