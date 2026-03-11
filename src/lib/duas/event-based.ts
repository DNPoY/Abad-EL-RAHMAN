import { DuaItem } from "./types";

export const eventBasedDuas: DuaItem[] = [
    // --- المطر والطقس ---
    {
        id: "ev_rain_1",
        category: "event-based",
        arabic: "اللهم صيباً نافعاً",
        translation: "O Allah, may it be a beneficial rain.",
        transliteration: "Allahumma sayyiban nafi'a.",
        source: "صحيح البخاري",
        context: "عند نزول المطر"
    },
    {
        id: "ev_rain_2",
        category: "event-based",
        arabic: "اللهم حوالينا ولا علينا، اللهم على الآكام والظراب وبطون الأودية ومنابت الشجر",
        translation: "O Allah, around us and not upon us. O Allah, upon the plateaus, the small hills, the bottoms of the valleys, and the plantations of trees.",
        transliteration: "Allahumma hawalayna wa la 'alayna. Allahumma 'alal-akami wad-dirabi wa butunil-awdiyati wa manabitish-shajar.",
        source: "صحيح البخاري",
        context: "عند اشتداد المطر والخوف منه"
    },
    {
        id: "ev_rain_3",
        category: "event-based",
        arabic: "مطرنا بفضل الله ورحمته",
        translation: "We have been given rain by the grace and mercy of Allah.",
        transliteration: "Mutirna bi-fadlillahi wa rahmatih.",
        source: "صحيح البخاري",
        context: "بعد نزول المطر"
    },
    {
        id: "ev_thunder",
        category: "event-based",
        arabic: "سبحان الذي يسبح الرعد بحمده والملائكة من خيفته",
        translation: "Glory is to Him Whom the thunder glorifies with His praise, as do the angels from fear of Him.",
        transliteration: "Subhanal-ladhi yusabbihur-ra'du bi-hamdihi wal-mala'ikatu min khifatih.",
        source: "الموطأ",
        context: "عند سماع الرعد"
    },
    {
        id: "ev_wind",
        category: "event-based",
        arabic: "اللهم إني أسألك خيرها وخير ما فيها وخير ما أرسلت به، وأعوذ بك من شرها وشر ما فيها وشر ما أرسلت به",
        translation: "O Allah, I ask You for its good, the good within it, and the good with which it was sent. And I seek refuge in You from its evil, the evil within it, and the evil with which it was sent.",
        transliteration: "Allahumma inni as'aluka khayraha wa khayra ma fiha wa khayra ma ursilat bih, wa a'udhu bika min sharriha wa sharri ma fiha wa sharri ma ursilat bih.",
        source: "صحيح مسلم",
        context: "عند هبوب الريح"
    },

    // --- الأحداث الفلكية ---
    {
        id: "ev_eclipse",
        category: "event-based",
        arabic: "اللهم إنا نستغفرك ونتوب إليك.. اللهم اجعل هذا الكسوف رحمة منك ولا تجعله عذاباً",
        translation: "O Allah, we seek Your forgiveness and repent to You. O Allah, make this eclipse a mercy from You and do not make it a punishment.",
        context: "عند الكسوف والخسوف"
    },
    {
        id: "ev_hilal",
        category: "event-based",
        arabic: "الله أكبر، اللهم أهله علينا بالأمن والإيمان، والسلامة والإسلام، والتوفيق لما تحب وترضى، ربنا وربك الله",
        translation: "Allah is the Greatest. O Allah, let this moon appear over us with security and faith, safety and Islam, and success in doing what You love and are pleased with. Our Lord and your Lord is Allah.",
        transliteration: "Allahu Akbar. Allahumma ahillahu 'alayna bil-amni wal-iman, was-salamati wal-Islam, wat-tawfiqi lima tuhibbu wa tarda. Rabbuna wa Rabbukallah.",
        source: "سنن الترمذي",
        context: "عند رؤية الهلال"
    },

    // --- السفر والأماكن ---
    {
        id: "ev_travel_1",
        category: "event-based",
        arabic: "سُبْحانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        translation: "Glory is to Him Who has subjected this to us, and we could never have it by ourselves. And surely, to our Lord we are returning.",
        transliteration: "Subhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrinin. Wa inna ila Rabbina lamunqalibun.",
        source: "سورة الزخرف",
        context: "عند السفر"
    },
    {
        id: "ev_travel_2",
        category: "event-based",
        arabic: "آيبون، تائبون، عابدون، لربنا حامدون",
        translation: "We return, repenting, worshipping, and praising our Lord.",
        transliteration: "Ayibuna, ta'ibuna, 'abiduna, li-Rabbina hamidun.",
        source: "صحيح مسلم",
        context: "عند العودة من السفر"
    },
    {
        id: "ev_new_place",
        category: "event-based",
        arabic: "اللهم رب السماوات السبع وما أظللن.. أسألك خير هذه القرية وخير أهلها وخير ما فيها، وأعوذ بك من شرها وشر أهلها وشر ما فيها",
        translation: "O Allah, Lord of the seven heavens and what they overshadow... I ask You for the good of this village, the good of its people, and the good within it. And I seek refuge in You from its evil, the evil of its people, and the evil within it.",
        transliteration: "Allahumma Rabbas-samawatis-sab'i wa ma adlallan... as'aluka khayra hadhihil-qaryati wa khayra ahliha wa khayra ma fiha, wa a'udhu bika min sharriha wa sharri ahliha wa sharri ma fiha.",
        source: "سنن النسائي",
        context: "دخول مكان جديد (قرية/مدينة/منزل)"
    },
    {
        id: "ev_stopping",
        category: "event-based",
        arabic: "أعوذ بكلمات الله التامات من شر ما خلق",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        transliteration: "A'udhu bi-kalimatillahit-tammati min sharri ma khalaq.",
        source: "صحيح مسلم",
        context: "نزول المكان (التخييم أو الوقوف المؤقت)"
    },

    // --- الفزع والأصوات ---
    {
        id: "ev_fear",
        category: "event-based",
        arabic: "أعوذ بكلمات الله التامات من غضبه وعقابه، وشر عباده، ومن همزات الشياطين وأن يحضرون",
        translation: "I seek refuge in the perfect words of Allah from His anger and punishment, the evil of His servants, and from the whisperings of the devils and their presence.",
        transliteration: "A'udhu bi-kalimatillahit-tammati min ghadabihi wa 'iqabih, wa sharri 'ibadih, wa min hamazatish-shayatini wa an yahdurun.",
        source: "سنن الترمذي",
        context: "حدوث الفزع أو الكوابيس"
    },
    {
        id: "ev_rooster",
        category: "event-based",
        arabic: "اللهم إني أسألك من فضلك",
        translation: "O Allah, I ask You from Your bounty.",
        transliteration: "Allahumma inni as'aluka min fadlik.",
        source: "صحيح البخاري",
        context: "عند سماع صياح الديك"
    },
    {
        id: "ev_donkey",
        category: "event-based",
        arabic: "أعوذ بالله من الشيطان الرجيم",
        translation: "I seek refuge in Allah from the accursed Satan.",
        transliteration: "A'udhu billahi minash-shaytanir-rajim.",
        source: "صحيح البخاري",
        context: "عند سماع نهيق الحمار"
    },

    // --- الموت والآخرة ---
    {
        id: "ev_graves",
        category: "event-based",
        arabic: "السلام عليكم أهل الديار من المؤمنين والمسلمين، وإنا إن شاء الله بكم للاحقون",
        translation: "Peace be upon you, O people of the dwellings, believers and Muslims. And we, if Allah wills, shall join you.",
        transliteration: "As-salamu 'alaykum ahlad-diyari minal-mu'minina wal-muslimin, wa inna in sha'allahu bikum la-lahiqun.",
        source: "صحيح مسلم",
        context: "زيارة القبور"
    }
];
