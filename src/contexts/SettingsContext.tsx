import React, { createContext, useContext, useState, useEffect } from "react";
import WidgetBridge from "@/lib/widget-bridge";

export interface SettingsState {
    calculationMethod: number;
    madhab: "shafi" | "hanafi";
    locationMode: "auto" | "manual";
    manualLatitude: number;
    manualLongitude: number;
    fontFamily: "amiri" | "cairo" | "tajawal";
    quranFont: "uthmani" | "indopak" | "amiri_quran";
    preAzanReminder: boolean;
    azanVolume: number;
    smartDnd: boolean;
    azanFadeIn: boolean;
    theme: "default" | "makkah-midnight" | "madinah-dawn" | "andalusian-gold";

}

interface SettingsContextType extends SettingsState {
    setCalculationMethod: (method: number) => void;
    setMadhab: (madhab: "shafi" | "hanafi") => void;
    setLocationMode: (mode: "auto" | "manual") => void;
    setManualLocation: (lat: number, lng: number) => void;
    setFontFamily: (font: "amiri" | "cairo" | "tajawal") => void;
    setQuranFont: (font: "uthmani" | "indopak" | "amiri_quran") => void;
    setPreAzanReminder: (enabled: boolean) => void;
    setAzanVolume: (volume: number) => void;
    setSmartDnd: (enabled: boolean) => void;
    setAzanFadeIn: (enabled: boolean) => void;
    setTheme: (theme: "default" | "makkah-midnight" | "madinah-dawn" | "andalusian-gold") => void;

}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [calculationMethod, setCalculationMethodState] = useState<number>(() => {
        const saved = localStorage.getItem("calculationMethod");
        if (saved) return parseInt(saved, 10);

        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timeZone === "Africa/Cairo") {
                return 5; // Egyptian General Authority of Survey
            }
        } catch (e) {
            console.error("Error detecting timezone:", e);
        }
        return 4; // Default to Umm al-Qura (4)
    });

    const [madhab, setMadhabState] = useState<"shafi" | "hanafi">(() => {
        const saved = localStorage.getItem("madhab");
        return (saved as "shafi" | "hanafi") || "shafi"; // Default to Shafi (Standard)
    });

    const [locationMode, setLocationModeState] = useState<"auto" | "manual">(() => {
        const saved = localStorage.getItem("locationMode");
        return (saved as "auto" | "manual") || "auto";
    });

    const [manualLatitude, setManualLatitude] = useState<number>(() => {
        const saved = localStorage.getItem("manualLatitude");
        return saved ? parseFloat(saved) : 21.3891; // Default to Mecca
    });

    const [manualLongitude, setManualLongitude] = useState<number>(() => {
        const saved = localStorage.getItem("manualLongitude");
        return saved ? parseFloat(saved) : 39.8579; // Default to Mecca
    });

    const [fontFamily, setFontFamilyState] = useState<"amiri" | "cairo" | "tajawal">(() => {
        const saved = localStorage.getItem("fontFamily");
        return (saved as "amiri" | "cairo" | "tajawal") || "amiri";
    });

    const [quranFont, setQuranFontState] = useState<"uthmani" | "indopak" | "amiri_quran">(() => {
        const saved = localStorage.getItem("quranFont");
        return (saved as "uthmani" | "indopak" | "amiri_quran") || "uthmani";
    });

    const [preAzanReminder, setPreAzanReminderState] = useState<boolean>(() => {
        const saved = localStorage.getItem("preAzanReminder");
        return saved ? saved === "true" : false;
    });

    const [azanVolume, setAzanVolumeState] = useState<number>(() => {
        const saved = localStorage.getItem("azanVolume");
        return saved ? parseInt(saved, 10) : 77;
    });

    const [smartDnd, setSmartDndState] = useState<boolean>(() => {
        const saved = localStorage.getItem("smartDnd");
        return saved ? saved === "true" : false;
    });

    const [azanFadeIn, setAzanFadeInState] = useState<boolean>(() => {
        const saved = localStorage.getItem("azanFadeIn");
        return saved ? saved === "true" : true;
    });

    const [theme, setThemeState] = useState<"default" | "makkah-midnight" | "madinah-dawn" | "andalusian-gold">(() => {
        const saved = localStorage.getItem("app-theme");
        return (saved as any) || "default";
    });

    // Apply theme globally
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "default") {
            root.removeAttribute("data-theme");
        } else {
            root.setAttribute("data-theme", theme);
        }
    }, [theme]);

    // Apply font globally
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--font-primary', fontFamily === 'amiri' ? "'Amiri', serif" : fontFamily === 'cairo' ? "'Cairo', sans-serif" : "'Tajawal', sans-serif");
        document.body.style.fontFamily = `var(--font-primary), 'Poppins', sans-serif`;
    }, [fontFamily]);

    const setCalculationMethod = (method: number) => {
        setCalculationMethodState(method);
        localStorage.setItem("calculationMethod", method.toString());
    };

    const setMadhab = (m: "shafi" | "hanafi") => {
        setMadhabState(m);
        localStorage.setItem("madhab", m);
    };

    const setLocationMode = (mode: "auto" | "manual") => {
        setLocationModeState(mode);
        localStorage.setItem("locationMode", mode);
    };

    const setManualLocation = (lat: number, lng: number) => {
        setManualLatitude(lat);
        setManualLongitude(lng);
        localStorage.setItem("manualLatitude", lat.toString());
        localStorage.setItem("manualLongitude", lng.toString());
    };

    const setFontFamily = (font: "amiri" | "cairo" | "tajawal") => {
        setFontFamilyState(font);
        localStorage.setItem("fontFamily", font);
    };

    const setQuranFont = (font: "uthmani" | "indopak" | "amiri_quran") => {
        setQuranFontState(font);
        localStorage.setItem("quranFont", font);
    };

    const setPreAzanReminder = (enabled: boolean) => {
        setPreAzanReminderState(enabled);
        localStorage.setItem("preAzanReminder", enabled.toString());
    };

    const setAzanVolume = (volume: number) => {
        setAzanVolumeState(volume);
        localStorage.setItem("azanVolume", volume.toString());
        WidgetBridge.setAzanVolume({ volume }).catch(err => console.error("Failed to set native volume", err));
    };

    const setSmartDnd = (enabled: boolean) => {
        setSmartDndState(enabled);
        localStorage.setItem("smartDnd", enabled.toString());
        WidgetBridge.setSmartDnd({ enabled }).catch(err => console.error("Failed to set smartDnd", err));
    };

    const setAzanFadeIn = (enabled: boolean) => {
        setAzanFadeInState(enabled);
        localStorage.setItem("azanFadeIn", enabled.toString());
        WidgetBridge.setAzanFadeIn({ enabled }).catch(err => console.error("Failed to set azanFadeIn", err));
    };

    const setTheme = (t: "default" | "makkah-midnight" | "madinah-dawn" | "andalusian-gold") => {
        setThemeState(t);
        localStorage.setItem("app-theme", t);
    };



    return (
        <SettingsContext.Provider
            value={{
                calculationMethod,
                madhab,
                locationMode,
                manualLatitude,
                manualLongitude,
                fontFamily,
                quranFont,
                preAzanReminder,
                azanVolume,
                smartDnd,
                azanFadeIn,
                theme,
                setCalculationMethod,
                setMadhab,
                setLocationMode,
                setManualLocation,
                setFontFamily,
                setQuranFont,
                setPreAzanReminder,
                setAzanVolume,
                setSmartDnd,
                setAzanFadeIn,
                setTheme,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};


