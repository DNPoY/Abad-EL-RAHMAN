import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useNotification } from "@/contexts/NotificationContext";
import { Terminal, Trash2, Plus, X, Edit2, Check, Headphones } from "lucide-react";
import { speak8D } from "@/lib/audio-8d";
import { toast } from "sonner";
import { specialDuas as originalSpecialDuas, simpleDuas as originalSimpleDuas, SpecialDua } from "@/lib/developer-data";

export const DeveloperPanel = () => {
    const { language, t } = useLanguage();
    const settings = useSettings(); // Get settings
    const { settings: notifSettings } = useNotification(); // Get notification settings

    // Editable Special Duas state (merged with original)
    const [specialDuasEdits, setSpecialDuasEdits] = useState<Record<number, SpecialDua>>(() => {
        const saved = localStorage.getItem("dev_special_duas_edits");
        return saved ? JSON.parse(saved) : {};
    });

    // Editable Simple Duas state (merged with original)
    const [simpleDuasEdits, setSimpleDuasEdits] = useState<Record<number, string>>(() => {
        const saved = localStorage.getItem("dev_simple_duas_edits");
        return saved ? JSON.parse(saved) : {};
    });

    // User-added Special Duas (distinct from original)
    const [addedSpecialDuas, setAddedSpecialDuas] = useState<SpecialDua[]>(() => {
        const saved = localStorage.getItem("dev_added_special_duas");
        return saved ? JSON.parse(saved) : [];
    });

    // Get merged duas (original + edits)
    const specialDuas = originalSpecialDuas.map((dua, idx) => specialDuasEdits[idx] || dua);
    const simpleDuas = originalSimpleDuas.map((dua, idx) => simpleDuasEdits[idx] !== undefined ? simpleDuasEdits[idx] : dua);

    // Custom Duas state
    const [customDuas, setCustomDuas] = useState<string[]>(() => {
        const saved = localStorage.getItem("dev_custom_duas");
        return saved ? JSON.parse(saved) : [];
    });
    const [newDuaText, setNewDuaText] = useState("");
    const [newDuaTitle, setNewDuaTitle] = useState("");
    const [showAddDua, setShowAddDua] = useState(false);
    const [showAddSpecialDua, setShowAddSpecialDua] = useState(false);

    // Unified editing state
    const [editingType, setEditingType] = useState<"special" | "simple" | "custom" | "added" | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [editTitle, setEditTitle] = useState("");

    // Persist edits
    useEffect(() => {
        localStorage.setItem("dev_custom_duas", JSON.stringify(customDuas));
    }, [customDuas]);

    useEffect(() => {
        localStorage.setItem("dev_special_duas_edits", JSON.stringify(specialDuasEdits));
    }, [specialDuasEdits]);

    useEffect(() => {
        localStorage.setItem("dev_simple_duas_edits", JSON.stringify(simpleDuasEdits));
    }, [simpleDuasEdits]);

    useEffect(() => {
        localStorage.setItem("dev_added_special_duas", JSON.stringify(addedSpecialDuas));
    }, [addedSpecialDuas]);

    const handleAddDua = () => {
        if (newDuaText.trim()) {
            setCustomDuas([...customDuas, newDuaText.trim()]);
            setNewDuaText("");
            setShowAddDua(false);
            toast.success("تمت إضافة الدعاء");
        }
    };

    const handleRemoveDua = (index: number) => {
        const updated = customDuas.filter((_, i) => i !== index);
        setCustomDuas(updated);
        toast.info("تم حذف الدعاء");
    };

    // Start editing any dua type
    const handleStartEdit = (type: "special" | "simple" | "custom" | "added", index: number) => {
        setEditingType(type);
        setEditingIndex(index);
        if (type === "special") {
            setEditTitle(specialDuas[index].title || "");
            setEditText(specialDuas[index].content);
        } else if (type === "simple") {
            setEditText(simpleDuas[index]);
        } else if (type === "added") {
            setEditTitle(addedSpecialDuas[index].title || "");
            setEditText(addedSpecialDuas[index].content);
        } else {
            setEditText(customDuas[index]);
        }
    };

    // Save edit for any dua type
    const handleSaveEdit = () => {
        if (editingIndex === null || !editText.trim()) return;

        if (editingType === "special") {
            setSpecialDuasEdits(prev => ({
                ...prev,
                [editingIndex]: { title: editTitle.trim() || undefined, content: editText.trim() }
            }));
            toast.success("تم تعديل الدعاء");
        } else if (editingType === "simple") {
            setSimpleDuasEdits(prev => ({
                ...prev,
                [editingIndex]: editText.trim()
            }));
            toast.success("تم تعديل الدعاء");
        } else if (editingType === "added") {
            const updated = [...addedSpecialDuas];
            updated[editingIndex] = { title: editTitle.trim() || undefined, content: editText.trim() };
            setAddedSpecialDuas(updated);
            toast.success("تم تعديل الدعاء");
        } else if (editingType === "custom") {
            const updated = [...customDuas];
            updated[editingIndex] = editText.trim();
            setCustomDuas(updated);
            toast.success("تم تعديل الدعاء");
        }
        handleCancelEdit();
    };

    const handleCancelEdit = () => {
        setEditingType(null);
        setEditingIndex(null);
        setEditText("");
        setEditTitle("");
    };

    // Add new special dua
    const handleAddSpecialDua = () => {
        if (newDuaText.trim()) {
            setAddedSpecialDuas([...addedSpecialDuas, {
                title: newDuaTitle.trim() || undefined,
                content: newDuaText.trim()
            }]);
            setNewDuaText("");
            setNewDuaTitle("");
            setShowAddSpecialDua(false);
            toast.success("تمت إضافة الدعاء");
        }
    };

    // Remove added special dua
    const handleRemoveAddedDua = (index: number) => {
        const updated = addedSpecialDuas.filter((_, i) => i !== index);
        setAddedSpecialDuas(updated);
        toast.info("تم حذف الدعاء");
    };

    // Reset a dua to original
    const handleResetDua = (type: "special" | "simple", index: number) => {
        if (type === "special") {
            setSpecialDuasEdits(prev => {
                const updated = { ...prev };
                delete updated[index];
                return updated;
            });
            toast.info("تم استعادة الدعاء الأصلي");
        } else {
            setSimpleDuasEdits(prev => {
                const updated = { ...prev };
                delete updated[index];
                return updated;
            });
            toast.info("تم استعادة الدعاء الأصلي");
        }
    };

    const handleClearStorage = () => {
        if (confirm("Are you sure you want to clear ALL local storage? This will reset the app completely.")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const handleDisableDevMode = () => {
        localStorage.removeItem("devMode");
        toast.success("Developer mode disabled. Reloading...");
        setTimeout(() => window.location.reload(), 1000);
    };

    return (
        <div className="space-y-6 p-4 animate-fade-in pb-24">
            {/* ... (Header remains same) ... */}
            <div className="flex items-center gap-3 mb-6 text-[#FFD700]">
                <Terminal className="w-8 h-8" />
                <h2>
                    عبد الرحمن
                </h2>
            </div>

            <Card className="p-6 bg-black/20 border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white">Debug Controls</h3>

                <div className="space-y-4">
                    <Button
                        onClick={async () => {
                            try {
                                toast.info("Running Scheduler Logic...");
                                const { PrayerScheduleService } = await import("@/lib/prayer-schedule-service");

                                const result = await PrayerScheduleService.scheduleAlarms({
                                    manualLatitude: settings.manualLatitude,
                                    manualLongitude: settings.manualLongitude,
                                    calculationMethod: settings.calculationMethod,
                                    madhab: settings.madhab,
                                    locationMode: settings.locationMode,
                                    notifSettings: notifSettings,
                                    preAzanReminder: settings.preAzanReminder,
                                    devMode: true,
                                    t: t,
                                    language: language as "ar" | "en"
                                });

                                console.log("Scheduler Result:", result);

                                // Show blocking alert with full details
                                alert(`Scheduler Result:\n\nSuccess: ${result.success}\nCount: ${result.count}\nReason/Error: ${result.reason || result.error || 'None'}`);

                            } catch (e) {
                                console.error(e);
                                alert(`Scheduler Crashed:\n${e.message}`);
                            }
                        }}
                        className="w-full justify-start text-white bg-green-600/50 hover:bg-green-600/70"
                    >
                        Run Scheduler & Show Result (No Reload)
                    </Button>

                    <Button
                        onClick={async () => {
                            try {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                if ((window as any).Capacitor?.isNativePlatform()) {
                                    const { default: WidgetBridge } = await import("@/lib/widget-bridge");
                                    const now = new Date();
                                    await WidgetBridge.scheduleAdhan({
                                        prayerName: "DEBUG_IMMEDIATE_" + now.getTime(),
                                        timestamp: now.getTime() + 5000,
                                        soundName: "adhan_makkah"
                                    });
                                    toast.success("Scheduled immediate test for 5s from now");
                                } else {
                                    toast.error("Not on native platform");
                                }
                            } catch (e) {
                                console.error(e);
                                toast.error("Failed to schedule");
                            }
                        }}
                        className="w-full justify-start text-white bg-blue-600/50 hover:bg-blue-600/70"
                    >
                        Force Test Immediate Azan (5s)
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start text-white border-white/20 hover:bg-white/10"
                        onClick={async () => {
                            try {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                if ((window as any).Capacitor?.isNativePlatform()) {
                                    const { default: WidgetBridge } = await import("@/lib/widget-bridge");
                                    const result = await WidgetBridge.getPendingAlarms();
                                    const logDiv = document.getElementById('dev-debug-log');
                                    if (logDiv) {
                                        if (result.alarms.length === 0) {
                                            logDiv.innerHTML = "No pending alarms found.";
                                        } else {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            logDiv.innerHTML = result.alarms.map((a: any) =>
                                                `[${a.prayerName}] ${new Date(a.timestamp).toLocaleString()} (${a.soundName})`
                                            ).join('<br/>');
                                        }
                                    }
                                    toast.success(`Found ${result.alarms.length} pending alarms`);
                                } else {
                                    toast.error("Not on native platform");
                                }
                            } catch (e) {
                                console.error(e);
                                toast.error("Failed to fetch alarms");
                            }
                        }}
                    >
                        Check Pending Alarms
                    </Button>

                    <div className="mt-2 text-xs font-mono bg-black/40 text-white/80 p-2 rounded max-h-60 overflow-auto whitespace-pre-wrap border border-white/10" id="dev-debug-log">
                        Logs will appear here...
                    </div>

                    <div className="border-t border-white/10 my-2"></div>
                    <h4 className="text-sm font-bold text-white/80">🔥 Firebase Remote Config</h4>

                    <Button
                        onClick={async () => {
                            try {
                                toast.info("Force refreshing Remote Config...");
                                const { RemoteConfigService } = await import("@/lib/remote-config");
                                await RemoteConfigService.forceRefresh();

                                // Display current values
                                const apiUrl = RemoteConfigService.getApiUrl();
                                const minVersion = RemoteConfigService.getMinVersion();
                                const seasonal = RemoteConfigService.getSeasonalConfig();

                                const logDiv = document.getElementById('dev-debug-log');
                                if (logDiv) {
                                    logDiv.innerHTML = `<b>Remote Config Values:</b><br/>
API URL: ${apiUrl}<br/>
Min Version: ${minVersion}<br/>
Seasonal Enabled: ${seasonal.enabled}<br/>
Seasonal Event: ${seasonal.event_name || 'None'}`;
                                }
                                toast.success("Remote Config refreshed!");
                            } catch (e) {
                                console.error(e);
                                toast.error("Failed to refresh Remote Config");
                            }
                        }}
                        className="w-full justify-start text-white bg-orange-600/50 hover:bg-orange-600/70"
                    >
                        🔄 Force Refresh Remote Config (Bypass Cache)
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start text-white border-white/20 hover:bg-white/10"
                        onClick={async () => {
                            try {
                                const { RemoteConfigService } = await import("@/lib/remote-config");
                                const apiUrl = RemoteConfigService.getApiUrl();
                                const minVersion = RemoteConfigService.getMinVersion();
                                const seasonal = RemoteConfigService.getSeasonalConfig();
                                const msgAr = RemoteConfigService.getForceUpdateMessage("ar");

                                const logDiv = document.getElementById('dev-debug-log');
                                if (logDiv) {
                                    logDiv.innerHTML = `<b>Current Remote Config:</b><br/>
prayer_api_url: ${apiUrl}<br/>
min_required_version: ${minVersion}<br/>
force_update_message_ar: ${msgAr}<br/>
seasonal_config.enabled: ${seasonal.enabled}<br/>
seasonal_config.event_name: ${seasonal.event_name || 'None'}<br/>
seasonal_config.home_banner_text_ar: ${seasonal.home_banner_text_ar || 'None'}`;
                                }
                                toast.success("Displayed current Remote Config values");
                            } catch (e) {
                                console.error(e);
                                toast.error("Failed to read Remote Config");
                            }
                        }}
                    >
                        📋 Show Current Remote Config Values
                    </Button>

                    <div className="border-t border-white/10 my-2"></div>

                    <Button
                        variant="destructive"
                        className="w-full justify-start"
                        onClick={handleClearStorage}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Local Storage (Reset App)
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start text-white border-white/20 hover:bg-white/10"
                        onClick={handleDisableDevMode}
                    >
                        Disable Developer Mode
                    </Button>
                </div>
            </Card>



            <Card className="p-6 bg-black/20 border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white">App Info</h3>
                <div className="space-y-2 text-sm text-white/70 font-mono">
                    <p>Version: 1.0.0 (Beta)</p>
                    <p>Build: Production</p>
                    <p>Platform: Capacitor / Web</p>
                </div>
            </Card>

            <Card className="p-6 bg-white/95 border-emerald-900/10 shadow-sm">
                <h3 className="text-lg font-bold mb-6 text-emerald-900 border-b border-emerald-900/10 pb-2 font-tajawal">أدعية خاصة</h3>
                <div className="space-y-6 text-right" dir="rtl">
                    {specialDuas.map((dua, idx) => (
                        <div key={`special-${idx}`} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-900/5 text-emerald-900 shadow-sm relative">
                            {editingType === "special" && editingIndex === idx ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="عنوان الدعاء (اختياري)"
                                        className="w-full p-3 rounded-lg border border-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-amiri text-lg text-right"
                                        dir="rtl"
                                    />
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-amiri text-lg text-right resize-none h-40"
                                        dir="rtl"
                                        autoFocus
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="bg-emerald-deep hover:bg-emerald-deep/90 text-white rounded-lg px-3 py-1.5 flex items-center gap-1 text-sm"
                                        >
                                            <Check className="w-4 h-4" />
                                            حفظ
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-3 py-1.5 text-sm"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {dua.title && (
                                        <h4 className="font-bold text-lg mb-3 text-gold-matte font-amiri">{dua.title}</h4>
                                    )}
                                    <p className="font-amiri text-xl leading-loose whitespace-pre-line">{dua.content}</p>
                                    <div className="absolute top-2 left-2 flex gap-1">
                                        <button
                                            onClick={() => handleStartEdit("special", idx)}
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-1.5"
                                            title="تعديل"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                                {dua.title?.includes("Handover") && (
                                                    <button
                                                        onClick={() => speak8D(dua.content, language === 'ar' ? 'ar-SA' : 'en-US')}
                                                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-full p-1.5"
                                                        title="Play 8D Audio"
                                                    >
                                                        <Headphones className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {specialDuasEdits[idx] && (
                                                    <button
                                                        onClick={() => handleResetDua("special", idx)}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1.5"
                                                        title="استعادة الأصلي"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {/* Added Special Duas with "مضاف" badge */}
                    {addedSpecialDuas.map((dua, idx) => (
                        <div key={`added-${idx}`} className="p-4 bg-amber-50/70 rounded-xl border-2 border-amber-300 text-emerald-900 shadow-sm relative">
                            {/* Badge */}
                            <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full font-tajawal">
                                مضاف ✨
                            </span>
                            {editingType === "added" && editingIndex === idx ? (
                                <div className="space-y-3 mt-6">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="عنوان الدعاء (اختياري)"
                                        className="w-full p-3 rounded-lg border border-amber-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-amiri text-lg text-right"
                                        dir="rtl"
                                    />
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-amber-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-amiri text-lg text-right resize-none h-40"
                                        dir="rtl"
                                        autoFocus
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="bg-emerald-deep hover:bg-emerald-deep/90 text-white rounded-lg px-3 py-1.5 flex items-center gap-1 text-sm"
                                        >
                                            <Check className="w-4 h-4" />
                                            حفظ
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-3 py-1.5 text-sm"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6">
                                    {dua.title && (
                                        <h4 className="font-bold text-lg mb-3 text-amber-700 font-amiri">{dua.title}</h4>
                                    )}
                                    <p className="font-amiri text-xl leading-loose whitespace-pre-line">{dua.content}</p>
                                    <div className="absolute top-2 left-2 flex gap-1">
                                        <button
                                            onClick={() => handleStartEdit("added", idx)}
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-1.5"
                                            title="تعديل"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleRemoveAddedDua(idx)}
                                            className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1.5"
                                            title="حذف"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add New Special Dua Button/Form */}
                    <div className="pt-2">
                        {!showAddSpecialDua ? (
                            <Button
                                onClick={() => setShowAddSpecialDua(true)}
                                variant="outline"
                                className="w-full border-dashed border-2 border-amber-400/50 text-amber-700 hover:bg-amber-50"
                            >
                                <Plus className="w-4 h-4 me-2" />
                                إضافة دعاء جديد
                            </Button>
                        ) : (
                            <div className="space-y-3 p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                                <input
                                    type="text"
                                    value={newDuaTitle}
                                    onChange={(e) => setNewDuaTitle(e.target.value)}
                                    placeholder="عنوان الدعاء (اختياري)"
                                    className="w-full p-3 rounded-lg border border-amber-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-amiri text-lg text-right"
                                    dir="rtl"
                                />
                                <textarea
                                    value={newDuaText}
                                    onChange={(e) => setNewDuaText(e.target.value)}
                                    placeholder="اكتب الدعاء هنا..."
                                    className="w-full p-4 rounded-xl border border-amber-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-amiri text-lg text-right resize-none h-32"
                                    dir="rtl"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAddSpecialDua}
                                        disabled={!newDuaText.trim()}
                                        className="flex-1 bg-amber-600 hover:bg-amber-700"
                                    >
                                        <Plus className="w-4 h-4 me-2" />
                                        إضافة
                                    </Button>
                                    <Button
                                        onClick={() => { setShowAddSpecialDua(false); setNewDuaText(""); setNewDuaTitle(""); }}
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        إلغاء
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-emerald-900/10 pt-4 mt-4">
                        <h4 className="font-bold text-md mb-4 text-emerald-800 font-tajawal">أدعية مختصرة</h4>
                        {simpleDuas.map((dua, idx) => (
                            <div key={`simple-${idx}`} className="p-3 mb-2 bg-emerald-50/30 rounded-lg border border-emerald-900/5 text-emerald-900 font-amiri text-lg leading-relaxed relative">
                                {editingType === "simple" && editingIndex === idx ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="w-full p-3 rounded-lg border border-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-amiri text-lg text-right resize-none h-24"
                                            dir="rtl"
                                            autoFocus
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="bg-emerald-deep hover:bg-emerald-deep/90 text-white rounded-lg px-3 py-1.5 flex items-center gap-1 text-sm"
                                            >
                                                <Check className="w-4 h-4" />
                                                حفظ
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-3 py-1.5 text-sm"
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span>{dua}</span>
                                        <div className="absolute top-2 left-2 flex gap-1">
                                            <button
                                                onClick={() => handleStartEdit("simple", idx)}
                                                className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-1"
                                                title="تعديل"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {simpleDuasEdits[idx] !== undefined && (
                                                <button
                                                    onClick={() => handleResetDua("simple", idx)}
                                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1"
                                                    title="استعادة الأصلي"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Custom Duas Section */}
                    {customDuas.length > 0 && (
                        <div className="border-t border-emerald-900/10 pt-4 mt-4">
                            <h4 className="font-bold text-md mb-4 text-amber-700 font-tajawal">أدعيتي الخاصة</h4>
                            {customDuas.map((dua, idx) => (
                                <div key={`custom-${idx}`} className="p-3 mb-2 bg-amber-50/50 rounded-lg border border-amber-200 text-emerald-900 font-amiri text-lg leading-relaxed relative">
                                    {editingType === "custom" && editingIndex === idx ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="w-full p-3 rounded-lg border border-amber-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-amiri text-lg text-right resize-none h-24"
                                                dir="rtl"
                                                autoFocus
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="bg-emerald-deep hover:bg-emerald-deep/90 text-white rounded-lg px-3 py-1.5 flex items-center gap-1 text-sm"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    حفظ
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-3 py-1.5 text-sm"
                                                >
                                                    إلغاء
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="whitespace-pre-line">{dua}</p>
                                            <div className="absolute top-2 left-2 flex gap-1">
                                                <button
                                                    onClick={() => handleStartEdit("custom", idx)}
                                                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-1"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveDua(idx)}
                                                    className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Custom Dua */}
                    <div className="border-t border-emerald-900/10 pt-4 mt-4">
                        {!showAddDua ? (
                            <Button
                                onClick={() => setShowAddDua(true)}
                                variant="outline"
                                className="w-full border-dashed border-2 border-emerald-deep/30 text-emerald-deep hover:bg-emerald-50"
                            >
                                <Plus className="w-4 h-4 me-2" />
                                إضافة دعاء جديد
                            </Button>
                        ) : (
                            <div className="space-y-3">
                                <textarea
                                    value={newDuaText}
                                    onChange={(e) => setNewDuaText(e.target.value)}
                                    placeholder="اكتب الدعاء هنا..."
                                    className="w-full p-4 rounded-xl border border-emerald-deep/20 focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep font-amiri text-lg text-right resize-none h-32"
                                    dir="rtl"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAddDua}
                                        disabled={!newDuaText.trim()}
                                        className="flex-1 bg-emerald-deep hover:bg-emerald-deep/90"
                                    >
                                        <Plus className="w-4 h-4 me-2" />
                                        إضافة
                                    </Button>
                                    <Button
                                        onClick={() => { setShowAddDua(false); setNewDuaText(""); }}
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        إلغاء
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
