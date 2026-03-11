import { useSystemLog } from "@/hooks/useSystemLog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export const HarmonyLevels = () => {
    const { getWeeklyData, currentStreak } = useSystemLog();
    const { language } = useLanguage();
    const data = getWeeklyData();

    return (
        <Card className="p-6 bg-white/50 backdrop-blur-md border-emerald-deep/10 shadow-xl rounded-[2rem] animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold font-tajawal text-emerald-deep">
                        {language === "ar" ? "مستويات التناغم" : "Harmony Levels"}
                    </h2>
                    <p className="text-sm text-emerald-deep/60">
                        {language === "ar" ? "رؤية أسبوعية لانضباطك الروحي" : "Weekly view of your spiritual discipline"}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-gold-matte">{currentStreak}</div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-deep/40 font-bold">
                        {language === "ar" ? "أيام متتالية" : "Day Streak"}
                    </div>
                </div>
            </div>

            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'currentColor', fontSize: 12 }}
                            className="text-emerald-deep/40"
                        />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-emerald-deep text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                                            {payload[0].value}%
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="level" radius={[4, 4, 4, 4]}>
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.level === 100 ? 'hsl(var(--matte-gold))' : 'hsl(var(--emerald-light))'} 
                                    opacity={entry.level === 0 ? 0.1 : 1}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
