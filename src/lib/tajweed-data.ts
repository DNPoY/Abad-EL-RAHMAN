export interface TajweedLesson {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    rules: {
        name: string;
        nameEn: string;
        definition: string;
        definitionEn: string;
        method: string;
        methodEn: string;
        letters: string;
        examples: string[];
    }[];
}

export const tajweedOrLessons: TajweedLesson[] = [
    {
        id: "nun_sakinah",
        title: "أحكام النون الساكنة والتنوين",
        titleEn: "Rules of Nun Sakinah & Tanween",
        description: "هي الأحكام التي تطبق عند التقاء النون الساكنة أو التنوين بأحد الحروف الهجائية.",
        descriptionEn: "Rules applied when a static Nun or Tanween meets one of the alphabet letters.",
        rules: [
            {
                name: "الإظهار الحلقي",
                nameEn: "Izhar halqi (Clarification)",
                definition: "إخراج النون الساكنة واضحة بدون غنة عند ملاقاة أحد حروف الحلق.",
                definitionEn: "Pronouncing the Nun clearly without Ghunnah when followed by throat letters.",
                method: "انطق النون الساكنة بوضوح من مخرجها (طرف اللسان) دون توقف أو سكت.",
                methodEn: "Pronounce the Nun clearly from the tip of the tongue without pausing or nasal sound.",
                letters: "ء هـ ع ح غ خ",
                examples: ["مَنْ آمَنَ", "عَذَابٌ أَلِيمٌ", "يَنْهَوْنَ"]
            },
            {
                name: "الإدغام",
                nameEn: "Idgham (Merging)",
                definition: "إدخال النون الساكنة في الحرف الذي يليها بحيث يصيران حرفاً واحداً مشدداً.",
                definitionEn: "Merging the Nun into the following letter so they become one stressed letter.",
                method: "تجاهل النون تماماً وانطق الحرف التالي مشدداً. (مع الغنة في: ينمو، وبدون غنة في: ل، ر).",
                methodEn: "Skip the Nun completely and pronounce the next letter with emphasis. Add Ghunnah for 'Yanmu' letters.",
                letters: "ي ر م ل و ن (يرملون)",
                examples: ["مَن يَقُولُ", "مِن رَّبِّهِمْ", "مِن مَّالٍ"]
            },
            {
                name: "الإقلاب",
                nameEn: "Iqlab (Conversion)",
                definition: "قلب النون الساكنة أو التنوين ميماً مخفاة بغنة عند ملاقاة حرف الباء.",
                definitionEn: "Changing the Nun into a hidden Meem with Ghunnah when followed by Baa.",
                method: "اقلب النون ميماً خالصة مع إطباق الشفتين بلطف (دون كز) وإطالة الغنة.",
                methodEn: "Turn Nun into a Meem, gently touching lips together, and hold the nasal sound.",
                letters: "ب",
                examples: ["مِنۢ بَعْدِ", "سَمِيعٌۢ بَصِيرٌ"]
            },
            {
                name: "الإخفاء الحقيقي",
                nameEn: "Ikhfa (Hiding)",
                definition: "نطق النون الساكنة بصفة بين الإظهار والإدغام مع بقاء الغنة.",
                definitionEn: "Pronouncing the Nun somewhere between Izhar and Idgham, retaining the Ghunnah.",
                method: "ضع طرف اللسان قريباً من مخرج الحرف التالي (دون لمسه) وأخرج الغنة من الخيشوم.",
                methodEn: "Keep tongue tip near (but not touching) the exit of the next letter, and emit Ghunnah from the nose.",
                letters: "ص ذ ث ك ج ش ق س د ط ز ف ت ض ظ (باقي الحروف)",
                examples: ["إِن كُنتُمْ", "مِن شَرِّ", "رِيحًا صَرْصَرًا"]
            }
        ]
    },
    {
        id: "meem_sakinah",
        title: "أحكام الميم الساكنة",
        titleEn: "Rules of Meem Sakinah",
        description: "هي الأحكام المتعلقة بالميم الخالية من الحركة.",
        descriptionEn: "Rules related to the static Meem (free of vowels).",
        rules: [
            {
                name: "الإخفاء الشفوي",
                nameEn: "Ikhfa Shafawi (Labial Hiding)",
                definition: "إخفاء الميم الساكنة عند ملاقاة حرف الباء مع الغنة.",
                definitionEn: "Hiding the Meem when followed by Baa, with Ghunnah.",
                method: "أطبق الشفتين على الميم بخفة وانطق الغنة قبل الانتقال للباء.",
                methodEn: "Close lips gently on Meem and produce Ghunnah before moving to Baa.",
                letters: "ب",
                examples: ["تَرْمِيهِم بِحِجَارَةٍ", "وَهُم بِالْآخِرَةِ"]
            },
            {
                name: "إدغام المتماثلين",
                nameEn: "Idgham Shafawi (Merging)",
                definition: "إدغام الميم الساكنة في ميم متحركة بعدها.",
                definitionEn: "Merging the Meem into a following moving Meem.",
                method: "أدخل الميم الأولى في الثانية وانطقهما ميماً واحدة مشددة مع الغنة.",
                methodEn: "Merge the first Meem into the second, pronouncing one stressed Meem with Ghunnah.",
                letters: "م",
                examples: ["لَهُم مَّا يَشَاءُونَ", "أَطْعَمَهُم مِّن جُوعٍ"]
            },
            {
                name: "الإظهار الشفوي",
                nameEn: "Izhar Shafawi (Labial Clarification)",
                definition: "نطق الميم الساكنة واضحة عند باقي الحروف، وأشد ما يكون عند الواو والفاء.",
                definitionEn: "Pronouncing the Meem clearly with all other letters.",
                method: "أطبق الشفتين لإخراج الميم بوضوح ثم افتحهما فوراً للحرف التالي (احذر أن تخفيها عند و، ف).",
                methodEn: "Close lips to pronounce Meem clearly, then open immediately for the next letter.",
                letters: "باقي الحروف",
                examples: ["هُمْ فِيهَا", "أَمْ لَمْ تُنذِرْهُمْ"]
            }
        ]
    },
    {
        id: "qalqalah",
        title: "القلقلة",
        titleEn: "Qalqalah (Echoing)",
        description: "اضطراب المخرج عند النطق بالحرف الساكن حتى يسمع له نبرة قوية.",
        descriptionEn: "Vibration of sound when pronouncing a static letter to create a echoing tone.",
        rules: [
            {
                name: "حروف القلقلة",
                nameEn: "Letters of Qalqalah",
                definition: "تجمع في كلمة (قطب جد).",
                definitionEn: "Gathered in the phrase (Qutb Jad).",
                method: "باعد بين طرفي عضو النطق بسرعة وقوة عند سكون هذه الحروف لتحدث نبرة (صدى).",
                methodEn: "Quickly release the articulation point when the letter is static to create an echoing sound.",
                letters: "ق ط ب ج د",
                examples: ["قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", "مُحِيطٌ", "أَحَدٌ"]
            }
        ]
    },
    {
        id: "mudd",
        title: "المدود الأساسية",
        titleEn: "Basic Mudd (Elongation)",
        description: "إطالة الصوت بحرف من حروف المد.",
        descriptionEn: "Elongating the sound of a vowel letter.",
        rules: [
            {
                name: "المد الطبيعي",
                nameEn: "Natural Mudd",
                definition: "ما لا تقوم ذات الحرف إلا به، ولا يتوقف على سبب، ومقداره حركتان.",
                definitionEn: "Standard elongation of 2 counts, used naturally without specific causes.",
                method: "أطل الصوت بمقدار حركتين (كقولك: واحد) دون زيادة أو نقصان.",
                methodEn: "Elongate the sound for 2 counts (approx. time to say 'one') without valid reasons.",
                letters: "ا و ي (بشروطها)",
                examples: ["قَالَ", "يَقُولُ", "قِيلَ"]
            },
            {
                name: "المد المتصل",
                nameEn: "Connected Mudd",
                definition: "أن يأتي حرف المد والهمز في كلمة واحدة. يمد 4 أو 5 حركات.",
                definitionEn: "When Mudd and Hamza are in the same word. Elongated 4-5 counts.",
                method: "أطل الصوت بمقدار 4 أو 5 حركات وجوباً عند ملاقاة الهمزة في نفس الكلمة.",
                methodEn: "You MUST elongate the sound for 4 or 5 counts when meeting Hamza in the same word.",
                letters: "مثل: جَاءَ",
                examples: ["السَّمَاءِ", "سُوءَ", "جِيءَ"]
            }
        ]
    }
];
