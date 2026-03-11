import { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface DailyLog {
    prayers: {
        fajr: boolean;
        dhuhr: boolean;
        asr: boolean;
        maghrib: boolean;
        isha: boolean;
    };
    azkar: {
        morning: boolean;
        evening: boolean;
    };
}

export type SystemLogData = Record<string, DailyLog>;

const STORAGE_KEY = "system-log-v1";

const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getEmptyLog = (): DailyLog => ({
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
    azkar: { morning: false, evening: false }
});

export const useSystemLog = () => {
    const { language } = useLanguage();
    const [logs, setLogs] = useState<SystemLogData>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    const updateToday = useCallback((updater: (prev: DailyLog) => DailyLog) => {
        const today = getTodayString();
        setLogs(prev => {
            const current = prev[today] || getEmptyLog();
            return {
                ...prev,
                [today]: updater(current)
            };
        });
    }, []);

    const togglePrayer = useCallback((prayer: keyof DailyLog["prayers"]) => {
        updateToday(prev => ({
            ...prev,
            prayers: { ...prev.prayers, [prayer]: !prev.prayers[prayer] }
        }));
    }, [updateToday]);

    const setAzkar = useCallback((type: keyof DailyLog["azkar"], completed: boolean) => {
        updateToday(prev => ({
            ...prev,
            azkar: { ...prev.azkar, [type]: completed }
        }));
    }, [updateToday]);

    useEffect(() => {
        const handleAzkarCompleted = (e: any) => {
            const { type } = e.detail;
            setAzkar(type, true);
        };
        window.addEventListener('azkar-completed', handleAzkarCompleted as any);
        return () => window.removeEventListener('azkar-completed', handleAzkarCompleted as any);
    }, [setAzkar]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    }, [logs]);

    const getHarmonyLevel = useCallback((dateStr: string): number => {
        const log = logs[dateStr];
        if (!log) return 0;
        
        const prayerCount = Object.values(log.prayers).filter(Boolean).length;
        const azkarCount = Object.values(log.azkar).filter(Boolean).length;
        
        return Math.round(((prayerCount + azkarCount) / 7) * 100);
    }, [logs]);

    const isDayPerfect = useCallback((dateStr: string): boolean => {
        return getHarmonyLevel(dateStr) === 100;
    }, [getHarmonyLevel]);

    const currentStreak = useMemo(() => {
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            
            if (isDayPerfect(dateStr)) {
                streak++;
            } else if (i === 0) {
                continue;
            } else {
                break;
            }
        }
        return streak;
    }, [isDayPerfect]);

    const getWeeklyData = useCallback(() => {
        const data = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const dayName = d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' });
            data.push({
                date: dateStr,
                day: dayName,
                level: getHarmonyLevel(dateStr)
            });
        }
        return data;
    }, [getHarmonyLevel, language]);

    return {
        logs,
        togglePrayer,
        setAzkar,
        getHarmonyLevel,
        isDayPerfect,
        currentStreak,
        getWeeklyData,
        todayLog: logs[getTodayString()] || getEmptyLog()
    };
};
