import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { removeTashkil } from "@/lib/utils";

interface NameOfAllah {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: {
    en: string;
    ar: string;
  };
}

const asmaUlHusnaList: NameOfAllah[] = [
  { id: 1, arabic: "الرَّحْمَانُ", transliteration: "Ar-Rahman", meaning: { en: "The Beneficent", ar: "الكثير الرحمة" } },
  { id: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: { en: "The Merciful", ar: "دائم الرحمة" } },
  { id: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: { en: "The King", ar: "المالك لجميع الأشياء" } },
  { id: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: { en: "The Most Sacred", ar: "المنزه عن النقائص" } },
  { id: 5, arabic: "السَّلاَمُ", transliteration: "As-Salam", meaning: { en: "The Source of Peace", ar: "الذي سلم من العيوب" } },
  { id: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: { en: "The Infuser of Faith", ar: "الذي صدق وعده" } },
  { id: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: { en: "The Preserver of Safety", ar: "الرقيب الحافظ" } },
  { id: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: { en: "The All Mighty", ar: "الغالب الذي لا يغلب" } },
  { id: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: { en: "The Compeller", ar: "الذي تنفذ مشيئته" } },
  { id: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: { en: "The Supreme", ar: "المنفرد بالعظمة والكبرياء" } },
  { id: 11, arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", meaning: { en: "The Creator", ar: "الموجد للأشياء من العدم" } },
  { id: 12, arabic: "الْبَارِئُ", transliteration: "Al-Bari", meaning: { en: "The Evolver", ar: "المميز لمخلوقاته" } },
  { id: 13, arabic: "الْمُصَوِّرُ", transliteration: "Al-Musawwir", meaning: { en: "The Fashioner", ar: "الذي صور جميع الموجودات" } },
  { id: 14, arabic: "الْغَفَّارُ", transliteration: "Al-Ghaffar", meaning: { en: "The Constant Forgiver", ar: "الكثير المغفرة" } },
  { id: 15, arabic: "الْقَهَّارُ", transliteration: "Al-Qahhar", meaning: { en: "The All-Compelling Subduer", ar: "الذي قهر جميع المخلوقات" } },
  { id: 16, arabic: "الْوَهَّابُ", transliteration: "Al-Wahhab", meaning: { en: "The Bestower", ar: "المتفضل بالعطايا" } },
  { id: 17, arabic: "الرَّزَّاقُ", transliteration: "Ar-Razzaq", meaning: { en: "The Ever-Providing", ar: "خالق الأرزاق ومتكفلها" } },
  { id: 18, arabic: "الْفَتَّاحُ", transliteration: "Al-Fattah", meaning: { en: "The Supreme Solver", ar: "الذي يفتح مغاليق الأمور" } },
  { id: 19, arabic: "اَلْعَلِيْمُ", transliteration: "Al-Aleem", meaning: { en: "The All-Knowing", ar: "الذي يعلم كل شيء" } },
  { id: 20, arabic: "الْقَابِضُ", transliteration: "Al-Qaabidh", meaning: { en: "The Withholder", ar: "الممسك للرزق عمن يشاء" } },
  { id: 21, arabic: "الْبَاسِطُ", transliteration: "Al-Baasit", meaning: { en: "The Expander", ar: "الموسع للرزق لمن يشاء" } },
  { id: 22, arabic: "الْخَافِضُ", transliteration: "Al-Khaafidh", meaning: { en: "The Abaser", ar: "الذي يخفض الكفار" } },
  { id: 23, arabic: "الرَّافِعُ", transliteration: "Ar-Raafi'", meaning: { en: "The Exalter", ar: "الذي يرفع درجات المؤمنين" } },
  { id: 24, arabic: "الْمُعِزُّ", transliteration: "Al-Mu'izz", meaning: { en: "The Giver of Honors", ar: "الذي يهب العز لمن يشاء" } },
  { id: 25, arabic: "المُذِلُّ", transliteration: "Al-Muzil", meaning: { en: "The Dishonorer", ar: "الذي يذل من يشاء" } },
  { id: 26, arabic: "السَّمِيعُ", transliteration: "As-Sami'", meaning: { en: "The All-Hearing", ar: "الذي لا يخفى عليه صوت" } },
  { id: 27, arabic: "الْبَصِيرُ", transliteration: "Al-Baseer", meaning: { en: "The All-Seeing", ar: "الذي يرى كل شيء" } },
  { id: 28, arabic: "الْحَكَمُ", transliteration: "Al-Hakam", meaning: { en: "The Judge", ar: "الذي يفصل بين الخلق" } },
  { id: 29, arabic: "الْعَدْلُ", transliteration: "Al-Adl", meaning: { en: "The Just", ar: "المنزه عن الظلم" } },
  { id: 30, arabic: "اللَّطِيفُ", transliteration: "Al-Lateef", meaning: { en: "The Subtle One", ar: "الخبير بدقائق الأمور" } },
  { id: 31, arabic: "الْخَبِيرُ", transliteration: "Al-Khabeer", meaning: { en: "The All-Aware", ar: "العالم ببواطن الأشياء" } },
  { id: 32, arabic: "الْحَلِيمُ", transliteration: "Al-Haleem", meaning: { en: "The Forbearing", ar: "الذي لا يعجل بالعقوبة" } },
  { id: 33, arabic: "الْعَظِيمُ", transliteration: "Al-Azeem", meaning: { en: "The Magnificent", ar: "بالغ العظمة" } },
  { id: 34, arabic: "الْغَفُورُ", transliteration: "Al-Ghafoor", meaning: { en: "The Great Forgiver", ar: "الذي يستر الذنوب" } },
  { id: 35, arabic: "الشَّكُورُ", transliteration: "Ash-Shakoor", meaning: { en: "The Rewarder of Thankfulness", ar: "الذي يضاعف الثواب" } },
  { id: 36, arabic: "الْعَلِيُّ", transliteration: "Al-Ali", meaning: { en: "The Highest", ar: "المرتفع قدراً ومكانة" } },
  { id: 37, arabic: "الْكَبِيرُ", transliteration: "Al-Kabeer", meaning: { en: "The Greatest", ar: "العظيم الجليل" } },
  { id: 38, arabic: "الْحَفِيظُ", transliteration: "Al-Hafiz", meaning: { en: "The Preserver", ar: "الذي يحفظ كل شيء" } },
  { id: 39, arabic: "المُقيِت", transliteration: "Al-Muqeet", meaning: { en: "The Nourisher", ar: "خالق الأقوات" } },
  { id: 40, arabic: "الْحَسِيبُ", transliteration: "Al-Haseeb", meaning: { en: "The Reckoner", ar: "الكافي للمتوكلين" } },
  { id: 41, arabic: "الْجَلِيلُ", transliteration: "Al-Jaleel", meaning: { en: "The Majestic", ar: "المتصف بصفات الجلال" } },
  { id: 42, arabic: "الْكَرِيمُ", transliteration: "Al-Kareem", meaning: { en: "The Generous", ar: "الكثير الخير" } },
  { id: 43, arabic: "الرَّقِيبُ", transliteration: "Ar-Raqeeb", meaning: { en: "The Watchful", ar: "الملاحظ لما يصدر من خلقه" } },
  { id: 44, arabic: "الْمُجِيبُ", transliteration: "Al-Mujeeb", meaning: { en: "The Responsive", ar: "الذي يجيب الدعاء" } },
  { id: 45, arabic: "الْوَاسِعُ", transliteration: "Al-Waasi'", meaning: { en: "The All-Encompassing", ar: "الذي وسع كل شيء" } },
  { id: 46, arabic: "الْحَكِيمُ", transliteration: "Al-Hakeem", meaning: { en: "The All-Wise", ar: "المنزه عن العبث" } },
  { id: 47, arabic: "الْوَدُودُ", transliteration: "Al-Wadood", meaning: { en: "The Loving", ar: "المحب لعباده الصالحين" } },
  { id: 48, arabic: "الْمَجِيدُ", transliteration: "Al-Majeed", meaning: { en: "The Glorious", ar: "الواسع الكرم" } },
  { id: 49, arabic: "الْبَاعِثُ", transliteration: "Al-Ba'ith", meaning: { en: "The Resurrecter", ar: "محيي الموتى" } },
  { id: 50, arabic: "الشَّهِيدُ", transliteration: "Ash-Shaheed", meaning: { en: "The Witness", ar: "المطلع على كل شيء" } },
  { id: 51, arabic: "الْحَقُّ", transliteration: "Al-Haqq", meaning: { en: "The Truth", ar: "الذي لا ريب فيه" } },
  { id: 52, arabic: "الْوَكِيلُ", transliteration: "Al-Wakeel", meaning: { en: "The Trustee", ar: "المتكفل بأمور خلقه" } },
  { id: 53, arabic: "الْقَوِيُّ", transliteration: "Al-Qawee", meaning: { en: "The Possessor of All Strength", ar: "التام القدرة" } },
  { id: 54, arabic: "الْمَتِينُ", transliteration: "Al-Mateen", meaning: { en: "The Firm", ar: "الشديد القوة" } },
  { id: 55, arabic: "الْوَلِيُّ", transliteration: "Al-Walee", meaning: { en: "The Protecting Friend", ar: "الناصر والمحب" } },
  { id: 56, arabic: "الْحَمِيدُ", transliteration: "Al-Hameed", meaning: { en: "The Praiseworthy", ar: "المستحق للحمد" } },
  { id: 57, arabic: "الْمُحْصِي", transliteration: "Al-Muhsee", meaning: { en: "The Accounter", ar: "الذي أحصى كل شيء" } },
  { id: 58, arabic: "الْمُبْدِئُ", transliteration: "Al-Mubdi", meaning: { en: "The Originator", ar: "الذي بدأ الخلق" } },
  { id: 59, arabic: "الْمُعِيدُ", transliteration: "Al-Mu'eed", meaning: { en: "The Restorer", ar: "الذي يعيد الخلق بعد الحياة" } },
  { id: 60, arabic: "الْمُحْيِي", transliteration: "Al-Muhyee", meaning: { en: "The Giver of Life", ar: "خالق الحياة" } },
  { id: 61, arabic: "اَلْمُمِيتُ", transliteration: "Al-Mumeet", meaning: { en: "The Bringer of Death", ar: "مقدر الموت على الخلائق" } },
  { id: 62, arabic: "الْحَيُّ", transliteration: "Al-Hayy", meaning: { en: "The Ever Living", ar: "الدائم البقاء" } },
  { id: 63, arabic: "الْقَيُّومُ", transliteration: "Al-Qayyoom", meaning: { en: "The Self-Subsisting", ar: "المستغني بنفسه" } },
  { id: 64, arabic: "الْوَاجِدُ", transliteration: "Al-Waajid", meaning: { en: "The Finder", ar: "الذي لا يعوزه شيء" } },
  { id: 65, arabic: "الْمَاجِدُ", transliteration: "Al-Maajid", meaning: { en: "The Glorious", ar: "له الكمال المتناهي" } },
  { id: 66, arabic: "الْواحِدُ", transliteration: "Al-Waahid", meaning: { en: "The Unique", ar: "المنفرد بلا شريك" } },
  { id: 67, arabic: "اَلاَحَدُ", transliteration: "Al-Ahad", meaning: { en: "The One", ar: "الفرد الذي لا نظير له" } },
  { id: 68, arabic: "الصَّمَدُ", transliteration: "As-Samad", meaning: { en: "The Eternal", ar: "المقصود في الحوائج" } },
  { id: 69, arabic: "الْقَادِرُ", transliteration: "Al-Qaadir", meaning: { en: "The Able", ar: "الذي يقدر على كل شيء" } },
  { id: 70, arabic: "الْمُقْتَدِرُ", transliteration: "Al-Muqtadir", meaning: { en: "The Powerful", ar: "المقتدر على ما يشاء" } },
  { id: 71, arabic: "الْمُقَدِّمُ", transliteration: "Al-Muqaddim", meaning: { en: "The Expediter", ar: "الذي يقدم الأشياء" } },
  { id: 72, arabic: "الْمُؤَخِّرُ", transliteration: "Al-Mu'akhkhir", meaning: { en: "The Delayer", ar: "الذي يؤخر الأشياء" } },
  { id: 73, arabic: "الأوَّلُ", transliteration: "Al-Awwal", meaning: { en: "The First", ar: "الذي ليس قبله شيء" } },
  { id: 74, arabic: "الآخِرُ", transliteration: "Al-Akhir", meaning: { en: "The Last", ar: "الذي ليس بعده شيء" } },
  { id: 75, arabic: "الظَّاهِرُ", transliteration: "Az-Zaahir", meaning: { en: "The Manifest", ar: "الظاهر بالأدلة" } },
  { id: 76, arabic: "الْبَاطِنُ", transliteration: "Al-Baatin", meaning: { en: "The Hidden", ar: "المحتجب عن الأبصار" } },
  { id: 77, arabic: "الْوَالِي", transliteration: "Al-Waali", meaning: { en: "The Patron", ar: "المالك للأشياء" } },
  { id: 78, arabic: "الْمُتَعَالِي", transliteration: "Al-Muta'ali", meaning: { en: "The Supremely Exalted", ar: "المنزه عن صفات الخلق" } },
  { id: 79, arabic: "الْبَرُّ", transliteration: "Al-Barr", meaning: { en: "The Good", ar: "العطوف على عباده" } },
  { id: 80, arabic: "التَّوَابُ", transliteration: "At-Tawwaab", meaning: { en: "The Ever Returning", ar: "الذي يقبل التوبة" } },
  { id: 81, arabic: "الْمُنْتَقِمُ", transliteration: "Al-Muntaqim", meaning: { en: "The Avenger", ar: "الذي يعاقب الطغاة" } },
  { id: 82, arabic: "العَفُوُّ", transliteration: "Al-'Afuww", meaning: { en: "The Pardoner", ar: "الذي يمحو السيئات" } },
  { id: 83, arabic: "الرَّؤُوفُ", transliteration: "Ar-Ra'oof", meaning: { en: "The Kind", ar: "البالغ الرأفة" } },
  { id: 84, arabic: "مَالِكُ الْمُلْكِ", transliteration: "Maalik-ul-Mulk", meaning: { en: "The Owner of all Sovereignty", ar: "المتصرف في ملكه كيف يشاء" } },
  { id: 85, arabic: "ذُوالْجَلاَلِ وَالإكْرَامِ", transliteration: "Zul-Jalaali Wal-Ikraam", meaning: { en: "The Lord of Majesty and Bounty", ar: "صاحب العظمة والكبرياء" } },
  { id: 86, arabic: "الْمُقْسِطُ", transliteration: "Al-Muqsit", meaning: { en: "The Equitable", ar: "العادل في حكمه" } },
  { id: 87, arabic: "الْجَامِعُ", transliteration: "Al-Jaami'", meaning: { en: "The Gatherer", ar: "الذي يجمع الخلائق ليوم الحساب" } },
  { id: 88, arabic: "الْغَنِيُّ", transliteration: "Al-Ghanee", meaning: { en: "The Self-Sufficient", ar: "الذي لا يحتاج إلى شيء" } },
  { id: 89, arabic: "الْمُغْنِي", transliteration: "Al-Mughnee", meaning: { en: "The Enricher", ar: "المعطي للرزق" } },
  { id: 90, arabic: "اَلْمَانِعُ", transliteration: "Al-Maani'", meaning: { en: "The Preventer", ar: "الذي يمنع من يشاء" } },
  { id: 91, arabic: "الضَّارَّ", transliteration: "Ad-Daarr", meaning: { en: "The Distresser", ar: "المقدر للضرر على من يشاء" } },
  { id: 92, arabic: "النَّافِعُ", transliteration: "An-Naafi'", meaning: { en: "The Propitious", ar: "المقدر للنفع لمن يشاء" } },
  { id: 93, arabic: "النُّورُ", transliteration: "An-Noor", meaning: { en: "The Light", ar: "الهادي الظاهر" } },
  { id: 94, arabic: "الْهَادِي", transliteration: "Al-Haadi", meaning: { en: "The Guide", ar: "الذي يهدي القلوب" } },
  { id: 95, arabic: "الْبَدِيعُ", transliteration: "Al-Badee'", meaning: { en: "The Incomparable", ar: "الذي أبدع الأشياء كلها" } },
  { id: 96, arabic: "اَلْبَاقِي", transliteration: "Al-Baaqi", meaning: { en: "The Everlasting", ar: "الباقي بعد فناء الخلق" } },
  { id: 97, arabic: "الْوَارِثُ", transliteration: "Al-Waarith", meaning: { en: "The Supreme Inheritor", ar: "الباقي بعد فناء الخلائق" } },
  { id: 98, arabic: "الرَّشِيدُ", transliteration: "Ar-Rasheed", meaning: { en: "The Guide to the Right Path", ar: "الذي أرشد الخلق" } },
  { id: 99, arabic: "الصَّبُورُ", transliteration: "As-Saboor", meaning: { en: "The Patient", ar: "الذي لا يعجل بالعقوبة" } },
];

export function AsmaUlHusna() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNames = asmaUlHusnaList.filter((name) => {
    const normalizedSearch = removeTashkil(searchTerm.toLowerCase());
    return (
      removeTashkil(name.arabic).includes(normalizedSearch) ||
      name.transliteration.toLowerCase().includes(normalizedSearch) ||
      name.meaning.en.toLowerCase().includes(normalizedSearch) ||
      removeTashkil(name.meaning.ar).includes(normalizedSearch)
    );
  });

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-emerald-deep/5 mt-4">
        <h2 className="text-2xl font-bold text-emerald-deep text-center font-amiri mb-2">
          {language === "ar" ? "أسماء الله الحسنى" : "Names of Allah"}
        </h2>
        <p className="text-center text-emerald-deep/70 text-sm mb-6 max-w-md mx-auto">
          {language === "ar"
            ? "\"وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا\""
            : "\"And to Allah belong the best names, so invoke Him by them.\""}
        </p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" aria-hidden="true">
            <Search className="w-5 h-5 text-emerald-deep/40" />
          </div>
          <input
            type="text"
            role="searchbox"
            aria-label={language === "ar" ? "البحث في أسماء الله الحسنى" : "Search Names of Allah"}
            placeholder={language === "ar" ? "ابحث عن اسم، معنى..." : "Search name, meaning..."}
            className="w-full pl-4 pr-10 py-3 bg-white/50 border border-emerald-deep/10 rounded-2xl text-emerald-deep placeholder:text-emerald-deep/40 focus:outline-none focus:ring-2 focus:ring-emerald-deep/20 transition-all font-tajawal text-right dir-rtl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            dir={language === "ar" ? "rtl" : "ltr"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label={language === "ar" ? "قائمة أسماء الله الحسنى" : "List of Names of Allah"}>
        {filteredNames.map((name, index) => (
          <motion.div
            key={name.id}
            role="listitem"
            tabIndex={0}
            aria-label={language === "ar" ? `${name.arabic}، رقم ${name.id}. المعنى: ${name.meaning.ar}` : `${name.transliteration}, number ${name.id}. Meaning: ${name.meaning.en}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(9,66,49,0.05)] border border-emerald-deep/5 relative overflow-hidden group flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-emerald-deep focus:outline-none cursor-pointer"
          >
            {/* Background number */}
            <div className="absolute -left-4 -bottom-4 text-[100px] font-bold text-emerald-deep/[0.03] leading-none select-none z-0" aria-hidden="true">
              {name.id}
            </div>

            <div className="flex justify-between items-start relative z-10 mb-4">
              <span className="text-xs font-bold text-gold-matte/80 bg-gold-matte/10 px-2 py-1 rounded-lg">
                {name.id}
              </span>
              <h3 className="text-3xl font-amiri text-emerald-deep group-hover:text-emerald-600 transition-colors">
                {name.arabic}
              </h3>
            </div>

            <div className="space-y-2 relative z-10 text-right">
              <p className="font-medium text-emerald-900/80 text-sm">
                {language === "ar" ? name.meaning.ar : name.meaning.en}
              </p>
              {language !== "ar" && (
                <p className="text-emerald-deep/60 text-xs italic">
                  {name.transliteration}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNames.length === 0 && (
        <div className="text-center text-emerald-deep/60 py-10 font-tajawal">
          {language === "ar" ? "لم يتم العثور على نتائج" : "No results found"}
        </div>
      )}
    </div>
  );
}
