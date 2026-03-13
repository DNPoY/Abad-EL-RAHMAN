import { memo } from 'react';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Heart, Share2, Copy } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";
import { cn, removeTashkil } from "@/lib/utils";
import { toast } from "sonner";
import { useFontSize } from "@/contexts/FontSizeContext";
import { Share } from '@capacitor/share';
import {
    duaForDeceasedMale,
    duaForDeceasedFemale,
    quranicDuas,
    propheticDuas,
    leavingHomeDuas,
    eventBasedDuas,
    DuaItem,
} from "@/lib/dua-data";
import { useEventDuas } from "@/hooks/useEventDuas";
import { Sparkles } from "lucide-react";

export const DuaList = memo(() => {
    const { t, language } = useLanguage();
    const { fontSize } = useFontSize();
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const { suggestedDuas } = useEventDuas();

    const getFontSizeClass = () => {
        switch (fontSize) {
            case 'small': return 'text-xl leading-loose';
            case 'medium': return 'text-2xl leading-loose';
            case 'large': return 'text-3xl leading-[2.5]';
            default: return 'text-2xl leading-loose';
        }
    };

    const allDuas = [
        ...quranicDuas,
        ...propheticDuas,
        ...duaForDeceasedMale,
        ...duaForDeceasedFemale,
        ...leavingHomeDuas,
        ...eventBasedDuas,
    ];

    const filterDuas = (duas: DuaItem[]) => {
        if (!debouncedSearchQuery) return duas;
        const query = removeTashkil(debouncedSearchQuery.toLowerCase());
        return duas.filter((dua) => {
            const normalizedArabic = removeTashkil(dua.arabic);
            return (
                normalizedArabic.includes(query) ||
                dua.translation?.toLowerCase().includes(query) ||
                dua.transliteration?.toLowerCase().includes(query)
            );
        });
    };

    const getFavoriteDuas = () => {
        return allDuas.filter((dua) => favorites.includes(dua.id));
    };

    const handleShare = async (dua: DuaItem) => {
        const text = `${dua.arabic}\n\n${dua.translation || ''}\n${dua.source || ''}`;
        try {
            await Share.share({
                title: 'Dua from Ibad Al-Rahman',
                text: text,
                dialogTitle: 'Share Dua',
            });
        } catch (err) {
            console.error('Error sharing:', err);
            // Fallback to copy if Share API fails (e.g., on desktop browsers)
            navigator.clipboard.writeText(text);
            toast.success(language === "ar" ? "تم النسخ إلى الحافظة (المشاركة غير مدعومة)" : "Copied to clipboard (Share not supported)");
        }
    };

    const handleCopy = (dua: DuaItem) => {
        const text = `${dua.arabic}\n\n${dua.translation || ''}\n${dua.source || ''}`;
        navigator.clipboard.writeText(text);
        toast.success(t.copied);
    };

    const renderDuaList = (duaList: DuaItem[]) => {
        const filteredList = filterDuas(duaList);

        if (filteredList.length === 0) {
            return (
                <div className="text-center py-8 text-muted-foreground">
                    {t.noDuasFound}
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {filteredList.map((dua, index) => (
                    <Card
                        key={dua.id}
                        className="p-6 animate-fade-in transition-all relative group shadow-sm hover:shadow-xl border-emerald-deep/5 hover:-translate-y-1 overflow-hidden"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-deep/40 hover:text-emerald-deep hover:bg-emerald-deep/5"
                                onClick={() => handleCopy(dua)}
                                title={t.copy}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-deep/40 hover:text-emerald-deep hover:bg-emerald-deep/5"
                                onClick={() => handleShare(dua)}
                                title={t.share}
                            >
                                <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-deep/40 hover:text-red-500 hover:bg-red-50"
                                onClick={() => toggleFavorite(dua.id)}
                                title={t.favorites}
                            >
                                <Heart
                                    className={cn(
                                        "w-5 h-5 transition-colors",
                                        isFavorite(dua.id) ? "fill-red-500 text-red-500" : ""
                                    )}
                                />
                            </Button>
                        </div>

                        {/* Mobile visible actions */}
                        <div className="absolute top-4 left-4 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-deep/40 hover:text-emerald-deep hover:bg-emerald-deep/5"
                                onClick={() => handleCopy(dua)}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-deep/40 hover:text-emerald-deep hover:bg-emerald-deep/5"
                                onClick={() => handleShare(dua)}
                            >
                                <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-deep/40 hover:text-red-500 hover:bg-red-50"
                                onClick={() => toggleFavorite(dua.id)}
                            >
                                <Heart
                                    className={cn(
                                        "w-5 h-5 transition-colors",
                                        isFavorite(dua.id) ? "fill-red-500 text-red-500" : ""
                                    )}
                                />
                            </Button>
                        </div>

                        <p className={`${getFontSizeClass()} font-amiri mb-4 text-right pt-8 md:pt-2 text-emerald-deep break-words`} lang="ar">
                            {dua.arabic}
                        </p>

                        <div className="flex flex-col gap-1 text-sm text-emerald-deep/60 font-amiri text-right mb-2" dir="rtl">
                            {dua.speaker && (
                                <p className="font-semibold text-emerald-deep/80">
                                    {language === "ar" ? "القائل: " : "Speaker: "}{dua.speaker}
                                </p>
                            )}
                            {dua.context && (
                                <p>
                                    {language === "ar" ? "المناسبة/المكان: " : "Context: "}{dua.context}
                                </p>
                            )}
                            {dua.source && (
                                <p>
                                    {language === "ar" ? "المصدر: " : "Source: "}{dua.source}
                                </p>
                            )}
                        </div>

                        {language === "en" && (dua.transliteration || dua.translation) && (
                            <>
                                {dua.transliteration && (
                                    <p className="text-sm text-emerald-deep/60 italic mb-2">
                                        {dua.transliteration}
                                    </p>
                                )}
                                {dua.translation && (
                                    <p className="text-sm text-emerald-deep/80">
                                        {dua.translation}
                                    </p>
                                )}
                            </>
                        )}
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <Tabs defaultValue="personal" className="w-full" dir={language === "ar" ? "rtl" : "ltr"}>
            <div className="mb-6 relative">
                <Search className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-deep/40 pointer-events-none", // Improved visibility & pointer-events
                    language === "ar" ? "right-3" : "left-3"
                )} />
                <Input
                    placeholder={t.searchPlaceholder}
                    className={cn(
                        "bg-white border-emerald-deep/10 text-emerald-deep placeholder:text-emerald-deep/30 focus:bg-white focus:ring-1 focus:ring-emerald-deep/20 transition-all text-base shadow-sm", // Enhanced styling
                        language === "ar" ? "pr-10" : "pl-10"
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <TabsList className="flex w-full justify-start overflow-x-auto mb-6 h-auto p-1 gap-2 bg-muted/50 rounded-lg no-scrollbar pb-2">
                <TabsTrigger value="personal" className="min-w-fit px-4 font-amiri text-sm py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    {t.personalDua}
                </TabsTrigger>
                <TabsTrigger value="leaving-home" className="min-w-fit px-4 font-amiri text-sm py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    {t.leavingHome}
                </TabsTrigger>
                <TabsTrigger value="deceased-male" className="min-w-fit px-4 font-amiri text-sm py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    {t.duaForDeceasedMale}
                </TabsTrigger>
                <TabsTrigger value="deceased-female" className="min-w-fit px-4 font-amiri text-sm py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    {t.duaForDeceasedFemale}
                </TabsTrigger>
                <TabsTrigger value="event-based" className="min-w-fit px-4 font-amiri text-sm py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    {t.eventBasedDua}
                </TabsTrigger>
                <TabsTrigger value="favorites" className="min-w-fit px-4 font-amiri text-sm py-2 whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Heart className="w-4 h-4 inline-block mr-2" />
                    {t.favorites}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-8">
                {suggestedDuas.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 mb-4 text-emerald-deep/80 font-amiri text-lg font-bold">
                            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                            <span>{t.suggestedForYou}</span>
                        </div>
                        {renderDuaList(suggestedDuas)}
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-amiri text-primary mb-4 border-b pb-2">
                        {t.quranicDua}
                    </h3>
                    {renderDuaList(quranicDuas)}
                </div>

                <div>
                    <h3 className="text-xl font-amiri text-primary mb-4 border-b pb-2">
                        {t.propheticDua}
                    </h3>
                    {renderDuaList(propheticDuas)}
                </div>
            </TabsContent>

            <TabsContent value="leaving-home" className="space-y-4">
                {renderDuaList(leavingHomeDuas)}
            </TabsContent>

            <TabsContent value="deceased-male" className="space-y-4">
                {renderDuaList(duaForDeceasedMale)}
            </TabsContent>

            <TabsContent value="deceased-female" className="space-y-4">
                {renderDuaList(duaForDeceasedFemale)}
            </TabsContent>

            <TabsContent value="event-based" className="space-y-4">
                {renderDuaList(eventBasedDuas)}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
                <h3 className="text-xl font-amiri text-primary mb-4 border-b pb-2">
                    {t.favoriteDuas}
                </h3>
                {renderDuaList(getFavoriteDuas())}
            </TabsContent>
        </Tabs>
    );
});
DuaList.displayName = "DuaList";
