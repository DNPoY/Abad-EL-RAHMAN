import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MAJOR_CITIES, CityData } from "@/lib/location-data";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (city: CityData) => void;
    language: string;
}

export const LocationSelector = ({ isOpen, onClose, onSelect, language }: LocationSelectorProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCities = MAJOR_CITIES.filter(city => {
        const query = searchQuery.toLowerCase();
        return (
            city.names.ar.includes(query) ||
            city.names.en.toLowerCase().includes(query) ||
            city.country.ar.includes(query) ||
            city.country.en.toLowerCase().includes(query)
        );
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-cream border-emerald-deep/10 text-emerald-deep shadow-2xl p-0 overflow-hidden rounded-[2rem]">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold font-amiri text-center">
                        {language === "ar" ? "اختر بلدك / مدينتك" : "Choose Your Location"}
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 pb-6 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-deep/40" />
                        <Input
                            placeholder={language === "ar" ? "ابحث عن مدينة..." : "Search city..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "bg-emerald-deep/5 border-none focus-visible:ring-emerald-deep/20 pl-10 h-12 rounded-xl text-lg",
                                language === 'ar' ? 'text-right' : 'text-left'
                            )}
                        />
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto no-scrollbar space-y-2 pr-1">
                        {filteredCities.map((city) => (
                            <button
                                key={city.id}
                                onClick={() => onSelect(city)}
                                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-emerald-deep/5 hover:bg-emerald-deep/5 transition-all text-right group active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-deep/5 rounded-full group-hover:bg-emerald-deep/10 transition-colors">
                                        <MapPin className="w-5 h-5 text-emerald-deep/60" />
                                    </div>
                                    <div className={cn("flex flex-col", language === 'ar' ? 'items-end' : 'items-start')}>
                                        <span className="text-lg font-bold font-tajawal text-emerald-deep">
                                            {language === "ar" ? city.names.ar : city.names.en}
                                        </span>
                                        <span className="text-xs text-emerald-deep/60">
                                            {language === "ar" ? city.country.ar : city.country.en}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs font-mono text-emerald-deep/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {city.lat.toFixed(2)}, {city.lng.toFixed(2)}
                                </div>
                            </button>
                        ))}
                        
                        {filteredCities.length === 0 && (
                            <div className="text-center py-8 text-emerald-deep/40 italic">
                                {language === "ar" ? "لا توجد نتائج مطابقة" : "No matching results"}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
