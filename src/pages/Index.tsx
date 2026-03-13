import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Clock, Compass, BookOpen, Settings, Calendar, Moon, Heart, ClipboardList, Terminal, MapPin, GraduationCap, Calculator, Bookmark, Hash, Sparkles, TrendingUp } from "lucide-react";
import { useVibration } from "@/hooks/useVibration";
import { cn } from "@/lib/utils";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { getHijriDate, getHijriYear } from "@/lib/date-utils";
import { getHijriEvents } from "@/lib/islamic-events";

// Light components - always loaded (small, always visible)
import { LanguageToggle } from "@/components/LanguageToggle";
import { OfflineBanner } from "@/components/OfflineBanner";
import { HijriDateDisplay } from "@/components/HijriDateDisplay";
import { DockNavigation } from "@/components/DockNavigation";
import { AlarmChallenge } from "@/components/AlarmChallenge";
import { SunnahChecklist } from "@/components/SunnahChecklist";
import { AuraEffect } from "@/components/AuraEffect";
import { useSystemLog } from "@/hooks/useSystemLog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PermissionsPrompt } from "@/components/PermissionsPrompt";
import patternBg from "@/assets/pattern.png";

// Heavy components - lazy loaded (only when user navigates to them)
const PrayerTimesCard = lazy(() => import("@/components/PrayerTimesCard").then(m => ({ default: m.PrayerTimesCard })));
const QiblaCompass = lazy(() => import("@/components/QiblaCompass").then(m => ({ default: m.QiblaCompass })));
const AzkarList = lazy(() => import("@/components/AzkarList").then(m => ({ default: m.AzkarList })));
const DuaList = lazy(() => import("@/components/DuaList").then(m => ({ default: m.DuaList })));
const SettingsPage = lazy(() => import("@/components/SettingsPage").then(m => ({ default: m.SettingsPage })));
const HijriCalendar = lazy(() => import("@/components/HijriCalendar").then(m => ({ default: m.HijriCalendar })));
const QuranIndex = lazy(() => import("@/components/QuranIndex").then(m => ({ default: m.QuranIndex })));
const SunnahPrayers = lazy(() => import("@/components/SunnahPrayers").then(m => ({ default: m.SunnahPrayers })));
const QadaCalculator = lazy(() => import("@/components/QadaCalculator").then(m => ({ default: m.QadaCalculator })));
const MasjidFinder = lazy(() => import("@/components/MasjidFinder").then(m => ({ default: m.MasjidFinder })));
const DeveloperPanel = lazy(() => import("@/components/DeveloperPanel").then(m => ({ default: m.DeveloperPanel })));
const TajweedPage = lazy(() => import("@/components/TajweedPage").then(m => ({ default: m.TajweedPage })));
const KhatmaPlanner = lazy(() => import("@/components/KhatmaPlanner").then(m => ({ default: m.KhatmaPlanner })));
const TasbihCounter = lazy(() => import("@/components/TasbihCounter").then(m => ({ default: m.TasbihCounter })));
const AsmaUlHusna = lazy(() => import("@/components/AsmaUlHusna").then(m => ({ default: m.AsmaUlHusna })));
const ZakatCalculator = lazy(() => import("@/components/ZakatCalculator").then(m => ({ default: m.ZakatCalculator })));
const VoiceCommandOverlay = lazy(() => import("@/components/VoiceCommandOverlay").then(m => ({ default: m.VoiceCommandOverlay })));
const QuickShield = lazy(() => import("@/components/QuickShield").then(m => ({ default: m.QuickShield })));
const HarmonyLevels = lazy(() => import("@/components/HarmonyLevels").then(m => ({ default: m.HarmonyLevels })));
const MilestoneRewards = lazy(() => import("@/components/MilestoneRewards").then(m => ({ default: m.MilestoneRewards })));

// Lazy loading fallback
const LazyFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-9 h-9 border-3 border-emerald-deep/20 border-t-emerald-deep rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("prayers");
  const [isDuaOpen, setIsDuaOpen] = useState(false);
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const { getHarmonyLevel, todayLog } = useSystemLog();
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const harmonyLevel = getHarmonyLevel(dateStr);
  const [tapCount, setTapCount] = useState(0);
  const { vibrateLight } = useVibration();

  const handleNextEventCommand = () => {
    const now = new Date();
    const hijriDate = getHijriDate(now, language as "ar" | "en");
    
    // Find next event with more accuracy
    const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {day: "numeric", month: "numeric"});
    const parts = hijriFormatter.formatToParts(now);
    const hijriDay = parseInt(parts.find(p => p.type === "day")?.value || "1");
    const hijriMonth = parseInt(parts.find(p => p.type === "month")?.value || "1") - 1;
    
    const events = getHijriEvents(hijriMonth, now.getFullYear());
    const nextEvent = events.find(e => e.day >= hijriDay);
    
    let feedback = language === "ar" 
      ? `التاريخ اليوم هو ${hijriDate}.` 
      : `Today is ${hijriDate}.`;
    
    if (nextEvent) {
      feedback += language === "ar"
        ? ` الحدث القادم هو ${nextEvent.title.ar} يوم ${nextEvent.day}.`
        : ` The next event is ${nextEvent.title.en} on day ${nextEvent.day}.`;
    }

    return feedback;
  };

  const voiceCommands = useMemo(() => [
    {
      keywords: ["start recovery protocol", "recovery protocol", "بدء بروتوكول الاستعادة"],
      action: () => {
        setActiveTab("azkar");
      },
      feedback: language === "ar" ? "تم بدء بروتوكول الاستعادة. عرض الأذكار." : "Recovery Protocol started. Displaying Azkar."
    },
    {
      keywords: ["calculate next event", "next event", "احسب الحدث القادم"],
      action: () => {
        const feedback = handleNextEventCommand();
        speakFeedback(feedback);
      },
      feedback: "" // Handled in action
    }
  ], [language]);

  const { isListening, isSupported, toggleListening, speakFeedback } = useVoiceCommands(voiceCommands);

  const [showDevPassword, setShowDevPassword] = useState(false);
  const [devPasswordInput, setDevPasswordInput] = useState("");

  useEffect(() => {
    const isDev = localStorage.getItem("devMode") === "true";
    setDevModeEnabled(isDev);
  }, []);

  const handleDevTrigger = () => {
    if (devModeEnabled) return;

    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 7) {
      setShowDevPassword(true);
      setTapCount(0);
    }
  };

  const verifyDevPassword = () => {
    if (devPasswordInput === "Allahakbaar16899@33") {
      localStorage.setItem("devMode", "true");
      localStorage.setItem("devModeDate", new Date().toDateString());
      setDevModeEnabled(true);
      setShowDevPassword(false);
      toast.success(language === "ar" ? "تم تفعيل وضع المطور!" : "Developer Mode Enabled!");
    } else {
      toast.error(language === "ar" ? "كلمة المرور غير صحيحة" : "Incorrect Password");
      setDevPasswordInput("");
    }
  };

  // Custom Icons for Bottom Nav - Restoring ALL original tabs
  const navItems = useMemo(() => [
    { id: "prayers", label: t.prayerTimes, icon: Clock },
    { id: "progress", label: language === "ar" ? "التقدم" : "Progress", icon: TrendingUp },
    { id: "quran", label: language === "ar" ? "القرآن" : "Quran", icon: BookOpen },
    { id: "azkar", label: t.azkar, icon: Moon },
    { id: "dua", label: t.dua, icon: Heart },
    { id: "asmaUlHusna", label: t.asmaUlHusna, icon: Sparkles },
    { id: "tasbih", label: t.tasbih, icon: Hash },
    { id: "zakat", label: t.zakatCalculator, icon: Calculator },
    { id: "khatma", label: t.khatmaPlanner, icon: Bookmark },
    { id: "tajweed", label: language === "ar" ? "تجويد" : "Tajweed", icon: GraduationCap },
    { id: "mosques", label: t.mosques, icon: MapPin },
    { id: "qibla", label: t.qibla, icon: Compass },
    { id: "calendar", label: language === "ar" ? "التقويم" : "Calendar", icon: Calendar },
    { id: "sunnah", label: language === "ar" ? "النوافل" : "Nawafil", icon: Heart },
    { id: "qada", label: language === "ar" ? "قضاء" : "Qada", icon: ClipboardList },
    { id: "settings", label: t.settings, icon: Settings },
    ...(devModeEnabled ? [{ id: "developer", label: "Dev", icon: Terminal }] : []),
  ], [t, language, devModeEnabled]);

  const contentMap: Record<string, React.ReactNode> = {
    prayers: (
      <div className="space-y-6">
        <PrayerTimesCard />
      </div>
    ),
    progress: (
      <div className="space-y-6">
        <SunnahChecklist />
        <HarmonyLevels />
        <MilestoneRewards />
      </div>
    ),
    quran: <QuranIndex isEmbedded={true} />,
    tajweed: <TajweedPage />,
    mosques: <MasjidFinder />,
    qibla: (
      <div className="flex justify-center h-full items-center">
        <QiblaCompass />
      </div>
    ),
    calendar: <HijriCalendar />,
    azkar: <AzkarList />,
    dua: <DuaList />,
    qada: <QadaCalculator />,
    asmaUlHusna: <AsmaUlHusna />,
    zakat: <ZakatCalculator />,
    tasbih: <TasbihCounter />,
    khatma: <KhatmaPlanner />,
    sunnah: <SunnahPrayers />,
    settings: <SettingsPage />,
    developer: <DeveloperPanel />,
  };

  const renderContent = () => {
    return contentMap[activeTab] || contentMap.prayers;
  };

  return (
    <div className="min-h-screen bg-cream text-foreground font-sans flex flex-col relative overflow-hidden selection:bg-emerald-light selection:text-white">
      {/* Background Breathing Glow - Moved here to fix jitter in long lists */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_70%)] animate-pulse-breathing" />

      {/* Sakina Effect: Floating Light Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-emerald-light/10 blur-xl animate-float-slow"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Background Texture Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{ backgroundImage: `url('/assets/pattern.png')`, backgroundSize: '150px' }}>
      </div>

      {/* Offline Banner */}
      <OfflineBanner />

      <AlarmChallenge />
      <PermissionsPrompt />

      {/* Modern Header - Deep Emerald */}
      <header
        className="relative z-10 pt-safe pb-4 px-4 bg-emerald-deep text-white rounded-b-[2.5rem] shadow-[0_10px_40px_-10px_rgba(9,66,49,0.4)] mb-4 overflow-hidden"
        role="banner"
        aria-label={language === "ar" ? "رأس التطبيق - عباد الرحمن" : "App header - Ibad Al-Rahman"}
      >
        {/* Abstract Pattern Overlay for Header */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url('/assets/pattern.png')`, backgroundSize: '150px' }}>
        </div>

        <div className="relative flex flex-col items-center justify-center pt-1 animate-fade-in-down">
          {/* Top Row: Language & Dev Trigger */}
          <div className="absolute top-0 right-0 p-2 z-20 flex items-center gap-2">
            <LanguageToggle />
          </div>

          {/* Dev Mode Trigger - Expanded Area */}
          <div
            onClick={handleDevTrigger}
            className="absolute top-0 left-0 w-20 h-20 z-50 opacity-0 hover:opacity-20 bg-red-500/20 cursor-pointer"
            title="Dev Mode"
          />

          {/* Centered Greeting & Logo */}
          <div className="flex flex-col items-center text-center space-y-1 mt-2">
            <span className="text-emerald-100/90 font-tajawal text-base font-medium tracking-wide animate-fade-in delay-100">
              {language === "ar" ? "السلام عليكم" : "Assalamu Alaikum"}
            </span>

            {/* Main Logo - Clickable for Dua/Message */}
            <div
              onClick={() => setIsDuaOpen(true)}
              className="cursor-pointer transition-transform duration-[369ms] hover:scale-[1.06] active:scale-[0.96] group relative flex justify-center items-center"
            >
              <img
                src="/assets/logo_caligraphy.png"
                alt="Ibad Al-Rahman"
                className="h-28 md:h-36 w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] relative z-10 brightness-[1.05]"
              />
              <AuraEffect 
                harmonyLevel={harmonyLevel} 
                className="scale-110 opacity-70"
                activeTriggers={{
                  morningAzkar: todayLog.azkar.morning,
                  eveningAzkar: todayLog.azkar.evening
                }}
              />
            </div>
          </div>
        </div>

        {/* Date Display - Compact Floating Pill */}
        <div className="mt-3 mx-auto max-w-sm bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 flex items-center justify-between shadow-lg animate-fade-in-up delay-200">
          <HijriDateDisplay />
          <div className="w-px h-5 bg-white/20 mx-3" />
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gold-matte" />
            <span className="text-[10px] text-white/80 font-tajawal">{getHijriYear(new Date())} AH</span>
          </div>
        </div>
      </header>

      <Dialog open={showDevPassword} onOpenChange={setShowDevPassword}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-center">Developer Access</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <input
              type="password"
              value={devPasswordInput}
              onChange={(e) => setDevPasswordInput(e.target.value)}
              placeholder="Enter Password"
              className="p-2 rounded bg-black/50 border border-white/10 text-white w-full"
            />
            <Button onClick={verifyDevPassword} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Verify
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDuaOpen} onOpenChange={setIsDuaOpen}>
        <DialogContent className="sm:max-w-md bg-cream border-emerald-deep/10 text-emerald-deep shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center font-amiri text-3xl leading-loose text-emerald-deep drop-shadow-sm">
              دعاء
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-6 py-4">
            <div className="p-6 bg-white rounded-2xl border border-emerald-deep/5 shadow-inner">
              <p className="font-quran text-2xl leading-[3] text-emerald-deep">
                رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ
              </p>
            </div>

            <p className="font-tajawal text-base leading-relaxed text-emerald-deep/70">
              نسألكم دعوة بظهر الغيب لمطور هذا التطبيق وأمه من الرضاعة وأمه الحقيقية والبنت اللي ماتت زمان في مدرسة السحر وأهله وأموات المسلمين.. اللهم ارحمهم جميعاً، واغفر لهم، وثبتهم عند السؤال.
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => setIsDuaOpen(false)}
              className="bg-gold-matte text-white hover:bg-gold-light font-tajawal font-bold px-10 py-6 rounded-xl shadow-lg shadow-gold-matte/20 transition-all hover:scale-[1.06]"
            >
              اللهم آمين
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content Area */}
      <main
        className="flex-1 overflow-y-auto pb-32 px-4 relative z-10 no-scrollbar"
        role="main"
        aria-label={language === "ar" ? "المحتوى الرئيسي" : "Main content"}
      >
        <Suspense fallback={<LazyFallback />}>
          {renderContent()}
        </Suspense>
      </main>

      {/* Modern Floating Dock Navigation with Magnification */}
      <DockNavigation
        items={navItems}
        activeId={activeTab}
        onItemClick={(id) => {
          vibrateLight();
          if (id === "quran") {
            navigate("/quran");
          } else {
            setActiveTab(id);
          }
        }}
        language={language}
      />
      
      <Suspense fallback={null}>
        <VoiceCommandOverlay 
          isListening={isListening}
          isSupported={isSupported}
          toggleListening={toggleListening}
        />
        <QuickShield />
      </Suspense>
    </div>
  );
};

export default Index;
