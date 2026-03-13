import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Sparkles, Sun, Moon, Utensils, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useVibration } from "@/hooks/useVibration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SunnahItem {
  id: string;
  title: { ar: string; en: string };
  icon: any;
  category: 'prayer' | 'azkar' | 'habit';
}

const SUNNAH_ITEMS: SunnahItem[] = [
  { id: 'fajr_sunnah', title: { ar: "سنة الفجر", en: "Fajr Sunnah" }, icon: Sun, category: 'prayer' },
  { id: 'duha_prayer', title: { ar: "صلاة الضحى", en: "Duha Prayer" }, icon: Sparkles, category: 'prayer' },
  { id: 'morning_azkar', title: { ar: "أذكار الصباح", en: "Morning Azkar" }, icon: Sun, category: 'azkar' },
  { id: 'evening_azkar', title: { ar: "أذكار المساء", en: "Evening Azkar" }, icon: Moon, category: 'azkar' },
  { id: 'witr_prayer', title: { ar: "صلاة الوتر", en: "Witr Prayer" }, icon: Moon, category: 'prayer' },
  { id: 'siwak', title: { ar: "استخدام السواك", en: "Using Siwak" }, icon: Utensils, category: 'habit' },
  { id: 'night_quran', title: { ar: "ورد القرآن", en: "Daily Quran" }, icon: Heart, category: 'habit' },
];

export const SunnahChecklist = () => {
  const { language } = useLanguage();
  const { vibrateLight, vibrateSuccess } = useVibration();
  const [completed, setCompleted] = useState<string[]>([]);
  const today = new Date().toDateString();

  useEffect(() => {
    const saved = localStorage.getItem(`sunnah_progress_${today}`);
    if (saved) setCompleted(JSON.parse(saved));
  }, [today]);

  const toggleItem = (id: string) => {
    const isNowCompleted = !completed.includes(id);
    const newCompleted = isNowCompleted 
      ? [...completed, id] 
      : completed.filter(item => item !== id);
    
    setCompleted(newCompleted);
    localStorage.setItem(`sunnah_progress_${today}`, JSON.stringify(newCompleted));
    
    if (isNowCompleted) {
      vibrateSuccess();
      if (newCompleted.length === SUNNAH_ITEMS.length) {
        // Complete perfection!
      }
    } else {
      vibrateLight();
    }
  };

  const progress = Math.round((completed.length / SUNNAH_ITEMS.length) * 100);

  return (
    <Card className="border-emerald-deep/10 bg-white/50 backdrop-blur-md shadow-lg overflow-hidden">
      <CardHeader className="pb-2 bg-emerald-deep/5">
        <div className="flex justify-between items-center">
          <CardTitle className="font-tajawal text-xl text-emerald-deep flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-matte animate-pulse-soft" />
            {language === "ar" ? "سنن اليوم" : "Daily Sunnah"}
          </CardTitle>
          <span className="text-sm font-medium text-emerald-deep/60">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5 mt-2 bg-emerald-deep/10" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {SUNNAH_ITEMS.map((item) => {
          const isDone = completed.includes(item.id);
          return (
            <div 
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300",
                "hover:bg-emerald-deep/5 active:scale-[0.98]",
                isDone ? "bg-emerald-deep/5 border-emerald-deep/10" : "bg-white border border-transparent shadow-sm"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  isDone ? "bg-emerald-deep/10 text-emerald-deep" : "bg-cream text-muted-foreground"
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className={cn(
                  "font-tajawal text-sm font-medium transition-colors",
                  isDone ? "text-emerald-deep/60 line-through" : "text-emerald-deep"
                )}>
                  {language === "ar" ? item.title.ar : item.title.en}
                </span>
              </div>
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-deep" />
              ) : (
                <Circle className="w-5 h-5 text-emerald-deep/20" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
