/**
 * Formats a number of days into a human-readable string (years, months, days)
 * @param totalDays Number of days to format
 * @param language 'ar' or 'en'
 * @returns Formatted string
 */
export const formatDuration = (totalDays: number, language: 'ar' | 'en'): string => {
    if (totalDays === Infinity) return language === 'ar' ? '∞' : '∞';
    if (totalDays === 0) return language === 'ar' ? '0 يوم' : '0 days';

    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = Math.floor((totalDays % 365) % 30);

    const parts: string[] = [];

    if (language === 'ar') {
        if (years > 0) {
            if (years === 1) parts.push('سنة');
            else if (years === 2) parts.push('سنتان');
            else if (years >= 3 && years <= 10) parts.push(`${years} سنوات`);
            else parts.push(`${years} سنة`);
        }
        if (months > 0) {
            if (months === 1) parts.push('شهر');
            else if (months === 2) parts.push('شهران');
            else if (months >= 3 && months <= 10) parts.push(`${months} أشهر`);
            else parts.push(`${months} شهر`);
        }
        if (days > 0 || (years === 0 && months === 0)) {
            if (days === 1) parts.push('يوم');
            else if (days === 2) parts.push('يومان');
            else if (days >= 3 && days <= 10) parts.push(`${days} أيام`);
            else parts.push(`${days} يوم`);
        }
        return parts.join(' و ');
    } else {
        if (years > 0) {
            parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
        }
        if (months > 0) {
            parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
        }
        if (days > 0 || (years === 0 && months === 0)) {
            parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
        }
        return parts.join(', ');
    }
};
