import { useSystemLog } from "@/hooks/useSystemLog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export const MilestoneRewards = () => {
    const { currentStreak } = useSystemLog();
    const { language } = useLanguage();
    const { theme, setTheme } = useSettings();

    const themes = [
        { 
            id: "default", 
            name: language === "ar" ? "الافتراضي" : "Default", 
            milestone: 0, 
            description: language === "ar" ? "نظام الهدوء الأصلي" : "The original system of calm",
            preview: "bg-emerald-deep"
        },
        { 
            id: "makkah-midnight", 
            name: language === "ar" ? "ليل مكة" : "Makkah Midnight", 
            milestone: 3, 
            description: language === "ar" ? "سكينة الحرم في جوف الليل" : "Haram serenity in the dead of night",
            preview: "bg-[#05080a]"
        },
        { 
            id: "madinah-dawn", 
            name: language === "ar" ? "فجر المدينة" : "Madinah Dawn", 
            milestone: 6, 
            description: language === "ar" ? "نور الروضة الشريفة" : "The light of the Rawdah",
            preview: "bg-[#fdfaff]"
        },
        { 
            id: "andalusian-gold", 
            name: language === "ar" ? "ذهب الأندلس" : "Andalusian Gold", 
            milestone: 9, 
            description: language === "ar" ? "إرث قرطبة وغرناطة" : "Legacy of Cordoba and Granada",
            preview: "bg-[#fcf8f2]"
        },
    ];

    const handleThemeSelect = (themeId: any, unlocked: boolean) => {
        if (!unlocked) return;
        setTheme(themeId);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C5A059', '#094231', '#FFFFFF']
        });
    };

    return (
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 mb-2 px-1">
                <Sparkles className="w-5 h-5 text-gold-matte" />
                <h2 className="text-xl font-bold font-tajawal text-emerald-deep">
                    {language === "ar" ? "ترقيات النظام" : "System Upgrades"}
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {themes.map((t) => {
                    const unlocked = currentStreak >= t.milestone;
                    const isActive = theme === t.id;

                    return (
                        <Card 
                            key={t.id}
                            className={cn(
                                "relative overflow-hidden p-4 flex items-center justify-between border-emerald-deep/5 transition-all duration-[666ms] cursor-pointer",
                                !unlocked && "opacity-60 grayscale-[0.5]",
                                isActive && "ring-2 ring-gold-matte shadow-lg scale-[1.02]"
                            )}
                            onClick={() => handleThemeSelect(t.id, unlocked)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn("w-12 h-12 rounded-2xl shadow-inner border border-black/5", t.preview)} />
                                <div>
                                    <h3 className="font-bold font-tajawal text-emerald-deep flex items-center gap-2">
                                        {t.name}
                                        {unlocked && !isActive && <div className="w-1.5 h-1.5 rounded-full bg-gold-matte animate-pulse" />}
                                    </h3>
                                    <p className="text-xs text-emerald-deep/50 font-tajawal leading-relaxed">
                                        {t.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                {!unlocked ? (
                                    <div className="flex flex-col items-center">
                                        <Lock className="w-4 h-4 text-emerald-deep/30" />
                                        <span className="text-[10px] font-bold text-emerald-deep/40">{t.milestone} {language === "ar" ? "أيام" : "Days"}</span>
                                    </div>
                                ) : isActive ? (
                                    <div className="bg-gold-matte/10 p-1.5 rounded-full">
                                        <Check className="w-4 h-4 text-gold-matte" />
                                    </div>
                                ) : (
                                    <Button variant="ghost" size="sm" className="text-[10px] h-7 px-3 rounded-full border border-emerald-deep/10 text-emerald-deep/60">
                                        {language === "ar" ? "تفعيل" : "Activate"}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <p className="text-[10px] text-center text-emerald-deep/40 font-medium px-4">
                {language === "ar" 
                    ? "استمر في الانضباط الروحي (إتمام الصلوات الخمس والأذكار يومياً) لفتح سمات جديدة." 
                    : "Maintain spiritual discipline (all 5 prayers + azkar daily) to unlock new themes."}
            </p>
        </div>
    );
};
