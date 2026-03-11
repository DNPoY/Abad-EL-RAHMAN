import { describe, it, expect } from "vitest";
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from "adhan";

describe("Prayer Times Accuracy Verification (Next 150 Years)", () => {
    const locations = [
       { name: "Cairo, Egypt", coords: new Coordinates(30.0444, 31.2357) },
       { name: "Mecca, Saudi Arabia", coords: new Coordinates(21.4225, 39.8262) },
       { name: "London, UK (High Latitude)", coords: new Coordinates(51.5074, -0.1278) },
       { name: "Oslo, Norway (Very High Latitude)", coords: new Coordinates(59.9139, 10.7522) },
       { name: "Jakarta, Indonesia (Equator)", coords: new Coordinates(-6.2088, 106.8456) },
       { name: "Sydney, Australia (Southern Hemisphere)", coords: new Coordinates(-33.8688, 151.2093) },
    ];

    const testYears = [2026, 2030, 2050, 2100, 2125, 2150, 2176];
    const testMonths = [0, 5, 11]; // January, June, December
    const testDays = [1, 15, 28];

    locations.forEach(location => {
        describe(`Location: ${location.name}`, () => {
            testYears.forEach(year => {
                testMonths.forEach(month => {
                    testDays.forEach(day => {
                        it(`should calculate valid prayer times for ${year}-${month + 1}-${day}`, () => {
                            const date = new Date(year, month, day);
                            const params = CalculationMethod.MuslimWorldLeague();
                            params.madhab = Madhab.Shafi;

                            const prayers = new PrayerTimes(location.coords, date, params);

                            const times = [
                                { name: "Fajr", time: prayers.fajr },
                                { name: "Sunrise", time: prayers.sunrise },
                                { name: "Dhuhr", time: prayers.dhuhr },
                                { name: "Asr", time: prayers.asr },
                                { name: "Maghrib", time: prayers.maghrib },
                                { name: "Isha", time: prayers.isha },
                            ];

                            // 1. Check for valid dates (not NaN)
                            times.forEach(p => {
                                expect(p.time instanceof Date, `${p.name} should be a Date object in ${year}`).toBe(true);
                                expect(isNaN(p.time.getTime()), `${p.name} should not be NaN in ${year}`).toBe(false);
                            });

                            // 2. Check Logical Sequence
                            // Fajr < Sunrise < Dhuhr < Asr < Maghrib < Isha
                            expect(prayers.fajr.getTime()).toBeLessThan(prayers.sunrise.getTime());
                            expect(prayers.sunrise.getTime()).toBeLessThan(prayers.dhuhr.getTime());
                            expect(prayers.dhuhr.getTime()).toBeLessThan(prayers.asr.getTime());
                            expect(prayers.asr.getTime()).toBeLessThan(prayers.maghrib.getTime());
                            expect(prayers.maghrib.getTime()).toBeLessThan(prayers.isha.getTime());
                            
                            // Note: Year check is skipped because it's timezone-sensitive 
                            // (Fajr on Jan 1st in Tokyo might be Dec 31st in New York).
                        });
                    });
                });
            });
        });
    });

    it("should handle Leap Year 2176 correctly", () => {
        const location = locations[0]; // Cairo
        const date = new Date(2176, 1, 29); // Feb 29, 2176
        const params = CalculationMethod.MuslimWorldLeague();
        const prayers = new PrayerTimes(location.coords, date, params);

        expect(prayers.fajr.getMonth()).toBe(1); // February
        expect(prayers.fajr.getDate()).toBe(29);
        expect(isNaN(prayers.fajr.getTime())).toBe(false);
    });

    it("should handle Year 2100 (Non-Leap Year) correctly", () => {
        const location = locations[0]; // Cairo
        const date = new Date(2100, 2, 1); // March 1, 2100
        const params = CalculationMethod.MuslimWorldLeague();
        const prayers = new PrayerTimes(location.coords, date, params);

        expect(prayers.fajr.getMonth()).toBe(2); // March
        expect(prayers.fajr.getDate()).toBe(1);
        expect(isNaN(prayers.fajr.getTime())).toBe(false);
        
        // Feb 29 2100 should roll over to March 1
        const feb29 = new Date(2100, 1, 29);
        expect(feb29.getDate()).toBe(1);
        expect(feb29.getMonth()).toBe(2);
    });
});
