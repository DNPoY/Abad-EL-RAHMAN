export interface CityData {
    id: string;
    names: {
        ar: string;
        en: string;
    };
    country: {
        ar: string;
        en: string;
    };
    lat: number;
    lng: number;
    method: number; // Calculation Method ID from constants.ts
}

export const MAJOR_CITIES: CityData[] = [
    {
        id: "makkah",
        names: { ar: "مكة المكرمة", en: "Makkah" },
        country: { ar: "السعودية", en: "Saudi Arabia" },
        lat: 21.3891,
        lng: 39.8579,
        method: 4 // Umm Al-Qura
    },
    {
        id: "madinah",
        names: { ar: "المدينة المنورة", en: "Madinah" },
        country: { ar: "السعودية", en: "Saudi Arabia" },
        lat: 24.4672,
        lng: 39.6024,
        method: 4
    },
    {
        id: "cairo",
        names: { ar: "القاهرة", en: "Cairo" },
        country: { ar: "مصر", en: "Egypt" },
        lat: 30.0444,
        lng: 31.2357,
        method: 5 // Egyptian
    },
    {
        id: "alexandria",
        names: { ar: "الإسكندرية", en: "Alexandria" },
        country: { ar: "مصر", en: "Egypt" },
        lat: 31.2001,
        lng: 29.9187,
        method: 5
    },
    {
        id: "dubai",
        names: { ar: "دبي", en: "Dubai" },
        country: { ar: "الإمارات", en: "UAE" },
        lat: 25.2048,
        lng: 55.2708,
        method: 8 // Gulf Region
    },
    {
        id: "abu-dhabi",
        names: { ar: "أبو ظبي", en: "Abu Dhabi" },
        country: { ar: "الإمارات", en: "UAE" },
        lat: 24.4539,
        lng: 54.3773,
        method: 8
    },
    {
        id: "istanbul",
        names: { ar: "إسطنبول", en: "Istanbul" },
        country: { ar: "تركيا", en: "Turkey" },
        lat: 41.0082,
        lng: 28.9784,
        method: 13 // Diyanet
    },
    {
        id: "casablanca",
        names: { ar: "الدار البيضاء", en: "Casablanca" },
        country: { ar: "المغرب", en: "Morocco" },
        lat: 33.5731,
        lng: -7.5898,
        method: 3 // Muslim World League
    },
    {
        id: "karachi",
        names: { ar: "كراتشي", en: "Karachi" },
        country: { ar: "باكستان", en: "Pakistan" },
        lat: 24.8607,
        lng: 67.0011,
        method: 1 // Karachi
    },
    {
        id: "jakarta",
        names: { ar: "جاكرتا", en: "Jakarta" },
        country: { ar: "إندونيسيا", en: "Indonesia" },
        lat: -6.2088,
        lng: 106.8456,
        method: 3
    },
    {
        id: "london",
        names: { ar: "لندن", en: "London" },
        country: { ar: "المملكة المتحدة", en: "UK" },
        lat: 51.5074,
        lng: -0.1278,
        method: 2 // ISNA
    },
    {
        id: "new-york",
        names: { ar: "نيويورك", en: "New York" },
        country: { ar: "الولايات المتحدة", en: "USA" },
        lat: 40.7128,
        lng: -74.0060,
        method: 2
    }
];
