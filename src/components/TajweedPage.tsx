import { useLanguage } from "@/contexts/LanguageContext";
import { tajweedOrLessons } from "@/lib/tajweed-data";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TajweedPage = () => {
    const { language } = useLanguage();

    return (
        <div className="space-y-6 pb-24 animate-fade-in px-2">
            {/* Header */}
            <div className="flex flex-col items-center justify-center pt-4 mb-6">
                <div className="p-4 bg-emerald-deep/5 rounded-full mb-3">
                    <GraduationCap className="w-8 h-8 text-emerald-deep" />
                </div>
                <h2 className="text-2xl font-bold font-tajawal text-emerald-deep text-center">
                    {language === "ar" ? "تعلم التجويد" : "Learn Tajweed"}
                </h2>
                <p className="text-sm font-tajawal text-emerald-deep/60 text-center max-w-xs">
                    {language === "ar"
                        ? "قواعد التجويد المبسطة لتحسين تلاوتك للقرآن الكريم"
                        : "Simplified Tajweed rules to improve your Quran recitation"}
                </p>
            </div>

            <Tabs defaultValue={tajweedOrLessons[0].id} className="w-full">
                <TabsList className="flex w-full overflow-x-auto no-scrollbar justify-start mb-6 bg-transparent h-auto p-1 space-x-2 gap-2">
                    {tajweedOrLessons.map((lesson) => (
                        <TabsTrigger
                            key={lesson.id}
                            value={lesson.id}
                            className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-emerald-deep/10 data-[state=active]:bg-emerald-deep data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-tajawal"
                        >
                            {language === "ar" ? lesson.title : lesson.titleEn}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tajweedOrLessons.map((lesson) => (
                    <TabsContent key={lesson.id} value={lesson.id} className="space-y-4 animate-in slide-in-from-right-2 duration-500">
                        {/* Lesson Intro */}
                        <Card className="p-6 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white border-none shadow-lg">
                            <h3 className="text-xl font-bold font-tajawal mb-2">
                                {language === "ar" ? lesson.title : lesson.titleEn}
                            </h3>
                            <p className="text-emerald-100/80 font-tajawal leading-relaxed">
                                {language === "ar" ? lesson.description : lesson.descriptionEn}
                            </p>
                        </Card>

                        {/* Rules List */}
                        <div className="grid grid-cols-1 gap-4">
                            {lesson.rules.map((rule, idx) => (
                                <Card key={idx} className="p-5 border-emerald-deep/5 hover:border-emerald-deep/20 transition-all hover:shadow-md group bg-white/80 backdrop-blur-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-deep/10 transition-colors">
                                            <span className="font-bold text-emerald-deep text-sm">{idx + 1}</span>
                                        </div>
                                        <div className="space-y-3 w-full">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold font-tajawal text-lg text-emerald-deep">
                                                        {language === "ar" ? rule.name : rule.nameEn}
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-emerald-deep/70 mt-1 leading-relaxed font-tajawal">
                                                    <span className="font-bold">{language === "ar" ? "التعريف: " : "Definition: "}</span>
                                                    {language === "ar" ? rule.definition : rule.definitionEn}
                                                </p>
                                                <div className="mt-2 bg-emerald-50/50 p-2 rounded-md border border-emerald-100">
                                                    <p className="text-sm text-emerald-800 leading-relaxed font-tajawal">
                                                        <span className="font-bold text-emerald-600">{language === "ar" ? "كيفية النطق: " : "Method: "}</span>
                                                        {language === "ar" ? rule.method : rule.methodEn}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Letters */}
                                            <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-2 rounded-lg">
                                                <span className="text-xs font-bold text-emerald-deep/50 uppercase tracking-wider">
                                                    {language === "ar" ? "الحروف:" : "Letters:"}
                                                </span>
                                                <span className="font-amiri text-lg text-emerald-deep font-bold">
                                                    {rule.letters}
                                                </span>
                                            </div>

                                            {/* Examples */}
                                            <div className="space-y-2">
                                                <span className="text-xs font-bold text-emerald-deep/50 uppercase tracking-wider block">
                                                    {language === "ar" ? "أمثلة:" : "Examples:"}
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {rule.examples.map((ex, i) => (
                                                        <Badge key={i} variant="outline" className="text-base py-1 px-3 bg-white hover:bg-emerald-50 border-emerald-deep/10 text-emerald-deep font-quran">
                                                            {ex}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};
