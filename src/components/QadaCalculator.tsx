import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQadaCalculator, PrayerType, QadaStrategy } from "@/hooks/useQadaCalculator";
import {
    Wrench,
    Trophy,
    Calendar,
    CheckCircle2,
    RotateCcw,
    Target,
    Clock,
    Sparkles,
    ChevronRight,
    Minus,
    Plus,
    Heart
} from "lucide-react";
import { toast } from "sonner";
import { triggerHaptic } from "@/lib/haptics";
import confetti from "canvas-confetti";
import { formatDuration } from "@/lib/format-utils";

// Prayer labels with icons
const PRAYER_KEYS: PrayerType[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const QadaCalculator = () => {
    const { t, language } = useLanguage();
    const {
        plan,
        calculateMissedPrayers,
        getDailyPrayersByStrategy,
        getEstimatedDays,
        startPlan,
        markPrayerComplete,
        undoPrayer,
        resetPlan,
        getOverallProgress,
        getTotalPrayers,
        getRemainingDays,
    } = useQadaCalculator();

    // Setup state
    const [years, setYears] = useState(1);
    const [months, setMonths] = useState(0);
    const [strategy, setStrategy] = useState<QadaStrategy>('moderate');
    const [customDaily, setCustomDaily] = useState(5);
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationMilestone, setCelebrationMilestone] = useState(0);

    // Translations
    const getText = (key: string, arText: string, enText: string) =>
        language === 'ar' ? arText : enText;

    const prayerLabels: Record<PrayerType, string> = {
        fajr: t.fajr,
        dhuhr: t.dhuhr,
        asr: t.asr,
        maghrib: t.maghrib,
        isha: t.isha,
    };

    const strategyLabels: Record<QadaStrategy, { ar: string; en: string; desc_ar: string; desc_en: string }> = {
        comfortable: {
            ar: "مريحة",
            en: "Comfortable",
            desc_ar: "صلاة واحدة قضاء يومياً",
            desc_en: "1 qada prayer per day"
        },
        moderate: {
            ar: "معتدلة",
            en: "Moderate",
            desc_ar: "صلاة قضاء مع كل فرض",
            desc_en: "1 qada with each prayer"
        },
        intensive: {
            ar: "مكثفة",
            en: "Intensive",
            desc_ar: "صلاتين قضاء مع كل فرض",
            desc_en: "2 qada with each prayer"
        },
        custom: {
            ar: "مخصصة",
            en: "Custom",
            desc_ar: "حدد العدد بنفسك",
            desc_en: "Set your own count"
        },
    };

    const milestoneMessages: Record<number, { ar: string; en: string }> = {
        10: { ar: "بداية موفقة! استمر 💪", en: "Great start! Keep going 💪" },
        25: { ar: "ربع الطريق! بارك الله فيك 🌟", en: "Quarter done! May Allah bless you 🌟" },
        50: { ar: "نصف العمل! أنت بطل 🎯", en: "Halfway there! You're a champion 🎯" },
        75: { ar: "اقتربت من الهدف! لا تتوقف 🚀", en: "Almost there! Don't stop 🚀" },
        100: { ar: "مبارك! أتممت مشروع الإصلاح 🎉", en: "Congratulations! You've completed the restoration 🎉" },
    };

    // Handle prayer completion with milestone check
    const handlePrayerComplete = (prayerType: PrayerType) => {
        const { newMilestone } = markPrayerComplete(prayerType);
        triggerHaptic();

        if (newMilestone) {
            setCelebrationMilestone(newMilestone);
            setShowCelebration(true);

            confetti({
                particleCount: newMilestone === 100 ? 300 : 100,
                spread: newMilestone === 100 ? 120 : 70,
                origin: { y: 0.6 },
                colors: ['#096431', '#B8860B', '#FFD700'],
            });

            toast.success(
                language === 'ar'
                    ? milestoneMessages[newMilestone].ar
                    : milestoneMessages[newMilestone].en,
                { duration: 5000 }
            );
        }
    };

    // Handle starting the plan
    const handleStartPlan = () => {
        if (years === 0 && months === 0) {
            toast.error(
                language === 'ar'
                    ? "الرجاء إدخال مدة الانقطاع"
                    : "Please enter the period of missed prayers"
            );
            return;
        }

        startPlan(years, months, strategy, customDaily);
        triggerHaptic();

        toast.success(
            language === 'ar'
                ? "بدأ مشروع الإصلاح! وفقك الله"
                : "Restoration project started! May Allah help you",
            { duration: 4000 }
        );

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#096431', '#B8860B'],
        });
    };

    // Handle reset
    const handleReset = () => {
        const confirmMsg = language === 'ar'
            ? "هل أنت متأكد من إلغاء مشروع الإصلاح؟"
            : "Are you sure you want to cancel the restoration project?";

        if (confirm(confirmMsg)) {
            resetPlan();
            toast.info(
                language === 'ar' ? "تم إلغاء المشروع" : "Project cancelled"
            );
        }
    };

    // Calculate preview data
    const totalMissed = calculateMissedPrayers(years, months);
    const dailyCount = getDailyPrayersByStrategy(strategy, customDaily);
    const estimatedDays = getEstimatedDays(totalMissed, dailyCount);

    // Get current progress data
    const progress = getOverallProgress();
    const { total, completed, remaining } = getTotalPrayers();
    const remainingDays = getRemainingDays();

    // =====================
    // SETUP SCREEN
    // =====================
    if (!plan.isActive) {
        return (
            <Card className="p-6 islamic-pattern border-emerald-deep/20 bg-gradient-to-br from-emerald-deep/5 to-transparent">
                <div className="space-y-6 text-center">
                    {/* Header */}
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-deep to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-deep/30">
                            <Wrench className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold font-amiri text-emerald-deep">
                        {getText('title', 'إصلاح ما فسد', 'Restore What Was Missed')}
                    </h3>

                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                        {getText(
                            'subtitle',
                            'حوّل عبء الفوائت إلى مشروع إصلاح منظم ومحفز',
                            'Transform missed prayers burden into an organized restoration project'
                        )}
                    </p>

                    {/* Input Section */}
                    <div className="space-y-6 bg-white/60 p-5 rounded-2xl border border-emerald-deep/10 shadow-inner">

                        {/* Years Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium font-amiri text-emerald-deep flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {getText('years', 'سنوات الانقطاع', 'Years of Missing')}
                            </label>
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setYears(Math.max(0, years - 1))}
                                    className="h-12 w-12 text-xl font-bold border-emerald-deep/20"
                                >
                                    <Minus className="w-5 h-5" />
                                </Button>
                                <div className="text-center min-w-[80px]">
                                    <span className="text-4xl font-bold text-emerald-deep">{years}</span>
                                    <span className="text-sm text-muted-foreground block">
                                        {getText('yearLabel', 'سنة', 'years')}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setYears(Math.min(60, years + 1))}
                                    className="h-12 w-12 text-xl font-bold border-emerald-deep/20"
                                >
                                    <Plus className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Months Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium font-amiri text-emerald-deep">
                                {getText('months', 'شهور إضافية', 'Additional Months')}
                            </label>
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setMonths(Math.max(0, months - 1))}
                                    className="h-10 w-10 border-emerald-deep/20"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-2xl font-bold text-emerald-deep min-w-[60px]">{months}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setMonths(Math.min(11, months + 1))}
                                    className="h-10 w-10 border-emerald-deep/20"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Total Preview */}
                        {(years > 0 || months > 0) && (
                            <div className="p-4 bg-emerald-deep/5 rounded-xl border border-emerald-deep/10">
                                <p className="text-sm text-muted-foreground">
                                    {getText('totalMissed', 'إجمالي الصلوات الفائتة', 'Total Missed Prayers')}
                                </p>
                                <p className="text-3xl font-bold text-emerald-deep">
                                    {totalMissed.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {getText('prayersLabel', 'صلاة', 'prayers')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Strategy Selection */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium font-amiri text-emerald-deep flex items-center justify-center gap-2">
                            <Target className="w-4 h-4" />
                            {getText('strategy', 'اختر استراتيجية القضاء', 'Choose Repayment Strategy')}
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            {(['comfortable', 'moderate', 'intensive', 'custom'] as QadaStrategy[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStrategy(s)}
                                    className={`p-3 rounded-xl border-2 transition-all text-start ${strategy === s
                                        ? 'border-emerald-deep bg-emerald-deep/10 shadow-md'
                                        : 'border-gray-200 hover:border-emerald-deep/50'
                                        }`}
                                >
                                    <span className={`font-bold text-sm ${strategy === s ? 'text-emerald-deep' : 'text-gray-700'}`}>
                                        {language === 'ar' ? strategyLabels[s].ar : strategyLabels[s].en}
                                    </span>
                                    <span className="block text-xs text-muted-foreground mt-1">
                                        {language === 'ar' ? strategyLabels[s].desc_ar : strategyLabels[s].desc_en}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Custom slider */}
                        {strategy === 'custom' && (
                            <div className="p-4 bg-white rounded-xl border border-emerald-deep/10">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">
                                        {getText('dailyCount', 'عدد الصلوات يومياً', 'Daily prayers')}
                                    </span>
                                    <span className="font-bold text-emerald-deep">{customDaily}</span>
                                </div>
                                <Slider
                                    value={[customDaily]}
                                    min={1}
                                    max={100}
                                    step={1}
                                    onValueChange={(val) => setCustomDaily(val[0])}
                                    className="py-2"
                                />
                            </div>
                        )}
                    </div>

                    {/* Estimated Time */}
                    {(years > 0 || months > 0) && (
                        <div className="flex justify-between items-center p-4 bg-gold-matte/10 rounded-xl border border-gold-matte/20">
                            <div className="text-center flex-1">
                                <Clock className="w-5 h-5 mx-auto text-gold-matte mb-1" />
                                <p className="text-xs text-muted-foreground">
                                    {getText('estimatedTime', 'المدة المتوقعة', 'Estimated Time')}
                                </p>
                                <p className="font-bold text-lg text-emerald-deep">
                                    {formatDuration(estimatedDays, language as 'ar' | 'en')}
                                </p>
                            </div>
                            <div className="w-[1px] h-12 bg-gold-matte/20" />
                            <div className="text-center flex-1">
                                <Target className="w-5 h-5 mx-auto text-gold-matte mb-1" />
                                <p className="text-xs text-muted-foreground">
                                    {getText('dailyGoal', 'الهدف اليومي', 'Daily Goal')}
                                </p>
                                <p className="font-bold text-lg text-emerald-deep">
                                    {dailyCount} {getText('prayersShort', 'صلاة', 'prayers')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Start Button */}
                    <Button
                        onClick={handleStartPlan}
                        disabled={years === 0 && months === 0}
                        className="w-full bg-gradient-to-r from-emerald-deep to-emerald-800 hover:opacity-90 text-white font-bold py-6 text-lg shadow-lg shadow-emerald-deep/30 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                        <Sparkles className="w-5 h-5 me-2" />
                        {getText('startProject', 'ابدأ مشروع الإصلاح', 'Start Restoration Project')}
                    </Button>

                    <p className="text-xs text-muted-foreground italic">
                        {getText(
                            'note',
                            '﴿ إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ ﴾',
                            '"Indeed, Allah does not waste the reward of those who do good."'
                        )}
                    </p>
                </div>
            </Card>
        );
    }

    // =====================
    // PROGRESS SCREEN
    // =====================
    return (
        <Card className="p-5 islamic-pattern border-emerald-deep/20">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <Badge
                        variant="outline"
                        className="mb-2 bg-emerald-deep/5 text-emerald-deep border-emerald-deep/20 gap-1"
                    >
                        <Wrench className="w-3 h-3" />
                        {getText('activeProject', 'مشروع جاري', 'Active Project')}
                    </Badge>
                    <h3 className="text-xl font-bold font-amiri text-emerald-deep">
                        {getText('progressTitle', 'متابعة الإصلاح', 'Track Progress')}
                    </h3>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                >
                    <RotateCcw className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-5">
                {/* Main Progress Card */}
                <div className="bg-gradient-to-br from-emerald-deep to-emerald-800 rounded-2xl p-5 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 opacity-80">
                            <Trophy className="w-5 h-5" />
                            <span className="font-medium">
                                {getText('overallProgress', 'التقدم الكلي', 'Overall Progress')}
                            </span>
                        </div>
                        <span className="text-3xl font-bold">{progress}%</span>
                    </div>

                    <Progress value={progress} className="h-4 bg-white/20" />

                    <div className="flex justify-between mt-4 text-sm opacity-80">
                        <span>{completed.toLocaleString()} {getText('completed', 'مكتملة', 'completed')}</span>
                        <span>{remaining.toLocaleString()} {getText('remainingLabel', 'متبقية', 'remaining')}</span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-emerald-deep/10 shadow-sm">
                        <Clock className="w-5 h-5 text-gold-matte mb-2" />
                        <p className="text-xs text-muted-foreground">
                            {getText('daysRemaining', 'أيام متبقية', 'Days Remaining')}
                        </p>
                        <p className="text-2xl font-bold text-emerald-deep">
                            {formatDuration(remainingDays, language as 'ar' | 'en')}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-emerald-deep/10 shadow-sm">
                        <Target className="w-5 h-5 text-gold-matte mb-2" />
                        <p className="text-xs text-muted-foreground">
                            {getText('dailyTarget', 'الهدف اليومي', 'Daily Target')}
                        </p>
                        <p className="text-2xl font-bold text-emerald-deep">
                            {getDailyPrayersByStrategy(plan.strategy, plan.customDailyCount)}
                        </p>
                    </div>
                </div>

                {/* Prayer-by-Prayer Progress */}
                <div className="space-y-3">
                    <h4 className="font-amiri font-bold text-emerald-deep flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        {getText('prayerProgress', 'تقدم كل صلاة', 'Prayer Progress')}
                    </h4>

                    {PRAYER_KEYS.map((prayerKey) => {
                        const prayer = plan.prayers[prayerKey];
                        const prayerProgress = prayer.total > 0
                            ? Math.round((prayer.completed / prayer.total) * 100)
                            : 0;

                        return (
                            <div
                                key={prayerKey}
                                className="bg-white rounded-xl p-4 border border-emerald-deep/10 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-amiri font-bold text-emerald-deep">
                                        {prayerLabels[prayerKey]}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {prayer.completed} / {prayer.total}
                                    </span>
                                </div>

                                <Progress value={prayerProgress} className="h-2 mb-3" />

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => undoPrayer(prayerKey)}
                                        disabled={prayer.completed === 0}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        onClick={() => handlePrayerComplete(prayerKey)}
                                        disabled={prayer.completed >= prayer.total}
                                        className="flex-1 h-9 bg-emerald-deep hover:bg-emerald-deep/90"
                                    >
                                        <CheckCircle2 className="w-4 h-4 me-2" />
                                        {getText('prayedQada', 'صليت قضاء', 'Prayed Qada')}
                                    </Button>

                                    <span className="text-xs text-muted-foreground w-12 text-center">
                                        {prayerProgress}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Milestones */}
                <div className="bg-gold-matte/5 rounded-xl p-4 border border-gold-matte/20">
                    <h4 className="font-amiri font-bold text-gold-matte flex items-center gap-2 mb-3">
                        <Trophy className="w-4 h-4" />
                        {getText('milestones', 'الإنجازات', 'Milestones')}
                    </h4>
                    <div className="flex justify-between">
                        {[10, 25, 50, 75, 100].map((m) => {
                            const key = `percent${m}` as keyof typeof plan.milestones;
                            const achieved = plan.milestones[key];
                            return (
                                <div
                                    key={m}
                                    className={`flex flex-col items-center ${achieved ? 'text-gold-matte' : 'text-gray-300'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${achieved
                                        ? 'bg-gold-matte/20 border-gold-matte'
                                        : 'bg-gray-100 border-gray-200'
                                        }`}>
                                        {achieved ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            <span className="text-xs font-bold">{m}%</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Motivational Quote */}
                <p className="text-center text-xs text-muted-foreground italic pt-2">
                    {getText(
                        'quote',
                        '﴿ وَإِنِّي لَغَفَّارٌ لِمَنْ تَابَ وَآمَنَ وَعَمِلَ صَالِحًا ﴾',
                        '"And indeed, I am the Perpetual Forgiver of whoever repents and believes and does righteousness."'
                    )}
                </p>
            </div>
        </Card>
    );
};
