/**
 * Accessibility Utilities for Blind Users (أدوات الوصولية للمكفوفين)
 * 
 * This module provides comprehensive screen reader-friendly labels in Arabic and English
 * to make the app fully accessible to visually impaired users.
 * 
 * "المكفوف الذي يذكر الله عبر تطبيقك - سوق ضخمة للحسنات" 💚
 */

// ============================================
// Prayer Times Accessibility - مواقيت الصلاة
// ============================================

/**
 * Convert 24h time to spoken time with full context
 * تحويل الوقت لصيغة منطوقة واضحة
 */
const formatSpokenTime = (time24: string, language: string): string => {
    const [hours, minutes] = time24.split(":").map(Number);
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, "0");

    if (language === "ar") {
        const period = hours >= 12 ? "مساءً" : "صباحاً";
        // More natural Arabic time reading
        if (minutes === 0) {
            return `الساعة ${hours12} ${period} تماماً`;
        } else if (minutes === 30) {
            return `الساعة ${hours12} ونصف ${period}`;
        } else if (minutes === 15) {
            return `الساعة ${hours12} وربع ${period}`;
        } else if (minutes === 45) {
            return `الساعة ${hours12} إلا ربع ${period}`;
        }
        return `الساعة ${hours12} و ${minutes} دقيقة ${period}`;
    } else {
        const period = hours >= 12 ? "PM" : "AM";
        return `${hours12}:${minutesStr} ${period}`;
    }
};

/**
 * Get accessible label for prayer time row
 * يعطي وصف شامل لوقت الصلاة للقارئ الشاشة
 */
export const getAccessiblePrayerLabel = (
    prayerName: string,
    prayerKey: string,
    time24: string,
    isNext: boolean,
    notificationsEnabled: boolean,
    timeLeft: string | null,
    language: string
): string => {
    const spokenTime = formatSpokenTime(time24, language);

    if (language === "ar") {
        let label = "";

        // Prayer name with context
        if (isNext) {
            label = `الصلاة القادمة: صلاة ${prayerName}، `;
            if (timeLeft) {
                label += `متبقي عليها ${timeLeft}، `;
            }
        } else {
            label = `صلاة ${prayerName}، `;
        }

        // Time
        label += `موعدها ${spokenTime}، `;

        // Notification status with action hint
        if (prayerKey !== 'sunrise') {
            label += notificationsEnabled
                ? "التنبيهات مُفعّلة، اضغط مرتين لإيقافها"
                : "التنبيهات مُعطّلة، اضغط مرتين لتفعيلها";
        } else {
            label += "الشروق ليس له أذان";
        }

        return label;
    } else {
        let label = "";

        if (isNext) {
            label = `Next prayer: ${prayerName}, `;
            if (timeLeft) {
                label += `${timeLeft} remaining, `;
            }
        } else {
            label = `${prayerName} prayer, `;
        }

        label += `scheduled at ${spokenTime}, `;

        if (prayerKey !== 'sunrise') {
            label += notificationsEnabled
                ? "notifications enabled, double tap to disable"
                : "notifications disabled, double tap to enable";
        } else {
            label += "sunrise has no adhan";
        }

        return label;
    }
};

/**
 * Get accessible label for the main clock display
 * وصف الساعة الرئيسية
 */
export const getAccessibleClockLabel = (
    currentTime: Date,
    nextPrayerName: string,
    timeLeft: string,
    language: string
): string => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const hours12 = hours % 12 || 12;

    if (language === "ar") {
        const period = hours >= 12 ? "مساءً" : "صباحاً";
        return `الوقت الحالي ${hours12}:${minutes.toString().padStart(2, "0")} ${period}. ` +
            `الصلاة القادمة ${nextPrayerName}، متبقي عليها ${timeLeft}. ` +
            `اسحب لأسفل لرؤية جميع مواقيت الصلاة.`;
    }

    const period = hours >= 12 ? "PM" : "AM";
    return `Current time is ${hours12}:${minutes.toString().padStart(2, "0")} ${period}. ` +
        `Next prayer is ${nextPrayerName}, ${timeLeft} remaining. ` +
        `Scroll down to see all prayer times.`;
};

/**
 * Get accessible label for notification toggle button
 * وصف زر تفعيل/إيقاف التنبيهات
 */
export const getAccessibleBellLabel = (
    prayerName: string,
    isEnabled: boolean,
    language: string
): string => {
    if (language === "ar") {
        return isEnabled
            ? `زر إيقاف تنبيه صلاة ${prayerName}. التنبيه مُفعّل حالياً. اضغط مرتين لإيقافه.`
            : `زر تفعيل تنبيه صلاة ${prayerName}. التنبيه مُعطّل حالياً. اضغط مرتين لتفعيله.`;
    }
    return isEnabled
        ? `Disable ${prayerName} notification button. Currently enabled. Double tap to disable.`
        : `Enable ${prayerName} notification button. Currently disabled. Double tap to enable.`;
};

// ============================================
// Azkar Accessibility - الأذكار
// ============================================

/**
 * Get accessible label for Azkar category tab
 * وصف تبويب نوع الأذكار
 */
export const getAccessibleAzkarTabLabel = (
    tabName: string,
    isSelected: boolean,
    language: string
): string => {
    if (language === "ar") {
        return isSelected
            ? `${tabName}، التبويب المحدد حالياً`
            : `${tabName}، اضغط مرتين للانتقال`;
    }
    return isSelected
        ? `${tabName}, currently selected`
        : `${tabName}, double tap to switch`;
};

/**
 * Get accessible label for Azkar card
 * وصف شامل لبطاقة الذكر
 */
export const getAccessibleAzkarLabel = (
    arabicText: string,
    currentCount: number,
    targetCount: number,
    secondaryCount: number | undefined,
    isComplete: boolean,
    reward: string | undefined,
    language: string
): string => {
    // Get first meaningful part of the dhikr
    const firstLine = arabicText.split(/[،.]/)[0].trim();
    const shortText = firstLine.length > 80 ? firstLine.substring(0, 80) + "..." : firstLine;

    if (language === "ar") {
        let label = `ذكر: ${shortText}. `;

        if (isComplete) {
            label += "مكتمل، جزاك الله خيراً! ";
        } else {
            const finalTarget = secondaryCount || targetCount;
            const remaining = finalTarget - currentCount;
            label += `التقدم: ${currentCount} من ${finalTarget}، متبقي ${remaining}. `;
        }

        if (reward) {
            label += `الفضل: ${reward.substring(0, 100)}... `;
        }

        if (!isComplete) {
            label += "اضغط على زر العد للتسبيح.";
        }

        return label;
    } else {
        let label = `Dhikr: ${shortText}. `;

        if (isComplete) {
            label += "Completed, may Allah reward you! ";
        } else {
            const finalTarget = secondaryCount || targetCount;
            const remaining = finalTarget - currentCount;
            label += `Progress: ${currentCount} of ${finalTarget}, ${remaining} remaining. `;
        }

        if (reward) {
            label += `Reward: ${reward.substring(0, 100)}... `;
        }

        if (!isComplete) {
            label += "Tap count button to proceed.";
        }

        return label;
    }
};

/**
 * Get accessible label for count button
 * وصف زر العد
 */
export const getAccessibleCountButtonLabel = (
    currentCount: number,
    targetCount: number,
    isComplete: boolean,
    language: string
): string => {
    if (language === "ar") {
        if (isComplete) {
            return "زر العد، مكتمل";
        }
        return `زر العد، اضغط للتكرار ${currentCount + 1} من ${targetCount}`;
    }
    if (isComplete) {
        return "Count button, completed";
    }
    return `Count button, tap for repetition ${currentCount + 1} of ${targetCount}`;
};

/**
 * Get accessible label for favorite toggle
 * وصف زر المفضلة
 */
export const getAccessibleFavoriteLabel = (
    isFavorite: boolean,
    language: string
): string => {
    if (language === "ar") {
        return isFavorite
            ? "إزالة من أذكارك المفضلة، اضغط مرتين"
            : "إضافة إلى أذكارك المفضلة، اضغط مرتين";
    }
    return isFavorite
        ? "Remove from your favorites, double tap"
        : "Add to your favorites, double tap";
};

// ============================================
// Tasbih Counter Accessibility - المسبحة
// ============================================

/**
 * Get accessible label for Tasbih counter button
 * وصف شامل لعداد التسبيح
 */
export const getAccessibleTasbihLabel = (
    count: number,
    target: number,
    language: string
): string => {
    if (language === "ar") {
        if (target === 0) {
            return `عداد التسبيح، العدد الحالي ${count}، بدون هدف محدد. اضغط في أي مكان للعد. سبحان الله.`;
        }
        const remaining = target - count;
        const progress = Math.round((count / target) * 100);
        return `عداد التسبيح، العدد ${count} من ${target}، التقدم ${progress} بالمئة، متبقي ${remaining}. اضغط للعد. سبحان الله.`;
    } else {
        if (target === 0) {
            return `Tasbih counter, current count ${count}, no target set. Tap anywhere to count.`;
        }
        const remaining = target - count;
        const progress = Math.round((count / target) * 100);
        return `Tasbih counter, ${count} of ${target}, ${progress}% complete, ${remaining} remaining. Tap to count.`;
    }
};

/**
 * Get accessible label for target selection button
 * وصف زر اختيار الهدف
 */
export const getAccessibleTargetLabel = (
    target: number,
    isActive: boolean,
    language: string
): string => {
    if (language === "ar") {
        const targetStr = target === 0 ? "لا نهاية" : `${target} تسبيحة`;
        return isActive
            ? `هدف ${targetStr}، محدد حالياً`
            : `اختر هدف ${targetStr}، اضغط مرتين للتحديد`;
    }
    const targetStr = target === 0 ? "unlimited" : `${target}`;
    return isActive
        ? `Target ${targetStr}, currently selected`
        : `Select target ${targetStr}, double tap to choose`;
};

/**
 * Get accessible label for reset button
 * وصف زر إعادة التعيين
 */
export const getAccessibleResetLabel = (language: string): string => {
    if (language === "ar") {
        return "زر إعادة تعيين العداد إلى صفر، اضغط مرتين";
    }
    return "Reset counter to zero button, double tap to reset";
};

// ============================================
// Quran Accessibility - القرآن الكريم
// ============================================

/**
 * Get accessible label for Surah card
 * وصف شامل لبطاقة السورة
 */
export const getAccessibleSurahLabel = (
    surahName: string,
    englishName: string,
    surahNumber: number,
    ayahCount: number,
    revelationType: string,
    language: string
): string => {
    if (language === "ar") {
        const type = revelationType === "Meccan" ? "مكية" : "مدنية";
        return `${surahName}، السورة رقم ${surahNumber}، عدد آياتها ${ayahCount} آية، سورة ${type}. اضغط مرتين للقراءة.`;
    }
    return `Surah ${englishName}, number ${surahNumber}, ${ayahCount} verses, ${revelationType}. Double tap to read.`;
};

/**
 * Get accessible label for continue reading card
 * وصف بطاقة متابعة القراءة
 */
export const getAccessibleContinueReadingLabel = (
    surahName: string,
    ayahNumber: number | undefined,
    pageNumber: number | undefined,
    language: string
): string => {
    if (language === "ar") {
        const position = ayahNumber
            ? `عند الآية رقم ${ayahNumber}`
            : `في الصفحة ${pageNumber}`;
        return `تابع القراءة من حيث توقفت، في ${surahName}، ${position}. اضغط مرتين للاستمرار.`;
    }
    const position = ayahNumber
        ? `at Ayah ${ayahNumber}`
        : `on page ${pageNumber}`;
    return `Continue reading from where you left off, in ${surahName}, ${position}. Double tap to continue.`;
};

/**
 * Get accessible label for search input
 * وصف حقل البحث
 */
export const getAccessibleSearchLabel = (language: string): string => {
    if (language === "ar") {
        return "حقل البحث في القرآن الكريم. اكتب اسم سورة أو كلمات من آية للبحث. اضغط على زر بحث أو أدخل للبحث.";
    }
    return "Quran search field. Type surah name or ayah text to search. Press search button or enter to search.";
};

/**
 * Get accessible label for Juz card
 * وصف بطاقة الجزء
 */
export const getAccessibleJuzLabel = (
    juzNumber: number,
    startSurahName: string,
    language: string
): string => {
    if (language === "ar") {
        return `الجزء ${juzNumber}، يبدأ من ${startSurahName}. اضغط مرتين للقراءة.`;
    }
    return `Juz ${juzNumber}, starts from ${startSurahName}. Double tap to read.`;
};

// ============================================
// Navigation Accessibility - التنقل
// ============================================

/**
 * Get accessible label for navigation item
 * وصف عنصر التنقل السفلي
 */
export const getAccessibleNavLabel = (
    label: string,
    tabId: string,
    isActive: boolean,
    language: string
): string => {
    // Enhanced descriptions for each tab
    const descriptions: Record<string, { ar: string; en: string }> = {
        prayers: { ar: "مواقيت الصلاة والتنبيهات", en: "Prayer times and notifications" },
        quran: { ar: "قراءة القرآن الكريم", en: "Read the Holy Quran" },
        azkar: { ar: "أذكار الصباح والمساء وبعد الصلاة", en: "Morning, evening and post-prayer adhkar" },
        dua: { ar: "الأدعية المأثورة", en: "Authentic supplications" },
        mosques: { ar: "البحث عن المساجد القريبة", en: "Find nearby mosques" },
        qibla: { ar: "اتجاه القبلة", en: "Qibla direction compass" },
        calendar: { ar: "التقويم الهجري", en: "Hijri calendar" },
        sunnah: { ar: "صلوات النوافل والسنن الرواتب", en: "Sunnah and nawafil prayers" },
        qada: { ar: "حاسبة قضاء الصلوات الفائتة", en: "Missed prayers calculator" },
        settings: { ar: "إعدادات التطبيق", en: "App settings" },
        developer: { ar: "لوحة المطور", en: "Developer panel" },
    };

    const desc = descriptions[tabId] || { ar: label, en: label };

    if (language === "ar") {
        return isActive
            ? `${label}، ${desc.ar}، الصفحة الحالية`
            : `${label}، ${desc.ar}، اضغط مرتين للانتقال`;
    }
    return isActive
        ? `${label}, ${desc.en}, current page`
        : `${label}, ${desc.en}, double tap to navigate`;
};

// ============================================
// Live Announcements - الإعلانات الصوتية
// ============================================

/**
 * Announce message to screen reader using live region
 * إعلان رسالة للقارئ الشاشة
 */
export const announceToScreenReader = (
    message: string,
    priority: "polite" | "assertive" = "polite"
): void => {
    // Remove any existing announcer
    const existingAnnouncer = document.getElementById("sr-announcer");
    if (existingAnnouncer) {
        existingAnnouncer.remove();
    }

    // Create a live region element (hidden visually but read by screen readers)
    const announcer = document.createElement("div");
    announcer.id = "sr-announcer";
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.setAttribute("role", priority === "assertive" ? "alert" : "status");
    announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;

    document.body.appendChild(announcer);

    // Slight delay to ensure the live region is registered
    setTimeout(() => {
        announcer.textContent = message;

        // Clean up after announcement
        setTimeout(() => {
            announcer.remove();
        }, 5000);
    }, 100);
};

/**
 * Announce Azkar completion with encouragement
 * إعلان إتمام الذكر
 */
export const announceAzkarComplete = (
    dhikrText: string,
    language: string
): void => {
    const shortText = dhikrText.substring(0, 30);
    const message = language === "ar"
        ? `أحسنت! أتممت ذكر ${shortText}. جزاك الله خيراً.`
        : `Well done! Completed ${shortText}. May Allah reward you.`;
    announceToScreenReader(message, "polite");
};

/**
 * Announce all Azkar completed
 * إعلان إتمام جميع الأذكار
 */
export const announceAllAzkarComplete = (language: string): void => {
    const message = language === "ar"
        ? "ما شاء الله! أتممت جميع الأذكار. اللهم تقبل منا."
        : "Mashallah! Completed all adhkar. May Allah accept from us.";
    announceToScreenReader(message, "assertive");
};

/**
 * Announce Tasbih target reached
 * إعلان إتمام هدف التسبيح
 */
export const announceTasbihComplete = (target: number, language: string): void => {
    const message = language === "ar"
        ? `ما شاء الله! أتممت ${target} تسبيحة. الله أكبر!`
        : `Mashallah! Completed ${target} tasbih. Allahu Akbar!`;
    announceToScreenReader(message, "assertive");
};

/**
 * Announce Tasbih count at intervals
 * إعلان العد على فترات
 */
export const announceTasbihCount = (
    count: number,
    target: number,
    language: string
): void => {
    // Announce at meaningful intervals to avoid overwhelming
    const shouldAnnounce =
        count === 1 ||
        count === 10 ||
        count === 33 ||
        count === 50 ||
        count === 100 ||
        (target > 0 && count === Math.floor(target / 2)) || // Halfway
        (target > 0 && count === target - 1); // One before completion

    if (shouldAnnounce) {
        let message = "";
        if (language === "ar") {
            if (target > 0 && count === Math.floor(target / 2)) {
                message = `${count}، أكملت نصف الهدف`;
            } else if (target > 0 && count === target - 1) {
                message = `${count}، باقي تسبيحة واحدة`;
            } else {
                message = `${count}`;
            }
        } else {
            if (target > 0 && count === Math.floor(target / 2)) {
                message = `${count}, halfway there`;
            } else if (target > 0 && count === target - 1) {
                message = `${count}, one more to go`;
            } else {
                message = `${count}`;
            }
        }
        announceToScreenReader(message, "polite");
    }
};

/**
 * Announce prayer time notification
 * إعلان وقت الصلاة
 */
export const announcePrayerTime = (
    prayerName: string,
    language: string
): void => {
    const message = language === "ar"
        ? `حان الآن وقت صلاة ${prayerName}. حي على الصلاة.`
        : `It is now time for ${prayerName} prayer. Come to prayer.`;
    announceToScreenReader(message, "assertive");
};

// ============================================
// Utility: Visually Hidden Text
// ============================================

/**
 * CSS class for visually hidden but screen reader accessible content
 * استايل للنص المخفي بصرياً لكن مقروء للقارئ
 */
export const srOnlyStyle: React.CSSProperties = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
};
